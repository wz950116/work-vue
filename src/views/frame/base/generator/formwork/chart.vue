<template>
  <div class="app-container">
    <el-alert title="页面初始化错误,请联系技术人员" v-if="showError" type="error" show-icon>
    </el-alert>
    <template v-if="showTemplate">
      <qm-form ref='qmForm' :form='form'></qm-form>
      <main>
        <div class='qm_echarts' ref='chart'></div>
      </main>
    </template>
  </div>
</template>
<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import session from '@/utils/frame/base/sessionStorage'
// 注册组件
const registerComponent = data => {
  if (data && data.length > 0) {
    data.forEach(item => {
      if (item.component) {
        const { component } = item
        item.component = resolve => require.ensure([], () => resolve(require(`@/views/frame/base/generator/${component.split('views/frame/base/generator/')[1]}.vue`)))
      }
    })
  }
}
export default {
  name: 'formworkChart',
  data() {
    return {
      showTemplate: false,
      isPage: false,
      showError: false,

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
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      chart: {
        xAxis: '',
        yAxis: [],
        layoutType: '',
        chartType: '',
        legend: '',
        thresholdArray: ''
      },
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: false,
          camelToUnderlineFlg: true,
          funcModule: '',
          funcOperation: '',
          data: {}
        },
        formData: []
      },
      mainData: {
        table: {
          cols: []
        },
        bottomBar: {
          pagination: {}
        }
      }
    }
  },

  async created() {
    // 保存旧结构
    this.chartOptionBak = Object.assign({}, this.chartOption)
    const response = await request({
      url: '/api/code/formwork/report',
      method: 'post',
      data: {
        data: session.get('bpmModule') || '',
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.init')
      }
    })
    if (response.data) {
      const resData = response.data.codeDataJson
      this.form.moreShowFlg = resData.form.moreShowFlg
      this.form.listQuery = Object.assign({}, this.form.listQuery, resData.form.listQuery, {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {}
      })
      this.form.formData = resData.form.formData
      this.chart = resData.chart
      this.mainData = Object.assign({}, resData.mainData, { api: { search: '/api/code/codeReport/chartSearch' } })

      this.chartOptionExtend = Object.assign({}, resData.chartOptionExtend)
      this.serieOptionExtend = Object.assign({}, resData.serieOptionExtend)

      this.showTemplate = true

      this.getList()
    } else {
      this.showError = true
    }
  },
  mounted() {},
  methods: {
    getList() {
      request({
        url: this.mainData.api.search,
        method: 'POST',
        data: this.form.listQuery
      })
        .then(response => {
          this.loading = false
          this.initChart(response.data)
        })
        .catch(e => {
          console.log(e)
          this.showError = true
          this.loading = false
        })
    },
    initChart(data) {
      // option 还原 并扩展
      this.chartOption = Object.assign({}, this.chartOptionBak, this.chartOptionExtend)
      if (data) {
        if (data.legend) {
          this.chartOption.legend = Object.assign({}, this.chartOption.legend, data.legend)
        }
        if (data.series) {
          data.series.forEach(serie => {
            Object.assign(serie, { type: this.chart.chartType }, this.serieOptionExtend)
          })
          this.chartOption.series = Object.assign([], this.chartOption.series, data.series)
        }
        if (data.thresholdSeries) {
          data.thresholdSeries.forEach(serie => {
            //Object.assign(serie, this.serieOptionExtend)
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
    }
  }
}
</script>
