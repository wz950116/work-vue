<template>
  <el-tabs v-model="activeName" :style="{'height': 350 + 'px'}" @tab-click="tabChange">
    <el-tab-pane label="库存柱状图" name="first">
      <histogram ref="first"></histogram>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
import { mapGetters } from 'vuex'
import histogram from '@/views/frame/dashboard/components/histogram.vue'
import capitalRatio from '@/views/frame/dashboard/components/capitalRatio.vue'

export default {
  name: 'chart',
  components: {
    histogram,
    capitalRatio
  },
  data() {
    return {
      dateRange: '',
      activeName: 'first',
      name: 'first'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight', 'dashboardRefresh'])
  },
  methods: {
    tabChange(tab) {
      if (name === tab.name) {
        return
      }
      this.name = tab.name
      this.$refs[tab.name].initData()
    }
  }
}
</script>
