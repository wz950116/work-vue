<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='handleCloseDialog'></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        editForm: this.editForm,
        api: {
          search: '/api/invoice/invoiceForReVerDe/listByVerificatNo'
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
            i18n: 'biz.btn.selectInProductInfo',
            component: () => import('@/views/frame/biz/storage/dialog/chooseInProduct.vue'),
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
          height: 200,
          cols: [
            // 入库单号
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.inBillNo',
              prop: 'inBillNo',
              width: 150,
              required: true
            },
            // 入库商品明细
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.inProductNo',
              prop: 'inProductNo',
              width: 150
            },
            // 商品
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.productCode',
              prop: 'productName',
              width: 120,
              align: 'left',
              required: true
            },
            // 物资属性
            ...this.$store.state.user.mainGoodColsTxt,
            // 核销数量
            {
              label: 'invoice.foreignInvoiceReceiveVer.list.verificatQuantity',
              prop: 'verificatQuantity',
              element: 'input-formatter',
              attrs: {
                type: 'weight',
                disabled: false,
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
    // 增行弹窗关闭
    handleCloseDialog(params) {
      // 先添加
      params.forEach((row, index) => {
        const _index = this.$refs.tab.rowOpenNum[index]
        this.$refs.tab.tableData[_index]['contractNo'] = row.contractNo
        this.$refs.tab.tableData[_index]['lotNo'] = row.lotNo
        this.$refs.tab.tableData[_index]['lotDetailNo'] = row.lotProductDetailCode
        this.$refs.tab.tableData[_index]['inBillNo'] = row.inBillNo
        this.$refs.tab.tableData[_index]['inProductNo'] = row.inProductNo
        this.$refs.tab.tableData[_index]['productCode'] = row.productCode
        this.$refs.tab.tableData[_index]['productName'] = row.productName
        this.$refs.tab.tableData[_index]['brand'] = row.brand
        this.$refs.tab.tableData[_index]['spec'] = row.spec
        this.$refs.tab.tableData[_index]['origin'] = row.origin
        this.$refs.tab.tableData[_index]['productKeyAttr01'] = row.productKeyAttr01
        this.$refs.tab.tableData[_index]['productKeyAttr02'] = row.productKeyAttr02
        this.$refs.tab.tableData[_index]['productKeyAttr03'] = row.productKeyAttr03
        this.$refs.tab.tableData[_index]['verificatQuantity'] = row.unVerificatQuantity
        this.$refs.tab.tableData[_index]['remark'] = ''
      })
      // 后过滤
      const newData = []
      this.$refs.tab.tableData.forEach(row => {
        if (
          !newData
            .map(v => {
              return v.inBillNo + v.inProductNo
            })
            .includes(row.inBillNo + row.inProductNo)
        ) {
          newData.push(row)
        }
      })
      this.$refs.tab.tableData = newData
    },
    // 点击增行验证
    validateAdd() {
      if (!this.editForm.lotNo) {
        this.$notify(notifyInfo({ msg: this.$t('请选择采购批次') }))
        return false
      }
      if (!this.editForm.customerNo) {
        this.$notify(notifyInfo({ msg: this.$t('请选择供应商') }))
        return false
      }
      if (!this.editForm.bizOrganCode) {
        this.$notify(notifyInfo({ msg: this.$t('请选择机构') }))
        return false
      }
      return true
    },
    initChooseAdd() {
      return {
        initSearch: true,
        multiple: true,
        supplierCode: {
          disabled: true,
          value: this.editForm.customerNo
        },
        lotNo: {
          disabled: true,
          value: this.editForm.lotNo
        },
        bizOrganCode: {
          disabled: true,
          value: this.editForm.bizOrganCode
        }
      }
    }
  }
}
</script>
