<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
export default {
  name: 'pricingConfirmEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/pricingInfo/getByCode',
          update: '/api/pricingInfo/confirm'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
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
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['assist', 'audit']
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
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spot.pricingConfirm.group.editPart1',
            content: [
              {
                label: 'spot.pricingConfirm.form.contractCode',
                prop: 'contractCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.pricingReg.form.pricingCode',
                prop: 'pricingCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.pricingConfirm.form.purchaseOrSale',
                prop: 'purchaseOrSale',
                element: 'base-select',
                list: this.$t('datadict.purchaseOrSale'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.pricingConfirm.form.currency',
                prop: 'currency',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.pricingConfirm.form.productName',
                prop: 'productName',
                element: 'input-validate',
                attrs: {
                  data: 'DD_PRODUCT',
                  disabled: true
                }
              },
              {
                label: 'spot.pricingConfirm.form.pricingType',
                prop: 'pricingType',
                element: 'base-select',
                list: this.$t('datadict.pricingType'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.pricingConfirm.form.pricingBenchmark',
                prop: 'pricingItemName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'spot.pricingConfirm.form.pricingTime',
                prop: 'pricingTime',
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              }
            ]
          },
          part2: {
            titleName: 'spot.pricingConfirm.group.confirmPart1',
            content: [
              {
                label: 'spot.pricingConfirm.form.pricingQuantity',
                prop: 'pricingQuantity',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  min: 0,
                  max: 999999999999.999,
                  type: 'weight'
                }
              },
              {
                label: 'spot.pricingConfirm.form.confirmQuantity',
                prop: 'confirmQuantity',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: this.$route.params.pricingType === '3',
                  min: 0,
                  max: 999999999999.999,
                  type: 'weight'
                }
              },
              {
                label: 'spot.pricingLot.form.valueUnit',
                prop: 'valueUnit',
                element: 'base-select',
                list: this.$t('datadict.measurementUnit'),
                attrs: {
                  disabled: true
                }
              },
              {},
              {
                label: 'spot.pricingConfirm.form.price',
                prop: 'price',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  min: 0,
                  max: 999999999999.999,
                  type: 'money'
                }
              },
              {
                label: 'spot.pricingConfirm.form.confirmPrice',
                prop: 'confirmPrice',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'money'
                }
              },
              {},
              {
                label: 'spot.pricingConfirm.form.confirmNote',
                prop: 'confirmNote',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  cols: 4
                }
              }
            ]
          }
        },

        tabs: []
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
      default: 'router'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    // 初始化回调
    handleInitCallback(param) {
      // 初始化时，“确认数量”要默认设置为“定价数量”
      if (!this.$refs.qmEdit.$refs.qmRouteEdit.editForm.confirmQuantity) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.confirmQuantity = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.pricingQuantity
      }
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: { ...(!!param && { refresh: !!param }) }
        })
      })
    }
  }
}
</script>
