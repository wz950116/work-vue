<template>
  <section class="app-main" ref='appMain'>
    <div v-show="!($route.meta.src || $route.meta.bpmFlg)">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </div>
    <iframeTmp v-show="$route.meta.src || $route.meta.bpmFlg"></iframeTmp>
    <backToTop v-show='showBackToTop' :dom='$refs.appMain'></backToTop>
    <div class="footer-copyright" :style="{'bottom': clientWidth < 1366 ? '17px': '0'}">
      <p> 版权信息:北京华融启明风险管理技术股份有限公司所有 | 当前版本:V5.0</p>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import backToTop from '@/components/frame/BackToTop'
import iframeTmp from '@/views/frame/iframe/tmp'
export default {
  name: 'AppMain',
  data() {
    return {
      showBackToTop: false
    }
  },
  components: {
    backToTop,
    iframeTmp
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'cachedViews', 'visitedViews']),
    key() {
      return this.$route.fullPath
    }
  },
  mounted() {
    this.$refs.appMain.onscroll = () => {
      if (this.$refs.appMain.scrollTop > 50) {
        this.showBackToTop = true
      } else if (this.$refs.appMain.scrollTop === 0) {
        this.showBackToTop = false
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.app-main {
  height: 100%;
  overflow: auto; // 针对首页
  .footer-copyright {
    user-select: none;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    height: 22px;
    background: #606266;
    z-index: 999;
    p {
      color: #8f9194;
      line-height: 22px;
      float: right;
      padding-right: 14px;
      margin: 0;
      font-size: 12px;
    }
  }
}
</style>
