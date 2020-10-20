<template>
  <div v-el-drag-dialog class='dialog-wrapper' @closeDialog="hanldeCloseDialog">
    <div class='dialog-container' type='formTableDialog' style="width:400px">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="hanldeCloseDialog" />

      <!-- 内容 -->
      <header style='border-radius:5px;'>
        <el-form label-position="left" :inline="true" :model="formData" class='header-form-inline' ref='validateForm'>
          <el-row :gutter="0">
            <el-col :span="24">
              <el-form-item :label="$t('dataHq.accountPeriod.fiscalYear')" prop='yearAndMonth'>
                <el-date-picker @change="changeTime" v-model="formData.yearAndMonth" type="month" placeholder="" value-format="yyyyMMdd" format="yyyy-MM">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>

      <main>
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" style="border:1px solid;" :element-loading-text="$t('route.load')" :data="tableDataEvery" :height='400'>
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column :label="$t('dataHq.everyDayRate.exchangeRateDate')" width="160">
            <template slot-scope="scope">
              <el-date-picker size="mini" disabled v-model="scope.row.exchangeRateDate" type="date" placeholder="" value-format="yyyyMMdd" format="yyyy-MM-dd">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column :label="$t('dataHq.everyDayRate.exchangeRate')" align="center">
            <template slot-scope="scope">
              <input-formatter :size='size' v-model="scope.row.exchangeRate" :min='0' :max="9999999" :precision="3"></input-formatter>
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
import { confirmTip, notifySuccess } from '@/utils/frame/base/notifyParams'
import { dateFormate } from '@/utils/frame/base/index'
import { Notification } from 'element-ui'

export default {
  data() {
    return {
      size: 'mini',
      titleName: this.$t('dataHq.everyDayRate.title'),
      loading: false,
      dataIsChange: false,
      tableDataEvery: [],
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      },
      formData: {
        exchangeRateId: '',
        exchangeRateDate: '',
        exchangeRate: '',
        yearAndMonth: ''
      }
    }
  },
  props: ['param'],

  updated() {
    this.dataIsChange = true
  },

  mounted() {
    this.formData.yearAndMonth = dateFormate(new Date(), 'YYYYMMDD')
    this.formData.exchangeRateId = this.param
    this.getEditData()
  },

  methods: {
    changeTime() {
      this.getEditData()
    },

    getTableDateEvery(aDate) {
      const aYear = aDate.getFullYear()
      const aMonth = aDate.getMonth() + 1
      const new_date = new Date(aYear, aMonth, 0)
      var first_date = new Date(aYear, aDate.getMonth(), 1)
      // 这里传入的0代表获取上一个月的最后一天；如果传1，则获得当月的第一天；
      this.maxDay = new_date.getDate()
      for (var i = 0; i < this.maxDay; i++) {
        this.tableDataEvery.push({
          exchangeRateId: this.param,
          exchangeRateDate: dateFormate(
            new Date(
              first_date.setTime(first_date.getTime() + 24 * 60 * 60 * 1000 * i)
            ),
            'YYYYMMDD'
          ),
          exchangeRate: ''
        })
        first_date = new Date(aYear, aDate.getMonth(), 1)
      }
    },

    // 获取初始化数据
    getEditData() {
      this.func.funcOperation = this.$t('biz.btn.view')
      this.loading = true
      request({
        url: '/api/data/exchangeRate/getEveryDayRate',
        method: 'POST',
        data: {
          data: this.formData,
          funcModule: this.func.funcModule,
          funcOperation: this.func.funcOperation
        }
      })
        .then(response => {
          this.tableDataEvery = response.data
          this.loading = false
          if (this.tableDataEvery.length === 0) {
            const pattern = /(\d{4})(\d{2})(\d{2})/
            this.getTableDateEvery(
              new Date(this.formData.yearAndMonth.replace(pattern, '$1-$2-$3'))
            )
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
                url: '/api/data/exchangeRate/everyDayRate',
                method: 'POST',
                data: {
                  data: this.tableDataEvery,
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
