<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='mediumColumnsDialog'>
      <!-- 头部 -->
      <title-contain :titleName='dlgTitle' @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <el-form class="header-form-inline" :model="formData" label-position="left" :rules='rules' ref="validateForm" :show-message="false">
        <el-row :gutter="20">
          <!-- 子账号	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futruesSubAccount.derivativeSubAccount')" prop='derivativeSubAccount'>
              <input-validate v-model.trim="formData.derivativeSubAccount" :placeholder="$t('biz.placeholder.input')"></input-validate>
            </el-form-item>
          </el-col>
          <!-- 平仓盈亏	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futruesSubAccount.closeProfit')" prop='closeProfit'>
              <input-formatter v-model.number="formData.closeProfit" :max='999999999999.9999' :min='-999999999999.99' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓盈亏	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futruesSubAccount.positionProfit')" prop='positionProfit'>
              <input-formatter v-model.number="formData.positionProfit" :max='999999999999.9999' :min='-999999999999.99' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 手续费		 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futruesSubAccount.commission')" prop='commission'>
              <input-formatter v-model.number="formData.commission" :max='999999999999.9999' :min='0' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 持仓保证金	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futruesSubAccount.posiMargin')" prop='posiMargin'>
              <input-formatter v-model.number="formData.posiMargin" :max='999999999999.9999' :min='0' :precision='2' :controls='false' type='thousands' size="mini" :placeholder="$t('biz.placeholder.input')"></input-formatter>
            </el-form-item>
          </el-col>
          <!-- 交易日期	 -->
          <el-col :span="8">
            <el-form-item :label="$t('derivative.futruesSubAccount.tradingDay')" prop='tradingDay'>
              <el-date-picker v-model="formData.tradingDay" :picker-options='dateStartBefore' type="date" format="yyyy-MM-dd" value-format="yyyyMMdd" :placeholder="$t('biz.placeholder.dateInput')"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click="cancel" size="mini">{{ $t('biz.btn.cancel') }}</el-button>
        <el-button type="primary" @click="saveEdit" v-db-click size="mini">{{ $t('biz.btn.save') }}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TitleContain from '@/components/frame/TitleContain'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import { get, update } from '@/api/frame/rm/derivative/futruesSubAccount'

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
      // 属性信息
      dateStartBefore: {
        // disabledDate(time) {
        //   return new Date().getTime() + 24 * 60 * 60 * 1000 < time.getTime()
        // }
      },
      marketArr: [],
      // 属性信息
      attrContentList: [],
      attrMap: {},
      rules: {
        derivativeSubAccount: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        closeProfit: [
          {
            required: true,
            message: this.$t('validateMsg.requireSelect'),
            trigger: 'blur'
          }
        ],
        positionProfit: [
          {
            required: true,
            message: this.$t('validateMsg.requireSelect'),
            trigger: 'blur'
          }
        ],
        commission: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        posiMargin: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ],
        tradingDay: [
          {
            required: true,
            message: this.$t('validateMsg.notBlank'),
            trigger: 'blur'
          }
        ]
      },
      formData: {}
    }
  },
  props: ['id'],
  components: {
    TitleContain
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    // 根据传参，显示不同的弹窗名称
    dlgTitle() {
      return (
        this.$t('derivative.futruesSubAccount.title') +
        ' - ' +
        this.$t('biz.btn.update')
      )
    }
  },
  mounted() {
    // 初始化
    this.getData()
  },
  methods: {
    getData() {
      get(
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
    },

    saveEdit() {
      // element验证参数
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
          ).then(() => {
            update(postData, this.func)
              .then(() => {
                this.$notify(
                  notifySuccess({
                    msg: this.$t('biz.msg.updateSuccess') // 提示新增成功
                  })
                )
                // 保存后关闭弹窗，true代表同时刷新父页面
                this.$emit('closeHandler', true)
              })
              .catch(() => {})
          })
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
