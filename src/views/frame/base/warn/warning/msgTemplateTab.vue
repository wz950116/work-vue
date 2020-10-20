<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" type='primary' @click='confirm()'>
        <svg-icon icon-class="线性-保存"></svg-icon>{{ $t('biz.btn.save') }}
      </el-button>
      <el-button v-db-click size="mini" @click='clear()'>
        <svg-icon icon-class="线性-清除"></svg-icon>{{ $t('biz.btn.clear') }}
      </el-button>
    </div>
    <el-form :inline="true" class="header-form-inline" label-position="left" style='margin-top:3px;'>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :label="$t('msg.templet.templetTitle')" prop='templetTitle'>
            <el-input v-model="tmplObj.msgTitle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('msg.templet.templetContent')" prop='templetContent'>
            <el-input v-model="tmplObj.msgTemplate"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('msg.templet.templetExtend')" prop='productName'>
            <el-input v-model="tmplObj.targetUrl"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="demo" prop='demo'>
            <el-input vaue=" " placeholder='list例子：<#list dataList as item> 【${item.letterCreditNo}】 【${item.dueDate}】，</#list>' :disabled="true" type="textarea" :rows="4"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// 调用Vue全局过滤器
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      loading: false,
      tmplObj: {
        warningCode: '',
        msgTemplate: '',
        id: ''
      }
    }
  },
  props: {
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  created() {
    this.tmplObj.warningCode = this.param.code
    this.loadTemplate()
  },
  methods: {
    clear() {
      this.tmplObj.msgTemplate = ''
    },
    // 初始化数据
    loadTemplate() {
      this.loading = true
      request({
        url: '/api/warn/msgTmpl/getByWarningId',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.param.code
        }
      })
        .then(response => {
          if (response.data) {
            this.tmplObj = response.data
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 更新
    confirm() {
      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          request({
            url: '/api/warn/msgTmpl/save',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.save'),
              data: this.tmplObj
            }
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: this.$t('biz.msg.saveSuccess') }))
              this.loadTemplate()
            })
            .catch(() => {})
        })
        .catch(() => {})
    }
  }
}
</script>
