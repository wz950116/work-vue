<template>
  <el-table style='border: 1px solid;' stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='height' @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
    <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
    <el-table-column width="120" :label="$t('strategy.strategyManagement.tab.productCode')" prop="productName"></el-table-column>
    <el-table-column width="80" :label="$t('strategy.strategyManagement.tab.direction')" prop="direction">
      <template slot-scope="scope">
        <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
      </template>
    </el-table-column>
    <el-table-column width="120" align="right" :label="$t('strategy.strategyManagement.tab.maxPostion')" prop="maxPostion">
      <template slot-scope="scope">
        {{scope.row.maxPostion | quantityFilter | thousands}}
      </template>
    </el-table-column>
    <el-table-column width="90" :label="$t('strategy.strategyManagement.tab.unitCode')" prop="unitCode">
      <template slot-scope="scope">
        <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
      </template>
    </el-table-column>
    <el-table-column width="140" :label="$t('strategy.strategyManagement.tab.valuationCode')" prop="valuationName"></el-table-column>
    <el-table-column width="160" :label="$t('strategy.strategyManagement.tab.remark')" prop="remark"></el-table-column>
    <el-table-column width="120" :label="item.columnTxt" :key="item.id" v-for="item in productItemInfo">
      <template slot-scope='scope'>
        {{scope.row[item.columnName]}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tableData: [],
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
          strategyCode: this.strategyCode,
          direction: this.direction,
          itemClass: this.itemClass
        },
        defaultSortString: 'id.asc'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.strategyManagement.tab.selectType')
    }
  },
  props: {
    strategyCode: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 400
    },
    itemClass: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.listData()
    this.initProductItem()
  },
  watch: {
    strategyCode(val) {
      this.listData()
    },
    direction(val) {
      this.listData()
    }
  },
  methods: {
    initProductItem() {
      request({
        url: '/api/sys/goodsCol/listAll',
        method: 'POST',
        data: {
          defaultSortString: 'columnName.asc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        }
      }).then(request => {
        request.data.forEach(e => {
          if (e.usingFlag === '0') {
            return
          }
          this.productItemInfo.push(e)
        })
      })
    },
    handleDbclick(val) {
      this.$emit('dbclick', val)
    },
    listData() {
      this.loading = true
      this.listQuery.data.direction = this.direction
      this.listQuery.data.strategyCode = this.strategyCode
      this.listQuery.data.itemClass = this.itemClass
      request({
        url: '/api/strg/strDetail/listByCode',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
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
      this.$emit('select', val)
    }
  }
}
</script>
