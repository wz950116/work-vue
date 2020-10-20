<template>
  <div class="app-container">

    <qm-form ref='qmForm' :form='form'></qm-form>

    <qm-table ref='qmTable' :mainData='mainData'>
      <!-- icon 此列特殊处理-->

      <template slot='icon' slot-scope='scope'>
        <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon"></svg-icon>
      </template>

      <!-- flag 此列特殊处理-->
      <template slot='flag' slot-scope='scope'>
        <el-tag size="mini" v-if="scope.row.flag==='0'" type="">目录</el-tag>
        <el-tag size="mini" v-else-if="scope.row.flag==='2'" type="warning">按钮</el-tag>
        <el-tag size="mini" v-else-if="scope.row.flag==='1'" type="success">菜单</el-tag>
        <el-tag size="mini" v-else-if="scope.row.flag==='3'" type="danger">子路由</el-tag>
      </template>

      <template slot='sortNo' slot-scope='scope'>
        {{ scope.row.sortNo | buttonFilters(scope.row.flag)}}
      </template>

      <template slot='hidden' slot-scope='scope'>
        {{ scope.row.hidden | tagFilters(scope.row.flag)}}
      </template>

      <template slot='noCache' slot-scope='scope'>
        {{ scope.row.noCache | tagFilters(scope.row.flag)}}
      </template>

      <template slot='iframeFlag' slot-scope='scope'>
        {{ scope.row.iframeFlag | tagFilters(scope.row.flag)}}
      </template>

    </qm-table>
  </div>
