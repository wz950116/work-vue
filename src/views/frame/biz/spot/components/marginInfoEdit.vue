<template>
  <qm-dialog-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-dialog-edit>
</template>

<script>
import Vue from 'vue'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      edit: {
        initType: 'param',
        type: this.$route.params.type || this.$route.params.opType,
        mode: 'dialog',
        param: this.param,
        initChooseParam: this.initChooseParam,
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
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update', 'copy']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: this.doSelect,
            isShow: ['add', 'update', 'copy'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spot.marginRule.group.editPart1',
            content: [
              {
                label: 'spot.contractLot.form.productCode',
                prop: 'productCode',
                element: 'base-select',
                list: [],
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                event: this.changeProductCode
              },
              {
                label: 'spot.marginRule.from.unpricedBenchmarkCode',
                prop: 'unpricedBenchmarkCode',
                element: 'base-select',
                width: 100,
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRICE_ITEM',
                  filterable: true,
                  params: {
                    priceItemType: '1',
                    usingFlag: '1'
                  },
                  clearable: true
                },
                event: {
                  changeAll: this.changeUnpricedBenchmarkCode
                }
              },
              {
                label: 'spot.marginRule.from.pricedBenchmarkCode',
                prop: 'pricedBenchmarkCode',
                element: 'base-select',
                width: 100,
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRICE_ITEM',
                  filterable: true,
                  params: {
                    priceItemType: '1',
                    usingFlag: '1'
                  },
                  clearable: true
                },
                event: {
                  changeAll: this.changePricedBenchmarkCode
                }
              },
              {},
              {
                label: 'spot.marginRule.from.marginRateInit',
                prop: 'marginRateInit',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  clearable: true
                }
              },
              {
                label: 'spot.marginRule.from.marginRateHold',
                prop: 'marginRateHold',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  clearable: true
                }
              },
              {
                label: 'spot.marginRule.from.creditLimit',
                prop: 'creditLimit',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'money'
                }
              }
            ]
          },
          part2: {
            titleName: 'spot.marginRule.group.editPart2',
            content: [
              {
                label: 'spot.marginRule.from.overdueProcessType',
                prop: 'overdueProcessType',
                list: this.$t('datadict.overdueProcessType'),
                element: 'base-select',
                default: 'B',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {},
                event: this.changeOverdueProcessType
              },
              {
                label: 'spot.marginRule.from.overdueConditionType',
                prop: 'overdueConditionType',
                element: 'base-select',
                list: this.$t('datadict.overdueConditionType'),
                width: 100,
                default: 'R',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true
                },
                event: this.changeOverdueConditionType
              },
              {
                label: 'spot.marginRule.from.overdueConditionHour',
                prop: 'overdueConditionHour',
                element: 'input-validate',
                isShow: false,
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
                label: 'spot.marginRule.from.overdueConditionTime',
                prop: 'overdueConditionTime',
                element: 'el-time-picker',
                isShow: false,
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  valueFormat: 'HHmmss',
                  format: 'HH:mm',
                  step: '00:01'
                }
              },
              {
                label: 'spot.marginRule.from.marginRateStop',
                prop: 'marginRateStop',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  clearable: true
                },
                isShow: true
              }
            ]
          },
          part3: {
            titleName: 'spot.marginRule.group.editPart3',
            content: [
              {
                label: 'spot.marginRule.from.marginReturnFlag',
                prop: 'marginReturnFlag',
                list: this.$t('datadict.yesNo'),
                element: 'base-select',
                default: '1',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {},
                event: this.changeMarginReturnFlag
              },
              {
                label: 'spot.marginRule.from.marginRateReturn',
                prop: 'marginRateReturn',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'percent',
                  clearable: true
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
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    },
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    },
    productNameMap: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    const productCodeItem = toolUtil.getDefFormItemByProp(this, 'productCode')
    this.edit.type = this.initChooseParam.type
    if (this.initChooseParam.type === 'add') {
      productCodeItem.list = this.initChooseParam.data.productList
    } else {
      const formData = this.initChooseParam.data.formData
      productCodeItem.list = [
        {
          key: formData.productCode,
          value: formData.productCode,
          label: formData.productName
        }
      ]
      const editForm = this.$refs.qmEdit.editForm
      Object.assign(editForm, formData)
      this.changeOverdueProcessType(editForm.overdueProcessType)
      this.changeOverdueConditionType(editForm.overdueConditionType)
      this.changeMarginReturnFlag(editForm.marginReturnFlag)
    }
    for (let i = 0; i < productCodeItem.list.length; i++) {
      const productCode = productCodeItem.list[i].value
      const productName = productCodeItem.list[i].label
      this.productNameMap[productCode] = productName
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    saveCheck() {
      return true
    },
    doSelect() {
      const validateArr = []
      const editForm = this.$refs.qmEdit.editForm
      var refForms = this.$refs.qmEdit.$refs.refForm
      for (let i = 0; i < refForms.length; i++) {
        refForms[i].validate(valid => validateArr.push(valid))
      }
      if (validateArr.includes(false)) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.saveCheck') }))
        return
      }

      const marginRateStop = toolUtil.toNum(editForm.marginRateStop)
      const marginRateHold = toolUtil.toNum(editForm.marginRateHold)
      const marginRateInit = toolUtil.toNum(editForm.marginRateInit)
      const marginRateReturn = toolUtil.toNum(editForm.marginRateReturn)
      if (marginRateHold > marginRateInit) {
        this.$notify(notifyInfo({ msg: '维持保证金率不可以大于初始保证金率' }))
        return
      }
      if (editForm.overdueConditionType === 'R' && marginRateStop > marginRateHold) {
        this.$notify(notifyInfo({ msg: '终止保证金率必须小于维持保证金率' }))
        return
      }

      if (this.initChooseParam.data.thirdPartyHostFlag === '1') {
        if (editForm.marginReturnFlag !== '1') {
          this.$notify(notifyInfo({ msg: '第三方代收时，必须退还保证金' }))
          return
        }
      }
      if (editForm.marginReturnFlag === '1' && marginRateReturn < marginRateInit) {
        this.$notify(notifyInfo({ msg: '退还保证金率必须大于初始保证金率' }))
        return
      }

      if (this.initChooseParam.event) {
        if (this.initChooseParam.event.beforeSave) {
          if (this.initChooseParam.event.beforeSave(editForm) === false) {
            return
          }
        }
      }
      this.handleCloseDialog()
      if (this.initChooseParam.event) {
        if (this.initChooseParam.event.afterSave) {
          this.initChooseParam.event.afterSave(editForm)
        }
      }
    },
    changeUnpricedBenchmarkCode(item) {
      const editForm = this.$refs.qmEdit.editForm
      editForm.unpricedBenchmarkName = item.name
    },
    changePricedBenchmarkCode(item) {
      const editForm = this.$refs.qmEdit.editForm
      editForm.pricedBenchmarkName = item.name
    },
    changeProductCode(value) {
      const editForm = this.$refs.qmEdit.editForm
      editForm.productName = this.productNameMap[value]
      // 去掉默认保证金率
      request({
        url: '/api/data/productMarginRate/getByProduct',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: value
        }
      }).then(response => {
        if (response.status) {
          editForm.marginRateInit = response.data.marginRateInit
          editForm.marginRateHold = response.data.marginRateHold
          editForm.marginRateStop = response.data.marginRateStop
          editForm.marginRateReturn = response.data.marginRateReturn
        }
      })
    },
    changeOverdueConditionType(item) {
      // 终止保证金率
      if ('R' === item) {
        toolUtil.getDefFormItemByProp(this, 'overdueConditionHour').isShow = false
        toolUtil.getDefFormItemByProp(this, 'overdueConditionTime').isShow = false
        toolUtil.getDefFormItemByProp(this, 'marginRateStop').isShow = true
      } else if ('T' === item) {
        // 时间点
        toolUtil.getDefFormItemByProp(this, 'overdueConditionHour').isShow = false
        toolUtil.getDefFormItemByProp(this, 'overdueConditionTime').isShow = true
        toolUtil.getDefFormItemByProp(this, 'marginRateStop').isShow = false
      } else {
        toolUtil.getDefFormItemByProp(this, 'overdueConditionHour').isShow = true
        toolUtil.getDefFormItemByProp(this, 'overdueConditionTime').isShow = false
        toolUtil.getDefFormItemByProp(this, 'marginRateStop').isShow = false
      }
    },
    changeOverdueProcessType(val) {
      const overdueConditionTypeItem = toolUtil.getDefFormItemByProp(this, 'overdueConditionType')
      const editForm = this.$refs.qmEdit.editForm
      if (val === 'B') {
        overdueConditionTypeItem.attrs.disabled = true
        editForm.overdueConditionType = 'R'
      } else {
        overdueConditionTypeItem.attrs.disabled = false
      }
      this.changeOverdueConditionType(editForm.overdueConditionType)
    },
    changeMarginReturnFlag(val) {
      const marginRateReturnItem = toolUtil.getDefFormItemByProp(this, 'marginRateReturn')
      if (val === '0') {
        marginRateReturnItem.isShow = false
      } else {
        marginRateReturnItem.isShow = true
      }
    }
  }
}
</script>
