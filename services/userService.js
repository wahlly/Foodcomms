const { User } = require("../schema/userSchema");
const { tokenHandler, messageHandler } = require("../utils");


const userRegistrationService = async (payload) => {
      let user = new User(payload);
      user = await user.save();
      const token = tokenHandler(user, "User");
      return messageHandler("User Registered Successfully", true, 200, token);
}