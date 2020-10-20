<template>
  <qm-dialog-table :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: '增行',

        moreShowFlg: true,

        formData: [{
          type: 'date',
          label: '时间区间选择',
          props: ['startTime2', 'endTime2'],
          attrs: {
            clearable: true,
            format: 'yyyy-MM-dd',
            'value-format': 'yyyyMMdd'
          },
          validate: [{
            required: true,
            trigger: 'change'
          }]
        }, {
          label: '商品名称',
          prop: 'productCategoryName',
          element: 'input-validate',
          attrs: {
            clearable: true
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        }, {
          label: '商品简称',
          prop: 'productCategoryAbbr',
          element: 'input-validate',
          attrs: {
            clearable: true
          },
          validate: [{
            required: true,
            trigger: 'blur'
          }]
        }, {
          label: '商品编码',
          prop: 'productCategoryCode',
          element: 'input-validate',
          attrs: {
            clearable: true
          }
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
            search: '/api/dd/productCategory/list',
            search_lv2: '/api/dd/productCategory/list'
          },
          apiData: {
            search(defaultParams) {
              return {
                ...defaultParams,
                hideOptions: '123'
              }
            },
            search_lv2(currentRow) {
              return {
                id: '123'
              }
            }
          },
          table: {
            sortable: 'custom',
            showCheckbox: false,
            cols: [{
              prop: 'productCategoryName',
              width: '220',
              label: '商品名称',
              sortProp: 'aaa',
              sortable: true
            }, {
              prop: 'productCategoryAbbr',
              width: '220',
              label: '商品简称',
              sortable: false
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
          },
          linkTable: {
            sortable: true,
            showCheckbox: false,
            cols: [{
              prop: 'productCategoryName',
              width: '220',
              label: '商品名称'
            }, {
              prop: 'productCategoryAbbr',
              width: '220',
              label: '商品简称',
              sortable: false
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
        },

        bottomButtons: [{
          name: 'biz.btn.cancel',
          event: 'cancel'
        }, {
          name: 'biz.btn.save',
          event: 'save',
          isShow: ['add', 'update'],
          attrs: {
            type: 'primary'
          }
        }]
      }
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
