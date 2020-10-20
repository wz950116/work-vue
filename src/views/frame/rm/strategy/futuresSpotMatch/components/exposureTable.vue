<template>
  <div class='dialog-wrapper'>
    <div>
      <div class='tabs-operate' style='margin-top:5px;'>
        <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
          <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
        </el-button>
        <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
          <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
        </el-button>
      </div>
      <el-table stripe border height="150" highlight-current-row ref="instrDetail" class='table-content tb-edit' :data="tableData" style="border:1px solid;" @current-change="handleSelectionChange">
        <el-table-column width="120" :label="$t('spotProj.exposure.list.productName')" prop="productName"></el-table-column>
        <el-table-column width="120" :label="$t('spotProj.exposure.list.contractNo')" prop="contractNo"></el-table-column>
        <el-table-column width="120" :label="$t('spotProj.exposure.list.documentNo')" prop="documentNo"></el-table-column>
        <el-table-column align="center" width="120" :label="$t('spotProj.exposure.list.exposureType')" prop="exposureType">
          <template slot-scope="scope">
            <span>{{scope.row.exposureType | dataDictFormat($t('datadict.exposureType'))}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="120" :label="$t('spotProj.exposure.list.redQuantity')" prop="quantity"></el-table-column>
        <el-table-column align="right" width="120" :label="$t('spotProj.exposure.list.price')" prop="price"></el-table-column>
        <el-table-column width="120" :label="$t('spotProj.exposure.list.attrValue')" prop="attrValue"></el-table-column>
      </el-table>
    </div>
    <compensateDialog v-if="dialogVisible" :strategyCode="strategyCode" :titleName="$t('strategy.futuresSpotMatch.tab.spotTradeDialog')" @close='close' @confirm='confirm'></compensateDialog>
  </div>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { mapGetters } from 'vuex'
import compensateDialog from '@/views/proj/spot/spotExopsure/components/compensateDialog'
export default {
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      multipleSelection: [],
      tableData: [],
      loading: true,
      dialogVisible: false
    }
  },
  components: {
    compensateDialog
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  props: {
    strategyCode: {
      type: String,
      default: ''
    }
  },
  methods: {
    close() {
      this.dialogVisible = false
    },
    confirm(val) {
      this.dialogVisible = false
      val.comp_id = val.id
      val.id = null
      val.canMatchLots =
        parseInt(val.lots) -
        parseInt(val.posMatchLots) -
        parseInt(val.preMatchLots) -
        parseInt(val.matchLots)
      val.tenantCode = null
      val.matchLots = 0
      this.tableData = []
      this.tableData.push(val)
      this.$emit('dataChange')
    },
    handleSelectionChange(val) {
      this.currentRow = val
    },
    // 增行
    addRow() {
      if (this.strategyCode === '') {
        this.$notify(
          notifyInfo({
            msg: this.$t('strategy.futuresSpotMatch.msg.strategyCodeEmpty')
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
      })
        .then(() => {
          this.tableData.splice(this.tableData.indexOf(this.currentRow), 1)
          this.currentRow = null
          this.$emit('dataChange')
        })
        .catch(() => {})
    }
  }
}
</script>
