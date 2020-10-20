<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <main>
        <el-table stripe border highlight-current-row ref="instrDetail" class='table-content tb-edit' :data="tableData" style="border:1px solid;" height='400' @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
          <!-- 品种 -->
          <el-table-column width="120" :label="$t('strategy.instruction.tab.productCode')" prop="productName"></el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.contractCode')" width="120" prop="contractName">
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.direction')" width="80" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.offsetFlag')" width="80" prop="offsetFlag">
            <template slot-scope="scope">
              <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.lots')" width="120" prop="lots">
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.unit')" width="90">
            <template slot-scope="scope">
              <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.price')" width="120" prop="price">
            <template slot-scope="scope">
              {{scope.row.price | priceFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.priceDiff')" width="120" prop="priceDiff">
            <template slot-scope="scope">
              {{scope.row.priceDiff | priceFilter | thousands}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.currencyCode')" width="90" prop="currencyName">

          </el-table-column>
          <el-table-column :label="$t('strategy.instruction.tab.remark')" width="160" prop="remark">

          </el-table-column>
        </el-table>
      </main>

      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="cancel">
          {{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type='primary' v-db-click size="mini" @click="save">
          {{$t('biz.btn.choose')}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      multipleSelection: {},
      tableData: [],
      loading: true
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.instruction.tab.detailSelect')
    }
  },
  props: {
    instructionCode: {
      type: String,
      default: ''
    },
    itemClass: {
      type: Array,
      default: ['2']
    }
  },
  mounted() {
    this.listData()
  },
  watch: {
    instructionCode(val) {
      this.listData()
    }
  },
  methods: {
    listData() {
      this.loading = true
      request({
        url: '/api/strg/strgInstrDetail/listByCode',
        method: 'POST',
        data: {
          data: {
            instructionCode: this.instructionCode,
            itemClassList: this.itemClass
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        this.tableData = response.data
        this.tableData.forEach((i, index) => {
          i.detailId = i.id
          i.rowNum = index
          i.id = ''
          i.versionNum = ''
          i.unitCode = '11'
        })
        this.loading = false
      })
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    cancel() {
      this.$emit('closeHandlerDialog')
    },
    save() {
      if (!this.multipleSelection) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.multipleSelection)
    },
    handleDbclick(data) {
      this.$emit('confirm', data)
    }
  }
}
</script>
