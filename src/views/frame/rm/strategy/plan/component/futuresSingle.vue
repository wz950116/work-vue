<template>
  <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" height='150' @current-change="selectData" @row-dblclick="handleDbclick">
    <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
    <el-table-column v-if="match" :width="120" :label="$t('strategy.spotTrade.list.matchQuantity')" prop="matchQuantity">
      <template slot-scope="scope">
        <input-formatter :min='0' type='thousands' :precision='4' v-model="scope.row.matchQuantity" size="mini"></input-formatter>
      </template>
    </el-table-column>
    <el-table-column :width="120" :label="$t('strategy.plan.list.productCode')" prop="productName"></el-table-column>
    <el-table-column :width="120" :label="$t('strategy.plan.list.contractCode')" prop="contractCode"></el-table-column>
    <el-table-column align='center' :width="80" :label="$t('strategy.plan.list.direction')" prop="direction">
      <template slot-scope="scope">
        <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
      </template>
    </el-table-column>
    <el-table-column align='center' :width="80" :label="$t('strategy.plan.list.offset')" prop="offsetFlag">
      <template slot-scope="scope">
        <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
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
    <el-table-column :width="160" :label="$t('strategy.plan.list.remark')" prop="remark"></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: Array,
    height: {
      type: Number,
      default: 400
    }
  },
  methods: {
    handleDbclick(data) {
      this.$emit('dbclick', data)
    },
    selectData(val) {
      this.$emit('select', val)
    }
  }
}
</script>
