<template>
  <div class="app-container">

    <qm-form ref='qmForm' :form='form'></qm-form>

    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <!--     <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)"> -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>

    <!-- </template> -->

  </div>
</template>

<script>
import { notifySuccess, confirmTip } from '@/utils/frame/base/notifyParams'
// axios访问
import request from '@/utils/frame/base/request'
export default {
  name: 'tenantManage',
  data() {
    return {
      dialogVisible: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          camelToUnderlineFlg: true,
          defaultSortString: 'id.desc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            name: '',
            usingFlag: ''
          }
        },

        formData: [
          {
            label: 'platform.tenant.name',
            prop: 'name',
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
              clearable: false
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/platform/cfgTenant/list',
          // 删除
          doDelete: '/api/platform/cfgTenant/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            opType: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/base/platform/tenant/add.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            opType: 'view',
            type: 'dialog',
            getParam: currentRow => {
              return currentRow.code
            },
            component: () => import('@/views/frame/base/platform/tenant/edit.vue')
          },
          {
            name: 'update',
            opType: 'update',
            type: 'dialog',
            getParam: currentRow => {
              return currentRow.code
            },
            component: () => import('@/views/frame/base/platform/tenant/edit.vue')
          },
          {
            name: 'detailSet',
            type: 'route',
            routeInfo: currentRow => {
              return {
                name: 'tenantDetail',
                params: {
                  back: 'tenantManage',
                  opType: 'detailSet',
                  code: currentRow.code
                }
              }
            }
          },
          {
            name: 'resetPwd',
            iconName: '线性-重置密码',
            i18n: 'biz.btn.resetPwd',
            event: this.resetPwd
          },
          {
            name: 'set',
            iconName: '线性-设置',
            i18n: 'biz.btn.sync',
            url: '/api/platform/cfgTenantFunc/sync',
            getParam(currentRow) {
              return currentRow.code
            }
          },
          {
            name: 'remove',
            getParam: currentRow => {
              return currentRow.id
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          sortable: 'custom',
          id: this.$route.meta.title,
          cols: [
            {
              prop: 'name',
              width: '200',
              label: 'platform.tenant.name'
            },
            {
              prop: 'code',
              width: '80',
              label: 'platform.tenant.code'
            },
            {
              prop: 'codeHash',
              width: '250',
              label: 'platform.tenant.codeHash'
            },
            {
              prop: 'usingFlag',
              width: '80',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              prop: 'contactor',
              width: '100',
              label: 'platform.tenant.contactor'
            },
            {
              prop: 'account',
              width: '100',
              label: 'platform.tenant.account'
            },
            {
              prop: 'tel',
              width: '100',
              label: 'platform.tenant.tel'
            },
            {
              label: 'platform.tenant.failnum',
              prop: 'failnum',
              width: '120',
              align: 'right'
            },
            {
              label: 'platform.tenant.loginTime',
              prop: 'loginTime',
              width: '140'
            },
            {
              label: 'platform.tenant.onlineNum',
              prop: 'onlineNum',
              width: '120',
              align: 'right'
            },
            {
              sortable: false,
              prop: 'remark',
              'min-width': '300',
              label: 'biz.lbl.remark'
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
  },
  components: {},
  methods: {
    resetPwd() {
      confirmTip(this, 'confirmResetPwd')
        .then(() => {
          this.loading = true
          request({
            url: '/api/platform/cfgTenant/resetPwd',
            method: 'POST',
            data: {
              data: this.$refs.qmTable.currentRow.id,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.resetPwd')
            }
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: this.$t('biz.msg.updateSuccess') }))
              this.loading = false
              this.getList()
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

