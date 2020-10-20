<template>
  <qm-dialog ref="qmDialog" :dialog='dialog' @closeDialog='hanldeCloseDialog' @initCallback='handleInitCallback'></qm-dialog>
</template>

<script>
import request from '@/utils/frame/base/request'

export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/target/tgtFuturesProfitloss/get',
          save: '/api/target/tgtFuturesProfitloss/save',
          update: '/api/target/tgtFuturesProfitloss/update'
        },
        apiData: {
          view(param) {
            return param.id
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.id
          }
        },
        formData: [
          {
            label: 'target.futuresProfitTarget.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              params: {
                usingFlag: '1'
              },
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            type: 'date',
            label: 'target.futuresProfitTarget.startDate',
            prop: 'startDate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            type: 'date',
            label: 'target.futuresProfitTarget.endDate',
            prop: 'endDate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'target.futuresProfitTarget.closeProfitLoss',
            prop: 'closeProfitLoss',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.99,
              type: 'thousands',
              precision: 4
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'target.futuresProfitTarget.profitlossLoss',
            prop: 'profitlossLoss',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.99,
              type: 'thousands',
              precision: 4
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'target.futuresProfitTarget.lossSum',
            prop: 'lossSum',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.99,
              type: 'thousands',
              precision: 4
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'target.futuresProfitTarget.profit',
            prop: 'profit',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.99,
              type: 'thousands',
              precision: 4
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'target.futuresProfitTarget.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 3
            }
          }
        ],
        bottomButtons: [
          {
            iconName: '线性-返回',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view']
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            isShow: ['add', 'update']
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    hanldeCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    handleInitCallback() {
      setTimeout(() => {
        this.changeShow()
      }, 500)
    },
    typeChange() {
      this.changeShow()
      this.$refs.qmDialog.formData.derivativeAccount = ''
      this.$refs.qmDialog.formData.futuresVarietiesCode = ''
    },
    accountChange(data) {
      this.$refs.qmDialog.formData.custCode = data.data.customerCode
    },
    changeShow() {
      let val = this.$refs.qmDialog.formData.derivativeType
      if (val === '1') {
        this.dialog.formData[2].attrs.params = { derivativeType: '1', derivativeCategory: '1' }
        this.dialog.formData[3].attrs = {
          data: 'FUTURES_VARIETIES',
          clearable: true,
          params: {
            usingFlag: '1',
            futuresVarietiesType: '1'
          }
        }
      }
      if (val === '2') {
        this.dialog.formData[2].attrs.params = { derivativeType: '1', derivativeCategory: '2' }
        this.dialog.formData[3].attrs = {
          data: 'FUTURES_VARIETIES',
          clearable: true,
          params: {
            usingFlag: '1',
            futuresVarietiesType: '2'
          }
        }
      }
      if (val === '3') {
        this.dialog.formData[2].attrs.params = { derivativeType: '1' }
        this.dialog.formData[3].attrs = {
          data: 'OPTION_VARIETIES',
          clearable: true,
          params: {
            usingFlag: '1'
          }
        }
      }
    }
  }
}
</script>
