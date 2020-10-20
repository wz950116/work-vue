<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  name: 'msgEmployee',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/bpmMsgEmployee/list'
        },
        apiData: {
          moduleCode: this.param.moduleCode,
          search() {
            return { moduleCode: this.moduleCode }
          }
        },
        topBar: [
          {
            name: 'set',
            type: 'dialog',
            moduleCode: this.param.moduleCode,
            getParam() {
              return { moduleCode: this.moduleCode }
            },
            component: () => import('./groupSet.vue')
          },
          {
            name: 'delete',
            event: this.deleteRow,
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow'
          }
        ],
        table: {
          cols: [
            {
              label: 'func.approvalGroup.list.employeeName',
              prop: 'employeeName',
              width: 200
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
    }
  },
  mounted() {},
  methods: {
    deleteRow() {
      if (!this.$refs.tab.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (this.$refs.tab.currentRow) {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            // 删行
            this.$refs.tab.tableData.splice(this.$refs.tab.tableData.indexOf(this.$refs.tab.currentRow), 1)

            const tabEmployee = []
            this.$refs.tab.tableData.forEach(item => {
              tabEmployee.push({
                employeeCode: item.employeeCode,
                employeeName: item.employeeName,
                moduleCode: this.param.moduleCode
              })
            })

            this.loading = true
            request({
              url: '/api/func/auditEmployee/savelist',
              method: 'POST',
              data: {
                data: {
                  code: this.param.moduleCode,
                  tabEmployee: tabEmployee
                },
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.save')
              }
            })
              .then(response => {
                this.$notify(notifySuccess({ msg: this.$t('biz.msg.updateSuccess') }))
                this.loading = false
                this.handleCloseDialog(true)
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {})
      } else {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    }
  }
}
</script>

