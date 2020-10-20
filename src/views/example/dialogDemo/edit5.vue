<template>
  <qm-dialog-tree-table :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-tree-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: '增行',

        form: {
          api: {
            getTreeList: ''
          },
          apiData: {
            getTreeList() {
              return ''
            }
          },
          initSearch: false,
          treeName: '树查询名称',
          isTopBar: true,
          topBar: [{
            name: 'clear',
            iconName: '线性-清除',
            i18n: 'biz.btn.clear'
          }],
          defaultProps: {
            children: 'children',
            label: 'label'
          },

          formDataVisible: true,
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
          }]
        },

        mainData: {
          initSearch: false,
          api: {
            search: '/api/dd/productCategory/list'
          },
          apiData: {
            search(node) {
              return {
                node: node
              }
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
              label: '编码'
            }]
          }
        },

        bottomButtons: [{
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['view']
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
