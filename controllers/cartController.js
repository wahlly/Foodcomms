const { addItemToCartService } = require("../services/cartService");

module.exports.addItemToCartController = async (req, res) => {
      try {
            const cart = await addItemToCartService(req.body);

            res.status(cart.statusCode).json({ cart });
      } catch (error) {
            res.status(500).json({ message: "Something went wrong...", success: false, data: error });
      }
}