<template>
  <qm-edit-tab ref='qmEditTable' :tab='tab'>
  </qm-edit-tab>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      emptyTextVisible: true,
      data: [],
      list: null,
      loading: false,
      dialogFormVisible: false,
      selectRow: [],
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        api: {
          search: '/api/func/userRole/listByRole'
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
            // 按钮图标
            // 按钮标识
            name: 'set',
            // 对象引用，用于方法
            // 是查看：view(默认) 或者编辑 update 或者添加 add
            // 打开方式:dialog 弹窗， route 路由
            type: 'dialog',
            isShow: ['detailSet'],
            param: this.param,
            getParam() {
              return this.param.code
            },
            // 弹窗组件
            component: () => import('@/views/frame/base/func/role/userSet.vue')
          },
          {
            name: 'delete',
            isShow: ['detailSet'],
            event: this.doDelete
          }
        ],
        isColset: true,
        table: {
          cols: [
            {
              prop: 'name',
              label: 'func.user.name',
              width: 150
            },
            {
              prop: 'account',
              label: 'func.user.account'
            },
            {
              prop: 'employeeName',
              label: 'func.user.employeeName',
              width: 150
            },
            {
              prop: 'orgName',
              label: 'func.employee.organName',
              width: 300
            },
            {
              prop: 'deptName',
              label: 'func.employee.deptName',
              width: 300
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
            url: '/api/func/userRole/remove',
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
