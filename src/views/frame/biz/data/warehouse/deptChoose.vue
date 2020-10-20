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
        titleName: this.$t('data.deptAllocation.groupSet'),
        form: {
          showCheckbox: true,
          initSearch: true,
          expandOnClickNode: false,
          expandAll: true,
          strictly: true,
          isSearch: true,
          showCode: false,
          nodeKey: 'code',
          api: {
            getTreeList: '/api/func/org/treeOrgan'
          },
          apiData: {
            getTreeList() {
              return {
                usingFlag: '1',
                dataAuth: false
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
            name: 'biz.btn.choose',
            event: this.choose,
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
        url: '/api/dd/warehouseAllocation/getByCode',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: { warehouseCode: this.param.warehouseCode }
        }
      })
        .then(response => {
          if (response.data) {
            const checkedOrgan = []
            response.data.forEach(node => {
              checkedOrgan.push(node.code)
            })
            // 初始化数据默认选中
            this.$refs.qmTable.defaultCheckedKeys = checkedOrgan
          }
        })
        .catch(() => {})
    },
    // 递归
    recursionNode(data) {
      if (data instanceof Array) {
        data.forEach(node => {
          if (node.children && node.children.length > 0) {
            this.recursionNode(node.children)
          }
        })
      }
    },
    // 选择数据带出通用事件
    choose() {
      if (!this.$refs.qmTable.checkedKeys || this.$refs.qmTable.checkedKeys.length < 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      // 选择机构
      const checkedOrgan = []

      this.$refs.qmTable.checkedNodes.forEach(node => {
        checkedOrgan.push({
          organCode: node.code,
          organName: node.name
        })
      })
      this.$emit('closeHandler', checkedOrgan)
    }
  }
}
</script>
