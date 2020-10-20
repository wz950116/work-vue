<template>
  <qm-edit-tab ref='tab' :tab='tab' @initCallback='handleInitCallback'></qm-edit-tab>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import i18n from '@/lang/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import selectData from '@/views/frame/biz/data/selectData/selectData.js'
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
            switch (param.billType) {
              case 'CON_PC_INFO':
              case 'pc':
                return {
                  billType: 'CON_PC_INFO',
                  billNo: param.uk || param.contractNo
                }
              case 'CON_DOMESTIC_PC_INFO':
              case 'dpc':
                return {
                  billType: 'CON_DOMESTIC_PC_INFO',
                  billNo: param.uk || param.contractNo
                }
              case 'CON_EXT_PC_INFO':
              case 'epc':
                return {
                  billType: 'CON_EXT_PC_INFO',
                  billNo: param.uk || param.contractNo
                }
              case 'CON_SC_INFO':
              case 'sc':
                return {
                  billType: 'CON_SC_INFO',
                  billNo: param.uk || param.contractNo
                }
              case 'DOM_CON_SC_INFO':
              case 'dsc':
                return {
                  billType: 'DOM_CON_SC_INFO',
                  billNo: param.uk || param.contractNo
                }
              case 'EXT_CON_SC_INFO':
              case 'esc':
                return {
                  billType: 'EXT_CON_SC_INFO',
                  billNo: param.uk || param.contractNo
                }
              case 'CON_PL_INFO':
              case 'pl':
                return {
                  billType: 'CON_PL_INFO',
                  billNo: param.uk || param.lotNo
                }
              case 'CON_DOMESTIC_PL_INFO':
              case 'dpl':
                return {
                  billType: 'CON_DOMESTIC_PL_INFO',
                  billNo: param.uk || param.lotNo
                }
              case 'CON_EXT_PL_INFO':
              case 'epl':
                return {
                  billType: 'CON_EXT_PL_INFO',
                  billNo: param.uk || param.lotNo
                }
              case 'CON_SL_INFO':
              case 'sl':
                return {
                  billType: 'CON_SL_INFO',
                  billNo: param.uk || param.lotNo
                }
              case 'DOM_CON_SL_INFO':
              case 'dsl':
                return {
                  billType: 'DOM_CON_SL_INFO',
                  billNo: param.uk || param.lotNo
                }
              case 'EXT_CON_SL_INFO':
              case 'esl':
                return {
                  billType: 'EXT_CON_SL_INFO',
                  billNo: param.uk || param.lotNo
                }
              case 'CON_PCC_INFO':
              case 'pcc':
                return {
                  billType: 'CON_PCC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'CON_SCC_INFO':
              case 'scc':
                return {
                  billType: 'CON_SCC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'DOM_CON_SCC_INFO':
              case 'dscc':
                return {
                  billType: 'DOM_CON_SCC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'EXT_CON_SCC_INFO':
              case 'escc':
                return {
                  billType: 'EXT_CON_SCC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'CON_PLC_INFO':
              case 'plc':
                return {
                  billType: 'CON_PLC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'CON_DOMESTIC_PLC_INFO':
              case 'dplc':
                return {
                  billType: 'CON_DOMESTIC_PLC_INFO',
                  billNo: param.uk || param.lotNo
                }
              case 'CON_EXT_PLC_INFO':
              case 'eplc':
                return {
                  billType: 'CON_EXT_PLC_INFO',
                  billNo: param.uk || param.lotNo
                }
              case 'CON_SLC_INFO':
              case 'slc':
                return {
                  billType: 'CON_SLC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'DOM_CON_SLC_INFO':
              case 'dslc':
                return {
                  billType: 'DOM_CON_SLC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'EXT_CON_SLC_INFO':
              case 'eslc':
                return {
                  billType: 'EXT_CON_SLC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'CON_DOMESTIC_PCC_INFO':
              case 'dpcc':
                return {
                  billType: 'CON_DOMESTIC_PCC_INFO',
                  billNo: param.uk || param.changeNo
                }
              case 'CON_EXT_PCC_INFO':
              case 'epcc':
                return {
                  billType: 'CON_EXT_PCC_INFO',
                  billNo: param.uk || param.changeNo
                }
            }
          }
        },
        topBar: [
          {
            name: 'set',
            type: 'dialog',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            $refs: this.$refs,
            isShow: ['add', 'update', 'copy'],
            component: () => import('@/views/frame/biz/spot/components/marginInfoEdit.vue'),
            initChoose: this.getDialogParamEditAdd,
            validate: this.validateAdd
          },
          {
            name: 'set',
            type: 'dialog',
            iconName: '线性-修改',
            i18n: 'biz.btn.update',
            $refs: this.$refs,
            isShow: ['add', 'update', 'copy'],
            component: () => import('@/views/frame/biz/spot/components/marginInfoEdit.vue'),
            initChoose: this.getDialogParamEditUpdate,
            validate: this.checkSelectRow
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update', 'copy']
          },
          {
            name: 'set',
            type: 'dialog',
            iconName: '线性-查看',
            i18n: 'biz.btn.view',
            $refs: this.$refs,
            component: () => import('@/views/frame/biz/spot/components/marginInfoEdit.vue'),
            initChoose: this.getDialogParamEditView,
            validate: this.checkSelectRow
          },
          {
            i18n: 'spot.marginRule.form.marginDirection',
            prop: 'marginDirection',
            element: 'base-select',
            attrs: {
              datadict: 'marginDirection'
            }
          },
          {
            i18n: 'spot.marginRule.form.thirdPartyHostFlag',
            prop: 'thirdPartyHostFlag',
            element: 'el-checkbox',
            attrs: {
              trueLabel: '1',
              falseLabel: '0'
            },
            default: '0',
            event: {
              change: this.changeThirdPartyHostFlag
            }
          },
          {
            i18n: 'spot.marginRule.form.marginCustCode',
            prop: 'custCode',
            element: 'qm-simple-select',
            default: '',
            attrs: {
              options: [],
              clearable: true,
              filterable: true
            },
            event: {
              visibleChange: this.viewCustCode
            },
            isShow: false
          },
          {
            i18n: 'spot.marginRule.form.thirdPartyCode',
            prop: 'thirdPartyCode',
            element: 'base-select',
            default: '',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            },
            isShow: false
          }
        ],
        table: {
          cols: [
            {
              label: 'spot.marginRule.list.productName',
              prop: 'productName'
            },
            {
              label: 'spot.marginRule.list.unpricedBenchmarkName',
              prop: 'unpricedBenchmarkName'
            },
            {
              label: 'spot.marginRule.list.pricedBenchmarkName',
              prop: 'pricedBenchmarkName'
            },
            {
              label: 'spot.marginRule.list.marginRateInit',
              prop: 'marginRateInit',
              format: {
                func: 'percent'
              }
            },
            {
              label: 'spot.marginRule.list.marginRateHold',
              prop: 'marginRateHold',
              format: {
                func: 'percent'
              }
            },
            {
              label: 'spot.marginRule.list.overdueProcessType',
              prop: 'overdueProcessType',
              format: {
                dict: this.$t('datadict.overdueProcessType')
              }
            },
            {
              label: 'spot.marginRule.list.overdueConditionType',
              prop: 'overdueConditionType',
              format: {
                dict: this.$t('datadict.overdueConditionType')
              }
            },
            {
              label: 'spot.marginRule.list.marginReturnFlag',
              prop: 'marginReturnFlag',
              format: {
                dict: this.$t('datadict.whetherToRefund')
              }
            },
            {
              label: 'spot.marginRule.list.marginRateReturn',
              prop: 'marginRateReturn',
              format: {
                func: 'percent'
              }
            }
          ]
        }
      },
      cacheData: {
        custMap: new Map(),
        isContract: false
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
    switch (this.param.billType) {
      // 采购合同
      case 'CON_PC_INFO':
      case 'pc':
      // 销售合同
      case 'CON_SC_INFO':
      case 'sc':
      // 内贸采购合同
      case 'CON_DOMESTIC_PC_INFO':
      case 'dpc':
      // 内贸销售合同
      case 'DOM_CON_SC_INFO':
      case 'dsc':
      // 外贸采购合同
      case 'CON_EXT_PC_INFO':
      case 'epc':
      // 外贸销售合同
      case 'EXT_CON_SC_INFO':
      case 'esc':
      // 采购合同变更
      case 'CON_PCC_INFO':
      case 'pcc':
      // 销售合同变更
      case 'CON_SCC_INFO':
      case 'scc':
      // 内贸采购合同变更
      case 'CON_DOMESTIC_PCC_INFO':
      case 'dpcc':
      // 内贸销售合同变更
      case 'DOM_CON_SCC_INFO':
      case 'dscc':
      // 外贸采购合同变更
      case 'CON_EXT_PCC_INFO':
      case 'epcc':
      // 外贸销售合同变更
      case 'EXT_CON_SCC_INFO':
      case 'escc':
        this.cacheData.isContract = true
        break
      // 采购批次
      case 'CON_PL_INFO':
      case 'pl':
      // 销售批次
      case 'CON_SL_INFO':
      case 'sl':
      // 内贸采购批次
      case 'CON_DOMESTIC_PL_INFO':
      case 'dpl':
      // 内贸销售批次
      case 'DOM_CON_SL_INFO':
      case 'dsl':
      // 外贸采购批次
      case 'CON_EXT_PL_INFO':
      case 'epl':
      // 外贸销售批次
      case 'EXT_CON_SL_INFO':
      case 'esl':
      // 采购批次变更
      case 'CON_PLC_INFO':
      case 'plc':
      // 外贸批次变更
      case 'CON_SLC_INFO':
      case 'slc':
      // 内贸采购批次变更
      case 'CON_DOMESTIC_PLC_INFO':
      case 'dplc':
      // 内贸销售批次变更
      case 'DOM_CON_SLC_INFO':
      case 'dslc':
      // 外贸采购批次变更
      case 'CON_EXT_PLC_INFO':
      case 'eplc':
      //  外贸销售批次变更
      case 'EXT_CON_SLC_INFO':
      case 'eslc':
        this.cacheData.isContract = false
        break
    }
    this.changeThirdPartyHostFlag(this.$refs.tab.tabForm.thirdPartyHostFlag)

    if (this.param.type === 'add') {
      let billType = this.param.billType
      let billNo = null
      if (toolUtil.isNotEmpty(this.param.lotNo)) {
        billNo = this.param.lotNo
      } else if (toolUtil.isNotEmpty(this.param.contractNo)) {
        billNo = this.param.contractNo
      }

      if (this.param.billType === 'pcc') {
        billType = 'CON_PC_INFO'
      } else if (this.param.billType === 'scc') {
        billType = 'CON_SC_INFO'
      } else if (this.param.billType === 'plc') {
        billType = 'CON_PL_INFO'
      } else if (this.param.billType === 'slc') {
        billType = 'CON_SL_INFO'
      } else if (this.param.billType === 'dpcc') {
        billType = 'CON_DOMESTIC_PC_INFO'
      } else if (this.param.billType === 'dscc') {
        billType = 'DOM_CON_SC_INFO'
      } else if (this.param.billType === 'dplc') {
        billType = 'CON_DOMESTIC_PL_INFO'
      } else if (this.param.billType === 'dslc') {
        billType = 'DOM_CON_SL_INFO'
      } else if (this.param.billType === 'epcc') {
        billType = 'CON_EXT_PC_INFO'
      } else if (this.param.billType === 'escc') {
        billType = 'EXT_CON_SC_INFO'
      } else if (this.param.billType === 'eplc') {
        billType = 'CON_EXT_PL_INFO'
      } else if (this.param.billType === 'eslc') {
        billType = 'EXT_CON_SL_INFO'
      }
      if (billNo !== null) {
        request({
          url: '/api/contract/conMarginRule/getByContractNo',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              billType: billType,
              billNo: billNo
            }
          }
        }).then(response => {
          if (response.data) {
            const tableData = this.$refs.tab.tableData
            for (let i = 0; i < response.data.length; i++) {
              response.data[i].id = null
              tableData.push(response.data[i])
            }
            this.handleInitCallback(response.data)
          }
        })
      }
    }
  },
  methods: {
    getApi() {
      switch (this.param.billType) {
        case 'CON_PC_INFO':
        case 'pc':
        case 'CON_PL_INFO':
        case 'pl':
        case 'CON_SC_INFO':
        case 'sc':
        case 'CON_SL_INFO':
        case 'sl':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
        case 'DOM_CON_SL_INFO':
        case 'dsl':
        case 'EXT_CON_SL_INFO':
        case 'esl':
        case 'CON_DOMESTIC_PC_INFO':
        case 'CON_EXT_PC_INFO':
        case 'dpc':
        case 'epc':
        case 'CON_DOMESTIC_PL_INFO':
        case 'CON_EXT_PL_INFO':
        case 'dpl':
        case 'epl':
          return '/api/contract/conMarginRule/getByContractNo'
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_PLC_INFO':
        case 'plc':
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
        case 'CON_SLC_INFO':
        case 'slc':
        case 'DOM_CON_SLC_INFO':
        case 'dslc':
        case 'EXT_CON_SLC_INFO':
        case 'eslc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
        case 'CON_DOMESTIC_PLC_INFO':
        case 'CON_EXT_PLC_INFO':
        case 'dplc':
        case 'eplc':
          return '/api/contract/conMarginRuleChange/getByChangeNo'
      }
    },
    getProductList() {
      const checkMap = new Map()
      const productList = []
      const productListAll = toolUtil.getDataTabFromTab(this, 'productDetailList')
      for (let i = 0; i < this.$refs.tab.tableData.length; i++) {
        const row = this.$refs.tab.tableData[i]
        checkMap.set(row.productCode, row.productName)
      }
      for (let i = 0; i < productListAll.length; i++) {
        const row = productListAll[i]
        if (checkMap.has(row.productCode)) {
          continue
        }
        checkMap.set(row.productCode, row.productName)
        productList.push({
          key: row.productCode,
          value: row.productCode,
          label: row.productName
        })
      }
      return productList
    },
    getDialogParamEditAdd() {
      return {
        type: 'add',
        data: {
          productList: this.getProductList(),
          thirdPartyHostFlag: this.$refs.tab.tabForm.thirdPartyHostFlag
        },
        event: {
          afterSave: this.addRow
        }
      }
    },
    getDialogParamEditUpdate() {
      let currentRow = this.$refs.tab.tableData.length === 1 ? this.$refs.tab.tableData[0] : this.$refs.tab.currentRow
      return {
        type: 'update',
        data: {
          formData: currentRow,
          thirdPartyHostFlag: this.$refs.tab.tabForm.thirdPartyHostFlag
        },
        event: {
          afterSave: this.updateRow
        }
      }
    },
    getDialogParamEditView() {
      let currentRow = this.$refs.tab.tableData.length === 1 ? this.$refs.tab.tableData[0] : this.$refs.tab.currentRow
      return {
        type: 'view',
        data: {
          formData: currentRow
        }
      }
    },
    addRow(row) {
      this.$refs.tab.tableData.push(row)
    },
    updateRow(row) {
      let currentRow = this.$refs.tab.tableData.length === 1 ? this.$refs.tab.tableData[0] : this.$refs.tab.currentRow
      Object.assign(currentRow, row)
    },
    handleInitCallback(param) {
      if (param) {
        if (param.length > 0) {
          this.$refs.tab.tabForm.marginDirection = param[0].marginDirection
          this.$refs.tab.tabForm.custCode = param[0].custCode
          this.$refs.tab.tabForm.thirdPartyHostFlag = param[0].thirdPartyHostFlag
          this.$refs.tab.tabForm.thirdPartyCode = param[0].thirdPartyCode
        }
      }
      this.setCustName()
    },
    getCustNameByCode(custCode) {
      return new Promise((resolve, reject) => {
        const custCodeList = []
        if (Array.isArray(custCode)) {
          for (let i = 0; i < custCode.length; i++) {
            if (!toolUtil.isEmpty(custCode[i])) {
              if (!this.cacheData.custMap.has(custCode[i])) {
                custCodeList.push(custCode[i])
              }
            }
          }
        } else if (!toolUtil.isEmpty(custCode)) {
          if (!this.cacheData.custMap.has(custCode)) {
            custCodeList.push(custCode)
          }
        }
        if (custCodeList.length === 0) {
          resolve(this.cacheData.custMap)
          return
        }
        request({
          url: '/api/dd/selectData/get',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              type: 'CUST_INFO',
              code: custCodeList
            }
          }
        }).then(response => {
          if (response.status) {
            for (let i = 0; i < response.data.length; i++) {
              this.cacheData.custMap.set(response.data[i].code, response.data[i].name)
            }
            resolve(this.cacheData.custMap)
            return
          }
        })
      })
    },
    setCustName() {
      const topBar = this.tab.topBar
      const custCode = this.$refs.tab.tabForm.custCode

      if (!toolUtil.isEmpty(custCode)) {
        let selectItemDef = null
        for (let i = 0; i < topBar.length; i++) {
          if (topBar[i].prop === 'custCode') {
            selectItemDef = topBar[i]
            break
          }
        }
        if (selectItemDef) {
          this.getCustNameByCode(custCode).then(custNameMap => {
            selectItemDef.attrs.options.splice(0)
            selectItemDef.attrs.options.push({
              value: custCode,
              label: custNameMap.has(custCode) ? custNameMap.get(custCode) : custCode
            })
            this.$refs.tab.tabForm.custCode = ''
            this.$refs.tab.tabForm.custCode = custCode
          })
        }
      }
      const thirdPartyCode = this.$refs.tab.tabForm.thirdPartyCode
      if (!toolUtil.isEmpty(thirdPartyCode)) {
        let selectItemDef = null
        for (let i = 0; i < topBar.length; i++) {
          if (topBar[i].prop === 'thirdPartyCode') {
            selectItemDef = topBar[i]
            break
          }
        }
        if (selectItemDef) {
          this.getCustNameByCode(thirdPartyCode).then(custNameMap => {
            selectItemDef.attrs.options.splice(0)
            selectItemDef.attrs.options.push({
              value: custCode,
              label: custNameMap.has(custCode) ? custNameMap.get(custCode) : custCode
            })
            this.$refs.tab.tabForm.thirdPartyCode = ''
            this.$refs.tab.tabForm.thirdPartyCode = thirdPartyCode
          })
        }
      }
      this.changeThirdPartyHostFlag(this.$refs.tab.tabForm.thirdPartyHostFlag)
    },
    validateAdd() {
      const productListAll = toolUtil.getDataTabFromTab(this, 'productDetailList')
      if (productListAll.length === 0) {
        this.$notify(notifyInfo({ msg: '请先维护商品信息' }))
        return false
      }
      const productList = this.getProductList()
      if (productList.length === 0) {
        this.$notify(notifyInfo({ msg: '所有的商品均已添加过了' }))
        return false
      }
      return true
    },
    checkSelectRow() {
      let currentRow = this.$refs.tab.tableData.length === 1 ? this.$refs.tab.tableData[0] : this.$refs.tab.currentRow
      if (currentRow === null || currentRow === undefined) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return false
      }
      return true
    },
    changeThirdPartyHostFlag(val) {
      const topBar = this.tab.topBar
      for (let i = 0; i < topBar.length; i++) {
        if (topBar[i].prop === 'custCode') {
          if (val === '1') {
            topBar[i].isShow = false
          } else {
            topBar[i].isShow = this.cacheData.isContract
          }
        } else if (topBar[i].prop === 'thirdPartyCode') {
          if (val === '1') {
            topBar[i].isShow = true
          } else {
            topBar[i].isShow = false
          }
        }
      }
    },
    checkSaveData() {
      const editForm = toolUtil.getDataEditFromTab(this)
      const marginRuleFrom = this.$refs.tab.tabForm
      const marginRuleList = this.$refs.tab.tableData
      if (marginRuleList && marginRuleList.length > 0) {
        let custCodeList = []
        if (Array.isArray(editForm.supplierCodeList)) {
          custCodeList = editForm.supplierCodeList
        } else if (Array.isArray(editForm.customerCodeList)) {
          custCodeList = editForm.customerCodeList
        }
        if (custCodeList.length === 1) {
          this.$refs.tab.tabForm.custCode = custCodeList[0]
        }

        if (toolUtil.isEmpty(marginRuleFrom.marginDirection)) {
          this.$notify(notifyInfo({ msg: '保证金约定收付状态不可为空' }))
          return false
        }
        if (marginRuleFrom.thirdPartyHostFlag === '1') {
          if (toolUtil.isEmpty(marginRuleFrom.thirdPartyCode)) {
            this.$notify(notifyInfo({ msg: '选择第三方待收时,代收服务商不可未空' }))
            return false
          } else if (toolUtil.isEmpty(marginRuleFrom.custCode) && custCodeList.length > 0) {
            marginRuleFrom.custCode = custCodeList[0]
          }
        } else {
          marginRuleFrom.thirdPartyCode = ''
          if (toolUtil.isEmpty(marginRuleFrom.custCode)) {
            this.$notify(notifyInfo({ msg: '保证金客户不可未空' }))
            return false
          }
        }

        if (marginRuleFrom.thirdPartyHostFlag === '1') {
          if (Array.isArray(editForm.supplierCodeList)) {
            if (custCodeList.includes(marginRuleFrom.thirdPartyCode)) {
              this.$notify(notifyInfo({ msg: '代收服务商只可以选择合同供应商以外的客商。' }))
              return false
            }
          } else if (Array.isArray(editForm.customerCodeList)) {
            if (custCodeList.includes(marginRuleFrom.thirdPartyCode)) {
              this.$notify(notifyInfo({ msg: '代收服务商只可以选择合同客户以外的客商。' }))
              return false
            }
          }
        } else {
          if (Array.isArray(editForm.supplierCodeList)) {
            if (!custCodeList.includes(marginRuleFrom.custCode)) {
              this.$notify(notifyInfo({ msg: '保证金客户只可以选择合同供应商范围内选择。' }))
              return false
            }
          } else if (Array.isArray(editForm.customerCodeList)) {
            if (!custCodeList.includes(marginRuleFrom.custCode)) {
              this.$notify(notifyInfo({ msg: '保证金客户只可以选择合同客户范围内选择。' }))
              return false
            }
          }
        }

        for (let i = 0; i < marginRuleList.length; i++) {
          if (marginRuleFrom.thirdPartyHostFlag === '1') {
            if (marginRuleList[i].marginReturnFlag !== '1') {
              this.$notify(notifyInfo({ msg: '第三方代收时，必须退还保证金' }))
              return false
            }
          }
          marginRuleList[i].marginDirection = marginRuleFrom.marginDirection
          marginRuleList[i].marginReturnFlag = marginRuleFrom.thirdPartyHostFlag
          marginRuleList[i].thirdPartyCode = marginRuleFrom.thirdPartyCode
          marginRuleList[i].custCode = marginRuleFrom.custCode
        }
      }
      return true
    },
    setCustCode() {
      // TODO
      const editForm = toolUtil.getDataEditFromTab(this)
      let custCodeList = []
      if (Array.isArray(editForm.supplierCodeList)) {
        custCodeList = editForm.supplierCodeList
      } else if (Array.isArray(editForm.customerCodeList)) {
        custCodeList = editForm.customerCodeList
      }
      let selectItemDef = null
      const topBar = this.tab.topBar
      for (let i = 0; i < topBar.length; i++) {
        if (topBar[i].prop === 'custCode') {
          selectItemDef = topBar[i]
          break
        }
      }
      if (selectItemDef != null) {
        if (custCodeList.length === 0) {
          selectItemDef.attrs.options.splice(0)
          this.$refs.tab.tabForm.custCode = ''
          return
        }
        let custCode = this.$refs.tab.tabForm.custCode
        if (!custCodeList.includes(custCode)) {
          custCode = ''
          this.$refs.tab.tabForm.custCode = custCode
        }
        this.getCustNameByCode(custCodeList).then(custNameMap => {
          selectItemDef.attrs.options.splice(0)
          for (let i = 0; i < custCodeList.length; i++) {
            selectItemDef.attrs.options.push({
              value: custCodeList[i],
              label: custNameMap.has(custCodeList[i]) ? custNameMap.get(custCodeList[i]) : custCodeList[i]
            })
          }

          if (!toolUtil.isEmpty(custCode)) {
            this.$refs.tab.tabForm.custCode = ''
            this.$refs.tab.tabForm.custCode = custCode
          }
        })
      }
      //if (custCodeList.includes(this.$refs.tab.tabForm.thirdPartyCode)) {
      //  this.$refs.tab.tabForm.thirdPartyCode = ''
      //}
    },
    viewCustCode() {
      this.setCustCode()
    }
  }
}
</script>
