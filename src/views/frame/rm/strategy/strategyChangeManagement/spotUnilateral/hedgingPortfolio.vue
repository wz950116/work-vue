<template>
  <div>
    <el-row :gutter='20' style='border-top:1px solid #aaaaaa;'>
      <el-col :span='24' style='border-right:1px solid #aaaaaa;'>
        <div class='tabs-operate' style='margin-top:5px;' v-if="['add','update'].includes(type)">
          <el-button v-db-click size="mini" @click="addRow">
            <svg-icon icon-class="线性-增行"></svg-icon>增行
          </el-button>
          <el-button v-db-click size="mini" @click="deleteRow">
            <svg-icon icon-class="线性-删行"></svg-icon>删行
          </el-button>
        </div>
        <el-table stripe border height="150" ref="buyTable" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @selection-change="handleSelectionChange" @cell-click="handleClick">
          <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
          <el-table-column type="selection" width="45" align='center'></el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.productCode')" width="140">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.productCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <span v-if='scope.row.itemClass==="1"'> {{scope.row.productName}}</span>
              <!-- <base-select size="mini" v-model="scope.row.productCode" :attrs="{data: 'DD_PRODUCT',clearable:true,params:{usingFlag:'1'},disabled:matchFlag ,filterable: true}"></base-select> -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.direction')" width="140">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.direction')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select size='mini' v-model="scope.row.direction" :placeholder="$t('biz.placeholder.choose')" :clearable="true" :disabled="matchFlag">
                <el-option v-for="item in $t('datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.maxPostion')" width="140">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.maxPostion')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <input-formatter v-model="scope.row.maxPostion" :min="0" :max='999999999999' :precision="2" type='thousands' size="mini"></input-formatter>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.unitCode')" width="140">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.unitCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select size='mini' v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.marketCode')" width="140">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.marketCode" :attrs="{data: 'DD_SPOT_MARKET',clearable:true,disabled:matchFlag}"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.currencyCode')" width="140">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.currencyCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY',clearable:true,disabled:matchFlag}"></base-select>
            </template>
          </el-table-column>
          <el-table-column width="120" :label="item.columnTxt" :key="item.id" v-for="item in productItemInfo">
            <template slot-scope='scope'>
              <el-input v-model="scope.row[item.columnName]" v-if="scope.row.itemClass==='1'" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.remark')" width="140">
            <template slot-scope="scope">
              <input-validate size="mini" v-model="scope.row.remark" :placeholder="$t('biz.placeholder.input')" :clearable="true" :disabled='matchaFlag'></input-validate>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <productChose :showCheckbox="false" v-if='dialogVisible' @closeHandler="closeHandler"></productChose>
    </el-row>
  </div>
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
      tableData: [],
      multipleSelection: [],
      productItemInfo: [],
      dialogVisible: false,
      selectRow: {}
    }
  },
  props: ['changeNo', 'flag', 'type', 'matchFlag'],
  watch: {},
  async mounted() {
    // 渲染表格数据
    this.getEditData()
    this.initProductItem()

    this.currencyCode = await this.$store.dispatch('getCurrencyCode', {
      funcModule: this.$t('route.' + this.$route.meta.title),
      name: '人民币'
    })
  },
  methods: {
    handleClick(row, column) {
      if (row.itemClass === '1' && column.label === this.$t('strategy.strategyManagement.tab.productCode') && this.type !== 'view') {
        this.selectRow = row
        this.dialogVisible = true
      }
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
    // 获取初始化数据
    getEditData() {
      if (!this.changeNo) return
      if (this.flag === '1') {
        request({
          url: '/api/strg/strDetail/listByCode',
          method: 'post',
          data: {
            data: {
              strategyCode: this.changeNo
            },
            funcModule: '策略管理',
            funcOperation: '获取单个'
          }
        })
          .then(response => {
            this.tableData = response.data
            this.tableData.forEach((i, index) => {
              i.rowNum = index
            })
          })

          .catch(() => {})
      }
      if (this.flag === '0') {
        request({
          url: '/api/strg/strgStrDetailChg/get',
          method: 'post',
          data: {
            data: {
              changeId: this.changeNo
            },
            funcModule: '策略管理',
            funcOperation: '获取单个'
          }
        })
          .then(response => {
            this.tableData = response.data
            this.tableData.forEach((i, index) => {
              i.rowNum = index
            })
          })

          .catch(() => {})
      }
    },

    // 处理勾选后
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 增行
    addRow(file) {
      this.tableData.push({
        productCode: '',
        direction: '',
        maxPostion: '',
        unitCode: '1',
        valuationCode: '',
        marketCode: '',
        currencyCode: this.currencyCode,
        remark: '',
        rowNum: this.tableData.length
      })
    },
    // 删行
    deleteRow(file) {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            const filterArr = this.multipleSelection.map(select => select.rowNum)
            const templateData = []
            this.tableData.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })
            templateData.forEach((i, index) => {
              i.rowNum = index
            })
            this.tableData = templateData
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
