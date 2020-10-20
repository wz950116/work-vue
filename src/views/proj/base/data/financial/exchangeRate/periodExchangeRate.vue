<template>
  <div v-el-drag-dialog class='dialog-wrapper' @closeDialog="hanldeCloseDialog">
    <div class='dialog-container' type='formTableDialog' style="width:400px">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="hanldeCloseDialog" />

      <!-- 内容 -->
      <header style='border-radius:5px;'>
        <el-form :model="formData" label-position="left" :rules='rules' ref='validateForm'>
          <el-row :gutter="0">
            <el-col :span="24">
              <el-form-item :label="$t('dataHq.periodRate.year')" prop='year'>
                <el-date-picker @change="changeTime" v-model="formData.year" type="year" placeholder="" value-format="yyyy" format="yyyy">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>

      <main>
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" style="border:1px solid;" :element-loading-text="$t('route.load')" :data="tableDataPeriod" :height='400'>
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column :label="$t('dataHq.periodRate.month')" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.month}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('dataHq.periodRate.periodExchangeRate')" align="center">
            <template slot-scope="scope">
              <input-formatter :size='size' v-model="scope.row.periodExchangeRate" :min='0' :max="9999999" :precision="3"></input-formatter>
            </template>
          </el-table-column>
        </el-table>
      </main>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click="cancel">{{ $t('biz.btn.cancel') }}</el-button>
        <el-button type="primary" @click="confirmClick">{{ $t('biz.btn.save') }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import {
  confirmTip,
  notifySuccess
} from '@/utils/frame/base/notifyParams'
import { Notification } from 'element-ui'

export default {
  data() {
    return {
      size: 'mini',
      titleName: this.$t('dataHq.periodRate.title'),
      loading: false,
      tableDataPeriod: [],
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      },
      formData: {
        exchangeRateId: '',
        year: '',
        month: '',
        periodExchangeRate: ''
      },
      rules: {}
    }
  },
  props: ['param'],

  updated() {
    this.dataIsChange = true
  },

  mounted() {
    this.formData.year = new Date().getFullYear() + ''
    this.formData.exchangeRateId = this.param
    this.getEditData()
  },

  methods: {
    changeTime() {
      this.getEditData()
    },

    getTableDatePeriod(year) {
      for (var i = 1; i < 13; i++) {
        if (i < 10) {
          this.tableDataPeriod.push({
            year: year,
            exchangeRateId: this.param,
            month: '0' + i,
            periodExchangeRate: ''
          })
        } else {
          this.tableDataPeriod.push({
            year: year,
            exchangeRateId: this.param,
            month: i,
            periodExchangeRate: ''
          })
        }
      }
    },

    // 获取初始化数据
    getEditData() {
      this.func.funcOperation = this.$t('biz.btn.view')
      this.loading = true
      request({
        url: '/api/data/exchangeRate/getPeriodRate',
        method: 'POST',
        data: {
          data: this.formData,
          funcModule: this.func.funcModule,
          funcOperation: this.func.funcOperation
        }
      })
        .then(response => {
          this.tableDataPeriod = response.data
          this.loading = false
          if (this.tableDataPeriod != null && this.tableDataPeriod.length > 0) {
            for (var i = 0; i < 9; i++) {
              this.tableDataPeriod[i].month =
                '0' + this.tableDataPeriod[i].month
            }
          }

          if (this.tableDataPeriod.length === 0) {
            const pattern = /(\d{4})(\d{2})(\d{2}ss)/
            var temDate = new Date(
              this.formData.year.replace(pattern, '$1-$2-$3')
            )
            if (temDate) {
              this.getTableDatePeriod(temDate.getFullYear() + '')
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    confirmClick() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          this.$confirm(
            this.$t('biz.msg.confirmSave'),
            this.$t('biz.msg.tip'),
            {
              type: 'warning',
              closeOnClickModal: false,
              confirmButtonText: this.$t('biz.btn.confirm'),
              cancelButtonText: this.$t('biz.btn.cancel')
            }
          )
            .then(() => {
              this.func.funcOperation = this.$t('biz.btn.add')
              request({
                url: '/api/data/exchangeRate/periodRate',
                method: 'POST',
                data: {
                  data: this.tableDataPeriod,
                  funcModule: this.func.funcModule,
                  funcOperation: this.func.funcOperation
                }
              })
                .then(() => {
                  Notification(
                    notifySuccess({
                      msg: this.$t('biz.msg.insertSuccess')
                    })
                  )
                  this.hanldeCloseDialog()
                })
                .catch(() => {})
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },

    // 关闭弹窗
    hanldeCloseDialog(params) {
      this.$emit('closeHandler', params)
    },

    // 取消通用事件
    cancel() {
      // 若界面发生修改则关闭时提示
      if (this.dataIsChange) {
        confirmTip(this, 'confirmCancel')
          .then(() => {
            this.hanldeCloseDialog()
          })
          .catch(() => {})
      } else {
        this.hanldeCloseDialog()
      }
    }
  }
}
</script>
