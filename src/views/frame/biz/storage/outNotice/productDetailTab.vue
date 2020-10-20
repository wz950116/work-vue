<template>
  <qm-edit-tab ref="tab" :tab="tab" @closeHandler="handleClose"></qm-edit-tab>
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
          search: '/api/warehouse/whOutBill/listProductDetail'
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
            i18n: 'biz.btn.addRow',
            getParam() {
              return {}
            },
            component: () =>
              import('@/views/frame/biz/storage/stock/stockSelect.vue'),
            validate: this.validateAdd,
            setDefault: this.doAdd,
            isShow: ['add', 'update']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update'],
            callback: this.doDelete
          }
        ],
        table: {
          showSummary: true,
          height: 200,
          cols: [
            {
              label: 'storage.outNotice.list.inContractNo',
              width: '180',
              prop: 'inContractNo'
            },
            {
              label: 'storage.outNotice.list.stockDetailNo',
              width: '180',
              prop: 'stockDetailNo'
            },
            {
              label: 'storage.outNotice.list.inBillNo',
              width: '180',
              prop: 'inBillNo'
            },
            {
              label: 'storage.outNotice.list.inProductNo',
              width: '180',
              prop: 'inProductNo'
            },
            {
              label: 'storage.outNotice.list.inDetailNo',
              width: '180',
              prop: 'inDetailNo'
            },
            {
              label: 'storage.outNotice.list.productName',
              width: '180',
              prop: 'productName'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            ...this.$store.state.user.reserveGoodColsTxt,
            {
              label: 'storage.outNotice.list.stockArea',
              width: '100',
              prop: 'stockArea'
            },
            {
              label: 'storage.outNotice.list.stockPosition',
              width: '100',
              prop: 'stockPosition'
            },
            {
              label: 'storage.outNotice.list.stockNo',
              width: '100',
              prop: 'stockNo'
            },
            {
              label: 'storage.outNotice.list.itemCount',
              prop: 'itemCount',
              width: '120',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: this.$route.params.type === 'complete',
                clearable: true
              },
              event: this.onItemCountChange
            },
            {
              label: 'storage.outNotice.list.outQuantity',
              prop: 'outQuantity',
              width: '120',
              element: 'input-formatter',
              summary: true,
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: this.$route.params.type === 'complete',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              required: true,
              event: this.onOutQuantityChange
            },
            {
              label: 'storage.outNotice.list.actualQuantity',
              prop: 'actualQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              isShow: this.$route.params.type === 'view' || this.$route.params.type === 'complete'
            },
            {
              label: 'storage.outNotice.list.productUnitName',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'storage.outNotice.list.outMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              element: 'input-formatter',
              summary: true,
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: this.$route.params.type === 'complete',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              required: true,
              event: this.onMeasurementQuantityChange
            },
            {
              label: 'storage.outNotice.list.actualMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'weight'
              },
              isShow: this.$route.params.type === 'view' || this.$route.params.type === 'complete'
            },
            {
              label: 'storage.outNotice.list.measurementUnitName',
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
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
    handleClose(params) {
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['stockDetailNo'] = row.stockDetailNo
        this.$refs.tab.tableData[_index]['inBillNo'] = row.inBillNo
        this.$refs.tab.tableData[_index]['purchaseContractNo'] = row.contractNo
        this.$refs.tab.tableData[_index]['purchaseLotNo'] = row.lotNo
        this.$refs.tab.tableData[_index]['inProductNo'] = row.inProductNo
        this.$refs.tab.tableData[_index]['inDetailNo'] = row.inDetailNo
        this.$refs.tab.tableData[_index]['inCheckNo'] = row.inCheckNo
        this.$refs.tab.tableData[_index]['inCheckDate'] = row.inCheckDate
        this.$refs.tab.tableData[_index]['inCheckProductNo'] = row.inCheckProductNo
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['stockArea'] = row.stockArea
        this.$refs.tab.tableData[_index]['stockPosition'] = row.stockPosition
        this.$refs.tab.tableData[_index]['stockNo'] = row.stockNo
        this.$refs.tab.tableData[_index]['productUnitCode'] = row.productUnitCode
        this.$refs.tab.tableData[_index]['productUnitName'] = row.productUnitName
        this.$refs.tab.tableData[_index]['measurementUnitCode'] = row.measurementUnitCode
        this.$refs.tab.tableData[_index]['measurementUnitName'] = row.measurementUnitName
        this.$refs.tab.tableData[_index]['outQuantity'] = row.restQuantity
        this.$refs.tab.tableData[_index]['measurementQuantity'] = row.restMeasurementQuantity
        this.$refs.tab.tableData[_index]['inContractNo'] = row.inContractNo
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.stockDetailNo + v.inBillNo + v.inProductNo + v.inDetailNo
            })
            .includes(row.stockDetailNo + row.inBillNo + row.inProductNo + row.inDetailNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 增行按钮做相应验证
    validateAdd() {
      if (!this.editForm.warehouseCode) {
        this.$notify(notifyInfo({ msg: this.$t('storage.outNotice.validateMsg.warehouseCodeRequired') }))
        return false
      }

      const productRow = this.$parent.$parent.$parent.$refs.outProductList['0'].$refs.tab.currentRow
      if (productRow === undefined || productRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('storage.outNotice.validateMsg.oneProductRequired') }))
        return false
      }

      return true
    },
    // 增行打开弹窗设置默认查询条件
    doAdd() {
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.warehouseCode = this.editForm.warehouseCode
      if (this.editForm.warehouseCode) {
        this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
          if (info.prop === 'warehouseCode') info.attrs.disabled = true
        })
      }
      const productRow = this.$parent.$parent.$parent.$refs.outProductList[0].$refs.tab.currentRow
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.productCodeList = [productRow.productCode]
      if (productRow.productCode) {
        this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
          if (info.prop === 'productCodeList') info.attrs.disabled = true
        })
      }
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.brand = productRow.brand
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.spec = productRow.spec
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.origin = productRow.origin
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.productKeyAttr01 = productRow.productKeyAttr01
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.productKeyAttr02 = productRow.productKeyAttr02
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.productKeyAttr03 = productRow.productKeyAttr03
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.contractNos = this.$parent.$parent.$parent.$parent.$parent.contractNos
      // 若需要设置默认查询条件再查询则initSearch设置成false并在此调用请求
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    doDelete(param) {
      this.calculateSum(param)
    },
    onItemCountChange(param) {
      this.calculateSum(param.row)
    },
    onOutQuantityChange(param) {
      const row = param.row
      // if (param.val) {
      //   row.measurementQuantity = param.val
      // }
      this.calculateSum(row)
    },
    onMeasurementQuantityChange(param) {
      this.calculateSum(param.row)
    },
    calculateSum(param) {
      if (!param) {
        return
      }
      const productDetailKey = this.getProductKey(param)
      var itemCountSum = 0
      var outQuantitySum = 0
      var measurementQuantitySum = 0
      this.$refs.tab.tableData.forEach(row => {
        if (productDetailKey === this.getProductKey(row)) {
          if (row['itemCount']) {
            itemCountSum += Number(row['itemCount'])
          }
          if (row['outQuantity']) {
            outQuantitySum += Number(row['outQuantity'])
          }
          if (row['measurementQuantity']) {
            measurementQuantitySum += Number(row['measurementQuantity'])
          }
        }
      })
      const productTableData = this.$parent.$parent.$parent.$refs.outProductList[0].$refs.tab.tableData
      productTableData.forEach(row => {
        if (productDetailKey === this.getProductKey(row)) {
          row.itemCount = itemCountSum
          row.outQuantity = outQuantitySum
          row.measurementQuantity = measurementQuantitySum
          return
        }
      })
    },
    getProductKey(param) {
      return param.productCode + param.brand + param.spec + param.origin + param.productKeyAttr01 + param.productKeyAttr02 + param.productKeyAttr03
    }
  }
}
</script>
