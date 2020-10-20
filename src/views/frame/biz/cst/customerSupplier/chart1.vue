<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>

    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto', 'margin-bottom': '22px'}">
      <div class='qm_echarts' id="myChart1"></div>
      <div class='qm_echarts'>
        <div>
          <el-row type='flex' justify="center" style="padding: 10px">
            <span style="padding: 7px;font-size:18px">客户类型</span>
            <el-col :span='4'>
              <el-select v-model="typeCodeForm" :placeholder="$t('biz.placeholder.choose')" :clearable="true" @change='changeForm'>
                <el-option v-for="item in $t('datadict.custTypeChart')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div id="myChart2" style='width: 100%;min-height: 450px;'></div>
      </div>
      <div class='qm_echarts'>
        <div>
          <el-row type='flex' justify="center" style="padding: 10px">
            <span style="padding: 7px;font-size:18px">客户类型</span>
            <el-col :span='4'>
              <el-select v-model="typeCodeNature" :placeholder="$t('biz.placeholder.choose')" :clearable="true" @change='changeNature'>
                <el-option v-for="item in $t('datadict.custTypeChart')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
        <div id="myChart3" style='width: 100%;min-height: 450px;'></div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'

export default {
  name: 'custNumReport',
  data() {
    return {
      typeCodeForm: '',
      typeCodeNature: '',
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            custNo: '',
            custName: '',
            typeCode: '',
            classify: '',
            date: '',
            status: '',
            usingFlag: '',
            isBlacklist: '',
            typeCodeNature: '',
            typeCodeForm: ''
          },
          defaultSortString: 'id.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'cst.customerSupplier.form.date',
            props: ['startDate', 'endDate'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
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
    changeForm() {
      this.form.listQuery.data.typeCodeForm = this.typeCodeForm
      this.getList2()
    },
    changeNature() {
      this.form.listQuery.data.typeCodeNature = this.typeCodeNature
      this.getList3()
    },
    getList1() {
      request({
        url: '/api/cust/customer/getChartDataByType',
        method: 'POST',
        data: {
          data: this.form.listQuery.data,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      })
        .then(response => {
          const myChart1 = this.$echarts.init(document.getElementById('myChart1'))
          myChart1.setOption({
            title: {
              text: '客户统计表-客户类型'
            },
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
            grid: {
              left: '20%',
              right: '20%',
              bottom: '20%',
              scontainLabel: true
            },
            dataZoom: {
              show: true,
              start: 0,
              end: 100
            },
            xAxis: {
              data: response.data.typeCodeList
            },
            yAxis: {},
            series: [
              {
                name: '新增数量',
                type: 'bar',
                barWidth: 50,
                data: response.data.countNumList
              }
            ]
          })
        })
        .catch(() => {})
    },
    getList2() {
      request({
        url: '/api/cust/customer/getChartDataByEnterpriseForm',
        method: 'POST',
        data: {
          data: this.form.listQuery.data,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      })
        .then(response => {
          const myChart2 = this.$echarts.init(document.getElementById('myChart2'))
          myChart2.setOption({
            title: {
              text: '客户统计表-企业类型'
            },
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
            grid: {
              left: '20%',
              right: '20%',
              bottom: '20%',
              scontainLabel: true
            },
            dataZoom: {
              show: true,
              start: 0,
              end: 100
            },
            xAxis: {
              data: response.data.enterpriseFormCodeList
            },
            yAxis: {},
            series: [
              {
                name: '新增数量',
                type: 'bar',
                barWidth: 50,
                data: response.data.countNumList
              }
            ]
          })
        })
        .catch(() => {})
    },
    getList3() {
      request({
        url: '/api/cust/customer/getChartDataByEnterpriseType',
        method: 'POST',
        data: {
          data: this.form.listQuery.data,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      })
        .then(response => {
          const myChart3 = this.$echarts.init(document.getElementById('myChart3'))
          myChart3.setOption({
            title: {
              text: '客户统计表-企业性质'
            },
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
            grid: {
              left: '20%',
              right: '20%',
              bottom: '20%',
              scontainLabel: true
            },
            dataZoom: {
              show: true,
              start: 0,
              end: 100
            },
            xAxis: {
              data: response.data.enterpriseTypeCodeList
            },
            yAxis: {},
            series: [
              {
                name: '新增数量',
                type: 'bar',
                barWidth: 50,
                data: response.data.countNumList
              }
            ]
          })
        })
        .catch(() => {})
    },
    // 获取初始化数据
    getList() {
      this.getList1()
      this.getList2()
      this.getList3()
    }
  }
}
</script>
