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

        <el-button v-db-click size="mini" v-if="!autoMatchFlag" @click="autoMatchFlag = true">
          <svg-icon icon-class="线性-自动匹配"></svg-icon>{{$t('biz.btn.autoMatch')}}
        </el-button>
        <el-button v-db-click size="mini" v-if="autoMatchFlag" @click="autoMatchFlag = false">
          <svg-icon icon-class="线性-返回"></svg-icon>{{$t('biz.btn.cancelMatch')}}
        </el-button>
        <el-button v-db-click size="mini" v-if="autoMatchFlag" @click="openDialog('1')">
          <svg-icon icon-class="线性-查看"></svg-icon>{{$t('biz.btn.byStrategy')}}
        </el-button>
        <el-button v-db-click size="mini" v-if="autoMatchFlag" @click="openDialog('0')">
          <svg-icon icon-class="线性-查看"></svg-icon>{{$t('biz.btn.byPlan')}}
        </el-button>
      </el-row>

      <main>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="$t('spotProj.exposure.tab.strategyPlanInfo')" name="strategyPlanInfo">
            <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="200" :element-loading-text="$t('route.load')" :data="detailTable">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column width="150" :label="$t('spotProj.exposure.list.planName')" prop="planName"></el-table-column>
              <el-table-column width="150" :label="$t('spotProj.exposure.list.planCode')" prop="planCode"></el-table-column>
              <el-table-column width="120" :label="$t('spotProj.exposure.list.productName')" prop="productName"></el-table-column>
              <el-table-column align='center' width="80" :label="$t('spotProj.exposure.list.direction')" prop="direction">
                <template slot-scope="scope">
                  <span>{{scope.row.direction | dataDictFormat($t('datadict.spotDirection'))}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeNameBottom" type="border-card">
          <el-tab-pane :label="$t('spotProj.exposure.tab.exposureInfo')" name="exposureInfo">
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='370'>
              <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
              <!-- 机构名称  -->
              <el-table-column align='left' prop='organName' :label="$t('spotProj.exposure.list.organName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 部门名称  -->
              <el-table-column align='left' prop='deptName' :label="$t('spotProj.exposure.list.deptName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 客户名称  -->
              <el-table-column align='left' prop='customerName' :label="$t('spotProj.exposure.list.customerName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 日期  -->
              <el-table-column align='center' prop='tradeDate' :label="$t('spotProj.exposure.list.tradeDate')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.tradeDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 币种  -->
              <el-table-column align='left' prop='currencyName' :label="$t('spotProj.exposure.list.currencyName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 方向  -->
              <el-table-column align='center' prop='direction' :label="$t('spotProj.exposure.list.direction')" width='80' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.direction | dataDictFormat($t('datadict.spotDirection'))}}</span>
                </template>
              </el-table-column>
              <!-- 定价方式  -->
              <el-table-column align='center' prop='pricieType' :label="$t('spotProj.exposure.list.priceType')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.pricieType | dataDictFormat($t('datadict.priceType'))}}</span>
                </template>
              </el-table-column>
              <!-- 敞口类型  -->
              <el-table-column align='center' prop='exposureType' :label="$t('spotProj.exposure.list.exposureType')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.exposureType | dataDictFormat($t('datadict.exposureType'))}}</span>
                </template>
              </el-table-column>
              <!-- 合同号  -->
              <el-table-column align='left' prop='contractNo' :label="$t('spotProj.exposure.list.contractNo')" width='120' show-overflow-tooltip></el-table-column>
              <!-- 单据号  -->
              <el-table-column align='left' prop='documentNo' :label="$t('spotProj.exposure.list.documentNo')" width='120' show-overflow-tooltip></el-table-column>
              <!-- 商品名称  -->
              <el-table-column align='left' prop='productName' :label="$t('spotProj.exposure.list.productName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 仓库名称  -->
              <el-table-column align='left' prop='warehouseName' :label="$t('spotProj.exposure.list.warehouseName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 单据数量  -->
              <el-table-column align='right' prop='documentQuantity' :label="$t('spotProj.exposure.list.documentQuantity')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.documentQuantity | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 固有敞口  -->
              <el-table-column align='right' prop='rawQuantity' :label="$t('spotProj.exposure.list.rawQuantity')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.rawQuantity | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 开始日期  -->
              <el-table-column align='center' prop='startDate' :label="$t('spotProj.exposure.list.startDate')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.startDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 结束日期  -->
              <el-table-column align='center' prop='endDate' :label="$t('spotProj.exposure.list.endDate')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.endDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <!-- 价格项  -->
              <el-table-column align='left' prop='priceItemName' :label="$t('spotProj.exposure.list.priceItemName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 估值基准  -->
              <el-table-column align='left' prop='valuationName' :label="$t('spotProj.exposure.list.valuationName')" min-width='100' show-overflow-tooltip></el-table-column>
              <!-- 汇率  -->
              <el-table-column align='right' prop='avgPrice' :label="$t('spotProj.exposure.list.exchangeRate')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.exchangeRate | priceFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 均价  -->
              <el-table-column align='right' prop='avgPrice' :label="$t('spotProj.exposure.list.avgPrice')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.avgPrice | priceFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 升贴水  -->
              <el-table-column align='right' prop='premium' :label="$t('spotProj.exposure.list.premium')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.premium | priceFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 件数  -->
              <el-table-column align='right' prop='sets' :label="$t('spotProj.exposure.list.sets')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.sets | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 每件数量  -->
              <el-table-column align='right' prop='setQuantity' :label="$t('spotProj.exposure.list.setQuantity')" width='100' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.setQuantity | quantityFilter | thousands}}</span>
                </template>
              </el-table-column>
              <!-- 市场名称  -->
              <el-table-column align='left' prop='marketName' :label="$t('spotProj.exposure.list.marketName')" width='100' show-overflow-tooltip></el-table-column>
              <!-- 计量单位代码  -->
              <el-table-column align='left' prop='unitCode' :label="$t('spotProj.exposure.list.unitCode')" width='90' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <span>{{scope.row.exposureType | dataDictFormat($t('datadict.measurementUnit'))}}</span>
                </template>
              </el-table-column>
              <!-- 属性组  -->
              <!-- <el-table-column align='left' prop='attrValue' :label="$t('spotProj.exposure.list.attrValue')" width='200' show-overflow-tooltip></el-table-column> -->
              <!-- 期初标志  -->
              <el-table-column align='center' prop='virtualFlag' :label="$t('spotProj.exposure.list.virtualFlag')" width='80' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <el-checkbox v-model="scope.row.virtualFlag" :disabled="true"></el-checkbox>
                </template>
              </el-table-column>
              <!-- 期初标志  -->
              <el-table-column align='center' prop='proliminaryFlag' :label="$t('spotProj.exposure.list.proliminaryFlag')" width='80' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <el-checkbox v-model="scope.row.proliminaryFlag" :disabled="true"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column width="120" :label="item.columnTxt" :key="item.id" v-for="item in productItemInfo">
                <template slot-scope='scope'>
                  {{scope.row[item.columnName]}}
                </template>
              </el-table-column>
              <el-table-column prop='result' :label="$t('spotProj.exposure.list.reason')" width='300'></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </main>
    </div>
    <strategyPlanDialog v-if="dialogVisible" :virtualFlag="virtualFlag" @close="dialogClose" @confirm="confirm"></strategyPlanDialog>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo, notifyError, notifySuccess } from '@/utils/frame/base/notifyParams'
