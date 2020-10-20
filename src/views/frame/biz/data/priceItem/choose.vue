<template>
  <qm-dialog-table ref='qmDialogTable' :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('route.' + this.$route.meta.title),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            label: 'data.priceItem.form.priceItemType',
            prop: 'priceItemType',
            element: 'base-select',
            list: this.$t('datadict.priceItemType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.priceItem.form.priceItemTypeNe',
            prop: 'priceItemTypeNe',
            element: 'base-select',
            list: this.$t('datadict.priceItemType'),
            attrs: {
              clearable: true
            },
            isShow: false
          },
          {
            label: 'data.priceItem.form.priceItemName',
            prop: 'priceItemName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.priceItem.form.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ],

        mainData: {
          api: {
            search: '/api/dd/price/item/list'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'priceItemCode.desc'
              })
              return newListQuery
            }
          },
          initSearch: this.getInitSearch(),
          table: {
            showCheckbox: this.getMultiple(),
            cols: [
              {
                prop: 'priceItemCode',
                label: 'data.priceItem.list.priceItemCode'
              },
              {
                prop: 'priceItemType',
                width: '220',
                format: {
                  dict: this.$t('datadict.priceItemType')
                },
                label: 'data.priceItem.list.priceItemType'
              },
              {
                prop: 'priceItemName',
                width: '220',
                label: 'data.priceItem.list.priceItemName'
              },
              {
                prop: 'priceUnit',
                width: '220',
                label: 'data.priceItem.list.priceUnitName'
              },
              {
                prop: 'usingFlag',
                width: '220',
                format: {
                  dict: this.$t('datadict.usingFlag')
                },
                label: 'data.priceItem.list.usingFlag'
              }
            ]
          }
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
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
            event: this.doSelect,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    // 列表是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否进行初始化查询
    initSearch: {
      type: Boolean,
      default: true
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    },
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    // 列表是否初始化查询
    getInitSearch() {
      if (typeof this.param.initSearch === 'boolean') {
        return this.param.initSearch
      }
      if (typeof this.initChooseParam.initSearch === 'boolean') {
        return this.initChooseParam.initSearch
      }
      return this.initSearch
    },
    // 列表是否支持多选
    getMultiple() {
      if (typeof this.param.multiple === 'boolean') {
        return this.param.multiple
      }
      if (typeof this.initChooseParam.multiple === 'boolean') {
        return this.initChooseParam.multiple
      }
      return this.multiple
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    doSelect() {
      const row = this.$refs.qmDialogTable.currentRow
      this.handleCloseDialog(row)
    }
  }
}
</script>
