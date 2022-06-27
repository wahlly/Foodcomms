const { userRegistrationService, verifyEmailService, userLoginService, passwordResetRequestService,
      resetPasswordService, fundWalletService } = require("../services/userService");

module.exports.userRegistrationController = async (req, res) => {
      try {
            const user = await userRegistrationService(req.body);

            res.status(user.statusCode).json({ user })
      } catch (error) {
            res.status(500).json({ message: "Something went wrong...", success: false, data: error })
      }
}

module.exports.verifyEmailController = async (req, res) => {
      try {
            const user = await verifyEmailService(req.body);

            res.status(user.statusCode).json({ user })
      } catch(error) {
            res.status(500).json({ message: "Something went wrong...", success: false, data: error })
      }
}

module.exports.userLoginController = async (req, res) => {
      try {
            const user = await userLoginService(req.body);

            res.status(user.statusCode).json({ user })
      } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Something went wrong...", success: false, data: error })
      }
}

module.exports.passwordResetRequestController = async (req, res) => {
      try{
            const user = await passwordResetRequestService(req.body);

            res.status(user.statusCode).json({ user })
      } catch(error) {
            res.status(500).json({ message: "Something went wrong...", success: false, data: error })
      }
}

module.exports.resetPasswordController = async (req, res) => {
      try{
            const user = await resetPasswordService(req.body);

            res.status(user.statusCode).json({ user })
      } catch(error) {
            console.log(error)
            res.status(500).json({ message: "Something went wrong...", success: false, data: error })
      }
}

module.exports.fundWalletController = async (req, res) => {
      try{
            const user = await fundWalletService({payload: req.body, params: req.params});

            res.status(user.statusCode).json({ user })
      } catch(error) {
            res.status(500).json({ message: "Something went wrong...", success: false, data: error })
      }
}