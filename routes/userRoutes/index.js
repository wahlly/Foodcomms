const router = require("express").Router()
const { validate } = require("../../validations/validate");
const { tokenVerifier } = require("../../utils")
const { checkSchema } = require('express-validator');

const { userRegistration, validateEmail, userLogin } = require("../../validations/userValidations/user");

const { userRegistrationController, verifyEmailController, userLoginController } = require("../../controllers/userController");

router.post("/register", validate(checkSchema(userRegistration)), userRegistrationController)
router.post("/verify-email", validate(checkSchema(validateEmail)), verifyEmailController)
router.post("/login", validate(checkSchema(userLogin)), userLoginController)

module.exports = router