<template>
  <qm-edit ref='qmEdit' :edit="edit" @closeDialog="handleCloseDialog" @initCallback='initCallback'></qm-edit>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  data() {
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/dd/price/item/get',
          save: '/api/dd/price/item/save',
          update: '/api/dd/price/item/update'
        },
        apiData: {
          view(param) {
            return param
          },
          save(param) {
            return param
          },
          update(param) {
            return param
          }
        },
        topButtons: [
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
            showLoading: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        formData: {
          part1: {
            titleName: 'data.priceItem.group.editFormPart1',
            content: [
              {
                label: 'data.priceItem.form.priceItemName',
                prop: 'priceItemName',
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
                label: 'data.priceItem.form.priceUnitName',
                prop: 'priceUnit',
                element: 'base-select',
                list: this.$t('datadict.priceUnit'),
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
                label: 'data.priceItem.form.usingFlag',
                prop: 'usingFlag',
                element: 'base-select',
                list: this.$t('datadict.usingFlag'),
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
              {},
              {
                label: 'data.priceItem.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true
                }
              }
            ]
          },
          part2: {
            titleName: 'data.priceItem.group.editFormPart2',
            content: [
              {
                label: 'data.priceItem.form.priceItemType',
                prop: 'priceItemType',
                element: 'base-select',
                list: this.$t('datadict.priceItemType'),
                default: '1',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {},
                event: this.changePriceItemType
              },
              {
                label: 'data.priceItem.form.futureProductNo',
                prop: 'futureProductNo',
                element: 'base-select',
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUTURES_VARIETIES',
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'data.priceItem.form.futureContractNo',
                prop: 'futureContractNo',
                element: 'base-select',
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUTURES_CONTRACT',
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'data.priceItem.form.valuationType',
                prop: 'valuationType',
                element: 'base-select',
                list: this.$t('datadict.valuationType'),
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'data.priceItem.form.calcPriceItemCode',
                prop: 'calcPriceItemName',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/data/priceItem/choose.vue'),
                initChoose: this.calcPriceItemCodeInitChoose,
                callback: this.calcPriceItemCodeCallback,
                attrs: {
                  disabled: false,
                  clearable: true
                },
                isShow: false,
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ]
              },
              {
                label: 'data.priceItem.form.calcPricingRate',
                prop: 'calcPricingRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'thousands',
                  precision: 3
                },
                isShow: false
              },
              {
                label: 'data.priceItem.form.calcPricingOffset',
                prop: 'calcPricingOffset',
                element: 'input-formatter',
                validate: [
                  {
                    required: false,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'thousands',
                  precision: 3
                },
                isShow: false
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
  methods: {
    calcPriceItemCodeInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        priceItemTypeNe: {
          value: '4'
        }
      }
    },
    calcPriceItemCodeCallback(result) {
      this.$refs.qmEdit.$refs.qmDialogEdit.editForm.calcPriceItemCode = result.priceItemCode
      this.$refs.qmEdit.$refs.qmDialogEdit.editForm.calcPriceItemName = result.priceItemName
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    changePriceItemType(priceItemType) {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (priceItemType === '1') {
        toolUtil.getDefFormItemByProp(this, 'futureProductNo').isShow = false
        toolUtil.getDefFormItemByProp(this, 'futureContractNo').isShow = false
        toolUtil.getDefFormItemByProp(this, 'valuationType').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPriceItemName').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingRate').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingOffset').isShow = false
        toolUtil.getDefFormItemByProp(this, 'futureProductNo').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'futureContractNo').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'valuationType').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPriceItemName').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingRate').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingOffset').validate[0].required = false
        editForm.futureProductNo = null
        editForm.futureContractNo = null
        editForm.valuationType = null
        editForm.calcPriceItemName = null
        editForm.calcPriceItemCode = null
        editForm.calcPricingRate = null
        editForm.calcPricingOffset = null
      } else if (priceItemType === '2') {
        toolUtil.getDefFormItemByProp(this, 'futureProductNo').isShow = true
        toolUtil.getDefFormItemByProp(this, 'futureContractNo').isShow = false
        toolUtil.getDefFormItemByProp(this, 'valuationType').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPriceItemName').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingRate').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingOffset').isShow = false
        toolUtil.getDefFormItemByProp(this, 'futureProductNo').validate[0].required = true
        toolUtil.getDefFormItemByProp(this, 'futureContractNo').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'valuationType').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPriceItemName').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingRate').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingOffset').validate[0].required = false
        // editForm.futureProductNo = null
        editForm.futureContractNo = null
        editForm.valuationType = null
        editForm.calcPriceItemName = null
        editForm.calcPriceItemCode = null
        editForm.calcPricingRate = null
        editForm.calcPricingOffset = null
      } else if (priceItemType === '3') {
        toolUtil.getDefFormItemByProp(this, 'futureProductNo').isShow = false
        toolUtil.getDefFormItemByProp(this, 'futureContractNo').isShow = true
        toolUtil.getDefFormItemByProp(this, 'valuationType').isShow = true
        toolUtil.getDefFormItemByProp(this, 'calcPriceItemName').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingRate').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingOffset').isShow = false
        toolUtil.getDefFormItemByProp(this, 'futureProductNo').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'futureContractNo').validate[0].required = true
        toolUtil.getDefFormItemByProp(this, 'valuationType').validate[0].required = true
        toolUtil.getDefFormItemByProp(this, 'calcPriceItemName').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingRate').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPricingOffset').validate[0].required = false
        editForm.futureProductNo = null
        // editForm.futureContractNo = null
        editForm.calcPriceItemName = null
        editForm.calcPriceItemCode = null
        editForm.calcPricingRate = null
        editForm.calcPricingOffset = null
      } else if (priceItemType === '4') {
        toolUtil.getDefFormItemByProp(this, 'futureProductNo').isShow = false
        toolUtil.getDefFormItemByProp(this, 'futureContractNo').isShow = false
        toolUtil.getDefFormItemByProp(this, 'valuationType').isShow = false
        toolUtil.getDefFormItemByProp(this, 'calcPriceItemName').isShow = true
        toolUtil.getDefFormItemByProp(this, 'calcPricingRate').isShow = true
        toolUtil.getDefFormItemByProp(this, 'calcPricingOffset').isShow = true
        toolUtil.getDefFormItemByProp(this, 'futureProductNo').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'futureContractNo').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'valuationType').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'calcPriceItemName').validate[0].required = true
        toolUtil.getDefFormItemByProp(this, 'calcPricingRate').validate[0].required = true
        toolUtil.getDefFormItemByProp(this, 'calcPricingOffset').validate[0].required = true
        editForm.futureProductNo = null
        editForm.futureContractNo = null
        editForm.valuationType = null
        // editForm.calcPriceItemCode = null
        // editForm.calcPricingRate = null
        // editForm.calcPricingOffset = null
      }
    },
    initCallback(data) {
      this.changePriceItemType(data.priceItemType)
    }
  }
}
</script>
