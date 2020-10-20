<template>
  <qm-dialog v-if="showTemplate" ref='qmDialog' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      showTemplate: false,
      showError: false,
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        titleName: '',
        api: {},
        formData: [],
        bottomButtons: []
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  async created() {
    const response = await request({
      url: '/api/code/formwork/dialog',
      method: 'post',
      data: {
        data: this.param.componentCode,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      }
    })
    if (response.data) {
      this.dialog = Object.assign({}, this.dialog, response.data.codeDataJson)
      this.showTemplate = true
    } else {
      this.showError = true
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
