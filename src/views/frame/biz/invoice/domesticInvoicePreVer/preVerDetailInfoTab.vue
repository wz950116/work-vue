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
          search: '/api/invoice/invoiceDomPreVerDe/get'
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
            i18n: 'biz.btn.selectOutProductInfo',
            component: () => import('@/views/frame/biz/invoice/dialog/outProductForPreVer.vue'),
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
              label: 'invoice.invoiceDomPreVer.list.contractNo',
              prop: 'contractNo',
              width: 200,
              align: 'left'
            },
            // 批次号
            {
              label: 'invoice.invoiceDomPreVer.list.lotNo',
              prop: 'lotNo',
              width: 200,
              align: 'left'
            },
            // 出库单号
            {
              label: 'invoice.invoiceDomPreVer.list.outBillNo',
              prop: 'outBillNo',
              width: 200,
              align: 'left'
            },
            // 商品
            {
              label: 'invoice.invoiceDomPreVer.list.productName',
              prop: 'productName',
              width: 100,
              align: 'left'
            },
            // 物资属性
            ...this.$store.state.user.mainGoodCols,
            // 核销数量
            {
              label: 'invoice.invoiceDomPreVer.list.verificatQuantity',
              prop: 'verificatQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true,
              event: this.verificatQuantityChange
            },
            // 核销金额（不含税）
            {
              label: 'invoice.invoiceDomPreVer.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
            },
            // 核销金额（含税）
            {
              label: 'invoice.invoiceDomPreVer.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              element: 'input-formatter',
              attrs: {
                type: 'money',
                disabled: true,
                clearable: true
              },
              width: 150,
              align: 'right',
              required: true
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
      if (!this.editForm.productCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择商品') }))
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
        productCode: {
          disabled: true,
          value: this.editForm.productCode
        },
        bizOrganCode: {
          disabled: true,
          value: this.editForm.bizOrganCode
        },

        lotNoGroup: this.editForm.lotNoGroup.split(',')
      }
    },
    // 增行弹窗关闭
    handleCloseDialog(params) {
      var excludeTaxPrice = this.editForm.excludeTaxPrice
      var includeTaxPrice = this.editForm.includeTaxPrice
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]

        this.$refs.tab.tableData[_index]['verificatQuantity'] = row.unVerificatQuantity
        this.$refs.tab.tableData[_index]['contractNo'] = row.contractNo
        this.$refs.tab.tableData[_index]['lotNo'] = row.lotNo
        this.$refs.tab.tableData[_index]['lotDetailNo'] = row.lotProductDetailCode
        this.$refs.tab.tableData[_index]['outBillNo'] = row.outBillNo
        this.$refs.tab.tableData[_index]['outProductNo'] = row.outProductNo
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['excludeTaxAmount'] = (Number(row.unVerificatQuantity) * Number(excludeTaxPrice)).toFixed(2)
        this.$refs.tab.tableData[_index]['includeTaxAmount'] = (Number(row.unVerificatQuantity) * Number(includeTaxPrice)).toFixed(2)
        this.$refs.tab.tableData[_index]['remark'] = ''
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.relateBillNo
            })
            .includes(row.relateBillNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 删行触发事件
    handleDeleteRow() {
      this.verificatQuantityChange()
    },
    // 认领数量change事件
    verificatQuantityChange(val) {
      if (this.type !== 'add' && (!this.editForm.excludeTaxPrice || !this.editForm.includeTaxPrice)) {
        return
      }
      var verificatQuantity = 0
      var excludeTaxPrice = this.editForm.excludeTaxPrice
      var includeTaxPrice = this.editForm.includeTaxPrice
      this.$refs.tab.tableData.forEach(row => {
        verificatQuantity = Number(verificatQuantity) + Number(row.verificatQuantity)
        row.excludeTaxAmount = (Number(row.verificatQuantity) * Number(excludeTaxPrice)).toFixed(2)
        row.includeTaxAmount = (Number(row.verificatQuantity) * Number(includeTaxPrice)).toFixed(2)
      })
      this.editForm.verificatQuantity = verificatQuantity + ''
    }
  }
}
</script>
