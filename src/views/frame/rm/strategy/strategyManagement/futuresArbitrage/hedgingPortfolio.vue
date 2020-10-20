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
        <el-table stripe border height="150" ref="buyTable" class="table-content tb-edit" :data="buyData" style="border:1px solid;" @selection-change="buyHandleSelectionChange">
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
                <el-option v-for="item in $t('datadict.futuresItemClass')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.productCode')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.productCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select v-if="scope.row.itemClass==='2'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'1'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
              <base-select v-if="scope.row.itemClass==='3'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'2'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.contractCode')" width="120">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.contractCode" :attrs="{data:'FUTURES_CONTRACT',clearable:true,params:{futuresVarietiesCode:scope.row.productCode} ,filterable: true}">
              </base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.price')" width="120">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.priceItem" :attrs="{data: 'DD_PRICE_ITEM',clearable:true,params:{priceItemType:'3'} ,filterable: true}"></base-select>
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
              <el-input v-model="scope.row.maxHands" @keyup.native="number" @change="v=>changeMaxHands({val:v,row:scope.row})" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.maxPostion')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.maxPostion')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.maxPostion" @keyup.native="number" :disabled="true" size="mini"></el-input>
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
          <el-table-column :label="$t('strategy.strategyManagement.tab.currencyCode')" width="90">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.currencyCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.currencyCode" :clearable="true" :attrs="{data:'CURRENCY'}">
              </base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.marketCode')" width="140">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.marketCode" :clearable="true" :attrs="{data:'EXCHANGE'}">
              </base-select>
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
        <el-table stripe border height="150" highlight-current-row ref="sellTable" class="table-content tb-edit" :data="sellData" style="border:1px solid;" @selection-change="sellHandleSelectionChange">
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
                <el-option v-for="item in $t('datadict.futuresItemClass')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.productCode')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.productCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select v-if="scope.row.itemClass==='2'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'1'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
              <base-select v-if="scope.row.itemClass==='3'" size="mini" v-model="scope.row.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag:'1', futuresVarietiesType:'2'}, filterable: true}" @changeAll="v=>changeProductCode({val:v,row:scope.row})"></base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t(' strategy.strategyManagement.tab.contractCode')" width="120">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.contractCode" :attrs="{data:'FUTURES_CONTRACT',clearable:true,params:{futuresVarietiesCode:scope.row.productCode} ,filterable: true}">
              </base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.price')" width="120">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.priceItem" :attrs="{data: 'DD_PRICE_ITEM',clearable:true,params:{priceItemType:'3'} ,filterable: true}"></base-select>
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
              <el-input v-model="scope.row.maxHands" @keyup.native="number" @change="v=>changeMaxHands({val:v,row:scope.row})" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.maxPostion')" width="120">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.maxPostion')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-input v-model="scope.row.maxPostion" @keyup.native="number" :disabled="true" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.unitCode')" width="90">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.unitCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <el-select size="mini " v-model="scope.row.unitCode" :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in $t('datadict.measurementUnit')" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.currencyCode')" width="90">
            <template slot="header" slot-scope="scope">
              {{$t('strategy.strategyManagement.tab.currencyCode')}}
              <span style="color:#f56c6c;" :data-header='scope'>*</span>
            </template>
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.currencyCode" :clearable="true " :attrs="{data:'CURRENCY'}">
              </base-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.strategyManagement.tab.marketCode')" width="140">
            <template slot-scope="scope">
              <base-select size="mini" v-model="scope.row.marketCode" :clearable="true " :attrs="{data:'EXCHANGE'}">
              </base-select>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      currencyCode: '',
      buyData: [],
      sellData: [],
      sellMultipleSelection: [],
      buyMultipleSelection: [],
      strgEquation: ''
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

    this.currencyCode = await this.$store.dispatch('getCurrencyCode', {
      funcModule: this.$t('route.' + this.$route.meta.title),
      name: '人民币'
    })
  },
  methods: {
    number(value) {
      value = value.replace(/[^\.\d]/g, '')
      value = value.replace('.', '')
    },
    changeProductCode(value) {
      value.row.contractCode = ''
      value.row.contractMultiplier = value.val.data.contractMultiplier
      if (value.row.maxHands) {
        value.row.maxPostion = value.row.maxHands * value.val.data.contractMultiplier
      }
    },

    changeMaxHands(value) {
      value.row.maxPostion = value.row.maxHands * value.row.contractMultiplier
    },

    changeQuantity(value) {
      if (!value.row.maxHands && this.maxShare) {
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
        if (element.rowNum === this.buyData.length - 1) {
          this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '*' + element.contractMultiplier + ') - ('
        } else {
          this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '*' + element.contractMultiplier + '+'
        }
        sum = sum + element.price * element.quantity * element.contractMultiplier
      })
      this.sellData.forEach(element => {
        sum = sum - element.price * element.quantity * element.contractMultiplier
        if (element.rowNum === this.sellData.length - 1) {
          this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '*' + element.contractMultiplier + ') = ' + sum
        } else {
          this.strgEquation = this.strgEquation + element.price + '*' + element.quantity + '*' + element.contractMultiplier + '+'
        }
      })
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
      if (file === 'buy') {
        this.buyData.push({
          itemClass: '2',
          direction: '1',
          contractCode: '',
          productCode: '',
          price: '',
          quantity: '',
          unitCode: '1',
          maxHands: '',
          maxPostion: '',
          currencyCode: this.currencyCode,
          marketCode: '',
          priceItem: '',
          rowNum: this.buyData.length
        })
      } else if (file === 'sell') {
        this.sellData.push({
          itemClass: '2',
          direction: '2',
          productCode: '',
          contractCode: '',
          price: '',
          quantity: '',
          unitCode: '1',
          maxHands: '',
          maxPostion: '',
          currencyCode: this.currencyCode,
          marketCode: '',
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
