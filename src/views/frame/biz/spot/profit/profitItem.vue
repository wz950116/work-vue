<template>
  <div class="edit-header-table">
    <table class="el-table el-table--border el-table--mini myProfitItemTable" cellspacing="0" cellpadding="0" border="0">
      <colgroup>
        <col style="width:180px;" />
        <col style="width:150px;" />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th>
            <div class="cell">项目</div>
          </th>
          <th>
            <div class="cell">测算金额(人民币)</div>
          </th>
          <th>
            <div class="cell">备注</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="myTdBlod">
            <div class="cell">合同销售收入</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount01, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark01" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">销售合同金额</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount02, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark02" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">增值税销项金额</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount03, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark03" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">商品销售成本及费用</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount04, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark04" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">采购成本</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount05, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark05" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">进货金额</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount06, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark06" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">增值税进项金额</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount07, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark07" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">关税</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount08" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark08" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">物流费</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount09" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark09" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">保险费</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount10" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark10" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">销售费用</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount11, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark11" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">进口包干费</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount12" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark12" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">仓储费</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount13" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark13" />
          </td>
        </tr>
        <tr>

          <td class="myTdCenter">
            <div class="cell">国内运费</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount14" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark14" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">检验费</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount15" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark15" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">印花费</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount16" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark16" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <div class="cell">运营费用摊销</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount17" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark17" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemName18" placeholder="（备用字段1）" />
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount18" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark18" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemName19" placeholder="（备用字段2）" />
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount19" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark19" />
          </td>
        </tr>
        <tr>
          <td class="myTdCenter">
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemName20" placeholder="（备用字段3）" />
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount20" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark20" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">财务费用</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount21" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark21" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">期货损益</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount22" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark22" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">其他收入</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount23" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark23" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">其他收益</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount24" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark24" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">银行费用</div>
          </td>
          <td class="myTdRight">
            <input-formatter type="money" :min="0" size="mini" v-model.trim="itemData.itemAmount25" @change="calcValue" />
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark25" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">合同净利</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('money', itemData.itemAmount26, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark26" />
          </td>
        </tr>
        <tr>
          <td class="myTdBlod">
            <div class="cell">合同净利率</div>
          </td>
          <td class="myTdRight">
            <div class="cell">{{ dataFormat('percent', itemData.itemAmount27, null) }}</div>
          </td>
          <td>
            <el-input :maxlength='128' size="mini" v-model.trim="itemData.itemRemark27" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      itemData: {
        itemAmount01: 0,
        itemAmount02: 0,
        itemAmount03: 0,
        itemAmount04: 0,
        itemAmount05: 0,
        itemAmount06: 0,
        itemAmount07: 0,
        itemAmount08: 0,
        itemAmount09: 0,
        itemAmount10: 0,
        itemAmount11: 0,
        itemAmount12: 0,
        itemAmount13: 0,
        itemAmount14: 0,
        itemAmount15: 0,
        itemAmount16: 0,
        itemAmount17: 0,
        itemAmount18: 0,
        itemAmount19: 0,
        itemAmount20: 0,
        itemAmount21: 0,
        itemAmount22: 0,
        itemAmount23: 0,
        itemAmount24: 0,
        itemAmount25: 0,
        itemAmount26: 0,
        itemAmount27: 0,
        itemRemark01: null,
        itemRemark02: null,
        itemRemark03: null,
        itemRemark04: null,
        itemRemark05: null,
        itemRemark06: null,
        itemRemark07: null,
        itemRemark08: null,
        itemRemark09: null,
        itemRemark10: null,
        itemRemark11: null,
        itemRemark12: null,
        itemRemark13: null,
        itemRemark14: null,
        itemRemark15: null,
        itemRemark16: null,
        itemRemark17: null,
        itemRemark18: null,
        itemRemark19: null,
        itemRemark20: null,
        itemRemark21: null,
        itemRemark22: null,
        itemRemark23: null,
        itemRemark24: null,
        itemRemark25: null,
        itemRemark26: null,
        itemRemark27: null,
        itemName18: null,
        itemName19: null,
        itemName20: null
      }
    }
  },
  props: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const initChooseParam = this.$parent.$parent.$refs.qmDialogEdit.edit.initChooseParam
      const contractInfo = initChooseParam.contractInfo
      if (contractInfo.profitItemDto) {
        Object.assign(this.itemData, contractInfo.profitItemDto)
        this.calcValue()
        return
      }
      if (this.$parent.edit.param.type !== 'add') {
        let requestData = null
        if (initChooseParam.billType === 'CON_PC_INFO' || initChooseParam.billType === 'CON_SC_INFO' || initChooseParam.billType === 'DOM_CON_SC_INFO' || initChooseParam.billType === 'EXT_CON_SC_INFO') {
          requestData = {
            url: '/api/contract/profitItem/getByContractNo',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: {
                billType: initChooseParam.billType,
                contractNo: initChooseParam.billNo
              }
            }
          }
        } else if (initChooseParam.billType === 'CON_PCC_INFO' || initChooseParam.billType === 'CON_SCC_INFO' || initChooseParam.billType === 'DOM_CON_SCC_INFO' || initChooseParam.billType === 'EXT_CON_SCC_INFO') {
          requestData = {
            url: '/api/contract/profitItemChg/getByChangeNo',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: {
                billType: initChooseParam.billType,
                changeNo: initChooseParam.billNo
              }
            }
          }
        }
        request(requestData).then(response => {
          if (response.data) {
            Object.assign(this.itemData, response.data)
            this.calcValue()
          }
        })
      }
    },
    dataFormat(func = 'dataDictFormat', value, list) {
      if (func === 'percent') {
        const fmt = new Intl.NumberFormat('zh-Hans-CN', { style: 'percent', minimumFractionDigits: 2 })
        if (value) {
          value = value / 100
        }
        return fmt.format(value)
      }
      return Vue.filter(func)(value, list)
    },
    toNum(str) {
      if (typeof str === 'string') {
        str = str.trim()
        str = str.replace(',', '')
      }
      const num = parseFloat(str)
      return isNaN(num) ? 0 : num
    },
    calcValue() {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      this.calcItem()
    },
    calcItem() {
      const purchaseProdList = this.$parent.$refs.purchaseProdList[0].$refs.tab.tableData
      const saleProdList = this.$parent.$refs.saleProdList[0].$refs.tab.tableData
      const initChooseParam = this.$parent.$parent.$refs.qmDialogEdit.edit.initChooseParam
      const contractInfo = initChooseParam.contractInfo
      let itemAmount01 = 0 // 合同销售收入
      let itemAmount02 = 0 // 销售合同金额
      let itemAmount03 = 0 // 销售合同金额
      let itemAmount06 = 0 // 进货金额
      let itemAmount07 = 0 // 增值税进项金额
      for (let i = 0; i < saleProdList.length; i++) {
        const taxRate = this.toNum(saleProdList[i].taxRate) / 100
        // 2. 销售合同金额 = 销售信息 金额的合计
        itemAmount02 = itemAmount02 + this.toNum(saleProdList[i].localAmount)
        if (contractInfo.tradeType === '3') {
          // 3. 增值税销项税额 = 销售合同金额 * 税率
          itemAmount03 = itemAmount03 + this.toNum(saleProdList[i].localAmount) * taxRate / (1 + taxRate)
          // 1. 合同销售收入 = 销售合同金额 - 增值税销项税额 + 海关增值税（只有进口时有，也就是销售的增值税销项税额）
          itemAmount01 = itemAmount01 + this.toNum(saleProdList[i].localAmount) / (1 + taxRate)
        } else {
          // 3. 增值税销项税额 = 销售合同金额 * 税率
          itemAmount03 = itemAmount03 + this.toNum(saleProdList[i].localAmount) * taxRate
          // 1. 合同销售收入 = 销售合同金额 - 增值税销项税额 + 海关增值税（只有进口时有，也就是销售的增值税销项税额）
          itemAmount01 = itemAmount01 + this.toNum(saleProdList[i].localAmount)
        }
      }
      for (let i = 0; i < purchaseProdList.length; i++) {
        const taxRate = this.toNum(purchaseProdList[i].taxRate) / 100
        if (contractInfo.tradeType === '3') {
          // 6.进货金额 = 采购合同金额（合计） + 海关增值税（只有进口时有，也就是采购的增值税进项税额）
          itemAmount06 = itemAmount06 + this.toNum(purchaseProdList[i].localAmount)
          // 7. 增值税进项税额 = 采购合同金额 * 税率
          itemAmount07 = itemAmount07 + this.toNum(purchaseProdList[i].localAmount) * taxRate / (1 + taxRate)
        } else {
          // 6.进货金额 = 采购合同金额（合计） + 海关增值税（只有进口时有，也就是采购的增值税进项税额）
          itemAmount06 = itemAmount06 + this.toNum(purchaseProdList[i].localAmount) * (1 + taxRate)
          // 7. 增值税进项税额 = 采购合同金额 * 税率
          itemAmount07 = itemAmount07 + this.toNum(purchaseProdList[i].localAmount) * taxRate
        }
      }
      // 合同销售收入 = 销售合同金额 - 增值税销项税额 + 海关增值税（只有进口时有，也就是销售的增值税销项税额）
      this.itemData.itemAmount01 = itemAmount01
      // 销售合同金额 = 销售信息 金额的合计
      this.itemData.itemAmount02 = itemAmount02
      // 增值税销项税额 = 销售合同金额 * 税率
      this.itemData.itemAmount03 = itemAmount03
      // 进货金额 = 采购合同金额（合计） + 海关增值税（只有进口时有，也就是采购的增值税进项税额）
      this.itemData.itemAmount06 = itemAmount06
      // 进货金额 = 增值税进项税额 = 采购合同金额 * 税率
      this.itemData.itemAmount07 = itemAmount07
      // 采购成本 = 进货金额 - 增值税进项税额 + 关税 + 运费 + 保险费
      this.itemData.itemAmount05 = itemAmount06 - itemAmount07 + this.toNum(this.itemData.itemAmount08) + this.toNum(this.itemData.itemAmount09) + this.toNum(this.itemData.itemAmount10)
      // 销售费用 = 进口包干费 + 仓储费 + 国内运费 + 检验费 + 印花费 + 运营费用摊销 (以及备用字段)
      this.itemData.itemAmount11 = this.toNum(this.itemData.itemAmount12) + this.toNum(this.itemData.itemAmount13) + this.toNum(this.itemData.itemAmount14) + this.toNum(this.itemData.itemAmount15) + this.toNum(this.itemData.itemAmount15) + this.toNum(this.itemData.itemAmount17) + this.toNum(this.itemData.itemAmount18) + this.toNum(this.itemData.itemAmount19) + this.toNum(this.itemData.itemAmount20)
      // 商品销售成本及费用 = 采购成本 + 销售费用
      this.itemData.itemAmount04 = this.toNum(this.itemData.itemAmount05) + this.toNum(this.itemData.itemAmount11)
      // 合同净利 = 合同销售收入 - 商品销售成本及费用 - 财务费用 + 期货损益 + 其他收入 - 银行费用
      this.itemData.itemAmount26 = this.toNum(this.itemData.itemAmount01) - this.toNum(this.itemData.itemAmount04) - this.toNum(this.itemData.itemAmount21) + this.toNum(this.itemData.itemAmount22) + this.toNum(this.itemData.itemAmount23) + this.toNum(this.itemData.itemAmount24) - this.toNum(this.itemData.itemAmount25)
      // 合同净利率 = 合同净利 / 合同销售收入
      if (itemAmount01 > 0) {
        this.itemData.itemAmount27 = 100 * this.toNum(this.itemData.itemAmount26) / itemAmount01
      } else {
        this.itemData.itemAmount27 = 0
      }
    }
  }
}
</script>
<style scoped>
td.myTdBlod {
  font-weight: bold;
}
td.myTdCenter {
  text-align: center;
}
td.myTdCenter >>> div.cell {
  text-align: center;
  padding-left: 0;
  padding-right: 0;
}
td.myTdCenter >>> input[type='text'] {
  text-align: center;
}
td.myTdRight {
  text-align: right;
}
td.myTdRight >>> div.cell {
  font-family: sans-serif;
}
td.myTdRight >>> input[type='text'] {
  text-align: right;
  padding-right: 9px;
  padding-left: 9px;
}
</style>
