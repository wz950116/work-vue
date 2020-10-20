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
          search: '/api/fee/feeAllotDetail/listByCode'
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
            i18n: 'biz.btn.lot',
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
              label: 'fee.feeAllot.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left'
            },
            // 批次号
            {
              label: 'fee.feeAllot.list.lotNo',
              prop: 'lotNo',
              width: 200,
              align: 'left'
            },
            {
              prop: 'lotDetailNo',
              isShow: false
            },
            // 商品
            {
              label: 'fee.feeAllot.list.productCode',
              prop: 'productName',
              width: 100,
              align: 'left'
            },
            // 物资属性
            ...this.$store.state.user.mainGoodCols,
            // 分摊数量
            {
              label: 'fee.feeAllot.list.allotQuantity',
              prop: 'allotQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              event: this.allotQuantityChange
            },
            // 分摊金额
            {
              label: 'fee.feeAllot.list.allotAmount',
              prop: 'allotAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.allotAmountChange
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
        this.$notify(notifyInfo({ msg: this.$t('请选择供应商') }))
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
          value: this.editForm.customerNo
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
        this.$refs.tab.tableData[_index]['contractNo'] = row.contractNo
        this.$refs.tab.tableData[_index]['lotNo'] = row.lotNo
        this.$refs.tab.tableData[_index]['lotDetailNo'] = row.productDetailNo
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['allotQuantity'] = ''
        this.$refs.tab.tableData[_index]['remark'] = ''
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.lotNo + v.lotDetailNo
            })
            .includes(row.lotNo + row.lotDetailNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 删行触发事件
    handleDeleteRow() {
      this.editChange()
    },
    // 分摊数量change事件
    allotQuantityChange(val) {
      // 赋值分摊金额
      val.row.allotAmount = Number(val.val) * Number(this.editForm.includeTaxPrice)
    },
    editChange() {
      // 赋值基本信息里的分摊数量
      var allotQuantity = 0
      this.$refs.tab.tableData.forEach(row => {
        allotQuantity = Number(allotQuantity) + Number(row.allotQuantity)
      })
      this.editForm.allotQuantity = allotQuantity + ''
      // 赋值基本信息里的含税金额 不含税金额 税额
      var allotAmount = 0
      this.$refs.tab.tableData.forEach(row => {
        allotAmount = Number(allotAmount) + Number(row.allotAmount)
      })
      this.editForm.includeTaxAmount = allotAmount + ''
      this.editForm.excludeTaxAmount = (Number(allotAmount) / (1 + Number(this.editForm.taxRate) / 100)).toFixed(2)
      this.editForm.taxAmount = (Number(this.editForm.includeTaxAmount) - Number(this.editForm.excludeTaxAmount)).toFixed(2)
    },
    allotAmountChange(value) {
      // 赋值分摊金额
      value.row.allotQuantity = Number(value.val) / Number(this.editForm.includeTaxPrice)
      this.editChange()
    }
  }
}
</script>
