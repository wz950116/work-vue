<template>
  <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" height='150' @current-change="selectData" @row-dblclick="handleDbclick">
    <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
    <el-table-column v-if="match" :width="120" :label="$t('strategy.spotTrade.list.matchQuantity')" prop="matchQuantity"></el-table-column>
    <el-table-column :width="120" :label="$t('strategy.plan.list.productCode')" prop="productName"></el-table-column>
    <el-table-column align='center' :width="80" :label="$t('strategy.plan.list.direction')" prop="direction">
      <template slot-scope="scope">
        <span>{{scope.row.direction | dataDictFormat($t('datadict.spotDirection'))}}</span>
      </template>
    </el-table-column>
    <el-table-column align='center' :width="200" :label="$t('strategy.plan.list.priceLimit')">
      <template slot-scope="scope">
        {{scope.row.minPrice}} ~ {{scope.row.maxPrice}}
      </template>
    </el-table-column>
    <el-table-column align='center' :width="200" :label="$t('strategy.plan.list.quantityLimit')">
      <template slot-scope="scope">
        {{scope.row.minQuantity}} ~ {{scope.row.maxQuantity}}
      </template>
    </el-table-column>
    <el-table-column :width="90" :label="$t('strategy.plan.list.unitCode')" prop="unitCode">
      <template slot-scope="scope">
        <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
      </template>
    </el-table-column>
    <el-table-column :width="90" :label="$t('strategy.plan.list.currencyCode')" prop="currencyName"></el-table-column>
    <el-table-column width="120" :label="item.columnTxt" :key="item.id" v-for="item in productItemInfo">
      <template slot-scope='scope'>
        {{scope.row[item.columnName]}}
      </template>
    </el-table-column>
    <el-table-column :width="160" :label="$t('strategy.plan.list.remark')" prop="remark"></el-table-column>
  </el-table>
</template>

<script>
import request from '@/utils/frame/base/request'

export default {
  props: {
    tableData: Array,
    height: {
      type: Number,
      default: 400
    },
    match: {
      type: Boolean,
      default: false
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
    handleDbclick(data) {
      this.$emit('dbclick', data)
    },
    selectData(val) {
      this.$emit('select', val)
    }
  }
}
</script>
