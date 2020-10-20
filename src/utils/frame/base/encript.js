import CryptoJS from 'crypto-js'

// BASE64
const base64 = {
  en: (data) => CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data)),
  de: (data) => CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
}
/**
 * SHA256
 */
export function sha256 (data) {
  return CryptoJS.SHA256(data).toString()
}
/**
 * MD5
 */
export function md5 (data) {
  return CryptoJS.MD5(data).toString()
}

export function encriptPwd(pwd) {
  return base64.en(md5(pwd))
}

export function md5Two(passwd) {
  return md5(sha256(passwd))
}
/**
* 签名
* @param token 身份令牌
* @param timestamp 签名时间戳
* @param data 签名数据
*/
export function sign (token, timestamp, data) {
  // 签名格式： timestamp + token + data
  let signsrc = ''
  if (data) {
    signsrc = timestamp + token + JSON.stringify(data)
  } else {
    signsrc = timestamp + token
  }
  return md5(signsrc)
}

