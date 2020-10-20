<template>
  <qm-dialog v-if="showTemplate" ref='qmDialog' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  name: 'generatorDialog',
  data() {
    return {
      showTemplate: false,
      showError: false,
      dialog: {
        type: 'view',
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
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  async created() {
    const response = await request({
      url: '/api/code/codeManage/get',
      method: 'post',
      data: {
        data: this.param.code,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      }
    })
    if (response.data) {
      this.dialog = Object.assign({}, this.dialog, response.data.codeDataJson)
      // 预览只保留关闭按钮
      this.dialog.bottomButtons = [{
        event: "close",
        isShow: ["add", "update", "view"],
        name: "biz.btn.close"
      }]
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
