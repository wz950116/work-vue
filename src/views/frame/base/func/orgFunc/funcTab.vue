<template>
  <qm-edit-tree-tab ref='qmEditTable' :tab='tabData'></qm-edit-tree-tab>
</template>

<script>
export default {
  data() {
    return {
      tabData: {
        type: 'view',
        api: {
          search: '/api/func/orgFunc/listOperate'
        },
        apiData: {
          search: this.param.code
        },
        topBar: [
          {
            // 按钮图标
            // 按钮标识
            name: 'set',
            // 对象引用，用于方法
            // 是查看：view(默认) 或者编辑 update 或者添加 add
            // 打开方式:dialog 弹窗， route 路由
            type: 'dialog',
            param: this.param,
            getParam() {
              return this.param.code
            },
            // 弹窗组件
            component: () => import('@/views/frame/base/func/orgFunc/funcSet.vue')
          },
          {
            name: 'expand'
          }
        ],
        isColset: false,
        table: {
          id: this.$route.meta.title,
          showSelection: false,
          rowKey: 'code',
          expandAll: true,
          cols: [
            {
              prop: 'cname',
              width: '400',
              label: 'func.role.moduleName'
            },
            {
              prop: 'operateNames',
              'min-width': '500',
              label: 'func.role.operateNames'
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
  }
}
</script>
