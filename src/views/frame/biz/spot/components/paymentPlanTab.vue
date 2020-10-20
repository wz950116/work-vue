<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
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
              case 'CON_PL_INFO':
              case 'CON_SL_INFO':
              case 'pl':
              case 'sl':
              case 'CON_DOMESTIC_PL_INFO':
              case 'CON_EXT_PL_INFO':
              case 'dpl':
              case 'epl':
                return param.lotNo
              case 'CON_PCC_INFO':
              case 'CON_SCC_INFO':
              case 'CON_PLC_INFO':
              case 'CON_SLC_INFO':
              case 'pcc':
              case 'scc':
              case 'plc':
              case 'slc':
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
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update', 'copy'],
            event: this.doAddRow
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
              label: 'spot.contractLot.form.deliveryPlan',
              prop: 'deliveryPlan',
              width: '300',
              element: 'base-select',
              list: this.deliveryPlanList,
              attrs: {
                clearable: true
              },
              visibleChange: this.initDeliveryPlanList
            },
            {
              type: 'date',
              label: 'spot.contractLot.form.payDate',
              required: true,
              prop: 'payDate',
              width: '120',
              align: 'right',
              attrs: {
                format: 'yyyy-MM-dd',
                valueFormat: 'yyyyMMdd'
              }
            },
            {
              label: 'spot.contractLot.form.payAmount',
              prop: 'payAmount',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              attrs: {
                min: -999999999999.99,
                max: 999999999999.99,
                type: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.contractCurrenty',
              prop: 'contractCurrenty',
              width: '120',
              align: 'center',
              format: {
                dict: this.currencyList
              }
            },
            {
              label: 'spot.contractLot.form.targetCurrenty',
              prop: 'targetCurrenty',
              width: '120',
              element: 'base-select',
              required: true,
              list: this.currencyList,
              attrs: {
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
      type: [String, Object],
      default() {
        return {}
      }
    },
    currencyList: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryPlanList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created() { },
  mounted() {
    request({
      url: '/api/dd/selectData/list',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          type: 'DD_RECORDING_RATE'
        }
      }
    }).then(response => {
      if (response.status) {
        for (let i = 0; i < response.data.length; i++) {
          const row = response.data[i]
          this.currencyList.push({
            key: row.code,
            value: row.code,
            label: row.name,
            localFlag: row.data.localFlag,
            exchangeRate: row.data.exchangeRate
          })
        }
      }
    })
    if (this.param.type === 'add' && this.param.lotNo !== undefined && this.param.lotNo !== null && this.param.lotNo !== '') {
      // 变更新增的场合
      const lotNo = this.param.lotNo
      let api = null
      switch (this.param.billType) {
        case 'CON_PLC_INFO':
        case 'plc':
          api = '/api/contract/plPaymentPlan/listByLotNo'
          break
        case 'CON_SLC_INFO':
        case 'slc':
          api = '/api/contract/slPaymentPlan/listByLotNo'
          break
      }
      request({
        url: api,
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: lotNo
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
    } else if (this.param.type === 'add' && this.param.contractNo !== undefined && this.param.contractNo !== null && this.param.contractNo !== '') {
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
          api = '/api/contract/pcPaymentPlan/listByContractNo'
          break
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          api = '/api/contract/scPaymentPlan/listByContractNo'
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
          return '/api/contract/pcPaymentPlan/listByContractNo'
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          return '/api/contract/pccPaymentPlan/listByChangeNo'
        case 'CON_PL_INFO':
        case 'pl':
          return '/api/contract/plPaymentPlan/listByLotNo'
        case 'CON_PLC_INFO':
        case 'plc':
          return '/api/contract/plcPaymentPlan/listByChangeNo'
        case 'CON_SC_INFO':
        case 'sc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
          return '/api/contract/scPaymentPlan/listByContractNo'
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return '/api/contract/sccPaymentPlan/listByChangeNo'
        case 'CON_SL_INFO':
        case 'sl':
          return '/api/contract/slPaymentPlan/listByLotNo'
        case 'CON_SLC_INFO':
        case 'slc':
          return '/api/contract/slcPaymentPlan/listByChangeNo'
      }
    },
    doAddRow() {
      const datalist = toolUtil.getDataTabFromSelf(this)
      const editForm = toolUtil.getDataEditFromTab(this)
      datalist.push({
        contractCurrenty: editForm.currency
      })
    },
    initDeliveryPlanList() {
      this.deliveryPlanList.splice(0)

      const deliveryPlanList = toolUtil.getDataTabFromTab(this, 'deliveryPlanList')
      if (deliveryPlanList) {
        const strList = []
        for (let i = 0; i < deliveryPlanList.length; i++) {
          const deliveryPlan = deliveryPlanList[i]
          if (toolUtil.isNotEmpty(deliveryPlan.deliveryDateStart) && toolUtil.isNotEmpty(deliveryPlan.deliveryDateEnd)) {
            const deliveryPlanStr = toolUtil.formatDate(deliveryPlan.deliveryDateStart) + ' ~ ' + toolUtil.formatDate(deliveryPlan.deliveryDateEnd) + ' ' + deliveryPlan.productName
            if (!strList.includes(deliveryPlanStr)) {
              strList.push(deliveryPlanStr)
            }
          }
        }
        strList.sort()
        for (let i = 0; i < strList.length; i++) {
          const deliveryPlanStr = strList[i]
          this.deliveryPlanList.push({
            key: deliveryPlanStr,
            value: deliveryPlanStr,
            lavel: deliveryPlanStr
          })
        }
      }
    }
  }
}
</script>
