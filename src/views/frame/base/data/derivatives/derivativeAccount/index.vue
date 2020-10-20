<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData" @initCallback='initCallback'></qm-table>
    </template>
    <edit-password v-if='flag' @closeHandlerDialog='closeHandlerDialog' :param='$refs.qmTable.currentRow'></edit-password>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import editPassword from '@/views/frame/base/data/derivatives/derivativeAccount/editPassword'
import { Notification } from 'element-ui'
// 提醒
import { notifySuccess, notifyError, notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'derivativeAccount',
  components: {
    editPassword
  },
  data() {
    return {
      flag: false,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            organCode: '',
            bankCode: '',
            bankAccountName: '',
            usingFlag: '',
            bankAccountNo: '',
            bankAccountType: ''
          }
          // ,defaultSortString: 'ORGAN_NAME.asc'
        },
        formData: [
          {
            label: 'dataHq.derivativeAccount.customerId',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              clearable: true,
              data: 'CUST_INFO',
              params: {
                typeCode: '4' // 不写:所有客户供应商经济商仓储公司， '1'只显示客户，'2'只显示供应商，
              }
            }
          },
          {
            label: 'dataHq.derivativeAccount.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.derivativeAccount.derivativeAccountCode',
            prop: 'derivativeAccountCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.derivativeAccount.organId',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true
            }
          },
          {
            label: 'dataHq.derivativeAccount.onlineStat',
            prop: 'onlineStat',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/dd/derivativeAccount/list',
          doDelete: '/api/dd/derivativeAccount/remove',
          doLogin: '/api/ctp/loginFuturesAccount',
          doLogout: '/api/ctp/logoutFuturesAccount'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              // TODO //return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/derivativeAccount/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/derivativeAccount/edit.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'login',
            iconName: '线性-登录',
            i18n: this.$t('biz.btn.login'),
            $refs: this.$refs,
            event: this.doLogin
          },
          {
            name: 'logout',
            iconName: '线性-断开',
            i18n: this.$t('biz.btn.logout'),
            $refs: this.$refs,
            event: this.doLogout
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/derivatives/derivativeAccount/edit.vue')
          },
          {
            name: 'refresh',
            $refs: this.$refs
          },
          {
            name: 'resetPwd',
            iconName: '线性-重置密码',
            i18n: this.$t('biz.btn.resetPwd'),
            $refs: this.$refs,
            event: this.resetPwd
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'customerName',
              label: 'dataHq.derivativeAccount.customerId'
            },
            {
              prop: 'derivativeAccount',
              label: 'dataHq.derivativeAccount.derivativeAccount'
            },
            {
              prop: 'derivativeAccountCode',
              label: 'dataHq.derivativeAccount.derivativeAccountCode'
            },
            {
              prop: 'derivativeTypes',
              align: 'center',
              format: {
                dict: this.$t('datadict.derivativeType')
              },
              label: 'dataHq.derivativeAccount.derivativeTypes'
            },
            {
              prop: 'derivativeAccountType',
              align: 'center',
              format: {
                dict: this.$t('datadict.derivativeAccountType')
              },
              label: 'dataHq.derivativeAccount.derivativeAccountType'
            },
            {
              prop: 'organName',
              label: 'dataHq.derivativeAccount.organId'
            },
            {
              prop: 'mainName',
              label: 'dataHq.derivativeAccount.mainName'
            },
            {
              prop: 'onlineStat', // 登录状态
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'dataHq.derivativeAccount.onlineStat',
              isShow: process.env.TRADE_PLATFORM === 'ctp'
            },
            {
              prop: 'trusteeshipFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'dataHq.derivativeAccount.trusteeshipFlag'
            },
            {
              prop: 'dataAttr',
              align: 'center',
              format: {
                dict: this.$t('datadict.accountSource')
              },
              label: 'dataHq.derivativeAccount.dataAttr'
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
  methods: {
    initCallback(data) {
      request({
        url: '/api/ctp/listLogin',
        method: 'POST',
        data: {
          data: '',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          const data = response.data
          const table = this.$refs.qmTable.$refs.singleTable
          table.forEach(e => {
            if (data.includes(e.derivativeAccount)) {
              e.onlineStat = '1'
            }
          })
        })
        .catch(() => {})
    },
    closeHandlerDialog() {
      this.flag = false
    },
    resetPwd() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.flag = true
    },
    // 登录
    doLogin() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      let show = false
      if (row.derivativeTypes) {
        row.derivativeTypes.forEach(type => {
          // 判断是否为期货
          if (type === '1') {
            show = true
          }
        })
      } else {
        show = false
      }
      if (!show) {
        Notification(
          notifyInfo({
            msg: this.$t('dataHq.derivativeAccount.msg.futuresLoginMsg')
          })
        )
        return
      }
      if (row.onlineStat !== '0') {
        Notification(
          notifyError({
            msg: this.$t('dataHq.derivativeAccount.msg.disableLogin')
          })
        )
        return
      }
      this.confirmLogin(row, this.$t('biz.btn.login'))
    },
    doLogout() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      let show = false
      if (row.derivativeTypes) {
        row.derivativeTypes.forEach(type => {
          // 判断是否为期货
          if (type === '1') {
            show = true
          }
        })
      } else {
        show = false
      }
      if (!show) {
        Notification(
          notifyInfo({
            msg: this.$t('dataHq.derivativeAccount.msg.futuresLogoutMsg')
          })
        )
        return
      }
      if (row.onlineStat !== '1') {
        Notification(
          notifyError({
            msg: this.$t('dataHq.derivativeAccount.msg.disableLogout')
          })
        )
        return
      }
      this.confirmLogout(row, this.$t('biz.btn.logout'))
    },
    confirmLogin(params, funcOperation) {
      this.loading = true
      request({
        url: this.mainData.api.doLogin,
        method: 'POST',
        data: {
          data: params.id,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: funcOperation
        }
      })
        .then(response => {
          this.loading = false
          Notification(notifySuccess({ msg: this.$t('biz.msg.operationSuccess') }))
          this.$refs.qmTable.getList()
          this.loading = false
        })
        .catch(() => {})
    },
    confirmLogout(params, funcOperation) {
      this.loading = true
      request({
        url: this.mainData.api.doLogout,
        method: 'POST',
        data: {
          data: params.id,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: funcOperation
        }
      })
        .then(response => {
          this.loading = false
          Notification(notifySuccess({ msg: this.$t('biz.msg.operationSuccess') }))
          this.$refs.qmTable.getList()
          this.loading = false
        })
        .catch(() => {})
    }
  }
}
</script>
