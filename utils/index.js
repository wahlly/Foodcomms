const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const messageHandler = (message, success, statusCode, data) => {
      return (response = { message, success, statusCode, data });
};

const tokenHandler = (data, userType) => {
      var { _id } = data;
      var token = jwt.sign({ userId: _id, userType }, process.env.SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRE_IN,
      });
      return { token, userId: _id };
};

const tokenVerifier = (req, res, next) => {
      try {
        if (req.get("Authorization") !== undefined) {
          const token = req.get("Authorization").replace("Bearer ", "");
          jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
              return res.status(401).json({ result: "Unauthorized, Session Expired", status: 401 });
            } else {
              let userId;
              if (req.method === "POST") {
                userId = req.body.hasOwnProperty("userId") 
                  ? req.body.userId
                  : "";
              } else if (req.method === "GET") {
                userId = req.params.hasOwnProperty("userId")
                  ? req.params.userId
                  : req.query.userId;
              } else if (req.method === "PUT") {
                userId = req.body.hasOwnProperty("userId")
                  ? req.body.userId
                  : req.params.userId;
              } else if (req.method === "DELETE") {
                userId = req.params.hasOwnProperty("userId")
                  ? req.params.userId
                  : req.query.userId;
              }
              if (userId === decoded.userId) {
                req.payload = decoded;
                next();
              } else {
                return res.status(401).json({ result: "Unauthorized, Access Denied", status: 401 });
              }
            }
          });
        } else {
          return res.status(401).json({ result: "Unauthorized, Access Denied", status: 401 });
        }
      } catch {
        return res.status(401).json({ result: "Unauthorized, Access Denied", status: 401 });
      }
};

const AlphaNumeric = (length, type = "alpha") => {
      var result = "";
      var characters =
        type === "alpha"
          ? "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789"
          : "123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
};

const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password, dbpassword) => {
      return await bcrypt.compare(password, dbpassword);
};

module.exports = { messageHandler, tokenHandler, tokenVerifier, AlphaNumeric, hashPassword, verifyPassword };