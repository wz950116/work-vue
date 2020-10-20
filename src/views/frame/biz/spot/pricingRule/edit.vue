<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @closeLv2Dialog='hanldeCloseSelectDialog'></qm-edit>
</template>

<script>
import Vue from 'vue'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'pricingRuleEdit',
  data() {
    return {
      edit: {
        initType: 'param',
        type: 'update',
        mode: 'dialog',
        param: this.param,
        api: {
          view: ''
        },
        apiData: {
          view(param) {
            return param.id
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: this.doSelect,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.pricingLotSelect',
            type: 'dialog',
            iconName: '线性-增行',
            getParam() {
              return {}
            },
            isShow: ['update'],
            event: this.dialogEvent
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spot.pricingRule.group.editPart1',
            content: [
              {
                label: 'spot.pricingRule.form.contractCode',
                prop: 'contractCode',
                element: 'input-validate',
                validate: [
                  {
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingRule.form.purchaseOrSale',
                prop: 'purchaseOrSale',
                element: 'base-select',
                list: this.$t('datadict.purchaseOrSale'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingRule.form.productName',
                prop: 'productName',
                element: 'input-validate'
              },
              {
                label: 'spot.pricingRule.form.pricingType',
                prop: 'pricingType',
                element: 'base-select',
                list: this.$t('datadict.pricingType'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingRule.form.pricingQuantity',
                prop: 'pricingQuantity',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'weight'
                }
              },
              {
                label: 'spot.pricingRule.form.valueUnit',
                prop: 'valueUnit',
                element: 'base-select',
                list: this.$t('datadict.measurementUnit'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingRule.form.note',
                prop: 'note',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              }
            ]
          },
          part2: {
            titleName: 'spot.pricingRule.group.editPart2',
            content: [
              {
                label: 'spot.pricingRule.form.pricingBenchmark',
                prop: 'pricingBenchmark',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRICE_ITEM',
                  clearable: true
                }
              },
              {
                label: 'spot.pricingRule.form.baseDate',
                prop: 'baseDate',
                element: 'base-select',
                list: this.$t('datadict.baseDate'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {},
                event: this.changeBaseDateMode,
                default: '4'
              },
              {
                label: 'spot.pricingRule.form.pricingPeriod',
                prop: 'pricingPeriod',
                element: 'base-select',
                list: this.$t('datadict.pricingPeriod'),
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                },
                event: this.changeBaseDateMode
              },
              {
                label: 'spot.pricingRule.form.monthBegin',
                prop: 'monthBegin',
                element: 'base-select',
                list: this.$t('datadict.pricingMonth'),
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingRule.form.dayBegin',
                prop: 'dayBegin',
                element: 'input-formatter',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  min: 0,
                  max: 31,
                  type: 'num'
                }
              },
              {
                label: 'spot.pricingRule.form.monthEnd',
                prop: 'monthEnd',
                element: 'base-select',
                list: this.$t('datadict.pricingMonth'),
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingRule.form.dayEnd',
                prop: 'dayEnd',
                element: 'input-formatter',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  min: 0,
                  max: 31,
                  type: 'num'
                }
              },
              {
                label: 'spot.pricingRule.form.dayBefore',
                prop: 'dayBefore',
                element: 'input-formatter',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  min: 0,
                  type: 'num'
                }
              },
              {
                label: 'spot.pricingRule.form.dayAfter',
                prop: 'dayAfter',
                element: 'input-formatter',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  min: 0,
                  type: 'num'
                }
              },
              {
                type: 'date',
                label: 'spot.pricingRule.form.pricingTime',
                props: ['pricingTimeStart', 'pricingTimeEnd'],
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.pricingRule.form.minQuantity',
                prop: 'minQuantity',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  type: 'weight',
                  disabled: this.$props.param.pricingType ? this.$props.param.pricingType === '3' : false
                }
              },
              {
                label: 'spot.pricingRule.form.maxQuantity',
                prop: 'maxQuantity',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  type: 'weight',
                  disabled: this.$props.param.pricingType ? this.$props.param.pricingType === '3' : false
                }
              },
              {
                label: 'spot.pricingRule.form.pricingRight',
                prop: 'pricingRight',
                element: 'base-select',
                list: this.$t('datadict.pricingRight'),
                validate: [
                  {
                    required: this.$props.param.pricingType ? this.$props.param.pricingType !== '3' : false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true,
                  disabled: this.$props.param.pricingType ? this.$props.param.pricingType === '3' : false
                },
                event: this.changePricingRight
              },
              {
                label: 'spot.pricingRule.form.ourRightLevel',
                prop: 'ourRightLevel',
                element: 'input-formatter',
                validate: [
                  {
                    required: this.$props.param.pricingType ? this.$props.param.pricingType !== '3' : false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 100,
                  type: 'percent',
                  disabled: this.$props.param.pricingType ? this.$props.param.pricingType === '3' : false
                }
              },
              {
                label: 'spot.pricingRule.form.otherRightLevel',
                prop: 'otherRightLevel',
                element: 'input-formatter',
                validate: [
                  {
                    required: this.$props.param.pricingType ? this.$props.param.pricingType !== '3' : false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 100,
                  type: 'percent',
                  disabled: this.$props.param.pricingType ? this.$props.param.pricingType === '3' : false
                }
              }
            ]
          },
          part3: {
            titleName: 'spot.pricingRule.group.editPart3',
            content: [
              {
                label: 'spot.pricingRule.form.overdueMode',
                prop: 'overdueMode',
                element: 'base-select',
                list: this.$t('datadict.overdueMode'),
                validate: [
                  {
                    required: this.$props.param.pricingType ? this.$props.param.pricingType !== '3' : false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: this.$props.param.pricingType ? this.$props.param.pricingType === '3' : false
                },
                event: this.changeOverdueMode
              },
              {
                label: 'spot.pricingRule.form.deferCycleMode',
                prop: 'deferCycleMode',
                element: 'base-select',
                list: this.$t('datadict.deferCycleMode'),
                validate: [
                  {
                    required: this.$props.param.pricingType ? this.$props.param.pricingType !== '3' : false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true,
                  disabled: this.$props.param.pricingType ? this.$props.param.pricingType === '3' : false
                }
              },
              {
                label: 'spot.pricingRule.form.deferFee',
                prop: 'deferFee',
                element: 'input-formatter',
                validate: [
                  {
                    required: this.$props.param.pricingType ? this.$props.param.pricingType !== '3' : false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  type: 'price',
                  disabled: this.$props.param.pricingType ? this.$props.param.pricingType === '3' : false
                }
              },
              {
                label: 'spot.pricingRule.form.overduePricingType',
                prop: 'overduePricingType',
                element: 'base-select',
                list: this.$t('datadict.overduePricingType'),
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true,
                  disabled: true
                }
              },
              {
                label: 'spot.pricingRule.form.overduePricingNote',
                prop: 'overduePricingNote',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  disabled: true
                }
              }
            ]
          },
          part4: {
            titleName: 'spot.pricingRule.group.editPart4',
            content: [
              {
                label: 'spot.pricingRule.form.premium',
                prop: 'premium',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'price'
                }
              }
            ]
          }
        }
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
    },
    opMode: {
      type: String,
      default: 'dialog'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  mounted() {
    const initData = {
      baseDate: '4',
      minQuantity: 0,
      maxQuantity: this.param.pricingQuantity,
      pricingRight: '0',
      ourRightLevel: 100,
      otherRightLevel: 0,
      overdueMode: '0',
      deferCycleMode: '0',
      deferFee: 0,
      premium: 0
    }
    const initData2 = {
      baseDate: '4',
      maxQuantity: this.param.pricingQuantity,
      premium: 0
    }
    setTimeout(() => {
      const editForm = this.$refs.qmEdit.$refs.qmDialogEdit.editForm
      if (this.param.pricingType !== '3') {
        Object.assign(initData, this.param)
        Object.assign(editForm, initData)
      } else {
        Object.assign(initData2, this.param)
        Object.assign(editForm, initData2)
      }
      this.changeOverdueMode()
      this.changeBaseDateMode()
    }, 10)
  },
  methods: {
    getDefault(val, dft) {
      return val === null || val === undefined ? dft : val
    },
    changePricingRight(val) {
      const data = this.$children[0].$refs.qmDialogEdit.editForm
      if (val === '0') {
        data.ourRightLevel = '100'
        data.otherRightLevel = '0'
        this.edit.formData.part2.content[13].attrs.disabled = true
        this.edit.formData.part2.content[14].attrs.disabled = true
      } else if (val === '1') {
        data.ourRightLevel = '0'
        data.otherRightLevel = '100'
        this.edit.formData.part2.content[13].attrs.disabled = true
        this.edit.formData.part2.content[14].attrs.disabled = true
      } else if (val === '2') {
        data.ourRightLevel = null
        data.otherRightLevel = null
        this.edit.formData.part2.content[13].attrs.disabled = false
        this.edit.formData.part2.content[14].attrs.disabled = false
      }
    },
    changeOverdueMode() {
      const data = this.$children[0].$refs.qmDialogEdit.editForm
      if (data.pricingType !== '3') {
        if (data.overdueMode === '0') {
          // 递延费

          this.edit.formData.part3.content[1].attrs.disabled = false
          this.$children[0].$refs.qmDialogEdit.rules.deferCycleMode[0].required = true

          this.edit.formData.part3.content[2].attrs.disabled = false
          this.$children[0].$refs.qmDialogEdit.rules.deferFee[0].required = true

          this.edit.formData.part3.content[3].attrs.disabled = true
          this.$children[0].$refs.qmDialogEdit.rules.overduePricingType[0].required = false
          data.overduePricingType = null
          this.edit.formData.part3.content[4].attrs.disabled = true
          data.overduePricingNote = null
        } else {
          // 递延周期
          this.edit.formData.part3.content[1].attrs.disabled = true
          this.$children[0].$refs.qmDialogEdit.rules.deferCycleMode[0].required = false
          data.deferCycleMode = null
          this.edit.formData.part3.content[2].attrs.disabled = true
          this.$children[0].$refs.qmDialogEdit.rules.deferFee[0].required = false
          data.deferFee = null
          this.edit.formData.part3.content[3].attrs.disabled = false
          this.$children[0].$refs.qmDialogEdit.rules.overduePricingType[0].required = true
          this.edit.formData.part3.content[4].attrs.disabled = false
        }
      }
    },
    changeBaseDateMode() {
      const data = this.$children[0].$refs.qmDialogEdit.editForm

      if (data.baseDate === '4') {
        // 锚定日是指定日
        this.edit.formData.part2.content[2].attrs.disabled = true
        data.pricingPeriod = null
        this.$children[0].$refs.qmDialogEdit.rules.pricingPeriod[0].required = false

        this.edit.formData.part2.content[9].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.pricingTimeStart[0].required = true

        this.edit.formData.part2.content[10].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.pricingTimeEnd[0].required = true
      } else {
        // 锚定日不是指定日
        this.edit.formData.part2.content[2].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.pricingPeriod[0].required = true

        this.edit.formData.part2.content[9].attrs.disabled = true
        data.pricingTimeStart = null
        this.$children[0].$refs.qmDialogEdit.rules.pricingTimeStart[0].required = false

        this.edit.formData.part2.content[10].attrs.disabled = true
        data.pricingTimeEnd = null
        this.$children[0].$refs.qmDialogEdit.rules.pricingTimeEnd[0].required = false
      }

      if (data.baseDate !== '4' && data.pricingPeriod !== '6') {
        // 锚定日不是指定日，定价期不是D
        this.edit.formData.part2.content[3].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.monthBegin[0].required = true
        this.edit.formData.part2.content[4].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.dayBegin[0].required = true
        this.edit.formData.part2.content[5].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.monthEnd[0].required = true
        this.edit.formData.part2.content[6].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.dayEnd[0].required = true
      } else {
        this.edit.formData.part2.content[3].attrs.disabled = true
        data.monthBegin = null
        this.$children[0].$refs.qmDialogEdit.rules.monthBegin[0].required = false
        this.edit.formData.part2.content[4].attrs.disabled = true
        data.dayBegin = null
        this.$children[0].$refs.qmDialogEdit.rules.dayBegin[0].required = false
        this.edit.formData.part2.content[5].attrs.disabled = true
        data.monthEnd = null
        this.$children[0].$refs.qmDialogEdit.rules.monthEnd[0].required = false
        this.edit.formData.part2.content[6].attrs.disabled = true
        data.dayEnd = null
        this.$children[0].$refs.qmDialogEdit.rules.dayEnd[0].required = false
      }

      if (data.baseDate !== '4' && data.pricingPeriod === '6') {
        // 锚定日不是指定日，定价期是D
        this.edit.formData.part2.content[7].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.dayBefore[0].required = true
        this.edit.formData.part2.content[8].attrs.disabled = false
        this.$children[0].$refs.qmDialogEdit.rules.dayAfter[0].required = true
      } else {
        this.edit.formData.part2.content[7].attrs.disabled = true
        data.dayBefore = null
        this.$children[0].$refs.qmDialogEdit.rules.dayBefore[0].required = false
        this.edit.formData.part2.content[8].attrs.disabled = true
        data.dayAfter = null
        this.$children[0].$refs.qmDialogEdit.rules.dayAfter[0].required = false
      }
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    doSelect() {
      const data = this.$children[0].$refs.qmDialogEdit.editForm
      const validateArr = []
      if (this.$children[0].$refs.qmDialogEdit.$refs.refForm instanceof Array) {
        this.$children[0].$refs.qmDialogEdit.$refs.refForm.forEach(r => {
          r.validate(valid => {
            validateArr.push(valid)
          })
        })
      } else {
        this.$children[0].$refs.qmDialogEdit.$refs.refForm.validate(valid => {
          validateArr.push(valid)
        })
      }
      if (!Number.isNaN(parseFloat(data.minQuantity)) && !Number.isNaN(parseFloat(data.maxQuantity))) {
        if (parseFloat(data.minQuantity) > parseFloat(data.maxQuantity)) {
          this.$notify(notifyInfo({ msg: this.$t('spot.pricingRule.msg.minMaxCompare') }))
          return
        }
      }
      if (!validateArr.includes(false)) {
        const data = this.$children[0].$refs.qmDialogEdit.editForm
        this.handleCloseDialog(data)
      }
    },
    dialogEvent() {
      if (this.$parent.$parent.param.type === 'add' || this.$parent.$parent.param.type === 'copy') {
        Vue.component('view-form-edit', () => import('./lotSelect.vue'))
        this.$refs.qmEdit.$refs.qmDialogEdit.dialogLv2Visible = true
        $(document).ready(() => {
          $(this.$refs.qmEdit.$refs.qmDialogEdit.$refs.viewFormEdit.$el)
            .appendTo('#app-main .app-container')
            .find('.mask')
            .css('z-index', 2000)
            .siblings('.dialog-container')
            .css('z-index', 2001)
        })
      } else {
        this.$notify(notifyInfo({ msg: this.$t('spot.pricingRule.msg.updCanNotRelLot') }))
      }
    },
    hanldeCloseSelectDialog(param) {
      if (param) {
        param.id = ''

        const priceRow = this.$refs.qmEdit.$refs.qmDialogEdit.editForm

        // 定价批次号
        priceRow.pricingLotCode = param.pricingLotCode

        // 锚定日
        priceRow.baseDate = '4'

        // 点价权
        if (!priceRow.pricingRight) {
          priceRow.pricingRight = '0'
        }
        // 买方比例
        if (!priceRow.ourRightLevel) {
          priceRow.ourRightLevel = 100
        }
        // 卖方比例
        if (!priceRow.otherRightLevel) {
          priceRow.otherRightLevel = 0
        }
        // 处理方式
        if (!priceRow.overdueMode) {
          priceRow.overdueMode = '0'
        }
        // 递延周期
        if (!priceRow.deferCycleMode) {
          priceRow.deferCycleMode = '0'
        }
        // 递延费
        if (!priceRow.deferFee) {
          priceRow.deferFee = 0
        }
        // 逾期定价方式
        if (!priceRow.overduePricingType) {
          priceRow.overduePricingType = '2'
        }

        // 定价开始日
        priceRow.pricingTimeStart = param.pricingTimeStart
        // 定价结束日
        priceRow.pricingTimeEnd = param.pricingTimeEnd

        // 每次最大数量
        priceRow.maxQuantity = priceRow.pricingQuantity

        // 定价数量
        priceRow.valueQuantity = priceRow.pricingQuantity

        // 定价基准
        priceRow.pricingBenchmark = param.pricingBenchmark
        // 升贴水
        priceRow.premium = param.premium
      }
    }
  }
}
</script>
