<template>
  <div class="app-container">
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto', 'margin-bottom': '22px'}">
      <!-- 顶部按钮 -->
      <el-row class='top-operate'>
        <el-button key='close' size="mini" type="primary" v-db-click @click='closeHandler'>
          <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
        </el-button>
        <el-button key='refresh' size="mini" v-db-click @click='getList1'>
          <svg-icon icon-class="线性-刷新"></svg-icon>{{$t('biz.btn.refresh')}}
        </el-button>
      </el-row>
      <div class='qm_echarts'>
        <div id="myChart1" :style="{width: '100%', height: chartHeight + 'px',backgroundColor: '#F3F3F3'}"></div>
      </div>
    </main>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifyError } from '@/utils/frame/base/notifyParams'

export default {
  name: 'jointSearch',
  data() {
    return {
      arrayDict: [],
      levelNumber: 1,
      moduleCode: this.$route.meta.bpmModule
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    chartHeight() {
      // 防止底部滚动条遮挡
      return this.clientWidth < 1366 ? this.clientHeight - 161 : this.clientHeight - 144
    }
  },
  mounted() {
    this.getList1()
  },

  methods: {
    closeHandler() {
      this.$store.dispatch('delVisitedViews', this.$route).then(views => {
        if (this.isActive(this.$route)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push('/')
          }
        }
      })
    },
    isActive(route) {
      return route.path === this.$route.path
    },
    getList1() {
      request({
        url: '/api/platform/cfgDictItem/list',
        method: 'POST',
        data: {
          data: {
            dictCode: 'BIZ_CODE'
          },
          funcModule: '平台字典明细',
          funcOperation: '查询'
        }
      })
        .then(response1 => {
          this.arrayDict = response1.data
          this.getList2()
        })
        .catch(() => {})
    },
    getList2() {
      request({
        url: '/api/bill/bizBill/listRelationBill',
        method: 'POST',
        data: {
          data: {
            billNo: this.$route.params.billNo,
            billType: this.$route.params.billType
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: '单据关联'
        }
      })
        .then(response => {
          const result = response.data.billList
          let dataArray = []
          result.forEach((i, index) => {
            let array3 = []
            const name = this.arrayDict.filter(j => j.dictItemVal === i.billType)[0]
            const source = this.arrayDict.filter(m => m.dictItemVal === i.preBillType)[0]
            let obj = {}
            let dataItem = {
              preBillNo: i.preBillNo,
              value: i.billNo,
              billType: i.billType,
              billRoute: i.billRoute,
              name: name ? name.dictItemName + '\n' + i.billNo : name
            }
            if (this.$route.params.billNo === i.billNo) {
              dataItem['itemStyle'] = {
                normal: {
                  color: '#BA332D'
                }
              }
              dataItem['symbolSize'] = 65
            }
            dataArray.push(dataItem)
          })
          let linkArray = []
          const resultLine = response.data.lineList
          resultLine.forEach((i, index) => {
            const name = this.arrayDict.filter(j => j.dictItemVal === i.billType)[0]
            const source = this.arrayDict.filter(m => m.dictItemVal === i.preBillType)[0]

            let dataItem = {
              target: name ? name.dictItemName + '\n' + i.billNo : name,
              source: source ? source.dictItemName + '\n' + i.preBillNo : source
            }
            linkArray.push(dataItem)
          })

          this.$echarts.dispose(document.getElementById('myChart1'))
          const myChart1 = this.$echarts.init(document.getElementById('myChart1'))
          myChart1.setOption({
            title: {
              text: this.$route.params.billNo
            },
            tooltip: {
              trigger: 'none'
            },
            animationDurationUpdate: 300,
            animationEasingUpdate: 'quinticInOut',
            series: [
              {
                type: 'graph',
                layout: 'force',
                draggable: false,
                force: {
                  repulsion: 2500,
                  edgeLength: [10, 50],
                  layoutAnimation: false
                },
                symbolSize: 60,
                roam: true,
                focusNodeAdjacency: true,
                label: {
                  show: true
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                  normal: {
                    textStyle: {
                      fontSize: 12
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#324555'
                  }
                },
                lineStyle: {
                  opacity: 0.9,
                  width: 2,
                  curveness: 0
                },
                data: dataArray,
                links: linkArray
              }
            ]
          })
          // 点击事件--跳转路由
          myChart1.on('click', params => {
            if (params && params.data && params.data.billRoute && params.data.value) {
              const routeOption = {
                name: params.data.billRoute,
                params: {
                  uk: params.data.value,
                  opType: 'view'
                }
              }
              this.$router.push(routeOption)
            } else {
              this.$notify(
                notifyError({
                  msg: '缺少查看页面参数'
                })
              )
            }
          })
        })
        .catch(() => {})
    }
  }
}
</script>
