<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
      </el-button>
      <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
      </el-button>
    </div>

    <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="false" element-loading-spinner="el-icon-loading" height="150" :element-loading-text="$t('route.load')" :data="tableData" @current-change="tableChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column :width="120" :label="$t('spotProj.exposure.list.matchQuantity')" prop="matchQuantity">
        <template slot-scope="scope">
          <input-formatter :min='0' :max='scope.row.noMatchQuantity' type='thousands' :precision='2' v-model="scope.row.matchQuantity" size="mini" @change="e => quantityChange(e, scope.row)"></input-formatter>
        </template>
      </el-table-column>
      <el-table-column align="right" :width="120" :label="$t('spotProj.exposure.list.noMatchQuantity')" prop="noMatchQuantity">
        <template slot-scope='scope'>
          <span>{{scope.row.noMatchQuantity | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column :width="120" :label="$t('spotProj.exposure.list.productName')" prop="productName"></el-table-column>
      <el-table-column :width="120" :label="$t('spotProj.exposure.list.contractNo')" prop="contractNo"></el-table-column>
      <el-table-column width="120" :label="item.columnTxt" :key="item.id" v-for="item in productItemInfo">
        <template slot-scope='scope'>
          {{scope.row[item.columnName]}}
        </template>
      </el-table-column>
      <el-table-column :width="120" :label="$t('spotProj.exposure.list.documentNo')" prop="documentNo"></el-table-column>
      <el-table-column align="center" :width="100" :label="$t('spotProj.exposure.list.exposureType')" prop="exposureType">
        <template slot-scope="scope">
          <span>{{scope.row.exposureType | dataDictFormat($t('datadict.exposureType'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :width="100" :label="$t('spotProj.exposure.list.direction')" prop="direction">
        <template slot-scope="scope">
          <span>{{scope.row.direction | dataDictFormat($t('datadict.spotDirection'))}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :width="120" :label="$t('spotProj.exposure.list.documentQuantity')" prop="documentQuantity">
        <template slot-scope='scope'>
          <span>{{scope.row.documentQuantity | quantityFilter | thousands}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :width="120" :label="$t('spotProj.exposure.list.price')" prop="price">
        <template slot-scope='scope'>
          <span>{{scope.row.price | priceFilter | thousands}}</span>
        </template>
      </el-table-column>
    </el-table>

    <exposureDialog v-if="dialogVisible" :hedgingMode="hedgingMode" :productCode="productCode" :direction="direction" :notCompelete="true" :match="true" @close="dialogClose" @confirm="confirm"></exposureDialog>
  </div>
</template>

<script>
import exposureDialog from '@/views/proj/spot/spotExopsure/components/exposureDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import NP from 'number-precision'

export default {
  components: {
    exposureDialog
  },
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      tableData: [],
      selectedRow: null,
      dialogVisible: false,
      productCode: '',
      direction: '',
      productItemInfo: []
    }
  },
  props: {
    tradeNature: String,
    hedgingMode: String
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
    addRow() {
      var tableData = {}
      var errMsg = ''
      if (this.tradeNature === '1') {
        tableData = this.$parent.$parent.$parent.$refs.strategyInfo.tableData
        errMsg = this.$t('strategy.spotTrade.msg.strDetailFirst')
      } else {
        tableData = this.$parent.$parent.$parent.$refs.planInfo.tableData
        errMsg = this.$t('strategy.spotTrade.msg.planDetailFirst')
      }

      if (tableData.length === 0) {
        this.$notify(
          notifyInfo({
            msg: errMsg
          })
        )
        return
      }

      this.productCode = tableData[0].productCode
      // if (this.tradeNature === '2') {
      //   this.direction = tableData[0].direction
      // }

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
      this.tableData.splice(this.tableData.indexOf(this.selectedRow), 1)
      this.quantityChange()
      this.selectedRow = null
    },
    tableChange(val) {
      this.selectedRow = val
    },
    dialogClose() {
      this.dialogVisible = false
    },
    confirm(datas) {
      var documentNos = []
      this.tableData.forEach(e => {
        documentNos.push(e.documentNo)
      })
      for (var i = 0; i < datas.length; i++) {
        var data = datas[i]
        if (documentNos.includes(data.documentNo)) {
          continue
        }
        data.id = null
        data.tenantCode = null
        this.tableData.push(data)
      }
      this.dialogVisible = false
      this.quantityChange()
    },
    quantityChange(val, row) {
      var quantity = 0.0
      this.tableData.forEach(e => {
        if (row && row === e) {
          quantity = NP.plus(parseFloat(quantity), parseFloat(val))
        } else {
          quantity = NP.plus(parseFloat(quantity), parseFloat(e.matchQuantity))
        }
      })
      this.$emit('quantityChange', quantity)
    }
  }
}
</script>
