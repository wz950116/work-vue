<template>
  <qm-edit-tab ref='qmEditTable' :tab='tabData' @closeHandler='handleClose'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tabData: {
        type: this.type,
        api: {
          search: '/api/platform/cfgTenantComp/list'
        },
        apiData: {
          code: this.param.code,
          search() {
            return { tenantCode: this.code }
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'set',
            type: 'dialog',
            param: this.param,
            getParam() {
              return this.param.code
            },
            isShow: ['detailSet'],
            component: () =>
              import('@/views/frame/base/platform/tenant/componentSet.vue')
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          showSelection: false,
          cols: [
            {
              prop: 'code',
              width: '200',
              label: 'platform.cfgComponent.code'
            },
            {
              prop: 'name',
              width: '200',
              label: 'platform.cfgComponent.name'
            },
            {
              prop: 'systemFlag',
              label: 'platform.cfgComponent.systemFlag',
              width: '130',
              align: 'center',
              format: {
                dict: this.$t('datadict.systemFlag')
              }
            },
            {
              prop: 'blockType',
              label: 'platform.cfgComponent.blockType',
              width: '150',
              align: 'center',
              format: {
                dict: this.$t('datadict.blockType')
              }
            },
            {
              prop: 'routerName',
              label: 'platform.cfgComponent.routerName'
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    handleClose(params) {
      if (params) {
        this.$refs.qmEditTable.getList()
      }
    }
  }
}
</script>
