<template>
  <qm-edit-tab ref="tab" :tab="tab" @initCallback="handleInitCallback"></qm-edit-tab>
</template>
<script>
import selectData from '@/views/frame/biz/data/selectData/selectData.js'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params || this.param,
        api: {
          search: '/api/sys/flowNode/list'
        },
        apiData: {
          search(param) {
            return {
              flowCode: param.code
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
          cols: [
            {
              prop: 'bizCode',
              label: 'sys.flow.bizCode',
              element: 'base-select',
              list: this.$t('datadict.bizCode'),
              required: true,
              width: 150,
              attrs: {
                filterable: true,
                clearable: true
              },
              event: this.bizCodeChange
            },
            {
              label: 'sys.flow.dispOrder',
              prop: 'dispOrder',
              width: 100,
              element: 'input-validate',
              required: true
            },
            {
              label: 'biz.lbl.usingFlag',
              prop: 'usingFlag',
              element: 'base-select',
              list: this.$t('datadict.usingFlag'),
              width: 80,
              required: true,
              attrs: {
                clearable: true
              }
            },
            {
              label: 'sys.flow.msgFlag',
              prop: 'msgFlag',
              element: 'base-select',
              width: 80,
              list: this.$t('datadict.yesNo'),
              required: !this.getMsgFlg(),
              default: '0',
              attrs: {
                clearable: true,
                disabled: this.getMsgFlg()
              }
            },
            {
              label: 'sys.flow.bizEmployeeCodes',
              prop: 'bizEmployeeCodes',
              element: 'base-select',
              width: 300,
              attrs: {
                data: 'FUNC_EMPLOYEE',
                multiple: true,
                clearable: true
              }
            },
            {
              label: 'sys.flow.routeName',
              prop: 'routeName',
              element: 'base-select',
              width: 150,
              attrs: {
                canChangeList: true,
                data: 'SUB_MODULE',
                clearable: true
              }
            },
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              element: 'el-input',
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
  },
  methods: {
    getMsgFlg() {
      if (this.param.flowType === 'steps') {
        return true
      } else {
        return false
      }
    },
    handleInitCallback(tableData) {
      tableData.forEach(row => {
        this.getSubRouteList(row.bizCode).then(subRouteList => {
          row.list = subRouteList
        })
      })
    },
    getSubRouteList(bizCode) {
      const param = {}
      param.bizCode = bizCode
      return new Promise((resolve, reject) => {
        selectData.listSelectData('SUB_MODULE', param).then(dataList => {
          resolve(dataList)
        })
      })
    },
    bizCodeChange(param) {
      if (param && param.row) {
        if (param.row.bizCode) {
          this.$set(param.row, 'list', [])
          this.getSubRouteList(param.row.bizCode).then(subRouteList => {
            param.row.list = subRouteList
          })
        } else {
          param.row['routeName'] = ''
          param.row.list = []
        }
      }
    }
  }
}
</script>
