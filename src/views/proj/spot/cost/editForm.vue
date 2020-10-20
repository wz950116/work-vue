<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="close" v-if="['view'].includes(type)">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="cancel" v-if="['add', 'update', 'assist', 'audit'].includes(type)">
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="save" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="rateChange" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-修改"></svg-icon>{{$t('biz.btn.caculate')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="audit" v-if="['assist', 'audit'].includes(type)">
        <svg-icon icon-class="线性-审核"></svg-icon>{{$t('biz.btn.audit')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="auditHistory" v-if="['assist', 'audit','view'].includes(type)">
        <svg-icon icon-class="线性-全选"></svg-icon>{{$t('biz.btn.auditHistory')}}
      </el-button>
    </el-row>
    <!-- 内容 -->
    <header :style="{'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.mainInfo')}}
        <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
      </div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="validateForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.organCode')" prop='organCode'>
              <base-select v-model="formData.organCode" :attrs="{data: 'TREE_ORGAN',clickParent:true}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.deptCode')" prop='deptCode'>
              <base-select v-model="formData.deptCode" :attrs="{data: 'TREE_DEPT'}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.documentNo')" prop='documentNo'>
              <el-input v-model="formData.documentNo" :disabled="disabledFlag" :placeholder="$t('biz.placeholder.input')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.documentDate')" prop='documentDate'>
              <el-date-picker v-model="formData.documentDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.purchaseSaleType')" prop='purchaseSaleType'>
              <el-select clearable v-model="formData.purchaseSaleType" :placeholder="$t('biz.placeholder.choose')" @change="typeChange">
                <el-option v-for="item in $t('datadict.spotDirection')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.originalCurrencyCode')" prop='originalCurrencyCode'>
              <base-select v-model="formData.originalCurrencyCode" :attrs="{data: 'CURRENCY'}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.originalCurrencyAmt')" prop='originalCurrencyAmt'>
              <input-formatter v-model="formData.originalCurrencyAmt" :precision="2" type="thousands" :digitType="'money'" size="mini" @change="rateChange"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.exchangeRate')" prop='exchangeRate'>
              <input-formatter v-model="formData.exchangeRate" :precision="2" type="thousands" :digitType="'money'" size="mini" @change="rateChange"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.domesticCurrencyAmt')" prop='domesticCurrencyAmt'>
              <input-formatter v-model="formData.domesticCurrencyAmt" :precision="2" :disabled="true" type="thousands" size="mini"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.customerCode')" prop='customerCode'>
              <base-select v-model="formData.customerCode" :attrs="{data: 'CUST_INFO',params: {typeCode: '12',usingFlag: '1',auditStatus: '3'}}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.preliminaryFlag')" prop='preliminaryFlag'>
              <el-checkbox v-model="formData.preliminaryFlag" :disabled="openFlag"></el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('spotProj.cost.edit.remark')" prop='remark'>
              <el-input v-model="formData.remark" :placeholder="$t('biz.placeholder.input')"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('spotProj.cost.edit.cliamMoney')" name="cliamMoney">
          <costInfo ref="costInfo" :direction="formData.purchaseSaleType"></costInfo>
        </el-tab-pane>
      </el-tabs>
    </main>

    <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='param' :opType="type" :opMode='"route"'></view-form-edit>

    <approve-history ref='approveHistory' v-if='approveHistoryVisible' @closeHandler='dialogHandlerHistory' :param='param' :opType="type"></approve-history>
  </div>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import Vue from 'vue'
import costInfo from '@/views/proj/spot/cost/components/costInfo'
import TreeOrgBaseDept from '@/views/frame/base/organ/components/TreeOrgBaseDept'
import { dateFormate } from '@/utils/frame/base/index'
import { mapGetters } from 'vuex'

export default {
  components: {
    costInfo,
    TreeOrgBaseDept
  },
  data() {
    return {
      disabledFlag: false,
      openFlag: false,
      mainInfoVisible: true,
      dialogLv2Visible: false,
      approveHistoryVisible: false,
      param: this.$route.params,
      type: this.$route.params.type || this.$route.params.opType,
      planVisible: false,
      activeName: 'cliamMoney',
      formData: {
        organCode: '',
        deptCode: '',
        document: '',
        purchaseSaleType: '',
        originalCurrencyCode: '',
        originalCurrencyAmt: 0,
        exchangeRate: 1,
        domesticCurrencyAmt: 0,
        customerCode: '',
        preliminaryFlag: false,
        remark: '',
        documentDate: '',
        costDetailDtoList: []
      },
      rules: {
        documentNo: [
          {
            required: false,
            trigger: 'blur'
          }
        ],
        purchaseSaleType: [
          {
            required: this.$route.query.type !== 'view',
            trigger: 'blur'
          }
        ],
        originalCurrencyAmt: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        exchangeRate: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        domesticCurrencyAmt: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        organCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        deptCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        customerCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        documentDate: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        originalCurrencyCode: [
          {
            required: true,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['userOrganCode', 'userDeptCode', 'userEmployeeCode'])
  },
  async mounted() {
    this.formData.organCode = this.userOrganCode
    this.formData.deptCode = this.userDeptCode
    this.getDisabled()
    this.getRequired()
    if (this.type !== 'add' && this.type !== 'copy') {
      this.getData()
    }
    if (this.type === 'add') {
      this.formData.documentDate = dateFormate(new Date(), 'yyyyMMdd')
      this.formData.originalCurrencyCode = await this.$store.dispatch('getCurrencyCode', {
        funcModule: this.$t('route.' + this.$route.meta.title),
        name: '人民币'
      })
    }
    if (this.type === 'copy') {
      this.type = 'add'
      this.getData()
    }
    this.getFlag()
  },
  methods: {
    getDisabled() {
      const seqMode = this.$route.meta.seqMode
      // 自动则disabled
      if (seqMode && seqMode === '0') {
        this.disabledFlag = true
      }
    },
    getRequired() {
      const seqMode = this.$route.meta.seqMode
      // 手动则必输
      if (seqMode && seqMode === '1') {
        this.rules.documentNo = [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    },
    getFlag() {
      request({
        url: '/api/sys/sysInitSetting/getFlag',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save')
        }
      }).then(response => {
        if (response.data) {
          this.openFlag = true
        }
      })
    },
    changeAll(val) {
      if (val) {
        this.formData.organCode = val.orgCode
      }
    },
    getData() {
      request({
        url: '/api/spot/cost/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        if (this.type === 'add') {
          this.formData.documentNo = ''
          this.formData.id = ''
        }
        setTimeout(() => {
          this.$refs.costInfo.tableData = response.data.costDetailDtoList
        }, 500)
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'cost'
        })
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
          // 关闭编辑页返回主页面的回调...
          this.$store.dispatch('delVisitedViews', this.$route).then(() => {
            this.$router.push({
              name: 'cost'
            })
          })
        })
        .catch(() => {})
    },
    checkSave() {
      var costInfo = this.$refs.costInfo.tableData
      if (costInfo.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('spotProj.cost.edit.msg.costTypeList')
          })
        )
        return false
      }

      for (var i = 0; i < costInfo.length; i++) {
        var data = costInfo[i]
        if (!data.fundType) {
          this.$notify(
            notifyInfo({
              msg: this.$t('spotProj.cost.edit.msg.costTypeEmpty')
            })
          )
          return false
        }
        if (!data.direction) {
          this.$notify(
            notifyInfo({
              msg: this.$t('spotProj.cost.edit.msg.directionEmpty')
            })
          )
          return false
        }
        if (!data.spotExposureCode) {
          this.$notify(
            notifyInfo({
              msg: this.$t('spotProj.cost.edit.msg.exposureTypeEmpty')
            })
          )
          return false
        }
        if (parseFloat(data.claimAmt) === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('spotProj.cost.edit.msg.claimAmtZero')
            })
          )
          return false
        }
      }
      return true
    },
    save() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          if (!this.checkSave()) {
            return
          }
          this.$confirm(this.$t('biz.msg.confirmSaveAndSubmit'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              var url = ''
              if (this.type === 'add') {
                url = 'save'
              } else if (this.type === 'update') {
                url = 'update'
              }
              this.formData.costDetailDtoList = this.$refs.costInfo.tableData
              request({
                url: '/api/spot/cost/' + url,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.formData
                }
              }).then(response => {
                this.$notify(
                  notifySuccess({
                    msg: this.$t('biz.msg.saveSuccess')
                  })
                )

                // 关闭编辑页返回主页面的回调...
                this.$store.dispatch('delVisitedViews', this.$route).then(() => {
                  this.$router.push({
                    name: 'cost',
                    query: {
                      refresh: true
                    }
                  })
                })
              })
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },
    // 审批
    audit() {
      Vue.component('view-form-edit', () => import('@/views/frame/base/bpm/components/approveDialog.vue'))
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
      Vue.component('approveHistory', () => import('@/views/frame/base/bpm/components/approveHistory.vue'))
      this.approveHistoryVisible = true
      // 将弹窗插入body防止被遮盖
      $(document).ready(() => {
        $(this.$refs.approveHistory.$el)
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    dialogHandlerHistory() {
      this.approveHistoryVisible = false
    },
    // 二级弹窗关闭回调
    dialogHandler(param) {
      this.dialogLv2Visible = false
      if (param) {
        this.$nextTick(() => {
          this.$emit('closeLv2Dialog', param)
        })
      }
    },
    rateChange() {
      this.formData.domesticCurrencyAmt = parseFloat(this.formData.exchangeRate) * parseFloat(this.formData.originalCurrencyAmt)

      this.$refs.costInfo.setAmount()
    },
    typeChange() {
      this.$refs.costInfo.tableData = []
    }
  }
}
</script>
