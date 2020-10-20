<template>
  <qm-edit v-el-drag-dialog :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        api: {
          view: '/api/dd/spot/market/get',
          save: '/api/dd/spot/market/save',
          update: '/api/dd/spot/market/update'
        },
        apiData: {
          view(params) {
            return params.marketCode
          },
          save(params) {
            return params.marketCode
          },
          update(params) {
            return params.marketCode
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
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'data.spotMarket.group.editFormPart1',
            content: [
              {
                label: 'data.spotMarket.form.marketName',
                prop: 'marketName',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              {
                label: 'data.spotMarket.form.marketType',
                prop: 'marketType',
                element: 'base-select',
                list: this.$t('datadict.marketType'),
                attrs: {
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'data.spotMarket.form.marketLevel',
                prop: 'marketLevel',
                element: 'base-select',
                list: this.$t('datadict.marketLevel'),
                attrs: {
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'data.spotMarket.form.usingFlag',
                prop: 'usingFlag',
                element: 'base-select',
                default: '1',
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
              }
            ]
          }
        },

        tabs: [
          {
            name: 'marketProductDtoList',
            label: 'data.spotMarket.tab.product',
            required: true,
            component: () => import('./productTag.vue')
          },
          {
            name: 'marketAreaCodeList',
            label: 'data.spotMarket.tab.area',
            component: () => import('./areaTag.vue')
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
      default: 'router'
    },
    param: {
      type: [Object, String],
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
