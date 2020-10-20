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
          search: '/api/warehouse/whOutReturnProduct/listByOutReturnNo'
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
            i18n: 'biz.btn.selectOutProduct',
            component: () => import('@/views/frame/biz/storage/outReturn/chooseOutProduct.vue'),
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
            // 原出库单号
            {
              width: 200,
              align: 'left',
              label: 'storage.outReturn.list.outBillNo',
              prop: 'outBillNo'
            },
            // 原出库商品编号
            {
              width: 200,
              align: 'left',
              label: 'storage.outReturn.list.outProductNo',
              prop: 'outProductNo'
            },
            // 原入库单号
            {
              width: 200,
              align: 'left',
              label: 'storage.outReturn.list.inBillNo',
              prop: 'inBillNo'
            }, // 采购合同号
            {
              width: 200,
              align: 'left',
              label: 'storage.outReturn.list.purchaseContractNo',
              prop: 'purchaseContractNo'
            },
            // 供应商
            {
              width: 200,
              align: 'left',
              label: 'storage.outReturn.list.supplierName',
              prop: 'supplierName'
            },
            // 商品
            {
              width: 100,
              align: 'left',
              label: 'storage.outReturn.list.productName',
              prop: 'productName'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            // 退货件数
            {
              width: 100,
              align: 'right',
              label: 'storage.outReturn.list.itemCount',
              prop: 'itemCount',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: true,
                clearable: true
              }
            },
            // 退货数量
            {
              width: 120,
              align: 'right',
              label: 'storage.outReturn.list.inQuantity',
              prop: 'inQuantity',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true,
                clearable: true
              },
              required: true
            },
            // 商品单位
            {
              width: 80,
              align: 'center',
              label: 'storage.outReturn.list.productUnitCode',
              prop: 'productUnitCode',
              element: 'base-select',
              list: this.$t('datadict.goodsUnit'),
              attrs: {
                disabled: true,
                clearable: true
              },
              required: true
            },
            // 计量数量
            {
              width: 150,
              align: 'right',
              label: 'storage.outReturn.list.measurementQuantity',
              prop: 'measurementQuantity',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'weight',
                disabled: true,
                clearable: true
              },
              required: true
            },
            // 计量单位
            {
              width: 80,
              align: 'center',
              label: 'storage.outReturn.list.measurementUnitCode',
              prop: 'measurementUnitCode',
              element: 'base-select',
              list: this.$t('datadict.measurementUnit'),
              attrs: {
                disabled: true,
                clearable: true
              },
              required: true
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
      if (!this.editForm.customerCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择客户') }))
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
        initSearch: true,
        multiple: true,
        customerCode: {
          disabled: true,
          value: this.editForm.customerCode
        },
        bizOrganCode: {
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
        this.$refs.tab.tableData[_index]['outBillNo'] = row.outBillNo
        this.$refs.tab.tableData[_index]['outProductNo'] = row.outProductNo
        this.$refs.tab.tableData[_index]['customerCode'] = row.customerCode
        this.$refs.tab.tableData[_index]['customerName'] = row.customerName
        this.$refs.tab.tableData[_index]['outPickNo'] = row.outPickNo
        this.$refs.tab.tableData[_index]['lotProductDetailCode'] = row.lotProductDetailCode
        this.$refs.tab.tableData[_index]['preBillProductDetailCode'] = row.preBillProductDetailCode
        // 出库拣配的入库信息
        this.$refs.tab.tableData[_index]['stockDetailNo'] = row.stockDetailNo
        this.$refs.tab.tableData[_index]['inDetailNo'] = row.inDetailNo
        this.$refs.tab.tableData[_index]['inProductNo'] = row.inDetailNo
        this.$refs.tab.tableData[_index]['inBillNo'] = row.inBillNo
        this.$refs.tab.tableData[_index]['inDate'] = row.inDate
        this.$refs.tab.tableData[_index]['inType'] = row.inDate
        this.$refs.tab.tableData[_index]['purchaseContractNo'] = row.purchaseContractNo
        this.$refs.tab.tableData[_index]['purchaseLotNo'] = row.purchaseLotNo
        this.$refs.tab.tableData[_index]['supplierCode'] = row.supplierCode
        this.$refs.tab.tableData[_index]['supplierName'] = row.supplierName
        this.$refs.tab.tableData[_index]['deliverCode'] = row.deliverCode
        this.$refs.tab.tableData[_index]['deliverName'] = row.deliverName
        this.$refs.tab.tableData[_index]['inLotProductDetailCode'] = row.inLotProductDetailCode
        this.$refs.tab.tableData[_index]['inPreProductDetailCode'] = row.inPreProductDetailCode
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
        this.$refs.tab.tableData[_index]['itemCount'] = row.itemCount
        this.$refs.tab.tableData[_index]['inQuantity'] = row.actualQuantity
        this.$refs.tab.tableData[_index]['measurementQuantity'] = row.actualMeasurementQuantity
        this.$refs.tab.tableData[_index]['productUnitCode'] = row.productUnitCode
        this.$refs.tab.tableData[_index]['measurementUnitCode'] = row.measurementUnitCode
      })
      // // 后过滤
      // const newData = []
      // this.$refs.tab.tableData.forEach(row => {
      //   if (!newData.map(v => { return v.outBillNo + v.outProductNo }).includes(row.outBillNo + row.outProductNo)) {
      //     newData.push(row)
      //   }
      // })
      // this.$refs.tab.tableData = newData
    }
  }
}
</script>
