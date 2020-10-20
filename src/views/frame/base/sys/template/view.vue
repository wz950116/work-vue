<template>
  <div></div>
</template>
<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import fleTemplateUseApi from '@/api/frame/base/file/templateUse'
export default {
  name: 'FileTemplateView',
  data() {
    return {
    }
  },
  methods: {
    view(businessCategory, businessDataId) {
      // 为了解决错误设置，调试时修改
      var selfThis = {}
      fleTemplateUseApi.getByDataId({
        businessCategory: selfThis.businessCategory,
        businessDataId: selfThis.businessDataId
      }, selfThis.func).then(response => {
        if (response.data !== null) {
          var subWin = window.open(
            '',
            'qmEditor_win_preview',
            'channelmode=yes,directories=no,fullscreen=yes,location=no,menubar=no,status=no,titlebar=no,toolbar=no',
            true)
          subWin.focus()
          var subDoc = subWin.document
          subDoc.clear()
          subDoc.writeln('<!DOCTYPE html>')
          subDoc.writeln('<html>')
          subDoc.writeln('<head>')
          subDoc.writeln('<meta charset="utf-8"/>')
          subDoc.writeln('<title></title>')
          subDoc.writeln('<link rel="stylesheet" type="text/css" href="../../../../../static/qmeditor/qmEditorAddon/qmEditor/qmEditor.css" />')
          subDoc.writeln('<link rel="stylesheet" type="text/css" href="../../../../../static/qmeditor/qmEditorAddon/qmEditorPreview/preview.css" />')
          subDoc.writeln('<scr' + 'ipt type="text/javascript" charset="utf-8" src="../../../../../static/qmeditor/qmEditorAddon/qmEditorPreview/preview.js"></scr' + 'ipt>')
          subDoc.writeln('</head>')
          subDoc.writeln('<body>')
          subDoc.writeln('<header></header>')
          subDoc.writeln('<content>')
          subDoc.writeln(response.data.templateContent)
          subDoc.writeln('</content>')
          subDoc.writeln('</body>')
          subDoc.writeln('</html>')
          subDoc.close()
        } else {
          this.$notify(notifyInfo({ msg: '数据不存在。' }))
        }
      }).catch(() => { })
    }
  }
}
</script>
