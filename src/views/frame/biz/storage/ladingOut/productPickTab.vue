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
          search: '/api/warehouse/whLadingOutPick/getInfoByLadingOutNo'
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
            component: () => import('@/views/frame/biz/storage/stock/ladingBillSelect.vue'),
            validate: this.validateAdd,
            setDefault: this.doAdd,
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
          height: 140,
          cols: [
            {
              label: 'storage.ladingOut.list.ladingBillNo',
              width: '200',
              prop: 'ladingBillNo'
            },
            {
              label: 'storage.ladingOut.list.ladingProductNo',
              width: '150',
              prop: 'ladingProductNo'
            },
            {
              prop: 'supplierName',
              width: '200',
              align: 'left',
              label: 'storage.ladingOut.list.supplierName'
            },
            {
              label: 'storage.ladingOut.list.productName',
              width: '150',
              prop: 'productName',
              validate: [
                {
                  required: true
                }
              ],
              attrs: {
                disabled: true,
                clearable: true
              }
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'storage.ladingOut.list.itemCount',
              prop: 'itemCount',
              width: '120',
              element: 'input-formatter',
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: this.$route.query.type === 'view' || this.$route.params.type === 'complete'
              }
            },
            {
              label: 'storage.ladingOut.list.ladingOutMeasurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              element: 'input-formatter',
              attrs: {
                disabled: this.$route.params.type === 'complete',
                gtmin: 0,
                type: 'weight'
              },
              required: true
            },
            {
              label: 'storage.ladingOut.list.measurementUnitName',
              prop: 'measurementUnitCode',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              attrs: {
                disabled: true,
                clearable: true
              }
            },
            {
              label: 'storage.ladingOut.list.ladingOutQuantity',
              prop: 'outQuantity',
              width: '120',
              element: 'input-formatter',
              attrs: {
                disabled: this.$route.params.type === 'complete',
                gtmin: 0,
                type: 'weight'
              },
              required: true
            },
            {
              label: 'storage.ladingOut.list.productUnitName',
              prop: 'productUnitCode',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              attrs: {
                disabled: true,
                clearable: true
              }
            },
            ...this.$store.state.user.reserveGoodColsTxt,
            // 选择返回的批次商品编码
            {
              prop: 'lotProductDetailCode',
              isShow: false
            },
            // 选择返回的批次商品编码
            {
              prop: 'preBillProductDetailCode',
              isShow: false
            },
            {
              prop: 'purchaseLotNo',
              isShow: false
            },
            {
              prop: 'purchaseContractNo',
              isShow: false
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
    // 增行按钮做相应验证
    validateAdd() {
      const productRow = this.$parent.$parent.$parent.$refs.whLadingOutProductDtoList['0'].$refs.tab.currentRow
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
      const productRow = this.$parent.$parent.$parent.$refs.whLadingOutProductDtoList[0].$refs.tab.currentRow
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
      // 若需要设置默认查询条件再查询则initSearch设置成false并在此调用请求
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    handleClose(params) {
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['ladingBillNo'] = row.ladingBillNo
        this.$refs.tab.tableData[_index]['ladingProductNo'] = row.ladingProductNo
        this.$refs.tab.tableData[_index]['supplierCode'] = row.supplierCode
        this.$refs.tab.tableData[_index]['supplierName'] = row.supplierName
        this.$refs.tab.tableData[_index]['deliverCode'] = row.deliverCode
        this.$refs.tab.tableData[_index]['deliverName'] = row.deliverName
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['itemCount'] = row.itemCount
        this.$refs.tab.tableData[_index]['measurementQuantity'] = row.restMeasurementQuantity
        this.$refs.tab.tableData[_index]['measurementUnitCode'] = row.measurementUnitCode
        this.$refs.tab.tableData[_index]['outQuantity'] = row.restQuantity
        this.$refs.tab.tableData[_index]['productUnitCode'] = row.productUnitCode
        this.$refs.tab.tableData[_index]['lotProductDetailCode'] = row.lotProductDetailCode
        this.$refs.tab.tableData[_index]['preBillProductDetailCode'] = row.preBillProductDetailCode
        // 采购合同号，采购批次号
        this.$refs.tab.tableData[_index]['purchaseContractNo'] = row.contractNo
        this.$refs.tab.tableData[_index]['purchaseLotNo'] = row.lotNo
      })
      // 后过滤
      // const newData = []
      // this.$refs.tab.tableData.forEach(row => {
      //   if (
      //     !newData
      //       .map(v => {
      //         return v.productCode
      //       })
      //       .includes(row.productCode)
      //   ) {
      //     newData.push(row)
      //   }
      // })
      // this.$refs.tab.tableData = newData
    }
  }
}
</script>
