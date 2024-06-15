const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const generateToken = (userid) => {
  try {
    const token = jwt.sign({ id: userid }, secretKey, { expiresIn: "24h" });
    return token;
  } catch (error) {
    console.log(error);
  }
};
module.exports = generateToken;
