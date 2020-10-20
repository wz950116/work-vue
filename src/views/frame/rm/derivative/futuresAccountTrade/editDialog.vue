<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='mediumColumnsDialog'>
      <!-- 头部 -->
      <!-- <TitleContain v-if="'view'==this.type" :titleName='dlgTitle' @TitleFun="$emit('closeHandler')" />
      <TitleContain v-else :titleName='dlgTitle' @TitleFun="cancel" /> -->
      <title-contain :titleName='dlgTitle' @TitleFun="$emit('closeHandler')" />

      <!-- 内容 -->
      <el-form class="header-form-inline" :model="formData" label-position="left" :rules='rules' ref="validateForm" :show-message="false">
        <el-row :gutter="20">
          <!-- 交易日期 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.tradingDay')" prop='tradingDay'>
              <el-date-picker v-model="formData.tradingDay" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd" :placeholder="$t('biz.placeholder.dateInput')" :disabled="type !== 'add'"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 期货账号 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.derivativeAccount')" prop='derivativeAccount'>
              <el-select clearable v-model="formData.derivativeAccount" filterable :placeholder="$t('biz.placeholder.choose')" @change="selectChange" :disabled="type !== 'add'">
                <el-option v-for="item in derivativeAccountList" :key="item.key" :label="item.key" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 合约 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.futuresContractCode')" prop='futuresContractCode'>
              <el-select clearable v-model="formData.futuresContractCode" filterable :placeholder="$t('biz.placeholder.choose')" :disabled="type !== 'add'" @change="amountChange">
                <el-option v-for="item in futuresContractCodeList" :key="item.id" :label="item.futuresContractCodeName" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 委托单号 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.orderSysId')" prop='orderSysId'>
              <input-validate v-model.trim="formData.orderSysId" :placeholder="$t('biz.placeholder.input')">
              </input-validate>
            </el-form-item>
          </el-col>
          <!-- 方向 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.direction')" prop='direction'>
              <el-select v-model="formData.direction" clearable filterable placeholder="" :disabled="type==='view'">
                <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 开/平 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.offsetFlag')" prop='offsetFlag'>
              <el-select v-model="formData.offsetFlag" clearable filterable placeholder="" :disabled="type==='view'">
                <el-option v-for="item in $t('datadict.derivativeOffset')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 价格 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.price')" prop='price'>
              <input-formatter v-model.number="formData.price" :max='999999999999.99' :min='0' :precision='4' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')" @change="amountChange"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 数量 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.volume')" prop='volume'>
              <input-formatter v-model.number="formData.volume" :max='999999999999' :min='0' :precision='0' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')" @change="amountChange"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 成交金额 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.amount')" prop='amount'>
              <input-formatter v-model.number="formData.amount" :max='999999999999.99' :min='0' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')">
              </input-formatter>
            </el-form-item>
          </el-col>
          <!-- 手续费 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.commission')" prop='commission'>
              <input-formatter v-model.number="formData.commission" :max='999999999999.99' :min='0' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')">
              </input-formatter>
            </el-form-item>
          </el-col>
          <!-- 成交时间 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.tradeTime')" prop='tradeTime'>
              <el-time-picker v-model="formData.tradeTime" value-format="HHmmss" :placeholder="$t('biz.placeholder.dateInput')"></el-time-picker>
            </el-form-item>
          </el-col>
          <!-- 成交日期 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.tradeDate')" prop='tradeDate'>
              <el-date-picker v-model="formData.tradeDate" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd" :placeholder="$t('biz.placeholder.dateInput')"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 投机/套保 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.hedgeFlag')" prop='hedgeFlag'>
              <el-select v-model="formData.hedgeFlag" clearable filterable placeholder="" :disabled="type==='view'">
                <el-option v-for="item in $t('datadict.dvtHedgeType')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 成交单号 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.tradeId')" prop='tradeId'>
              <el-input v-model.trim="formData.tradeId" :placeholder="$t('biz.placeholder.input')" :disabled="true" />
            </el-form-item>
          </el-col>
          <!-- 主体名称 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.mainName')" prop='mainName'>
              <el-input v-model="formData.mainName" :disabled="true" />
            </el-form-item>
          </el-col>
          <!-- 期初标志 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountTrade.preliminaryFlag')" prop='preliminaryFlag'>
              <el-checkbox-group v-model="preliminaryFlag">
                <el-checkbox :disabled="type==='view' || openFlag"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click="cancel" size="mini">{{ $t('biz.btn.cancel') }}</el-button>
        <el-button type="primary" @click="saveEdit" v-if="type!=='view'" v-db-click size="mini">{{ $t('biz.btn.save') }}
        </el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import TitleContain from '@/components/frame/TitleContain'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import {
  get as getData,
  save,
  update,
  listDerivativeAccount,
  listFuturesContractCode
} from '@/api/frame/rm/derivative/futuresAccountTrade'
import sysInitSetting from '@/api/proj/sys/sysInitSetting'
export default {
  data() {
    return {
      openFlag: false,
      preliminaryFlag: false,
      updateFlg: '',
      status: false,
      loading: false,
      attributeGroupArr: [],
      contractMultiplier: {},
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
            required: this.type !== 'update',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        derivativeAccount: [
          {
            required: this.type === 'add',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        futuresContractCode: [
          {
            required: this.type === 'add',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        direction: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ],
        offsetFlag: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'change'
          }
        ],
        price: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        volume: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        amount: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        commission: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        tradeDate: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        hedgeFlag: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
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
          this.$t('derivative.futuresAccountTrade.title') +
          ' - ' +
          this.$t('biz.btn.add')
        )
      } else if (this.type === 'update') {
        return (
          this.$t('derivative.futuresAccountTrade.title') +
          ' - ' +
          this.$t('biz.btn.update')
        )
      }
      return ''
    }
  },
  mounted() {
    // 初始化
    this.initData()
    if (this.type !== 'add' && this.type !== 'copy') {
      this.getData()
    }
    if (this.type === 'copy') {
      this.type = 'add'
      this.getData()
    }
    this.getContractInfo()
    // 获取期初设置开关是否打开 true 代表打开
    sysInitSetting.getFlag().then(response => {
      this.openFlag = response.data
    })
  },
  methods: {
    initData() {
      listDerivativeAccount().then(response => {
        this.derivativeAccountList = response.data
      })
      listFuturesContractCode().then(response => {
        this.futuresContractCodeList = response.data
      })
    },
    getContractInfo() {
      request({
        url: '/api/dd/futuresContract/list',
        method: 'POST',
        data: {
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        }
      }).then(request => {
        for (var i = 0; i < request.data.length; i++) {
          if (request.data[i].contractMultiplier) {
            this.contractMultiplier[request.data[i].futuresContractCode] =
              request.data[i].contractMultiplier
          }
        }
      })
    },
    getData() {
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
          if (this.type === 'add') {
            this.formData.id = ''
            this.$set(this.formData, 'tradeId', '')
          }
          if (this.formData.preliminaryFlag === '1') {
            this.preliminaryFlag = true
          } else {
            this.preliminaryFlag = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 期货账号与客户名称（主体名称）
    selectChange(newName) {
      if (newName === undefined || newName === null || newName === '') {
        this.formData.mainName = ''
        return
      }
      for (let i = 0; i < this.derivativeAccountList.length; i++) {
        if (this.derivativeAccountList[i].key === newName) {
          this.formData.mainName = this.derivativeAccountList[i].value || ''
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
              if (this.preliminaryFlag) {
                this.formData.preliminaryFlag = '1'
              } else {
                this.formData.preliminaryFlag = '0'
              }
              if (this.type === 'add') {
                save(postData, this.func)
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.insertSuccess') // 提示新增成功
                      })
                    )
                    // 保存后关闭弹窗，true代表同时刷新父页面
                    this.$emit('closeHandler', true)
                  })
                  .catch(() => { })
              } else if (this.type === 'update') {
                update(postData, this.func)
                  .then(response => {
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.updateSuccess') // 提示新增成功
                      })
                    )
                    // 保存后关闭弹窗，true代表同时刷新父页面
                    this.$emit('closeHandler', true)
                  })
                  .catch(() => { })
              }
            })
            .catch(() => { })
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
          this.$emit('closeHandler')
        })
        .catch(() => { })
    },
    amountChange() {
      var multiplier = 1
      var lots = 0
      var price = 0
      if (this.contractMultiplier[this.formData.futuresContractCode]) {
        multiplier = this.contractMultiplier[this.formData.futuresContractCode]
      }
      if (this.formData.volume) {
        lots = this.formData.volume
      }
      if (this.formData.price) {
        price = this.formData.price
      }
      this.$set(
        this.formData,
        'amount',
        parseFloat(lots) * parseFloat(price) * parseFloat(multiplier)
      )
    }
  }
}
</script>
