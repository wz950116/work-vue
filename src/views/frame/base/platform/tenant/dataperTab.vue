<template>
  <qm-edit-tab ref='qmEditTable' :tab='tabData'></qm-edit-tab>
</template>

<script>

export default {

  data() {
    return {

      tabData: {
        type: this.type,
        api: {
          search: '/api/platform/cfgTenantDataperDis/listAll'
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
            name: 'update',
            opType: 'update',
            type: 'dialog',
            $refs: this.$refs,
            initType: 'param',
            isShow: ['detailSet'],
            getParam() {
              return this.$refs.qmEditTable.currentRow
            },
            component: () => import('@/views/frame/base/platform/tenant/dataperSet.vue')
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          showSelection: false,
          cols: [{
            prop: 'name',
            width: '200',
            label: 'platform.dataper.name'
          }, {
            prop: 'code',
            width: '200',
            label: 'platform.dataper.code'
          }, {
            prop: 'usingFlag',
            width: '100',
            label: 'biz.lbl.usingFlag',
            format: {
              dict: this.$t('datadict.usingFlag')
            }
          }]
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
  watch: {

  },
  methods: {

  },
  created() {

  }
}
</script>
