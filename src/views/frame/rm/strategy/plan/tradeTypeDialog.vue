<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='mini' :style="{width: this.sidebar.opened ? '250px' : '400px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <main class="strategyNature">
        <el-radio-group v-model="planType">
          <el-radio v-for="item in $t('datadict.strategyNature')" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </main>
      <!-- 最后按钮 -->
      <div class="dialog-footer">
        <!-- 取消 -->
        <!-- <el-button @click="cancel" size="mini">{{this.$t('biz.btn.cancel')}}</el-button> -->
        <!-- 确定 -->
        <el-button type="primary" @click="save" size="mini">{{this.$t('biz.btn.confirm')}}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      planType: '1'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.plan.list.selectType')
    }
  },
  methods: {
    cancel() {
      this.$emit('close')
    },
    save() {
      this.$emit('selectType', this.planType)
    }
  }
}
</script>

<style lang='scss'>
.strategyNature {
  min-width: 80px;
  text-align: center;
  margin-bottom: 40px !important;
  .el-radio {
    display: block;
    margin: 10px 80px;
    .el-radio__input {
      float: left;
    }
  }
}
</style>
