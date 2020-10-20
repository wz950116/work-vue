<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <header style='border-radius:5px;'>
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('data.warning.warningName')" prop="warningName">
                <input-validate v-model="listQuery.data.warningName" :clearable='true'></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('data.warning.triggerType')" prop='triggerType'>
                <el-select v-model="listQuery.data.triggerType" :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="item in $t('datadict.triggerType')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('biz.lbl.usingFlag')" prop='usingFlag'>
                <el-select v-model="listQuery.data.usingFlag" :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="item in $t('datadict.usingFlag')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn" v-permission="['query']">
            <el-button type="primary" @click="listData" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
          <!-- 展开收起 -->
          <div class='expand' @click='expand' v-show='false'>
            <i v-if='expandStatus' class='el-icon-arrow-up'></i>
            <i v-else class='el-icon-arrow-down'></i>
          </div>
        </el-form>
      </header>

      <main>
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="375" :element-loading-text="$t('route.load')" :data="tableData" @current-change="currentChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column width="120" :label="$t('data.warning.warningName')" prop="warningName"></el-table-column>
          <el-table-column width="120" :label="$t('data.warning.warningCode')" prop="warningCode"></el-table-column>
          <el-table-column align="center" width="100" :label="$t('data.warning.triggerType')" prop="triggerType">
            <template slot-scope="scope">
              <span>{{scope.row.triggerType | dataDictFormat($t('datadict.triggerType'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="120" :label="$t('data.warning.triggerTime')" prop="triggerTime"></el-table-column>
          <el-table-column align="center" width="100" :label="$t('data.warning.usingFlag')" prop="usingFlag">
            <template slot-scope="scope">
              <span>{{scope.row.usingFlag | dataDictFormat($t('datadict.usingFlag'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('platform.menu.moduleCode')" prop="moduleCode"></el-table-column>
          <el-table-column width="300" :label="$t('data.warning.remark')" prop="remark"></el-table-column>
        </el-table>

        <!-- 底部 -->
        <div class='bottom-operate'>
          <!-- 分页 -->
          <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </main>

      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="cancel">
          {{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type='primary' v-db-click size="mini" @click="save">
          {{$t('biz.btn.choose')}}
        </el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {},
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      tableData: [],
      selectData: null,
      total: 0,
      loading: true,
      productItemInfo: [],
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {

        },
        defaultSortString: 'id.asc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('预警关联')
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true
      request({
        url: '/api/warn/warning/list',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
    },
    handleDbclick(data) {
      if (this.match) {
        this.$emit('confirm', [data])
      } else {
        this.$emit('confirm', data)
      }
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (this.selectData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.selectData)
    },
    // 页码跳转
    handleSizeChange(val) {
      this.listQuery.size = val
      this.listData()
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.listData()
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    currentChange(val) {
      this.selectData = val
    },
    // 展开收起
    expand() {
      this.expandStatus = !this.expandStatus
      this.tableComputed()
    },
    tableComputed() {
      this.$nextTick(() => {
        const getElHeadHeight = window.getComputedStyle(document.getElementById('elHead')).height.split('px')[0]
        if (this.$parent.$refs.qmTable) {
          this.$parent.$refs.qmTable.tableHeight = this.clientWidth < 1366 ? (this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 188 : this.clientHeight - getElHeadHeight - 158) : this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 172 : this.clientHeight - getElHeadHeight - 142
        }
      })
    }
  }
}
</script>
