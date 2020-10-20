<template>
  <div class='app-container edit-page-style' ref="appindex">
    <template v-for='(tab,index) in tabs'>
      <review-chart :tab='tab' :key="index" :ref='tab.titleName'></review-chart>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import ReviewChart from './reviewChart'

export default {
  name: 'warnChart',
  data() {
    return {
      result: [],
      showTemplate: false,
      loading: false,
      warnInfo: {},
      formData: {
        threshold: [],
        warningCode: '',
        dimensionObject: {}
      },
      tabs: []
    }
  },
  components: {
    ReviewChart
  },
  async created() {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      target: '.app-container',
      spinner: 'el-icon-loading'
    })
    setTimeout(() => {
      loading.close()
    }, 3000)
    // 获取 colCode colName 字段名
    const response = await request({
      url: '/api/warn/record/warn',
      method: 'post',
      data: {
        data: 'chart',
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      }
    })
    if (response.data) {
      this.warnInfo = response.data
      this.formData.warningCode = this.warnInfo.warningCode
      this.showTemplate = true
    } else {
      return
    }
    // 获取 colCode colName 字段名
    const response1 = await request({
      url: '/api/warn/cond/listSrcColByType',
      method: 'post',
      data: {
        data: {
          sourceCode: this.warnInfo.sourceCode,
          propType: 'dimension'
        },
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      }
    })

    // 获取 groupCode
    const response2 = await request({
      url: '/api/warn/cond/listGroupCodesByWarningCode',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: this.warnInfo.warningCode
      }
    })

    if (response2.data && response2.data.length) {
      response2.data.forEach(async (code, index) => {
        // 获取 prop 对应值
        const response3 = await request({
          url: '/api/warn/warnCondThreshold/list',
          method: 'post',
          data: {
            data: {
              groupCode: code,
              warningCode: this.warnInfo.warningCode
            },
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search')
          }
        })
        if (response3.data && response3.data.length) {
          response3.data.forEach((item, index) => {
            let titleName = ''
            // 添加 tab
            const tabInfo = {
              titleName: '',
              warningCode: this.warnInfo.warningCode,
              formData: [
                {
                  type: 'daterange',
                  bind: 'createDateRange',
                  label: 'spot.contractLot.report.date',
                  props: ['createDateStart', 'createDateEnd'],
                  default: this.$toolUtil.getLatestMonth(),
                  attrs: {
                    format: 'yyyy-MM-dd',
                    'value-format': 'yyyyMMdd',
                    align: 'right',
                    pickerOptions: this.getPickerOptions()
                  }
                },
                {
                  prop: 'warningCode',
                  default: item.warningCode,
                  isShow: false
                },
                {
                  prop: 'batchId',
                  default: item.batchId,
                  isShow: false
                }
              ],
              mainData: {
                initSearch: true,
                api: {
                  search: '/api/warn/record/chart'
                }
              }
            }

            // 添加 titleName
            response1.data.forEach(async i => {
              let type = ''
              let datadict = ''
              if (item[i.colCode] && i.propAttrs && JSON.parse(i.propAttrs)) {
                type = JSON.parse(i.propAttrs).data
                datadict = JSON.parse(i.propAttrs).datadict
                if (datadict) {
                  const colCode = this.$t('datadict.' + datadict).filter(col => col.value === item[i.colCode])[0]
                  titleName += `${i.colName}:${colCode && colCode.label}, `
                } else {
                  const { data: list } = await request({
                    url: '/api/dd/selectData/get',
                    method: 'post',
                    data: {
                      data: { type, code: [item[i.colCode]], dataAuth: true },
                      funcModule: this.$t('route.' + this.$route.meta.title),
                      funcOperation: this.$t('biz.btn.search')
                    }
                  })

                  const colCode = list.filter(col => col.code === item[i.colCode])[0]
                  titleName += `${i.colName}:${colCode && colCode.name}, `
                }
              }
              tabInfo.titleName = titleName.slice(0, -2)
            })

            this.tabs.push(tabInfo)
          })
        }
      })
    }
  },
  methods: {
    // 设置日期选项
    getPickerOptions() {
      return {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '当天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime())
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    },

    // 按钮事件自定义
    triggerEvent(event) {
      if (typeof event === 'function') {
        event()
      } else if (typeof event === 'string' && this[event]) {
        this[event]()
      }
    },

    // 关闭通用事件
    close() {
      this.$emit('closeHandler')
    }
  }
}
</script>
