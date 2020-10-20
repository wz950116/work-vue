<template>
  <qm-dialog-array-table ref='qmDialogArray' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-array-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: '增行',

        moreShowFlg: true,

        formData: [{
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
        }],

        mainData: {
          initSearch: false,
          api: {
            search: '/api/dd/productCategory/list'
          },
          apiData: {
            search(defaultParams) {
              return {
                ...defaultParams,
                hideOptions: '123'
              }
            }
          },
          table: {
            showCheckbox: false,
            sortable: true,
            mergeProp: 'invCommodityDto',
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
              label: '属性组',
              isSon: true
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
  mounted() {
    this.$refs.qmDialogArray.tableData = [{
      productCategoryName: '1',
      productCategoryAbbr: '2',
      productCategoryCode: '3',
      invCommodityDto: [{
        attrGroupId: 'a'
      }, {
        attrGroupId: 'b'
      }, {
        attrGroupId: 'c'
      }],
      usingFlag: '1',
      remark: '111'
    }, {
      productCategoryName: '4',
      productCategoryAbbr: '5',
      productCategoryCode: '6',
      invCommodityDto: [{
        attrGroupId: 'd'
      }, {
        attrGroupId: 'e'
      }, {
        attrGroupId: 'f'
      }],
      usingFlag: '0',
      remark: '222'
    }]
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
