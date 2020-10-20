<template>
  <div class="app-container edit-page-style">
    <el-table :data="tableData" :key='tableKey' stripe border v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" class='table-content table-summary-style' ref="multipleTable" :height='tableHeight' @selection-change="handleSelectionChange">
      <el-table-column type="index" width="50" label=' '></el-table-column>
      <el-table-column prop='menuName' min-width="200" :label="$t('projSys.authorization.moduleName')"></el-table-column>
      <el-table-column prop='menuCode' min-width="150" :label="$t('projSys.authorization.moduleCode')"></el-table-column>
      <el-table-column :label="$t('projSys.authorization.authorizationType')" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.authorizationType | dataDictFormat($t('datadict.authorizationFlag'))}}</span>
        </template>
      </el-table-column>
      <el-table-column prop='expireDate' min-width="200" :label="$t('projSys.authorization.expireDate')"></el-table-column>
    </el-table>

    <!-- <div class='mainContainer'>
      <div class="mainLeft">
        <div @click="getList" :title="$t('biz.btn.refresh')">
          <svg-icon className='svg-fun-bottom' icon-class="线性-刷新"></svg-icon>
        </div>
        <div @click="handleDownload" :title="$t('biz.btn.export')">
          <svg-icon className='svg-fun-bottom' icon-class="线性-导出"></svg-icon>
        </div>
      </div>
    </div> -->

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import exportExcel from '@/utils/frame/base/downloadExcel'
import authApi from '@/api/proj/sys/authorizedMonitor'

export default {
  name: 'showLicense',
  data() {
    return {
      colMap: {
        menuCode: this.$t('projSys.authorization.moduleCode'),
        menuName: this.$t('projSys.authorization.moduleName'),
        authorizationType: this.$t('projSys.authorization.authorizationType'),
        expireDate: this.$t('projSys.authorization.expireDate')
      },
      tableKey: 0,
      loading: false,
      status: false,
      tableData: [],
      multipleSelection: [],
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      }
    }
  },

  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1440 ? this.clientHeight - 150 : this.clientHeight - 180 // 防止底部滚动条遮挡
    }
  },
  watch: {
    $route(to, from) {
      // 保存成功刷新列表
      if (this.$route.params.refresh) {
        this.getList()
      }
    },
    tableHeaders() {
      this.tableKey++
    }
  },
  mounted() {
    this.getList()
    authApi.getAuthorizedMonitorInfoList()
  },
  methods: {
    getList() {
      this.loading = true
      this.func.funcOperation = this.$t('biz.btn.search')
      authApi
        .getList()
        .then(response => {
          this.loading = false
          this.tableData = response.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 通过操作dom更改选中行底色
      this.$nextTick(() => {
        $(this.$refs.multipleTable.$el)
          .find('.el-table__row td')
          .removeClass('select-row-bg-color')
        $(this.$refs.multipleTable.$el)
          .find('.is-checked')
          .parents('.el-table__row')
          .find('td')
          .addClass('select-row-bg-color')
      })
    },
    // 导出表
    exportfunc() {
      this.loading = true
      this.listQuery.isPage = false
      this.func.funcOperation = this.$t('biz.btn.search')
      return authApi.getList(this.listQuery, this.func)
    },
    callBackfunc() {
      this.listQuery.isPage = true
      this.loading = false
    },
    handleDownload() {
      exportExcel({
        fileName: this.$t('sys.authorization.authorizationPeriod'),
        header: [this.$t('sys.authorization.moduleCode'), this.$t('sys.authorization.moduleName'), this.$t('sys.authorization.authorizationType'), this.$t('sys.authorization.authorizationPeriod')],
        filterVal: ['moduleCode', 'moduleName', 'authorizationType', 'authorizationPeriod'],
        exportfunc: this.exportfunc,
        callBackfunc: this.callBackfunc
      })
    }
  }
}
</script>
