'use strict';
const crypto = require('crypto');

const getHash = (username, seconds) => {
  const stringToHash = username + seconds;
  const hash = crypto.createHash('md5').update(stringToHash).digest('hex');

  return hash
}

const getBuffer = (val, start, end) => {

  return new Buffer.from(val.substring(start, end), 'utf-8');
}

module.exports.encryptMessage = (username, submittedAt, message) => {
  const hash = getHash(username, submittedAt);
  const iv = getBuffer(hash, 0, 16);
  const key = getBuffer(hash, 0);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return [encrypted, key, iv, cipher.getAuthTag().toString("base64")]
}

module.exports.decryptMessage = (encrypted, key, iv, authTag64) => {
  const authTag = Buffer.from(authTag64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'base64', 'utf8');

  decrypted += decipher.final('utf8');
  
  return decrypted;
}