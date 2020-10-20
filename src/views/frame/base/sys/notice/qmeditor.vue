<template>
  <div style="margin-top:5px">
    <iframe ref="qmEditorFrame" src="static/qmeditor/index.html" style="width:100%;height:30rem;border-width:1px"></iframe>
  </div>
</template>
<script>
export default {
  data() {
    return {
      template: {
        freemarker: null,
        editorWin: null,
        wordFileData: {
          filePath: null,
          fileName: null
        }
      }
    }
  },
  inject: ['QmDialogEdit'],
  props: {
    type: String,
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.initDialog()
  },
  methods: {
    initDialog() {
      const qmEditorFrame = this.$refs.qmEditorFrame
      const selfThis = this
      qmEditorFrame.addEventListener('qmEditorInit', function (event) {
        selfThis.template.editorWin = event.detail.editorWin
        selfThis.template.editorWin.setMode('design')
        if (selfThis.type === 'view') {
          selfThis.template.editorWin.setDisabled()
        }
        // 防止加载速度慢于数据返回
        if (selfThis.type === 'view' || selfThis.type === 'update') {
          selfThis.QmDialogEdit.getEditData()
        }
      })
    }
  }
}
</script>

