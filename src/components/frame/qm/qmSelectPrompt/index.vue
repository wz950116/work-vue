<template>
  <transition name="msgbox-fade">
    <div class="el-message-box__wrapper" tabindex="-1" v-show="visible" @click.self="handleWrapperClick" role="dialog" aria-modal="true" :aria-label="title || 'dialog'">
      <div class="el-message-box" :class="[customClass, center && 'el-message-box--center']">
        <div class="el-message-box__header" v-if="title !== null">
          <div class="el-message-box__title">
            <div :class="['el-message-box__status', icon]" v-if="icon && center">
            </div>
            <span>{{ title }}</span>
          </div>
          <button type="button" class="el-message-box__headerbtn" aria-label="Close" v-if="showClose" @click="handleAction(distinguishCancelAndClose ? 'close' : 'cancel')" @keydown.enter="handleAction(distinguishCancelAndClose ? 'close' : 'cancel')">
            <i class="el-message-box__close el-icon-close"></i>
          </button>
        </div>
        <div class="el-message-box__content">
          <div class="el-message-box__container">
            <div :class="['el-message-box__status', icon]" v-if="icon && !center && message !== ''">
            </div>
            <div class="el-message-box__message" v-if="message !== ''">
              <slot>
                <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
                <p v-else v-html="message"></p>
              </slot>
            </div>
          </div>
          <div class="el-message-box__input">
            <el-select v-model="inputValue" ref="input">
              <el-option v-for="item in inputList" :key="item.value" :label="item.label" :value="item.value" :placeholder="inputPlaceholder" />
            </el-select>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button :loading="cancelButtonLoading" :class="[ cancelButtonClasses ]" :round="roundButton" size="small" @click.native="handleAction('cancel')" @keydown.enter="handleAction('cancel')">
            {{ cancelButtonText || t('el.messagebox.cancel') }}
          </el-button>
          <el-button :loading="confirmButtonLoading" ref="confirm" :class="[ confirmButtonClasses ]" :round="roundButton" size="small" @click.native="handleAction('confirm')" @keydown.enter="handleAction('confirm')">
            {{ confirmButtonText || t('el.messagebox.confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import Popup from 'element-ui/src/utils/popup'
import Locale from 'element-ui/src/mixins/locale'
import ElInput from 'element-ui/packages/input'
import ElButton from 'element-ui/packages/button'
import { removeClass } from 'element-ui/src/utils/dom'
import Dialog from 'element-ui/src/utils/aria-dialog'
let messageBox
const typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
}
export default {
  mixins: [Popup, Locale],
  props: {
    modal: {
      default: true
    },
    lockScroll: {
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      default: true
    },
    closeOnPressEscape: {
      default: true
    },
    closeOnHashChange: {
      default: true
    },
    center: {
      default: false,
      type: Boolean
    },
    roundButton: {
      default: false,
      type: Boolean
    }
  },
  components: {
    ElInput,
    ElButton
  },
  computed: {
    icon() {
      const { type, iconClass } = this
      return (
        iconClass || (type && typeMap[type] ? `el-icon-${typeMap[type]}` : '')
      )
    },
    confirmButtonClasses() {
      return `el-button--primary ${this.confirmButtonClass}`
    },
    cancelButtonClasses() {
      return `${this.cancelButtonClass}`
    }
  },
  methods: {
    getSafeClose() {
      const currentId = this.uid
      return () => {
        this.$nextTick(() => {
          if (currentId === this.uid) this.doClose()
        })
      }
    },
    doClose() {
      if (!this.visible) return
      this.visible = false
      this._closing = true
      this.onClose && this.onClose()
      messageBox.closeDialog() // 解绑
      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200)
      }
      this.opened = false
      this.doAfterClose()
      setTimeout(() => {
        if (this.action) this.callback(this.action, this)
      })
    },
    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleAction(this.distinguishCancelAndClose ? 'close' : 'cancel')
      }
    },
    handleAction(action) {
      this.action = action
      if (typeof this.beforeClose === 'function') {
        this.close = this.getSafeClose()
        this.beforeClose(action, this, this.close)
      } else {
        this.doClose()
      }
    },
    getFirstFocus() {
      const btn = this.$el.querySelector('.el-message-box__btns .el-button')
      const title = this.$el.querySelector(
        '.el-message-box__btns .el-message-box__title'
      )
      return btn || title
    },
    getInputElement() {
      const inputRefs = this.$refs.input.$refs
      return inputRefs.input || inputRefs.textarea
    },
    handleClose() {
      this.handleAction('close')
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.uid++
        if (this.$type === 'alert' || this.$type === 'confirm') {
          this.$nextTick(() => {
            this.$refs.confirm.$el.focus()
          })
        }
        this.focusAfterClosed = document.activeElement
        messageBox = new Dialog(
          this.$el,
          this.focusAfterClosed,
          this.getFirstFocus()
        )
      }
      // prompt
      if (this.$type !== 'prompt') return
      if (val) {
        setTimeout(() => {
          if (this.$refs.input && this.$refs.input.$el) {
            this.getInputElement().focus()
          }
        }, 500)
      } else {
        this.editorErrorMessage = ''
        removeClass(this.getInputElement(), 'invalid')
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.closeOnHashChange) {
        window.addEventListener('hashchange', this.close)
      }
    })
  },
  beforeDestroy() {
    if (this.closeOnHashChange) {
      window.removeEventListener('hashchange', this.close)
    }
    setTimeout(() => {
      messageBox.closeDialog()
    })
  },
  data() {
    return {
      uid: 1,
      title: undefined,
      message: '',
      type: '',
      iconClass: '',
      customClass: '',
      inputValue: null,
      inputList: [],
      inputPlaceholder: '',
      action: '',
      confirmButtonText: '',
      cancelButtonText: '',
      confirmButtonLoading: false,
      cancelButtonLoading: false,
      confirmButtonClass: '',
      confirmButtonDisabled: false,
      cancelButtonClass: '',
      editorErrorMessage: null,
      callback: null,
      dangerouslyUseHTMLString: false,
      focusAfterClosed: null,
      isOnComposition: false,
      distinguishCancelAndClose: false
    }
  }
}
</script>
