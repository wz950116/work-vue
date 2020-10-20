<template>
  <qm-dialog-table :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('route.' + this.$route.meta.title),
        moreShowFlg: true,
        formData: [{}, {}, {}, {}, {}, {}],

        mainData: {
          api: {
            search: '/api/dd/spot/price/list'
          },
          table: {
            cols: []
          }
        },

        bottomButtons: [
          {
            name: 'biz.btn.save',
            event: 'save',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view']
          }
        ]
      }
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
