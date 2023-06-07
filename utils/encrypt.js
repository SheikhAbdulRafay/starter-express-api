const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const secretKey = "7B24432646214A404D635166546A576A";
const ivSeed = "fedcba9876543210";
const encrypt = function encrypt(clearText) {
  try {
    const key = Buffer.from(secretKey, "utf8");
    const iv = Buffer.from(ivSeed, "utf8");
    const encrypter = crypto.createCipheriv(algorithm, key, iv);
    encrypter.setAutoPadding(true);
    let encrypted = [];
    encrypted = encrypter.update(clearText);
    encrypted += encrypter.final().toString("base64");
    return encrypted;
  } catch (exp) {
    console.log(exp);
    return;
  }
};

const decrypt = function decrypt(cipherText) {
  try {
    const key = Buffer.from(secretKey, "utf8");
    const iv = Buffer.from(ivSeed, "utf8");
    const decrypter = crypto.createDecipheriv(algorithm, key, iv);
    decrypter.setAutoPadding(true);
    const clearText =
      decrypter.update(cipherText, "base64") + decrypter.final("utf8");
    return clearText;
  } catch (exp) {
    console.log(exp);
    return;
  }
};

module.exports = {
  decrypt: decrypt,
  encrypt: encrypt,
};
// console.log(decrypt("7DSgim+ZV7GnbFOiTWoRuw=="));
