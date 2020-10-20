<template>
  <div>

    <div>
      <div class='tabs-operate' style='margin-top:5px;' v-if="['add', 'update'].includes(type)">
        <el-button v-db-click size="mini" @click="addRow">
          <svg-icon icon-class="线性-增行"></svg-icon>增行
        </el-button>
        <el-button v-db-click size="mini" @click="deleteRow">
          <svg-icon icon-class="线性-删行"></svg-icon>删行
        </el-button>
      </div>
      <el-table stripe border height="150" highlight-current-row ref="strategyInfo" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @current-change="handleCurrentChange">
        <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>

        <el-table-column :label="$t('strategy.futureMatch.tab.canMatchLots')" width="120" prop="canMatchLots">
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
    </div>
    <planDetailDialog v-if="dialogVisible" :strategyNature="strategyNature" :planCode="planCode" :itemClass="itemClass" @closeHandlerDialog="dialogClose" @confirm="confirm"></planDetailDialog>

  </div>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import planDetailDialog from '@/views/frame/rm/strategy/futuresMatch/components/plan/planDetailDialog'
export default {
  components: {
    planDetailDialog
  },
  data() {
    return {
      tableData: [],
      currentRow: {},
      dialogVisible: false
    }
  },
  props: ['planCode', 'strategyNature', 'type', 'tradeBatchDto', 'itemClass'],
  mounted() {
    // 渲染表格数据
    this.getEditData()
  },
  methods: {
    // 获取初始化数据
    getEditData() {
      if (this.type === 'add') return
      if (JSON.stringify(this.tradeBatchDto) !== '{}') {
        this.tableData.push(this.tradeBatchDto)
      } else {
        this.tableData = []
      }
    },

    // 处理勾选后
    handleCurrentChange(val) {
      this.currentRow = val
    },
    // 增行
    addRow() {
      this.dialogVisible = true
    },
    // 删行
    deleteRow() {
      if (this.currentRow) {
        this.$confirm(
          this.$t('biz.msg.confirmDelete'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            this.tableData = []
          })
          .catch(() => { })
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(val) {
      this.dialogVisible = false
      this.tableData = []
      this.tableData.push(val)
      this.$parent.$parent.$parent.$parent.formData.tradeDetailDtoList = []
      this.$emit('itemClassChange', val.itemClass)
    }
  }
}
</script>
