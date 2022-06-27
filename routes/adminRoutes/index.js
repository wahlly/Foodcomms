const router = require("express").Router()
const { validate } = require("../../validations/validate");
const { tokenVerifier } = require("../../utils")
const { checkSchema } = require('express-validator');

const { productValidation } = require("../../validations/productsValidations/product");

const { createProductListingController } = require("../../controllers/productController");
const { getTransactionByParamController } = require("../../controllers/cartController");


router.post("/products/create", tokenVerifier, validate(checkSchema(productValidation)), createProductListingController)
router.get("/:userId/transactions", tokenVerifier, getTransactionByParamController)


module.exports = router;