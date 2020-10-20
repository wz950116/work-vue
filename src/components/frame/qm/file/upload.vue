<template>
  <el-upload :show-file-list='false' :action="uploadUrl" :headers="httpHeaders" :accept="accept" :on-progress="handleProgress" :on-success="handleSuccess" :multiple="false" :disabled="disabled" :on-error="handleError" style='display:inline-block;margin-right:10px;'>
    <el-button size="mini" :loading="uploadLoading" v-show="!disabled">
      <svg-icon icon-class="线性-上传"></svg-icon>{{ btnName }}
    </el-button>
  </el-upload>
</template>
<script>
export default {
  data() {
    return {
      uploadLoading: false
    }
  },
  props: {
    uploadUrl: {
      type: String,
      default: process.env.BASE_API + '/api/sys/file/upload'
    },
    disabled: {
      type: Boolean,
      default() {
        return false
      }
    },
    accept: {
      type: String,
      default: '*.*'
    },
    notifyFlag: {
      type: Boolean,
      default() {
        return true
      }
    },
    btnName: {
      type: String,
      default() {
        return this.$t('biz.btn.upload')
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
        if (this.notifyFlag) {
          if (response.msgText) {
            this.$notify.error({
              message: response.msgText,
              position: 'bottom-right'
            })
          } else {
            this.$notify.error({
              message: '上传文件失败',
              position: 'bottom-right'
            })
          }
        }
      } else {
        if (this.notifyFlag) {
          if (response.msgText) {
            this.$notify.warning({
              message: response.msgText,
              position: 'bottom-right'
            })
          } else {
            this.$notify.success({
              message: '上传文件成功',
              position: 'bottom-right'
            })
          }
        }
        this.$emit('onFileChange', file)
      }
    },
    handleError(errInfo, file, fileList) {
      this.uploadLoading = false
      this.$notify.error({
        message: '上传文件失败',
        position: 'bottom-right'
      })
    }
  }
}
</script>
