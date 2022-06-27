const router = require("express").Router()
const { validate } = require("../../validations/validate");
const { tokenVerifier } = require("../../utils")
const { checkSchema } = require('express-validator');

const { productValidation } = require("../../validations/productsValidations/product");

const { createProductListingController } = require("../../controllers/productController");


router.post("/products/create", tokenVerifier, validate(checkSchema(productValidation)), createProductListingController)


module.exports = router;