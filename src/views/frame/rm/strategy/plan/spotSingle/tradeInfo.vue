<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update','copy','change','changeUpdate'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update','copy','change','changeUpdate'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
      </el-button>
    </div>
    <el-table stripe border height="150" highlight-current-row ref="buyMultipleTable" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @current-change="tableDataChange">
      <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
      <el-table-column :width="120" :label="$t('strategy.plan.list.productCode')" prop="productCode">
        <template slot-scope="scope">
          <base-select v-model="scope.row.productCode" :attrs="{data: 'DD_PRODUCT', disabled:true ,filterable: true}" size="mini"></base-select>
        </template>
      </el-table-column>
      <el-table-column :width="80" :label="$t('strategy.plan.list.direction')" prop="direction">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.plan.list.direction')}}
          <span style='color:#f56c6c;' v-if="!priceDisabled" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select v-model="scope.row.direction" :disabled="disabled" :clearable="true" :placeholder="$t('biz.placeholder.choose')" size="mini">
            <el-option v-for="item in $t('datadict.spotDirection')" :key="item.value" :label="item.label" :value="item.value" size="mini"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :width="250" :label="$t('strategy.plan.list.priceLimit')">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.plan.list.priceLimit')}}
          <span style='color:#f56c6c;' v-if="!priceDisabled" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-row :gutter="0" style='width:100%;'>
            <el-col :span="12">
              <input-formatter :disabled="disabled" :min='0' :max='scope.row.maxPrice || 999999999999.99' type='thousands' :precision='2' v-model="scope.row.minPrice" size="mini"></input-formatter>
            </el-col>
            <el-col :span="12">
              <input-formatter :disabled="disabled" :min='scope.row.minPrice || 0' :max='999999999999.99' type='thousands' :precision='2' v-model="scope.row.maxPrice" size="mini"></input-formatter>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :width="250" :label="$t('strategy.plan.list.quantityLimit')">
        <template slot="header" slot-scope="scope">
          {{$t('strategy.plan.list.quantityLimit')}}
          <span style='color:#f56c6c;' v-if="!priceDisabled" :data-header='scope'>*</span>
        </template>
        <template slot-scope="scope">
          <el-row :gutter="0" style='width:100%;'>
            <el-col :span="12">
              <input-formatter :min='0' :max='scope.row.maxQuantity || 999999999999.99' type='thousands' :precision='2' v-model="scope.row.minQuantity" size="mini"></input-formatter>
            </el-col>
            <el-col :span="12">
              <input-formatter :min='scope.row.minQuantity || 0' :max='999999999999.99' type='thousands' :precision='2' v-model="scope.row.maxQuantity" size="mini"></input-formatter>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :width="90" :label="$t('strategy.plan.list.unitCode')" prop="unitCode">
        <template slot-scope="scope">
          <el-select v-model="scope.row.unitCode" :disabled="true" :clearable="true" :placeholder="$t('biz.placeholder.choose')" size="mini">
            <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('strategy.strategyManagement.tab.valuationCode')" width="140">
        <template slot-scope="scope">
          <base-select size="mini" v-model="scope.row.valuationCode" :attrs="{data: 'DD_PRICE_ITEM',disabled:true}"></base-select>
        </template>
      </el-table-column> -->
      <el-table-column :width="90" :label="$t('strategy.plan.list.currencyCode')" prop="currencyCode">
        <template slot-scope="scope">
          <base-select v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY', disabled:disabled}" size="mini"></base-select>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="item.columnTxt" :key="item.id" v-for="item in productItemInfo">
        <template slot-scope='scope'>
          {{scope.row[item.columnName]}}
        </template>
      </el-table-column>
      <el-table-column :width="160" :label="$t('strategy.plan.list.remark')" prop="remark">
        <template slot-scope="scope">
          <input-validate v-model="scope.row.remark" size="mini"></input-validate>
        </template>
      </el-table-column>
    </el-table>

    <strategyDetailDialog v-if="dialogVisible" :strategyNature="strategyNature" :strategyCode="strategyCode" @close="dialogClose" @confirm="dialogConfirm"></strategyDetailDialog>
  </div>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import strategyDetailDialog from '@/views/frame/rm/strategy/plan/strategyDetailDialog'
import request from '@/utils/frame/base/request'

export default {
  components: {
    strategyDetailDialog
  },
  props: {
    strgEquation: {
      type: String,
      default: ''
    },
    strategyNature: {
      type: String,
      default: ''
    },
    strategyCode: {
      type: String,
      default: ''
    },
    maxShare: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      multipleSelection: [],
      currentRow: {},
      productItemInfo: [],
      dialogVisible: false
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
    strgEquationChange(value) {
      this.$emit('strgEquationChange', value)
    },
    // 增行
    addRow() {
      if (this.strategyCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.plan.msg.strategyFirst')
          })
        )
        return
      }
      this.dialogVisible = true
    },
    // 删行
    deleteRow() {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        this.tableData.splice(this.tableData.indexOf(this.currentRow), 1)
        this.currentRow = null
      })
    },
    tableDataChange(val) {
      this.currentRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    clearData() {
      this.tableData = []
    },
    dialogConfirm(data) {
      var obj = data
      obj.id = null

      obj.maxQuantity = this.maxShare * data.quantity
      obj.minQuantity = this.maxShare * data.quantity
      this.tableData.push(obj)
      this.dialogVisible = false
    },
    getDetailList() {
      if (this.tableData.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('strategy.plan.msg.tradeListEmpty')
          })
        )
        return
      }
      var reList = []
      this.tableData.forEach(e => {
        reList.push(e)
      })
      return reList
    },
    setList(data) {
      data.forEach(e => {
        this.tableData.push(e)
      })
    }
  }
}
</script>
