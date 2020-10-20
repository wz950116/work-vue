<template>
  <div class='dialog-title'>
    {{titleName}}
    <span class="nav">
      <span class='max-min' @click='$emit("screenChange")'>
        <svg-icon icon-class="线性-最大化" class='max'></svg-icon>
        <svg-icon icon-class="线性-最小化" class='min' style='display:none;'></svg-icon>
      </span>
      <i class="el-icon-close" @click="closeDialogContain" v-if='isShowClose' style='color:#ff6c6c;'></i>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    titleName: String,
    isShowClose: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeDialogContain() {
      const showTitleContain = {
        showTitle: true
      }
      this.$emit('TitleFun', showTitleContain)
    }
  }
}
</script>
