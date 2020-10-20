<template>
  <div class="app-container edit-page-style">
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" @click='close' style='margin-right:6px;' v-if="type ==='view'" type='primary'>
        <svg-icon icon-class="线性-关闭"></svg-icon>{{this.$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" @click='cancel' style='margin-right:6px;' v-if="type!=='view'">
        <svg-icon icon-class="线性-取消"></svg-icon>{{this.$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" @click='saveEdit' style='margin-right:6px;' type='primary' :disabled="isShowBtn" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-保存"></svg-icon>{{this.$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" @click='chooseExport' style='margin-right:6px;' v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-导出"></svg-icon>{{this.$t('derivative.btn.chooseExportBtn')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' v-if="['add', 'update'].includes(type)">
        <a :href="tempExcelPath" download="期货账号数据调整数据导出.xlsx">
          <svg-icon icon-class="线性-下载"></svg-icon>{{this.$t('derivative.btn.ExportBtn')}}
        </a>
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="audit" v-if="['assist', 'audit'].includes(type)" type='primary'>
        <svg-icon icon-class="线性-审核"></svg-icon>{{$t('biz.btn.audit')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="auditHistory" v-if="['assist', 'audit'].includes(type)">
        <svg-icon icon-class="线性-全选"></svg-icon>{{$t('biz.btn.auditHistory')}}
      </el-button>
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('biz.btn.chooseFile')" v-if="['add', 'update'].includes(type)" />
    </el-row>

    <!-- 头部查询 -->
    <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.mainInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :rules='rules' :model="formData" class="header-form-inline" label-position="left" ref="refForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountAdjust.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :picker-options="pickerSignDateBefore" :placeholder="$t('biz.placeholder.dateInput')" disabled></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountAdjust.documentNo')" prop='documentNo'>
              <input-validate v-model="formData.documentNo" :placeholder="$t('biz.placeholder.input')" :disabled='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountAdjust.derivativeAccount')" prop='derivativeAccount'>
              <base-select v-model="formData.derivativeAccount" :attrs="{data: 'DERIVATIVE_ACCOUNT',params:{usingFlag: '1' , derivativeCategory: '1,2'}}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresAccountAdjust.makeUserName')" prop='makeUserName'>
              <!-- <tree-staff v-model="formData.makeUserName" :multiple="false" :placeholder="$t('biz.placeholder.input')" :disabled='true'>
              </tree-staff> -->
              <input-validate v-model="formData.makeUserName" :placeholder="$t('biz.placeholder.input')" :disabled='true'></input-validate>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <!-- 列表内容 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('derivative.futuresAccountAdjust.listDetail')" name="listDetails" v-if="type !=='view'">
          <futures-account-tab :detailDatas='listDetail' :adjustTypes='type' :useType='useType' :disabled='type === "view"'></futures-account-tab>
        </el-tab-pane>
        <el-tab-pane :label="$t('derivative.futuresAccountAdjust.listDetailBefore')" name="listDetailBefore" v-if="type ==='view'">
          <futures-account-tab :detailDatas='listDetailBefore' :adjustTypes='type' :useType='useType' :disabled='type === "view"'></futures-account-tab>
        </el-tab-pane>
        <el-tab-pane :label="$t('derivative.futuresAccountAdjust.listDetailAfter')" name="listDetailAfter" v-if="type ==='view'">
          <futures-account-tab :detailDatas='listDetailAfter' :adjustTypes='type' :useType='useType' :disabled='type === "view"'></futures-account-tab>
        </el-tab-pane>

        <!-- 调整原因 -->
        <el-tab-pane :label="$t('derivative.futuresAccountAdjust.adjustReason')" name="adjustReason">
          <futures-adj-reason-tab v-model="formData.adjustReason" ref='adjustReason' :id='formData.id' :disabled='type === "view"'></futures-adj-reason-tab>
        </el-tab-pane>
      </el-tabs>
    </main>
    <!-- 弹窗 -->
    <edit-dialog v-el-drag-dialog v-if='dialogVisible' @close='closeDialog' @closeHandlerDialog='closeHandlerDialog' :useType='useType' :myDetailData='formData.derivativeAccount'></edit-dialog>

    <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='param' :opType="type" :opMode='"route"'></view-form-edit>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils/frame/base/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import elementFun from '@/utils/frame/base/elementFun'
import editDialog from '@/views/frame/rm/derivative/components/adjustDialog'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import * as futuresAccountAdjust from '@/api/frame/rm/derivative/futuresAccountAdjust'
import {
  datatime, // 转换为hhmmss,不够两位补零
  numFormat, // 上传文件转换为字典码表key值
  toDateFromString, // 验证时间是否有效
  verifyNamber, // 验证是数字
  verifyTime // 验证时间格式
} from '@/utils/frame/base/validate'
// 标签页
// import TreeStaff from '@/views/frame/base/fun/components/TreeStaff' // 制单人
import futuresAdjReasonTab from '@/views/frame/rm/derivative/components/FuturesAdjReasonTab' // 调整原因
import futuresAccountTab from '@/views/frame/rm/derivative/components/FuturesAccountTab' // 调整明细

import excel_DvtFutureAdj from '@/assets/frame/excel/dvt/DvtFutureAdj.xlsx'
import Vue from 'vue'

// 导入用户api
import { getInfo } from '@/api/frame/login'
export default {
  name: 'futuresAccountAdjustEdit',
  data() {
    return {
      mainInfoVisible: true,
      dialogLv2Visible: false,
      type: this.$route.params.type || this.$route.params.opType,
      param: this.$route.params,
      tempExcelPath: excel_DvtFutureAdj,
      activeName: 'listDetails',
      useType: 'accountAdjust',
      loading: false,
      id: '',
      isShowBtn: false,
      isPage: true,
      disabled: true,
      derAccountAdjustNo: [],
      newDataList: [],
      dialogVisible: false,
      nextUserDialogVisible: false,
      bpmProcessDefineKey: 'CTRMApproveDvtAdjAuditFuture',
      isShow: true, // 是否显示取消按钮
      listDetail: [],
      listDetailBefore: [],
      listDetailAfter: [],
      formData: {
        optType: this.$route.params.type,
        makeDate: '',
        derivativeAccount: '',
        documentNo: '',
        makeUserName: '',
        versionNum: '',
        id: '',
        adjustReason: ''
      },
      rules: {
        derivativeAccount: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ]
      },
      pickerSignDateBefore: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      }
    }
  },
  watch: {
    'formData.derivativeAccount'(val, oldv) {
      this.oldval = oldv
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1355
        ? this.clientHeight - 370
        : this.clientHeight - 390 // 防止底部滚动条遮挡
    }
  },
  filters: {},
  components: {
    UploadExcelComponent,
    editDialog,
    // TreeStaff,
    futuresAccountTab,
    futuresAdjReasonTab
  },
  mounted() {
    if (this.type === 'view') {
      this.activeName = 'listDetailBefore'
      this.rules = {}
    } else if (this.type === 'add') {
      this.isShowBtn = true
      // // 生成调整单号
      // futuresAccountAdjust
      //   .genAdjustNo()
      //   .then(response => {
      //     this.formData.documentNo = response.data
      //   })
      //   .catch(() => { })
    }
    // 渲染表格数据
    this.getEditData()
  },

  methods: {
    ...elementFun,
    download() {
      const url = this.tempExcelPath
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '期货账号数据调整单导入模板.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    // 切换期货账号
    AccountHandler(newVal) {
      if (this.listDetail.length !== 0) {
        //   // 切换期货账号后，将会清空调整单明细，是否继续？
        this.$confirm(
          this.$t('derivative.msg.AccountHandler'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            // 清空调整单明细
            this.listDetail = []
            this.$refs.mySelect.handleClose()
          })
          .catch(() => {
            this.formData.derivativeAccount = this.oldval
            this.$refs.mySelect.handleClose()
          })
      }
    },
    //  查询期货账号列表
    // 获取初始化数据
    getEditData() {
      if (this.type === 'add') {
        this.formData.makeDate = parseTime(new Date(), '{y}{m}{d}')
        getInfo().then(res => {
          this.formData.makeUserName = res.data.name
        })
      } else if (this.type === 'update' || this.type === 'audit') {
        const params = {
          data: this.$route.params.uk,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.update')
        }
        futuresAccountAdjust
          .get(params)
          .then(response => {
            this.formData = response.data.baseInfo
            this.listDetail = response.data.newDataList
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        const params = {
          data: this.$route.params.uk,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view')
        }
        futuresAccountAdjust
          .getView(params)
          .then(response => {
            this.formData = response.data.baseInfo
            this.listDetailBefore = response.data.oldDataList
            this.listDetailAfter = response.data.newDataList
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 按钮1：选择数据导出
    chooseExport() {
      if (
        this.formData.derivativeAccount === '' ||
        this.formData.derivativeAccount === undefined
      ) {
        this.$notify(
          notifyInfo({
            msg: '请先选择期货账号'
          })
        )
        return
      } else {
        this.dialogVisible = true
      }
    },
    // 按钮1：弹框关闭，回填
    closeHandlerDialog(list) {
      if (list) {
        this.dialogVisible = false
        var dataId = []
        list.forEach(element => {
          dataId.push(element.id)
        })
        futuresAccountAdjust.downloadTrade({ data: dataId }).then(res => {
          this.filePath = res.data
          this.download('期货账号数据调整数据导出.xlsx', this.filePath)
        })
      }
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
      if (header.length !== 17) {
        this.$notify.error({
          title: '错误',
          message: '导入模板错误',
          position: 'bottom-right'
        })
        return
      }
      this.listDetail = []
      if (this.formData.derivativeAccount === '') {
        this.$notify(
          notifyInfo({
            msg: '请选择期货账号'
          })
        )
        return
      }
      if (results.length === 0) {
        this.$notify(
          notifyInfo({
            msg: '上传的Excel中没有数据'
          })
        )
        return
      }
      if (results) {
        this.isShowBtn = false
        results.forEach((element, indexs) => {
          const obj = {}
          for (var j in element) {
            element[j] = element[j].trim()
            if (element[j].indexOf(',') !== -1) {
              element[j] = element[j].replace(/,/g, '')
            }
          }
          obj.adjustType = element['调整类型'] || ''
          obj.tradingDay = element['交易日期'] || ''
          obj.derivativeAccount = element['期货账号'] || ''
          obj.futuresContractCode = element['合约'] || ''
          obj.tradeId = element['成交单号'] || ''
          obj.direction = element['方向'] || ''
          obj.offsetFlag = element['开/平'] || '' || ''
          obj.price = element['价格'] || ''
          obj.volume = element['数量'] || ''
          obj.amount = element['成交金额'] || ''
          obj.commission = element['手续费'] || ''
          obj.tradeTime = element['成交时间'] || ''
          obj.tradeDate = element['成交日期'] || ''
          obj.hedgeFlag = element['投机/套保'] || ''
          obj.orderSysId = element['委托单号'] || ''
          obj.mainName = element['客户名称'] || ''
          obj.dataSourceType = element['数据来源'] || ''
          obj.checkResult = ''
          obj.tradeDate = parseTime(obj.tradeDate, '{y}{m}{d}')
          obj.tradingDay = parseTime(obj.tradingDay, '{y}{m}{d}')
          // 调整类型
          obj.adjustType = numFormat(
            obj.adjustType,
            this.$t('datadict.dvtAdjustType')
          )
          // 方向
          obj.direction = numFormat(
            obj.direction,
            this.$t('datadict.futuresDirection')
          )
          // 开平
          obj.offsetFlag = numFormat(
            obj.offsetFlag,
            this.$t('datadict.derivativeOffsetShort')
          )
          // 投机套保
          obj.hedgeFlag = numFormat(
            obj.hedgeFlag,
            this.$t('datadict.futureHedgeType')
          )
          // 数据来源
          obj.dataSourceType = numFormat(
            obj.dataSourceType,
            this.$t('datadict.futureDataSourceType')
          )
          for (var i in obj) {
            const ele = obj[i]
            // 必须输入
            if (
              i !== 'checkResult' &&
              i !== 'orderSysId' &&
              i !== 'mainName' &&
              (ele === undefined || ele === '')
            ) {
              obj.checkResult +=
                this.$t('derivative.futuresAccountAdjust.' + i) +
                '必须输入' +
                ','
            }
            if (
              (i === 'price' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'volume' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'amount' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'commission' && ele !== '' && !verifyNamber(ele))
            ) {
              obj.checkResult +=
                this.$t('derivative.futuresAccountAdjust.' + i) +
                '必须是数字' +
                ','
            }
            if (i === 'volume' && ele !== '') {
              if (ele % 1 !== 0) {
                obj.checkResult +=
                  this.$t('derivative.futuresAccountAdjust.' + i) +
                  '必须是整数' +
                  ','
              } else {
                obj.volume = parseFloat(ele).toString()
              }
            }
            //   // 判断日期
            if (
              (i === 'tradeDate' && ele !== '') ||
              (i === 'tradingDay' && ele !== '')
            ) {
              if (!toDateFromString(ele)) {
                obj.checkResult +=
                  this.$t('derivative.futuresAccountAdjust.' + i) +
                  '不是有效的日期' +
                  ','
              }
            }
            //   // 判断时间
            if (i === 'tradeTime' && ele !== '') {
              if (!verifyTime(ele)) {
                obj.tradeTime = ''
                obj.checkResult +=
                  this.$t('derivative.futuresAccountImport.' + i) +
                  '时间格式不正确' +
                  ','
              } else {
                obj.tradeTime = datatime(ele)
              }
            }

            if (
              (i === 'adjustType' &&
                ele !== '' &&
                (ele !== 'A' && ele !== 'D' && ele !== 'U' && ele !== 'O')) ||
              (i === 'direction' &&
                ele !== '' &&
                (ele !== '2' && ele !== '1')) ||
              (i === 'offsetFlag' &&
                ele !== '' &&
                (ele !== '0' && ele !== '1')) ||
              (i === 'hedgeFlag' && ele !== '' && (ele !== '1' && ele !== '3'))
            ) {
              obj.checkResult +=
                this.$t('derivative.futuresAccountAdjust.' + i) +
                '的值不正确' +
                ','
            }
            var accounts = this.formData.derivativeAccount
            if (i === 'derivativeAccount' && ele !== '') {
              if (ele !== accounts) {
                obj.checkResult +=
                  '只可以输入期货账号为 ' + accounts + '的成交明细' + ','
              }
            }
          }
          this.listDetail.push(obj)
        })
        if (this.listDetail.length !== 0) {
          this.listDetail.forEach((t, i) => {
            if (t.checkResult !== '' && t.checkResult !== undefined) {
              // 打开保存按钮
              this.isShowBtn = true
            }
          })
        }
      }
    },
    // 保存
    saveEdit() {
      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          var postData = {
            baseInfo: this.formData,
            newDataList: this.listDetail,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
          }

          if (this.type === 'update') {
            futuresAccountAdjust
              .update({ data: postData })
              .then(response => {
                this.$store
                  .dispatch('delVisitedViews', this.$route)
                  .then(() => {
                    this.$router.push({
                      name: 'futuresAccountAdjust',
                      params: {
                        refresh: true
                      }
                    })
                  })
              })
              .catch(() => { })
          } else {
            futuresAccountAdjust
              .save({ data: postData })
              .then(response => {
                this.$store
                  .dispatch('delVisitedViews', this.$route)
                  .then(() => {
                    this.$router.push({
                      name: 'futuresAccountAdjust',
                      params: {
                        refresh: true
                      }
                    })
                  })
              })
              .catch(() => { })
          }
        })
        .catch(() => { })
    },
    // 取消
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.$store.dispatch('delVisitedViews', this.$route).then(() => {
            this.$router.push({
              name: 'futuresAccountAdjust'
            })
          })
        })
        .catch(() => { })
    },
    close() {
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'futuresAccountAdjust'
        })
      })
    },
    closeDialog() {
      this.dialogVisible = false
    },
    // 审批
    audit() {
      Vue.component('view-form-edit', () =>
        import('@/views/frame/base/bpm/components/approveDialog.vue')
      )
      this.dialogLv2Visible = true
      // 将弹窗插入body防止被遮盖
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el).appendTo('body')
        $('body > .dialog-wrapper > .mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    // 审批历史
    auditHistory() {
      Vue.component('view-form-edit', () =>
        import('@/views/frame/base/bpm/components/approveHistory.vue')
      )
      this.dialogLv2Visible = true
      // 将弹窗插入body防止被遮盖
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el)
          .appendTo('#app-main .app-container > main')
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    // 二级弹窗关闭回调
    dialogHandler(param) {
      this.dialogLv2Visible = false
      if (param) {
        this.$nextTick(() => {
          this.$emit('closeLv2Dialog', param)
        })
      }
    }
  }
}
</script>
