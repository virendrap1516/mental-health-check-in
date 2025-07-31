const CryptoJS = require('crypto-js');

const encryptData = (text) => {
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedText) => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, process.env.ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encryptData, decryptData };