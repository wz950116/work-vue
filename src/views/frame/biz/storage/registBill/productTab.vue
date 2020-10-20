<template>
  <qm-edit-tab ref="tab" :tab="tab" @closeHandler='handleClose'></qm-edit-tab>
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
          search: '/api/warehouse/whRegistProduct/get'
        },
        apiData: {
          search(param) {
            return param.uk || param.id
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            type: 'dialog',
            i18n: 'biz.btn.selectStockDetail',
            component: () => import('@/views/frame/biz/storage/stock/stockSelect.vue'),
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
          cols: [
            {
              label: 'storage.registBill.list.inBillNo',
              prop: 'inBillNo',
              width: '180'
            },
            {
              label: 'storage.registBill.list.lotNo',
              prop: 'lotNo',
              width: '180'
            },
            {
              label: 'storage.registBill.list.supplierName',
              prop: 'supplierName',
              width: '180'
            },
            {
              label: 'storage.registBill.list.warehouseName',
              prop: 'warehouseName',
              width: '180'
            },
            {
              label: 'storage.registBill.list.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              prop: 'itemCount',
              width: '120',
              label: 'storage.registBill.list.itemCount',
              element: 'input-formatter',
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'num',
                clearable: true
              }
            },
            {
              prop: 'registQuantity',
              width: '120',
              label: 'storage.registBill.list.inQuantity',
              element: 'input-formatter',
              summary: true,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'weight',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              required: true
            },
            {
              label: 'storage.registBill.list.productUnitCode',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              prop: 'registMeasurementQuantity',
              width: '120',
              sortable: 'custom',
              label: 'storage.registBill.list.measurementQuantity',
              element: 'input-formatter',
              summary: true,
              align: 'right',
              attrs: {
                gtmin: 0,
                type: 'weight',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              required: true
            },
            {
              label: 'storage.registBill.list.measurementUnitCode',
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
    }
  },
  methods: {
    doDelete(param) {
      this.deleteDetail(param)
    },
    deleteDetail(param) {
      const productDetailKey = this.getProductKey(param)
      const productDetailTableData = this.$parent.$parent.$refs.qmRouteEdit.$refs.inCheckDetailList['0'].$refs.tab.tableData
      for (let i = productDetailTableData.length - 1; i >= 0; i--) {
        const row = productDetailTableData[i]
        if (productDetailKey === this.getProductKey(row)) {
          productDetailTableData.splice(productDetailTableData.indexOf(row), 1)
        }
      }
    },
    getProductKey(param) {
      return param.productCode + param.brand + param.spec + param.origin + param.productKeyAttr01 + param.productKeyAttr02 + param.productKeyAttr03
    },
    validateAdd() {
      if (!this.$parent.editForm.warehouseCode) {
        this.$notify(notifyInfo({ msg: this.$t('storage.registBill.msg.warehouseCodeEmpty') }))
        return false
      }
      if (!this.$parent.editForm.productCode) {
        this.$notify(notifyInfo({ msg: this.$t('storage.registBill.msg.porductCodeEmpty') }))
        return false
      }
      return true
    },
    // 增行打开弹窗设置默认查询条件
    doAdd() {
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.warehouseCode = this.$parent.editForm.warehouseCode
      if (this.$parent.editForm.warehouseCode) {
        this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
          if (info.prop === 'warehouseCode') info.attrs.disabled = true
        })
      }
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.productCodeList = [this.$parent.editForm.productCode]
      if (this.$parent.editForm.productCode) {
        this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
          if (info.prop === 'productCodeList') info.attrs.disabled = true
        })
      }
      // 若需要设置默认查询条件再查询则initSearch设置成false并在此调用请求
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    // 增行弹窗关闭
    handleClose(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['stockDetailNo'] = row.stockDetailNo
        this.$refs.tab.tableData[_index]['inBillNo'] = row.inBillNo
        this.$refs.tab.tableData[_index]['lotNo'] = row.lotNo
        this.$refs.tab.tableData[_index]['inProductNo'] = row.inProductNo
        this.$refs.tab.tableData[_index]['inDetailNo'] = row.inDetailNo
        this.$refs.tab.tableData[_index]['supplierCode'] = row.supplierCode
        this.$refs.tab.tableData[_index]['supplierName'] = row.supplierName
        this.$refs.tab.tableData[_index]['deliverCode'] = row.deliverCode
        this.$refs.tab.tableData[_index]['deliverName'] = row.deliverName
        this.$refs.tab.tableData[_index]['lotProductDetailCode'] = row.lotProductDetailCode
        this.$refs.tab.tableData[_index]['preBillProductDetailCode'] = row.preBillProductDetailCode
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['warehouseCode'] = row.warehouseCode
        this.$refs.tab.tableData[_index]['warehouseName'] = row.warehouseName
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['productReservedNum1'] = row.productReservedNum1
        this.$refs.tab.tableData[_index]['productReservedNum2'] = row.productReservedNum2
        this.$refs.tab.tableData[_index]['productReservedNum3'] = row.productReservedNum3
        this.$refs.tab.tableData[_index]['productReservedNum4'] = row.productReservedNum4
        this.$refs.tab.tableData[_index]['productReservedNum5'] = row.productReservedNum5
        this.$refs.tab.tableData[_index]['productReservedNum6'] = row.productReservedNum6
        this.$refs.tab.tableData[_index]['productReservedNum7'] = row.productReservedNum7
        this.$refs.tab.tableData[_index]['productReservedNum8'] = row.productReservedNum8
        this.$refs.tab.tableData[_index]['productReservedStr1'] = row.productReservedStr1
        this.$refs.tab.tableData[_index]['productReservedStr2'] = row.productReservedStr2
        this.$refs.tab.tableData[_index]['productReservedStr3'] = row.productReservedStr3
        this.$refs.tab.tableData[_index]['productReservedStr4'] = row.productReservedStr4
        this.$refs.tab.tableData[_index]['productReservedStr5'] = row.productReservedStr5
        this.$refs.tab.tableData[_index]['productReservedStr6'] = row.productReservedStr6
        this.$refs.tab.tableData[_index]['productReservedStr7'] = row.productReservedStr7
        this.$refs.tab.tableData[_index]['productReservedStr8'] = row.productReservedStr8
        this.$refs.tab.tableData[_index]['productReservedStr9'] = row.productReservedStr9
        this.$refs.tab.tableData[_index]['productReservedStr10'] = row.productReservedStr10
        this.$refs.tab.tableData[_index]['productReservedStr11'] = row.productReservedStr11
        this.$refs.tab.tableData[_index]['productReservedStr12'] = row.productReservedStr12
        this.$refs.tab.tableData[_index]['stockArea'] = row.stockArea
        this.$refs.tab.tableData[_index]['stockPosition'] = row.stockPosition
        this.$refs.tab.tableData[_index]['stockNo'] = row.stockNo
        this.$refs.tab.tableData[_index]['itemCount'] = '0'
        this.$refs.tab.tableData[_index]['registQuantity'] = row.restQuantity
        this.$refs.tab.tableData[_index]['registMeasurementQuantity'] = row.restMeasurementQuantity
        this.$refs.tab.tableData[_index]['productUnitCode'] = row.productUnitCode
        this.$refs.tab.tableData[_index]['measurementUnitCode'] = row.measurementUnitCode
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
    }
  }
}
</script>
