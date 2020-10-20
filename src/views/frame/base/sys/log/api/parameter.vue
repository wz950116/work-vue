<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container maxColumnsDialog'>
      <title-contain :titleName="this.$t('sys.log.inputParameter')" @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <div class='dialog-content' style="margin-bottom: 40px;">
        <code style="word-wrap: break-word;word-break: break-all;">
          {{param.requestParam}}
        </code>
      </div>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click="$emit('closeHandler')">{{ $t('biz.btn.close') }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import TitleContain from '@/components/frame/TitleContain'
export default {
  data() {
    return {}
  },
  props: ['param'],
  components: {
    TitleContain
  }
}
</script>
