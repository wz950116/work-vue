<template>
  <div>
    <div style="padding:5px 0;">
      <span style="display:inline-block;color:#666666;margin-right:10px;">{{ $t('strategy.plan.tab.strgEquation') }}</span>
      <el-input v-model="strgEquation" readonly style="width:50%;color:#000000;" @inpput="strgEquationChange">
      </el-input>
    </div>
    <el-row :gutter="20" style="border-top:1px solid #aaaaaa;">
      <el-col :span="12" style="border-right:1px solid #aaaaaa;">
        <div class="tabs-operate" style="margin-top:5px;">
          <el-button v-db-click size="mini" @click="buyAdd" v-if="['add', 'update','copy','change','changeUpdate'].includes(type)">
            <svg-icon icon-class="线性-增行"></svg-icon>
            {{ $t('biz.btn.addRow') }}
          </el-button>
          <el-button v-db-click size="mini" @click="buyDelete" v-if="['add', 'update','copy','change','changeUpdate'].includes(type)">
            <svg-icon icon-class="线性-删行"></svg-icon>
            {{ $t('biz.btn.deleteRow') }}
          </el-button>
          <span class="longs">多头</span>
        </div>
        <el-table stripe border height="150" highlight-current-row ref="buyMultipleTable" class="table-content tb-edit" :data="buyList" style="border:1px solid;" @current-change="buyListChange">
          <el-table-column type="index" fixed="left" :label="$t('table.id')" width="50" align="center">
          </el-table-column>
          <el-table-column :width="120" :label="$t('strategy.plan.list.productCode')" prop="productCode">
            <template slot-scope="scope">
              <base-select v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES', disabled:true ,filterable: true}" size="mini"></base-select>
            </template>
          </el-table-column>
          <el-table-column :width="120" :label="$t('strategy.plan.list.contractCode')" prop="contractCode">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.plan.list.contractCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select v-model="scope.row.contractCode" :attrs="{data: 'FUTURES_CONTRACT' ,disabled: disabled,params: {futuresVarietiesCode: scope.row.productCode} ,filterable: true}" size="mini"></base-select>
            </template>
          </el-table-column>
          <el-table-column :width="80" :label="$t('strategy.plan.list.offset')" prop="offsetFlag">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.plan.list.offsetFlag')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.offsetFlag" :disabled="scope.row.itemClass!=='2' || disabled" :clearable="true" :placeholder="$t('biz.placeholder.choose')" size="mini">
                <el-option v-for="item in $t('datadict.offset')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="right" :disabled="disabled" :width="120" :label="$t('strategy.plan.list.quantity')" prop="quantity"></el-table-column>
          <el-table-column :width="120" :label="$t('strategy.plan.list.floatRatio')" prop="floatRatio">
            <template slot-scope="scope">
              <input-formatter v-model="scope.row.floatRatio" type="percent" :precision="2" @change="val => ratioChange(val, scope.row)" size="mini"></input-formatter>
            </template>
          </el-table-column>
          <el-table-column :width="250" :label="$t('strategy.plan.list.priceLimit')">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.plan.list.priceLimit')}}
              <span style="color:#f56c6c;" v-if="!priceDisabled" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-row :gutter="0" style="width:100%;">
                <el-col :span="12">
                  <input-formatter :min="0" :disabled="priceDisabled || disabled" :max="scope.row.maxPrice || 999999999999.99" type="thousands" :precision="2" v-model="scope.row.minPrice" size="mini"></input-formatter>
                </el-col>
                <el-col :span="12">
                  <input-formatter :disabled="priceDisabled || disabled" :min="scope.row.minPrice || 0" :max="999999999999.99" type="thousands" :precision="2" v-model="scope.row.maxPrice" size="mini"></input-formatter>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :width="250" :label="$t('strategy.plan.list.quantityLimit')">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.plan.list.quantityLimit')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-row :gutter="0" style="width:100%;">
                <el-col :span="12">
                  <input-formatter :min="0" :max="scope.row.maxQuantity || 999999999999.99" type="thousands" :precision="2" v-model="scope.row.minQuantity" size="mini"></input-formatter>
                </el-col>
                <el-col :span="12">
                  <input-formatter :min="scope.row.minQuantity || 0" :max="999999999999.99" type="thousands" :precision="2" v-model="scope.row.maxQuantity" size="mini"></input-formatter>
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
          <el-table-column :width="90" :label="$t('strategy.plan.list.currencyCode')" prop="currencyCode">
            <template slot-scope="scope">
              <base-select v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY',disabled: disabled}" size="mini">
              </base-select>
            </template>
          </el-table-column>
          <el-table-column :width="160" :label="$t('strategy.plan.list.remark')" prop="remark">
            <template slot-scope="scope">
              <input-validate v-model="scope.row.remark" size="mini"></input-validate>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <div class="tabs-operate" style="margin-top:5px;">
          <el-button v-db-click size="mini" @click="sellAdd" v-if="['add', 'update','copy','change','changeUpdate'].includes(type)">
            <svg-icon icon-class="线性-增行"></svg-icon>
            {{ $t('biz.btn.addRow') }}
          </el-button>
          <el-button v-db-click size="mini" @click="sellDelete" v-if="['add', 'update','copy','change','changeUpdate'].includes(type)">
            <svg-icon icon-class="线性-删行"></svg-icon>
            {{ $t('biz.btn.deleteRow') }}
          </el-button>
          <span class="short">空头</span>
        </div>
        <el-table stripe border height="150" highlight-current-row ref="sellMultipleTable" class="table-content tb-edit" :data="sellList" style="border:1px solid;" @current-change="sellListChange">
          <el-table-column type="index" fixed="left" :label="$t('table.id')" width="50" align="center">
          </el-table-column>
          <el-table-column :width="120" :label="$t('strategy.plan.list.productCode')" prop="productCode">
            <template slot-scope="scope">
              <base-select v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES', disabled:true ,filterable: true}" size="mini"></base-select>
            </template>
          </el-table-column>
          <el-table-column :width="120" :label="$t('strategy.plan.list.contractCode')" prop="contractCode">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.plan.list.contractCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select v-model="scope.row.contractCode" :attrs="{data: 'FUTURES_CONTRACT' ,params: {futuresVarietiesCode: scope.row.productCode, disabled: disabled} ,filterable: true}" size="mini"></base-select>
            </template>
          </el-table-column>
          <el-table-column :width="80" :label="$t('strategy.plan.list.offset')" prop="offsetFlag">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.plan.list.offsetFlag')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.offsetFlag" :disabled="scope.row.itemClass!=='2' || disabled" :clearable="true" :placeholder="$t('biz.placeholder.choose')" size="mini">
                <el-option v-for="item in $t('datadict.offset')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="right" :disabled="disabled" :width="120" :label="$t('strategy.plan.list.quantity')" prop="quantity"></el-table-column>
          <el-table-column :width="120" :label="$t('strategy.plan.list.floatRatio')" prop="floatRatio">
            <template slot-scope="scope">
              <input-formatter v-model="scope.row.floatRatio" type="percent" :precision="2" @change="val => ratioChange(val, scope.row)" size="mini"></input-formatter>
            </template>
          </el-table-column>
          <el-table-column :width="250" :label="$t('strategy.plan.list.priceLimit')">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.plan.list.priceLimit')}}
              <span style="color:#f56c6c;" v-if="!priceDisabled" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-row :gutter="0" style="width:100%;">
                <el-col :span="12">
                  <input-formatter :disabled="priceDisabled || disabled" :min="0" :max="scope.row.maxPrice || 999999999999.99" type="thousands" :precision="2" v-model="scope.row.minPrice" size="mini"></input-formatter>
                </el-col>
                <el-col :span="12">
                  <input-formatter :disabled="priceDisabled || disabled" :min="scope.row.minPrice || 0" :max="999999999999.99" type="thousands" :precision="2" v-model="scope.row.maxPrice" size="mini"></input-formatter>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column :width="250" :label="$t('strategy.plan.list.quantityLimit')">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.plan.list.quantityLimit')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-row :gutter="0" style="width:100%;">
                <el-col :span="12">
                  <input-formatter :min="0" :max="scope.row.maxQuantity || 999999999999.99" type="thousands" :precision="2" v-model="scope.row.minQuantity" size="mini"></input-formatter>
                </el-col>
                <el-col :span="12">
                  <input-formatter :min="scope.row.minQuantity || 0" :max="999999999999.99" type="thousands" :precision="2" v-model="scope.row.maxQuantity" size="mini"></input-formatter>
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
          <el-table-column :width="90" :label="$t('strategy.plan.list.currencyCode')" prop="currencyCode">
            <template slot-scope="scope">
              <base-select v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY', disabled: disabled}" size="mini">
              </base-select>
            </template>
          </el-table-column>
          <el-table-column :width="160" :label="$t('strategy.plan.list.remark')" prop="remark">
            <template slot-scope="scope">
              <input-validate v-model="scope.row.remark" size="mini"></input-validate>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <strategyDetailDialog v-if="dialogVisible" :strategyNature="strategyNature" :strategyCode="strategyCode" @close="dialogClose" @confirm="dialogConfirm"></strategyDetailDialog>
  </div>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import strategyDetailDialog from '@/views/frame/rm/strategy/plan/strategyDetailDialog'

