const productValidation = {
      name: {
            notEmpty: true,
            errorMessage: "Name is required"
      },
      price: {
            notEmpty: true,
            errorMessage: "Price is required"
      },
      initialQuantity: {
            notEmpty: true,
            errorMessage: "Initial Quantity is required"
      }
}

module.exports = { productValidation };