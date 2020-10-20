<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '700px' : '850px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <!-- 顶部按钮 -->
      <el-row class='top-operate'>
        <el-button v-db-click size="mini" @click="cancel">
          <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
        </el-button>
        <el-button v-db-click size="mini" @click="confirmClick">
          <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
        </el-button>
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('biz.btn.exportData')" />
      </el-row>

      <main>
        <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='374'>
          <el-table-column align='center' type="index" width="50" :label='$t("table.id")' fixed></el-table-column>
          <!-- 期货合约  -->
          <el-table-column align='left' prop='futureContractNo' :label="$t('dataHq.futurePrice.form.futureContractNo')" min-width='150' show-overflow-tooltip></el-table-column>
          <!-- 报价日期  -->
          <el-table-column align='left' prop='pricingDate' :label="$t('dataHq.futurePrice.form.pricingDate')" min-width='150' show-overflow-tooltip>
            <template slot-scope='scope'>
              <span>{{scope.row.pricingDate | dateFormat}}</span>
            </template>
          </el-table-column>
          <!-- 价格  -->
          <el-table-column align='left' prop='price' :label="$t('dataHq.futurePrice.form.price')" min-width='150' show-overflow-tooltip></el-table-column>
        </el-table>
      </main>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import request from '@/utils/frame/base/request'

export default {
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440
        ? this.clientHeight - 500
        : this.clientHeight - 520 // 防止底部滚动条遮挡
    },
    titleName() {
      return this.$t('dataHq.futurePrice.form.import')
    }
  },
  props: {},
  methods: {
    // 保存 向后台返回数据 返回true则把数据带到列表页面
    confirmClick() {
      request({
        url: '/api/dd/future/price/importSave',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.tableData
        }
      }).then(request => {
        this.$notify(
          notifySuccess({
            msg: '期货行情导入成功'
          })
        )
        this.$emit('close')
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
        .catch(() => {})
    },
    // 文件校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 文件上传
    handleSuccess({ results, header }) {
      if (results) {
        this.pageLoading = true
        // 导入的数据不能为空
        if (results.length === 0) {
          this.showDialog = false
          this.$notify(
            notifyInfo({
              msg: this.$t('导入的文件数据为空!')
            })
          )
        } else {
          results.forEach(element => {
            const obj = {}
            obj.moduleCode = this.moduleCode
            element.futureContractNo = element['合约代码']
            if (element['报价日期']) {
              element.pricingDate = element['报价日期'].replace(
                RegExp('-', 'g'),
                ''
              )
            }
            if (element['价格']) {
              element.price = element['价格'].trim()
            }
            this.validate(element)
          })
          this.tableData = results
        }
      }
    },
    validate(element) {
      if (!element.futureContractNo) {
        element.result = element.result + '合约代码不能为空'
      }
      if (!element.pricingDate) {
        element.result = element.result + '报价日期不能为空'
      }
      if (!element.price) {
        element.result = element.result + '价格不能为空'
      }
    }
  }
}
</script>
