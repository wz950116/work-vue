<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="close" v-if="type==='view'">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="cancel" v-if="['add', 'update', 'assist', 'audit'].includes(type)">
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="save" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="selectSpotExposure" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-选择文件"></svg-icon>{{$t('biz.btn.selectSpotExposure')}}
      </el-button>
    </el-row>
    <!-- 内容 -->
    <header :style="{'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
      <div class='form-title'>{{$t('biz.title.mainInfo')}}<i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i></div>
      <el-form v-if='mainInfoVisible' :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="validateForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.matchCode')" prop='matchCode'>
              <input-validate v-model="formData.matchCode" :disabled="seqMode" :clearable="true"></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.makeDate')" prop='makeDate'>
              <el-date-picker v-model="formData.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.productCode')" prop='productCode'>
              <base-select v-model="formData.productCode" :attrs="{data: 'DD_PRODUCT', disabled: true}"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.documentNo')" prop='documentNo'>
              <input-validate v-model="formData.documentNo" :disabled="true"></input-validate>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.direction')" prop='direction'>
              <el-select v-model="formData.direction" :disabled="true" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.spotDirection')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.spotQuantity')" prop='rawQuantity'>
              <input-formatter v-model="formData.rawQuantity" :precision='4' :disabled="true"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.futuresQuantity')" prop='futuresQuantity'>
              <input-formatter v-model="formData.futuresQuantity" :disabled="true"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.relateProportion')" prop='relateProportion'>
              <input-formatter v-model="formData.relateProportion" :type="'percent'" :disabled="true"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.bizOrganCode')" prop='bizOrganCode'>
              <base-select v-model="formData.bizOrganCode" :attrs="{data: 'TREE_ORGAN'}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.bizDeptCode')" prop='bizDeptCode'>
              <base-select v-model="formData.bizDeptCode" :attrs="{data: 'TREE_DEPT'}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.bizEmployeeCode')" prop='bizEmployeeCode'>
              <base-select v-model="formData.bizEmployeeCode" :attrs="{data: 'TREE_STAFF'}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('strategy.simpleMatch.form.makeUser')" prop='makeUser'>
              <base-select v-model="formData.makeUser" :attrs="{data: 'TREE_STAFF', disabled: true}" size="mini"></base-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('strategy.simpleMatch.form.remark')" prop='remark'>
              <el-input v-model="formData.remark" :clearable="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <main>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane :label="$t('strategy.simpleMatch.tab.detailList')" name="detailList">
          <tradeTable ref="detailList" :height="tableHeight" :spotDirection="formData.direction" :spotFlag="spotFlag" @changeQuantity="changeQuantity"></tradeTable>
        </el-tab-pane>
      </el-tabs>
    </main>

    <exposureDialog v-if="exposureVisible" @close="dialogClose" @confirm="dialogConfirm"></exposureDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import tradeTable from '@/views/frame/rm/strategy/simpleMatch/components/tradeTable'
import exposureDialog from '@/views/frame/rm/strategy/simpleMatch/components/exposureDialog'

export default {
  components: {
    tradeTable,
    exposureDialog
  },
  data() {
    return {
      seqMode: false,
      spotFlag: false,
      mainInfoVisible: true,
      type: this.$route.params.type,
      activeName: 'detailList',
      exposureVisible: false,
      formData: {
        instructionCode: '',
        matchCode: '',
        makeUser: '',
        makeDate: '',
        detailList: []
      },
      rules: {
        matchCode: [
          {
            required: !this.seqMode,
            trigger: 'blur'
          }
        ],
        makeDate: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        bizOrganCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        bizDeptCode: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        bizEmployeeCode: [
          {
            required: true,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440 ? this.clientHeight - 370 : this.clientHeight - 390
    }
  },
  mounted() {
    // 校验规则提示添加
    $('.edit-page-style .el-col .is-required .el-form-item__content').attr('data-content', this.$t('biz.placeholder.require'))

    if (this.type !== 'add') {
      this.getData()
    }
  },
  methods: {
    getData() {
      request({
        url: '/api/strategy/strgSimpleMatch/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.uk
        }
      }).then(response => {
        this.formData = response.data
        this.$refs.detailList.tableData = response.data.detailList
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'simpleMatch'
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
              name: 'simpleMatch'
            })
          })
        })
        .catch(() => {})
    },
    checkSave() {
      const detailList = this.$refs.detailList.tableData
      if (detailList.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.simpleMatch.msg.detailListIsNull')
          })
        )
        return false
      }
      if (this.formData.futuresQuantity < 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.simpleMatch.msg.futuresIsNegative')
          })
        )
        return false
      }
      return true
    },
    save() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          if (!this.checkSave()) {
            return
          }
          this.formData.detailList = []
          this.formData.detailList = this.$refs.detailList.tableData
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
              request({
                url: '/api/strategy/strgSimpleMatch/' + url,
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
                    name: 'simpleMatch',
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
    selectSpotExposure() {
      this.exposureVisible = true
    },
    dialogClose() {
      this.exposureVisible = false
    },
    dialogConfirm(val) {
      this.formData.productCode = val.productCode
      this.formData.documentNo = val.documentNo
      this.formData.direction = val.direction
      this.formData.rawQuantity = val.rawQuantity
      this.formData.futuresQuantity = 0
      this.formData.relateProportion = 0
      this.$refs.detailList.tableData = []
      this.spotFlag = true

      this.exposureVisible = false
    },
    changeQuantity(futuresQuantity) {
      this.formData.futuresQuantity = futuresQuantity
      this.formData.relateProportion = ((futuresQuantity * 1.0) / (this.formData.rawQuantity * 1.0)) * 100
    }
  }
}
</script>
