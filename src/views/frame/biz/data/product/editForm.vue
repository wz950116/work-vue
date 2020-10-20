<template>
  <qm-route-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @initCallback='initCallback'></qm-route-edit>
</template>

<script>
export default {
  name: 'ddProductEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        initType: 'api',
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/dd/product/get',
          save: '/api/dd/product/save',
          update: '/api/dd/product/update'
        },
        apiData: {
          view(param) {
            return param.productCode
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
            extraEvent: this.beforeSave,
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'data.product.group.editFormPart1',
            content: [
              {
                label: 'data.product.form.productName',
                prop: 'productName',
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
                label: 'data.product.form.productGroup',
                prop: 'productGroupCode',
                element: 'tree-group',
                component: () => import('../productGroup/TreeProductGroup'),
                attrs: {
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              {
                label: 'data.product.form.productUnitCode',
                prop: 'productUnitCode',
                element: 'base-select',
                list: this.$t('datadict.goodsUnit'),
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
                label: 'data.product.form.measurementUnitCode',
                prop: 'measurementUnitCode',
                element: 'base-select',
                list: this.$t('datadict.measurementUnit'),
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
                label: 'data.product.form.priceItemCode',
                prop: 'priceItemCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRICE_ITEM',
                  clearable: true,
                  params: {
                    usingFlag: '1'
                  }
                }
              },
              {
                label: 'data.product.form.usingFlag',
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
              // {
              //   label: 'data.product.form.costCalArgument',
              //   prop: 'costCalArgument',
              //   element: 'base-select',
              //   list: this.$t('datadict.costCalArgument'),
              //   attrs: {
              //     clearable: true,
              //     params: {
              //       costCalArgument: '0'
              //     }
              //   }
              // },
              {},
              {
                label: 'data.product.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true
                }
              }
            ]
          }
        },
        tables: [
          {
            name: 'marginRateTab',
            label: 'data.product.tab.marginRate',
            component: () => import('./margin/marginRate.vue')
          },
          {
            name: 'marginFormulaList',
            label: 'data.product.tab.marginFormula',
            component: () => import('./margin/marginFormula.vue')
          }
        ],
        tabs: [
          {
            name: 'taxList',
            label: 'data.product.tab.taxRate',
            component: () => import('./taxRateTab.vue')
          }
        ]
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
    initCallback() {},
    beforeSave() {
      const editForm = this.$refs.qmEdit.editForm
      const marginRate = this.$refs.qmEdit.$refs.marginRateTab[0].$refs.tab.tabForm
      editForm.marginRate = marginRate
      return true
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'product'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: Object.assign({}, this.$route.params.backParam, { refresh: !!param })
        })
      })
    }
  }
}
</script>
