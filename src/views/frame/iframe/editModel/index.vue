<template>
  <iframe :src="urlPath" class="iframe" ref="iframe"></iframe>
</template>

<script>
import {
  getToken
} from '@/utils/frame/base/auth'

export default {
  name: 'myiframeEdit',
  data() {
    return {
      fullscreenLoading: false,
      urlPath: ''
    }
  },
  created() {
    this.fullscreenLoading = true

    let iframeSrc = this.$route.query.src

    if (iframeSrc) {
    } else {
      iframeSrc = this.getUrlPath()
    }
    const token = iframeSrc.indexOf('?') > -1 ? '&' : '?'
    this.urlPath = iframeSrc + token + 'bpmToken=' + getToken()
  },
  mounted() {
    this.iframeInit()
    window.onresize = () => {
      this.iframeInit()
    }
  },
  props: ['routerPath'],
  watch: {
    routerPath: function (val) {
      this.urlPath = this.getUrlPath()
    }
  },
  components: {},
  methods: {
    iframeInit() {
      const iframe = this.$refs.iframe
      const clientHeight = document.documentElement.clientHeight - 100
      iframe.style.height = `${clientHeight}px`
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', () => {
          try {
            const url = iframe.contentWindow.location.href
            if (url === 'about:blank') {
              const tabs = Array.from(this.$store.state.tagsView.visitedViews)
              tabs.forEach((tab, index) => {
                if (tab.name === this.$route.name) {
                  this.$store
                    .dispatch('delVisitedViews', this.$route)
                    .then(this.$router.push(tabs[index - 1].fullPath))
                }
              })
            }
          } catch (error) { }
          this.fullscreenLoading = false
        })
      } else {
        iframe.onload = () => {
          try {
            const url = iframe.contentWindow.location.href
            if (url === 'about:blank') {
              const tabs = Array.from(this.$store.state.tagsView.visitedViews)
              tabs.forEach((tab, index) => {
                if (tab.name === this.$route.name) {
                  this.$store
                    .dispatch('delVisitedViews', this.$route)
                    .then(this.$router.push(tabs[index - 1].fullPath))
                }
              })
            }
          } catch (error) { }
          this.fullscreenLoading = false
        }
      }
    },
    getUrlPath: function () {
      let url = window.location.href
      url = url.replace('/iframeEditModel', '')
      return url
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
}
</style>
