<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '900px' : '1050px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <!-- 顶部按钮 -->
      <el-row class='top-operate'>
        <el-button v-db-click size="mini" @click="cancel">
          <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
        </el-button>
      </el-row>

      <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('data.spotPrice.form.priceItemName')" prop="planName">
                <base-select v-model="listQuery.data.priceItemCode" :attrs="{data: 'DD_PRICE_ITEM',params: {usingFlag: '1',priceItemTypeList: '1,4'}}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item :label="$t('data.spotPrice.form.startDate')">
                <div style="width:48%;float:left">
                  <el-date-picker v-model="listQuery.data.pricingDateStart" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
                </div>
                <div style="float:left">-</div>
                <div style="width:48%;float:left">
                  <el-date-picker v-model="listQuery.data.pricingDateEnd" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn" v-permission="['query']">
            <el-button type="primary" @click="listData" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
          <!-- 展开收起 -->
          <div class='expand' @click='expand' v-show='false'>
            <i v-if='expandStatus' class='el-icon-arrow-up'></i>
            <i v-else class='el-icon-arrow-down'></i>
          </div>
        </el-form>
      </header>

      <main>
        <div id="app">
          <!--创建一个echarts的容器-->
          <div id="echartContainer" :style="{width: this.sidebar.opened ? '890px' : '1040px',height: '300px'}"></div>
        </div>
      </main>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'

export default {
  name: '',
  components: {},
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      listQuery: {
        current: 1,
        size: 20,
        isPage: false,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          priceItemCode: this.priceItemCode
        },
        defaultSortString: 'pricingDate.asc,priceItemName.desc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440 ? this.clientHeight - 500 : this.clientHeight - 520 // 防止底部滚动条遮挡
    },
    titleName() {
      return this.$t('data.spotPrice.tab.trendChard')
    }
  },
  props: {
    priceItemCode: String
  },
  mounted() {
    this.listData()
  },
  methods: {
    cancel() {
      this.$emit('close')
    },
    listData() {
      request({
        url: '/api/dd/spot/price/list',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.initChart(request)
      })
    },
    initChart(request) {
      var dates = []
      var datas = []
      var priceItemName = ''
      for (var i = 0; i < request.data.length; i++) {
        var data = request.data[i]
        dates.push(data.pricingDate.substring(0, 4) + '-' + data.pricingDate.substring(4, 6) + '-' + data.pricingDate.substring(6, 8))
        datas.push(data.price)
        priceItemName = data.priceItemName
      }
      var echarts = require('echarts')
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('echartContainer'))
      // 绘制图表
      myChart.setOption({
        title: {
          left: 'center',
          text: priceItemName + '价格走势'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: [
          {
            name: priceItemName,
            data: datas,
            type: 'line'
          }
        ]
      })
    },
    // 展开收起
    expand() {
      this.expandStatus = !this.expandStatus
      this.tableComputed()
    },
    tableComputed() {
      this.$nextTick(() => {
        const getElHeadHeight = window.getComputedStyle(document.getElementById('elHead')).height.split('px')[0]
        if (this.$parent.$refs.qmTable) {
          this.$parent.$refs.qmTable.tableHeight = this.clientWidth < 1366 ? (this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 188 : this.clientHeight - getElHeadHeight - 158) : this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 172 : this.clientHeight - getElHeadHeight - 142
        }
      })
    }
  }
}
</script>
