const { Product } = require("../schema/productSchema");
const { SUCCESS } = require("../constants");
const { messageHandler } = require("../utils");

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