<template>
  <div class='input-format'>
    <el-input v-model="checkValue" @input="input" @change="change" :type='type' :disabled="disabled" :size="size" :placeholder="placeholder || $t('biz.placeholder.input')" :maxlength='maxlength' :clearable='clearable' :show-password='showPassword' v-bind='attrs'>
      <template v-if="prepend" slot="prepend">{{prepend}}</template>
      <template v-if="append" slot="append">{{append}}</template>
    </el-input>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkValue: this.value
    }
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'medium'
    },
    maxlength: {
      type: Number,
      default: 50
    },
    prepend: {
      type: String,
      default: ''
    },
    append: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    validateType: {
      type: String,
      default: ''
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    },
    attrs: {
      type: Object,
      default: () => {}
    }
  },
  model: {
    prop: 'value',
    event: 'event'
  },
  watch: {
    value(newValue) {
      if (newValue === undefined || newValue === null || newValue === '') {
        this.checkValue = ''
      } else {
        this.checkValue = newValue
      }
    }
  },
  methods: {
    input(evl) {
      switch (this.validateType) {
        // 邮箱
        case 'email':
          // 不允许 中文 空格 特殊符号 表情 输入
          evl = evl.replace(/[\u4e00-\u9fa5]|[`~·！￥（——）：；“”‘’、，|《。》？、【】[\]]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gim, '')
          break
        // 手机号
        case 'phone':
          // 只允许输入数字
          evl = evl.replace(/[^\d]/gim, '')
          break
        // 账号
        case 'account':
          // 不允许 中文 空格 特殊符号 表情 输入
          evl = evl.replace(/[\u4e00-\u9fa5]|[`~·！￥（——）：；“”‘’、，|《。》？、【】[\]]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gim, '')
          break
        // 名称
        case 'name':
          // 只允许输入汉字
          evl = evl.replace(/[^\u4e00-\u9fa5]/gim, '')
          break
        default:
          // 不允许 空格 特殊符号 表情 输入
          evl = evl.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gim, '')
          break
      }
      this.$emit('event', evl.trim())
      this.$nextTick(() => {
        this.checkValue = evl
      })
    },
    change(val) {
      this.$nextTick(() => {
        this.checkValue = val.trim()
      })
      this.$emit('change', val.trim())
    }
  }
}
</script>

<style lang='scss'>
.input-format {
  width: 100%;
  .el-input-group {
    margin-top: 5px;
    .el-input-group__append {
      font-size: 12px;
    }
    &.el-input-group--prepend {
      .el-input__inner {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }
  }
}
</style>
