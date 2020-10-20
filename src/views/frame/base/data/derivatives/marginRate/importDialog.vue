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
          <el-tab-pane :label="$t('dataHq.marginRate.marginInfo')" name="exposureInfo">
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='370'>
              <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
              <!-- 日期  -->
              <el-table-column align='center' prop='tradeDate' :label="$t('dataHq.marginRate.saveDate')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.saveDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <!--期货账号  -->
              <el-table-column align='left' prop='derivativeAccount' :label="$t('dataHq.marginRate.derivativeAccount')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 品种代码  -->
              <el-table-column align='left' prop='futuresVarietiesName' :label="$t('dataHq.marginRate.futuresVarietiesCode')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 合约代码  -->
              <el-table-column align='left' prop='contractCode' :label="$t('dataHq.marginRate.contractCode')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 多头按金额  -->
              <el-table-column align='right' prop='longMarginRatioByMoney' :label="$t('dataHq.marginRate.longMarginRatioByMoney')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.longMarginRatioByMoney | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 多头按手数  -->
              <el-table-column align='right' prop='rawQuantity' :label="$t('dataHq.marginRate.longMarginRatioByVolume')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.longMarginRatioByVolume | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 多头按金额  -->
              <el-table-column align='right' prop='startDate' :label="$t('dataHq.marginRate.shortMarginRatioByMoney')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.shortMarginRatioByMoney | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 多头按手数  -->
              <el-table-column align='right' prop='endDate' :label="$t('dataHq.marginRate.shortMarginRatioByVolume')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.shortMarginRatioByVolume | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <el-table-column prop='result' :label="$t('dataHq.marginRate.reason')" width='300'></el-table-column>
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
      return this.clientWidth > 1440 ? this.clientHeight - 500 : this.clientHeight - 520 // 防止底部滚动条遮挡
    },
    titleName() {
      return this.$t('dataHq.marginRate.importTitle')
    }
  },
  props: {
    data: [String, Array]
  },
  mounted() {
    this.initProductItem()
  },
  methods: {
    initProductItem() {
      request({
        url: '/api/sys/goodsCol/listAll',
        method: 'POST',
        data: {
          defaultSortString: 'columnName.asc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        }
      }).then(request => {
        request.data.forEach(e => {
          if (e.usingFlag === '0') {
            return
          }
          this.productItemInfo.push(e)
        })
      })
    },
    // 保存 向后台返回数据 返回true则把数据带到列表页面
    confirmClick() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('dataHq.marginRate.msg.tableIsEmpty')
          })
        )
        return
      }

      for (var i in this.tableData) {
        if (this.tableData[i].result) {
          this.$notify(
            notifyError({
              msg: '第' + (parseInt(i) + 1) + '条数据' + exposureData.result + ',无法保存!'
            })
          )
          return
        }
      }

      request({
        url: '/api/data/ddMarginRate/import',
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
        .catch(() => {})
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
            if (element['日期']) {
              element.saveDate = element['日期'].replace(RegExp('-', 'g'), '')
            }
            element.derivativeAccount = element['期货账号']
            element.futuresVarietiesName = element['品种代码']
            element.contractCode = element['合约代码']
            if (element['多头按金额']) {
              element.longMarginRatioByMoney = element['多头按金额'].trim()
            }
            if (element['多头按手数']) {
              element.longMarginRatioByVolume = element['多头按手数'].trim()
            }
            if (element['空头按金额']) {
              element.shortMarginRatioByMoney = element['空头按金额'].trim()
            }
            if (element['空头按手数']) {
              element.shortMarginRatioByVolume = element['空头按手数'].trim()
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
      if (!element.derivativeAccount) {
        element.result = '期货账号不能为空'
        return
      }
      if (!element.derivativeAccount) {
        element.result = '品种代码不能为空'
        return
      }
      if (!element.contractCode) {
        element.result = '合约代码不能为空'
        return
      }
      if (!element.longMarginRatioByMoney && !element.longMarginRatioByVolume) {
        element.result = '多头保证金率不能为空'
        return
      }
      if (element.longMarginRatioByMoney && element.longMarginRatioByVolume) {
        element.result = '多头保证金率按金额，按手数不能同时存在'
        return
      }
      if (!element.shortMarginRatioByMoney && !element.shortMarginRatioByVolume) {
        element.result = '空头保证金率不能为空'
        return
      }
      if (element.shortMarginRatioByMoney && element.shortMarginRatioByVolume) {
        element.result = '空头保证金率按金额，按手数不能同时存在'
        return
      }
    }
  }
}
</script>
