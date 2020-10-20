<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleCloseDialog' @deleteRow="handleDelete"></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/warehouse/whNegotiateOut/get'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },

        topBar: [
          {
            name: 'add',
            type: 'dialog',
            iconName: '线性-增行',
            i18n: 'biz.btn.outBillNo',
            getParam() {
              return {}
            },
            component: () =>
              import('@/views/frame/biz/storage/outNotice/chooseOutProduct.vue'),
            validate: this.validateAdd,
            initChoose: this.initChooseAdd,
            isShow: ['add', 'update']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update']
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            isShow: ['add', 'update']
          }
        ],
        table: {
          cols: [
            {
              label: 'storage.negotiate.list.outBillNo',
              prop: 'outBillNo',
              width: '180'
            },
            {
              label: 'storage.negotiate.list.outDate',
              prop: 'outDate',
              width: '100',
              align: 'center',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              label: 'storage.negotiate.list.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            ...this.$store.state.user.reserveGoodColsTxt,
            {
              label: 'storage.negotiate.list.itemCount',
              prop: 'itemCount',
              width: '120',
              format: {
                func: 'thousands',
                dict: 0
              }
            },
            {
              label: 'storage.negotiate.list.outQuantity',
              prop: 'outQuantity',
              width: '120',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              label: 'storage.negotiate.list.productUnitCode',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'storage.negotiate.list.measurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              label: 'storage.negotiate.list.measurementUnitCode',
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'storage.negotiate.list.negotiateAmount',
              prop: 'negotiateAmount',
              width: '120',
              element: 'input-formatter',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'money',
                disabled: this.$route.query.type === 'view',
                clearable: true
              },
              event: this.onChangeNegotiateAmount
            },
            {
              label: 'storage.negotiate.list.currencyCode',
              prop: 'currencyCode',
              width: '90',
              align: 'center',
              element: 'base-select',
              list: this.$t('datadict.currency'),
              attrs: {
                disabled: true,
                clearable: true
              }
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    // 点击增行验证
    validateAdd() {
      if (!this.editForm.contractNo) {
        this.$notify(notifyInfo({ msg: this.$t('storage.negotiate.validateMsg.contractNoRequired') }))
        return false
      }
      if (!this.editForm.customerCode) {
        this.$notify(notifyInfo({ msg: this.$t('storage.negotiate.validateMsg.customerCodeRequired') }))
        return false
      }
      return true
    },
    // 点击增行弹框初始化
    initChooseAdd() {
      return {
        'initSearch': true,
        'multiple': true,
        'contractNo': {
          value: this.editForm.contractNo,
          disabled: true
        },
        'customerCode': {
          value: this.editForm.customerCode,
          disabled: true
        }
      }
    },
    // 选择出库商品回调
    handleCloseDialog(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['outBillNo'] = row.outBillNo
        this.$refs.tab.tableData[_index]['outDate'] = row.outDate
        this.$refs.tab.tableData[_index]['outProductNo'] = row.outProductNo
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['itemCount'] = row.itemCount
        this.$refs.tab.tableData[_index]['outQuantity'] = row.outQuantity
        this.$refs.tab.tableData[_index]['measurementQuantity'] = row.measurementQuantity
        this.$refs.tab.tableData[_index]['productUnitCode'] = row.productUnitCode
        this.$refs.tab.tableData[_index]['measurementUnitCode'] = row.measurementUnitCode
        this.$refs.tab.tableData[_index]['currencyCode'] = this.editForm.currencyCode
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.outBillNo + v.outProductNo
            })
            .includes(row.outBillNo + row.outProductNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    handleDelete(param) {
      this.onChangeNegotiateAmount()
    },
    onChangeNegotiateAmount(param) {
      var negotiateAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        if (row['negotiateAmount']) {
          negotiateAmount += Number(row['negotiateAmount'])
        }
      })
      this.editForm.originalCurrencyAmt = negotiateAmount
    }
  }
}
</script>
