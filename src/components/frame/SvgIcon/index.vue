<template>
  <svg :class="svgClass" aria-hidden="true" :style="{color: iconColor}">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  data() {
    return {
      iconType: {
        '线性-新增': '#67C23A',
        '线性-删除': '#F56C6C',
        '线性-修改': '#3E6DB5',
        '线性-查看': '#f4bd52'
      }
    }
  },
  name: 'svg-icon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconColor() {
      // 909399
      return this.iconClass && this.iconType[this.iconClass] ? this.iconType[this.iconClass] : this.iconClass.includes('线性') ? '#409eff' : ''
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.svg-icon {
  width: 12px;
  height: 12px;
  fill: currentColor;
  overflow: hidden;
  vertical-align: middle;
  margin-right: 6px;
  margin-top: -2px;
}
.svg-icon-menu {
  margin-top: 0;
}
.svg-fun {
  width: 12px;
  height: 12px;
  margin: 0 5px;
  fill: currentColor;
  overflow: hidden;
}
.svg-fun-bottom {
  width: 12px;
  height: 12px;
  margin-right: 12px;
  cursor: pointer;
}
.setting {
  width: 16px;
  height: 16px;
  cursor: pointer;
}
</style>
