<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='mediumColumnsDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <el-form class="header-form-inline" :model="formData" label-position="left" :rules='rules' ref="validateForm" :show-message="false">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="图片名称" prop='imageName'>
              <input-validate v-model="formData.imageName" size="mini"></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="显示位置" prop='showSite'>
              <el-select v-model="formData.showSite" @change="setImageSize">
                <el-option v-for="item in $t('datadict.imgShowSite')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="图片尺寸" prop='siteSize'>
              <input-validate :disabled='true' v-model="formData.siteSize" size="mini"></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('biz.lbl.usingFlag')" prop='usingFlag'>
              <el-select v-model="formData.usingFlag" placeholder="">
                <el-option v-for="item in $t('datadict.usingFlag')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批状态" prop='auditStatus'>
              <el-select v-model="formData.auditStatus" :disabled="true">
                <el-option v-for="item in $t('datadict.auditStatus')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop='remark'>
              <input-validate v-model="formData.remark" size="mini"></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片" prop='imagePath'>
              <image-upload v-model="formData.imagePath" :imgWidth='imgWidth' :imgHeight='imgHeight' :disabled=this.getDisabledView() size="mini"></image-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click="close" v-if="opType==='view'" size="mini">{{ $t('biz.btn.close') }}</el-button>
        <el-button @click="cancel" v-if="opType==='add'||opType==='update'" size="mini">{{ $t('biz.btn.cancel') }}</el-button>
        <el-button type="primary" @click="saveEdit" v-if="opType==='add'||opType==='update'" v-db-click size="mini">{{ $t('biz.btn.save') }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { notifySuccess } from '@/utils/frame/base/notifyParams'

import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      loading: false,
      imgWidth: 0,
      imgHeight: 0,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },

      // 属性信息
      rules: {
        imageName: [
          {
            required: true,
            message: this.$t('biz.validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        showSite: [
          {
            required: true,
            message: this.$t('biz.validateMsg.notBlank'),
            trigger: 'change'
          }
        ]
      },
      formData: {
        imageName: '',
        showSite: '',
        siteSize: '',
        usingFlag: '0',
        auditStatus: '1'
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  computed: {
    // 根据传参，显示不同的弹窗名称
    titleName() {
      return '形象图片' + this.$t(`biz.btn.${this.opType}`)
    }
  },
  mounted() {
    // 初始化
    this.getData()
  },
  methods: {
    setImageSize() {
      const showSite = this.formData['showSite']
      if (showSite) {
        this.formData['siteSize'] = this.$toolUtil.dataFormat('dataDictFormat', showSite, this.$t('datadict.imgSiteSize'))
      } else {
        this.formData['siteSize'] = ''
      }
    },
    getDisabledView() {
      if (this.opType === 'view') {
        return true
      } else {
        const siteSize = this.formData['siteSize']
        if (siteSize) {
          return false
        } else {
          return true
        }
      }
    },
    setImageSize() {
      const showSite = this.formData['showSite']
      if (showSite) {
        this.formData['siteSize'] = this.$toolUtil.dataFormat('dataDictFormat', showSite, this.$t('datadict.imgSiteSize'))
        this.imgWidth = parseInt(this.formData['siteSize'].split('*')[0])
        this.imgHeight = parseInt(this.formData['siteSize'].split('*')[1])
      } else {
        this.formData['siteSize'] = ''
      }
    },
    getData() {
      if (this.opType !== 'add') {
        request({
          url: '/api/platform/corpImg/get',
          method: 'POST',
          data: {
            data: this.param,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.view')
          }
        })
          .then(response => {
            this.formData = response.data
            this.setImageSize()
          })
          .catch(() => {})
      }
    },
    // 保存
    saveEdit() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          var postData = {
            data: this.formData,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
          }
          this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              if (this.opType === 'add') {
                request({
                  url: '/api/platform/corpImg/save',
                  method: 'POST',
                  data: postData
                })
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.saveSuccess')
                      })
                    )
                    this.$emit('closeHandler', true)
                  })
                  .catch(() => {})
              } else if (this.opType === 'update') {
                request({
                  url: '/api/platform/corpImg/save',
                  method: 'POST',
                  data: postData
                })
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.updateSuccess')
                      })
                    )
                    this.$emit('closeHandler', true)
                  })
                  .catch(() => {})
              }
            })
            .catch(() => {})
        }
      })
    },
    // 取消
    close() {
      this.$emit('closeHandler', false)
    },
    cancel() {
      this.$emit('closeHandler', false)
    },
    closeAndRefresh() {
      this.$emit('closeHandler', true)
    }
  }
}
</script>
