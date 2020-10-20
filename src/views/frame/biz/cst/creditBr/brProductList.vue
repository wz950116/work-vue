<template>
  <qm-edit-tab ref="tab" :tab="tab"></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/cust/creditBrProduct/listByCustCreditNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.custCreditNo
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update']
          }
        ],
        table: {
          cols: [
            {
              label: 'cst.creditBr.list.futureProductNo',
              prop: 'futureProductNo',
              element: 'base-select',
              validate: [
                {
                  required: true,
                  trigger: 'change'
                }
              ],
              attrs: {
                data: 'FUTURES_VARIETIES',
                params: {
                  usingFlag: '1'
                },
                clearable: true,
                disabled: this.isReadonlyAll()
              }
            },
            {
              label: 'cst.creditBr.list.direction',
              prop: 'direction',
              element: 'base-select',
              list: this.$t('datadict.dvtPosiDirection'),
              required: true,
              validate: [
                {
                  required: true,
                  trigger: 'change'
                }
              ],
              attrs: {
                clearable: true,
                disabled: this.isReadonlyAll()
              }
            },
            {
              label: 'cst.creditBr.list.warnVal',
              prop: 'warnVal',
              element: 'input-formatter',
              required: true,
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: this.isReadonlyAll()
              }
            },
            {
              label: 'cst.creditBr.list.limitVal',
              prop: 'limitVal',
              element: 'input-formatter',
              required: true,
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              attrs: {
                gtmin: 0,
                type: 'num',
                disabled: this.isReadonlyAll()
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
      default: 'view'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    isReadonlyAll() {
      return false
    }
  }
}
</script>
