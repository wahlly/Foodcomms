const { userRegistrationService, verifyEmailService, userLoginService } = require("../services/userService");

module.exports.userRegistrationController = async (req, res) => {
      try {
            const user = await userRegistrationService(req.body);

            res.status(user.statusCode).json({ user })
      } catch (error) {
            console.log(error)
            res.status(500).json(error)
      }
}

module.exports.verifyEmailController = async (req, res) => {
      try {
            const user = await verifyEmailService(req.body);

            res.status(user.statusCode).json({ user })
      } catch(error) {
            res.status(500).json({ error })
      }
}

module.exports.userLoginController = async (req, res) => {
      try {
            const user = await userLoginService(req.body);

            res.status(user.statusCode).json({ user })
      } catch (error) {
            console.log(error)
            res.status(500).json({ error })
      }
}