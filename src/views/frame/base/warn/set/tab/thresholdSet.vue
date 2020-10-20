<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='miniColumnsDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <el-form class="header-form-inline" v-if="showTemplate" :model="formData" label-position="left" :rules='rules' ref="validateForm" :show-message="false">
        <el-row :gutter="20">
          <el-col :span="24" v-for='thresholdinfo in formData.threshold' :key='thresholdinfo.prop'>
            <el-form-item :label="thresholdinfo.label" :prop='thresholdinfo.prop'>
              <el-date-picker v-if="thresholdinfo.dataType==='DATE'" type="datetime" value-format='yyyy-MM-dd HH:mm:ss' v-model='thresholdinfo.value'>
              </el-date-picker>
              <el-input v-else v-model='thresholdinfo.value'></el-input>
            </el-form-item>
          </el-col>
          <template v-if="dimensionList && dimensionList.length > 0">
            <el-col :span='12' v-for='dimension in dimensionList' :key='dimension.colCode'>
              <el-form-item :label='dimension.colName'>
                <base-select v-model="formData.dimensionObject[dimension.colCode]" :attrs="dimension.propAttrObject"></base-select>
              </el-form-item>
            </el-col>
          </template>

        </el-row>
      </el-form>
      <!-- 底部 -->
      <div class="dialog-footer">
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
      showTemplate: false,
      loading: false,
      dimensionList: [],
      dimensionParam: {},
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },

      // 属性信息
      rules: {},
      formData: {
        threshold: [],
        warningCode: this.param.warningCode,
        dimensionObject: {}
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
      return '阀值' + this.$t(`biz.btn.${this.opType}`)
    }
  },
  async created() {
    const response = await request({
      url: '/api/warn/cond/listSrcColByType',
      method: 'post',
      data: {
        data: {
          sourceCode: this.param.sourceCode,
          propType: 'dimension'
        },
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      }
    })
    if (response.data) {
      this.dimensionList = response.data
      if (this.dimensionList && this.dimensionList.length > 0) {
        this.dimensionList.forEach(d => {
          d.colName = '维度(' + d.colName + ')'
          this.dimensionParam[d.colCode] = ''
        })
        this.formData.dimensionObject = Object.assign({}, this.dimensionParam)
      }
    }
    // 初始化
    await request({
      url: '/api/warn/cond/listCondIdsByWarningIdGroupCode',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          warningCode: this.param.warningCode,
          groupCode: this.param.groupCode
        }
      }
    }).then(response => {
      if (response.data) {
        response.data.forEach((s, index) => {
          // this.rules[s.id] = [
          //   {
          //     required: true,
          //     message: this.$t('biz.validateMsg.notBlank'),
          //     trigger: 'blur'
          //   }
          // ]
          this.formData.threshold.push({
            value: '',
            prop: s.id,
            dataType: s.dataType,
            label: s.thresholdKey
          })
        })
      }
    })
    this.showTemplate = true
    if (this.opType !== 'add') {
      await request({
        url: '/api/warn/warnCondThreshold/getByBatchId',
        method: 'POST',
        data: {
          data: this.param.batchId,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view')
        }
      })
        .then(response => {
          let threshold = this.formData.threshold
          if (threshold && threshold.length > 0) {
            threshold.forEach((s, index) => {
              response.data.threshold.forEach((ss, sindex) => {
                if (s.prop === ss.prop) {
                  s.value = ss.value
                }
              })
            })
          }
          this.formData = Object.assign({}, response.data, {
            dimensionObject: Object.assign({}, this.dimensionParam, response.data.dimension ? JSON.parse(response.data.dimension) : {})
          })
          this.formData.threshold = threshold
        })
        .catch(() => {})
    }
  },
  methods: {
    // 保存
    saveEdit() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          this.formData['warningCode'] = this.param.warningCode
          this.formData['groupCode'] = this.param.groupCode
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
                  url: '/api/warn/warnCondThreshold/save',
                  method: 'POST',
                  data: postData
                })
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.saveSuccess')
                      })
                    )
                    this.$emit('closeAndRefreshHandler', true)
                  })
                  .catch(() => {})
              } else if (this.opType === 'update') {
                request({
                  url: '/api/warn/warnCondThreshold/update',
                  method: 'POST',
                  data: postData
                })
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.updateSuccess')
                      })
                    )
                    this.$emit('closeAndRefreshHandler', true)
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
      this.$emit('closeAndRefreshHandler', false)
    },
    cancel() {
      this.$emit('closeAndRefreshHandler', false)
    },
    closeAndRefresh() {
      this.$emit('closeAndRefreshHandler', true)
    }
  }
}
</script>
