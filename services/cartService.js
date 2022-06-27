const { Cart } = require("../schema/cartSchema");
const { Product } = require("../schema/productSchema");
const { SUCCESS, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = require("../constants");
const { sendMailNotification } = require("../modules/email");
const { User, OTP } = require("../schema/userSchema");
const { tokenHandler, messageHandler, hashPassword, AlphaNumeric, verifyPassword } = require("../utils");
const { Transaction } = require("../schema/transactionSchema");


const addItemToCartService = async (payload) => {
      const product = await Product.findOne({ _id: payload.productId });
      if(product === null) {
            return messageHandler("Invalid product", false, NOT_FOUND, {});
      }

      const amountToPay = product.price * payload.quantity;
      const item = {
            productId: payload.productId,
            quantity: payload.quantity,
            amount: amountToPay
      }

      const cart = await Cart.findOne({ $and: [{ userId: payload.userId }, { status: 'pending' }] });

      if(cart === null) {
            const orderId = AlphaNumeric(10);
            const newCart = new Cart({ userId: payload.userId, orderId });

            newCart.items.push(item);
            newCart.total = amountToPay;
            await newCart.save();

            return messageHandler("Item added to cart successfully", true, SUCCESS, newCart);
      }

      const updatedCart = await Cart.updateOne({ _id: cart._id }, { $push: { items: item }, $inc: { total: amountToPay } });

      if(updatedCart.modifiedCount === 0) {
            return messageHandler("Unable to complete request", false, BAD_REQUEST, {});
      }

      return messageHandler("Item added to cart successfully", true, SUCCESS, updatedCart);
}

const getCartByParamService = async (query) => {
      const carts = await Cart.find({ ...query });
      return messageHandler("Carts fetched successfully", true, SUCCESS, carts);
}

const checkoutCartService = async (payload) => {
      const cart = await Cart.findOne({ orderId: payload.orderId });
      const user = await User.findOne({ _id: cart.userId });
      if(cart === null) {
            return messageHandler("Invalid cart", false, NOT_FOUND, {});
      }

      if(cart.status !== 'pending') {
            return messageHandler("Cart has already been settled", false, BAD_REQUEST, {});
      }

      if(user.wallet < cart.total) {
            return messageHandler("Insufficient balance in wallet, recharge your wallet to continue", false, BAD_REQUEST, {});
      }

      const items = cart.items;
      for(let i = 0; i < items.length; i++) {
            const product = await Product.findOne({ _id: items[i].productId });
            if(product.soldQuantity === product.initialQuantity) {
                  return messageHandler(`${product.name} is out of stock`, false, BAD_REQUEST, {});
            }

            await Product.updateOne({ _id: product._id }, { $inc: { soldQuantity: items[i].quantity } });
      }

      const updatedCart = await Cart.updateOne({ _id: cart._id }, { $set: { status: 'completed' } });

      if(updatedCart.modifiedCount === 0) {
            return messageHandler("Unable to complete request", false, BAD_REQUEST, {});
      }

      await User.updateOne({ _id: user._id }, { $inc: { wallet: -cart.total } });
      const data = { cartId: cart._id, orderId: cart.orderId, userId: cart.userId, amountPaid: cart.total };
      await Transaction.create(data)

      return messageHandler("Cart has been successfully checked out, transaction completed", true, SUCCESS, { orderId: cart.orderId, totalAmountPaid: cart.total });

}

module.exports = { addItemToCartService, getCartByParamService, checkoutCartService };