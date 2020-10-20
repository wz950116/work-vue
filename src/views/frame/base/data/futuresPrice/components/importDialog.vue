<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '1000px' : '1150px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <!-- 顶部按钮 -->
      <el-row class='top-operate'>
        <el-button v-db-click size="mini" @click="cancel">
          <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
        </el-button>
        <el-button v-db-click size="mini" @click="confirmClick">
          <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
        </el-button>
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('biz.btn.exportData')" />
      </el-row>

      <main>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="$t('data.futuresPrice.tab.futuresPriceInfo')" name="futuresPriceInfo">
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='370'>
              <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
              <!-- 合约  -->
              <el-table-column align='left' prop='contractCode' :label="$t('data.futuresPrice.list.contractCode')" width='120' show-overflow-tooltip></el-table-column>
              <!-- 日期  -->
              <el-table-column align='left' prop='saveDate' :label="$t('data.futuresPrice.list.saveDate')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.saveDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 结算价  -->
              <el-table-column align='left' prop='settlementPrice' :label="$t('data.futuresPrice.list.settlementPrice')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.settlementPrice | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 收盘价  -->
              <el-table-column align='left' prop='lastPrice' :label="$t('data.futuresPrice.list.lastPrice')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.lastPrice | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 最高价  -->
              <el-table-column align='left' prop='highestPrice' :label="$t('data.futuresPrice.list.highestPrice')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.highestPrice | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 最低价  -->
              <el-table-column align='left' prop='lowestPrice' :label="$t('data.futuresPrice.list.lowestPrice')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.lowestPrice | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 开盘价  -->
              <el-table-column align='left' prop='lowestPrice' :label="$t('data.futuresPrice.list.openPrice')" width='120' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.openPrice | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <el-table-column prop='result' :label="$t('data.futuresPrice.list.reason')" width='120'></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </main>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  notifyInfo,
  notifyError,
  notifySuccess
} from '@/utils/frame/base/notifyParams'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import request from '@/utils/frame/base/request'

export default {
  name: '',
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      tableData: [],
      loading: false,
      currentRow: null,
      activeName: 'futuresPriceInfo'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440
        ? this.clientHeight - 500
        : this.clientHeight - 520 // 防止底部滚动条遮挡
    },
    titleName() {
      return this.$t('data.futuresPrice.dialog.import')
    }
  },
  methods: {
    // 保存 向后台返回数据 返回true则把数据带到列表页面
    confirmClick() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('data.futuresPrice.dialog.futuresPriceIsEmply')
          })
        )
        return
      }

      for (var i in this.tableData) {
        var exposureData = this.tableData[i]

        if (exposureData.result) {
          this.$notify(
            notifyError({
              msg:
                '第' +
                (parseInt(i) + 1) +
                '条数据' +
                exposureData.result +
                ',无法保存!'
            })
          )
          return
        }
      }

      request({
        url: '/api/data/ddFuturesPrice/importSave',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.tableData
        }
      }).then(request => {
        this.$notify(
          notifySuccess({
            msg: this.$t('spotProj.exposure.msg.importSuccess')
          })
        )
        this.$emit('close')
      })
    },
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.$emit('close')
        })
        .catch(() => { })
    },
    // 文件校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 文件上传
    handleSuccess({ results, header }) {
      if (results) {
        this.pageLoading = true
        // 导入的数据不能为空
        if (results.length === 0) {
          this.showDialog = false
          this.$notify(
            notifyInfo({
              msg: this.$t('导入的文件数据为空!')
            })
          )
        } else {
          this.documentNos = {}
          results.forEach(element => {
            const obj = {}
            obj.moduleCode = this.moduleCode
            if (element['日期']) {
              element.saveDate = element['日期'].replace(RegExp('-', 'g'), '')
            }
            element.contractCode = element['合约代码']
            if (element['结算价']) {
              element.settlementPrice = element['结算价'].trim()
            }
            if (element['收盘价']) {
              element.lastPrice = element['收盘价'].trim()
            }
            if (element['最高价']) {
              element.highestPrice = element['最高价'].trim()
            }
            if (element['最低价']) {
              element.lowestPrice = element['最低价'].trim()
            }
            if (element['开盘价']) {
              element.openPrice = element['开盘价'].trim()
            }
            this.validate(element)
          })

          this.tableData = results
        }
      }
    },
    validate(element) {
      if (!element.saveDate) {
        element.result = '日期不能为空'
        return
      }
      if (!element.contractCode) {
        element.result = '合约代码不能为空'
        return
      }
      if (!element.lastPrice) {
        element.result = '收盘价不能为空'
        return
      }
      if (!element.settlementPrice) {
        element.result = '结算价不能为空'
        return
      }
    }
  }
}
</script>
