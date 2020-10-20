<template>
  <div v-el-drag-dialog class="dialog-wrapper">
    <div class="dialog-container" style="width: 1000px;">
      <title-contain :titleName="titleName" @TitleFun="cancel" />
      <div style="padding: 0 3px;">
        <header style="margin-top:5px">
          <el-form class="header-form-inline" :model="formData" label-position="left" :rules="rules" ref="validateForm" :show-message="false">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="$t('strategy.beginProfit.strategyCode')" prop="strategyCode">
                  <el-input v-model="formData.strategyCode" @focus="strategyDialogOpen"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('strategy.beginProfit.strategyName')" prop="strategyName">
                  <el-input v-model="formData.strategyName" :disabled="true" :clearable="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('strategy.beginProfit.saveDate')" prop="saveDate">
                  <el-date-picker v-model="formData.saveDate" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </header>

        <div class="top-operate" style="border: none;">
          <el-row type="flex">
            <el-button v-db-click size="mini" @click="addRow" v-if="['add'].includes(type)">
              <svg-icon icon-class="线性-增行"></svg-icon>
              {{ $t('biz.btn.addRow') }}
            </el-button>
            <el-button v-db-click size="mini" @click="deleteRow" v-if="['add'].includes(type)">
              <svg-icon icon-class="线性-删行"></svg-icon>
              {{ $t('biz.btn.deleteRow') }}
            </el-button>
          </el-row>
        </div>
        <el-table style="border: 1px solid;margin-bottom: 43px;" stripe border class="table-content tb-edit" ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :rules="rules" :height="374" @current-change="handleChange">
          <el-table-column align="center" type="index" width="50" :label="$t('table.id')" fixed></el-table-column>
          <el-table-column :width="90" align="center" :label="$t('strategy.beginProfit.type')" prop="type">
            <template slot-scope="scope">
              <span>{{scope.row.type | dataDictFormat($t('datadict.itemClass'))}}</span>
            </template>
          </el-table-column>
          <el-table-column :width="120" :label="$t('strategy.beginProfit.productName')" prop="productName"></el-table-column>

          <el-table-column :width="120" :label="$t('strategy.beginProfit.futuresContractCode')" prop="futuresContractCode">
            <template slot-scope="scope">
              <base-select v-model="scope.row.futuresContractCode" :attrs="{data: 'FUTURES_CONTRACT', disabled:scope.row.type === '1' || disabled ,params: {futuresVarietiesCode: scope.row.productCode,showExpire: true} ,filterable: true}" size="mini"></base-select>
            </template>
          </el-table-column>

          <el-table-column :width="120" :label="$t('strategy.beginProfit.relizationProfit')" prop="relizationProfit">
            <template slot-scope="scope">
              <input-formatter v-model="scope.row.relizationProfit" :precision="2" size="mini"></input-formatter>
            </template>
          </el-table-column>
          <el-table-column :width="120" :label="$t('strategy.beginProfit.positionProfit')" prop="positionProfit">
            <template slot-scope="scope">
              <input-formatter v-model="scope.row.positionProfit" :precision="2" size="mini"></input-formatter>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="dialog-footer">
        <el-button v-db-click v-if="['view'].includes(type)" size="mini" @click="close">{{$t('biz.btn.close')}}</el-button>
        <el-button v-db-click v-if="['add','update'].includes(type)" size="mini" @click="cancel">{{$t('biz.btn.cancel')}}</el-button>
        <el-button v-db-click v-if="['add','update'].includes(type)" size="mini" type="primary" @click="confirmClick">{{$t('biz.btn.save')}}</el-button>
      </div>
    </div>
    <div class="mask"></div>

    <strategyDialog v-if="strategyDialogVisible" @close="dialogClose" @confirm="dialogConfirm"></strategyDialog>

    <strategyDetailDialog v-if="detailDialogVisible" :strategyNature="formData.strategyNature" :strategyCode="formData.strategyCode" @close="detailDialogClose" @confirm="detailDialogConfirm"></strategyDetailDialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import strategyDialog from '@/views/frame/rm/strategy/strategyManagement/components/strategyDialog'
import strategyDetailDialog from '@/views/frame/rm/strategy/plan/strategyDetailDialog'

