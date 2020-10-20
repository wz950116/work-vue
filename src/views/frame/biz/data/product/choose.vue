<template>
  <qm-dialog-tree-table :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-tree-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('data.product.popup.choose'),
        form: {
          treeName: this.$t('data.product.treeName'),
          isTopBar: false,
          initSearch: true,
          expandOnClickNode: false,
          expandAll: true,
          api: {
            getTreeList: '/api/dd/product/group/treeProductGroup'
          },
          apiData: {
            getTreeList(param) {
              return '1'
            }
          },
          defaultProps: {
            children: 'children',
            label: 'productGroupName'
          }
        },

        mainData: {
          api: {
            search: '/api/dd/product/listByProductGroupCode'
          },
          apiData: {
            search(param) {
              return param.productGroupCode
            }
          },
          table: {
            showCheckbox: true,
            cols: [
              {
                prop: 'productCode',
                label: 'data.product.list.productCode',
                width: 120
              },
              {
                prop: 'productName',
                label: 'data.product.list.productName',
                width: 150
              },
              {
                prop: 'productUnitCode',
                label: 'data.product.list.productUnitCode',
                width: '90',
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                }
              },
              {
                prop: 'measurementUnitCode',
                label: 'data.product.list.measurementUnitCode',
                width: '90',
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                }
              }
            ]
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
