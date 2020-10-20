<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='mediumColumnsDialog'>
      <!-- 头部 -->
      <title-contain :titleName='dlgTitle' @TitleFun="$emit('close')" />
      <!-- 内容 -->
      <el-form class="header-form-inline" :model="formData" label-position="left" :rules='rules' ref="validateForm" :show-message="false">
        <el-row :gutter="20">
          <!-- 交易日期 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.tradingDay')" prop='tradingDay'>
              <el-date-picker v-model="formData.tradingDay" type="date" :picker-options='dateStartBefore' format="yyyy-MM-dd" value-format="yyyyMMdd" :placeholder="$t('biz.placeholder.dateInput')" :disabled="type !== 'add'"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 子账号	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.derivativeSubAccount')" prop='derivativeSubAccount'>
              <el-select clearable v-model="formData.derivativeSubAccount" filterable :placeholder="$t('biz.placeholder.choose')" :disabled="type !== 'add'">
                <el-option v-for="(item,index) in derivativeAccountList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 合约 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.futuresContractCode')" prop='futuresContractCode'>
              <el-select clearable v-model="formData.futuresContractCode" filterable :placeholder="$t('biz.placeholder.choose')" :disabled="type !== 'add'">
                <el-option v-for="(item,index) in futuresContractCodeList" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 方向 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.posiDirection')" prop='posiDirection'>
              <el-select v-model="formData.posiDirection" clearable filterable placeholder="" :disabled="type !== 'add'">
                <el-option v-for="item in $t('datadict.dvtPosiDirection')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 数量 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.position')" prop='position'>
              <input-formatter v-model.number="formData.position" :max='999999999999.9999' :min='0' :precision='3' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓均价 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.positionPrice')" prop='positionPrice'>
              <input-formatter v-model.number="formData.positionPrice" :max='999999999999.9999' :min='-999999999999.99' :precision='8' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 昨结算价 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.preSettlementPrice')" prop='preSettlementPrice'>
              <input-formatter v-model.number="formData.preSettlementPrice" :max='999999999999.9999' :min='-999999999999.99' :precision='8' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 今结算价 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.settlementPrice')" prop='settlementPrice'>
              <input-formatter v-model.number="formData.settlementPrice" :max='999999999999.9999' :min='-999999999999.99' :precision='8' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓盈亏 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.positionProfit')" prop='positionProfit'>
              <input-formatter v-model.number="formData.positionProfit" :max='999999999999.9999' :min='-999999999999.99' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 保证金	  -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.useMargin')" prop='useMargin'>
              <input-formatter v-model.number="formData.useMargin" :max='999999999999.9999' :min='0' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 投机/套保 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresSubPosi.hedgeFlag')" prop='hedgeFlag'>
              <el-select v-model="formData.hedgeFlag" clearable filterable placeholder="" :disabled="type !== 'add'">
                <el-option v-for="item in $t('datadict.dvtHedgeType')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click="cancel" size="mini">{{ $t('biz.btn.cancel') }}</el-button>
        <el-button type="primary" @click="saveEdit" v-if="type!=='view'" v-db-click size="mini">{{ $t('biz.btn.save') }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TitleContain from '@/components/frame/TitleContain'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import {
  get as getData,
  save,
  update,
  listDerivativeSubAccount,
  listFuturesContractCode
} from '@/api/frame/rm/derivative/futuresSubPosi'

export default {
  data() {
    return {
      loading: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      dateStartBefore: {},
      derivativeAccountList: [],
      futuresContractCodeList: [],
      // 属性信息
      rules: {
        tradingDay: [
          {
            required: this.type !== 'update',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        posiDirection: [
          {
            required: this.type !== 'update',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ],
        derivativeSubAccount: [
          {
            required: this.type !== 'update',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ],
        futuresContractCode: [
          {
            required: this.type !== 'update',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ],
        position: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        positionPrice: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        positionProfit: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        useMargin: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        hedgeFlag: [
          {
            required: this.type !== 'update',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ]
      },
      formData: {}
    }
  },
  props: ['type', 'id'],
  components: {
    TitleContain
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    // 根据传参，显示不同的弹窗名称
    dlgTitle() {
      if (this.type === 'add') {
        return (
          this.$t('derivative.futuresSubPosi.title') +
          ' - ' +
          this.$t('biz.btn.add')
        )
      } else if (this.type === 'update') {
        return (
          this.$t('derivative.futuresSubPosi.title') +
          ' - ' +
          this.$t('biz.btn.update')
        )
      }
      return ''
    }
  },
  mounted() {
    listDerivativeSubAccount().then(response => {
      this.derivativeAccountList = response.data
    })
    listFuturesContractCode().then(response => {
      this.futuresContractCodeList = response.data
    })
    // 初始化
    this.getData()
  },
  methods: {
    getData() {
      if (this.type !== 'add') {
        getData(
          {
            data: this.id,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.view')
          },
          this.func
        )
          .then(response => {
            this.loading = false
            this.formData = response.data
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 保存
    saveEdit() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          var postData = {
            data: this.formData,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
          }
          this.$confirm(
            this.$t('biz.msg.confirmSave'),
            this.$t('biz.msg.tip'),
            {
              type: 'warning',
              closeOnClickModal: false,
              confirmButtonText: this.$t('biz.btn.confirm'),
              cancelButtonText: this.$t('biz.btn.cancel')
            }
          )
            .then(() => {
              if (this.type === 'add') {
                save(postData, this.func)
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.saveSuccess')
                      })
                    )
                    this.$emit('close')
                  })
                  .catch(() => {})
              } else if (this.type === 'update') {
                update(postData, this.func)
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.updateSuccess')
                      })
                    )
                    this.$emit('close')
                  })
                  .catch(() => {})
              }
            })
            .catch(() => {})
        }
      })
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
          this.$emit('close')
        })
        .catch(() => {})
    }
  }
}
</script>
