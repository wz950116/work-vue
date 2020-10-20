<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <main>
        <el-table stripe border highlight-current-row ref="instrDetail" class='table-content tb-edit' :data="tableData" style="border:1px solid;" height='400' @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
          <el-table-column :label="$t('strategy.optionMatch.list.contractCode')" width="200" prop="contractCode"></el-table-column>
          <el-table-column align='center' :label="$t('strategy.optionMatch.list.optionOffset')" width="80" prop="optionOffset">
            <template slot-scope="scope">
              <span>{{scope.row.optionOffset | dataDictFormat($t('datadict.optionOffset'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' :label="$t('strategy.optionMatch.list.direction')" width="80" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' :label="$t('strategy.optionMatch.list.callPut')" width="80" prop="callPut">
            <template slot-scope="scope">
              <span>{{scope.row.callPut | dataDictFormat($t('datadict.callPut'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align='right' :label="$t('strategy.optionMatch.list.strikePrice')" width="120" prop="strikePrice">
            <template slot-scope='scope'>
              <span>{{scope.row.strikePrice | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column align='right' :label="$t('strategy.optionMatch.list.price')" width="120" prop="price">
            <template slot-scope='scope'>
              <span>{{scope.row.price | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column align='right' :label="$t('strategy.optionMatch.list.lots')" width="120" prop="lots">
            <template slot-scope='scope'>
              <span>{{scope.row.lots | quantityFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column align='center' :label="$t('strategy.optionMatch.list.endDate')" width="120" prop="endDate">
            <template slot-scope='scope'>
              <span>{{scope.row.endDate | dateFormat}}</span>
            </template>
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
      return this.$t('strategy.optionMatch.tab.instructionTable')
    }
  },
  props: {
    instructionCode: {
      type: String,
      default: ''
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
        url: '/api/strategy/strgOptInstrDetail/get',
        method: 'POST',
        data: {
          data: this.instructionCode,
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
          i.noMatchLots = parseInt(i.lots) - parseInt(i.matchLots)
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
