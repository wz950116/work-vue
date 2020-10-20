<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleCloseDialog'></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        editForm: this.editForm,
        api: {
          search: '/api/warehouse/whTransferOutProduct/listByTransferOutBillNo'
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
            initChoose: this.initChooseAdd,
            isShow: ['add', 'update']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update']
          }
        ],
        table: {
          cols: [
            {
              width: 180,
              align: 'left',
              label: 'storage.transferOut.list.contractNo',
              prop: 'contractNo'
            },
            {
              width: 180,
              align: 'left',
              label: 'storage.transferOut.list.lotNo',
              prop: 'lotNo'
            },
            // 库存商品明细编号
            {
              width: 150,
              align: 'left',
              label: 'storage.transferOut.list.stockDetailNo',
              prop: 'stockDetailNo'
            },
            // 商品
            {
              width: 100,
              align: 'left',
              label: 'storage.transferOut.list.productName',
              prop: 'productName'
            },
            ...this.$store.state.user.mainGoodCols,
            // 调拨件数
            {
              width: 100,
              align: 'right',
              label: 'storage.transferOut.list.itemCount',
              prop: 'itemCount',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: false,
                clearable: true
              }
            },
            // 调拨出库数量
            {
              width: 120,
              align: 'right',
              label: 'storage.transferOut.list.transferOutQuantity',
              prop: 'transferOutQuantity',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: false,
                clearable: true
              },
              required: true
            },
            // 商品单位
            {
              width: 80,
              align: 'center',
              label: 'storage.transferOut.list.productUnitCode',
              prop: 'productUnitCode',
              element: 'base-select',
              list: this.$t('datadict.goodsUnit'),
              attrs: {
                disabled: true,
                clearable: true
              },
              required: true
            },
            // 调拨出库计量数量
            {
              width: 150,
              align: 'right',
              label: 'storage.transferOut.list.transferOutMeasurementQty',
              prop: 'transferOutMeasurementQty',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: false,
                clearable: true
              },
              required: true
            },
            // 计量单位
            {
              width: 80,
              align: 'center',
              label: 'storage.transferOut.list.measurementUnitCode',
              prop: 'measurementUnitCode',
              element: 'base-select',
              list: this.$t('datadict.measurementUnit'),
              attrs: {
                disabled: true,
                clearable: true
              },
              required: true
            },
            // 供应商
            {
              width: 300,
              align: 'left',
              label: 'storage.transferOut.list.supplierName',
              prop: 'supplierName'
            },
            // 发货单位
            {
              width: 300,
              align: 'left',
              label: 'storage.transferOut.list.deliverName',
              prop: 'deliverName'
            },
            // 库区
            {
              width: 80,
              align: 'left',
              label: 'storage.transferOut.list.stockArea',
              prop: 'stockArea'
            },
            // 库位
            {
              width: 80,
              align: 'left',
              label: 'storage.transferOut.list.stockPosition',
              prop: 'stockPosition'
            },
            // 仓储号
            {
              width: 80,
              align: 'left',
              label: 'storage.transferOut.list.stockNo',
              prop: 'stockNo'
            },
            ...this.$store.state.user.reserveGoodCols
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
      if (!this.editForm.outWarehouseCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择调出仓库') }))
        return false
      }
      if (!this.editForm.outDeptCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择调出部门') }))
        return false
      }
      if (!this.editForm.bizOrganCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择业务机构') }))
        return false
      }
      return true
    },
    // 点击增行弹框初始化
    initChooseAdd() {
      return {
        'initSearch': true,
        'multiple': true,
        'warehouseCode': {
          disabled: true,
          value: this.editForm.outWarehouseCode
        },
        'bizOrganCode': {
          disabled: true,
          value: this.editForm.bizOrganCode
        }
      }
    },
    // 增行弹窗关闭
    handleCloseDialog(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['stockDetailNo'] = row.stockDetailNo
        this.$refs.tab.tableData[_index]['inBillNo'] = row.inBillNo
        this.$refs.tab.tableData[_index]['contractNo'] = row.inContractNo
        this.$refs.tab.tableData[_index]['lotNo'] = row.inLotNo
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
        this.$refs.tab.tableData[_index]['transferOutQuantity'] = row.restQuantity
        this.$refs.tab.tableData[_index]['transferOutMeasurementQty'] = row.restMeasurementQuantity
        this.$refs.tab.tableData[_index]['productUnitCode'] = row.productUnitCode
        this.$refs.tab.tableData[_index]['measurementUnitCode'] = row.measurementUnitCode
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (!newData.map(v => { return v.stockDetailNo }).includes(row.stockDetailNo)) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    }
  }
}
</script>
