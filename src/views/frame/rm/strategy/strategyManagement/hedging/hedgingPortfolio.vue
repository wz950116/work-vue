<template>
  <div>
    <div style="padding:5px 0;">
      <span style="display:inline-block;color:#666666;margin-right:10px;">价格公式:</span>
      <el-input v-model="strgEquation" readonly style="width:50%;color:#000000;"></el-input>
      <el-button v-db-click size="mini" @click="matchData" style="margin-left:10px; height:32px">
        <svg-icon icon-class="线性-匹配"></svg-icon>匹配公式
      </el-button>
    </div>
    <el-row :gutter="20" style="border-top:1px solid #aaaaaa;">
      <el-col :span="12" style="border-right:1px solid #aaaaaa;">
        <div class="tabs-operate" style="margin-top:5px;">
          <el-button v-db-click size="mini" @click="addRow('buy')" v-if="['add', 'update'].includes(type)">
            <svg-icon icon-class="线性-增行"></svg-icon>增行
          </el-button>
          <el-button v-db-click size="mini" @click="deleteRow('buy')" v-if="['add', 'update'].includes(type)">
            <svg-icon icon-class="线性-删行"></svg-icon>删行
          </el-button>
          <span class="longs">多头</span>
        </div>
        <el-table stripe border ref="buyTable" class="table-content tb-edit" :data="buyData" style="border:1px solid;" @selection-change="buyHandleSelectionChange" height="150">
          <el-table-column type="index" fixed="left" :label="$t('table.id')" width="50" align="center">
          </el-table-column>
          <el-table-column type="selection" width="45" align="center"></el-table-column>

          <el-table-column :label="$t('strategy.strategyManagement.tab.itemClass')" width="100">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.itemClass')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select size="mini" @change="v=>changeBuy({val:v,row:scope.row})" v-model="scope.row.itemClass" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                <el-option v-for="item in $t('datadict.itemClass')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.productCode')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.productCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.productName" v-if="scope.row.itemClass==='1'" :placeholder="$t('biz.placeholder.choose')" suffix-icon="el-icon-search" @focus="e =>handleShowSelect(scope.row)" size="mini"></el-input>
              <base-select v-if="scope.row.itemClass==='2'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'1'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
              <base-select v-if="scope.row.itemClass==='3'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'2'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.price')" width="120">
            <template slot-scope="scope">
              <base-select v-if="scope.row.itemClass==='1'" size="mini" v-model="scope.row.priceItem" :attrs="{data: 'DD_PRICE_ITEM',clearable:true,params:{priceItemType:'1'} ,filterable: true}"></base-select>
              <base-select v-if="scope.row.itemClass==='2' || scope.row.itemClass==='3'" size="mini" v-model="scope.row.priceItem" :attrs="{data: 'DD_PRICE_ITEM',clearable:true,params:{priceItemType:'3'} ,filterable: true}"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.quantity')" width="120">
            <template slot-scope="scope">
              <input-formatter v-model="scope.row.quantity" :min="0" :max="999999999999" :precision="2" type="thousands" size="mini" @change="v=>changeQuantity({val:v,row:scope.row})"></input-formatter>
            </template>
          </el-table-column>

          <el-table-column :label="$t('strategy.strategyManagement.tab.maxHands')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.maxHands')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.maxHands" @keyup.native="number" @change="v=>changeMaxHands({val:v,row:scope.row})" :disabled="scope.row.itemClass==='1'" size="mini">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.maxPostion')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.maxPostion')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.maxPostion" @keyup.native="number" :disabled="scope.row.itemClass==='2' || scope.row.itemClass==='3'" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.unitCode')" width="90">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.unitCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.marketCode')" width="140">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.marketCode" :attrs="{data: 'DD_SPOT_MARKET',clearable:true,disabled:scope.row.itemClass==='2'}"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.currencyCode')" width="90">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.currencyCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY',clearable:true}">
              </base-select>
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
      </el-col>
      <el-col :span="12">
        <div class="tabs-operate" style="margin-top:5px;">
          <el-button v-db-click size="mini" @click="addRow('sell')" v-if="['add', 'update'].includes(type)">
            <svg-icon icon-class="线性-增行"></svg-icon>增行
          </el-button>
          <el-button v-db-click size="mini" @click="deleteRow('sell')" v-if="['add', 'update'].includes(type)">
            <svg-icon icon-class="线性-删行"></svg-icon>删行
          </el-button>
          <span class="short">空头</span>
        </div>
        <el-table stripe border highlight-current-row ref="sellTable" class="table-content tb-edit" :data="sellData" style="border:1px solid;" @selection-change="sellHandleSelectionChange" height="150">
          <el-table-column type="index" fixed="left" :label="$t('table.id')" width="50" align="center">
          </el-table-column>
          <el-table-column type="selection" width="45" align="center"></el-table-column>

          <el-table-column :label="$t('strategy.strategyManagement.tab.itemClass')" width="100">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.itemClass')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select size="mini" @change="v=>changeSell({val:v,row:scope.row})" v-model="scope.row.itemClass" :placeholder="$t('biz.placeholder.choose')" :clearable="true">
                <el-option v-for="item in $t('datadict.itemClass')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.productCode')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.productCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.productName" v-if="scope.row.itemClass==='1'" :placeholder="$t('biz.placeholder.choose')" suffix-icon="el-icon-search" @focus="e =>handleShowSelect(scope.row)" size="mini"></el-input>
              <base-select v-if="scope.row.itemClass==='2'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'1'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
              <base-select v-if="scope.row.itemClass==='3'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'2'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.price')" width="120">
            <template slot-scope="scope">
              <base-select v-if="scope.row.itemClass==='1'" size="mini" v-model="scope.row.priceItem" :attrs="{data: 'DD_PRICE_ITEM',clearable:true,params:{priceItemType:'1'} ,filterable: true}"></base-select>
              <base-select v-if="scope.row.itemClass==='2' || scope.row.itemClass==='3'" size="mini" v-model="scope.row.priceItem" :attrs="{data: 'DD_PRICE_ITEM',clearable:true,params:{priceItemType:'3'} ,filterable: true}"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.quantity')" width="120">
            <template slot-scope="scope">
              <input-formatter v-model="scope.row.quantity" :min="0" :max="999999999999" :precision="2" type="thousands" size="mini" @change="v=>changeQuantity({val:v,row:scope.row})" :clearable="true"></input-formatter>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.maxHands')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.maxHands')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.maxHands" @keyup.native="number" @change="v=>changeMaxHands({val:v,row:scope.row})" :disabled="scope.row.itemClass==='1'" size="mini">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.maxPostion')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.maxPostion')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.maxPostion" @keyup.native="number" :disabled="scope.row.itemClass==='2'" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.unitCode')" width="90">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.unitCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select size="mini" v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.marketCode')" width="140">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.marketCode" :attrs="{data: 'DD_SPOT_MARKET',clearable:true,disabled:scope.row.itemClass==='2'}"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.currencyCode')" width="90">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.currencyCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.currencyCode" :attrs="{data: 'CURRENCY',clearable:true}">
              </base-select>
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
      </el-col>
    </el-row>

    <productChose ref="productChose" :showCheckbox="false" v-if="dialogVisible" @closeHandler="closeHandler"></productChose>
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
      buyData: [],
      sellData: [],
      sellMultipleSelection: [],
      buyMultipleSelection: [],
      strgEquation: '',
      productItemInfo: [],
      dialogVisible: false,
      selectRow: {}
    }
  },
  props: ['strategyCode', 'strgEquation1', 'type', 'maxShare'],
  watch: {
    strgEquation1(newId) {
      if (this.type !== 'add') this.strgEquation = this.strgEquation1
    }
  },
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
    handleShowSelect(row) {
      this.selectRow = row
      this.dialogVisible = true
    },
    // handleClick(row, column) {
    //   if (row.itemClass === '1' && column.label === this.$t('strategy.strategyManagement.tab.productCode') && this.type !== 'view') {
    //     this.selectRow = row
    //     this.dialogVisible = true
    //   }
    // },
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
    number(value) {
      value = value.replace(/[^\.\d]/g, '')
      value = value.replace('.', '')
    },

    changeMaxHands(value) {
      if (value.row.itemClass === '2' || value.row.itemClass === '3') {
        value.row.maxPostion = value.row.maxHands * value.row.contractMultiplier
      }
    },
    changeProductCode(value) {
      value.row.contractMultiplier = value.val.data.contractMultiplier
      if (value.row.itemClass === '2' || value.row.itemClass === '3') {
        value.row.maxPostion = value.row.maxHands * value.row.contractMultiplier
      }
    },
    changeQuantity(value) {
      if (!value.row.maxPostion && value.row.itemClass === '1' && this.maxShare) {
        value.row.maxPostion = this.maxShare * value.val
      }
      if (!value.row.maxHands && (value.row.itemClass === '2' || value.row.itemClass === '3') && this.maxShare) {
        value.row.maxHands = this.maxShare * value.val
        value.row.maxPostion = value.row.maxHands * value.row.contractMultiplier
      }
    },

    matchData() {
      if (this.buyData == null || this.buyData.length === 0) {
        Notification(
          notifyInfo({
            msg: '请点击多头的增行新增数据'
          })
        )
        return
      }
      if (this.sellData == null || this.sellData.length === 0) {
        Notification(
          notifyInfo({
            msg: '请点击空头的增行新增数据'
          })
        )
        return
      }
      this.buyData.forEach(element => {
        if (!element.price || !element.quantity) {
          Notification(
            notifyInfo({
              msg: '多头的价格和每组数量必填'
            })
          )
        }
        return
      })
      this.sellData.forEach(element => {
        if (!element.price || !element.quantity) {
          Notification(
            notifyInfo({
              msg: '空头的价格和每组数量必填'
            })
          )
        }
        return
      })
      var sum = 0
      this.strgEquation = '('
      this.buyData.forEach(element => {
        if (element.itemClass === '1') {
          if (element.rowNum === this.buyData.length - 1) {
            this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + ') - ('
          } else {
            this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '+'
          }
        } else {
          if (element.rowNum === this.buyData.length - 1) {
            this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '*' + element.contractMultiplier + ') - ('
          } else {
            this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '*' + element.contractMultiplier + '+'
          }
        }
        if (element.itemClass === '1') {
          sum = sum + element.price * element.quantity
        } else {
          sum = sum + element.price * element.quantity * element.contractMultiplier
        }
      })
      this.sellData.forEach(element => {
        if (element.itemClass === '1') {
          sum = sum - element.price * element.quantity
        } else {
          sum = sum - element.price * element.quantity * element.contractMultiplier
        }
        if (element.itemClass === '1') {
          if (element.rowNum === this.sellData.length - 1) {
            this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + ') = ' + sum
          } else {
            this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '+'
          }
        } else {
          if (element.rowNum === this.sellData.length - 1) {
            this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '*' + element.contractMultiplier + ') = ' + sum
          } else {
            this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '*' + element.contractMultiplier + '+'
          }
        }
      })
    },
    changeBuy(value) {
      this.strgEquation = ''
      this.buyData[value.row.rowNum].priceItem = ''
      this.buyData[value.row.rowNum].productCode = ''
      this.buyData[value.row.rowNum].productName = ''
      this.buyData[value.row.rowNum].price = ''
      this.buyData[value.row.rowNum].quantity = ''
      this.buyData[value.row.rowNum].maxPostion = ''
      this.buyData[value.row.rowNum].maxHands = ''
      this.buyData[value.row.rowNum].valuationCode = ''
      this.buyData[value.row.rowNum].marketCode = ''
      this.buyData[value.row.rowNum].remark = ''
      this.buyData[value.row.rowNum].brand = ''
      this.buyData[value.row.rowNum].spec = ''
      this.buyData[value.row.rowNum].origin = ''
      this.buyData[value.row.rowNum].productKeyAttr01 = ''
      this.buyData[value.row.rowNum].productKeyAttr02 = ''
      this.buyData[value.row.rowNum].productKeyAttr03 = ''
    },
    changeSell(value) {
      this.strgEquation = ''
      this.sellData[value.row.rowNum].priceItem = ''
      this.sellData[value.row.rowNum].productCode = ''
      this.sellData[value.row.rowNum].productName = ''
      this.sellData[value.row.rowNum].price = ''
      this.sellData[value.row.rowNum].quantity = ''
      this.sellData[value.row.rowNum].maxPostion = ''
      this.sellData[value.row.rowNum].maxHands = ''
      this.sellData[value.row.rowNum].valuationCode = ''
      this.sellData[value.row.rowNum].marketCode = ''
      this.sellData[value.row.rowNum].remark = ''
      this.sellData[value.row.rowNum].brand = ''
      this.sellData[value.row.rowNum].spec = ''
      this.sellData[value.row.rowNum].origin = ''
      this.sellData[value.row.rowNum].productKeyAttr01 = ''
      this.sellData[value.row.rowNum].productKeyAttr02 = ''
      this.sellData[value.row.rowNum].productKeyAttr03 = ''
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
            if (element.direction === '1') {
              this.buyData.push(element)
            }
            if (element.direction === '2') {
              this.sellData.push(element)
            }
          })
          this.buyData.forEach((i, index) => {
            i.rowNum = index
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
    // 处理勾选后
    buyHandleSelectionChange(val) {
      this.buyMultipleSelection = val
    },

    // 增行
    addRow(file) {
      this.strgEquation = ''
      if (file === 'buy') {
        this.buyData.push({
          direction: '1',
          itemClass: '',
          productCode: '',
          productName: '',
          brand: '',
          spec: '',
          origin: '',
          productKeyAttr01: '',
          productKeyAttr02: '',
          productKeyAttr03: '',
          price: '',
          quantity: '',
          unitCode: '1',
          maxPostion: '',
          valuationCode: '',
          marketCode: '',
          currencyCode: this.currencyCode,
          maxHands: '',
          remark: '',
          priceItem: '',
          rowNum: this.buyData.length
        })
      } else if (file === 'sell') {
        this.sellData.push({
          direction: '2',
          itemClass: '',
          productCode: '',
          productName: '',
          brand: '',
          spec: '',
          origin: '',
          productKeyAttr01: '',
          productKeyAttr02: '',
          productKeyAttr03: '',
          price: '',
          quantity: '',
          unitCode: '1',
          maxPostion: '',
          valuationCode: '',
          marketCode: '',
          currencyCode: this.currencyCode,
          maxHands: '',
          remark: '',
          priceItem: '',
          rowNum: this.sellData.length
        })
      }
    },
    // 删行
    deleteRow(file) {
      if (file === 'buy') {
        if (this.buyMultipleSelection.length > 0) {
          this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              this.strgEquation = ''
              const filterArr = this.buyMultipleSelection.map(select => select.rowNum)
              const templateData = []
              this.buyData.forEach((item, index) => {
                if (!filterArr.includes(item.rowNum)) {
                  templateData.push(item)
                }
              })
              templateData.forEach((i, index) => {
                i.rowNum = index
              })
              this.buyData = templateData
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
      if (file === 'sell') {
        if (this.sellMultipleSelection.length > 0) {
          this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              this.strgEquation = ''
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
}
</script>
