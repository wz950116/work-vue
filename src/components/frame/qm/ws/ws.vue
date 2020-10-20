<template>
  <div class='bell right-menu-item' :title="$t('navbar.notice')" @click="gotoMyMessage" :style="{'padding-right': displayCntFlag ? '10px' : 0}">
    <i class='el-icon-bell'></i>
    <div class='msg-num-icon'>
      <span v-show="displayCntFlag">{{unreadCnt}}</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { getToken } from '@/utils/frame/base/auth'
export default {
  data() {
    return {
      wsconn: null,
      retryCnt: 0,
      unreadCnt: 0,
      displayCntFlag: false,
      listenerMap: new Map()
    }
  },
  methods: {
    initWebSocket() {
      let tokenStr = this.$store.getters.token
      if (tokenStr === null || tokenStr === undefined) {
        tokenStr = getToken()
      }
      let wsurl
      if (process.env.NODE_ENV === 'production') {
        const host = location.host
        wsurl = 'ws://' + host + process.env.WS_API + '?token=' + encodeURIComponent(tokenStr)
      } else {
        wsurl = process.env.WS_API + '?token=' + encodeURIComponent(tokenStr)
      }
      this.wsconn = new WebSocket(wsurl)
      this.wsconn.onopen = this.onWsOpen
      this.wsconn.onclose = this.onWsClose
      this.wsconn.onerror = this.onWsError
      this.wsconn.onmessage = this.onWsMessage
      // Vue.prototype.$wsconn = this.wsconn
    },
    addWsListener(moduleCode, linstener) {
      this.listenerMap.set(moduleCode, linstener)
    },
    removeWsListener(moduleCode) {
      this.listenerMap.delete(moduleCode)
    },
    sendWsMessage(moduleCode, message) {
      if (this.wsconn) {
        if (message) {
          message.module = moduleCode
        } else {
          message = {
            module: moduleCode
          }
        }
        this.wsconn.send(JSON.stringify(message))
        return 0
      } else {
        return -1
      }
    },
    gotoMyMessage() {
      this.$router.push({
        name: 'msgMy',
        params: {
          readFlag: '0'
        }
      })
    },
    onWsOpen(event) {
      this.retryCnt = '0'
      this.$sendWsMessage('MSG', { operate: 'UNREAD_COUNT', data: null })
      this.$sendWsMessage('MSG', { operate: 'UNREAD_MSG', data: null })
    },
    onWsClose(event) {
      this.retryCnt = this.retryCnt + 1
      if (this.retryCnt > 20) {
        this.retryCnt = 20
      }
      const timeDelay = 3000 * this.retryCnt
      setTimeout(() => {
        this.initWebSocket()
      }, timeDelay)
    },
    onWsError(event) {},
    onWsMessage(event) {
      const wsData = JSON.parse(event.data)
      if (this.listenerMap.has(wsData.module)) {
        const listener = this.listenerMap.get(wsData.module)
        if (listener) {
          listener(wsData)
        }
      }
    },
    reviceMsg(wsData) {
      if (wsData.operate === 'PUSH') {
        this.$message({
          message: wsData.data.msgTitle,
          type: 'warning'
        })
      } else if (wsData.operate === 'UNREAD_COUNT') {
        if (wsData.data > 99) {
          this.unreadCnt = '99+'
        } else {
          this.unreadCnt = wsData.data
        }
        this.displayCntFlag = wsData.data > 0
      }
    }
  },
  created() {
    Vue.prototype.$addWsListener = this.addWsListener
    Vue.prototype.$removeWsListener = this.removeWsListener
    Vue.prototype.$sendWsMessage = this.sendWsMessage
    this.$addWsListener('MSG', this.reviceMsg)
    this.initWebSocket()
  },
  mounted() {},
  destoryed() {
    this.wsconn.close()
    this.$removeWsListener('MSG')
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
div.msg-num-icon {
  position: absolute;
  display: inline-block;
}
div.msg-num-icon span {
  position: relative;
  display: inline-block;
  left: -8px;
  top: -8px;
  padding: 0 2px 0 2px;
  background-color: #ec3333;
  min-width: 12px;
  height: 12px;
  line-height: 12px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  border-radius: 6px;
}
</style>

