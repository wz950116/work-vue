import CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt' // aes加密
// 默认的 KEY 必须为16
const KEY = CryptoJS.enc.Utf8.parse('1234567890123456')
/**
 * AES加密 ：字符串 key   返回base64
 */
export function aesEncrypt(word, keyStr) {
  let key = KEY

  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)
  }

  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)
}
/**
 * AES 解密 ：字符串 key   返回base64
 *
 */
export function aesDecrypt(word, keyStr) {
  let key = KEY
  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr)
  }

  const base64 = CryptoJS.enc.Base64.parse(word)
  const src = CryptoJS.enc.Base64.stringify(base64)

  const decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  })

  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
/**
 * RSA公钥加密
 * @param {*} pupblicKey
 * @param {*} data
 */
export function rsaEncrypt(pupblicKey, data) {
  const jse = new JSEncrypt()
  jse.setPublicKey(pupblicKey)
  return jse.encrypt(data)
}

/**
 * 获取随机数
 * @param {*} length
 */
export function getRandom(length) {
  return CryptoJS.lib.WordArray.random(length).toString()
}

