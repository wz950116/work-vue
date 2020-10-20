
<!--选择采购合同(单选)-->
<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('spot.contractLot.popup.chooseStorage'),
        moreShowFlg: false,
        initType: 'param',
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'spot.contractLot.form.warehouseName',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'brand',
            element: 'input-validate',
            isShow: false,
            attrs: {
              clearable: true
            }
          },
          {
            label: 'goods.spec',
            prop: 'spec',
            element: 'input-validate',
            isShow: true,
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'origin',
            element: 'input-validate',
            isShow: false,
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'productKeyAttr01',
            element: 'input-validate',
            isShow: false,
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'productKeyAttr02',
            element: 'input-validate',
            isShow: false,
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'productKeyAttr03',
            element: 'input-validate',
            isShow: false,
            attrs: {
              clearable: true
            }
          }
        ],
        mainData: {
          initSearch: true,
          api: {
            search: '/api/warehouse/stockProductDetail/listSpot'
          },
          apiData: {
            search(param) {
              return Object.assign(param, { defaultSortString: 'warehouseName.desc,brand.desc,spec.desc,origin.desc,productKeyAttr01.desc,productKeyAttr02.desc,productKeyAttr03.desc' })
            }
          },
          table: {
            showCheckbox: true,
            cols: [
              {
                label: 'spot.contractLot.form.warehouseName',
                width: '180',
                prop: 'warehouseName'
              },
              {
                label: 'spot.contractLot.form.productName',
                width: '120',
                prop: 'productName'
              },
              ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols),
              ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy' ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols),
              {
                label: 'spot.contractLot.form.canMatchProductQuantity',
                prop: 'productQuantity',
                element: 'input-formatter',
                width: '120',
                align: 'right',
                required: true,
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'weight'
                }
              },
              {
                label: 'spot.contractLot.form.productUnitCode',
                prop: 'productUnitCode',
                width: '90',
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                }
              },
              {
                label: 'spot.contractLot.form.canMatchMeasurementQuantity',
                prop: 'measurementQuantity',
                element: 'input-formatter',
                width: '120',
                align: 'right',
                required: true,
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'weight'
                },
                event: this.changeMeasurementQuantity
              },
              {
                label: 'spot.contractLot.form.measurementUnitCode',
                prop: 'measurementUnitCode',
                width: '90',
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                }
              }
            ]
          }
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        },
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
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
    // 是否进行初始化查询
    // 是否进行初始化查询
    initSearch: {
      type: Boolean,
      default: true
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    },
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  beforeMount() {},
  mounted() {
    if (this.$props.initChooseParam.tradeTypeList) {
      if (Array.isArray(this.$props.initChooseParam.tradeTypeList.value)) {
        if (this.$props.initChooseParam.tradeTypeList.value.length > 0) {
          const formData = this.dialog.formData
          let tradeTypeDef = null
          for (let i = 0; i < formData.length; i++) {
            if (formData[i].prop === 'tradeType') {
              tradeTypeDef = formData[i]
              break
            }
          }
          const tradeTypeDict = this.$t('datadict.tradeType')
          tradeTypeDef.list = []
          for (let i = 0; i < tradeTypeDict.length; i++) {
            if (this.$props.initChooseParam.tradeTypeList.value.includes(tradeTypeDict[i].value)) {
              tradeTypeDef.list.push(tradeTypeDict[i])
            }
          }
          if (this.$props.initChooseParam.tradeTypeList.value.length === 1) {
            tradeTypeDef.attrs.disabled = true
            this.$refs.qmDialogTable.listQuery.data.tradeType = this.$props.initChooseParam.tradeTypeList.value[0]
          }
        }
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