import { numFormat } from '@/utils/frame/base/validate'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import request from '@/utils/frame/base/request'
import strategyPlanDialog from '@/views/proj/spot/spotExopsure/components/strategyPlanDialog'

export default {
  name: '',
  components: {
    UploadExcelComponent,
    strategyPlanDialog
  },
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      tableData: [],
      detailTable: [],
      loading: false,
      currentRow: null,
      autoMatchFlag: false,
      virtualFlag: '',
      dialogVisible: false,
      activeName: 'strategyPlanInfo',
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
      return this.$t('spotProj.exposure.form.import')
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
      if (this.autoMatchFlag) {
        if (!this.detailTable || this.detailTable.length === 0) {
          this.$notify(
            notifyError({
              msg: this.$t('spotProj.exposure.msg.detailListIsNull')
            })
          )
          return
        }
      }

      if (!this.tableData || this.tableData.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('spotProj.exposure.msg.exposureIsEmpty')
          })
        )
        return
      }

      for (var i in this.tableData) {
        var exposureData = this.tableData[i]
        if (exposureData.proliminaryFlag) {
          exposureData.preliminaryFlag = '1'
        } else {
          exposureData.preliminaryFlag = '0'
        }
        if (exposureData.virtualFlag) {
          exposureData.virtualFlag = '1'
        } else {
          exposureData.virtualFlag = '0'
        }
        if (this.autoMatchFlag) {
          exposureData.planDetailId = this.detailTable[0].id
          exposureData.planCode = this.detailTable[0].planCode
        }

        if (exposureData.result) {
          this.$notify(
            notifyError({
              msg: '第' + (parseInt(i) + 1) + '条数据' + exposureData.result + ',无法保存!'
            })
          )
          return
        }
      }

      request({
        url: '/api/spot/strgExposure/importSave',
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
            obj.moduleCode = this.moduleCode
            if (element['日期']) {
              element.tradeDate = element['日期'].replace(RegExp('-', 'g'), '')
            }
            element.documentNo = element['敞口号']
            element.direction = numFormat(element['方向'], this.$t('datadict.spotDirection'))
            element.contractNo = element['合同号']
            element.organName = element['机构']
            element.deptName = element['部门']
            element.customerName = element['客户名称']
            element.productName = element['品名']
            element.warehouseName = element['仓库']
            element.marketName = element['市场']
            element.priceItemName = element['定价基准']
            element.valuationName = element['估值基准']
            if (element['汇率']) {
              element.exchangeRate = element['汇率'].trim()
            }
            if (element['单价']) {
              element.avgPrice = element['单价'].trim()
            }
            if (element['升贴水']) {
              element.premium = element['升贴水'].trim()
            }
            if (element['单据数量']) {
              element.documentQuantity = element['单据数量'].trim()
            }
            if (element['敞口类型']) {
              element.exposureType = numFormat(element['敞口类型'], this.$t('datadict.exposureType'))
            }
            if (element['件数']) {
              element.sets = element['件数'].trim()
            }
            if (element['每件数量']) {
              element.setQuantity = element['每件数量'].trim()
            }
            if (element['定价方式']) {
              element.pricieType = numFormat(element['定价方式'], this.$t('datadict.priceType'))
            }
            if (element['敞口数量']) {
              element.rawQuantity = element['敞口数量'].trim()
            }
            if (element['单位']) {
              element.unitCode = numFormat(element['单位'], this.$t('datadict.measurementUnit'))
            }
            if (element['定价开始日期']) {
              element.startDate = element['定价开始日期'].replace(RegExp('-', 'g'), '')
            }
            if (element['定价结束日期']) {
              element.endDate = element['定价结束日期'].replace(RegExp('-', 'g'), '')
            }
            element.currencyName = element['币种']
            if (element['是否期初'] === 'Y') {
              element.proliminaryFlag = true
            } else {
              element.proliminaryFlag = false
            }
            if (element['虚拟购销'] === 'Y') {
              element.virtualFlag = true
            } else {
              element.virtualFlag = false
            }
            element.attrValue = element['属性组']
            this.productItemInfo.forEach(e => {
              element[e.columnName] = element[e.columnTxt]
            })
            this.validate(element)
            this.documentNos[element.documentNo] = element.documentNo
          })

          this.tableData = results
        }
      }
    },
    validate(element) {
      if (this.documentNos[element.documentNo]) {
        element.result = '单据编号重复'
        return
      }
      if (!element.contractNo) {
        element.result = '合同号不能为空'
        return
      }
      if (!element.tradeDate) {
        element.result = '日期不能为空'
        return
      }
      if (!element.documentNo) {
        element.result = '敞口号不能为空'
        return
      }
      if (!element.direction) {
        element.result = '方向不能为空'
        return
      }
      if (!element.organName) {
        element.result = '机构名称不能为空'
        return
      }
      if (!element.deptName) {
        element.result = '部门名称不能为空'
        return
      }
      if (!element.customerName) {
        element.result = '客户名称不能为空'
        return
      }
      if (!element.productName) {
        element.result = '商品名称不能为空'
        return
      }
      if (!element.documentQuantity) {
        element.result = '单据数量不能为空'
        return
      }
      if (!element.exposureType) {
        element.result = '敞口类型不能为空'
        return
      }
      if (!element.pricieType) {
        element.result = '价格类型不能为空'
        return
      }
      if (!element.startDate) {
        element.result = '开始日期不能为空'
        return
      }
      if (element['定价方式'] === '月均价') {
        if (!element.endDate) {
          element.result = '结束日期不能为空'
          return
        }
        if (!element.priceItemName) {
          element.result = '定价基准不能为空'
          return
        }
      }
      if (!element.exchangeRate) {
        element.result = '汇率不能为空'
        return
      }
      if (!element.currencyName) {
        element.result = '币种名称不能为空'
        return
      }
      if (!element.unitCode) {
        element.result = '单位不能为空'
        return
      }
      if (!element.valuationName) {
        element.result = '估值基准不能为空'
      }
    },
    openDialog(virtualFlag) {
      this.virtualFlag = virtualFlag
      this.dialogVisible = true
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(val) {
      this.detailTable = []
      this.detailTable.push(val)
      this.dialogVisible = false
    }
  }
}
</script>
