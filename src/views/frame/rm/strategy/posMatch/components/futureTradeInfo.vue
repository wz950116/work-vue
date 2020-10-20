<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="virtualTrade" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.virtualTrade') }}
      </el-button>
    </div>
    <el-table stripe border class='table-content tb-edit' ref="futureTradeInfo" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" :height="150" :element-loading-text="$t('route.load')" :data="tableData" @current-change="tableChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column :label="$t('strategy.posMatch.list.matchLots')" width="120">
        <template slot-scope="scope">
          <input-formatter v-if="scope.row.tradeId === scope.row.tradeGroup" :max='scope.row.canMatchLots' :precision='0' v-model="scope.row.matchLots" type="thousands" size="mini" @change="e => changeMatchLots(e, scope.row)"></input-formatter>
          <span v-else>{{scope.row.matchLots | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('strategy.posMatch.list.canMatchLots')" width="120" prop="canMatchLots"></el-table-column>
      <el-table-column :label="$t('strategy.posMatch.list.futuresContractCode')" width="120" prop="futuresContractCode"></el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.posMatch.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80" :label="$t('strategy.posMatch.list.offsetFlag')" prop="offsetFlag">
        <template slot-scope="scope">
          <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.futureOffsetType'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.posMatch.list.price')" prop="price">
        <template slot-scope='scope'>
          <span>{{scope.row.price | priceFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="120" :label="$t('strategy.posMatch.list.commission')" prop="commission">
        <template slot-scope='scope'>
          <span>{{scope.row.commission | priceFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" :label="$t('strategy.posMatch.list.orderSysId')" prop="orderSysId"></el-table-column>
      <el-table-column width="120" :label="$t('strategy.posMatch.list.derivativeAccount')" prop="derivativeAccount">
        <template slot-scope="scope">
          <base-select v-if="scope.row.tradeId + ',1' === scope.row.tradeGroup" v-model="scope.row.derivativeAccount" :attrs="{data: 'DERIVATIVE_ACCOUNT',params:{derivativeCategory: '3'},filterable: true}" size="mini" @change="e =>accountChange(e,scope.row)"></base-select>
          <span v-else>{{scope.row.derivativeAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" :label="$t('strategy.posMatch.list.derivativeSubAccount')" prop="derivativeSubAccount">
        <template slot-scope="scope">
          <base-select v-if="scope.row.tradeId + ',1' === scope.row.tradeGroup" v-model="scope.row.derivativeSubAccount" :attrs="{data: 'DERIVATIVE_SUB_ACCOUNT',params:{derivativeCategory: '3'} ,filterable: true}" size="mini" @change="e =>subAccountChange(e,scope.row)"></base-select>
          <span v-else>{{scope.row.derivativeSubAccount}}</span>
        </template>
      </el-table-column>
    </el-table>
    <futureTradeDialog v-if="dialogVisible" :tradeNature="'3'" :contractCode='contractCode' :direction="direction" :offsetFlag="offsetFlag" @close="dialogClose" @confirm="confirm"></futureTradeDialog>
  </div>
</template>

<script>
import futureTradeDialog from '@/views/frame/rm/strategy/futuresMatch/components/futureTrade/futureTradeDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    futureTradeDialog
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      direction: '',
      contractCode: '',
      offsetFlag: ''
    }
  },

  mounted() {
    // 渲染表格数据
    this.getEditData()
  },
  props: {
    tradeNature: {
      type: String,
      default: ''
    },
    tradeList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    tradeList(newId) {
      if (newId) this.getEditData()
    }
  },
  methods: {
    virtualTrade() {
      if (this.tableData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.tradeDataIsEmpty')
          })
        )
        return
      }

      const vritualList = []
      const isVirtualList = []
      for (let i = 0; i < this.tableData.length; i++) {
        const data = this.tableData[i]
        if (data.tradeGroup === data.tradeId) {
          vritualList.push(data)
        } else {
          isVirtualList.push(data.tradeGroup.split(",")[0])
        }
      }

      for (let i = 0; i < vritualList.length; i++) {
        const data = vritualList[i]
        if (isVirtualList.includes(data.tradeGroup)) {
          continue
        }

        let diffDirection = ''
        let diffOffset = ''
        if (data.direction === '1') {
          diffDirection = '2'
        } else {
          diffDirection = '1'
        }
        if (data.offsetFlag === '0') {
          diffOffset = '1'
        } else {
          diffOffset = '0'
        }

        let commission = 0
        if (!isNaN(data.commission)) {
          commission = parseFloat(data.matchLots) / parseFloat(data.volume) * parseFloat(data.commission)
        }

        const vritualTrade2 = {
          tradeGroup: data.tradeId + ',1',
          tradeId: data.tradeId,
          matchLots: data.matchLots,
          canMatchLots: data.matchLots,
          futuresContractCode: data.futuresContractCode,
          direction: data.direction,
          offsetFlag: diffOffset,
          price: data.price,
          volume: data.matchLots,
          commission: commission,
          derivativeAccount: '',
          derivativeSubAccount: ''
        }

        this.tableData.push(vritualTrade2)

        const vritualTrade1 = {
          tradeGroup: data.tradeId + ',2',
          tradeId: data.tradeId,
          matchLots: data.matchLots,
          canMatchLots: data.matchLots,
          futuresContractCode: data.futuresContractCode,
          direction: diffDirection,
          offsetFlag: diffOffset,
          volume: data.matchLots,
          price: data.price,
          commission: -commission,
          derivativeAccount: '',
          derivativeSubAccount: ''
        }

        this.tableData.push(vritualTrade1)
      }
    },
    // 获取初始化数据
    getEditData() {
      this.tableData = this.tradeList
    },
    addRow() {
      if (
        this.$parent.$parent.$parent.$refs.instructionInfo.tableData.length ===
        0
      ) {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.instDetailEmpty')
          })
        )
        return
      }
      this.contractCode = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].contractCode
      this.direction = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].direction
      this.offsetFlag = this.$parent.$parent.$parent.$refs.instructionInfo.tableData[0].offsetFlag
      if (this.offsetFlag === '1') {
        this.offsetFlag = '0'
      } else {
        this.offsetFlag = '1'
      }
      this.dialogVisible = true
    },
    deleteRow() {
      if (!this.selectedRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (this.selectedRow.tradeGroup === this.selectedRow.tradeId + ',1' || this.selectedRow.tradeGroup === this.selectedRow.tradeId + ',2') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.posMatch.msg.virtualCantDelete')
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
        for (let i = this.tableData.length - 1; i >= 0; i--) {
          if (this.tableData[i].tradeId === this.selectedRow.tradeId) {
            this.tableData.splice(i, 1)
          }
        }
        this.selectedRow = null
        this.changeMatchLots()
      })
    },
    tableChange(val) {
      this.selectedRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(datas) {
      var tradeIds = []
      this.tableData.forEach(e => {
        tradeIds.push(e.tradeId)
      })
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i]
        if (tradeIds.includes(data.tradeId)) {
          continue
        }
        data.id = null
        data.tenantCode = null
        data.canMatchLots =
          parseInt(data.volume) -
          parseInt(!data.matchLots ? 0 : data.matchLots) -
          parseInt(!data.virtualTradeLots ? 0 : data.virtualTradeLots)
        data.matchLots = 0
        data.tradeGroup = data.tradeId
        this.tableData.push(data)
      }
      this.dialogVisible = false
    },
    changeMatchLots(value, row) {
      var lots = 0

      const commission = parseFloat(row.matchLots) / parseFloat(row.volume) * parseFloat(row.commission)
      this.tableData.forEach(e => {
        if (e.tradeId === e.tradeGroup) {
          if (e === row) {
            lots = parseInt(lots) + parseInt(value)
          } else {
            lots = parseInt(lots) + parseInt(e.matchLots)
          }
        }

        if (e.tradeGroup === row.tradeId + ',1') {
          this.$set(e, 'matchLots', value)
          this.$set(e, 'canMatchLots', value)
          this.$set(e, 'volume', value)
          this.$set(e, 'commission', commission)
        }
        if (e.tradeGroup === row.tradeId + ',2') {
          this.$set(e, 'matchLots', value)
          this.$set(e, 'canMatchLots', value)
          this.$set(e, 'volume', value)
          this.$set(e, 'commission', -commission)
        }
      })
      this.$emit('changeMatch', lots)
    },
    accountChange(value, row) {
      this.tableData.forEach(e => {
        if (e.tradeGroup === row.tradeId + ',2') {
          this.$set(e, 'derivativeAccount', value)
        }
      })
    },
    subAccountChange(value, row) {
      this.tableData.forEach(e => {
        if (e.tradeGroup === row.tradeId + ',2') {
          this.$set(e, 'derivativeSubAccount', value)
        }
      })
    }
  }
}
</script>
