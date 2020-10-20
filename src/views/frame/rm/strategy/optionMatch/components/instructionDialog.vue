<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <header style='border-radius:5px;'>
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.optionMatch.dialog.instructionName')" prop="instructionName">
                <input-validate v-model="listQuery.data.instructionName"></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.optionMatch.dialog.deptCode')" prop='deptCode'>
                <base-select v-model="listQuery.data.deptCode" :attrs="{data: 'TREE_DEPT',clearable: true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('strategy.optionMatch.dialog.orderCode')" prop='orderCode'>
                <base-select v-model="listQuery.data.orderCode" :attrs="{data: 'TREE_STAFF',clearable: true}"></base-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn">
            <el-button type="primary" @click="listData" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
        </el-form>
      </header>

      <main>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="$t( 'biz.lbl.mainInfo')" name="mainInfo">
            <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height='250' :element-loading-text="$t( 'route.load')" :data="tableData" @current-change="handleSelectionChange" @row-dblclick="handleDbclick">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column width="100" :label="$t( 'strategy.optionMatch.dialog.deptName')" prop="deptName"></el-table-column>
              <el-table-column width="150" :label="$t( 'strategy.optionMatch.dialog.instructionName')" prop="instructionName"></el-table-column>
              <el-table-column width="150" :label="$t( 'strategy.optionMatch.dialog.instructionCode')" prop="instructionCode"></el-table-column>
              <el-table-column width="150" :label="$t( 'strategy.optionMatch.dialog.planName')" prop="planName"></el-table-column>
              <el-table-column width="150" :label="$t( 'strategy.optionMatch.dialog.planCode')" prop="planCode"></el-table-column>
              <el-table-column width="80" :label="$t( 'strategy.optionMatch.dialog.orderName')" prop="orderName"></el-table-column>
              <el-table-column width="80" :label="$t( 'strategy.optionMatch.dialog.traderName')" prop="traderName"> </el-table-column>
              <el-table-column width="100" :label="$t( 'strategy.optionMatch.dialog.startDate')" prop="startDate">
                <template slot-scope="scope">
                  <span>{{scope.row.startDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" :label="$t( 'strategy.optionMatch.dialog.endDate')" prop="endDate">
                <template slot-scope="scope">
                  <span>{{scope.row.endDate | dateFormat}}</span>
                </template>
              </el-table-column>
            </el-table>

            <!-- 底部 -->
            <div class='bottom-operate'>
              <!-- 分页 -->
              <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>

        <el-tabs v-model="subActiveName" type="border-card">
          <el-table stripe border ref="instrDetail" class='table-content tb-edit' :data="instrDetailDtoList" style="border:1px solid;" height="150">
            <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
            <el-table-column type="selection" width="45" align='center'></el-table-column>
            <el-table-column :label="$t('strategy.optionMatch.list.contractCode')" width="120" prop="contractCode"></el-table-column>
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
        </el-tabs>
      </main>
      <!-- 底部 -->
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
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { dateFormate } from '@/utils/frame/base/index'
export default {
  components: {},
  data() {
    return {
      instrDetailDtoList: [],
      tableData: [],
      selectData: {},
      activeName: 'mainInfo',
      subActiveName: 'subInfo',
      total: 0,
      loading: true,
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: { auditStatus: '3' },
        defaultSortString: 'instructionCode.desc'
      },
      strategyCodeF: '',
      directionF: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('strategy.instruction.dialog.title')
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
  methods: {
    handleDbclick(data) {
      this.$emit('confirm', data)
    },
    listData() {
      var date = dateFormate(new Date(), 'YYYYMMDD')
      this.listQuery.data.queryDate = date
      request({
        url: '/api/strategy/strgOptInstruction/pageDialog',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (!this.selectData) {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$emit('confirm', this.selectData)
    },
    // 页码跳转
    handleSizeChange(val) {
      this.listQuery.size = val
      this.listData()
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.listData()
    },
    handleSelectionChange(val) {
      if (val) {
        this.selectData = val
        this.loading = true
        request({
          url: '/api/strategy/strgOptInstrDetail/get',
          method: 'POST',
          data: {
            data: val.instructionCode,
            funcModule: '指令详细',
            funcOperation: '查询'
          }
        }).then(request => {
          this.loading = false
          this.instrDetailDtoList = request.data
        })
      }
    }
  }
}
</script>
