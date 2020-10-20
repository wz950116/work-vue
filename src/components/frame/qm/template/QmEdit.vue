<template>
  <div>
    <qm-dialog-edit v-el-drag-dialog v-if='edit.mode === "dialog"' :edit='edit' @initCallback='handleInitCallback' @preCallback='handlePreCallback' @closeDialog='handleCloseDialog' @closeLv2Dialog='handleCloseLv2Dialog' ref='qmDialogEdit'></qm-dialog-edit>
    <qm-route-edit v-else :edit='edit' @initCallback='handleInitCallback' @closeDialog='handleCloseDialog' @preCallback='handlePreCallback' @closeLv2Dialog='handleCloseLv2Dialog' ref='qmRouteEdit'></qm-route-edit>
  </div>
</template>

<script>
export default {
  props: {
    edit: {
      type: Object,
      default() {
        return {}
      }
    },
    componentName: {
      type: String,
      default() {
        return 'QmEdit'
      }
    }
  },
  components: {
    qmDialogEdit: () => import('@/components/frame/qm/template/dialog/QmDialogEdit'),
    qmRouteEdit: () => import('@/components/frame/qm/template/QmRouteEdit')
  },
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeDialog', param)
    },
    handleCloseLv2Dialog(param) {
      this.$emit('closeLv2Dialog', param)
    },
    handleInitCallback(param) {
      this.$emit('initCallback', param)
    },
    handlePreCallback(param) {
      this.$emit('preCallback', param)
    }
  }
}
</script>
