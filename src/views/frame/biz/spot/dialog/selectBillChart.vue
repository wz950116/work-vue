<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div ref='treeTableDialog' class='dialog-container' :style="{width: this.sidebar.opened ? '1166px' : '1326px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @screenChange="setTableHeight" @TitleFun="cancel" />
      <main>
        <div class='qm_echarts'>
          <div id="myChart1" style='width: 100%;min-height: 650px;background-color: #F3F3F3;' :height='tableHeight'></div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'

export default {
  props: {
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      tableHeight: null,
      arrayDict: [],
      levelNumber: 1,
      titleName: '单据关联',
      moduleCode: this.$route.meta.bpmModule
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth'])
  },
  mounted() {
    this.getList1()
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight, false)
  },
  destroyed() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    // 设置列表动态高度
    setTableHeight() {
      $(document).ready(() => {
        this.tableHeight = this.$refs.treeTableDialog.offsetHeight - 77
      })
    },
    cancel() {
      this.$emit('closeHandler')
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
            billNo: this.param.billNo,
            billType: this.param.billType
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
              name: name ? name.dictItemName + '\n' + i.billNo : name
            }
            if (this.param.billNo === i.billNo) {
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
          const myChart1 = this.$echarts.init(document.getElementById('myChart1'))
          myChart1.setOption({
            title: {
              text: this.param.billNo
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
          // myChart1.on('click', params => {
          //   var back = this.$router.currentRoute.name
          //   const routeOption = {
          //     name: 'purchaseLotView',
          //     params: {
          //       uk: params.value,
          //       opType: 'view',
          //       back: back
          //     }
          //   }
          //   this.$router.push(routeOption)
          // })
        })
        .catch(() => {})
    }
  }
}
</script>
