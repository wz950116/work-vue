<template>
  <el-upload :show-file-list='false' :action="uploadUrl" :headers="httpHeaders" :on-progress="handleProgress" :on-success="handleSuccess" :multiple="false" :disabled="disabled" :on-error="handleError" style='display: block;width: 100%;'>
    <el-input v-model='file' size="mini" :loading="uploadLoading" :type='type' :disabled="disabled" :size="size" :placeholder="placeholder || $t('biz.placeholder.input')" :maxlength='maxlength' :clearable='clearable' :show-password='showPassword' v-bind='attrs' @input='onInput' @clear='onClear'></el-input>
  </el-upload>
</template>
<script>
import { notifySuccess, notifyError, confirmTip } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      file: this.value,
      uploadLoading: false,
      uploadUrl: process.env.BASE_API + '/api/sys/file/upload'
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    maxlength: {
      type: Number,
      default: 50
    },
    prepend: {
      type: String,
      default: ''
    },
    append: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    validateType: {
      type: String,
      default: ''
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    attrs: {
      type: Object,
      default: () => { }
    }
  },
  model: {
    prop: 'value',
    event: 'event'
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        this.file = ''
      } else {
        this.file = newValue
      }
    }
  },
  computed: {
    httpHeaders() {
      return {
        Authorization: 'Bearer ' + this.$store.getters.token
      }
    }
  },
  methods: {
    handleProgress() {
      this.uploadLoading = true
    },
    handleSuccess(response, file, fileList) {
      this.uploadLoading = false
      if (response && response.status === false) {
        if (response.msgText) {
          this.$notify(
            notifyError({ msg: response.msgText })
          )
        } else {
          this.$notify(
            notifyError({ msg: '上传文件失败' })
          )
        }
      } else {
        this.$notify(
          notifySuccess({ msg: '上传文件成功' })
        )
        this.file = response.data.filePath
        this.$emit('event', this.file)
        this.$emit('onFileChange', file)
      }
    },
    handleError(errInfo, file, fileList) {
      this.uploadLoading = false
      this.$notify.error({
        message: '上传文件失败',
        position: 'bottom-right'
      })
    },
    onClear() {
      this.file = ''
      this.$emit('event', this.file)
    },
    onInput(newVal) {
      this.file = this.value
    }
  }
}
</script>
