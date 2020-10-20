<template>
  <div class='el-tabs' style='padding-right: 18px;' v-if='showTabs.length > 0'>
    <dialog-set :block='block' v-on="$listeners" @changeBlock='initData' style='margin: 4px 0;'></dialog-set>
    <el-tabs v-model="activeName" class='msg' @tab-click="handleTabClick">
      <el-tab-pane v-for='tab in showTabs' :label="showLabel[tab]" :name="tab" :key="tab">
        <div class='tab_content' v-if='tab === "bpm"'>
          <ul>
            <li :key='item.id' v-for='item in bpmList'>
              <span class='name' @click="handleBpmClick(item)" :title='item.pendingContent'>【{{ item.businessName }}】{{item.pendingContent}} </span>
            </li>
          </ul>
          <div class='more' @click="goTodo" v-if="bpmList && bpmList.length >= 5">
            <span>更多>></span>
          </div>
        </div>
        <div class='tab_content' v-if='tab === "todo"'>
          <ul>
            <li :key='item.id' v-for='item in todoList'>
              <span class='name' @click="handleMsgClick(item)" :title='item.msgContent'>【{{ item.msgTitle }}】{{item.msgContent}}</span>
            </li>
          </ul>
          <div class='more' @click="goMsg" v-if="todoList && todoList.length >= 5">
            <span>更多>></span>
          </div>
        </div>
        <div class='tab_content' v-if='tab === "warn"'>
          <ul>
            <li :key='item.id' v-for='item in warnList'>
              <span class='name' @click="handleMsgClick(item)" :title='item.msgContent'>【{{ item.msgTitle }}】{{item.msgContent}}</span>
            </li>
          </ul>
          <div class='more' @click="goMsg" v-if="warnList && warnList.length >= 5">
            <span>更多>></span>
          </div>
        </div>
        <div class='tab_content' v-if='tab === "tip"'>
          <ul>
            <li :key='item.id' v-for='item in tipList'>
              <span class='name' @click="handleMsgClick(item)" :title='item.msgContent'>【{{ item.msgTitle }}】{{item.msgContent}}</span>
            </li>
          </ul>
          <div class='more' @click="goMsg" v-if="tipList && tipList.length >= 5">
            <span>更多>></span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import dialogSet from '@/views/frame/dashboard/components/dialogSet.vue'

export default {
  name: 'msg',
  data() {
    return {
      activeName: '',
      bpmList: [],
      warnList: [],
      todoList: [],
      tipList: [],
      showTabs: [],
      showLabel: {
        bpm: '待审事项',
        todo: '待办消息',
        warn: '预警消息',
        tip: '提示消息'
      }
    }
  },
  components: {
    dialogSet
  },
  props: {
    block: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.initData()
    this.initBpm()
    // this.initMsg('warn')
    // this.initMsg('todo')
    // this.initMsg('tip')
  },
  methods: {
    initData() {
      // 请求当前模块数据
      request({
        url: '/api/sys/sysEmpBlock/get',
        method: 'POST',
        data: {
          data: this.block.blockCode,
          funcModule: '业务员区块',
          funcOperation: '查询单个'
        }
      }).then(response => {
        if (response.data) {
          this.showTabs = response.data.empCompList.map(v => v.compCode)
          this.activeName = this.showTabs[0]
          this.handleTabClick({ name: this.activeName })
        }
      })
    },
    initMsg(type) {
      const listQuery = {
        current: 1,
        size: 5,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          msgClassType: '3',
          readFlag: '0'
        },
        camelToUnderlineFlg: true,
        defaultSortString: 'userSendDt.desc'
      }
      if (type === 'warn') {
        listQuery.data.msgClassType = '3'
      } else if (type === 'todo') {
        listQuery.data.msgClassType = '1'
      } else {
        listQuery.data.msgClassType = '2'
      }
      request({
        url: '/api/msg/my/list',
        method: 'POST',
        data: listQuery
      })
        .then(response => {
          if (response.data) {
            if (type === 'warn') {
              this.warnList = response.data
            } else if (type === 'todo') {
              this.todoList = response.data
            } else {
              this.tipList = response.data
            }
          }
        })
        .catch(() => {})
    },
    handleMsgClick(row) {},
    handleTabClick(tab, event) {
      if (tab.name === 'warn') {
        this.initMsg('warn')
      } else if (tab.name === 'todo') {
        this.initMsg('todo')
      } else if (tab.name === 'tip') {
        this.initMsg('tip')
      } else if (tab.name === 'bpm') {
        this.initBpm()
      }
    },
    initBpm() {
      request({
        url: '/api/bpm/backlog/listExtWithReceive',
        method: 'POST',
        data: {
          current: 1,
          size: 5,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {},
          camelToUnderlineFlg: false,
          defaultSortString: 'startTime.desc'
        }
      })
        .then(response => {
          if (response.data) {
            this.bpmList = response.data
          }
        })
        .catch(() => {})
    },
    handleBpmClick(row) {
      if (row.taskStatusType === '1') {
        this.receive(row)
      } else {
        if (row.bpmComponent) {
          if (row.assistId) {
            row.opType = 'assist' // 协助
          } else {
            row.opType = 'audit' // 普通
          }
          this.goApproveRoute(row)
        }
      }
    },

    // 待办领取之后跳转页面
    toReceive(row) {
      if (row.bpmComponent) {
        row.opType = 'audit' // 普通
        this.goApproveRoute(row)
      }
    },
    // 待办领取处理
    receive(row) {
      this.taskId = row.id
      request({
        url: '/api/bpm/task/claimTask',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.claim'),
          data: {
            assignee: '', // 当前账号
            taskId: row.id // 任务ID
          }
        }
      })
        .then(response => {
          if (response.data) {
            this.$notify(
              notifySuccess({
                msg: this.$t('biz.msg.claimTaskSuccess')
              })
            )
          }
          this.toReceive(row)
        })
        .catch(() => {})
    },

    goApproveRoute(param) {
      param.back = param.back ? param.back : 'dashboard'
      const componentName = param.bpmComponent
      const routeOption = {
        name: componentName,
        params: param
      }
      this.$router.push(routeOption)
    },
    goMsg() {
      const routeOption = {
        name: 'msgMy'
      }
      this.$router.push(routeOption)
    },
    goTodo() {
      const routeOption = {
        name: 'todo'
      }
      this.$router.push(routeOption)
    }
  }
}
</script>

<style lang='scss'>
.dashboard {
  .msg {
    width: 90%;
    .el-tabs__header {
      cursor: move;
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: 32px !important;
      }
      .el-tabs__active-bar {
        right: 0;
        width: auto !important;
        transform: translateX(0) !important;
      }
      .el-tabs__item {
        padding: 0 10px !important;
        border-bottom: 2px solid #e4e7ed;
        z-index: 2;
        &.is-active {
          border-bottom-color: transparent;
        }
      }
    }
    .el-tabs__content {
      .tab_content {
        height: 191px;
        ul {
          li {
            height: 30px;
            line-height: 30px;
            color: #aaaaaa;
            .index {
              float: left;
              width: 30px;
              margin-right: 10px;
            }
            .name {
              float: left;
              width: calc(100% - 0px);
              margin-right: 10px;
              white-space: nowrap;
              overflow: hidden;
              color: #333333;
              text-overflow: ellipsis;
              cursor: pointer;
              &:hover {
                color: var(--menuBg);
              }
            }
            .date {
              font-size: 12px;
              float: right;
              width: 115px;
            }
          }
        }
        .more {
          height: 40px;
          line-height: 40px;
          font-size: 12px;
          text-align: right;
          color: var(--menuBg);
          span {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
