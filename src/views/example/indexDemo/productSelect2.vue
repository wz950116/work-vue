<template>
  <qm-dialog-tab-edit ref='qmDialogTabEdit' v-on="$listeners" :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-tab-edit>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        moreShowFlg: true,
        showCheckbox: true,
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
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  },
  props: {
    editForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted() {
    this.$refs.qmDialogTabEdit.tableData = [

      {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }, {
        productCategoryName: '铝',
        productCategoryAbbr: 'lv',
        productCategoryCode: 'AL',
        attrGroupId: '属性',
        remark: '一句话'
      }
    ]
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
