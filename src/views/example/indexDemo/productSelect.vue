<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: '选择XXX',

        moreShowFlg: true,

        allowDblClick: true, // 弹窗是否允许双击列表行关闭

        formData: [{
          label: '商品名称',
          prop: 'productCategoryName',
          element: 'input-validate',
          attrs: {
            clearable: true
          },
          validate: [{
            required: true,
            trigger: 'change'
          }],
          default: ''
        }, {
          label: '商品简称',
          prop: 'productCategoryAbbr',
          element: 'input-validate',
          attrs: {
            clearable: true
          },
          validate: [{
            required: true,
            trigger: 'change'
          }]
        }, {
          label: '商品编码',
          prop: 'productCategoryCode',
          element: 'input-validate',
          attrs: {
            clearable: true
          }
        }, {
          label: '状态',
          prop: 'usingFlag',
          element: 'base-select',
          list: this.$t('datadict.usingFlag'),
          attrs: {
            clearable: true
          },
          validate: [{
            required: true,
            trigger: 'change'
          }]
        }, {
          label: '备注',
          prop: 'remark',
          element: 'el-input',
          attrs: {
            clearable: true,
            cols: 2
          }
        }],

        mainData: {
          initSearch: false,
          api: {
            search: '/api/dd/productCategory/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                sortString: 'productCode.asc'
              })
              return newListQuery
            }
          },
          table: {
            cols: [{
              prop: 'productCategoryName',
              width: '220',
              label: '商品名称'
            }, {
              prop: 'productCategoryAbbr',
              width: '220',
              label: '商品简称'
            }, {
              prop: 'productCategoryCode',
              width: '220',
              label: '商品编码'
            }, {
              prop: 'attrGroupId',
              width: '220',
              label: '属性组'
            }, {
              prop: 'usingFlag',
              width: '220',
              align: 'center',
              label: '状态',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            }, {
              prop: 'remark',
              minWidth: '500',
              label: '备注'
            }]
          }
        },

        bottomButtons: [{
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['view']
        }, {
          name: 'biz.btn.choose',
          event: 'choose',
          isShow: ['add', 'update'],
          attrs: {
            type: 'primary'
          }
        }]
      }
    }
  },
  props: {
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.$refs.qmDialogTable.tableData = [{
      productCategoryName: '铝',
      productCategoryAbbr: 'lv',
      productCategoryCode: 'AL',
      attrGroupId: '属性',
      remark: '一句话'
    }]
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
