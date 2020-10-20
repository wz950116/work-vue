<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' style="height: 500px">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <header style='border-radius:5px;'>
        <el-form :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="validateForm">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="$t('target.futuresAccountPosition.targetName')" prop="targetName">
                <input-validate v-model="formData.targetName" :clearable='true' :disabled="disabledView()"></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('target.futuresAccountPosition.organCode')" prop='organCode'>
                <base-select v-model="formData.organCode" :attrs="{data: 'FUNC_ORG',clearable:true,params:{usingFlag: '1',disabled: disabledView()}}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('target.futuresAccountPosition.derivativeAccount')" prop='derivativeAccount'>
                <base-select v-model="formData.derivativeAccount" @changeAll="accountChange" :attrs="{data: 'DERIVATIVE_ACCOUNT',clearable:true,disabled: disabledView()}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('target.futuresAccountPosition.custCode')" prop='custCode'>
                <base-select v-model="formData.custCode" :attrs="{data: 'CUST_INFO',clearable:true,disabled: true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('target.futuresAccountPosition.startDate')" prop='startDate'>
                <el-date-picker v-model="formData.startDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled="disabledView()" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('target.futuresAccountPosition.endDate')" prop='endDate'>
                <el-date-picker v-model="formData.endDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled="disabledView()" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('target.futuresAccountPosition.remark')" prop='remark'>
                <input-validate v-model="formData.remark" :clearable='true' size="mini" :disabled="disabledView()"></input-validate>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>

      <main>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="$t('target.futuresAccountPosition.tabName')" name="mainInfo">
            <div class='tabs-operate' style='margin:5px 0px;'>
              <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
                <svg-icon icon-class="线性-增行"></svg-icon>
                {{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
                <svg-icon icon-class="线性-删行"></svg-icon>
                {{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border height="255" ref="buyTable" class='table-content tb-edit' :data="formData.detailList" style="border:1px solid;" @current-change="selectChange">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column :label="$t('target.futuresAccountPosition.itemClass')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('target.futuresAccountPosition.itemClass')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <el-select size="mini" @change="v=>calssChange({val:v,row:scope.row})" v-model="scope.row.itemClass" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                    <el-option v-for="item in $t('datadict.futuresItemClass1')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('target.futuresAccountPosition.futuresVarieties')" width="150">
                <template slot="header" slot-scope="scope">
                  {{$t('target.futuresAccountPosition.futuresVarieties')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <base-select v-if="scope.row.itemClass==='2'" size="mini" v-model="scope.row.futuresVarietiesCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'1'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
                  <base-select v-if="scope.row.itemClass==='3'" size="mini" v-model="scope.row.futuresVarietiesCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'2'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
                  <base-select v-if="scope.row.itemClass==='4'" size="mini" v-model="scope.row.futuresVarietiesCode" :attrs="{data: 'OPTION_VARIETIES',clearable:true,params:{usingFlag:'1'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('target.futuresAccountPosition.direction')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('target.futuresAccountPosition.direction')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                    <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('target.futuresAccountPosition.maxLots')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('target.futuresAccountPosition.maxLots')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter v-model="scope.row.maxLots" :min="0" :max='999999999999' :precision="0" type='thousands' size="mini" @change="e => changeLots(e,scope.row)"></input-formatter>
                </template>
              </el-table-column>
              <el-table-column :label="$t('target.futuresAccountPosition.maxQuantity')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('target.futuresAccountPosition.maxQuantity')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter v-model="scope.row.maxPosition" :min="0" :max='999999999999' :precision="0" type='thousands' size="mini" :disabled="true"></input-formatter>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </main>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-db-click v-if="type === 'view'" size="mini" @click="close">
          {{$t('biz.btn.close')}}
        </el-button>
        <el-button v-db-click v-if="['add', 'update'].includes(type)" size="mini" @click="cancel">
          {{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type='primary' v-if="['add', 'update'].includes(type)" v-db-click size="mini" @click="save">
          {{$t('biz.btn.save')}}
        </el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { dateFormate } from '@/utils/frame/base/index'
export default {
  components: {

  },
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      type: this.opType,
      tableData: [],
      detailData: [],
      selectData: {},
      formData: {
        detailList: []
      },
      activeName: 'mainInfo',
      rules: {
        targetName: [
          {
            required: !this.disabledView(),
            trigger: 'blur'
          }
        ],
        organCode: [
          {
            required: !this.disabledView(),
            trigger: 'change'
          }
        ],
        derivativeAccount: [
          {
            required: !this.disabledView(),
            trigger: 'change'
          }
        ],
        custCode: [
          {
            required: !this.disabledView(),
            trigger: 'change'
          }
        ],
        startDate: [
          {
            required: !this.disabledView(),
            trigger: 'blur'
          }
        ],
        endDate: [
          {
            required: !this.disabledView(),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String
    },
    param: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('route.' + this.$route.meta.title) + this.$t(`biz.btn.${this.type}`)
    }
  },
  mounted() {
    if (this.type !== 'add') {
      this.getData()
    }
  },
  methods: {
    accountChange(data) {
      this.formData.custCode = data.data.customerCode
    },
    getData() {
      request({
        url: '/api/target/tgtFtAccoPosition/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.get'),
          data: this.param.id
        }
      }).then(response => {
        this.formData = response.data
      })
    },
    disabledView() {
      return this.type === 'view'
    },
    calssChange(val) {
      const row = val.row
      this.$set(row, "productCode", '')
      this.$set(row, "maxPosition", null)
    },
    changeProductCode(val) {
      val.row.contractMultiplier = val.val.data.contractMultiplier
      this.changeLots(val.row.maxLots, val.row)
    },
    changeLots(val, row) {
      if (!val || !row.contractMultiplier) {
        this.$set(row, "maxPosition", null)
        return
      }
      this.$set(row, "maxPosition", parseInt(row.contractMultiplier) * parseInt(val))
    },
    selectChange(val) {
      this.selectData = val
    },
    addRow() {
      this.formData.detailList.push({})
    },
    // 删行
    deleteRow(file) {
      if (this.selectData) {
        this.$confirm(
          this.$t('biz.msg.confirmDelete'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            this.formData.detailList.forEach((item, index) => {
              if (this.selectData === item) {
                this.formData.detailList.splice(index, 1)
              }
            })
          })
          .catch(() => { })
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    close() {
      this.$emit('closeHandler', true)
    },
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.close()
        })
        .catch(() => { })
    },
    save() {
      this.$refs.validateForm.validate(valid => {
        if (valid) {
          if (this.checkSave()) {
            return
          }
          this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              let api = '/api/target/tgtFtAccoPosition/update'
              if (this.type === 'add') {
                api = '/api/target/tgtFtAccoPosition/save'
              }
              request({
                url: api,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.formData
                }
              }).then(response => {
                this.$emit('closeHandler', true)
              })
            })
            .catch(() => { })
        } else {
          return false
        }
      })
    },
    checkSave() {
      const detailList = this.formData.detailList
      if (detailList.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('target.futuresAccountPosition.msg.detailListEmpty')
          })
        )
        return true
      }
      for (let i = 0; i < detailList.length; i++) {
        const data = detailList[i]
        if (!data.futuresVarietiesCode) {
          this.$notify(
            notifyInfo({
              msg: this.$t('target.futuresAccountPosition.msg.futuresVarietiesCodeNoData')
            })
          )
          return true
        }

        if (!data.direction) {
          this.$notify(
            notifyInfo({
              msg: this.$t('target.futuresAccountPosition.msg.directionNoData')
            })
          )
          return true
        }

        if (!data.maxLots) {
          this.$notify(
            notifyInfo({
              msg: this.$t('target.futuresAccountPosition.msg.lotsNoData')
            })
          )
          return true
        }
      }
      return false
    }
  }
}
</script>
