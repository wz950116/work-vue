<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='mini' style='width:300px;'>
      <TitleContain :titleName='$t("strategy.futureMatch.form.futureMatchType")' @TitleFun="closeTitleDialog" />
      <main class="strategyNature">
        <el-radio-group v-model="natureValue">
          <el-radio v-for="item in $t('datadict.futureMatch')" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </main>
      <!-- 最后按钮 -->
      <div class="dialog-footer">
        <el-button type="primary" @click="selectConfirm">{{this.$t('biz.btn.confirm')}}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>

</template>

<script>
import TitleContain from '@/components/frame/TitleContain'

export default {
  name: 'natureDialog',
  components: {
    TitleContain
  },
  data() {
    return {
      natureValue: '1'
    }
  },
  watch: {
    natureValue(value) {
      this.$emit('nature', value)
    }
  },
  methods: {
    closeTitleDialog() {
      this.$emit('close')
    },
    selectConfirm() {
      this.$emit('selectType', this.natureValue)
    }
  }
}
</script>

<style lang='scss'>
.strategyNature {
  text-align: center;
  margin-bottom: 40px !important;
  .el-radio {
    display: block;
    margin: 10px 80px;
  }
}
</style>
