<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleCloseDialog' @deleteRow='handleDeleteRow'></qm-edit-tab>
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
          search: '/api/fund/claimDetail/listByClaimNo'
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
            isShow: ['add', 'update'],
            type: 'dialog',
            i18n: 'biz.btn.selectLots',
            component: () => import('@/views/frame/biz/spot/components/chooseLotProduct.vue'),
            validate: this.validateAdd,
            initChoose: this.initChooseAdd
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            isShow: ['add', 'update'],
            i18n: 'biz.btn.deleteRow'
          }
        ],
        table: {
          height: 300,
          cols: [
            // 合同号
            {
              label: 'fund.fundClaim.list.contractNoSon',
              prop: 'contractNo',
              width: 200,
              align: 'left'
            },
            // 批次号
            {
              label: 'fund.fundClaim.list.lotNo',
              prop: 'lotNo',
              width: 200,
              align: 'left'
            },
            {
              prop: 'lotDetailNo',
              isShow: false
            },
            // 批次类型
            {
              label: 'fund.fundClaim.list.lotType',
              prop: 'lotType',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            // 资金用途
            {
              label: 'fund.fundClaim.list.fundUseType',
              prop: 'fundUseType',
              width: 100,
              align: 'center',
              element: 'base-select',
              list: this.$t('datadict.fundUseType'),
              attrs: {
                disabled: false,
                clearable: true
              },
              required: true
            },
            // 商品
            {
              label: 'fund.fundClaim.list.productName',
              prop: 'productName',
              width: 100,
              align: 'left'
            },
            // 物资属性
            ...this.$store.state.user.mainGoodCols,
            // 认领金额
            {
              label: 'fund.fundClaim.list.claimAmount',
              prop: 'claimAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onClaimAmountChange
            },
            // 备注
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              element: 'el-input',
              attrs: {
                maxlength: 100,
                clearable: true
              },
              'min-width': 200
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
  methods: {
    // 点击增行验证
    validateAdd() {
      if (!this.editForm.customerNo) {
        this.$notify(notifyInfo({ msg: this.$t('请选择客户') }))
        return false
      }
      if (!this.editForm.businessType) {
        this.$notify(notifyInfo({ msg: this.$t('请选择业务类别') }))
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
        'customerCode': {
          disabled: true,
          value: this.editForm.customerNo
        },
        'billType': {
          disabled: this.getBillType() !== '',
          value: this.getBillType()
        },
        'bizOrganCode': {
          disabled: true,
          value: this.editForm.bizOrganCode
        }
      }
    },
    getBillType() {
      if (this.editForm.businessType === 'B') {
        return 'CON_PL_INFO'
      }
      if (this.editForm.businessType === 'S') {
        return 'CON_SL_INFO'
      }
      return ''
    },
    // 增行弹窗关闭
    handleCloseDialog(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['contractNo'] = row.contractNo
        this.$refs.tab.tableData[_index]['lotNo'] = row.lotNo
        this.$refs.tab.tableData[_index]['lotDetailNo'] = row.productDetailNo
        this.$refs.tab.tableData[_index]['lotType'] = row.billType
        this.$refs.tab.tableData[_index]['fundUseType'] = 'GOODS'
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['claimAmount'] = row.originalAmount
        this.$refs.tab.tableData[_index]['remark'] = ''
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (!newData.map(v => { return v.lotNo + v.lotDetailNo }).includes(row.lotNo + row.lotDetailNo)) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    addTableData(params) {
      params.forEach((row, index) => {
        const obj = {}
        obj['contractNo'] = row.contractNo
        obj['lotNo'] = row.lotNo
        obj['lotDetailNo'] = row.productDetailNo
        obj['lotType'] = row.billType
        obj['fundUseType'] = 'GOODS'
        obj['productCode'] = row.productCode
        obj['productName'] = row.productName
        obj['brand'] = row.brand
        obj['spec'] = row.spec
        obj['origin'] = row.origin
        obj['productKeyAttr01'] = row.productKeyAttr01
        obj['productKeyAttr02'] = row.productKeyAttr02
        obj['productKeyAttr03'] = row.productKeyAttr03
        obj['applyAmount'] = ''
        obj['remark'] = ''
        this.$refs.tab.tableData.push(obj)
      })
    },
    // 删行触发事件
    handleDeleteRow() {
      this.onClaimAmountChange()
    },
    // 认领金额change事件
    onClaimAmountChange(val) {
      var claimAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        claimAmount = (Number(claimAmount) + Number(row.claimAmount)).toFixed(2)
      })
      this.editForm.claimAmount = claimAmount + ''
    }
  }
}
</script>
