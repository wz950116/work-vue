<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <template v-if="$route.name === 'apiModule'">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>
<script>
import request from '@/utils/frame/base/request'

import { notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  name: 'apiModule',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          camelToUnderlineFlg: true,
          defaultSortString: 'apiUrl.asc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            apiModel: null,
            apiCode: null,
            logFlg: null,
            logDetailFlg: null,
            swaggerFg: null,
            permissionsFlg: null,
            apiUrl: null
          }
        },
        formData: [
          {
            label: 'platform.api.api',
            prop: 'apiUrl',
            element: 'input-validate'
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/platform/cfgApi/list',
          export: '/api/platform/cfgApi/export'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'init',
            iconName: '线性-设置',
            i18n: 'biz.btn.init',
            event: this.initApi
          },
          {
            name: 'refresh'
          },
          {
            name: 'export',
            type: 'api',
            getParam() {
              return {
                autoWidth: true,
                showSerialNum: false,
                rowIndex: 10,
                colIndex: 4
              }
            }
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: this.$route.meta.title,
          sortable: 'custom',
          cols: [
            {
              prop: 'apiUrl',
              width: '200',
              label: 'platform.api.api'
            },
            {
              prop: 'apiCode',
              width: '200',
              label: 'platform.api.apiCode'
            },
            {
              prop: 'apiMemo',
              width: '200',
              label: 'platform.api.apiMemo'
            },
            {
              prop: 'className',
              width: '200',
              label: 'platform.api.className'
            },
            {
              prop: 'classNameMemo',
              width: '200',
              label: 'platform.api.classNameMemo'
            },
            {
              prop: 'methodName',
              width: '150',
              label: 'platform.api.methodName'
            },
            {
              prop: 'apiModel',
              width: '100',
              label: 'platform.api.apiModel'
            },
            {
              prop: 'logFlg',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'platform.api.logFlg'
            },
            {
              prop: 'logDetailFlg',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'platform.api.logDetailFlg'
            },
            {
              prop: 'swaggerFlg',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'platform.api.swaggerFlg'
            },
            {
              prop: 'permissionsFlg',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'platform.api.permissionsFlg'
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
    initCfgApi(func) {
      return request({
        url: '/api/platform/cfgApi/init',
        method: 'post',
        data: {
          funcModule: func.funcModule,
          funcOperation: func.funcOperation,
          data: ''
        }
      })
    },

    initApi() {
      this.$confirm('确认要进行数据初始化', this.$t('biz.msg.tip'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.loading = true
          this.initCfgApi({
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.init')
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: '初始化成功' }))
              this.loading = false
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
