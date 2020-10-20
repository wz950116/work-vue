<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: this.getApi()
        },
        apiData: {
          search(param) {
            if (param.uk) {
              return param.uk
            }
            switch (param.billType) {
              case 'CON_PC_INFO':
              case 'CON_SC_INFO':
              case 'pc':
              case 'sc':
              case 'DOM_CON_SC_INFO':
              case 'dsc':
              case 'EXT_CON_SC_INFO':
              case 'esc':
              case 'CON_DOMESTIC_PC_INFO':
              case 'CON_EXT_PC_INFO':
              case 'dpc':
              case 'epc':
                return param.contractNo
              case 'CON_PCC_INFO':
              case 'CON_SCC_INFO':
              case 'pcc':
              case 'scc':
              case 'DOM_CON_SCC_INFO':
              case 'dscc':
              case 'EXT_CON_SCC_INFO':
              case 'escc':
              case 'CON_DOMESTIC_PCC_INFO':
              case 'CON_EXT_PCC_INFO':
              case 'dpcc':
              case 'epcc':
                return param.changeNo
            }
          }
        },
        topBar: [
          {
            name: 'addDlvPlnSgl',
            iconName: '线性-每月交付',
            i18n: 'spot.contractLot.btn.addDlvPln',
            isShow: ['add', 'update', 'copy'],
            event: this.addDlvPlnSgl
          },
          {
            name: 'addDlvPlnMon',
            iconName: '线性-每月交付',
            i18n: 'spot.contractLot.btn.addDlvPlnMon',
            isShow: ['add', 'update', 'copy'],
            event: this.addDlvPlnMon
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update', 'copy']
          }
        ],
        table: {
          cols: [
            {
              type: 'date',
              label: 'spot.contractLot.form.deliveryDateStart',
              prop: 'deliveryDateStart',
              required: true,
              width: '150',
              align: 'center',
              attrs: {
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyyMMdd'
              }
            },
            {
              type: 'date',
              label: 'spot.contractLot.form.deliveryDateEnd',
              required: true,
              prop: 'deliveryDateEnd',
              width: '150',
              align: 'center',
              attrs: {
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyyMMdd'
              }
            },
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '180'
            },
            ...this.$store.state.user.mainGoodColsTxt,
            {
              label: 'spot.contractLot.form.productQuantity',
              prop: 'productQuantity',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.measurementQuantity',
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.premium',
              prop: 'premium',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: -999999999999.99,
                max: 999999999999.99,
                type: 'money'
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
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  mounted() {
    if (this.param.type === 'add' && this.param.contractNo !== undefined && this.param.contractNo !== null && this.param.contractNo !== '') {
      // 变更新增的场合
      const contractNo = this.param.contractNo
      let api = null
      switch (this.param.billType) {
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          api = '/api/contract/pcDeliveryPlan/listByContractNo'
          break
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          api = '/api/contract/scDeliveryPlan/listByContractNo'
          break
      }
      request({
        url: api,
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: contractNo
        }
      }).then(response => {
        if (response.data) {
          const tableData = this.$refs.tab.tableData
          for (let i = 0; i < response.data.length; i++) {
            response.data[i].id = null
            tableData.push(response.data[i])
          }
        }
      })
    }
  },
  methods: {
    getApi() {
      switch (this.param.billType) {
        case 'CON_PC_INFO':
        case 'pc':
        case 'CON_DOMESTIC_PC_INFO':
        case 'CON_EXT_PC_INFO':
        case 'dpc':
        case 'epc':
          return '/api/contract/pcDeliveryPlan/listByContractNo'
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          return '/api/contract/pccDeliveryPlan/listByChangeNo'
        case 'CON_SC_INFO':
        case 'sc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
          return '/api/contract/scDeliveryPlan/listByContractNo'
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return '/api/contract/sccDeliveryPlan/listByChangeNo'
      }
    },
    defaultAttr(attr) {
      return attr === '' || attr === null || attr === undefined ? '-' : attr
    },
    strToDate(str) {
      if (str === '' || str === null || str === undefined) {
        return null
      }
      const y = parseInt(str.substr(0, 4))
      const m = parseInt(str.substr(4, 2)) - 1
      const d = parseInt(str.substr(6, 2))
      return new Date(y, m, d, 0, 0, 0, 0)
    },
    dateToStr(dt) {
      if (dt === null || dt === undefined) {
        return ''
      }
      const y = dt.getFullYear()
      const m = dt.getMonth() + 1
      const d = dt.getDate()
      return (y * 10000 + m * 100 + d).toString()
    },
    strToNum(str) {
      if (str === '' || str === null || str === undefined) {
        return null
      }
      return parseFloat(str)
    },
    addDlvPlnSgl() {
      const productDtlList = this.$parent.$parent.$parent.$refs.productDetailList[0].$refs.tab.tableData
      const deliveryPlanList = this.$refs.tab.tableData
      const prdDtlMap = new Map()
      for (let i = 0; i < productDtlList.length; i++) {
        const row = productDtlList[i]
        const rowKey = row.productCode + '\t' + this.defaultAttr(row.brand) + '\t' + this.defaultAttr(row.spec) + '\t' + this.defaultAttr(row.origin) + '\t' + this.defaultAttr(row.productKeyAttr01) + '\t' + this.defaultAttr(row.productKeyAttr02) + '\t' + this.defaultAttr(row.productKeyAttr03)
        let dlvPlnRow = prdDtlMap.get(rowKey)
        if (dlvPlnRow === undefined) {
          dlvPlnRow = {
            productDetailNo: row.productDetailNo,
            productCode: row.productCode,
            productName: row.productName,
            brand: row.brand,
            spec: row.spec,
            origin: row.origin,
            productKeyAttr01: row.productKeyAttr01,
            productKeyAttr02: row.productKeyAttr02,
            productKeyAttr03: row.productKeyAttr03,
            premium: 0
          }
          prdDtlMap.set(rowKey, dlvPlnRow)
        }
      }
      prdDtlMap.forEach((v, k, m) => {
        deliveryPlanList.push(v)
      })
    },
    addDlvPlnMon() {
      const editForm = this.$parent.$parent.$parent.editForm
      const productDtlList = this.$parent.$parent.$parent.$refs.productDetailList[0].$refs.tab.tableData
      const deliveryPlanList = this.$refs.tab.tableData
      const prdDtlMap = new Map()
      for (let i = 0; i < productDtlList.length; i++) {
        const row = productDtlList[i]
        const rowKey = row.productCode + '\t' + this.defaultAttr(row.brand) + '\t' + this.defaultAttr(row.spec) + '\t' + this.defaultAttr(row.origin) + '\t' + this.defaultAttr(row.productKeyAttr01) + '\t' + this.defaultAttr(row.productKeyAttr02) + '\t' + this.defaultAttr(row.productKeyAttr03)
        let dlvPlnRow = prdDtlMap.get(rowKey)
        if (dlvPlnRow === undefined) {
          dlvPlnRow = {
            productDetailNo: row.productDetailNo,
            productCode: row.productCode,
            productName: row.productName,
            brand: row.brand,
            spec: row.spec,
            origin: row.origin,
            productKeyAttr01: row.productKeyAttr01,
            productKeyAttr02: row.productKeyAttr02,
            productKeyAttr03: row.productKeyAttr03,
            productQuantity: this.strToNum(row.productQuantity),
            measurementQuantity: this.strToNum(row.measurementQuantity),
            premium: 0
          }
          prdDtlMap.set(rowKey, dlvPlnRow)
        } else {
          dlvPlnRow.productQuantity += this.strToNum(row.productQuantity)
          dlvPlnRow.measurementQuantity += this.strToNum(row.measurementQuantity)
        }
      }

      const mainDtS = this.strToDate(editForm.deliveryDateStart)
      const mainDtE = this.strToDate(editForm.deliveryDateEnd)
      if (mainDtS === null || mainDtE === null) {
        this.showMsg('spot.contractLot.msg.noDeliveryDate')
      }
      const monthCount = mainDtE.getFullYear() * 12 + mainDtE.getMonth() - (mainDtS.getFullYear() * 12 + mainDtS.getMonth()) + 1

      prdDtlMap.forEach((v, k, m) => {
        if (v.productQuantity === null || v.productQuantity === 0 || v.productQuantity === undefined) {
          v.productQuantity = null
        } else {
          v.productQuantity = v.productQuantity / monthCount
        }
        if (v.measurementQuantity === null || v.measurementQuantity === 0 || v.measurementQuantity === undefined) {
          v.measurementQuantity = null
        } else {
          v.measurementQuantity = v.measurementQuantity / monthCount
        }
      })

      deliveryPlanList.splice(0)
      for (let i = 0; i < monthCount; i++) {
        mainDtE.setTime(mainDtS.getTime())
        mainDtE.setDate(1)
        mainDtE.setMonth(mainDtE.getMonth() + 1)
        mainDtE.setDate(0)
        let dtStrS = this.dateToStr(mainDtS)
        let dtStrE = this.dateToStr(mainDtE)
        mainDtS.setDate(1)
        mainDtS.setMonth(mainDtS.getMonth() + 1)
        if (i === monthCount - 1) {
          dtStrE = editForm.deliveryDateEnd
        }
        if (i === 0) {
          dtStrS = editForm.deliveryDateStart
        }
        prdDtlMap.forEach((v, k, m) => {
          const dlvPlnRow = JSON.parse(JSON.stringify(v))
          dlvPlnRow.deliveryDateStart = dtStrS
          dlvPlnRow.deliveryDateEnd = dtStrE
          deliveryPlanList.push(dlvPlnRow)
        })
      }
    }
  }
}
</script>
