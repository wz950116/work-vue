import session from '@/utils/frame/base/sessionStorage'

const tokenPrefix = process.env.TOKEN_PREFIX || ''
const TokenKey = tokenPrefix + 'user-key'

const Md5Key = tokenPrefix + 'md5-key'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function getMd5() {
  return sessionStorage.getItem(Md5Key)
}

export function isExpired() {
  return false
}
export function setMd5(md5) {
  return sessionStorage.setItem(Md5Key, md5)
}

export function removeMd5() {
  return sessionStorage.removeItem(Md5Key)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return sessionStorage.removeItem(TokenKey)
}

export function getLoginUrl() {
  const loginType = session.get('loginType')
  const tenantHashCode = session.get('tenantHashCode')

  if (loginType === 'plat') {
    return '/platform/login'
  } else if (loginType === 'group') {
    return '/group/login'
  } else {
    if (tenantHashCode) {
      return '/' + tenantHashCode + '/login'
    }
    return '/login'
  }
}

export function getUpdatePasswordUrl() {
  const loginType = session.get('loginType')

  if (loginType === 'plat') {
    return '/api/platform/cfgManager/updatePasswordWithOld'
  } else if (loginType === 'group') {
    return '/api/platform/cfgTenant/updatePasswordWithOld'
  } else {
    return '/api/func/user/updatePasswordWithOld'
  }
}
