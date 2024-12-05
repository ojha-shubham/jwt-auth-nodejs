const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('./config');


const generateToken = (user) => {
  const payload = {
    username: user.username
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
