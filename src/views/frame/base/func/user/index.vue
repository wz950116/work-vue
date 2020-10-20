<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>
export default {
  name: 'userManage',
  data() {
    return {
      form: {
        moreShowFlg: true,
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          importance: undefined,
          title: undefined,
          type: undefined,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          orderByField: 'key',
          data: {
            usingFlag: ''
          }
        },
        formData: [
          {
            label: 'func.user.name',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.user.account',
            prop: 'account',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.user.orgName',
            prop: 'orgCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              clearable: true
            }
          },
          {
            label: 'func.user.deptName',
            prop: 'deptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              clearable: true
            }
          },
          {
            label: 'func.user.employeeName',
            prop: 'employeeName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/func/user/list',
          doDelete: '/api/func/user/remove',
          set: '/api/func/user/resetPwd'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'set',
            permitName: ['resetPassword'],
            i18n: 'biz.btn.resetPwd',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'set',
            permitName: ['unlock'],
            i18n: 'biz.btn.unlock',
            url: '/api/func/user/unlock',
            successMsgInfo: '解锁成功',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'view',
            i18n: 'func.user.userInfo',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.code
            },
            component: () => import('./role.vue')
          },
          {
            name: 'remove',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          cols: [
            {
              label: 'func.user.name',
              prop: 'name',
              sortProp: 'funcUser.name',
              width: '150'
            },
            {
              label: 'func.user.account',
              prop: 'account',
              width: '100'
            },
            {
              label: 'func.user.employeeName',
              prop: 'employeeName',
              width: '120'
            },
            {
              label: 'func.user.identity',
              prop: 'identity',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.optIdentity')
              }
            },
            {
              prop: 'usingFlag',
              width: '80',
              align: 'center',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              label: 'func.user.failnum',
              prop: 'failnum',
              width: '120',
              align: 'right'
            },
            {
              label: 'func.user.loginTime',
              prop: 'loginTime',
              width: '140'
            },
            {
              prop: 'employeeUsingFlag',
              width: '80',
              align: 'center',
              label: 'func.user.employeeUsingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              label: 'func.user.orgName',
              prop: 'orgName',
              width: '200'
            },
            {
              prop: 'orgUsingFlag',
              width: '80',
              align: 'center',
              label: 'func.user.orgUsingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              label: 'func.user.deptName',
              prop: 'deptName',
              width: '120'
            },
            {
              prop: 'deptUsingFlag',
              width: '80',
              align: 'center',
              label: 'func.user.deptUsingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            }
          ]
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  }
}
</script>

