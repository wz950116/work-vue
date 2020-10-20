<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto', 'margin': '22px 0'}">
      <div class='qm_echarts' ref='chartPrd'></div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'

export default {
  name: 'conScReportPrdPie',
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
            customerCode: '',
            productGroupCode: '',
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
            label: 'spot.contractLot.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
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
          },
          {
            label: 'data.product.form.productGroupName',
            prop: 'productGroupCode',
            element: 'tree-group',
            component: () => import('@/views/frame/biz/data/productGroup/TreeProductGroup'),
            attrs: {
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
        url: '/api/contract/scReport/reportByProduct',
        method: 'POST',
        data: {
          data: this.form.listQuery.data,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      }).then(response => {
        const dataFund = []
        for (let i = 0; i < response.data.length; i++) {
          dataFund.push({
            value: response.data[i].fundConfirmAmount ? response.data[i].fundConfirmAmount / 10000 : 0,
            name: response.data[i].productName ? response.data[i].productName : response.data[i].productCode,
            productCode: response.data[i].productCode,
            whChkQty: response.data[i].whChkQty,
            fundConfirmAmount: response.data[i].fundConfirmAmount,
            invoiceAmt: response.data[i].invoiceAmt,
            measurementUnitCode: response.data[i].measurementUnitCode,
            measurementUnitName: this.getDictLabel('measurementUnit', response.data[i].measurementUnitCode)
          })
        }

        const chartPrd = this.$echarts.init(this.$refs.chartPrd)
        chartPrd.setOption({
          title: { text: '品种销售额占比' },
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
          legend: {
            orient: 'vertical',
            left: 'left',
            top: 30,
            data: dataFund
          },
          tooltip: {
            trigger: 'item',
            formatter(params, ticket, callback) {
              const fundConfirmAmount = params.data.fundConfirmAmount ? params.data.fundConfirmAmount / 10000 : '-'
              const invoiceAmt = params.data.invoiceAmt ? params.data.invoiceAmt / 10000 : '-'
              const whChkQty = params.data.whChkQty ? params.data.whChkQty : '-'
              return params.data.name +
                '<br/>销售额: ' + fundConfirmAmount + ' 万元' +
                '<br/>销售额占比: ' + params.percent + '%' +
                '<br/>发票额: ' + invoiceAmt + ' 万元' +
                '<br/>销售量: ' + whChkQty + ' ' + params.data.measurementUnitName
            }
          },
          series: [
            {
              name: '销售额(万元)',
              type: 'pie',
              data: dataFund
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
