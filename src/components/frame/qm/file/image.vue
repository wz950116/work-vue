<template>
  <div>
    <el-upload ref="upload" :show-file-list='false' :data="imageData" list-type="picture-card" accept="image/*" :before-upload="beforeAvatarUpload" :action="uploadUrl" :headers="httpHeaders" :on-progress="handleProgress" :on-success="handleSuccess" :multiple="false" :disabled="disabled" :on-error="handleError" style='display: block;width: 100%;' :class="{ 'show-border' : src }">
      <el-image v-if="src" :src="src" class="avatar" style='width: 100%;height: 100%;'></el-image>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      <div class="el-upload-list__item-actions">
        <span class="el-upload-list-item" @click.stop='previewImg'>
          <i class="el-icon-zoom-in"></i>
        </span>
        <span class="el-upload-list-item" v-if="!disabled" @click.stop='deleteImg'>
          <i class="el-icon-delete"></i>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="src" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { notifySuccess, notifyError, confirmTip } from '@/utils/frame/base/notifyParams'

import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      src: '',
      file: this.value,
      uploadLoading: false,
      dialogVisible: false
    }
  },
  props: {
    uploadUrl: {
      type: String,
      default: process.env.BASE_API + '/api/sys/file/uploadImg'
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    imgWidth: {
      type: Number
    },
    imgHeight: {
      type: Number
    },
    maxSize: {
      type: Number,
      default: 2
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
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String
    },
    imageData: {
      type: Object,
      default: () => {}
    },
    attrs: {
      type: Object,
      default: () => {}
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
        this.preview()
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
    preview() {
      if (this.file) {
        request({
          url: '/api/sys/file/showImg',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.preview'),
            data: Object.assign({}, this.imageData, { filePath: this.file })
          }
        })
          .then(response => {
            this.src = 'data:image/jpeg;base64,' + response.data
          })
          .catch(() => {})
      }
    },
    handleProgress() {
      this.uploadLoading = true
    },
    handleSuccess(response, file, fileList) {
      this.uploadLoading = false
      if (response && response.status === false) {
        if (response.msgText) {
          this.$notify(notifyError({ msg: response.msgText }))
        } else {
          this.$notify(notifyError({ msg: '上传文件失败' }))
        }
      } else {
        this.$notify(notifySuccess({ msg: '上传文件成功' }))
        this.file = response.data.filePath
        this.$emit('event', this.file)
        this.$emit('onFileChange', file)
      }
    },
    beforeAvatarUpload(file) {
      let isJPG = file.type.indexOf('image') != -1
      //格式
      if (!isJPG) {
        this.$message.error('上传头像图片格式不支持')
      }
      const isLt2M = file.size / 1024 / 1024 < this.maxSize
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 ' + this.maxSize + 'MB!')
      }

      const _width = this.imgWidth
      const _height = this.imgHeight
      const isSize = new Promise(function(resolve, reject) {
        const _url = URL.createObjectURL(file)
        const img = new Image()
        if (_width && _height && _width > 0 && _height > 0) {
          // 是否判断宽高
          img.onload = function() {
            const valid = img.width === _width && img.height === _height
            valid ? resolve() : reject()
          }
        } else {
          resolve()
        }
        img.src = _url
      }).then(
        () => {
          return true
        },
        () => {
          this.$message.error('上传的尺寸必须是宽:' + _width + 'px 高:' + _height + 'px')
          return Promise.reject()
        }
      )

      return isJPG && isLt2M && isSize
    },
    handleError(errInfo, file, fileList) {
      this.uploadLoading = false
      this.$notify.error({
        message: '上传文件失败',
        position: 'bottom-right'
      })
    },
    previewImg() {
      this.dialogVisible = true
    },
    deleteImg(e) {
      this.src = ''
      this.file = ''
      this.$emit('event', this.file)
    }
  }
}
</script>
<style lang='scss'>
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.el-upload--picture-card {
  position: relative;
  overflow: hidden;
}

.show-border .el-upload--picture-card {
  border: none !important;
  .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    &::after {
      display: inline-block;
      content: '';
      height: 100%;
      vertical-align: middle;
    }
    &:hover {
      opacity: 1;
    }
    .el-upload-list-item {
      display: inline-block;
      margin: 0 5px;
      &:hover i {
        cursor: pointer;
        color: #ffffff;
      }
    }
  }
}
</style>