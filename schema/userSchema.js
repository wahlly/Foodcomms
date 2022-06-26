const { Schema, model } = require('mongoose');

const userSchema = new Schema({
      name: {
            type: String,
            required: true
      },
      email: {
            type: String,
            required: true
      },
      password: {
            type: String,
            required: true,
            select: false
      },
      otp: {
            type: String,
            default: ""
      },
      verified: {
            type: Boolean,
            default: false
      }
}, { timestamps: true });

const User = model('User', userSchema, 'users');

module.exports = { User };