<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '800px' : '950px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <main>
        <futuresArbitrageDetail :strategyCode="strategyCode" @select="detailSelect" @dbclick="dbclick" v-if="strategyNature==='2'"></futuresArbitrageDetail>
        <spotArbitrageDetail :strategyCode="strategyCode" @select="detailSelect" @dbclick="dbclick" v-if="strategyNature==='3'"></spotArbitrageDetail>
        <futuresUnilateralDetail :strategyCode="strategyCode" @select="detailSelect" @dbclick="dbclick" v-if="strategyNature==='4'"></futuresUnilateralDetail>
        <spotUnilateralDetail :strategyCode="strategyCode" @select="detailSelect" @dbclick="dbclick" v-if="strategyNature==='5'"></spotUnilateralDetail>
        <hedgeDetail :strategyCode="strategyCode" @select="detailSelect" @dbclick="dbclick" v-if="['1','6'].includes(strategyNature)"></hedgeDetail>
      </main>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="cancel">
          {{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type='primary' v-db-click size="mini" @click="save">
          {{$t('biz.btn.choose')}}
        </el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import hedgeDetail from '@/views/frame/rm/strategy/strategyManagement/components/hedgeDetail'
import futuresArbitrageDetail from '@/views/frame/rm/strategy/strategyManagement/components/futuresArbitrageDetail'
import spotArbitrageDetail from '@/views/frame/rm/strategy/strategyManagement/components/spotArbitrageDetail'
import futuresUnilateralDetail from '@/views/frame/rm/strategy/strategyManagement/components/futuresUnilateralDetail'
import spotUnilateralDetail from '@/views/frame/rm/strategy/strategyManagement/components/spotUnilateralDetail'

export default {
  components: {
    hedgeDetail,
    futuresArbitrageDetail,
    spotArbitrageDetail,
    futuresUnilateralDetail,
    spotUnilateralDetail
  },
  data() {
    return {
      selectData: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.plan.list.strategyDetail')
    }
  },
  props: {
    strategyCode: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    strategyNature: {
      type: String,
      default: ''
    }
  },
  methods: {
    dbclick(data) {
      this.$emit('confirm', data)
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (this.selectData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.selectData)
    },
    detailSelect(val) {
      this.selectData = val
    }
  }
}
</script>
