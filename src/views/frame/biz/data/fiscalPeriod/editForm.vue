<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
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
          view: '/api/fiscal/period/get',
          save: '/api/fiscal/period/save',
          update: '/api/fiscal/period/update'
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
            label: 'data.fiscalPeriod.form.organCode',
            prop: 'organCode',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true,
              usingFlag: '1',
              clickParent: true
            }
          },
          {
            label: 'data.fiscalPeriod.form.fiscalYear',
            prop: 'fiscalYear',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'DATE',
              clearable: true
            }
          },
          {
            label: 'data.fiscalPeriod.form.fiscalPeriodCode',
            prop: 'fiscalPeriodCode',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'data.fiscalPeriod.form.startDate',
            prop: 'fiscalSDate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              type: 'start',
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            type: 'date',
            label: 'data.fiscalPeriod.form.endDate',
            prop: 'fiscalEDate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              type: 'end',
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'data.fiscalPeriod.form.businessCloseFlag',
            prop: 'businessCloseFlag',
            element: 'base-select',
            list: this.$t('datadict.fiscalCloseFlag'),
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
            label: 'data.fiscalPeriod.form.financeCloseFlag',
            prop: 'financeCloseFlag',
            element: 'base-select',
            list: this.$t('datadict.fiscalCloseFlag'),
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
            label: 'data.fiscalPeriod.form.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 2
            }
          }
        ],
        bottomButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
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
    }
  }
}
</script>
