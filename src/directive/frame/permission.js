import Vue from 'vue'
import session from '@/utils/frame/base/sessionStorage'

Vue.directive('permission', {
  inserted(el, binding) {
    const { value } = binding
    const buttons = session.get('permissionButtons')
    const bpmFlg = session.get('bpmFlg') || 'false'
    if (value) {
      if (Array.isArray(value) && value.length > 0) {
        if (Array.isArray(buttons)) {
          const hasPermission = buttons.some(button => {
            if (bpmFlg === 'false') {
              if (button === 'submitAudit' || button === 'auditHistory' || button === 'withdrawAudit' || button === 'cancelAudit') return false
            }
            if (button === 'all') return true
            return value.includes(button)
          })
          if (!hasPermission) {
            el.parentNode && el.parentNode.removeChild(el)
          }
        }
      } else if (typeof value === 'string') {
        let hasPermission = false
        if (bpmFlg === 'false') {
          if (buttons.includes('submitAudit') || buttons.includes('withdrawAudit') || buttons.includes('auditHistory') || buttons.includes('cancelAudit')) hasPermission = false
        }
        if (buttons.includes('all')) hasPermission = true
        hasPermission = buttons.includes(value)

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error(`need button! Like v-permission="['all','query']" or "v-permission='add'"`)
      }
    }
  }
})

Vue.directive('permissionMultiple', {
  inserted(el, binding) {
    const { value } = binding
    const buttons = session.get('permissionButtons')
    if (value) {
      if (Array.isArray(value) && value.length > 0) {
        if (Array.isArray(buttons)) {
          // 是否都无权限
          const hasPermission = value.every(v => {
            const permitName = v.permitName ? v.permitName : [v.name]
            return buttons.some(i => permitName.includes(i)) === false
          })
          if (hasPermission) {
            el.parentNode && el.parentNode.removeChild(el)
          }
        }
      } else {
        throw new Error(`need button! Like v-permission="['all','query']"`)
      }
    }
  }
})
