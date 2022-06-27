const { Cart } = require("../schema/cartSchema");
const { Product } = require("../schema/productSchema");
const { SUCCESS, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = require("../constants");
const { sendMailNotification } = require("../modules/email");
const { User, OTP } = require("../schema/userSchema");
const { tokenHandler, messageHandler, hashPassword, AlphaNumeric, verifyPassword } = require("../utils");


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

      const updatedCart = await Cart.updateOne({ _id: cart._id }, { $push: { items: item }, $inc: { total: amountToPay } }, { new: true });

      if(updatedCart.modifiedCount === 0) {
            return messageHandler("Unable to complete request", false, BAD_REQUEST, {});
      }

      return messageHandler("Item added to cart successfully", true, SUCCESS, updatedCart);
}

const getCartByParamService = async (query) => {
      const carts = await Cart.find({ ...query });
      return messageHandler("Carts fetched successfully", true, SUCCESS, carts);
}

module.exports = { addItemToCartService, getCartByParamService };