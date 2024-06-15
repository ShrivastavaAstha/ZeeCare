const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const verifyToken = (token) => {
  try {
    const result = jwt.verify(token, secretKey);
    return result;
  } catch (error) {
    console.log(error);
  }
};
module.exports = verifyToken;
