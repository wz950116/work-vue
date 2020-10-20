<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog' ref='qmRouteEdit'></qm-edit>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  name: 'roleDetail',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: 'route',
        param: this.$route.params,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/func/role/get'
        },
        apiData: {
          code: this.$route.params.code,
          view() {
            return this.code
          }
        },
        topButtons: [
          {
            iconName: '线性-取消',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view', 'detailSet'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        formData: {
          part1: {
            titleName: 'func.role.roleInfo',
            content: [
              {
                label: 'func.role.roleName',
                prop: 'roleName',
                element: 'input-validate',
                attrs: {
                  disable: true
                }
              },
              {
                label: 'biz.lbl.usingFlag',
                prop: 'usingFlag',
                element: 'base-select',
                list: this.$t('datadict.usingFlag'),
                attrs: {
                  disable: true
                }
              },
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  disable: true,
                  cols: 2
                }
              }
            ]
          }
        },
        tabs: [
          {
            name: 'userTab',
            label: 'func.role.tab.user',
            component: () => import('./userTab.vue')
          },
          {
            name: 'funcTab',
            label: 'func.role.tab.func',
            component: () => import('./funcTab.vue')
          },
          {
            name: 'org',
            label: 'func.role.tab.org',
            isShow: false,
            component: () => import('./orgTab.vue')
          },
          {
            name: 'dept',
            label: 'func.role.tab.dept',
            isShow: false,
            component: () => import('./deptTab.vue')
          },
          {
            name: 'employee',
            label: 'func.role.tab.employee',
            isShow: false,
            component: () => import('./employeeTab.vue')
          },
          {
            name: 'menuDataTab',
            label: 'func.role.tab.menuData',
            component: () => import('./menuDataTab.vue')
          },
          {
            name: 'apiData',
            label: 'func.role.tab.apiData',
            component: () => import('./apiTab.vue')
          }
        ]
      }
    }
  },
  created() {
    request({
      url: '/api/func/dataper/listAll',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {}
      }
    }).then(response => {
      this.tableData = response.data
      if (this.tableData && this.tableData.length > 0) {
        this.tableData.forEach(t => {
          if (t.usingFlag === '1') {
            this.edit.tabs.forEach(v => {
              // 重新设置isshow
              if (v.name === t.code) {
                v.isShow = true
              }
            })
          }
        })
      }
    })
  },
  methods: {
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', param)
      } else {
        const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: backName,
            params: { ...(!!param && { refresh: !!param }) }
          })
        })
      }
    }
  }
}
</script>
