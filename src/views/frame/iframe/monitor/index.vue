<template>
  <iframe :src='iframeSrc' class="iframe" ref="iframe"></iframe>
</template>

<script>
import {
  getToken
} from '@/utils/frame/base/auth'

export default {
  name: 'iframe',
  data() {
    return {
      iframeSrc: '',
      fullscreenLoading: false
    }
  },
  created() {
    this.iframeSrc = this.$route.meta.src

    if (this.iframeSrc) {
      const token = this.iframeSrc.indexOf('?') > -1 ? '&' : '?'
      this.iframeSrc = this.iframeSrc + token + 'bpmToken=' + getToken()
    }
    this.fullscreenLoading = true
  },
  mounted() {
    this.iframeInit()
    window.onresize = () => {
      this.iframeInit()
    }
  },
  methods: {
    iframeInit() {
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 100
      iframe.style.height = `${clientHeight}px`
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          // try {
          //   const url = iframe.contentWindow.location.href
          //   if (url === 'about:blank') {
          //     const tabs = Array.from(this.$store.state.tagsView.visitedViews)
          //     tabs.forEach((tab, index) => {
          //       if (tab.name === this.$route.name) {
          //         this.$store.dispatch('delVisitedViews', this.$route)
          //         this.$router.push(tabs[index - 1])
          //       }
          //     })
          //   }
          // } catch (error) {

          // }
          this.fullscreenLoading = false
        })
      } else {
        iframe.onload = () => {
          // try {
          //   const url = iframe.contentWindow.location.href
          //   if (url === 'about:blank') {
          //     const tabs = Array.from(this.$store.state.tagsView.visitedViews)
          //     tabs.forEach((tab, index) => {
          //       if (tab.name === this.$route.name) {
          //         this.$store.dispatch('delVisitedViews', this.$route)
          //         this.$router.push(tabs[index - 1])
          //       }
          //     })
          //   }
          // } catch (error) {

          // }
          this.fullscreenLoading = false
        }
      }
    }
  }
}
</script>
<style>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #ffffff;
}
</style>
