<template>
  <!-- <div ref='tab'> -->
  <header ref='formTableDialogHeader' style='border-radius:5px;margin:0 0 3px;' :style="{'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
    <div class='form-title'>
      {{ tab.titleName || $t('biz.title.mainInfo') }}
      <i :class="[mainInfoVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='mainInfoVisible = !mainInfoVisible'></i>
    </div>
    <el-form v-if='mainInfoVisible' ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline' style="border-bottom: 1px solid #ababab;">
      <el-row :gutter="20" style='width:94%;'>
        <el-col :span="8" v-for='(f, index) in tab.formData' :key='index'>
          <!-- 日期 -->
          <el-form-item v-if='f.type === "daterange"' :label="$t(f.label)" :prop='f.bind'>
            <el-date-picker v-model="listQuery.data[f.bind]" type="daterange" range-separator="~" start-placeholder="" end-placeholder="" v-bind='f.attrs' v-on='f.event' @change='changeDaterangeTime(f)'>
            </el-date-picker>
          </el-form-item>
          <el-form-item v-else-if='f.type === "date"' :label="$t(f.label)">
            <el-row :gutter="0">
              <el-col :span="11">
                <el-date-picker v-model="listQuery.data[f.props[0]]" v-bind='f.attrs' @change="changeStartTime" :picker-options='dateStartBefore' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')">
                </el-date-picker>
              </el-col>
              <el-col :span="2" align='center'>~</el-col>
              <el-col :span="11">
                <el-date-picker v-model="listQuery.data[f.props[1]]" v-bind='f.attrs' @change="changeEndTime" :picker-options='dateEndBefore' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')">
                </el-date-picker>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 单选框 -->
          <el-form-item v-else-if='f.type === "radio"' :label="$t(f.label)">
            <el-radio-group v-model="listQuery.data[f.prop]">
              <el-radio v-for='item in f.list' :key="item.value" :label="item.value" v-bind='f.attrs'>{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 多选框 -->
          <el-form-item v-else-if='f.type === "checkbox"' :label="$t(f.label)">
            <el-checkbox-group v-model="listQuery.data[f.prop]">
              <el-checkbox v-for='item in f.list' :key="item.value" :label="item.value" v-bind='f.attrs'>{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- 数值区间 -->
          <el-form-item v-else-if='f.type === "numberInterval"' :label="$t(f.label)">
            <el-row :gutter="0">
              <el-col :span="11">
                <input-formatter :min='f.attrs.startMin' :max='listQuery.data[f.props[1]] || f.attrs.startMax' v-model="listQuery.data[f.props[0]]" v-bind='f.attrs' size="mini"></input-formatter>
              </el-col>
              <el-col :span="2" align='center'>~</el-col>
              <el-col :span="11">
                <input-formatter :min='listQuery.data[f.props[0]] || f.attrs.endMin' :max='f.attrs.endMax' v-model="listQuery.data[f.props[1]]" v-bind='f.attrs' size="mini"></input-formatter>
              </el-col>
            </el-row>
          </el-form-item>
          <!-- 下拉输入 -->
          <el-form-item v-else :label="$t(f.label)" :prop='f.prop'>
            <!-- 字典码表 -->
            <el-select v-if='f.list' v-model="listQuery.data[f.prop]" v-bind='f.attrs' :placeholder="$t('biz.placeholder.choose')">
              <el-option v-for="item in f.list" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- 公用组件 -->
            <component v-else :is='f.element' v-model='listQuery.data[f.prop]' v-bind='f.attrs' v-on='f.event' :attrs='f.attrs'></component>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="search-btn" v-permission="['query']">
        <el-button type="primary" :loading="loading" @click="getList" v-db-click>
          {{$t('biz.lbl.search')}}
        </el-button>
      </div>
    </el-form>
    <div v-show='mainInfoVisible' class='qm_echarts' ref='chart' :style="{ minHeight: echartHeight + 'px', margin: 0, border: 'none' }"></div>
  </header>
  <!-- </div> -->
</template>

<script>
import request from '@/utils/frame/base/request'

export default {
  name: 'warnChart',
  data() {
    return {
      echartHeight: 345,
      mainInfoVisible: true,
      loading: false,
      dateStartBefore: {},
      dateEndBefore: {},
      listQuery: {
        data: {},
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      chartOptionExtend: {},
      serieOptionExtend: {},
      chartOptionBak: {},
      chartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: []
      }
    }
  },
  props: {
    tab: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  async created() {
    // 保存旧结构
    this.chartOptionBak = Object.assign({}, this.chartOption)
    const response = await request({
      url: '/api/warn/chart/get',
      method: 'post',
      data: {
        data: this.tab['warningCode'],
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      }
    })
    if (response.data) {
      const resData = response.data
      if (resData.chartOption && JSON.parse(resData.chartOption)) {
        this.chartOptionExtend = Object.assign({}, JSON.parse(resData.chartOption))
      }
      if (resData.seriesOption && JSON.parse(resData.seriesOption)) {
        this.serieOptionExtend = Object.assign({}, JSON.parse(resData.seriesOption))
      }
    }
  },
  beforeMount() {
    // 初始化formData数据
    if (this.tab.formData instanceof Array) {
      this.tab.formData.forEach(v => {
        let val = v.default || ''
        if (v.prop) this.$set(this.listQuery.data, v.prop, val)
        if (v.props instanceof Array && (v.type === 'date' || v.type === 'daterange')) {
          let defaultVal = ['', '']
          defaultVal[0] = v.default && v.default[0]
          defaultVal[1] = v.default && v.default[1]
          if (v.defaultFunc && !v.defaultFunc.includes('.')) {
            defaultVal = new Function(`return ${this.func[v.defaultFunc]}`)()()
          }
          this.$set(this.listQuery.data, v.props[0], defaultVal[0])
          this.changeStartTime(defaultVal[0], v.attrs.pickEnd)
          this.$set(this.listQuery.data, v.props[1], defaultVal[1])
          this.changeEndTime(defaultVal[1], v.attrs.pickStart)

          if (v.type === 'daterange' && v.bind && v.default) {
            this.$set(this.listQuery.data, v.bind, [this.listQuery.data[v.props[0]], this.listQuery.data[v.props[1]]])
          }
        } else if (v.props instanceof Array && v.default instanceof Array) {
          this.$set(this.listQuery.data, v.props[0], v.default[0])
          this.changeStartTime(v.default[0], v.attrs.pickEnd)
          this.$set(this.listQuery.data, v.props[1], v.default[1])
          this.changeEndTime(v.default[1], v.attrs.pickStart)
        } else if (v.default) {
          this.$set(this.listQuery.data, v.prop, v.default)
        }
        // 校验规则
        if (v.validate) {
          this.rules[v.prop] = v.validate
          if (v.validate[0].validatorFn && typeof v.validate[0].validatorFn === 'function') {
            v.validate[0].validator = (rule, value, callback) => {
              v.validate[0].validatorFn(rule, value, callback, v.prop)
            }
          }
        }
      })
    }
  },
  mounted() {
    if (this.tab.mainData.initSearch) {
      this.getList()
    }
  },
  methods: {
    // 图表数据请求
    getList() {
      this.loading = true
      request({
        url: this.tab.mainData.api.search,
        method: 'POST',
        data: this.listQuery
      })
        .then(response => {
          this.loading = false
          this.initChart(response.data)
        })
        .catch(() => {
          this.loading = false
          this.initChart()
        })
    },

    // 渲染图表
    initChart(data) {
      // option 还原 并扩展
      this.chartOption = Object.assign({}, this.chartOptionBak, this.chartOptionExtend)
      if (data) {
        if (data.legend) {
          this.chartOption.legend = Object.assign({}, this.chartOption.legend, data.legend)
        }
        if (data.series) {
          data.series.forEach(serie => {
            Object.assign(serie, { type: 'bar' }, this.serieOptionExtend)
          })
          this.chartOption.series = Object.assign([], this.chartOption.series, data.series)
        }
        if (data.thresholdSeries) {
          data.thresholdSeries.forEach(serie => {
            this.chartOption.series.push(serie)
          })
        }
        if (data.xAxis) {
          this.chartOption.xAxis = Object.assign({}, this.chartOption.xAxis, data.xAxis)
        }

        this.$echarts.dispose(this.$refs.chart)
        const chart = this.$echarts.init(this.$refs.chart)
        window.onresize = chart.resize
        chart.setOption(this.chartOption)
      }
    },

    // 时间变化
    changeDaterangeTime(form) {
      this.listQuery.data[form.props[0]] = this.listQuery.data[form.bind] ? this.listQuery.data[form.bind][0] : ''
      this.listQuery.data[form.props[1]] = this.listQuery.data[form.bind] ? this.listQuery.data[form.bind][1] : ''
      this.getList()
    },

    // 开始时间变化
    changeStartTime(date) {
      this.dateEndBefore = {
        disabledDate(time) {
          return dateFormate(time, 'YYYYMMDD') * 1 < date * 1
        }
      }
    },

    // 结束时间变化
    changeEndTime(date) {
      this.dateStartBefore = {
        disabledDate(time) {
          return date ? dateFormate(time, 'YYYYMMDD') * 1 > date * 1 : false
        }
      }
    }
  }
}
</script>
