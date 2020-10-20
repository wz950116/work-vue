<template>
  <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" height='150' @current-change="selectData" @row-dblclick="handleDbclick">
    <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
    <el-table-column :width="120" :label="$t('strategy.plan.list.productCode')" prop="productName"></el-table-column>
    <el-table-column :width="120" :label="$t('strategy.plan.list.contractCode')" prop="contractName"></el-table-column>
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
    <el-table-column align='right' :width="120" :label="$t('strategy.plan.list.quantity')" prop="quantity">
      <template slot-scope='scope'>
        <span>{{scope.row.quantity | moneyFilter | thousands}}</span>
      </template>
    </el-table-column>
    <el-table-column align='right' :width="120" :label="$t('strategy.plan.list.floatRatio')" prop="floatRatio"></el-table-column>
    <el-table-column align='center' :width="200" :label="$t('strategy.plan.list.priceLimit')">
      <template slot-scope="scope">
        {{scope.row.minPrice | priceFilter | thousands}} ~ {{scope.row.maxPrice | priceFilter | thousands}}
      </template>
    </el-table-column>
    <el-table-column align='center' :width="200" :label="$t('strategy.plan.list.quantityLimit')">
      <template slot-scope="scope">
        {{scope.row.minQuantity | quantityFilter | thousands}} ~ {{scope.row.maxQuantity| quantityFilter | thousands}}
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
