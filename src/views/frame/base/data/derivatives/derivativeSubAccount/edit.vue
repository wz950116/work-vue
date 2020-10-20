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
        api: {
          view: '/api/dd/subAccount/get',
          save: '/api/dd/subAccount/save',
          update: '/api/dd/subAccount/update'
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
            label: 'dataHq.derivativeSubAccount.derivativeSubAccount',
            prop: 'derivativeSubAccount',
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
            label: 'dataHq.derivativeSubAccount.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              disabled: this.getDisabledView(),
              clearable: true
            },
            validate: [
              {
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.derivativeSubAccount.projectId',
            prop: 'projectCode',
            element: 'base-select',
            attrs: {
              data: 'PROJECT',
              params: {
                usingFlag: '1', // 启用状态
                projectStat: '3' // 项目状态
              },
              clearable: true,
              disabled: this.getDisabledView()
            }
          },
          {
            label: 'dataHq.derivativeSubAccount.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true,
              disabled: true
            }
          },
          {
            label: 'dataHq.derivativeSubAccount.deptCode',
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
            label: 'dataHq.derivativeSubAccount.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
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
    dataAttr: {
      type: String,
      default: '1'
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
