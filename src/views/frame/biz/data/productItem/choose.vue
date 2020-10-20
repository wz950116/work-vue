<template>
  <qm-dialog-tree-table ref='qmDialogTreeTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-tree-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('data.productItem.choose'),
        form: {
          listQuery: {
            isPage: true,
            defaultSortString: 'productName.asc'
          },
          treeName: this.$t('data.productItem.treeName'),
          isTopBar: false,
          expandOnClickNode: false,
          expandAll: true,
          initSearch: true,
          isSearch: true,
          leftWidth: 260,
          api: {
            getTreeList: '/api/dd/product/treeProduct'
          },
          apiData: {
            getTreeList(param) {
              return '1'
            }
          },
          defaultProps: {
            children: 'children',
            key: 'productGroupCode',
            label: 'productGroupName'
          },
          formDataVisible: true,
          formData: [
            {
              label: 'goods.spec',
              prop: 'spec',
              element: 'input-validate',
              attrs: {
                clearable: true
              }
            },
            {
              label: 'goods.origin',
              prop: 'origin',
              element: 'input-validate',
              attrs: {
                clearable: true
              }
            }
          ]
        },

        mainData: {
          api: {
            search: '/api/dd/productItem/list'
          },
          apiData: {
            search(param) {
              var obj = {}
              if (param.productFlag === '1') {
                obj.productCode = param.productGroupCode
              } else {
                obj.productGroupCode = param.productGroupCode
              }
              return obj
            }
          },
          table: {
            showCheckbox: true,
            cols: [
              {
                prop: 'productName',
                width: '140',
                label: 'data.productItem.list.productName'
              },
              {
                prop: 'productUnitCode',
                width: '90',
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                },
                label: 'data.productItem.list.productUnitCode'
              },
              {
                prop: 'measurementUnitCode',
                width: '90',
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                label: 'data.productItem.list.measurementUnitCode'
              },
              ...this.$store.state.user.mainGoodColsTxt
            ]
          },
          bottomBar: {
            pagination: {
              show: true,
              layout: 'total, sizes, prev, pager, next, jumper',
              pageSizes: [20, 40, 60, 80, 100]
            }
          }
        },

        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
