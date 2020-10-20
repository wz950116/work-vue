<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler="handleClose"></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
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
            name: 'add',
            iconName: '线性-增行',
            type: 'dialog',
            i18n: 'biz.btn.addRow',
            isShow: this.param.billType === 'pc' || this.param.billType === 'pcc' || this.param.billType === 'CON_PC_INFO' || this.param.billType === 'CON_PCC_INFO' || this.param.billType === 'CON_EXT_PC_INFO' || this.param.billType === 'epc' || this.param.billType === 'CON_EXT_PCC_INFO' || this.param.billType === 'epcc' ? ['add', 'update', 'copy'] : false,
            component: () => import('./chooseContractProductPc.vue'),
            validate: this.validateAdd,
            initChoose: this.initContractChoose
          },
          {
            name: 'add',
            iconName: '线性-增行',
            type: 'dialog',
            i18n: 'biz.btn.addRow',
            isShow: this.param.billType === 'sc' || this.param.billType === 'scc' || this.param.billType === 'CON_SC_INFO' || this.param.billType === 'CON_SCC_INFO' || this.param.billType === 'CON_DOMESTIC_PC_INFO' || this.param.billType === 'dpc' || this.param.billType === 'CON_DOMESTIC_PCC_INFO' || this.param.billType === 'dpcc' ? ['add', 'update', 'copy'] : false,
            component: () => import('./chooseContractProductSc.vue'),
            validate: this.validateAdd,
            initChoose: this.initContractChoose
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            isShow: ['add', 'update', 'copy'],
            i18n: 'biz.btn.deleteRow'
          }
        ],
        table: {
          cols: [
            {
              label: 'spot.contractLot.form.relatedContractNo',
              prop: 'relatedContractNo',
              width: '180'
            },
            {
              label: 'spot.contractLot.form.productName',
              width: '180',
              prop: 'productName'
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
          api = '/api/contract/pcRelatedSc/listByContractNo'
          break
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          api = '/api/contract/scRelatedPc/listByContractNo'
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
          return '/api/contract/pcRelatedSc/listByContractNo'
        case 'CON_PCC_INFO':
        case 'pcc':
        case 'CON_DOMESTIC_PCC_INFO':
        case 'CON_EXT_PCC_INFO':
        case 'dpcc':
        case 'epcc':
          return '/api/contract/pccRelatedSc/listByChangeNo'
        case 'CON_SC_INFO':
        case 'sc':
        case 'DOM_CON_SC_INFO':
        case 'dsc':
        case 'EXT_CON_SC_INFO':
        case 'esc':
          return '/api/contract/scRelatedPc/listByContractNo'
        case 'CON_SCC_INFO':
        case 'scc':
        case 'DOM_CON_SCC_INFO':
        case 'dscc':
        case 'EXT_CON_SCC_INFO':
        case 'escc':
          return '/api/contract/sccRelatedPc/listByChangeNo'
      }
    },
    getRelatedChooser() {
      switch (this.param.billType) {
        case 'CON_PC_INFO':
        case 'CON_PCC_INFO':
        case 'pc':
        case 'pcc':
          return './chooseContractProductSc.vue'
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
          return './chooseContractProductPc.vue'
      }
    },
    defaultAttr(attr) {
      return attr === '' || attr === null || attr === undefined ? '-' : attr
    },
    handleClose(params) {
      const productDtlRow = this.$parent.$parent.$parent.$refs.productDetailList[0].$refs.tab.currentRow
      for (let i = 0; i < params.length; i++) {
        if (params[i].productCode !== productDtlRow.productCode || this.defaultAttr(params[i].brand) !== productDtlRow.brand || this.defaultAttr(params[i].spec) !== productDtlRow.spec || this.defaultAttr(params[i].origin) !== productDtlRow.origin || this.defaultAttr(params[i].productKeyAttr01) !== productDtlRow.productKeyAttr01 || this.defaultAttr(params[i].productKeyAttr02) !== productDtlRow.productKeyAttr02 || this.defaultAttr(params[i].productKeyAttr03) !== productDtlRow.productKeyAttr03) {
          this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.relatedProduct') }))
          const selfRows = this.$refs.tab.tableData
          selfRows.splice(selfRows.length - params.length)
          return
        }
      }

      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index].productDetailNo = productDtlRow.productDetailNo
        this.$refs.tab.tableData[_index].relatedContractNo = row.contractNo
        this.$refs.tab.tableData[_index].relatedProductDetailNo = row.productDetailNo
        this.$refs.tab.tableData[_index].productCode = productDtlRow.productCode
        this.$refs.tab.tableData[_index].productName = productDtlRow.productName
        this.$refs.tab.tableData[_index].brand = productDtlRow.brand
        this.$refs.tab.tableData[_index].spec = productDtlRow.spec
        this.$refs.tab.tableData[_index].origin = productDtlRow.origin
        this.$refs.tab.tableData[_index].productKeyAttr01 = productDtlRow.productKeyAttr01
        this.$refs.tab.tableData[_index].productKeyAttr02 = productDtlRow.productKeyAttr02
        this.$refs.tab.tableData[_index].productKeyAttr03 = productDtlRow.productKeyAttr03
      })
    },
    validateAdd() {
      const productDtlRow = this.$parent.$parent.$parent.$refs.productDetailList[0].$refs.tab.currentRow
      if (productDtlRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.needChooseProduct') }))
        return false
      }
      return true
    },
    initContractChoose() {
      const productDtlRow = this.$parent.$parent.$parent.$refs.productDetailList[0].$refs.tab.currentRow
      return {
        initSearch: true,
        hasRmnFlg: {
          value: '0'
        },
        productCode: {
          disabled: true,
          value: productDtlRow.productCode
        }
      }
    }
  }
}
</script>
