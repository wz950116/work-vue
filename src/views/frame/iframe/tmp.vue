<template>
  <div class='iframe'>
    <div class='empty'></div>
    <iframe v-for='i in iframeRouters.children' :key='i.name' :src='i.meta.src' frameborder="0" class="iframe" ref='iframe' v-if='cachedViews.includes(i.name)' v-show='i.meta.src === $route.meta.src || i.name === $route.name' :style="{height: iframeHeight}">
    </iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import session from '@/utils/frame/base/sessionStorage'

export default {
  computed: {
    ...mapGetters(['clientHeight', 'cachedViews', 'iframeRouters', 'md5', 'tenantCodeHash']),
    iframeHeight() {
      return this.clientHeight - 100 + 'px'
    }
  },
  created() {
    this.iframeRouters.children.forEach(route => {
      var iframeSrc = route.meta.src
      if (iframeSrc) {
        const token = iframeSrc.indexOf('?') > -1 ? '&' : '?'
        iframeSrc = iframeSrc + token + 'token=' + this.md5
        if (this.tenantCodeHash) {
          iframeSrc = iframeSrc + '&tenantCode=' + this.tenantCodeHash
        }
        route.meta.src = iframeSrc
      }
    })
  }
}
</script>

<style lang='scss' scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fff;
  .empty {
    width: 100%;
    height: 1px;
    background: transparent;
  }
}
</style>
