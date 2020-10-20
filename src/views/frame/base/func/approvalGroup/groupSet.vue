<template>
  <qm-dialog-tree ref="qmTable" :dialog='dialog' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-dialog-tree>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
// axios访问
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('func.approvalGroup.groupSet'),
        form: {
          showCheckbox: true,
          initSearch: true,
          expandOnClickNode: false,
          expandAll: true,
          strictly: true,
          isSearch: true,
          showCode: false,
          api: {
            getTreeList: '/api/func/employee/treeEmployee'
          },
          apiData: {
            getTreeList() {
              return {
                usingFlag: '1'
              }
            }
          },
          defaultProps: {
            children: 'children',
            key: 'code',
            label: 'name'
          }
        },

        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            event: this.save,
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
    param: [Object, String]
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeAndRefreshHandler', params)
    },
    handleInitCallback(data) {
      this.recursionNode(data)

      // 设置默认值
      request({
        url: '/api/func/auditEmployee/list',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: { groupCode: this.param.groupCode }
        }
      })
        .then(response => {
          if (response.data) {
            const checkedEmployee = []
            response.data.forEach(node => {
              checkedEmployee.push(node.employeeCode)
            })

            // 初始化数据默认选中
            this.$refs.qmTable.defaultCheckedKeys = checkedEmployee
          }
        })
        .catch(() => {})
    },
    // 递归
    recursionNode(data) {
      if (data instanceof Array) {
        data.forEach(node => {
          if (!node.employeeCode) {
            node.disabled = true
          }
          if (node.children && node.children.length > 0) {
            this.recursionNode(node.children)
          }
        })
      }
    },
    // 保存通用事件
    save() {
      if (!this.$refs.qmTable.checkedKeys || this.$refs.qmTable.checkedKeys.length < 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        // 操作员账户
        const tabEmployee = []

        this.$refs.qmTable.checkedNodes.forEach(node => {
          tabEmployee.push({
            employeeCode: node.employeeCode,
            employeeName: node.name,
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
    }
  }
}
</script>
