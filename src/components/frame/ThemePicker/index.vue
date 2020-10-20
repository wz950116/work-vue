<template>
  <el-color-picker class="theme-picker" popper-class="theme-picker-dropdown" v-model="theme" :predefine="predefineColors"></el-color-picker>
</template>

<script>
const ORIGINAL_THEME = storage.get('theme') || '#3E6DB5' // default color
import themeData from './theme.json'
import generateColors from '@/utils/frame/base/color'
import storage from '@/utils/frame/base/localStorage'

export default {
  data() {
    return {
      theme: ORIGINAL_THEME,
      // 预定义颜色
      predefineColors: [
        '#3E6DB5',
        '#000000',
        '#00699D',
        '#265588',
        '#008B8D',
        '#F47E00'
      ],
      themeMap: themeData,

      originalStylesheetCount: -1,
      colors: {
        primary: ORIGINAL_THEME
      },
      originalStyle: '',
      styleFiles: []
    }
  },

  watch: {
    theme(val, oldVal) {
      this.themeChange(val)
      this.$message({
        message: '换肤成功',
        type: 'success'
      })
      // 储存
      storage.set('theme', this.theme)
    }
  },

  mounted() {
    this.themeChange(this.theme)
  },

  methods: {
    themeChange(val) {
      if (val === null) this.theme = ORIGINAL_THEME
      if (typeof val !== 'string') return

      const root = document.documentElement
      // 若选择了提供的几种颜色之一
      if (this.predefineColors.includes(val.toUpperCase())) {
        for (const name in this.themeMap[`theme${val.toUpperCase().split('#')[1]}`]) {
          const color = this.themeMap[`theme${val.toUpperCase().split('#')[1]}`][name]
          root.style.setProperty(`--${name}`, color)
        }
      } else {
        this.colors.primary = val
        this.colors = Object.assign({}, this.colors, generateColors(val))
        for (const name in this.themeMap['themeOther']) {
          const color = this.themeMap['themeOther'][name].includes('#') ? this.themeMap['themeOther'][name] : this.colors[this.themeMap['themeOther'][name]]
          root.style.setProperty(`--${name}`, color)
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.el-color-picker {
  .el-color-picker__trigger {
    width: 40px !important;
    height: 50px !important;
    line-height: 50px !important;
    border: none;
    border-radius: 0;
    padding: 0;
    .el-color-picker__color {
      border: none;
      border-radius: 0;
      background: none;
      .el-color-picker__color-inner {
        background: url('../../../assets/frame/img/skin.png') no-repeat center 15px;
        background-color: transparent !important;
      }
    }
    .el-color-picker__icon {
      display: none;
    }
  }
}
.theme-picker-dropdown {
  .el-color-dropdown__btns {
    .el-color-dropdown__link-btn {
      display: none !important;
    }
  }
}
</style>
