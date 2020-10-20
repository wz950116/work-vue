<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper" ref="scrollContainer" @wheel.prevent="handleScroll">
      <div class="scroll-wrapper" ref="scrollWrapper" style='width:100%;'>
        <div @click.right.prevent="openMenu($event)">
          <el-tabs v-model="activeName" ref='tags' type="card" class='tabs-style' closable @tab-remove="removeTab" @tab-click="handleTabClick">
            <el-tab-pane ref='tag' v-for="tag in Array.from(visitedViews)" :key="tag.keyPath" :label="generateTitle(tag.tagTitle || tag.title)" :name="tag.keyPath" :data="tag"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class='menu-drop' @click='triggerMenu($event)'>
      <i class='el-icon-arrow-up' v-if='visible' style='font-weight:900;cursor:pointer;'></i>
      <i class='el-icon-arrow-down' v-else style='font-weight:900;cursor:pointer;'></i>
    </div>
    <ul class='contextmenu' v-show="visible" :style="{left, top}">
      <li @click="handleClickFull">{{app.isScreenFull ? $t('navbar.cancelScreenFull') : $t('navbar.screenfull')}}</li>
      <li @click="removeTab(closeTarget)">{{$t('tagsView.close')}}</li>
      <li @click="closeOthersTags">{{$t('tagsView.closeOthers')}}</li>
      <li @click="closeAllTags">{{$t('tagsView.closeAll')}}</li>
    </ul>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import { mapGetters } from 'vuex'
import { generateTitle } from '@/utils/frame/base/i18n'

export default {
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      activeName: '',
      closeTarget: ''
    }
  },
  inject: ['app'],
  computed: {
    ...mapGetters(['clientWidth', 'visitedViews'])
  },
  watch: {
    $route() {
      this.activeName = this.getKeyPath()
      this.addViewTags()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    visitedViews(list) {
      // 隐藏首页关闭按钮
      this.$nextTick(() => {
        list.forEach(routeInfo => {
          if (routeInfo.name === 'dashboard' && document.getElementById('tab-/dashboard') !== null) {
            document.getElementById('tab-/dashboard').children[0].style.display = 'none'
          }
        })
      })
    }
  },
  mounted() {
    // 初始化
    let keyPath = this.$route.fullPath || this.$store.state.tagsView.visitedViews[0].fullPath
    this.activeName = this.getKeyPath(keyPath)
    this.addViewTags()

    // 隐藏首页关闭按钮
    const routerList = this.visitedViews
    this.$nextTick(() => {
      routerList.forEach(routeInfo => {
        if (routeInfo.name === 'dashboard' && document.getElementById('tab-/dashboard') !== null) {
          document.getElementById('tab-/dashboard').children[0].style.display = 'none'
        }
      })
    })
  },
  methods: {
    // 多语言
    generateTitle,
    // 新增
    addViewTags() {
      const route = this.$route.name ? this.$route : false
      if (!route) {
        return false
      }
      this.$store.dispatch('addVisitedViews', route)
    },
    // 关闭
    removeTab(targetName) {
      // 首页不允许关闭
      if (targetName === '/dashboard') return
      const tabs = Array.from(this.visitedViews)
      tabs.forEach((tab, index) => {
        if (tab.keyPath === targetName) {
          // 更新状态
          this.closeSelectedTag(tab)
        }
      })
    },
    closeSelectedTag(view) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (view.path === this.$route.path) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    closeOthersTags() {
      const tabs = Array.from(this.visitedViews)
      tabs.forEach((tab, index) => {
        if (tab.keyPath === this.closeTarget) {
          // 更新状态
          this.$store.dispatch('delOthersViews', tab).then(() => {
            this.$router.push(tab)
          })
        }
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(e) {
      this.closeTarget = e.target.id.split('-')[1]
      // 首页不允许关闭
      if (this.closeTarget === '/dashboard' || e.target.className === 'el-tabs__nav-scroll') {
        this.visible = false
        return
      }
      this.visible = true
      this.left = e.clientX + 'px'
      this.top = e.clientY + 'px'
    },
    closeMenu() {
      this.visible = false
    },
    handleTabClick(params) {
      this.$router.push(params.$attrs.data)
    },
    triggerMenu(e) {
      e.stopPropagation()
      if (this.$route.name === 'dashboard') return
      this.visible = !this.visible
      this.closeTarget = this.getKeyPath()
      this.left = this.clientWidth - 80 + 'px'
      this.top = '76px'
    },
    // 获取当前页面keyPath
    getKeyPath(keyPath = this.$route.fullPath) {
      if (this.$route.params && JSON.stringify(this.$route.params) !== '{}') {
        keyPath += '?'
        Object.keys(this.$route.params).forEach(i => {
          keyPath += `${i}=${this.$route.params[i]}&`
        })
        keyPath = keyPath.substring(0, keyPath.length - 1)
      }
      return keyPath
    },
    // 标签页滚动事件
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $wrapperWidth = $(this.$refs.tags.$refs.nav.$el).width()
      const $containerWidth = this.$refs.tags.$refs.nav.$refs.nav.offsetWidth

      if ($wrapperWidth >= $containerWidth) return

      if (eventDelta > 0) {
        // 上滚
        $(this.$refs.tags.$refs.nav.$refs.nav).css('transform', 'translateX(0px)')
      } else {
        // 下滚
        $(this.$refs.tags.$refs.nav.$refs.nav).css('transform', `translateX(${$wrapperWidth - $containerWidth}px)`)
      }
    },
    // 全屏
    handleClickFull() {
      if (!screenfull.enabled) {
        this.$message({
          message: '浏览器不支持',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tags-view-container {
  .tags-view-wrapper {
    position: relative;
    width: 97%;
    height: 26px;
    white-space: nowrap;
    border-top-left-radius: 5px;
    overflow: hidden;
    user-select: none;
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .menu-drop {
    position: absolute;
    right: 0;
    top: 0;
    width: 3.1%;
    height: 26px;
    line-height: 26px;
    text-align: center;
    color: #ffffff;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: fixed;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<!-- 2.0 -->
<style rel="stylesheet/scss" lang='scss'>
.tags-view-container {
  .tabs-style {
    .el-tabs__header {
      margin: 0;
      border-bottom: 1px solid #ccc;
      .el-tabs__nav {
        border-radius: 0;
        border-top: none;
        border-color: #ccc;
        .el-tabs__item {
          padding: 0 10px !important;
          height: 26px;
          line-height: 26px;
          text-align: left;
          font-size: 12px;
          &.is-active {
            height: 26px;
            line-height: 26px;
            border-bottom: none;
            color: #666;
          }
          .el-icon-delete {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            line-height: 14px;
          }
        }
      }
    }
  }
}
</style>
