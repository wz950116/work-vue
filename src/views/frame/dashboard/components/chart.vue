<template>
  <div class='el-tabs' style='padding-right: 18px;'>
    <dialog-set :block='block' v-on="$listeners" @changeBlock='initData' style='margin: 4px 0;'></dialog-set>
    <el-tabs v-model="activeName" style='width: 90%;' @tab-click="tabChange">
      <el-tab-pane v-for='tab in showTabs' :label="showLabel[tab]" :name="tab" :key='tab'>
        <histogram v-if='tab == "first"' :id='new Date().getTime()' ref="first"></histogram>
        <capitalRatio v-if='tab == "second"' :id='new Date().getTime() + 1' ref="second"></capitalRatio>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import histogram from '@/views/frame/dashboard/components/histogram.vue'
import capitalRatio from '@/views/frame/dashboard/components/capitalRatio.vue'
import dialogSet from '@/views/frame/dashboard/components/dialogSet.vue'

export default {
  name: 'chart',
  data() {
    return {
      dateRange: '',
      activeName: '',
      name: '',
      showTabs: [],
      showLabel: {
        first: '库存柱状图',
        second: '库存资金占比'
      }
    }
  },
  components: {
    histogram,
    capitalRatio,
    dialogSet
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'clientWidth',
      'clientHeight',
      'dashboardRefresh'
    ])
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
    this.initData()
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
          this.name = this.showTabs[0]
          this.activeName = this.showTabs[0]
          this.tabChange({ name: this.activeName })
        }
      })
    },
    tabChange(tab) {
      if (this.name === tab.name) {
        return
      }
      this.name = tab.name
      this.$refs[tab.name][0].initData()
    }
  }
}
</script>

<style lang='scss'>
.dashboard {
  .el-tabs__header {
    cursor: move;
  }
}
</style>
