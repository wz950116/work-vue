<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <main>
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='height' @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
          <el-table-column align='center' width="90" :label="$t('strategy.plan.list.itemClass')" prop="itemClass">
            <template slot-scope="scope">
              <span>{{scope.row.itemClass | dataDictFormat($t('datadict.itemClass'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('strategy.plan.list.productCode')" prop="productName"></el-table-column>
          <el-table-column width="120" :label="$t('strategy.plan.list.contractCode')" prop="contractName"></el-table-column>
          <el-table-column align='center' width="80" :label="$t('strategy.plan.list.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' width="80" :label="$t('strategy.plan.list.offset')" prop="offsetFlag">
            <template slot-scope="scope">
              <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align='right' width="120" :label="$t('strategy.plan.list.quantity')" prop="quantity">
            <template slot-scope="scope">
              {{scope.row.quantity | quantityFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column align='right' width="120" :label="$t('strategy.plan.list.floatRatio')" prop="floatRatio"></el-table-column>
          <el-table-column align='center' width="200" :label="$t('strategy.plan.list.priceLimit')">
            <template slot-scope="scope">
              {{scope.row.minPrice | priceFilter | thousands}} ~ {{scope.row.maxPrice | priceFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column align='center' width="200" :label="$t('strategy.plan.list.quantityLimit')">
            <template slot-scope="scope">
              {{scope.row.minQuantity | quantityFilter | thousands}} ~ {{scope.row.maxQuantity| quantityFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column width="90" :label="$t('strategy.plan.list.unitCode')" prop="unitCode">
            <template slot-scope="scope">
              <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
            </template>
          </el-table-column>
          <el-table-column width="90" :label="$t('strategy.plan.list.currencyCode')" prop="currencyName"></el-table-column>
          <el-table-column width="160" :label="$t('strategy.plan.list.remark')" prop="remark"></el-table-column>
        </el-table>
      </main>

      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="cancel">
          {{$t('biz.btn.close')}}
        </el-button>
        <el-button type='primary' v-db-click size="mini" @click="save">
          {{$t('biz.btn.confirm')}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      multipleSelection: {}
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.plan.dialog.title')
    }
  },
  props: {
    tableData: Array,
    height: {
      type: Number,
      default: 400
    }
  },
  methods: {
    handleDbclick(data) {
      this.$emit('confirm', data)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    cancel() {
      this.$emit('closeHandlerDialog')
    },
    save() {
      if (!this.multipleSelection) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.multipleSelection)
    }
  }
}
</script>
