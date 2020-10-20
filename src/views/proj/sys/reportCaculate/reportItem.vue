<template>
  <header>
    <div class='form-title'>{{title}}</div>
    <el-form :inline="true" class="header-form-inline" label-position="left" ref="refForm">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-progress :percentage="progressftDailyPos" style="width: 70%"></el-progress>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t( '日期范围')" prop='instructionName'>
            <template>
              <el-row :gutter="0">
                <el-col :span="11">
                  <el-form-item :prop="startDate">
                    <el-date-picker v-model="startDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" align='center'>~</el-col>
                <el-col :span="11">
                  <el-form-item :prop="endDate">
                    <el-date-picker v-model="endDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd'>
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button v-db-click size="mini" @click="calculate(reportCode,startDate, endDate)" style='margin-right:6px;' type="primary" :disabled="disabled">
            <svg-icon icon-class="线性-修改"></svg-icon>{{$t('biz.btn.caculate')}}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </header>
</template>
<script>
import { parseTime } from '@/utils/frame/base/index'

export default {
  name: 'reportCaculate',
  props: ['title', 'reportCode', 'progressftDailyPos'],
  data() {
    return {
      startDate: parseTime(new Date(), '{y}{m}{d}'),
      endDate: parseTime(new Date(), '{y}{m}{d}'),
      disabled: false
    }
  },
  methods: {
    calculate(reportCode, startDate, endDate) {
      this.disabled = true
      this.$sendWsMessage('REPORT_CALC', {        operate: 'CALCULATE',
        data: {
          reportCode: reportCode,
          startDate: startDate,
          endDate: endDate
        }
      })
    },
    btnAvailable() {
      this.disabled = false
    }
  }
}
</script>
