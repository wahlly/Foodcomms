const { SUCCESS, NOT_FOUND, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = require("../constants");
const { sendMailNotification } = require("../modules/email");
const { User, OTP } = require("../schema/userSchema");
const { tokenHandler, messageHandler, hashPassword, AlphaNumeric, verifyPassword } = require("../utils");


const userRegistrationService = async (payload) => {
      const otp = AlphaNumeric(6);
      let user = new User(payload);
      user.password = await hashPassword(user.password);
      user.otp = otp;
      user = await user.save();
      user.password = undefined;

      const substitutional_parameters = { name: user.name, otp }
      await sendMailNotification(user.email, "Email Verification", substitutional_parameters, "VERIFY_OTP");
      return messageHandler("User Registered Successfully", true, SUCCESS, user);
}

const verifyEmailService = async (payload) => {
      const user = await User.findOne({ email: payload.email });

      if(user === null) {
            return messageHandler("Invalid user", false, NOT_FOUND, {});
      }
      if(user.otp === payload.otp) {
            if(user.verified) {
                  return messageHandler("User already verified", false, BAD_REQUEST, {});
            }

            const updateUser = await User.updateOne({ email: payload.email }, { $set: { verified: true }})

            if(updateUser.modifiedCount === 0) {
                  return messageHandler("Unable to complete request", false, BAD_REQUEST, {});
            }

            user.verified = true;
            return messageHandler("User verified successfully", true, SUCCESS, user);
      }

      return messageHandler("Invalid OTP", false, BAD_REQUEST, {});
}

const userLoginService = async (payload) => {
      const { email, password } = payload;
      const user = await User.findOne({ email }).select("+password");

      if(user === null) {
            return messageHandler("Invalid user", false, NOT_FOUND, {});
      }
      if(!user.verified) {
            return messageHandler("User is not verified", false, FORBIDDEN, {});
      }

      const isValid = await verifyPassword(password, user.password);
      if(isValid) {
            const token = tokenHandler(user);
            return messageHandler("User logged in successfully", true, SUCCESS, token);
      }

      return messageHandler("Invalid Email or password", false, UNAUTHORIZED, {});
}

const passwordResetRequestService = async (payload) => {
      const user = await User.findOne({ email: payload.email });

      if(user === null) {
            return messageHandler("Invalid user", false, NOT_FOUND, {});
      }
      if(!user.verified) {
            return messageHandler("User is not verified", false, FORBIDDEN, {});
      }

      const otp = AlphaNumeric(8);
      const date = new Date();
      const expiresAt = date.setMinutes(date.getMinutes() + 30);
      await OTP.create({ userId: user._id, otp, expiresAt });

      const substitutional_parameters = { otp }
      await sendMailNotification(user.email, "Password Reset Request", substitutional_parameters, "PASSWORD_RESET");
      return messageHandler("Password reset request sent successfully", true, SUCCESS, { userId: user._id });
}

const resetPasswordService = async (payload) => {
      const token = await OTP.findOne({ $and: [{ userId: payload.userId }, { otp: payload.otp }] });

      if(token === null) {
            return messageHandler("Invalid token", false, NOT_FOUND, {});
      }

      const currentDate = new Date();
      if(currentDate > token.expiresAt){
            return messageHandler("Token expired", false, BAD_REQUEST, {});
      }

      const newPassword = await hashPassword(payload.newPassword);
      const user = await User.updateOne({ _id: payload.userId }, { $set: { password: newPassword }});

      if(user.modifiedCount > 0) {
            await OTP.deleteOne({ userId: payload.userId });
            return messageHandler("Password reset successful", true, SUCCESS, {});
      }

      return messageHandler("Unable to complete request", false, BAD_REQUEST, {});
}

const fundWalletService = async ({payload, params}) => {
      const user = await User.findOne({ _id: params.userId });

      if(user === null) {
            return messageHandler("Invalid user", false, NOT_FOUND, {});
      }
      if(!user.verified) {
            return messageHandler("User is not verified", false, FORBIDDEN, {});
      }

      const updatedUser = await User.updateOne({ _id: params.userId }, { $inc: { wallet: payload.amount }});

      user.wallet = user.wallet + payload.amount;
      if(updatedUser.modifiedCount > 0) {
            return messageHandler("Funds added to wallet", true, SUCCESS, user);
      }

      return messageHandler("Unable to complete request", false, BAD_REQUEST, {});
}

module.exports = { userRegistrationService, verifyEmailService, userLoginService, passwordResetRequestService,
      resetPasswordService, fundWalletService };