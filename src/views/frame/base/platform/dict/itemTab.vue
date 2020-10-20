<template>
  <qm-edit-tab ref="tab" :tab="tab"></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/platform/cfgDictItem/list'
        },
        apiData: {
          search(param) {
            return {
              dictCode: param.dictCode
            }
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update', 'detailSet']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update', 'detailSet']
          }
        ],
        table: {
          height: 450,
          cols: [
            {
              label: 'sys.dict.dictItem.dictItemName',
              prop: 'dictItemName',
              element: 'input-validate',
              required: true
            },
            {
              label: 'sys.dict.dictItem.dictItemVal',
              prop: 'dictItemVal',
              element: 'input-validate',
              required: true
            },
            {
              label: 'sys.dict.dictItem.dispOrder',
              prop: 'dispOrder',
              element: 'input-validate',
              required: true
            },
            {
              label: '附加属性',
              prop: 'reservedStr1',
              element: 'input-validate'
            },
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              element: 'el-input'
            },
            {
              label: 'sys.dict.usingFlag',
              prop: 'usingFlag',
              element: 'base-select',
              list: this.$t('datadict.usingFlag'),
              default: '1',
              required: true,
              attrs: {
                clearable: false
              }
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'update'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  }
}
</script>
