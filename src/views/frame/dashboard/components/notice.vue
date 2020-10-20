<template>
  <div class='notice'>
    <div class='head'>
      <span class='title'>公告</span>
      <dialog-set :block='block' v-on="$listeners" @changeBlock='handleBlockChange' style='margin-left: 10px;'></dialog-set>
      <span class='more'>更多>></span>
    </div>
    <div class='list'>
      <ul>
        <li v-for="notice in noticeList" :key="notice.id">
          <p class='text' @click="openNotice(notice)">{{notice.noticeTitle}}</p>
          <p class='date'>{{notice.noticeDate | dateFormat}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import dialogSet from '@/views/frame/dashboard/components/dialogSet.vue'

export default {
  name: 'notice',
  data() {
    return {
      noticeList: []
    }
  },
  components: {
    dialogSet
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight', 'dashboardRefresh'])
  },
  props: {
    block: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  beforeMount() {
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
      }
    })
  },
  mounted() {
    this.loadNotice()
  },
  methods: {
    loadNotice() {
      request({
        url: '/api/sys/sysNotice/listNotice',
        method: 'POST',
        data: {
          current: 1,
          size: 10,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        }
      }).then(response => {
        this.noticeList = response.data
      })
    },
    openNotice(param) {
      this.$router.push({
        name: 'noticeRoute',
        params: {
          noticeType: param.noticeType,
          id: param.id
        }
      })
    },
    handleBlockChange() {}
  }
}
</script>

<style scoped lang='scss'>
.notice {
  border: 1px solid #eaeefb;
  border-radius: 3px;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.16);
  padding: 0 10px;
  background: #ffffff;
  .head {
    height: 40px;
    line-height: 40px;
    color: #303133;
    padding-left: 5px;
    background: #ffffff;
    border-bottom: 2px solid #e4e7ed;
    margin-bottom: 5px;
    cursor: move;
    .title {
      font-size: 14px;
      float: left;
      color: #333333;
    }
    .more {
      float: right;
      color: var(--menuBg);
      cursor: pointer;
    }
  }
  .list {
    height: 477px;
    overflow-y: auto;
    text-align: left;
    li {
      margin-bottom: 10px;
      .text {
        font-size: 14px;
        width: 80%;
        height: 24px;
        line-height: 24px;
        color: #333333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }
      .date {
        color: #aaaaaa;
        font-size: 12px;
        cursor: pointer;
        margin-left: 8px;
      }
    }
  }
}
</style>
