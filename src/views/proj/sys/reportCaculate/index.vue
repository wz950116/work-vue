<template>
  <div class='app-container edit-page-style'>
    <reportItem v-for="item in reportList" :ref="item.reportCode" :key="item.reportCode" :title="item.title" :reportCode="item.reportCode" :progressftDailyPos="item.progressftDailyPos"></reportItem>
  </div>
</template>
<script>

import { notifyError, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import reportItem from './reportItem'

export default {
  name: 'reportCaculate',
  components: {
    reportItem
  },
  data() {
    return {
      reportList: [
        {
          title: '期货每日敞口历史数据',
          reportCode: 'FT_DAILY_POS',
          progressftDailyPos: 0
        },
        // {
        //   title: '期货每日未匹配敞口历史数据',
        //   reportCode: 'FT_DAILY_NO_POS',
        //   progressftDailyPos: 0
        // },
        {
          title: '现货每日敞口历史数据',
          reportCode: 'SP_DAILY_POS',
          progressftDailyPos: 0
        },
        // {
        //   title: '现货每日未匹配敞口历史数据',
        //   reportCode: 'SP_DAILY_NO_POS',
        //   progressftDailyPos: 0
        // },
        {
          title: '期货匹配数据信息',
          reportCode: 'FT_MATCH_INFO',
          progressftDailyPos: 0
        },
        {
          title: '现货匹配数据信息',
          reportCode: 'SP_MATCH_INFO',
          progressftDailyPos: 0
        },
        {
          title: '期货汇总信息',
          reportCode: 'COST_SHARE',
          progressftDailyPos: 0
        },
        // {
        //   title: '期货费用数据信息',
        //   reportCode: 'FUTURES_FEE',
        //   progressftDailyPos: 0
        // },
        // {
        //   title: '现货费用数据信息',
        //   reportCode: 'SPOT_FEE',
        //   progressftDailyPos: 0
        // },
        {
          title: '现货汇总信息',
          reportCode: 'SPOT_FUND',
          progressftDailyPos: 0
        }
      ],
      reportMap: {}
    }
  },
  created() {
    this.$addWsListener('REPORT_CALC', this.reviceProgress)
  },
  mounted() {
    for (let i = 0; i < this.reportList.length; i++) {
      const data = this.reportList[i]
      this.reportMap[data.reportCode] = data
    }
  },
  methods: {
    caculate() {
      var datas = this.$refs.qmTable.currentRow

      if (!datas || datas.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      for (var i = 0; i < datas.length; i++) {
        var data = datas[i]
        request({
          url: data.url,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.remove')
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: request.data
            })
          )
        })
      }
    },
    reviceProgress(wsData) {
      if (wsData.operate === 'PROGRESS') {
        var progressData = wsData.data
        this.reportMap[progressData.reportCode].progressftDailyPos = progressData.progress

        if (progressData.state !== 'EXECUTE') {
          this.$refs[progressData.reportCode][0].btnAvailable()
        }
        if (progressData.state === 'SUCCESS') {
          this.$notify(
            notifySuccess({
              msg: progressData.msg
            })
          )
        }
        if (progressData.state === 'ERROR') {
          this.$notify(
            notifyError({
              msg: progressData.msg
            })
          )
        }
      }
    }
  }
}
</script>
