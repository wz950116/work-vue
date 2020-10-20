<template>
  <qm-edit-tab ref='qmEditTable' :tab='tab'></qm-edit-tab>
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
          search: '/api/func/roleDataperMod/listNameByRoleCode'
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
            i18n: 'func.role.authLimit',
            param: this.param,
            isShow: ['detailSet'],
            validate: this.notify,
            getParam() {
              return {
                code: this.param.code,
                authDirection: 'limit'
              }
            },
            // 弹窗组件
            component: () => import('@/views/frame/base/func/role/menuDataSet.vue')
          },
          {
            // 按钮图标
            // 按钮标识
            name: 'set',
            i18n: 'func.role.authExtend',
            // 对象引用，用于方法
            // 是查看：view(默认) 或者编辑 update 或者添加 add
            // 打开方式:dialog 弹窗， route 路由
            type: 'dialog',
            param: this.param,
            isShow: ['detailSet'],
            validate: this.notify,
            getParam() {
              return {
                code: this.param.code,
                authDirection: 'extend'
              }
            },
            // 弹窗组件
            component: () => import('@/views/frame/base/func/role/menuDataSet.vue')
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
              prop: 'authDirection',
              label: 'func.role.authDirection',
              width: 120,
              format: {
                dict: this.$t('datadict.authDirection')
              }
            },
            {
              prop: 'moduleName',
              label: 'func.role.moduleName',
              width: 200
            },
            {
              prop: 'colNames',
              label: 'func.role.colNames'
            },
            {
              prop: 'condNames',
              label: 'func.role.condNames'
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
    notify() {
      // this.$notify(
      //   notifyInfo({
      //     msg: '本功能属于定制开发内容！'
      //   })
      // )
      // return false
      return true
    },
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
            url: '/api/func/roleDataperMod/remove',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: {
                authDirection: this.$refs.qmEditTable.currentRow.authDirection,
                roleCode: this.param.code,
                moduleCode: this.$refs.qmEditTable.currentRow.moduleCode
              }
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
