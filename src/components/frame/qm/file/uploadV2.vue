<template>
   <el-upload 
    :show-file-list='showFileList'
    :accept='accept'
    :multiple='multiple'
    :disabled='disabled'
    :v-permission="permission"
    :headers="httpHeaders" 
    :action="uploadUrl"
    :data="paramData"
    :before-upload="beforeUploadCallback"
    :on-progress="progressCallback" 
    :on-success="successCallback" 
    :on-error="errorCallback"
    :on-change="changeCallback"
    style='display:inline-block;margin-left:3px;'>
    <el-button size="mini" :loading="uploadLoading">
      <svg-icon :icon-class="iconName"></svg-icon>{{$t(btnName)}}
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
    // 是否展示文件列表，默认false
    showFileList: {
      type: Boolean,
      default: false
    },
    // 可选文件类型，默认*，即所有文件
    accept: {
      type: String,
      default: '*'
    },
    // 是否可多选，默认false
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否不可操作，默认false
    disabled: {
      type: Boolean,
      default: false
    },
    // 操作权限
    permission: {
      type: Array,
      default: null
    },
    // 请求header
    // httpHeaders: {
    //   type: Object,
    //   default: this.httpHeaders
    // },
    // 文件上传url
    uploadUrl: {
      type: String,
      default: process.env.BASE_API + '/api/sys/file/upload'
    },
    // 参数数据
    paramData: {
      type: Object,
      default() {}
    },
    // 文件上传前回调
    beforeUploadCallback: {
      type: Function,
      default: this.handleBeforeUpload
    },
    // 文件上传时回调
    progressCallback: {
      type: Function,
      default: this.handleProgress
    },
    // 文件上传成功回调
    successCallback: {
      type: Function,
      default: this.handleSuccess
    },
    // 文件上传错误回调
    errorCallback: {
      type: Function,
      default: this.handleError
    },
    // 文件状态改变回调
    changeCallback: {
      type: Function,
      default: this.handleChange
    },
    // 是否通知
    notifyFlag: {
      type: Boolean,
      default: true
    },
    // icon名称
    iconName: {
      type: String,
      default: '线性-上传'
    },
    // 按钮名称
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
    handleBeforeUpload(file) {
      return true
    },
    handleProgress(event, file, fileList) {
      this.uploadLoading = true
    },
    handleSuccess(response, file, fileList) {
      this.uploadLoading = false
      if (response && response.status === false) {
        if (this.notifyFlag) {
          this.$notify.error({
            message: response.msgText ? response.msgText : '上传文件失败',
            position: 'bottom-right'
          })
        }
        return
      }

      if (this.notifyFlag) {
        if (response.msgText) {
          this.$notify.warning({
            message: response.msgText,
            position: 'bottom-right'
          })
          return
        }
        this.$notify.success({
          message: '上传文件成功',
          position: 'bottom-right'
        })
      }
    },
    handleError(err, file, fileList) {
      this.uploadLoading = false
      this.$notify.error({
        message: '上传文件失败',
        position: 'bottom-right'
      })
    },
    handleChange(file, fileList) {
      this.uploadLoading = false
    }
  }
}
</script>
