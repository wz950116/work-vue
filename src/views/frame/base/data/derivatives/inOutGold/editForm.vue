<template>
  <qm-dialog ref="qmDialog" :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
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
          view: '/api/data/ddInOutGold/get',
          save: '/api/data/ddInOutGold/save',
          update: '/api/data/ddInOutGold/update'
        },
        apiData: {
          view(params) {
            return params.id
          },
          save(params) {
            return params.id
          },
          update(params) {
            return params.id
          }
        },
        formData: [
          {
            label: 'dataHq.inOutGold.form.organName',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true,
              disabled: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.deptName',
            prop: 'deptCode',
            element: 'tree-org-base-dept',
            component: () =>
              import('@/views/frame/base/organ/components/TreeOrgBaseDept'),
            event: {
              handleNode: this.changeDept
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.derivativeSubAccount',
            prop: 'derivativeSubAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_SUB_ACCOUNT',
              clearable: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.outGold',
            prop: 'outGold',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.inGold',
            prop: 'inGold',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.currencyCode',
            prop: 'currencyCode',
            element: 'base-select',
            attrs: {
              data: 'CURRENCY',
              clearable: true
            },
            default: 'CNY'
          },
          {
            label: 'dataHq.inOutGold.form.strategyName',
            prop: 'strategyCode',
            element: 'base-select',
            attrs: {
              data: 'STRATEGY',
              clearable: true
            }
          },
          {
            label: 'dataHq.inOutGold.form.theDate',
            prop: 'theDate',
            type: 'date',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view']
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            event: 'save',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
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
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
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
