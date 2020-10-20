<template>
  <div class='notice'>
    <div class='head'>
      <span class='title'>
        <h2>{{notice.noticeTitle}}</h2>
      </span>
      <span class="date">{{notice.noticeDate | dateFormat}}</span>
    </div>
    <div class='list' id="content">

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'

export default {
  name: 'noticeRoute',
  data() {
    return {
      notice: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight', 'dashboardRefresh'])
  },
  mounted() {
    this.loadNotice()
  },
  methods: {
    loadNotice() {
      let url = ''
      if (this.$route.params.noticeType === '1') {
        url = '/api/platform/cfgNotice/get'
      } else {
        url = '/api/sys/sysNotice/get'
      }

      request({
        url: url,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.$route.params.id
        }
      }).then(response => {
        this.notice = response.data
        document.getElementById('content').innerHTML = response.data.noticeContent
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
    }
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
    line-height: 20px;
    color: #303133;
    padding-left: 5px;
    background: #ffffff;
    border-bottom: 2px solid #e4e7ed;
    text-align: center;
    margin: 5px auto;
    .title {
      color: #333333;
      display: block;
      font-weight: bold;
    }
    .more {
      float: right;
      color: var(--menuBg);
      cursor: pointer;
    }
  }
  .list {
    height: calc(100% - 36px);
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
