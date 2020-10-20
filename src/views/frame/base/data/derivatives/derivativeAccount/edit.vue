<template>
  <qm-dialog ref="qmDialog" :dialog='dialog' @closeDialog='hanldeCloseDialog'></qm-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        derivativeTypes: [],
        api: {
          view: '/api/dd/derivativeAccount/get',
          save: '/api/dd/derivativeAccount/save',
          update: '/api/dd/derivativeAccount/update'
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
            label: 'dataHq.derivativeAccount.customerId',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              clearable: true,
              disabled: this.getDisabledView(),
              params: {
                typeCode: '4' // 不写:所有客户供应商经济商仓储公司， '1'只显示客户，'2'只显示供应商，
              }
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.derivativeAccount.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.derivativeAccount.derivativeAccountCode',
            prop: 'derivativeAccountCode',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            type: 'checkbox',
            label: 'dataHq.derivativeAccount.derivativeTypes',
            prop: 'derivativeTypes',
            list: this.$t('datadict.derivativeType'),
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            default: ['1']
          },
          {
            label: 'dataHq.derivativeAccount.derivativeAccountType',
            prop: 'derivativeAccountType',
            element: 'base-select',
            list: this.$t('datadict.derivativeAccountType'),
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.derivativeAccount.password',
            prop: 'password',
            element: 'input-validate',
            attrs: {
              showPassword: true,
              encript: false,
              clearable: true,
              disabled: this.getDisabledView()
            },
            isShow: ['add'],
            validate: [
              {
                required: process.env.TRADE_PLATFORM === 'ctp',
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.derivativeAccount.authorizationCode',
            prop: 'authorizationCode',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            }
          },
          {
            label: 'dataHq.derivativeAccount.organId',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true,
              disabled: true
            }
          },
          {
            label: 'dataHq.derivativeAccount.deptCode',
            prop: 'deptCode',
            element: 'tree-org-base-dept',
            component: () =>
              import('@/views/frame/base/organ/components/TreeOrgBaseDept'),
            event: {
              handleNode: this.changeDept
            },
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            }
          },
          {
            label: 'dataHq.derivativeAccount.trusteeshipFlag',
            prop: 'trusteeshipFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            }
          },
          {
            label: 'appId',
            prop: 'appId',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            },
            default: 'client_hgrm_1.0.0',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.derivativeAccount.derivativeCategory',
            prop: 'derivativeCategory',
            element: 'base-select',
            list: this.$t('datadict.derivativeCategory'),
            attrs: {
              clearable: true,
              disabled: this.getDisabledView()
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
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
    getDisabledView() {
      if (this.opType === 'view') {
        return true
      } else {
        return false
      }
    },
    changeDept(value) {
      if (value) {
        this.$refs.qmDialog.formData.organCode = value.orgCode
      } else {
        this.$refs.qmDialog.formData.organCode = ''
      }
    }
  }
}
</script>
