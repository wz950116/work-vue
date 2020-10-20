import Vue from 'vue'

const dbClick = {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, 1500)
      }
    })
  }
}

Vue.directive('db-click', dbClick)
