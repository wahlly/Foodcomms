const { createProductListingService } = require("../services/productService");

module.exports.createProductListingController = async (req, res) => {
      try {
            const product = await createProductListingService(req.body);

            res.status(product.statusCode).json({ product })
      } catch (error) {
            res.status(500).json({ message: "Something went wrong...", success: false, data: error })
      }
}