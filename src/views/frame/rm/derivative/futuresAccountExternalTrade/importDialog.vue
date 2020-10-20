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
        <el-button type="primary" v-db-click size="mini" @click="confirmClick">
          <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
        </el-button>
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('biz.btn.exportData')" />
        <el-button v-db-click size="mini" v-if="autoMatchFlag" @click="autoMatchFlag = false">
          <svg-icon icon-class="线性-返回"></svg-icon>{{$t('biz.btn.cancelMatch')}}
        </el-button>
      </el-row>

      <main>
        <el-tabs v-model="activeNameBottom" type="border-card">
          <el-tab-pane :label="$t('derivative.externalTrade.tabTitle')" name="exposureInfo">
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='370'>
              <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
              <!-- 日期  -->
              <el-table-column align='center' prop='tradingDay' :label="$t('derivative.externalTrade.tradingDay')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.tradingDay | dateFormat}}</span>
                </template>
              </el-table-column>
              <!--期货账号  -->
              <el-table-column align='left' prop='derivativeAccount' :label="$t('derivative.externalTrade.derivativeAccount')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 合约代码  -->
              <el-table-column align='left' prop='futuresContractCode' :label="$t('derivative.externalTrade.futuresContractCode')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 成交单号  -->
              <el-table-column align='left' v-if="!getBillNoRequired()" prop='tradeId' :label="$t('derivative.externalTrade.tradeId')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 方向  -->
              <el-table-column align='left' prop='direction' :label="$t('derivative.externalTrade.direction')" width='100' show-overflow-tooltip>
                <template slot-scope="scope">
                  <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
                </template>
              </el-table-column>
              <!-- 多头按金额  -->
              <el-table-column align='right' prop='price' :label="$t('derivative.externalTrade.price')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.price | priceFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 多头按手数  -->
              <el-table-column align='right' prop='volume' :label="$t('derivative.externalTrade.volume')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.volume | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 多头按金额  -->
              <el-table-column align='right' prop='commission' :label="$t('derivative.externalTrade.commission')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.commission | priceFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 多头按手数  -->
              <el-table-column align='right' prop='adjustFee' :label="$t('derivative.externalTrade.adjustFee')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.adjustFee | priceFilter | thousands}}</span>
                </template>
              </el-table-column>
              <el-table-column align='center' prop='expireDate' :label="$t('derivative.externalTrade.expireDate')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.expireDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 是否期初  -->
              <el-table-column align='center' prop='preliminaryFlag' :label="$t('derivative.externalTrade.preliminaryFlag')" width='100' show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.preliminaryFlag" :disabled="true"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column align='left' prop='remark' :label="$t('derivative.externalTrade.remark')" width='200' show-overflow-tooltip></el-table-column>
              <el-table-column prop='result' :label="$t('derivative.externalTrade.reason')" width='300'></el-table-column>
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
import { notifyInfo, notifyError, notifySuccess } from '@/utils/frame/base/notifyParams'
import { numFormat } from '@/utils/frame/base/validate'
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
      autoMatchFlag: false,
      virtualFlag: '',
      activeNameBottom: 'exposureInfo',
      productItemInfo: [],
      listQuery: {
        data: {},
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.save')
      }
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
      return this.$t('derivative.externalTrade.importDialg')
    }
  },
  props: {
    data: [String, Array]
  },
  mounted() {
  },
  methods: {
    getBillNoRequired() {
      return this.$route.meta.seqMode === '0'
    },
    // 保存 向后台返回数据 返回true则把数据带到列表页面
    confirmClick() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('derivative.externalTrade.msg.tableIsEmpty')
          })
        )
        return
      }

      for (var i in this.tableData) {
        if (this.tableData[i].result) {
          this.$notify(
            notifyError({
              msg:
                '第' +
                (parseInt(i) + 1) +
                '条数据' +
                this.tableData[i].result +
                ',无法保存!'
            })
          )
          return
        }
      }

      request({
        url: '/api/dvt/externalTrade/import',
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
      }).then(() => {
        this.$emit('close')
      }).catch(() => { })
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
            if (element['交易日期']) {
              element.tradingDay = element['交易日期'].replace(RegExp('-', 'g'), '')
            }
            element.derivativeAccount = element['期货账号']
            element.futuresContractCode = element['期货合约']
            element.tradeId = element['成交单号']
            element.direction = numFormat(
              element['方向'],
              this.$t('datadict.futuresDirection')
            )
            if (element['价格']) {
              element.price = element['价格'].trim()
            }
            if (element['手数']) {
              element.volume = element['手数'].trim()
            }
            if (element['手续费']) {
              element.commission = element['手续费'].trim()
            }
            if (element['调期费']) {
              element.adjustFee = element['调期费'].trim()
            }
            if (element['头寸到期日']) {
              element.expireDate = element['头寸到期日'].replace(RegExp('-', 'g'), '')
            }
            if (element['是否期初'] === 'Y') {
              element.preliminaryFlag = true
            } else {
              element.preliminaryFlag = false
            }
            element.remark = element['备注']
            this.validate(element)
          })

          this.tableData = results
        }
      }
    },
    validate(element) {
      if (!element.tradingDay) {
        element.result = '交易日期不能为空'
        return
      }
      if (!element.derivativeAccount) {
        element.result = '期货账号不能为空'
        return
      }
      if (!element.futuresContractCode) {
        element.result = '期货合约不能为空'
        return
      }
      if (!this.getBillNoRequired() && !element.tradeId) {
        element.result = '成交单号不能为空'
        return
      }
      if (!element.direction) {
        element.result = '方向不能为空'
        return
      }
      if (!element.price) {
        element.result = '价格不能为空'
        return
      }
      if (!element.volume) {
        element.result = '手数不能为空'
        return
      }
    }
  }
}
</script>
