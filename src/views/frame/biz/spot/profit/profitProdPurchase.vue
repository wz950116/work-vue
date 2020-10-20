<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        type: 'add',
        param: this.param,
        initChooseParam: this.initChooseParam,
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            isShow: false,
            event: this.addRow
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: false,
            event: this.deleteRow
          }
        ],
        table: {
          showSummary: true,
          cols: [
            {
              label: 'spot.contractLot.form.contractNo',
              prop: 'dtlContractNo',
              element: 'el-input',
              width: '180',
              attrs: {
                disabled: true
              }
            },
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '120'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'spot.contractLot.form.productQuantity',
              prop: 'productQuantity',
              width: '120',
              align: 'right',
              // required: true,
              element: 'input-formatter',
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight',
                disabled: true
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
              label: 'spot.contractLot.form.measurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              // required: true,
              element: 'input-formatter',
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight',
                disabled: true
              }
            },
            {
              label: 'spot.contractLot.form.measurementUnitCode',
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.contractLot.form.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              // required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'taxrate'
              },
              event: this.calcItemTaxRate
            },
            {
              label: 'spot.contractLot.form.localAmount',
              prop: 'localAmount',
              width: '120',
              align: 'right',
              summary: true,
              element: 'input-formatter',
              // required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money',
                disabled: true
              },
              format: {
                func: 'money'
              },
              event: this.calcItemLocalAmount
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
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const initChooseParam = this.$parent.$parent.edit.initChooseParam
      const contractInfo = initChooseParam.contractInfo
      const tableData = this.$refs.tab.tableData
      if (initChooseParam.billType === 'CON_PC_INFO' || initChooseParam.billType === 'CON_PCC_INFO') {
        for (let i = 0; i < initChooseParam.productDetailList.length; i++) {
          const prdInfo = initChooseParam.productDetailList[i]
          tableData.push({
            contractNo: contractInfo.contractNo,
            dtlContractNo: contractInfo.contractNo,
            productDetailNo: prdInfo.productDetailNo,
            productCode: prdInfo.productCode,
            productName: prdInfo.productName,
            brand: prdInfo.brand,
            spec: prdInfo.spec,
            origin: prdInfo.origin,
            productKeyAttr01: prdInfo.productKeyAttr01,
            productKeyAttr02: prdInfo.productKeyAttr02,
            productKeyAttr03: prdInfo.productKeyAttr03,
            productQuantity: prdInfo.productQuantity,
            productUnitCode: prdInfo.productUnitCode,
            measurementQuantity: prdInfo.measurementQuantity,
            measurementUnitCode: prdInfo.measurementUnitCode,
            taxRate: prdInfo.taxRate,
            originalAmount: prdInfo.originalAmount,
            localAmount: prdInfo.localAmount
          })
          const profitItem = this.$parent.$refs.profitItem[0]
          profitItem.calcItem()
        }
      } else if (this.param.type === 'add' || this.param.type === 'update' || this.param.type === 'copy') {
        this.tab.topBar[0].isShow = true
        this.tab.topBar[1].isShow = true
        for (let i = 0; i < this.tab.table.cols.length; i++) {
          const colName = this.tab.table.cols[i].prop
          if (colName === 'dtlContractNo' || colName === 'productQuantity' || colName === 'measurementQuantity' || colName === 'localAmount') {
            this.tab.table.cols[i].attrs.disabled = false
          }
        }
      }
      if (contractInfo.profitItemDto) {
        const purchaseProdList = contractInfo.profitItemDto.purchaseProdList
        if (initChooseParam.billType === 'CON_PC_INFO' || initChooseParam.billType === 'CON_PCC_INFO') {
          for (let i = 0; i < purchaseProdList.length; i++) {
            for (let j = 0; j < tableData.length; j++) {
              if (purchaseProdList[i].productDetailNo === tableData[j].productDetailNo) {
                tableData[j].taxRate = purchaseProdList[i].taxRate
                break
              }
            }
          }
        } else {
          for (let i = 0; i < purchaseProdList.length; i++) {
            tableData.push(purchaseProdList[i])
          }
        }
        const profitItem = this.$parent.$refs.profitItem[0]
        profitItem.calcItem()
        return
      }
      if (this.param.type !== 'add') {
        let requestData = null
        if (initChooseParam.billType === 'CON_PC_INFO' || initChooseParam.billType === 'CON_SC_INFO' || initChooseParam.billType === 'DOM_CON_SC_INFO' || initChooseParam.billType === 'EXT_CON_SC_INFO') {
          requestData = {
            url: '/api/contract/profitProd/listByContractNo',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: {
                billType: initChooseParam.billType,
                contractNo: initChooseParam.billNo,
                purchaseSaleType: 'P'
              }
            }
          }
        } else if (initChooseParam.billType === 'CON_PCC_INFO' || initChooseParam.billType === 'CON_SCC_INFO' || initChooseParam.billType === 'DOM_CON_SCC_INFO' || initChooseParam.billType === 'EXT_CON_SCC_INFO') {
          requestData = {
            url: '/api/contract/profitProdChg/listByChangeNo',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: {
                billType: initChooseParam.billType,
                changeNo: initChooseParam.billNo,
                purchaseSaleType: 'P'
              }
            }
          }
        }
        request(requestData).then(response => {
          if (response.data) {
            const purchaseProdList = response.data
            if (initChooseParam.billType === 'CON_PC_INFO' || initChooseParam.billType === 'CON_PCC_INFO') {
              for (let i = 0; i < purchaseProdList.length; i++) {
                for (let j = 0; j < tableData.length; j++) {
                  if (purchaseProdList[i].productDetailNo === tableData[j].productDetailNo) {
                    tableData[j].taxRate = purchaseProdList[i].taxRate
                    break
                  }
                }
              }
            } else {
              for (let i = 0; i < purchaseProdList.length; i++) {
                tableData.push(purchaseProdList[i])
              }
            }
          }
          const profitItem = this.$parent.$refs.profitItem[0]
          profitItem.calcItem()
        })
      }
    },
    calcItemTaxRate(val) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      val.row.taxRate = val.val
      const profitItem = this.$parent.$refs.profitItem[0]
      profitItem.calcItem()
    },
    calcItemLocalAmount(val) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      val.row.localAmount = val.val
      const profitItem = this.$parent.$refs.profitItem[0]
      profitItem.calcItem()
    },
    addRow() {
      const saleProdRow = this.$parent.$refs.saleProdList[0].$refs.tab.currentRow
      if (saleProdRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.prefitNoSaleProd') }))
        return
      }
      const tableData = this.$refs.tab.tableData
      tableData.push({
        contractNo: saleProdRow.contractNo,
        dtlContractNo: null,
        productDetailNo: saleProdRow.productDetailNo,
        productCode: saleProdRow.productCode,
        productName: saleProdRow.productName,
        brand: saleProdRow.brand,
        spec: saleProdRow.spec,
        origin: saleProdRow.origin,
        productKeyAttr01: saleProdRow.productKeyAttr01,
        productKeyAttr02: saleProdRow.productKeyAttr02,
        productKeyAttr03: saleProdRow.productKeyAttr03,
        productQuantity: null,
        productUnitCode: saleProdRow.productUnitCode,
        measurementQuantity: null,
        measurementUnitCode: saleProdRow.measurementUnitCode,
        taxRate: null,
        localAmount: null
      })
      const profitItem = this.$parent.$refs.profitItem[0]
      profitItem.calcItem()
    },
    deleteRow() {
      this.$refs.tab.doDelete()
      const profitItem = this.$parent.$refs.profitItem[0]
      profitItem.calcItem()
    }
  }
}
</script>
