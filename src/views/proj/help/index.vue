<template>
  <div>
    <iframe :src="src" width="100%" :height="tableHeight" frameborder='0'></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'helpCenter',
  data() {
    return {
      src: process.env.CONTEXT_ROOT + `/static/pdf/web/viewer.html?file=${process.env.CONTEXT_ROOT}/static/pdf/help.pdf`
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440
        ? this.clientHeight - 290 + 192
        : this.clientHeight - 310 + 192 // 防止底部滚动条遮挡
    }
  }
}
</script>

