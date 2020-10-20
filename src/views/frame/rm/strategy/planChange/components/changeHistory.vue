<template>
  <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='150'>
    <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
    <el-table-column :width="120" :label="$t('strategy.plan.list.changeUserName')" prop="changeUserName"></el-table-column>
    <el-table-column align="center" :width="120" :label="$t('strategy.plan.list.changeDate')" prop="changeDate">
      <template slot-scope="scope">
        {{scope.row.changeDate | dateFormat("yyyy-mm-dd")}}
      </template>
    </el-table-column>
    <el-table-column :width="300" :label="$t('strategy.plan.list.changeReason')" prop="changeReason"></el-table-column>
  </el-table>
</template>

<script>
import request from '@/utils/frame/base/request'

export default {
  props: {
    planCode: String
  },
  watch: {
    planCode() {
      this.listData()
    }
  },
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      tableData: [],
      loading: true,
      height: 200,
      listQuery: {
        current: 1,
        size: 20,
        isPage: false,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          planCode: this.planCode,
          auditStatus: '3'
        },
        defaultSortString: 'id.asc'
      }
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.listQuery.data.planCode = this.planCode
      this.loading = true
      request({
        url: '/api/strategy/strgPlanChg/list',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
    }
  }
}
</script>
