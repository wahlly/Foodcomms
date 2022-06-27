const addToCartValidation = {
      productId: {
            notEmpty: true,
            errorMessage: "ProductId is required"
      },
      userId: {
            notEmpty: true,
            errorMessage: "UserId is required"
      },
      quantity: {
            notEmpty: true,
            errorMessage: "Quantity is required"
      }
}

const cartCheckout = {
      userId: {
            notEmpty: true,
            errorMessage: "UserId is required"
      },
      orderId: {
            notEmpty: true,
            errorMessage: "OrderId is required"
      }
}

module.exports = { addToCartValidation, cartCheckout };