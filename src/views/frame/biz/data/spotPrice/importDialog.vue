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
          <!-- 价格项  -->
          <el-table-column align='left' prop='priceItemName' :label="$t('data.spotPrice.list.priceItemName')" min-width='150' show-overflow-tooltip></el-table-column>
          <!-- 报价日期  -->
          <el-table-column align='center' prop='pricingDate' :label="$t('data.spotPrice.list.pricingDate')" min-width='100' show-overflow-tooltip>
            <template slot-scope='scope'>
              <span>{{scope.row.pricingDate | dateFormat}}</span>
            </template>
          </el-table-column>
          <!-- 价格  -->
          <el-table-column align='right' prop='price' :label="$t('data.spotPrice.list.price')" min-width='120' show-overflow-tooltip></el-table-column>
          <el-table-column prop='result' :label="$t('data.spotPrice.list.reason')" min-width='150'></el-table-column>
        </el-table>
      </main>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyError, notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
// import { numFormat } from '@/utils/frame/base/validate'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'

export default {
  name: '',
  components: {
    UploadExcelComponent
  },
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      tableData: [],
      loading: false,
      currentRow: null,
      // 属性信息
      attrContent: [],
      attrContentList: [],
      attrMap: {},
      attrId: '',
      listQuery: {
        data: {},
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.save')
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440 ? this.clientHeight - 500 : this.clientHeight - 520 // 防止底部滚动条遮挡
    },
    titleName() {
      return this.$t('data.spotPrice.tab.importDialog')
    }
  },
  props: {
    data: [String, Array]
  },
  methods: {
    // 保存 向后台返回数据 返回true则把数据带到列表页面
    confirmClick() {
      for (var i in this.tableData) {
        var exposureData = this.tableData[i]
        if (exposureData.preliminaryFlag) {
          exposureData.preliminaryFlag = '1'
        } else {
          exposureData.preliminaryFlag = '0'
        }
        if (exposureData.result) {
          this.$notify(
            notifyError({
              msg: '第' + (parseInt(i) + 1) + '条' + exposureData.result + ',无法保存!'
            })
          )
          return
        }
      }

      this.listQuery.data = this.data
      request({
        url: '/api/dd/spot/price/importSave',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.tableData
        }
      }).then(request => {
        this.$notify(
          notifySuccess({
            msg: this.$t('spotProj.exposure.msg.importSuccess')
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
        .catch(() => { })
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
            // const obj = {}
            element.priceItemName = element[this.$t('data.spotPrice.list.priceItemName')]
            element.pricingDate = toolUtil.dateFormateToYYYYMMDD(new Date(element[this.$t('data.spotPrice.list.pricingDate')]))
            if (element[this.$t('data.spotPrice.list.price')]) {
              element.price = element[this.$t('data.spotPrice.list.price')].trim()
            }

            this.validate(element)
          })

          this.tableData = results
        }
      }
    },
    validate(element) {
      if (!element.priceItemName) {
        element.result = '价格项不能为空'
      }
      if (!element.pricingDate) {
        element.result = '报价日期不能为空'
      }
      if (!element.price) {
        element.result = '价格不能为空'
      }
    }
  }
}
</script>
