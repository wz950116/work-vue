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
          search: '/api/fund/applyAdvTranDe/listByTransferNo'
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
              label: 'fund.advanceApplyTransfer.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left'
            },
            // 批次号
            {
              label: 'fund.advanceApplyTransfer.list.lotNo',
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
              label: 'fund.advanceApplyTransfer.list.lotType',
              prop: 'lotType',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            // 资金用途
            {
              label: 'fund.advanceApplyTransfer.list.fundUseType',
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
              label: 'fund.advanceApplyTransfer.list.productName',
              prop: 'productName',
              width: 100,
              align: 'left'
            },
            // 物资属性
            ...this.$store.state.user.mainGoodCols,
            // 转换金额
            {
              label: 'fund.advanceApplyTransfer.list.transferAmount',
              prop: 'transferAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.onTransferAmountChange
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
          disabled: true,
          value: 'CON_PL_INFO'
        },
        'contractNo': {
          disabled: this.editForm.contractNo !== '',
          value: this.editForm.contractNo
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
        this.$refs.tab.tableData[_index]['transferAmount'] = row.originalAmount
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
    // 删行触发事件
    handleDeleteRow() {
      this.onTransferAmountChange()
    },
    // 转换金额change事件
    onTransferAmountChange(val) {
      var transferAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        transferAmount = Number(transferAmount) + Number(row.transferAmount)
      })
      this.editForm.transferAmount = transferAmount + ''
    }
  }
}
</script>
