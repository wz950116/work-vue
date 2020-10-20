<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='mini' :style="{width: this.sidebar.opened ? '250px' : '400px'}">
      <TitleContain :titleName='$t("strategy.instruction.dialog.strategyNature")' @TitleFun="closeTitleDialog" />
      <main class="strategyNature">
        <el-radio-group v-model="natureValue">
          <el-radio v-for="item in $t('datadict.instructionWay')" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </main>
      <!-- 最后按钮 -->
      <div class="dialog-footer">
        <!-- 取消 -->
        <!-- <el-button @click="closeTitleDialog()" size='mini'>{{this.$t('biz.btn.cancel')}}</el-button> -->
        <!-- 确定 -->
        <el-button type="primary" @click="selectConfirm" v-db-click size='mini'>{{this.$t('biz.btn.confirm')}}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
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
