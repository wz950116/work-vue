<template>
  <qm-edit-tab v-if="showTemplate" ref='qmEditTable' :tab='tab'> </qm-edit-tab>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      showTemplate: false,
      emptyTextVisible: true,
      data: [],
      list: null,
      loading: false,
      dialogFormVisible: false,
      selectRow: [],
      tab: {
        type: 'view',
        api: {
          search: '/api/warn/employee/listRelatedEmployee'
        },
        apiData: {
          code: this.param.code,
          search() {
            return this.code
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            i18n: 'data.warnSource.addEmployee',
            type: 'dialog',
            param: this.param,
            getParam() {
              return {
                warningCode: this.param.code,
                sourceCode: this.param.sourceCode
              }
            },
            // 弹窗组件
            component: () => import('./employeeSet.vue')
          },
          {
            name: 'update',
            i18n: 'data.warnSource.updateEmployee',
            type: 'dialog',
            param: this.param,
            getParam(currentRow) {
              return {
                WarnEmployeeId: currentRow.id,
                warningCode: this.param.code,
                sourceCode: this.param.sourceCode
              }
            },
            // 弹窗组件
            component: () => import('./employeeSet.vue')
          },
          {
            name: 'delete',
            event: this.doDelete
          }
        ],
        isColset: true,
        table: {
          cols: [
            {
              prop: 'organName',
              label: 'func.employee.organName',
              width: '150'
            },
            {
              prop: 'deptName',
              label: 'func.employee.deptName',
              width: '150'
            },
            {
              prop: 'employeeName',
              label: 'func.user.employeeName',
              width: '150'
            },
            {
              prop: 'matchType',
              width: '100',
              align: 'center',
              label: 'data.warning.matchType',
              format: {
                dict: this.$t('datadict.warnMsgMatchType')
              }
            }
          ]
        }
      }
    }
  },
  props: {
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },

  watch: {},

  async created() {
    await request({
      url: '/api/warn/cond/listSrcColByType',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          sourceCode: this.param.sourceCode,
          propType: 'dimension'
        }
      }
    }).then(response => {
      response.data.forEach(d => {
        if (d.propAttrObject) {
          this.tab.table.cols.push({
            label: this.$t('data.warning.dimension') + '(' + d.colName + ')',
            prop: d.colCode,
            width: '300',
            element: 'base-select',
            attrs: Object.assign({}, d.propAttrObject, { disabled: true, clearable: false })
          })
        }
      })
    })

    this.showTemplate = true
  },
  methods: {
    // 删行
    doDelete() {
      if (!this.$refs.qmEditTable.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          request({
            url: '/api/warn/employee/remove',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: this.$refs.qmEditTable.currentRow.id
            }
          })
            .then(response => {
              this.loading = false
              this.$notify(notifySuccess({ msg: this.$t('biz.msg.deleteSuccess') }))
              this.$refs.qmEditTable.getList()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    }
  }
}
</script>
