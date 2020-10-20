<template>
  <qm-dialog ref="qmDialog" :dialog='dialog' @closeDialog='hanldeCloseDialog'></qm-dialog>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'

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
          view: '/api/dd/futuresContract/get',
          save: '/api/dd/futuresContract/save',
          update: '/api/dd/futuresContract/update'
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
            label: 'dataHq.futuresContract.futuresVarietiesCode',
            prop: 'futuresVarietiesId',
            element: 'futures-varieties',
            component: () => import('@/views/frame/base/data/components/FuturesVarieties'),
            attrs: {
              showType: 'code',
              clearable: true,
              disabled: this.getDisabled()
            },
            event: {
              getFuturesVarietiesName: this.selectChange
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.futuresContract.futuresVarietiesCode',
            prop: 'futuresVarietiesCode',
            element: 'input-validate',
            isShow: ['no'],
            attrs: {
              clearable: true,
              disabled: true
            }
          },
          {
            label: 'dataHq.futuresContract.futuresVarietiesName',
            prop: 'futuresVarietiesName',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: true
            }
          },
          {
            label: 'dataHq.futuresContract.exchangeName',
            prop: 'exchangeName',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: true
            }
          },
          {
            label: 'dataHq.futuresContract.exchangeName',
            prop: 'exchangeId',
            element: 'input-validate',
            isShow: ['no'],
            attrs: {
              clearable: true,
              disabled: true
            }
          },
          {
            label: 'dataHq.futuresContract.contractMultiplier',
            prop: 'contractMultiplier',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.99,
              type: 'thousands',
              precision: 2,
              disabled: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.futuresContract.futuresContractCode',
            prop: 'futuresContractCode',
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
            label: 'dataHq.futuresContract.futuresContractName',
            prop: 'futuresContractName',
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
            label: 'dataHq.futuresContract.startDate',
            prop: 'startDate',
            type: 'date',
            attrs: {
              type: 'start',
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd',
              disabled: this.getDisabled()
            },
            event: {
              change: this.changeStartTime
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.futuresContract.endDate',
            prop: 'endDate',
            type: 'date',
            event: {
              change: this.changeEndTime
            },
            attrs: {
              type: 'end',
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd',
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
            label: 'dataHq.futuresContract.currencyId',
            prop: 'currencyCode',
            element: 'base-select',
            attrs: {
              data: 'CURRENCY',
              clearable: true,
              disabled: this.getDisabled()
            }
          },
          {
            label: 'data.bankAccount.form.usingFlag',
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
    // 开始时间变化
    changeStartTime(date) {
      this.dateEndBefore = {
        disabledDate(time) {
          return dateFormate(time, 'YYYYMMDD') * 1 < date * 1
        }
      }
    },
    // 结束时间变化
    changeEndTime(date) {
      this.dateStartBefore = {
        disabledDate(time) {
          return date ? dateFormate(time, 'YYYYMMDD') * 1 > date * 1 : false
        }
      }
    },
    // 下拉框联动
    selectChange(newName) {
      this.$set(this.$refs.qmDialog.formData, 'futuresVarietiesCode', newName.futuresVarietiesCode)
      this.$set(this.$refs.qmDialog.formData, 'futuresVarietiesName', newName.futuresVarietiesName)
      this.$set(this.$refs.qmDialog.formData, 'contractMultiplier', newName.contractMultiplier)
      this.$set(this.$refs.qmDialog.formData, 'exchangeId', newName.exchangeId)
      this.$set(this.$refs.qmDialog.formData, 'exchangeName', newName.exchangeName)
      this.$set(this.$refs.qmDialog.formData, 'currencyCode', newName.currencyCode)
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
      if (this.opType === 'add') {
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
    }
  }
}
</script>
