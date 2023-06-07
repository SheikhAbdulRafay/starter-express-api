const crypto = require("crypto");
const {crypto:{algorithm,ivSeed,secretKey}}=require("../conf/config")
var aesjs = require("aes-js")
var encrypt = function encrypt(clearText) {
  try {
    var key = new Buffer.from(secretKey, "utf8");
    var iv = new Buffer.from(ivSeed, "utf8");
    var encrypter = crypto.createCipheriv(algorithm, key, iv);
    encrypter.setAutoPadding(true);
    var encrypted = [];
    encrypted = encrypter.update(clearText);
    encrypted += encrypter.final().toString("base64");
    return encrypted;
  } catch (exp) {
    console.log(exp);
  }
};

var decrypt = function decrypt(cipherText) {
  try {
    var key = new Buffer.from(secretKey, "utf8");
    var iv = new Buffer.from(ivSeed, "utf8");
    var decrypter = crypto.createDecipheriv(algorithm, key, iv);
    decrypter.setAutoPadding(true);
    var clearText =
      decrypter.update(cipherText, "base64") + decrypter.final("utf8");
    return clearText;
  } catch (exp) {
    console.log(exp);
  }
};
const easyPayEncrypt = (sampleString, hashKey) => {
  const keyBuffer = aesjs.utils.utf8.toBytes(hashKey);
  const inputBuffer = aesjs.padding.pkcs7.pad(
    aesjs.utils.utf8.toBytes(sampleString)
  );
  const escEcb = new aesjs.ModeOfOperation.ecb(keyBuffer);
  const encryptedBytes = escEcb.encrypt(inputBuffer);
  const encryptedData = Buffer.from(encryptedBytes).toString("base64");
  return encryptedData;
};
const decryptWithKey = (cipherText, secretKey) => {
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
    return false;
  }
};
const encryptWithKey = (clearText,secretKey) => {
  try {
    const key = Buffer.from(secretKey, "utf8");
    const iv = Buffer.from(ivSeed, "utf8");
    const encrypter = crypto.createCipheriv(algorithm, key, iv);
    encrypter.setAutoPadding(true);
    let encrypted = [];
    encrypted = encrypter.update(clearText, "utf8", "base64");
    encrypted += encrypter.final("base64");
    return encrypted;
  } catch (exp) {
    console.log(exp);
  }
};
module.exports = {
  decrypt: decrypt,
  encrypt: encrypt,
  easyPayEncrypt,
  decryptWithKey,
  encryptWithKey
};
