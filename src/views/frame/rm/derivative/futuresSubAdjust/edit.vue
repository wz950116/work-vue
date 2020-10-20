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
    <header :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
      <div class='form-title'>{{$t('biz.title.mainInfo')}}</div>
      <el-form :inline="true" :rules='rules' :model="formData" class="header-form-inline" label-position="left" ref="refForm">
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubAdjust.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" :placeholder="$t('biz.placeholder.choose')" :picker-options="signEndBefore" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled='true'>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubAdjust.documentNo')" prop='documentNo'>
              <input-validate v-model="formData.documentNo" :placeholder="$t('biz.placeholder.input')" :disabled='true'></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubAdjust.derivativeSubAccount')" prop='derivativeSubAccount'>
              <el-select v-model="formData.derivativeSubAccount" @change='AccountHandler' ref="mySelect" clearable filterable :placeholder="$t('biz.placeholder.choose')" :disabled="type !=='add'">
                <el-option v-for="(item, index) in derAccount" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubAdjust.makeUserName')" prop='makeUserName'>
              <input-validate v-model="formData.makeUserName" :placeholder="$t('biz.placeholder.input')" :disabled='true'></input-validate>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <!-- 列表内容 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('derivative.futuresSubAdjust.listDetail')" name="listDetails" v-if="type !=='view'">
          <futures-account-tab :detailDatas='listDetail' :adjustType='type' :useType='useType'></futures-account-tab>
        </el-tab-pane>
        <el-tab-pane :label="$t('derivative.futuresSubAdjust.listDetailBefore')" name="listDetailBefore" v-if="type ==='view'">
          <futures-account-tab :detailDatas='listDetailBefore' :adjustType='type' :useType='useType'></futures-account-tab>
        </el-tab-pane>
        <el-tab-pane :label="$t('derivative.futuresSubAdjust.listDetailAfter')" name="listDetailAfter" v-if="type ==='view'">
          <futures-account-tab :detailDatas='listDetailAfter' :adjustType='type' :useType='useType'></futures-account-tab>
        </el-tab-pane>

        <!-- 调整原因 -->
        <el-tab-pane :label="$t('derivative.futuresSubAdjust.adjustReason')" name="adjustReason">
          <futures-adj-reason-tab v-model="formData.adjustReason" ref='adjustReason' :id='formData.id' :disabled='type === "view" '></futures-adj-reason-tab>
        </el-tab-pane>
      </el-tabs>
    </main>
    <!-- 弹窗 -->
    <edit-dialog v-el-drag-dialog v-if='dialogVisible' @close='closeDialog' @closeHandlerDialog='closeHandlerDialog' :useType='useType' :myDetailData='formData.derivativeSubAccount'></edit-dialog>

    <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='param' :opType="type" :opMode='"route"'></view-form-edit>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
// import footerBar from '@/components/frame/FooterBar'
// import exportExcel from '@/utils/frame/base/downloadExcel'
import { parseTime } from '@/utils/frame/base/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import elementFun from '@/utils/frame/base/elementFun'
import editDialog from '@/views/frame/rm/derivative/components/adjustDialog'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import * as futuresSubAdjust from '@/api/frame/rm/derivative/futuresAccountAdjust'
import {
  datatime, // 转换为hhmmss,不够两位补零
  numFormat, // 上传文件转换为字典码表key值
  toDateFromString, // 验证时间是否有效
  verifyTime, // 验证时间格式
  verifyNamber
} from '@/utils/frame/base/validate'
// 标签页
// import TreeStaff from '@/views/frame/base/fun/components/TreeStaff' // 制单人
import futuresAdjReasonTab from '@/views/frame/rm/derivative/components/FuturesAdjReasonTab'
import futuresAccountTab from '@/views/frame/rm/derivative/components/FuturesAccountTab'
import excel_DvtFutureSubAdj from '@/assets/frame/excel/dvt/DvtFutureSubAdj.xlsx'
// 导入用户api
import { getInfo } from '@/api/frame/login'
import Vue from 'vue'

