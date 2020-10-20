<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  name: 'approvalGroup',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/func/auditEmployee/list'
        },
        apiData: {
          groupCode: this.param.groupCode,
          search() {
            return { groupCode: this.groupCode }
          }
        },
        topBar: [
          {
            name: 'set',
            type: 'dialog',
            groupCode: this.param.groupCode,
            getParam() {
              return { groupCode: this.groupCode }
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
              prop: 'employeeName'
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
                groupCode: this.param.groupCode
              })
            })

            this.loading = true
            request({
              url: '/api/func/auditEmployee/savelist',
              method: 'POST',
              data: {
                data: {
                  code: this.param.groupCode,
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