export default {
  name: '',
  components: {
    strategyDialog,
    strategyDetailDialog
  },
  data() {
    return {
      formData: {
        strategyCode: '',
        strategyName: '',
        saveDate: ''
      },
      tableData: [],
      currentRow: null,
      strategyDialogVisible: false,
      detailDialogVisible: false,
      rules: {
        // strategyCode: [{
        //   required: true,
        //   trigger: 'blur'
        // }],
        saveDate: [
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
    titleName() {
      return this.$t('strategy.beginProfit.dialog')
    }
  },
  props: {
    type: String,
    id: String
  },
  mounted() {
    // 校验规则提示添加
    $('.edit-page-style .el-col .is-required .el-form-item__content').attr(
      'data-content',
      this.$t('biz.placeholder.require')
    )

    if (this.type !== 'add') {
      this.getData()
    }
  },
  methods: {
    getData() {
      request({
        url: '/api/strategy/strgBeginProfit/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.id
        }
      }).then(response => {
        this.formData = response.data
        this.tableData.push(response.data)
      })
    },
    strategyDialogOpen() {
      this.strategyDialogVisible = true
    },
    dialogClose() {
      this.strategyDialogVisible = false
    },
    dialogConfirm(val) {
      this.formData.strategyName = val.strategyName
      this.formData.strategyCode = val.strategyCode
      this.formData.strategyNature = val.strategyNature
      this.tableData = []
      this.strategyDialogVisible = false
    },
    detailDialogClose() {
      this.detailDialogVisible = false
    },
    detailDialogConfirm(data) {
      for (var i = 0; i < this.tableData.length; i++) {
        var td = this.tableData[i]
        if (data.itemClass === '1' && td.productCode === data.productCode) {
          this.$notify(
            notifyInfo({
              msg: this.$t('strategy.beginProfit.msg.sameProduct')
            })
          )
          return
        }
      }
      var obj = {}
      obj.type = data.itemClass
      obj.productCode = data.productCode
      obj.productName = data.productName
      obj.relizationProfit = 0
      obj.positionProfit = 0
      this.tableData.push(obj)
      this.detailDialogVisible = false
    },
    confirmClick() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          if (!this.tableData || this.tableData.length === 0) {
            this.$notify(
              notifyInfo({
                msg: this.$t('strategy.beginProfit.msg.profitListIsNull')
              })
            )
            return
          }
          for (let i = 0; i < this.tableData.length; i++) {
            const data = this.tableData[i]
            if (data.type !== '1' && !data.futuresContractCode) {
              this.$notify(
                notifyInfo({
                  msg: this.$t('strategy.beginProfit.msg.contractIsEmpty')
                })
              )
              return
            }
            if ((!this.tableData[i].relizationProfit || parseInt(this.tableData[i].relizationProfit) === 0) &&
              (!this.tableData[i].positionProfit || parseInt(this.tableData[i].positionProfit) === 0)) {
              this.$notify(
                notifyInfo({
                  msg: this.$t('strategy.beginProfit.msg.profitIsEmpty')
                })
              )
              return
            }
          }
          this.tableData.forEach(e => {
            e.strategyName = this.formData.strategyName
            e.strategyCode = this.formData.strategyCode
            e.strategyNature = this.formData.strategyNature
            e.saveDate = this.formData.saveDate
          })
          this.$confirm(
            this.$t('biz.msg.confirmSaveAndSubmit'),
            this.$t('biz.msg.tip'),
            {
              type: 'warning',
              closeOnClickModal: false,
              confirmButtonText: this.$t('biz.btn.confirm'),
              cancelButtonText: this.$t('biz.btn.cancel')
            }
          )
            .then(() => {
              var url = ''
              if (this.type === 'add') {
                url = '/api/strategy/strgBeginProfit/save'
              } else {
                url = '/api/strategy/strgBeginProfit/update'
              }
              request({
                url: url,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.tableData
                }
              }).then(response => {
                this.$notify(
                  notifySuccess({
                    msg: this.$t('biz.msg.saveSuccess')
                  })
                )
                this.$emit('close')
              })
            })
            .catch(() => { })
        } else {
          return false
        }
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
    close() {
      this.$emit('close')
    },
    addRow() {
      if (this.formData.strategyCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.plan.msg.strategyFirst')
          })
        )
        return
      }
      this.detailDialogVisible = true
    },
    deleteRow() {
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        this.tableData.splice(this.tableData.indexOf(this.currentRow), 1)
        this.currentRow = null
      })
    },
    handleChange(row) {
      this.currentRow = row
    }
  }
}
</script>
