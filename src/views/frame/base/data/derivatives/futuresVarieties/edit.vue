<template>
  <qm-dialog ref="qmDialog" :dialog='dialog' @closeDialog='hanldeCloseDialog' @initCallback='handleInitCallback'></qm-dialog>
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
          view: '/api/dd/futuresVarieties/get',
          save: '/api/dd/futuresVarieties/save',
          update: '/api/dd/futuresVarieties/update'
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
            label: 'dataHq.futuresVarieties.futuresVarietiesType',
            prop: 'futuresVarietiesType',
            element: 'base-select',
            list: this.$t('datadict.exchangeType'),
            default: '1',
            attrs: {
              clearable: true,
              disabled: this.getDisabled()
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            event: this.typeChange
          },
          {
            label: 'dataHq.futuresVarieties.exchangeName',
            prop: 'exchangeCode',
            element: 'base-select',
            attrs: {
              data: 'EXCHANGE',
              params: {
                usingFlag: '1', // 启用状态
                exchangeType: '1'
              },
              clearable: true,
              disabled: this.getDisabled()
            },
            event: {
              change: this.selectChange
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.futuresVarieties.exchangeName',
            prop: 'exchangeId',
            element: 'input-validate',
            isShow: ['no'],
            attrs: {
              clearable: true,
              disabled: true
            }
          },
          {
            label: 'dataHq.futuresVarieties.futuresVarietiesCode',
            prop: 'futuresVarietiesCode',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: this.getDisabled()
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.futuresVarieties.futuresVarietiesName',
            prop: 'futuresVarietiesName',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: this.getDisabled()
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.futuresVarieties.contractMultiplier',
            prop: 'contractMultiplier',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.99,
              type: 'thousands',
              precision: 2,
              disabled: this.getDisabled()
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.futuresVarieties.unit',
            prop: 'unit',
            element: 'base-select',
            list: this.$t('datadict.measurementUnit'),
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
            label: 'dataHq.futuresVarieties.tickSize',
            prop: 'tickSize',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.99,
              type: 'thousands',
              precision: 2,
              disabled: this.getDisabled()
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.futuresVarieties.minDeliveryUnit',
            prop: 'minDeliveryUnit',
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
            label: 'dataHq.futuresVarieties.deliveryDate',
            prop: 'deliveryDate',
            element: 'input-validate',
            isShow: true,
            attrs: {
              clearable: true,
              maxlength: 20,
              disabled: this.getDisabledView()
            }
          },
          {
            label: 'dataHq.futuresVarieties.currencyCode',
            prop: 'currencyCode',
            element: 'base-select',
            default: 'CNY',
            attrs: {
              data: 'CURRENCY',
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
            label: 'dataHq.futuresVarieties.usingFlag',
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
    param: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    typeChange() {
      const val = this.$refs.qmDialog.formData.futuresVarietiesType
      this.dialog.formData[1].attrs.params.exchangeType = val
      this.$refs.qmDialog.formData.exchangeCode = ''
      if (val === '2') {
        this.dialog.formData[9].isShow = false
        this.dialog.formData[9].validate = []
      } else {
        this.dialog.formData[9].isShow = false
        this.dialog.formData[9].validate = [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }

    },
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
    getDisabled() {
      const data = this.param
      if (this.opType === 'add') { // 新增
        return false
      } else if (this.opType === 'update') { // 修改
        if (data.dataAttr === '1') { // 同步
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    // 下拉框联动
    selectChange(newName) {
      this.$set(this.$refs.qmDialog.formData, 'exchangeId', newName.id)
    }
  }
}
</script>
