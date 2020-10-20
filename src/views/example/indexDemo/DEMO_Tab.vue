<template>
  <qm-edit-tab ref='tab' :tab='tab' @addRow='addRowHandle'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        editForm: this.editForm,
        api: {
          search: ''
        },
        topBar: [{
          name: 'add',
          iconName: '线性-增行',
          i18n: 'biz.btn.addRow'
        }, {
          name: 'delete'
        }, {
          name: 'copy'
        }, {
          name: 'print',
          component: () => import('@/views/example/dialogDemo/edit.vue'),
          iconName: '线性-打印',
          i18n: 'biz.btn.print'
        }],
        table: {
          showSummary: true,
          showSelection: false,
          cols: [{
            label: '多事件',
            prop: 'feeCode',
            width: '120',
            element: 'base-select',
            required: true,
            attrs: {
              data: 'DD_FEE_TYPE',
              clearable: true
            },
            event: this.onFeeCodeChange,
            changeAll: this.onFeeCodeChangeAll,
            summary: true,
            format: {
              func: 'price'
            }
          }, {
            label: '查询选择',
            prop: 'productName',
            element: 'base-dialog-select',
            component: () => import('@/views/example/indexDemo/productSelect.vue'),
            attrs: {
              data: '品种弹窗选择',
              clearable: true
            },
            callback: this.dialogHandler,
            clear: this.onClear
          }, {
            label: '树查询选择',
            prop: 'productNames',
            element: 'base-dialog-select',
            component: () => import('@/views/example/indexDemo/productTreeSelect.vue'),
            attrs: {
              data: '品种树形弹窗选择',
              clearable: true
            }
          }, {
            label: '金额输入',
            prop: 'minCapacity',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.999,
              type: 'thousands',
              precision: 2
            },
            required: true
          }, {
            label: '数字输入',
            prop: 'maxCapacity',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999.999,
              type: 'thousands',
              precision: 3
            },
            required: true,
            event: this.onBlur
          }, {
            prop: 'custName',
            label: '文本'
          }, {
            prop: 'custHeadline',
            label: '输入框',
            element: 'input-validate',
            attrs: {
              clearable: true,
              style: 'text-align:right;'
            },
            event: this.onBlur
          }, {
            prop: 'usingFlag',
            label: '数据字典输入',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            },
            event: this.changeUsingFlag
          }, {
            prop: 'date',
            label: '日期输入',
            type: 'date',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          }]
        }
      }
    }
  },
  inject: [],
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
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
    changeUsingFlag(param) {
      console.log(`当前第${this.$refs.tab.tableData.indexOf(param.row) + 1}行`)
    },
    onBlur(param) {
      console.log(param, '输入框修改')
      param.row.custName = param.val
    },
    onFeeCodeChange(param) {
      console.log(param)
    },
    onFeeCodeChangeAll(param) {
      console.log(param)
    },
    dialogHandler(params) {
      this.$refs.tab.tableData[this.$refs.tab.rowOpenNum].productName = params.productCategoryName
      this.$refs.tab.tableData[this.$refs.tab.rowOpenNum].productNames = params.productCategoryName
    },
    onClear({ row }) {
      // 清空另一列数据
      row.productNames = ''
    },
    addRowHandle(row) {
      this.$refs.tab.tableData[this.$refs.tab.tableData.length - 1].maxCapacity = '100'
    }
  }
}
</script>
