require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/irrigation',
  PORT: process.env.PORT || 5000,
  BLYNK_AUTH_TOKEN: process.env.BLYNK_AUTH_TOKEN,
  BLYNK_SERVER: process.env.BLYNK_SERVER || 'blynk.cloud'
};