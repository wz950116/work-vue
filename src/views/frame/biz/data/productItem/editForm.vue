<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/dd/productItem/get',
          save: '/api/dd/productItem/save',
          update: '/api/dd/productItem/update'
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
            titleName: 'data.productItem.group.editFormPart1',
            content: [
              {
                label: 'data.productItem.form.productName',
                prop: 'productCode',
                element: 'base-select',
                isShow: true,
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRODUCT',
                  filterable: true,
                  clearable: true
                }
              },
              {
                label: 'data.productItem.form.brand',
                prop: 'brand',
                element: 'input-validate',
                isShow: this.$store.state.user.showGoodCols.includes('brand'),
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'data.productItem.form.spec',
                prop: 'spec',
                element: 'el-input',
                isShow: this.$store.state.user.showGoodCols.includes('spec'),
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'data.productItem.form.origin',
                prop: 'origin',
                element: 'input-validate',
                isShow: this.$store.state.user.showGoodCols.includes('origin'),
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'goods.productKeyAttr01',
                prop: 'productKeyAttr01',
                isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr01'),
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'goods.productKeyAttr02',
                prop: 'productKeyAttr02',
                isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr02'),
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'goods.productKeyAttr03',
                prop: 'productKeyAttr03',
                isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr03'),
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'data.productItem.form.allocationType',
                prop: 'allocationType',
                type: 'radio',
                list: this.$t('datadict.allocationType'),
                default: '0',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              }
            ]
          }
        },
        tabs: [
          {
            name: 'productAllocationList',
            label: 'data.productItem.tab.allocationTag',
            component: () => import('./allocationTag.vue')
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
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