export default {
  name: 'futuresSubAdjustEdit',
  data() {
    return {
      tempExcelPath: excel_DvtFutureSubAdj,
      activeName: 'listDetails',
      dialogLv2Visible: false,
      type: this.$route.params.type || this.$route.params.opType,
      param: this.$route.params,
      useType: 'subAdjust',
      loading: false,
      id: '',
      disabled: true,
      derAccount: [],
      dialogVisible: false,
      listDetail: [],
      listDetailBefore: [],
      listDetailAfter: [],
      formData: {
        id: '',
        versionNum: '',
        optType: this.$route.params.type,
        makeDate: '',
        derivativeSubAccount: '',
        documentNo: '',
        makeUserName: '',
        adjustReason: ''
      },
      rules: {
        derivativeSubAccount: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ]
      },
      signEndBefore: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      }
    }
  },
  watch: {
    'formData.derivativeSubAccount'(val, oldv) {
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
  components: {
    // footerBar,
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
      // futuresSubAdjust
      //   .genAdjustNoSub()
      //   .then(response => {
      //     this.formData.documentNo = response.data
      //   })
      //   .catch(() => { })
    }
    // 查询期货子账号列表
    futuresSubAdjust
      .listDerivativeSubAccount()
      .then(response => {
        this.derAccount = response.data
      })
      .catch(() => {})
    // 渲染表格数据
    this.getEditData()
  },

  methods: {
    ...elementFun,
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
            this.formData.derivativeSubAccount = this.oldval
            this.$refs.mySelect.handleClose()
          })
      }
    },
    // 获取初始化数据
    getEditData() {
      if (this.type === 'add') {
        this.formData.makeDate = parseTime(new Date(), '{y}{m}{d}')
        getInfo().then(res => {
          this.formData.makeUserName = res.data.name
        })
      } else if (this.type === 'update') {
        const params = {
          data: this.$route.params.uk,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view')
        }
        futuresSubAdjust
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
        futuresSubAdjust
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
        this.formData.derivativeSubAccount === '' ||
        this.formData.derivativeSubAccount === undefined
      ) {
        this.$notify(
          notifyInfo({
            msg: '请先选择子账号'
          })
        )
        return
      } else {
        this.dialogVisible = true
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },
    download(fileName, attaId) {
      axios({
        method: 'post',
        url: process.env.BASE_API + '/api/sys/file/downloadTemp',
        data: {
          data: {
            filePath: attaId
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.download')
        },
        headers: {
          Authorization: 'Bearer ' + this.$store.getters.token
        },
        responseType: 'blob'
      })
        .then(response => {
          if (!response.data) {
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
        })
        .catch(error => {
          console.log(error)
        })
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
      if (this.formData.derivativeSubAccount === '') {
        this.$notify(
          notifyInfo({
            msg: '请选择子账号'
          })
        )
        return
      }
      if (header.length !== 18) {
        this.$notify.error({
          title: '错误',
          message: '导入模板错误',
          position: 'bottom-right'
        })
        return
      }
      this.listDetail = []

      if (results.length === 0) {
        this.$notify(
          notifyInfo({
            msg: '上传的Excel中没有数据'
          })
        )
        return
      } else if (results) {
        this.isShowBtn = false
        results.forEach(element => {
          for (var j in element) {
            element[j] = element[j].trim()
            if (element[j].indexOf(',') !== -1) {
              element[j] = element[j].replace(/,/g, '')
            }
          }
          const obj = {}
          obj.adjustType = element['调整类型'] || ''
          obj.tradingDay = element['交易日期'] || ''
          obj.derivativeAccount = element['期货账号'] || ''
          obj.derivativeSubAccount = element['子账号'] || ''
          obj.futuresContractCode = element['合约'] || ''
          obj.tradeId = element['成交单号'] || ''
          obj.direction = element['方向'] || ''
          obj.offsetFlag = element['开/平'] || ''
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
          obj.offsetFlag = numFormat(obj.offsetFlag, this.$t('datadict.offset'))
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
            // 必须输入orderSysId
            if (
              i !== 'checkResult' &&
              i !== 'derivativeAccount' &&
              i !== 'mainName' &&
              i !== 'orderSysId' &&
              (ele === undefined || ele === '')
            ) {
              obj.checkResult +=
                this.$t('derivative.futuresAccountAdjust.' + i) + '必须输入!'
            }
            if (
              (i === 'price' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'amount' && ele !== '' && !verifyNamber(ele)) ||
              (i === 'commission' && ele !== '' && !verifyNamber(ele))
            ) {
              obj.checkResult +=
                this.$t('derivative.futuresAccountAdjust.' + i) + '必须是数字!'
            }
            if (i === 'volume' && ele !== '') {
              if (ele % 1 !== 0) {
                obj.checkResult +=
                  this.$t('derivative.futuresAccountAdjust.' + i) +
                  '必须是整数!'
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
                  '不是有效的日期!'
              }
            }

            //   // 判断时间
            if (i === 'tradeTime' && ele !== '') {
              if (!verifyTime(ele)) {
                obj.checkResult +=
                  this.$t('derivative.futuresAccountAdjust.' + i) +
                  '时间格式不正确!'
              } else {
                obj.tradeTime = datatime(obj.tradeTime)
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
                this.$t('derivative.futuresAccountAdjust.' + i) + '的值不正确!'
            }
            var accounts = this.formData.derivativeSubAccount
            if (i === 'derivativeSubAccount' && ele !== '') {
              if (ele !== this.formData.derivativeSubAccount) {
                obj.checkResult +=
                  '只可以输入子账号为 ' + accounts + '的成交明细!'
              }
            }
          }
          this.listDetail.push(obj)
        })
        this.listDetail.forEach(t => {
          if (t.checkResult !== '' && t.checkResult !== undefined) {
            // 打开保存按钮
            this.isShowBtn = true
          }
        })
      }
    },
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
            futuresSubAdjust
              .updateSub({ data: postData })
              .then(response => {
                this.$store
                  .dispatch('delVisitedViews', this.$route)
                  .then(() => {
                    this.$router.push({
                      name: 'futuresSubAdjust',
                      params: {
                        refresh: true
                      }
                    })
                  })
              })
              .catch(() => {})
          } else {
            futuresSubAdjust
              .saveSub({ data: postData })
              .then(response => {
                this.$store
                  .dispatch('delVisitedViews', this.$route)
                  .then(() => {
                    this.$router.push({
                      name: 'futuresSubAdjust',
                      params: {
                        refresh: true
                      }
                    })
                  })
              })
              .catch(() => {})
          }
        })
        .catch(() => {})
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
              name: 'futuresSubAdjust'
            })
          })
        })
        .catch(() => {})
    },
    close() {
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'futuresSubAdjust'
        })
      })
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
