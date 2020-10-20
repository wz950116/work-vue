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
          view: '/api/target/tgtFtAccoRiskdegree/get',
          save: '/api/target/tgtFtAccoRiskdegree/save',
          update: '/api/target/tgtFtAccoRiskdegree/update'
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
            label: 'target.futuresRiskdegree.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            event: {
              changeAll: this.accountChange
            }
          },
          {
            label: 'target.futuresRiskdegree.organCode',
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
            label: 'target.futuresRiskdegree.custCode',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                typeCode: '4'
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
            label: 'target.futuresRiskdegree.riskDegree',
            prop: 'riskDegree',
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
            label: 'target.futuresRiskdegree.remark',
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
    accountChange(data) {
      this.$set(this.$refs.qmDialog.formData, 'custCode', data.data.customerCode)
    }
  }
}
</script>
