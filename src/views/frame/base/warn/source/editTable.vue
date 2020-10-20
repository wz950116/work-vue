<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='dialogHandler'></qm-edit-tab>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        editForm: this.editForm,
        api: {
          search: '/api/warn/source/listColumn'
        },
        apiData: {
          search(param) {
            return param.sourceCode
          }
        },
        topBar: [
          {
            i18n: 'data.warnSource.getColumn',
            iconName: '线性-设置',
            event: this.loadColumn,
            isShow: ['add', 'update']
          },
          {
            i18n: 'data.warnSource.columnPro',
            iconName: '线性-设置',
            type: 'dialog',
            name: 'set',
            component: () => import('./json.vue'),
            callback: this.jsonCallBack,
            initChoose: this.jsonInitChoose,
            validate: this.selectCheck,
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
          required: true,
          height: 200,
          showSelection: false,
          cols: [
            {
              prop: 'colCode',
              width: '160',
              label: 'data.warnSource.colCode',
              required: true
            },
            {
              prop: 'colName',
              width: '100',
              element: 'el-input',
              label: 'data.warnSource.colName',
              required: true,

              attrs: {
                clearable: true
              }
            },
            {
              prop: 'tenantCol',
              width: '80',
              label: 'data.warnSource.tenantCol',
              element: 'base-select',
              list: this.$t('datadict.yesNo'),
              default: '0',
              required: true,
              attrs: {
                clearable: true
              }
            },
            {
              prop: 'dataType',
              width: '120',
              align: 'center',
              label: 'data.warnSource.dataType',
              element: 'base-select',
              list: this.$t('datadict.warnDataType'),
              required: true,
              attrs: {
                clearable: true
              }
            },
            {
              prop: 'propTypeArray',
              width: '220',
              align: 'center',
              label: '字段分类',
              element: 'base-select',
              attrs: {
                datadict: 'warnPropType',
                clearable: true,
                multiple: true
              }
            },
            {
              prop: 'propAttrs',
              width: '120',
              label: '字段属性JSON'
            },
            {
              prop: 'remark',
              minWidth: '300',
              element: 'el-input',
              label: 'biz.lbl.remark',
              attrs: {
                clearable: true
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
      type: [Object, String],
      default() {
        return {}
      }
    },
    editForm: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    selectCheck() {
      if (!this.$refs.tab.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return false
      } else {
        return true
      }
    },
    jsonCallBack(data) {
      if (data) {
        this.$refs.tab.currentRow.propAttrs = data.json
      }
    },
    jsonInitChoose() {
      return {
        json: this.$refs.tab.currentRow.propAttrs
      }
    },

    loadAttrs() {},
    // TAB二级弹窗回调处理
    dialogHandler() {},
    loadColumn() {
      const sql = this.$parent.$parent.$refs.qmDialogEdit.editForm.sqlStatement
      if (sql) {
        request({
          url: '/api/warn/source/listColumnBySql',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: sql
          }
        }).then(response => {
          response.data.forEach(col => {
            if (this.$refs.tab.tableData) {
              let formFlag = true
              this.$refs.tab.tableData.forEach(form => {
                if (col.colCode === form.colCode) {
                  formFlag = false
                }
              })
              if (formFlag) {
                col.tenantCol = '0'
                this.$refs.tab.tableData.push(col)
              }
            }
          })
        })
      } else {
        this.$notify(
          notifyError({
            msg: 'sql不可以为空'
          })
        )
      }
    }
  }
}
</script>
