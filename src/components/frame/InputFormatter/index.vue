<template>
  <div class='input-format'>
    <el-input v-model.trim='input' :maxlength="20" :disabled="disabled" :readonly='readonly' :size='size' ref='input' :clearable='clearable' @change='hanlder'>
      <template v-if="prepend" slot="prepend">{{prepend}}</template>
      <template v-if="append" slot="append">{{append}}</template>
    </el-input>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
export default {
  data() {
    return {
      input: this.value
    }
  },
  model: {
    prop: 'value',
    event: 'event'
  },
  props: {
    value: {
      type: [String, Number, Decimal]
    },
    // 需要格式化类型
    type: {
      type: String,
      validator(value) {
        // 这个值必须匹配下列字符串中的一个
        return ['num', 'weight', 'price', 'money', 'exprice', 'taxrate', 'thousands', 'percent', 'integer', 'exchangeRate'].indexOf(value) !== -1
      }
    },
    size: {
      type: String,
      default: 'medium'
    },
    prepend: {
      type: String,
      default: ''
    },
    append: {
      type: String,
      default: ''
    },
    // 是否可用
    readonly: {
      type: Boolean,
      default: false
    },
    // 是否可用
    disabled: {
      type: Boolean,
      default: false
    },
    // 精度
    precision: {
      type: Number,
      default: 0
    },
    // 允许输入最大值(不包含)
    ltmax: {
      type: [Number, String],
      default: Infinity
    },
    // 允许输入最大值(包含)
    max: {
      type: [Number, String],
      default: Infinity
    },
    // 允许输入最小值(不包含)
    gtmin: {
      type: [Number, String],
      default: -Infinity
    },
    // 允许输入最小值(包含)
    min: {
      type: [Number, String],
      default: -Infinity
    },
    clearable: {
      type: Boolean,
      default: false
    },
    isValidate: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue === undefined || newValue === null || newValue === '') {
        this.input = ''
        // 手动清空输入框数值时
        this.$emit('event', '')
        this.$emit('change', '')
        this.$emit('dataChange', null)
      } else {
        this.input = newValue
        this.hanlder()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.input = this.value
      if (this.isValidate) {
        this.hanlder()
      }
    })
  },
  methods: {
    hanlder(param) {
      if (this.input === undefined || this.input === '' || this.input === null) {

        this.$emit('event', this.input)
        if (param !== undefined) {
          // 用户在A输入框输入不触发B输入框的事件
          this.$emit('userChange', null)
        }
        // 用户在A输入框输入触发B输入框的事件
        this.$emit('dataChange', null)

        return
      }

      this.$emit('change', this.input)
      switch (this.type) {
        // 数量 num:'###,###'
        case 'num':
          this.thousandsHandle(999999999, -999999999, 0)
          break
        // 重量  weight:'###,###.000'
        case 'weight':
          this.thousandsHandle(999999999999.999999, -999999999999.999999, 6)
          break
        // 单价 price:'###,###.00'
        case 'price':
          this.thousandsHandle(999999999999.99, -999999999999.99, 8)
          break
        // 金额 money:'###,###.00'
        case 'money':
          this.thousandsHandle(999999999999.99, -999999999999.99, 2)
          break
        // 无税单价 exprice:'###,###.000000'
        case 'exprice':
          this.thousandsHandle(999999999999.999999, -999999999999.999999, 6)
          break
        // 税率taxrate:'###,###.00'
        case 'taxrate':
          this.thousandsHandle(999999999999.99, -999999999999.99, 2)
          this.input = this.input ? this.input + '%' : this.input
          break
        // 汇率 exchangeRate:'###,###.0000'
        case 'exchangeRate':
          this.thousandsHandle(999999999999.9999, 0, 4)
          break
        // 千分化
        case 'thousands':
          this.thousandsHandle(this.max, this.min, this.precision)
          break
        // 百分数
        case 'percent':
          this.input = this.input + ''
          if (this.min < 0 || this.max < 0) {
            this.input = this.input.replace(/([^(\d|\.|\-)])/g, '')
          } else {
            this.input = this.input.replace(/([^(\d|\.)])/g, '')
          }
          this.$emit('event', this.input)
          this.input = this.input ? this.input + '%' : this.input
          break
        default:
          this.input = this.input.toString().replace(/([^(\d|\.|\-)])/g, '')
          // 判断第一个字符是否有多个负号
          if (this.input[0] !== '-' && this.input && this.input.includes('-')) {
            this.input = this.input.replace(/\-/g, '')
          } else if (this.input[0] === '-' && this.input.match(/\-/g) && this.input.match(/\-/g).length > 1) {
            const _index = this.input.indexOf('-', 1)
            this.input = this.input.substring(0, _index)
          }
          // 当输入超过一个.时，仅保留一个.
          if (this.input.match(/\./g) && this.input.match(/\./g).length > 1) {
            const _index = this.input.indexOf('.', this.input.indexOf('.') + 1)
            this.input = this.input.substring(0, _index)
          }
          // 精确小数点
          if (this.input && this.input * 1) {
            this.input = Number(this.input).toFixed(this.precision)
          }
          // 判断是否在可输入范围内，不在范围则清空，边界值允许输入
          if (this.input * 1 > this.max || this.input * 1 < this.min) this.input = ''

          // 判断是否在可输入范围内，不在范围则清空，边界值允许输入
          if (typeof this.max === 'number') {
            if (this.input * 1 > this.max) this.input = ''
          }
          if (typeof this.min === 'number') {
            if (this.input * 1 < this.min) this.input = ''
          }
          if (typeof this.ltmax === 'number') {
            if (this.input * 1 >= this.ltmax) this.input = ''
          }
          if (typeof this.gtmin === 'number') {
            if (this.input * 1 <= this.gtmin) this.input = ''
          }

          this.$emit('event', this.input)
          break
      }

      // 此处抛出一个未格式化且能自定义用于计算事件的值（不能使用event因为会多次触发影响需求），且不能写在格式化之前防止用户输入非法数字抛出去
      let inputVal = this.input.toString().replace(/([^(\d|\.|\-)])/g, '')
      // 判断第一个字符是否有多个负号
      if (inputVal[0] !== '-' && inputVal && inputVal.includes('-')) {
        inputVal = inputVal.replace(/\-/g, '')
      } else if (inputVal[0] === '-' && inputVal.match(/\-/g) && inputVal.match(/\-/g).length > 1) {
        const _index = inputVal.indexOf('-', 1)
        inputVal = inputVal.substring(0, _index)
      }
      // 当输入超过一个.时，仅保留一个.
      if (inputVal.match(/\./g) && inputVal.match(/\./g).length > 1) {
        const _index = inputVal.indexOf('.', inputVal.indexOf('.') + 1)
        inputVal = inputVal.substring(0, _index)
      }
      if (param !== undefined) {
        // 用户在A输入框输入不触发B输入框的事件
        this.$emit('userChange', inputVal)
      }
      // 用户在A输入框输入触发B输入框的事件
      this.$emit('dataChange', inputVal)
    },
    focus() {
      this.$refs.input.focus()
    },
    thousandsHandle(max, min, precision) {
      this.input = this.input.toString().replace(/([^(\d|\.|\-)])/g, '')
      // 判断第一个字符是否有多个负号
      if (this.input[0] !== '-' && this.input && this.input.includes('-')) {
        this.input = this.input.replace(/\-/g, '')
      } else if (this.input[0] === '-' && this.input.match(/\-/g) && this.input.match(/\-/g).length > 1) {
        const _index = this.input.indexOf('-', 1)
        this.input = this.input.substring(0, _index)
      }
      // 当输入超过一个.时，仅保留一个.
      if (this.input.match(/\./g) && this.input.match(/\./g).length > 1) {
        const _index = this.input.indexOf('.', this.input.indexOf('.') + 1)
        this.input = this.input.substring(0, _index)
      }
      // 精确小数点
      if ((this.input && this.input * 1) || (this.input === '0' && precision)) {
        this.input = Number(this.input).toFixed(precision)
      }
      // 判断是否在可输入范围内，不在范围则清空，边界值允许输入
      max = typeof this.max === 'number' ? this.max : max
      min = typeof this.min === 'number' ? this.min : min
      if (this.input * 1 > max || this.input * 1 < min) this.input = ''

      if (typeof this.ltmax === 'number') {
        if (this.input * 1 >= this.ltmax) this.input = ''
      }
      if (typeof this.gtmin === 'number') {
        if (this.input * 1 <= this.gtmin) this.input = ''
      }

      this.$emit('event', this.input)

      if (/\./.test(this.input)) {
        this.input = this.input.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\d{3}(?![.]|$)/g, '$&')
      } else {
        this.input = this.input.replace(/\d(?=(\d{3})+$)/g, '$&,')
      }
    }
  }
}
</script>

<style lang='scss'>
.input-format {
  width: 100%;
  .el-input-group {
    margin-top: 1px;
    .el-input-group__append {
      font-size: 12px;
    }
  }
}
</style>
