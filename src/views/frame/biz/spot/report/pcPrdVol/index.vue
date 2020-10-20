<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto', 'margin': '22px 0'}">
      <div class='qm_echarts' ref='chartPrd'></div>
      <div class='qm_echarts' ref='chartCst'></div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'

export default {
  name: 'conPcReportPrdVol',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            bizOrganCode: '',
            bizDeptCode: '',
            dateFrom: '',
            dateTo: ''
          }
        },
        formData: [
          {
            type: 'date',
            label: 'spot.contractLot.report.date',
            props: ['dateFrom', 'dateTo'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizDeptName',
            prop: 'bizDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              clearable: true
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth'])
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取初始化数据
    getList() {
      request({
        url: '/api/contract/pcReport/reportByProduct',
        method: 'POST',
        data: {
          data: this.form.listQuery.data,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      }).then(response => {
        const axisX = []
        const dataFund = []
        const dataInvo = []
        for (let i = 0; i < response.data.length; i++) {
          axisX.push({
            value: {
              productCode: response.data[i].productCode,
              productName: response.data[i].productName,
              measurementUnitCode: response.data[i].measurementUnitCode,
              toString() {
                if (this.productName !== undefined && this.productName !== null && this.productName !== '') {
                  return this.productName.toString()
                } else if (this.productCode !== undefined && this.productCode !== null && this.productCode !== '') {
                  return this.productCode.toString()
                }
                return ''
              }
            }
          })
          dataFund.push(response.data[i].fundConfirmAmount / 10000)
          dataInvo.push(response.data[i].invoiceAmt / 10000)
        }

        const chartPrd = this.$echarts.init(this.$refs.chartPrd)
        chartPrd.setOption({
          title: { text: '品种业务量统计表' },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            top: 20,
            right: '10%',
            iconStyle: {
              normal: {
                textPosition: 'right'
              },
              emphasis: {
                textPosition: 'top'
              }
            },
            feature: {
              restore: {
                show: true
              },
              saveAsImage: {
                show: true,
                title: '下载'
              }
            }
          },
          yAxis: [
            {
              type: 'value',
              position: 'left',
              axisLabel: {
                formatter: '{value} 万元'
              }
            }
          ],
          xAxis: {
            triggerEvent: true,
            data: axisX
          },
          legend: {
            data: ['采购额(万元)', '发票额(万元)']
          },
          series: [
            {
              name: '采购额(万元)',
              type: 'bar',
              data: dataFund
            },
            {
              name: '发票额(万元)',
              type: 'bar',
              data: dataInvo
            }
          ]
        })
        const chartCst = this.$echarts.init(this.$refs.chartCst)
        chartCst.dispose()
        chartPrd.off('click')
        chartPrd.on('click', params => {
          if (params.componentType !== 'xAxis' && params.componentType !== 'series') {
            return
          }
          const productInfo = params.componentType === 'xAxis' ? params.value : params.name
          this.dispChartCst(productInfo)
        })
      })
    },
    dispChartCst(productInfo) {
      const productName = (productInfo.productName !== undefined && productInfo.productName !== null && productInfo.productName !== '') ? productInfo.productName : productInfo.productCode
      const measurementUnitName = this.getDictLabel('measurementUnit', productInfo.measurementUnitCode)
      request({
        url: '/api/contract/pcReport/reportBySupplier',
        method: 'POST',
        data: {
          data: {
            dateFrom: this.form.listQuery.data.dateFrom,
            dateTo: this.form.listQuery.data.dateTo,
            productCode: productInfo.productCode
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      }).then(response => {
        const axisX = []
        const dataProd = [] // 货
        const dataFund = [] // 款
        const dataInvo = [] // 票
        for (let i = 0; i < response.data.length; i++) {
          axisX.push({
            value: {
              supplierCode: response.data[i].supplierCode,
              supplierName: response.data[i].supplierName,
              toString() {
                if (this.supplierName !== undefined && this.supplierName !== null && this.supplierName !== '') {
                  return this.supplierName.toString()
                } else if (this.supplierCode !== undefined && this.supplierCode !== null && this.supplierCode !== '') {
                  return this.supplierCode.toString()
                }
                return ''
              }
            }
          })
          dataProd.push(response.data[i].whChkQty)
          dataFund.push(response.data[i].fundConfirmAmount / 10000)
          dataInvo.push(response.data[i].invoiceAmt / 10000)
        }

        const chartCst = this.$echarts.init(this.$refs.chartCst)
        window.onresize = chartCst.resize
        chartCst.setOption({
          title: { text: '供应商业务量统计表(' + productName + ')' },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            show: true,
            top: 20,
            right: '10%',
            iconStyle: {
              normal: {
                textPosition: 'right'
              },
              emphasis: {
                textPosition: 'top'
              }
            },
            feature: {
              restore: {
                show: true
              },
              saveAsImage: {
                show: true,
                title: '下载'
              }
            }
          },
          yAxis: [
            {
              type: 'value',
              position: 'left',
              axisLabel: {
                formatter: '{value} 万元'
              }
            },
            {
              type: 'value',
              position: 'right',
              axisLabel: {
                formatter: '{value} ' + measurementUnitName
              }
            }
          ],
          xAxis: {
            triggerEvent: true,
            data: axisX
          },
          legend: {
            data: ['采购额(万元)', '发票额(万元)', '采购量(' + measurementUnitName + ')']
          },
          series: [
            {
              name: '采购额(万元)',
              type: 'bar',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: dataFund
            },
            {
              name: '发票额(万元)',
              type: 'bar',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: dataInvo
            },
            {
              name: '采购量(' + measurementUnitName + ')',
              type: 'line',
              xAxisIndex: 0,
              yAxisIndex: 1,
              data: dataProd
            }
          ]
        })
      })
    },
    getDictLabel(dictName, dictValue) {
      if (dictValue === null || dictValue === undefined || dictValue === '') {
        return ''
      }
      const dictItems = this.$t('datadict.' + dictName)
      let dictLabel = dictValue
      for (let i = 0; i < dictItems.length; i++) {
        if (dictItems[i].value === dictValue) {
          dictLabel = dictItems[i].label
        }
      }
      return dictLabel
    }
  }
}
</script>
