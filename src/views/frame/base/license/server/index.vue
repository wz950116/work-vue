<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>
export default {
  name: 'licenseManage',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          importance: undefined,
          title: undefined,
          type: undefined,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          defaultSortString: 'createDate.desc',
          data: {
            usingFlag: ''
          }
        },
        formData: [
          {
            label: '用户名称',
            element: 'input-validate',
            prop: 'userName',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/license/cfgLicense/page'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            i18n: 'biz.btn.register',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'view',
            i18n: 'biz.btn.view',
            type: 'dialog',
            component: () => import('./edit.vue')
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
              prop: 'userName',
              width: '200',
              align: 'left',
              label: '用户名称'
            },
            {
              prop: 'appSubject',
              width: '100',
              align: 'center',
              label: '应用名称'
            },
            {
              prop: 'ip',
              width: '120',
              align: 'center',
              label: 'IP'
            },
            {
              prop: 'macAddress',
              width: '150',
              align: 'center',
              label: 'MAC地址'
            },
            {
              prop: 'expiryTime',
              width: '160',
              align: 'center',
              label: '到期日期'
            },
            {
              prop: 'maxOnlineNum',
              width: '160',
              align: 'center',
              label: '最在在线用户数'
            },
            {
              prop: 'appVersion',
              width: '100',
              align: 'center',
              label: '应用版本'
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

