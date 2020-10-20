<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler="handleClose" @deleteRow="deleteRow"></qm-edit-tab>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import product from '@/views/frame/biz/data/product/product.js'
import contractUtil from '@/views/frame/biz/spot/util/contractUtil.js'
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
              case 'CON_DOMESTIC_PC_INFO':
              case 'CON_EXT_PC_INFO':
              case 'dpc':
              case 'epc':
              case 'sc':
              case 'DOM_CON_SC_INFO':
              case 'dsc':
              case 'EXT_CON_SC_INFO':
              case 'esc':
                return param.contractNo
              case 'CON_PCC_INFO':
              case 'CON_SCC_INFO':
              case 'CON_DOMESTIC_PCC_INFO':
              case 'CON_EXT_PCC_INFO':
              case 'dpcc':
              case 'epcc':
              case 'pcc':
              case 'scc':
              case 'DOM_CON_SCC_INFO':
              case 'dscc':
              case 'EXT_CON_SCC_INFO':
              case 'escc':
                return param.changeNo
            }
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            type: 'dialog',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update', 'copy'],
            event: this.dialogEvent,
            callBack: this.handleCallBack
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update', 'copy']
          }
        ],
        table: {
          showSummary: true,
          height: 120,
          cols: [
            {
              label: 'spot.contractLot.form.productName',
              prop: 'productName',
              width: '180'
            },
            ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols),
            ...(this.param.type !== 'add' && this.param.type !== 'update' && this.param.type !== 'copy' ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols),
            {
              label: 'spot.contractLot.form.pricingType',
              prop: 'pricingType',
              element: 'base-select',
              list: this.$t('datadict.pricingType'),
              width: '120',
              align: 'center',
              required: true,
              attrs: {
                clearable: true
              },
              event: this.changePricingType
            },
            {
              label: 'spot.contractLot.form.estimatedPrice',
              prop: 'estimatedPrice',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                type: 'price'
              },
              userChange: this.changeEstimatedPrice
            },
            {
              label: 'spot.contractLot.form.premium',
              prop: 'premium',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                type: 'price'
              },
              userChange: this.changePremium
            },
            {
              label: 'spot.contractLot.form.productQuantity',
              prop: 'productQuantity',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                type: 'weight'
              },
              summary: true,
              format: {
                func: 'weight'
              },
              userChange: this.changeQuantity
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
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                type: 'weight'
              },
              summary: true,
              format: {
                func: 'weight'
              },
              userChange: this.changeMeasurementQuantity
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
            // 原币金额
            {
              label: 'spot.contractLot.form.originalAmount',
              prop: 'originalAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              isShow: false
            },
            // 本币金额
            {
              label: 'spot.contractLot.form.localAmount',
              prop: 'localAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              isShow: false
            },
            // 含税金额
            {
              label: 'spot.contractLot.form.taxedAmount',
              prop: 'taxedAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              isShow: false
            },
            // 税率
            {
              label: 'spot.contractLot.form.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: false,
              attrs: {
                min: 0,
                type: 'taxrate'
              },
              isShow: false,
              userChange: this.changeTaxRate
            },
            // 无税金额
            {
              label: 'spot.contractLot.form.taxFreeAmount',
              prop: 'taxFreeAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
              isShow: false
            },
            // 税额
            {
              label: 'spot.contractLot.form.taxAmount',
              prop: 'taxAmount',
              width: '120',
              align: 'right',
              summary: true,
              format: {
                func: 'money'
              },
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
      type: [String, Object],
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
  watch: {
    'editForm.tradeType'(value) {
      this.$refs.tab.key++
    }
  },
  created() {
    if (contractUtil.isExternal(this.param.billType)) {
      // 外贸
      this.getTableColDefByProp('originalAmount').isShow = true
      this.getTableColDefByProp('localAmount').isShow = true
    } else {
      // 内贸
      this.getTableColDefByProp('taxedAmount').isShow = true
      this.getTableColDefByProp('taxRate').isShow = true
      this.getTableColDefByProp('taxRate').required = true
      this.getTableColDefByProp('taxFreeAmount').isShow = true
      this.getTableColDefByProp('taxAmount').isShow = true
      // this.getTableColDefByProp('centsPoundPrice').isShow = true
    }
  },
  mounted() {
    if (this.param.type === 'add' || this.param.type === 'update' || this.param.type === 'copy') {
      // 取得系统参数：临单合同是否自动生成批次
      request({
        url: '/api/sys/sysProcess/getValueByCode',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: 'VRM_CON_AUTOLOT'
        }
      }).then(response => {
        this.param.vrmConAutolotFlag = response.data
      })
    }

    if (this.param.type === 'add' && this.param.contractNo !== undefined && this.param.contractNo !== null && this.param.contractNo !== '') {
      // 变更新增的场合
      const contractNo = this.param.contractNo
      let api = null
      switch (this.param.billType) {
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_DOMESTIC_PC_INFO':
        case 'CON_EXT_PC_INFO':
        case 'dpc':
        case 'epc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          api = '/api/contract/pcProductDetail/listByContractNo'
          break
        case 'CON_SCC_INFO':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          api = '/api/contract/scProductDetail/listByContractNo'
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
    dialogEvent() {
      if (this.editForm.whType && this.editForm.whType === '2') {
        Vue.component('view-form-tab', () => import('./chooseFutures.vue'))
      } else if (this.editForm.whType && this.editForm.whType === '3') {
        Vue.component('view-form-tab', () => import('./chooseStorage.vue'))
      } else if (this.editForm.whType && this.editForm.whType === '4') {
        Vue.component('view-form-tab', () => import('./chooseSaleContract.vue'))
      } else {
        Vue.component('view-form-tab', () => import('@/views/frame/biz/data/productItem/choose.vue'))
      }
      this.$refs.tab.dialogDetailVisible = true
    },
    getApi() {
      switch (this.param.billType) {
        case 'pc':
        case 'CON_PC_INFO':
        case 'dpc':
        case 'CON_DOMESTIC_PC_INFO':
        case 'epc':
        case 'CON_EXT_PC_INFO':
          return '/api/contract/pcProductDetail/listByContractNo'
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'dpcc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'epcc':
        case 'CON_EXT_PCC_INFO':
          return '/api/contract/pccProductDetail/listByChangeNo'
        case 'CON_SC_INFO':
        case 'sc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
          return '/api/contract/scProductDetail/listByContractNo'
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return '/api/contract/sccProductDetail/listByChangeNo'
      }
    },
    getPurchaseSaleType() {
      switch (this.param.billType) {
        case 'CON_PC_INFO':
        case 'CON_PCC_INFO':
        case 'pc':
        case 'pcc':
          return 'P'
        case 'CON_SC_INFO':
        case 'CON_SCC_INFO':
        case 'sc':
        case 'scc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return 'S'
      }
    },
    getTableColDefByProp(prop) {
      const cols = this.tab.table.cols
      for (let i = 0; i < cols.length; i++) {
        if (cols[i].prop === prop) {
          return cols[i]
        }
      }
    },
    calcAmount() {
      contractUtil.tabCalcAmount(this)
    },
    handleClose(params) {
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        const newRow = this.$refs.tab.tableData[_index]
        newRow.productDetailNo = 'TEMP-' + toolUtil.uuid()
        newRow.productCode = row.productCode
        newRow.productName = row.productName
        newRow.brand = row.brand
        newRow.spec = row.spec
        newRow.origin = row.origin
        newRow.productKeyAttr01 = row.productKeyAttr01
        newRow.productKeyAttr02 = row.productKeyAttr02
        newRow.productKeyAttr03 = row.productKeyAttr03
        newRow.productUnitCode = row.productUnitCode
        newRow.measurementUnitCode = row.measurementUnitCode
        newRow.pricingType = '1'
        newRow.premium = 0
        if (this.editForm.whType && (this.editForm.whType === '2' || this.editForm.whType === '3' || this.editForm.whType === '4')) {
          newRow.productQuantity = row.productQuantity
          newRow.measurementQuantity = row.measurementQuantity
          newRow.warehouseName = row.warehouseName
          newRow.warehouseCode = row.warehouseCode
          newRow.contractNo = row.contractNo
          newRow.documentProductDetailNo = row.productDetailNo
          if (this.editForm.whType === '2' || this.editForm.whType === '3') {
            this.addDistribution(newRow, row.productDetailNo)
          } else {
            this.addRelated(newRow, row.productDetailNo)
          }
        }
        this.getDefaultTaxRate(newRow)
      })
    },
    addDistribution(row, productDetailNo) {
      const newRow = {}
      newRow.whSource = this.editForm.whType
      newRow.whType = this.editForm.whType
      newRow.documentNo = row.contractNo
      newRow.documentProductDetailNo = row.documentProductDetailNo
      newRow.productDetailNo = row.productDetailNo
      newRow.productCode = row.productCode
      newRow.productName = row.productName
      newRow.brand = row.brand
      newRow.spec = row.spec
      newRow.origin = row.origin
      newRow.productKeyAttr01 = row.productKeyAttr01
      newRow.productKeyAttr02 = row.productKeyAttr02
      newRow.productKeyAttr03 = row.productKeyAttr03
      newRow.productUnitCode = row.productUnitCode
      newRow.measurementUnitCode = row.measurementUnitCode
      newRow.inQuantity = row.productQuantity
      newRow.measurementQuantity = row.measurementQuantity
      newRow.warehouseName = row.warehouseName
      newRow.warehouseCode = row.warehouseCode
      newRow.pricingType = row.pricingType
      this.$parent.$refs.distributionList[0].$refs.tab.tableData.push(newRow)
      if (this.editForm.whType === '2') {
        this.addRelated(row, productDetailNo)
      }
    },
    addRelated(row, productDetailNo) {
      const newRow = {}
      newRow.relatedContractNo = row.contractNo
      newRow.productDetailNo = row.productDetailNo
      newRow.relatedProductDetailNo = productDetailNo
      newRow.productCode = row.productCode
      newRow.productName = row.productName
      newRow.brand = row.brand
      newRow.spec = row.spec
      newRow.origin = row.origin
      newRow.productKeyAttr01 = row.productKeyAttr01
      newRow.productKeyAttr02 = row.productKeyAttr02
      newRow.productKeyAttr03 = row.productKeyAttr03
      newRow.productQuantity = row.productQuantity
      newRow.measurementQuantity = row.measurementQuantity
      this.$parent.$refs.relatedList[0].$refs.tab.tableData.push(newRow)
    },
    getDefaultTaxRate(row) {
      const editForm = toolUtil.getDataEditFromTab(this)
      if (editForm.tradeType === '3') {
        if (editForm.taxRateMap) {
          if (editForm.taxRateMap[row.productCode] !== undefined) {
            row.taxRate = editForm.taxRateMap[row.productCode]
          }
        } else {
          editForm.taxRateMap = {}
        }
        product.getTaxRate(row.productCode, '1').then(taxRate => {
          editForm.taxRateMap[row.productCode] = taxRate
          row.taxRate = taxRate
        })
      }
    },
    deleteRow(row) {
      this.calcAmount()
      if (row.pricingType === '2' || row.pricingType === '3') {
        this.calcPriceInfo()
      }
      const deliveryPlanList = this.$parent.$refs.deliveryPlanList[0].$refs.tab.tableData
      if (deliveryPlanList) {
        const tempArray = deliveryPlanList.filter(subRow => row.productDetailNo !== subRow.productDetailNo)
        deliveryPlanList.splice(0)
        tempArray.forEach(subRow => {
          deliveryPlanList.push(subRow)
        })
      }
      if (this.$parent.$refs.relatedPcList) {
        const relatedPcList = this.$parent.$refs.relatedPcList[0].$refs.tab.tableData
        if (relatedPcList) {
          const tempArray = relatedPcList.filter(subRow => row.productDetailNo !== subRow.productDetailNo)
          relatedPcList.splice(0)
          tempArray.forEach(subRow => {
            relatedPcList.push(subRow)
          })
        }
      }
      if (this.$parent.$refs.relatedScList) {
        const relatedScList = this.$parent.$refs.relatedScList[0].$refs.tab.tableData
        if (relatedScList) {
          const tempArray = relatedScList.filter(subRow => row.productDetailNo !== subRow.productDetailNo)
          relatedScList.splice(0)
          tempArray.forEach(subRow => {
            relatedScList.push(subRow)
          })
        }
      }
      const feeList = this.$parent.$refs.feeList[0].$refs.tab.tableData
      if (feeList) {
        const tempArray = feeList.filter(subRow => {
          return row.productDetailNo !== subRow.productDetailNo
        })
        feeList.splice(0)
        tempArray.forEach(subRow => {
          feeList.push(subRow)
        })
      }

      const distTable = toolUtil.getDataTabFromTab(this, 'distributionList')
      if (distTable) {
        for (let i = distTable.length - 1; i >= 0; i--) {
          if (distTable[i].productDetailNo === row.productDetailNo) {
            distTable.splice(i, 1)
          }
        }
      }

      const relatedTable = this.$parent.$refs.relatedList[0].$refs.tab.tableData
      for (let i = relatedTable.length - 1; i >= 0; i--) {
        if (relatedTable[i].productDetailNo === row.productDetailNo) {
          relatedTable.splice(i, 1)
        }
      }

      // 保证金约定
      const marginRuleTable = toolUtil.getDataTabFromTab(this, 'marginRuleList')
      if (marginRuleTable) {
        const tableData = this.$refs.tab.tableData
        const productMap = new Map()
        for (let i = 0; i < tableData.length; i++) {
          productMap.set(tableData[i].productCode, tableData[i].productName)
        }
        const tempTable = []
        for (let i = 0; i < marginRuleTable.length; i++) {
          if (productMap.has(marginRuleTable[i].productCode)) {
            tempTable.push(marginRuleTable[i])
          }
        }
        if (tempTable.length < marginRuleTable.length) {
          marginRuleTable.splice(0)
          for (let i = 0; i < tempTable.length; i++) {
            marginRuleTable.push(tempTable[i])
          }
        }
      }
    },
    changeQuantity(rowData) {
      if (!this.editForm.whType || this.editForm.whType === '1') {
        return
      }
      if (this.editForm.whType !== '4' && Array.isArray(this.$parent.$refs.distributionList)) {
        let tableData = this.$parent.$refs.distributionList[0].$refs.tab.tableData
        for (let i = 0; i < tableData.length; i++) {
          const data = tableData[i]
          if (data.productDetailNo === rowData.row.productDetailNo) {
            this.$set(data, 'inQuantity', rowData.val)
          }
        }
      }

      let tableData = this.$parent.$refs.relatedList[0].$refs.tab.tableData
      for (let i = 0; i < tableData.length; i++) {
        const data = tableData[i]
        if (data.productDetailNo === rowData.row.productDetailNo) {
          this.$set(data, 'productQuantity', rowData.val)
        }
      }
    },
    changeMeasurementQuantity(rowData) {
      this.calcAmount()

      const row = rowData.row

      if (row.pricingType === '2' || row.pricingType === '3') {
        const prdDataList = this.$refs.tab.tableData
        let measurementQuantity = 0
        for (let i = 0; i < prdDataList.length; i++) {
          const prdRow = prdDataList[i]
          if (prdRow.productCode === row.productCode && prdRow.pricingType === row.pricingType) {
            measurementQuantity += toolUtil.toNum(prdRow.measurementQuantity)
          }
        }
        const priRuleList = toolUtil.getDataTabFromTab(this, 'pricingInfoList')
        for (let i = 0; i < priRuleList.length; i++) {
          const priRow = priRuleList[i]
          if (priRow.productCode === row.productCode && priRow.pricingType === row.pricingType) {
            priRow.pricingQuantity = measurementQuantity
          }
        }
      }

      if (this.editForm.whType && this.editForm.whType === '1') {
        this.calcPriceInfo()
        return
      }

      if (this.editForm.whType !== '4' && Array.isArray(this.$parent.$refs.distributionList)) {
        let tableData = this.$parent.$refs.distributionList[0].$refs.tab.tableData
        for (let i = 0; i < tableData.length; i++) {
          const data = tableData[i]
          if (data.productDetailNo === rowData.row.productDetailNo) {
            this.$set(data, 'measurementQuantity', rowData.val)
          }
        }
      }

      let tableData = this.$parent.$refs.relatedList[0].$refs.tab.tableData
      for (let i = 0; i < tableData.length; i++) {
        const data = tableData[i]
        if (data.productDetailNo === rowData.row.productDetailNo) {
          this.$set(data, 'measurementQuantity', rowData.val)
        }
      }
      this.calcPriceInfo()
    },
    changeEstimatedPrice(rowData) {
      this.calcAmount()
    },
    changeTaxRate(rowData) {
      this.calcAmount()
    },
    changePricingType(rowData) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      const row = rowData.row
      row.pricingType = rowData.val
      if (row.pricingType === '1') {
        row.premium = 0
        const tableData = toolUtil.getDataTabFromSelf(this)
        tableData.push({})
        tableData.pop()
      } else {
      }
      this.calcPriceInfo()
    },
    changePremium(rowData) {
      this.calcAmount()
    },
    calcPriceInfo() {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      const editForm = toolUtil.getDataEditFromTab(this)
      const tableData = this.$refs.tab.$refs.singleTable.data
      const pricingInfoList = this.$parent.$refs.pricingInfoList[0].$refs.tab.tableData
      const tempPriceList = Array.from(pricingInfoList)
      pricingInfoList.splice(0)
      for (let i = 0; i < tempPriceList.length; i++) {
        const priceRow = tempPriceList[i]
        for (let j = 0; j < tableData.length; j++) {
          const dataRow = tableData[j]
          if (dataRow.pricingType !== '2' && dataRow.pricingType !== '3') {
            continue
          }
          if (priceRow.productCode === dataRow.productCode && priceRow.pricingType === dataRow.pricingType) {
            pricingInfoList.push(priceRow)
            break
          }
        }
      }
      for (let i = 0; i < tableData.length; i++) {
        const dataRow = tableData[i]
        if (dataRow.pricingType !== '2' && dataRow.pricingType !== '3') {
          continue
        }
        let match = false
        for (let j = 0; j < pricingInfoList.length; j++) {
          const priceRow = pricingInfoList[j]
          if (priceRow.productCode === dataRow.productCode && priceRow.pricingType === dataRow.pricingType) {
            match = true
            break
          }
        }
        if (!match) {
          pricingInfoList.push({
            productCode: dataRow.productCode,
            pricingType: dataRow.pricingType
          })
        }
      }

      const measurementQuantityMap = {}
      const measurementUnitMap = {}
      const productNameMap = {}
      for (let i = 0; i < tableData.length; i++) {
        const dataRow = tableData[i]
        if (dataRow.pricingType !== '2' && dataRow.pricingType !== '3') {
          continue
        }
        measurementUnitMap[dataRow.productCode] = dataRow.measurementUnitCode
        productNameMap[dataRow.productCode] = dataRow.productName
        const mapKey = dataRow.pricingType + '\t' + dataRow.productCode
        let measurementQuantityOld = toolUtil.toNum(measurementQuantityMap[mapKey])
        const measurementQuantityNew = toolUtil.toNum(dataRow.measurementQuantity)
        if (measurementQuantityOld === null) {
          if (measurementQuantityNew !== null) {
            measurementQuantityOld = measurementQuantityNew
          }
        } else {
          if (measurementQuantityNew !== null) {
            measurementQuantityOld = measurementQuantityOld + measurementQuantityNew
          }
        }
        measurementQuantityMap[mapKey] = measurementQuantityOld
      }
      const psType = this.getPurchaseSaleType()
      for (let i = 0; i < pricingInfoList.length; i++) {
        const priceRow = pricingInfoList[i]
        const mapKey = priceRow.pricingType + '\t' + priceRow.productCode
        priceRow.pricingQuantity = measurementQuantityMap[mapKey]
        priceRow.valueUnit = measurementUnitMap[priceRow.productCode]
        priceRow.productName = productNameMap[priceRow.productCode]
        priceRow.contractCode = editForm.contractNo
        priceRow.purchaseOrSale = psType
      }
    }
  }
}
</script>
