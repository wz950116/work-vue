<template>
  <div v-el-drag-dialog class="dialog-wrapper">
    <div class="dialog-container" type="mediumColumnsDialog">
      <!-- 头部 -->
      <title-contain :titleName="dlgTitle" @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <el-form class="header-form-inline" :model="formData" label-position="left" :rules="rules" ref="validateForm"
        :show-message="false">
        <el-row :gutter="20">
          <!-- 期货账号	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.derivativeAccount')" prop="derivativeAccount">
              <input-validate v-model.trim="formData.derivativeAccount" :placeholder="$t('biz.placeholder.input')"
                :disabled="true"></input-validate>
            </el-form-item>
          </el-col>
          <!-- 交易日期	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.tradingDay')" prop="tradingDay">
              <el-date-picker v-model="formData.tradingDay" type="date" format="yyyy-MM-dd" value-format="yyyyMMdd"
                :disabled="true"></el-date-picker>
            </el-form-item>
          </el-col>
          <!-- 上日结存	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.preBalance')" prop="preBalance">
              <input-formatter v-model.number="formData.preBalance" :max="999999999999.99" :min="-999999999999.99"
                :precision="2" :controls="false" type="thousands" size="mini"
                :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 资金存取	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.fundInOut')" prop="fundInOut">
              <input-formatter v-model.number="formData.fundInOut" :max="999999999999.99" :min="-999999999999.99"
                :precision="2" :controls="false" type="thousands" size="mini"
                :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 平仓盈亏	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.closeProfit')" prop="closeProfit">
              <input-formatter v-model.number="formData.closeProfit" :max="999999999999.99" :min="-999999999999.99"
                :precision="2" :controls="false" type="thousands" size="mini"
                :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓盈亏	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.positionProfit')" prop="positionProfit">
              <input-formatter v-model.number="formData.positionProfit" :max="999999999999.99" :min="-999999999999.99"
                :precision="2" :controls="false" type="thousands" size="mini"
                :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 手续费		 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.commission')" prop="commission">
              <input-formatter v-model.number="formData.commission" :max="999999999999.99" :min="0" :precision="2"
                :controls="false" type="thousands" size="mini" :placeholder="$t('biz.placeholder.input')">
              </input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓保证金	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.posiMargin')" prop="posiMargin">
              <input-formatter v-model.number="formData.posiMargin" :max="999999999999.99" :min="0" :precision="2"
                :controls="false" type="thousands" size="mini" :placeholder="$t('biz.placeholder.input')">
              </input-formatter>
            </el-form-item>
          </el-col>
          <!-- 可用资金	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.available')" prop="available">
              <input-formatter v-model.number="formData.available" :max="999999999999.99" :min="-999999999999.99"
                :precision="2" :controls="false" type="thousands" size="mini"
                :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 期末权益	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.balance')" prop="balance">
              <input-formatter v-model.number="formData.balance" :max="999999999999.99" :min="-999999999999.99"
                :precision="2" :controls="false" type="thousands" size="mini"
                :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 当日结存	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.reserve')" prop="reserve">
              <input-formatter v-model.number="formData.reserve" :max="999999999999.99" :min="-999999999999.99"
                :precision="2" :controls="false" type="thousands" size="mini"
                :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 风险度	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.riskDegree')" prop="riskDegree">
              <input-formatter v-model.number="formData.riskDegree" :controls="false" type="percent" size="mini"
                :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 客户名称	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futuresAccountBalance.mainName')" prop="mainName">
              <el-input v-model="formData.mainName" :disabled="true" />
            </el-form-item>
          </el-col>
          <!-- 期初标志 -->
          <el-col :span="6" v-show-control="'preliminaryFlag'">
            <el-form-item :label="$t('derivative.futuresAccountTrade.preliminaryFlag')" prop="preliminaryFlag">
              <el-checkbox-group v-model="formData.preliminaryFlag">
                <el-checkbox disabled></el-checkbox>
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
import TitleContain from '@/components/frame/TitleContain'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import {
  get as getData,
  update
} from '@/api/frame/rm/derivative/futuresAccountBalance'

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
      // 属性信息
      attrContentList: [],
      attrMap: {},
      rules: {
        fundInOut: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        closeProfit: [
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
        commission: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        posiMargin: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        available: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        balance: [
          {
            required: this.type !== 'view',
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        reserve: [
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
          this.$t('derivative.futuresAccountBalance.title') +
          ' - ' +
          this.$t('biz.btn.add')
        )
      } else if (this.type === 'update') {
        return (
          this.$t('derivative.futuresAccountBalance.title') +
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
    saveEdit() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          const postData = {
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
              if (this.type === 'update') {
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
          this.$emit('closeHandler')
        })
        .catch(() => {})
    }
  }
}
</script>
