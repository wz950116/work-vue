<template>
  <qm-dialog-tree-table :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-tree-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('data.product.popup.choose'),

        initSearch: true,
        expandOnClickNode: false,
        expandAll: true,
        form: {
          api: {
            getTreeList: '/api/dd/product/group/treeGroup'
          },
          defaultProps: {
            children: 'children',
            label: 'label'
          }
        },

        mainData: {
          api: {
            search: 'frame/biz/data/product/list'
          },
          table: {
            showCheckbox: false,
            cols: [{
              prop: 'productCode',
              label: 'data.product.list.productCode'
            }, {
              prop: 'productName',
              label: 'data.product.list.productName'
            }, {
              prop: 'unit',
              label: 'data.product.list.unit'
            }]
          }
        },

        bottomButtons: [{
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['add', 'update']
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
      // 可选择需要params的某个字段
      this.$emit('closeHandler')
    }
  }
}
</script>
