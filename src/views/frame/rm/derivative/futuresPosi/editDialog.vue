<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='mediumColumnsDialog'>
      <!-- 头部 -->
      <title-contain :titleName='dlgTitle' @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <el-form class="header-form-inline" :model="formData" label-position="left" :rules='rules' ref="validateForm" :show-message="false">
        <el-row :gutter="20">
          <!-- 交易日期 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.tradingDay')" prop='tradingDay'>
              <el-date-picker v-model="formData.tradingDay" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd" :placeholder="$t('biz.placeholder.dateInput')" :disabled="type !== 'add'"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 期货账号 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.derivativeAccount')" prop='derivativeAccount'>
              <el-select clearable v-model="formData.derivativeAccount" filterable :placeholder="$t('biz.placeholder.choose')" @change="selectChange" :disabled="type !== 'add'">
                <el-option v-for="item in derivativeAccountList" :key="item.id" :label="item.derivativeAccountName" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 合约 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.futuresContractCode')" prop='futuresContractCode'>
              <el-select clearable v-model="formData.futuresContractCode" filterable :placeholder="$t('biz.placeholder.choose')" :disabled="type !== 'add'">
                <el-option v-for="item in futuresContractCodeList" :key="item.id" :label="item.futuresContractCodeName" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 方向 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.posiDirection')" prop='posiDirection'>
              <el-select v-model="formData.posiDirection" clearable filterable placeholder="" :disabled="type !== 'add'">
                <el-option v-for="item in $t('datadict.dvtPosiDirection')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 数量 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.position')" prop='position'>
              <input-formatter v-model.number="formData.position" :max='999999999999' :min='0' :precision='0' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓均价 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.positionPrice')" prop='positionPrice'>
              <input-formatter v-model.number="formData.positionPrice" :max='999999999999.99' :min='-999999999999.99' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 昨结算价 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.preSettlementPrice')" prop='preSettlementPrice'>
              <input-formatter v-model.number="formData.preSettlementPrice" :max='999999999999.99' :min='-999999999999.99' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 今结算价 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.settlementPrice')" prop='settlementPrice'>
              <input-formatter v-model.number="formData.settlementPrice" :max='999999999999.99' :min='-999999999999.99' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓盈亏 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.positionProfit')" prop='positionProfit'>
              <input-formatter v-model.number="formData.positionProfit" :max='999999999999.99' :min='-999999999999.99' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 保证金	  -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.useMargin')" prop='useMargin'>
              <input-formatter v-model.number="formData.useMargin" :max='999999999999.99' :min='0' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 投机/套保 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.hedgeFlag')" prop='hedgeFlag'>
              <el-select v-model="formData.hedgeFlag" clearable filterable placeholder="" :disabled="type !== 'add'">
                <el-option v-for="item in $t('datadict.dvtHedgeType')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 客户名称 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresPosi.mainName')" prop='mainName'>
              <el-input v-model="formData.mainName" :disabled="true" />
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
  listDerivativeAccount,
  listFuturesContractCode
} from '@/api/frame/rm/derivative/futuresPosi'

export default {
  data() {
    return {
      updateFlg: '',
      status: false,
      loading: false,
      attributeGroupArr: [],
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      marketArr: [],
      derivativeAccountList: [],
      futuresContractCodeList: [],
      // 属性信息
      attrContentList: [],
      attrMap: {},
      rules: {
        tradingDay: [
          {
            required: this.type === 'add',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        derivativeAccount: [
          {
            required: this.type === 'add',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ],
        futuresContractCode: [
          {
            required: this.type === 'add',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ],
        posiDirection: [
          {
            required: this.type === 'add',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ],
        position: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        positionPrice: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        preSettlementPrice: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        settlementPrice: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        positionProfit: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        useMargin: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        hedgeFlag: [
          {
            required: this.type === 'add',
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
          this.$t('derivative.futuresPosi.title') +
          ' - ' +
          this.$t('biz.btn.add')
        )
      } else if (this.type === 'update') {
        return (
          this.$t('derivative.futuresPosi.title') +
          ' - ' +
          this.$t('biz.btn.update')
        )
      }
      return ''
    }
  },
  mounted() {
    // 初始化
    this.getData()
  },
  methods: {
    getData() {
      listDerivativeAccount().then(response => {
        this.derivativeAccountList = response.data
      })
      listFuturesContractCode().then(response => {
        this.futuresContractCodeList = response.data
      })
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
    // 期货账号与客户名称（主体名称）
    selectChange(newName) {
      if (newName === undefined || newName === null || newName === '') {
        this.formData.mainName = ''
        return
      }
      for (let i = 0; i < this.derivativeAccountList.length; i++) {
        if (this.derivativeAccountList[i].key === newName) {
          this.formData.mainName = this.derivativeAccountList[i].value
          break
        }
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
              // 检查结果不存在 执行保存操作
              if (this.type === 'add') {
                save(postData, this.func)
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.saveSuccess') // 提示新增成功
                      })
                    )
                    // 保存后关闭弹窗，true代表同时刷新父页面
                    this.$emit('close', true)
                  })
                  .catch(() => {})
              } else if (this.type === 'update') {
                update(postData, this.func)
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.updateSuccess') // 提示新增成功
                      })
                    )
                    // 保存后关闭弹窗，true代表同时刷新父页面
                    this.$emit('close', true)
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
