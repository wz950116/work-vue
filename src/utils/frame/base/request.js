import axios from 'axios'
import Vue from 'vue'
import { Notification, Message } from 'element-ui'
import store from '../../../store'
import { getToken, setToken, setMd5, getMd5 } from '@/utils/frame/base/auth'
import { sign } from '@/utils/frame/base/encript.js'

import { getRandom, rsaEncrypt, aesEncrypt, aesDecrypt } from '@/utils/frame/base/crypto'

import storage from '@/utils/frame/base/localStorage'
import session from '@/utils/frame/base/sessionStorage'
import { notifyError } from '@/utils/frame/base/notifyParams'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000 // 请求超时时间
})
service.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 生产随机密码 使用AES-128-EBC加密模式，需要为16位
const random = getRandom(8)
// request拦截器
service.interceptors.request.use(
  config => {
    // 获取token

    if (store.getters.token || getToken()) {
      config.headers.Authorization = 'bearer ' + (getToken() ? getToken() : store.getters.token)
    }
    config.headers['lang'] = storage.get('language') || 'zh'
    config.headers['module'] = session.get('auditModule') || ''
    config.headers['bizModule'] = session.get('bpmModule') || ''
    config.headers['bizCode'] = session.get('bizCode') || ''

    if (process.env.SIGN_ENABLE) {
      // 签名+时间戳
      const timestamp = new Date().getTime()
      const signstr = sign(store.getters.md5 || getMd5(), timestamp, config.data)
      config.headers['sign'] = signstr
      config.headers['timestamp'] = timestamp
    }

    // 必须进行加密处理
    if (process.env.ENCRYPT_ENABLE) {
      // 密码RSA加密
      if (config.data) {
        config.headers['secret'] = rsaEncrypt(process.env.RSA_PUB_KEY, random)
        config.data = aesEncrypt(JSON.stringify(config.data), random)
      }
    } else if (config.data && config.data.isEncrypt) {
      // 个别加密
      config.headers['secret'] = rsaEncrypt(process.env.RSA_PUB_KEY, random)
      config.data = aesEncrypt(JSON.stringify(config.data), random)
    }

    return config
  },
  error => {
    Promise.reject(error)
  }
)

let errorCount = 0
// respone拦截器
service.interceptors.response.use(
  response => {
    // 判断一下响应中是否有 token，如果有就直接使用此 token 替换掉本地的 token。你可以根据你的业务需求自己编写更新 token 的逻辑
    const authToken = response.headers.auth_token
    const md5AuthToken = response.headers.md5_auth_token
    const licVerify = response.headers.lic_verify
    if (authToken && md5AuthToken) {
      // 刷新指令
      setToken(authToken)
      setMd5(md5AuthToken)
      store.commit('SET_TOKEN', { accessToken: authToken, md5Token: md5AuthToken })
    }
    if (licVerify && (!session.get('licVerify'))) {
      session.set('licVerify', licVerify)
      Message({
        message: '使用期限快过期，请尽快延长注册.',
        type: 'warning',
        showClose: true
      })
    }

    /**
     * code为非200是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.status) {
      // 是否进行解密处理
      if (res.encryptData && random) {
        const decryptData = aesDecrypt(res.encryptData, random)
        res.data = JSON.parse(decryptData)
      }
      return res
    } else {
      // 确认信息不处理
      if (res.confirmFlg) {
        return res
      }
      if (res.msgId) {
        // 错误相同，不重复报错
        if (res.msgId === session.get('errorMsgId')) {
          return Promise.reject('error')
        } else {
          session.set('errorMsgId', res.msgId)
          setTimeout(() => {
            // 重置
            session.set('errorMsgId', '')
          }, 3000)
        }
      }

      // 用户账户重复登陆
      // 刷新指令失败
      if (res.msgId === 'EAUT0010' || res.msgId === 'EAUT0007') {
        Notification(
          notifyError({
            msg: res.msgText
          })
        )
      } else if (
        // TOKEN验证不通过
        res.msgId === 'EAUT0003' ||
        // 用户权限验证失败过期
        res.msgId === 'EAUT0004'
      ) {
        // Token失效临时刷新Token保留页面
        if ($('#relogin-dialog').length) {
          if ($('#relogin-dialog').is(':hidden')) {
            $('#relogin-dialog').show()
          }
        }
      } else {
        Notification(
          notifyError({
            msg: res.msgText || res.msgId
          })
        )
      }
      return Promise.reject('error')
    }
  },
  err => {
    // 这里是返回状态码不为200时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = `接口地址请求错误: ${err.response.config.url}`
          break
        case 401:
          err.message = `接口地址未授权，请登录: ${err.response.config.url}`
          break
        case 403:
          err.message = `接口地址拒绝访问: ${err.response.config.url}`
          break
        case 404:
          err.message = `接口地址不存在: ${err.response.config.url}`
          break
        default:
          err.message = '接口服务器错误'
      }
    }

    errorCount++
    // 3000ms内只抛出一个错误
    if (errorCount < 2) {
      setTimeout(() => {
        // 重置计数
        errorCount = 0
      }, 3000)
      Notification(
        notifyError({
          msg: err.message
        })
      )
      return Promise.reject(err)
    }
  }
)
Vue.prototype.$http = service
export default service