export default {
  components: {
    strategyDetailDialog
  },
  props: {
    enterMode: {
      type: String,
      default: '2'
    },
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
  watch: {
    enterMode(value) {
      if (value === '2') {
        this.priceDisabled = false
      } else {
        this.priceDisabled = true
        this.buyList.forEach(e => {
          e.maxPrice = ''
          e.minPrice = ''
        })
        this.sellList.forEach(e => {
          e.maxPrice = ''
          e.minPrice = ''
        })
      }
    }
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      priceDisabled: this.enterMode !== '2',
      buyList: [],
      sellList: [],
      multipleSelection: [],
      buyCurrentRow: {},
      sellCurrentRow: {},
      dialogVisible: false,
      direction: '1'
    }
  },
  methods: {
    strgEquationChange(value) {
      this.$emit('strgEquationChange', value)
    },
    // 增行
    buyAdd() {
      if (this.strategyCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.plan.msg.strategyFirst')
          })
        )
        return
      }
      this.direction = '1'
      this.dialogVisible = true
    },
    // 删行
    buyDelete() {
      if (!this.buyCurrentRow) {
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
        this.buyList.splice(this.buyList.indexOf(this.buyCurrentRow), 1)
        this.buyCurrentRow = null
      })
    },
    // 增行
    sellAdd() {
      if (this.strategyCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.plan.msg.strategyFirst')
          })
        )
        return
      }
      this.direction = '2'
      this.dialogVisible = true
    },
    // 删行
    sellDelete() {
      if (!this.sellCurrentRow) {
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
        this.sellList.splice(this.sellList.indexOf(this.sellCurrentRow), 1)
        this.sellCurrentRow = null
      })
    },
    buyListChange(val) {
      this.buyCurrentRow = val
    },
    sellListChange(val) {
      this.sellCurrentRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    dialogConfirm(data) {
      var obj = {}
      obj.itemClass = data.itemClass
      obj.productCode = data.productCode
      obj.quantity = data.quantity
      obj.unitCode = data.unitCode
      obj.currencyCode = data.currencyCode
      obj.contractCode = data.contractCode

      obj.maxQuantity = this.maxShare * data.quantity
      obj.minQuantity = this.maxShare * data.quantity
      if (this.direction === '1') {
        obj.direction = '1'
        this.buyList.push(obj)
      } else {
        obj.direction = '2'
        this.sellList.push(obj)
      }
      this.dialogVisible = false
    },
    clearData() {
      this.sellList = []
      this.buyList = []
    },
    getDetailList() {
      if (this.buyList.length === 0 && this.sellList.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('strategy.plan.msg.detailEmpty')
          })
        )
        return
      }
      var reList = []
      this.sellList.forEach(e => {
        reList.push(e)
      })
      this.buyList.forEach(e => {
        reList.push(e)
      })
      return reList
    },
    ratioChange(val, row) {
      if (row.floatRatio > 0) {
        row.maxQuantity =
          this.maxShare * row.quantity * (1 + row.floatRatio / 100)
        row.minQuantity = this.maxShare * row.quantity
      } else {
        row.maxQuantity = this.maxShare * row.quantity
        row.minQuantity =
          this.maxShare * row.quantity * (1 - row.floatRatio / 100)
      }
    },
    setList(data) {
      data.forEach(e => {
        if (e.direction === '1') {
          this.buyList.push(e)
        } else {
          this.sellList.push(e)
        }
      })
    }
  }
}
</script>
