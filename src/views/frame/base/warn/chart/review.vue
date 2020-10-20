<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div ref='formTableDialog' class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='dialog.titleName' @screenChange="setTableHeight" @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <main :style="{height: contentHeight + 'px', overflow: 'auto', marginRight: 0}">
        <template v-for='(tab,index) in dialog.tabs'>
          <review-chart :tab='tab' :key="index" :ref='tab.titleName' style='margin-right:3px;'></review-chart>
        </template>
      </main>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-for='(button, index) in dialog.bottomButtons' :key='index' v-db-click size="mini" v-bind='button.attrs' @click='triggerEvent(button.event)'>
          {{$t(button.name)}}
        </el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import ReviewChart from './reviewChart'

import { notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'warnChartList',
  data() {
    return {
      contentHeight: 451,
      result: [],
      showTemplate: false,
      loading: false,
      formData: {
        threshold: [],
        warningCode: this.param.warningCode,
        dimensionObject: {}
      },
      dialog: {
        titleName: '预览',
        tabs: [],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  components: {
    ReviewChart
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },

  async created() {
    // 获取 colCode colName 字段名
    const response1 = await request({
      url: '/api/warn/cond/listSrcColByType',
      method: 'post',
      data: {
        data: {
          sourceCode: this.param.sourceCode,
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
        data: this.param.warningCode
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
              warningCode: this.param.warningCode
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
              warningCode: this.param.warningCode,
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

            this.dialog.tabs.push(tabInfo)
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

    // 设置内容动态高度
    setTableHeight() {
      $(document).ready(() => {
        this.contentHeight = this.$refs.formTableDialog.offsetHeight - 75
      })
    },

    // 关闭通用事件
    close() {
      this.$emit('closeHandler')
    }
  }
}
</script>
