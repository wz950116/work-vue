<template>
  <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" height='150' @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
    <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
    <el-table-column width="120" :label="$t('strategy.spotTrade.list.matchQuantity')" prop="matchQuantity"></el-table-column>
    <el-table-column width="90" :label="$t('strategy.strategyManagement.tab.itemClass')" prop="itemClass">
      <template slot-scope="scope">
        <span>{{scope.row.itemClass | dataDictFormat($t('datadict.itemClass'))}}</span>
      </template>
    </el-table-column>
    <el-table-column width="120" :label="$t('strategy.strategyManagement.tab.productCode')" prop="productName"></el-table-column>
    <el-table-column width="80" :label="$t('strategy.strategyManagement.tab.direction')" prop="direction">
      <template slot-scope="scope">
        <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
      </template>
    </el-table-column>
    <el-table-column width="120" align="right" :label="$t('strategy.strategyManagement.tab.quantity')" prop="quantity">
      <template slot-scope='scope'>
        <span>{{scope.row.quantity | quantityFilter | thousands}}</span>
      </template>
    </el-table-column>
    <el-table-column width="90" :label="$t('strategy.strategyManagement.tab.unitCode')" prop="unitCode">
      <template slot-scope="scope">
        <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
      </template>
    </el-table-column>
    <el-table-column width="120" align="right" :label="$t('strategy.strategyManagement.tab.maxPostion')" prop="maxQuantity">
      <template slot-scope='scope'>
        <span>{{scope.row.maxQuantity | quantityFilter | thousands}}</span>
      </template>
    </el-table-column>
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
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.strategyManagement.tab.selectType')
    }
  },
  props: {
    tableData: Array,
    match: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productItemInfo: []
    }
  },
  mounted() {
    this.initProductItem()
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
    handleDbclick(data) {
      this.$emit('dbclick', data)
    },
    handleSelectionChange(val) {
      this.$emit('select', val)
    }
  }
}
</script>
