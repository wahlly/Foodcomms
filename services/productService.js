const { Product } = require("../schema/productSchema");
const { SUCCESS, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = require("../constants");
const { sendMailNotification } = require("../modules/email");
const { User, OTP } = require("../schema/userSchema");
const { tokenHandler, messageHandler, hashPassword, AlphaNumeric, verifyPassword } = require("../utils");

const createProductListingService = async (payload) => {
      const product = new Product(payload);
      product.save();
      return messageHandler("Product created successfully", true, SUCCESS, product);
}

const getProductsByParamService = async (query) => {
      const products = await Product.find({ ...query });
      return messageHandler("Products fetched successfully", true, SUCCESS, products);
}

module.exports = { createProductListingService, getProductsByParamService };