</template>
<script>
// 提醒
import { notifyError, notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import * as moduleApi from '@/api/frame/base/platform/module'
import request from '@/utils/frame/base/request'

export default {
  name: 'moduleManage',
  data() {
    return {
      operInfo: {},
      opType: 'add',
      operateId: '',
      menuRow: {},
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            catalog: ''
          }
        },
        formData: [
          {
            label: 'platform.menu.catalog',
            prop: 'catalog',
            element: 'base-select',
            attrs: {
              data: 'ROOT_MENU',
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/platform/cfgModule/menu',
          doDelete: '/api/platform/cfgModule/remove'
        },
        isTopBar: true,
        initSearch: true,
        topBar: [
          // 添加根目录
          {
            name: 'add',
            i18n: 'platform.menu.btn.addRoot',
            type: 'dialog',
            getParam() {
              return { menuRow: null, opType: 'add' }
            },
            component: () => import('@/views/frame/base/platform/menu/edit.vue')
          },
          // 目录调整
          {
            name: 'add',
            iconName: '线性-修改',
            i18n: 'platform.menu.btn.sortMenu',
            type: 'dialog',
            component: () => import('@/views/frame/base/platform/menu/menuSort.vue')
          },
          // 菜单检查
          {
            name: 'menuCheck',
            iconName: '线性-编排',
            i18n: 'platform.menu.btn.menuCheck',
            event: this.menuCheck
          },
          // 新增
          {
            name: 'update',
            iconName: '线性-新增',
            i18n: 'biz.btn.add',
            type: 'dialog',
            msg: this.$t('platform.menu.msg.add'),
            validate: currentRow => {
              const flg = currentRow && currentRow.flag === '0'

              return flg
            },
            getParam: () => {
              return { menuRow: this.$refs.qmTable.currentRow, opType: 'add' }
            },
            component: () => import('@/views/frame/base/platform/menu/edit.vue')
          },
          // 修改
          {
            name: 'update',
            type: 'dialog',
            msg: this.$t('platform.menu.msg.update'),
            validate: currentRow => {
              const flg = currentRow && (currentRow.flag === '0' || currentRow.flag === '1')

              return flg
            },
            getParam: () => {
              return { menuRow: this.$refs.qmTable.currentRow, opType: 'routeupdate' }
            },
            component: () => import('@/views/frame/base/platform/menu/edit.vue')
          },
          // 添加子路由
          {
            name: 'update',
            iconName: '线性-新增',
            i18n: 'platform.menu.btn.addRoute',
            type: 'dialog',
            msg: this.$t('platform.menu.msg.addRoute'),
            validate: currentRow => {
              const flg = currentRow && currentRow.flag === '1'

              return flg
            },
            getParam: () => {
              return { menuRow: this.$refs.qmTable.currentRow, opType: 'route' }
            },
            component: () => import('@/views/frame/base/platform/menu/edit.vue')
          },
          // 修改子路由
          {
            name: 'update',
            i18n: 'platform.menu.btn.editRoute',
            type: 'dialog',
            msg: this.$t('platform.menu.msg.editRoute'),
            validate: currentRow => {
              const flg = currentRow && currentRow.flag === '3'

              return flg
            },
            getParam: () => {
              return { menuRow: this.$refs.qmTable.currentRow, opType: 'update' }
            },
            component: () => import('@/views/frame/base/platform/menu/edit.vue')
          },
          // 按钮管理
          {
            name: 'update',
            i18n: 'platform.menu.btn.manageBtn',
            type: 'dialog',
            msg: this.$t('platform.menu.msg.manageBtn'),
            validate: currentRow => {
              const flg = currentRow && currentRow.flag === '1'
              return flg
            },
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/platform/menu/addButton.vue')
          },
          // 权限数据
          {
            name: 'update',
            i18n: 'platform.menu.btn.authData',
            type: 'route',
            routeInfo: () => {
              return {
                name: 'authData',
                params: {
                  back: 'moduleManage',
                  moduleCode: this.$refs.qmTable.currentRow.moduleCode
                }
              }
            },
            msg: this.$t('platform.menu.msg.authData'),
            validate: currentRow => {
              const flg = currentRow && currentRow.flag === '1'
              return flg
            }
          },
          // 流程数据
          {
            name: 'update',
            i18n: 'platform.menu.btn.bpmData',
            type: 'route',
            routeInfo: () => {
              return {
                name: 'bpmData',
                params: {
                  back: 'moduleManage',
                  moduleCode: this.$refs.qmTable.currentRow.moduleCode
                }
              }
            },
            msg: this.$t('platform.menu.msg.bpmData'),
            validate(currentRow) {
              const flg = currentRow && currentRow.flag === '1'

              return flg
            }
          },
          // {
          //   name: 'set',
          //   i18n: 'addButton',
          //   url: '/api/platform/cfgOperate/addButton',
          //   getParam: () => {
          //     return {}
          //   }
          // },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.moduleCode
            }
          },
          {
            name: 'refresh'
          }
        ],

        isColset: false,
        table: {
          rowKey: 'treeId',
          parentRowKey: 'treeParentId',
          expandAll: true,
          lazy: true,
          cols: [
            {
              prop: 'cname',
              label: 'platform.menu.name',
              width: '350'
            },
            {
              prop: 'icon',
              label: 'platform.menu.icon',
              width: '50',
              isSlot: true
            },
            {
              prop: 'name',
              width: '200',
              label: 'platform.menu.routeName'
            },
            {
              label: 'biz.lbl.usingFlag',
              prop: 'usingFlag',
              width: '60'
            },
            {
              prop: 'flag',
              width: '100',
              label: 'platform.menu.menuFlag',
              isSlot: true
            },
            {
              prop: 'moduleCode',
              width: '60',
              label: 'platform.menu.moduleCode'
            },
            {
              prop: 'authFlag',
              label: 'platform.menu.authFlag',
              width: '100',
              format: {
                dict: this.$t('datadict.authFlag')
              }
            },
            {
              prop: 'moduleType',
              label: 'platform.menu.moduleType',
              width: '60',
              format: {
                dict: this.$t('datadict.moduleType')
              }
            },
            {
              prop: 'path',
              label: 'platform.menu.path',
              width: '150'
            },
            {
              prop: 'componentName',
              label: 'platform.menu.componentName',
              width: '150'
            },
            {
              prop: 'reuseFlag',
              label: 'platform.menu.reuseFlag',
              width: '60'
            },
            {
              prop: 'component',
              label: 'platform.menu.component',
              width: '300'
            },
            {
              prop: 'sortNo',
              width: '60',
              label: 'platform.menu.sortNo',
              isSlot: true
            },
            {
              prop: 'hidden',
              width: '60',
              label: 'platform.menu.hiden',
              isSlot: true
            },
            {
              prop: 'noCache',
              width: '60',
              label: 'platform.menu.noCache',
              isSlot: true
            },
            {
              prop: 'iframeFlag',
              width: '60',
              label: 'platform.menu.iframeFlag',
              isSlot: true
            }
          ]
        },
        bottomBar: {
          pagination: {
            show: false,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  },

  filters: {
    iframeFlag(value, flag) {
      if (value) {
        if (flag === '2' || flag === '1') {
          return value
        } else {
          return '-'
        }
      } else {
        return '-'
      }
    },
    buttonFilters(value, flag) {
      if (flag === '2') {
        return '-'
      } else {
        return value
      }
    },
    tagFilters(value, flag) {
      if (flag === '2') {
        return '-'
      } else {
        if (value) {
          return true
        } else {
          return '-'
        }
      }
    },
    apiAuthFilters(value, flag) {
      if (flag !== '2') {
        return '-'
      } else {
        return value
      }
    }
  },
  methods: {
    remove() {
      var row = this.$refs.qmTable.currentRow
      if (row != null) {
        if (row.children != null && row.children.length > 0) {
          this.$notify(notifyInfo({ msg: '有子数据，不可以删除' }))

          return
        }
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            if (row.flag === '2') {
              this.confirmDeleteButton(row.id)
            } else {
              this.confirmDeleteMenu(row.id)
            }
          })
          .catch(() => {})
      } else {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    confirmDeleteMenu(id) {
      this.loading = true

      this.operInfo.funcModule = this.$t('route.' + this.$route.meta.title)
      this.operInfo.funcOperation = this.$t('biz.btn.delete')
      moduleApi
        .removeMenu(id, this.operInfo)
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.deleteSuccess') }))
          this.getList()
        })
        .catch(e => {
          this.loading = false
        })
    },

    menuCheck() {
      this.loading = true

      this.operInfo.funcModule = this.$t('route.' + this.$route.meta.title)
      this.operInfo.funcOperation = this.$t('platform.menu.btn.menuCheck')
      moduleApi
        .checkMenu(this.operInfo)
        .then(response => {
          this.$notify(notifyInfo({ msg: response.data }))
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

