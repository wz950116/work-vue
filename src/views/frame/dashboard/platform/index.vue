<template>
  <div class="app-container dashboard">
    <div :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
      <div class="dashboardWrap">
        <h1>您好, 欢迎使用CTRM系统</h1>
        <img src="@/assets/frame/img/ditu.png" alt="" srcset="">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  data() {
    return {
      waitLoading: false,
      msgLoading: false,
      status: false,
      waitData: [],
      messageData: [],
      waitTotal: null,
      messageTotal: null,
      multipleSelection: [],
      waitEmptyText: ' ',
      messageEmptyText: ' ',
      showList: [],
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        data: {
          assignee: ''
        },
        sorString: ''
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight', 'dashboardRefresh', 'account'])
  }
}
</script>

<style scoped lang='scss'>
.dashboard {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: linear-gradient(to bottom, #fff 0%, #bfd6f5 100%) !important;
  padding: 0;
  .dashboardWrap {
    width: 928px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: none;
    height: 447px;
    margin-top: 120px;
  }
  h1 {
    font-size: 30px;
    font-weight: normal;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    color: #6694be;
  }
  .title {
    width: 100%;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    background: #f5f7fa;
    border: 1px solid #aaa;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    .title-name {
      font-weight: 900;
      float: left;
      margin-left: 20px;
    }
    .title-right {
      float: right;
      margin-right: 10px;
      svg {
        cursor: pointer;
      }
      .total-item {
        padding: 0 8px;
        font-weight: 900;
        color: #000000;
        background: rgb(194, 191, 244);
        border-radius: 5px;
        margin: 0 2px;
      }
    }
  }
  .el-table {
    border: 1px solid;
  }
  .el-icon-back {
    transform: rotate(180deg);
  }
  .el-tabs--border-card {
    border-color: #aaaaaa !important;
  }
}
</style>
