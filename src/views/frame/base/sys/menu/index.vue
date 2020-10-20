<template>
  <div class="app-container">

    <el-alert title="因菜单信息有5分钟的缓存，业务员在5分钟后登陆可以看到新的菜单目录" type="warning" show-icon style='margin-bottom: 3px;'></el-alert>

    <qm-table ref='qmTable' :mainData='mainData'>

      <!-- icon 此列特殊处理-->
      <template slot='icon' slot-scope='scope' align='center'>
        <svg-icon v-if="scope.row.icon" :icon-class="scope.row.icon"></svg-icon>
      </template>

      <!-- flag 此列特殊处理-->
      <template slot='leafFlag' slot-scope='scope' align='center'>
        <el-tag size="mini" v-if="scope.row.leafFlag==='0'" type="">目录</el-tag>
        <el-tag size="mini" v-else-if="scope.row.leafFlag==='1'" type="success">菜单</el-tag>
      </template>

      <template slot='usingFlag' slot-scope='scope' align='center'>
        <el-switch v-model="scope.row.usingFlag" disabled>
        </el-switch>
      </template>

    </qm-table>
  </div>
</template>
<script>
// 提醒
import { notifyError, notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import * as moduleApi from '@/api/frame/base/platform/module'
export default {
  name: 'sysMenuManage',
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
          // {
          //   label: 'platform.menu.catalog',
          //   prop: 'catalog',
          //   element: 'base-select',
          //   attrs: {
          //     data: 'ROOT_MENU',
          //     clearable: true
          //   }
          // }
        ]
      },
      mainData: {
        api: {
          search: '/api/sys/menu/list',
          doDelete: '/api/sys/menu/remove'
        },
        isTopBar: true,
        initSearch: true,
        topBar: [
          // 添加根目录
          {
            name: 'sync',
            iconName: '线性-设置',
            i18n: 'biz.btn.sync',
            event: this.syncMenu
          },

          // 目录调整
          {
            name: 'add',
            iconName: '线性-修改',
            i18n: 'platform.menu.btn.sortMenu',
            type: 'dialog',
            component: () => import('./menuSort.vue')
          },
          // 添加根目录
          {
            name: 'add',
            i18n: 'platform.menu.btn.addRoot',
            type: 'dialog',
            getParam() {
              return { menuRow: null }
            },
            component: () => import('./edit.vue')
          },
          // 新增
          {
            name: 'add',
            iconName: '线性-新增',
            i18n: 'biz.btn.add',
            type: 'dialog',
            msg: this.$t('platform.menu.msg.add'),
            validate: currentRow => {
              const flg = currentRow && currentRow.leafFlag === '0'
              return flg
            },
            getParam: currentRow => {
              return { menuRow: currentRow }
            },
            component: () => import('./edit.vue')
          },
          // 修改
          {
            name: 'update',
            type: 'dialog',
            msg: this.$t('platform.menu.msg.update'),
            getParam: currentRow => {
              return { menuRow: currentRow }
            },
            component: () => import('./edit.vue')
          },
          {
            name: 'set',
            i18n: 'biz.btn.examine',
            permitName: ['examine'],
            event: this.check
          },

          {
            name: 'remove',
            msg: '只能删除自有目录或者菜单,如为目录，则当前目录下没有目录/菜单',
            validate: this.removeValidate,
            getParam: currentRow => {
              return currentRow.id
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: false,
        table: {
          rowKey: 'code',
          parentRowKey: 'parentCode',
          expandAll: true,
          lazy: false,
          cols: [
            {
              prop: 'menuName',
              label: 'platform.menu.menuName',
              width: '350'
            },
            {
              prop: 'icon',
              label: 'platform.menu.icon',
              width: '50',
              align: 'center',
              isSlot: true
            },
            {
              prop: 'leafFlag',
              width: '80',
              align: 'center',
              label: 'platform.menu.menuFlag',
              isSlot: true
            },
            {
              prop: 'menuCode',
              width: '200',
              label: 'platform.menu.menuName'
            },
            {
              prop: 'code',
              width: '200',
              label: 'platform.menu.code'
            },
            {
              prop: 'parentCode',
              isShow: false
            },
            {
              prop: 'sortNo',
              width: '100',
              label: 'platform.menu.sortNo',
              align: 'left'
            },
            {
              prop: 'selfFlag',
              width: '100',
              label: 'platform.menu.selfFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              label: 'biz.lbl.usingFlag',
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            }
          ]
        }
      }
    }
  },
  methods: {
    syncMenu() {
      this.$confirm('同步时，不会影响当前数据，只是添加平台新增加的菜单和目录结构信息', this.$t('biz.msg.tip'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.loading = true
          request({
            url: '/api/sys/menu/sync',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.sync')
            }
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: '同步成功' }))
              this.$refs.qmTable.getList()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    removeValidate(row) {
      // 自有数据才可以删除
      if (row.selfFlag !== '1') {
        return false
      }
      // 有下级数不可以删除
      if (row.hasChildren) {
        return false
      }
      return true
    },

    check() {
      this.loading = true

      request({
        url: '/api/sys/menu/check',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.examine')
        }
      })
        .then(response => {
          if (response.data) {
            this.$notify(
              notifyError({
                msg: '解决办法：请重新调整问题菜单目录层级(调到别的目录，再调整回来)。' + '问题菜单：' + response.data
              })
            )
          } else {
            this.$notify(notifySuccess({ msg: '没有问题' }))
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

