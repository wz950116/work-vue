<template>
  <el-col :span='12'>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>增行
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>删行
      </el-button>
      <span>目的标的</span>
    </div>

    <el-table stripe border height="150" highlight-current-row ref="sellTable" class='table-content tb-edit' :data="sellData" style="border:1px solid;" @selection-change="sellHandleSelectionChange">
      <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
      <el-table-column type="selection" width="45" align='center'></el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.productCode')" width="120">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.productCode')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <el-input v-model="scope.row.productName" :placeholder="$t('biz.placeholder.choose')" suffix-icon="el-icon-search" @focus="e =>handleShowSelect(scope.row)" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.direction')" width="80">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.direction')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
            <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.price')" width="120">
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.price" :min="0" :max='999999999999' :precision="2" type='thousands' size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.quantity')" width="120">
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.quantity" :min="0" :max='999999999999' :precision="2" type='thousands' size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.unitCode')" width="90">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.unitCode')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <el-select size='mini' v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')">
            <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.maxPostion')" width="120">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.maxPostion')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <input-formatter v-model="scope.row.maxPostion" :min="0" :max='999999999999' :precision="2" type='thousands' size="mini"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.marketCode')" width="140">
        <template slot-scope="scope">
          <base-select size="mini" v-model="scope.row.marketCode" :attrs="{data: 'DD_SPOT_MARKET',clearable: true}"></base-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.currencyCode')" width="90">
        <template slot="header">
          {{$t('strategy.strategyManagement.tab.currencyCode')}}
          <span style='color:#f56c6c;'>*</span>
        </template>
        <template slot-scope="scope">
          <base-select size="mini" v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY',clearable: true}"></base-select>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="item.columnTxt" :key="item.id" v-for="item in productItemInfo">
        <template slot-scope="scope">
          <el-input v-model="scope.row[item.columnName]" :disabled="scope.row.itemClass!=='1'" size="mini">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('strategy.strategyManagement.tab.remark')" width="160">
        <template slot-scope="scope">
          <input-validate size="mini" v-model="scope.row.remark" :placeholder="$t('biz.placeholder.input')" :clearable="true"></input-validate>
        </template>
      </el-table-column>
    </el-table>

    <productChose ref="productChose" :showCheckbox="false" v-if="dialogVisible" @closeHandler="closeHandler"></productChose>
  </el-col>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import productChose from '@/views/frame/biz/data/productItem/chooseSingle.vue'

export default {
  components: {
    productChose
  },
  data() {
    return {
      currencyCode: '',
      sellData: [],
      sellMultipleSelection: [],
      productItemInfo: [],
      dialogVisible: false,
      selectRow: {}
    }
  },
  props: ['strategyCode', 'type'],
  watch: {
    strategyCode(newId) {
      if (newId) this.getEditData()
    }
  },
  async mounted() {
    this.getEditData()
    this.initProductItem()

    this.currencyCode = await this.$store.dispatch('getCurrencyCode', {
      funcModule: this.$t('route.' + this.$route.meta.title),
      name: '人民币'
    })
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
    handleShowSelect(row) {
      this.selectRow = row
      this.dialogVisible = true
    },
    closeHandler(params) {
      if (params) {
        this.$set(this.selectRow, 'productCode', params.productCode)
        this.$set(this.selectRow, 'productName', params.productName)
        this.$set(this.selectRow, 'brand', params.brand)
        this.$set(this.selectRow, 'spec', params.spec)
        this.$set(this.selectRow, 'origin', params.origin)
        this.$set(this.selectRow, 'productKeyAttr01', params.productKeyAttr01)
        this.$set(this.selectRow, 'productKeyAttr02', params.productKeyAttr02)
        this.$set(this.selectRow, 'productKeyAttr03', params.productKeyAttr03)
      }
      this.dialogVisible = false
    },
    // 获取初始化数据
    getEditData() {
      if (!this.strategyCode) return

      request({
        url: '/api/strg/strDetail/listByCode',
        method: 'post',
        data: {
          data: {
            strategyCode: this.strategyCode
          },
          funcModule: '策略管理',
          funcOperation: '获取单个'
        }
      })
        .then(response => {
          response.data.forEach(element => {
            if (element.optimizationFlag === '0') {
              this.sellData.push(element)
            }
          })
          this.sellData.forEach((i, index) => {
            i.rowNum = index
          })
        })
        .catch(() => {})
    },
    // 处理勾选后
    sellHandleSelectionChange(val) {
      this.sellMultipleSelection = val
    },

    // 增行
    addRow() {
      this.sellData.push({
        itemClass: '1',
        direction: '',
        productCode: '',
        price: '',
        quantity: '',
        unitCode: '1',
        maxPostion: '',
        valuationCode: '',
        marketCode: '',
        currencyCode: this.currencyCode,
        remark: '',
        optimizationFlag: '0',
        rowNum: this.sellData.length
      })
    },
    // 删行
    deleteRow() {
      if (this.sellMultipleSelection.length > 0) {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            const filterArr = this.sellMultipleSelection.map(select => select.rowNum)
            const templateData = []
            this.sellData.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })
            templateData.forEach((i, index) => {
              i.rowNum = index
            })
            this.sellData = templateData
          })
          .catch(() => {})
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    }
  }
}
</script>
