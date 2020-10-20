<template>
  <qm-edit-tab ref="tab" :tab="tab"></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params || this.param,
        api: {
          search: '/api/msg/funcParam/listParam'
        },
        apiData: {
          search(param) {
            return param.funcCode
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
          cols: [
            {
              label: 'msg.func.msgParamCode',
              prop: 'msgParamCode',
              element: 'input-validate',
              width: 150,
              required: true
            },

            {
              label: 'msg.func.msgParamName',
              prop: 'msgParamName',
              element: 'input-validate',
              width: 150,
              required: true
            },
            {
              label: 'msg.func.msgParamType',
              prop: 'msgParamType',
              element: 'base-select',
              width: 120,
              list: this.$t('datadict.msgParamType'),
              attrs: {
                clearable: false
              },
              required: true
            },
            {
              label: 'msg.func.requireFlag',
              prop: 'requireFlag',
              element: 'base-select',
              width: 100,
              list: this.$t('datadict.yesNo'),
              attrs: {
                clearable: false
              },
              required: true
            },
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              element: 'el-input',
              width: 300,
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ]
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
