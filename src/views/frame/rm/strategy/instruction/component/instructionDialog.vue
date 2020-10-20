<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' style="height: 640px">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <header style='border-radius:5px;'>
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.instruction.form.instructionName')" prop="instructionName">
                <input-validate v-model="listQuery.data.instructionName"></input-validate>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.instruction.form.deptCode')" prop='deptCode'>
                <base-select v-model="listQuery.data.deptCode" :attrs="{data: 'TREE_DEPT',clearable: true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.instruction.form.productCode')" prop='productCode'>
                <base-select v-model="listQuery.data.productCode" :attrs="{data: 'FUTURES_VARIETIES',clearable:true,params:{usingFlag: '1'} ,filterable: true}"></base-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.instruction.form.contractCode')" prop='contractCode'>
                <base-select v-model="listQuery.data.contractCode" :attrs="{data: 'FUTURES_CONTRACT',clearable:true ,filterable: true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.instruction.form.direction')" prop='direction'>
                <el-select v-model="listQuery.data.direction" :placeholder="$t( 'biz.placeholder.choose')" :clearable="true">
                  <el-option v-for="item in $t( 'datadict.futuresDirection')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.instruction.form.offsetFlag')" prop='offsetFlag'>
                <el-select v-model="listQuery.data.offsetFlag" :placeholder="$t( 'biz.placeholder.choose')" :clearable="true">
                  <el-option v-for="item in $t( 'datadict.offset')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t( 'strategy.instruction.form.startDate')" prop='startDate'>
                <el-date-picker v-model="listQuery.data.startDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :clearable="true" />
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
              <el-table-column width="100" :label="$t( 'strategy.instruction.list.organName')" prop="organName"></el-table-column>
              <el-table-column width="100" :label="$t( 'strategy.instruction.list.deptName')" prop="deptName"></el-table-column>
              <el-table-column width="150" :label="$t( 'strategy.instruction.list.instructionName')" prop="instructionName"></el-table-column>
              <el-table-column width="150" :label="$t( 'strategy.instruction.list.instructionCode')" prop="instructionCode"></el-table-column>
              <el-table-column width="100" :label="$t( 'strategy.instruction.list.instructionType')" prop="instructionType">
                <template slot-scope="scope">
                  <span>{{scope.row.instructionType | dataDictFormat($t('datadict.instructionType1'))}}</span>
                </template>
              </el-table-column>
              <el-table-column width="150" :label="$t( 'strategy.instruction.list.strategyName')" prop="strategyName"></el-table-column>
              <el-table-column width="150" :label="$t( 'strategy.instruction.list.strategyCode')" prop="strategyCode"></el-table-column>
              <el-table-column width="100" :label="$t( 'strategy.instruction.list.startDate')" prop="startDate">
                <template slot-scope="scope">
                  <span>{{scope.row.startDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column width="100" :label="$t( 'strategy.instruction.list.endDate')" prop="endDate">
                <template slot-scope="scope">
                  <span>{{scope.row.endDate | dateFormat}}</span>
                </template>
              </el-table-column>
              <el-table-column width="80" :label="$t( 'strategy.instruction.list.orderName')" prop="orderName"></el-table-column>
              <el-table-column width="80" :label="$t( 'strategy.instruction.list.traderName')" prop="traderName"> </el-table-column>

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
            <!-- 品种 -->
            <el-table-column width="120" :label="$t( 'strategy.instruction.tab.productCode')" prop="productName"></el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.contractCode')" width="120" prop="contractName">
            </el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.direction')" width="80" prop="direction">
              <template slot-scope="scope">
                <span>{{scope.row.direction | dataDictFormat($t('datadict.futuresDirection'))}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.offsetFlag')" width="80" prop="offsetFlag">
              <template slot-scope="scope">
                <span>{{scope.row.offsetFlag | dataDictFormat($t('datadict.offset'))}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.lots')" width="120" prop="lots">
            </el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.unit')" width="90">
              <template slot-scope="scope">
                <span>{{scope.row.unitCode | dataDictFormat($t('datadict.measurementUnit'))}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.price')" width="120" prop="price">
              <template slot-scope="scope">
                {{scope.row.price | priceFilter | thousands}}
              </template>
            </el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.priceDiff')" width="120" prop="priceDiff">
              <template slot-scope="scope">
                {{scope.row.priceDiff | priceFilter | thousands}}
              </template>
            </el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.currencyCode')" width="90" prop="currencyName">
            </el-table-column>
            <el-table-column :label="$t( 'strategy.instruction.tab.remark')" width="160" prop="remark">

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
        data: {
          auditStatus: '3',
          closeStat: '0'
        },
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
    strategyCode: {
      type: String,
      default: ''
    },
    direction: {
      type: String,
      default: ''
    },
    strategyNature: {
      type: String,
      default: ''
    },
    strategyNatures: Array,
    strgLevels: Array,
    itemClassF: {
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
      if (this.strategyCode) {
        this.listQuery.data.strategyCode = this.strategyCode
      }
      if (this.direction) {
        this.listQuery.data.direction = this.direction
      }
      if (this.strategyNature) {
        this.listQuery.data.strategyNature = this.strategyNature
      }
      if (this.strategyNatures && this.strategyNatures.length > 0) {
        this.listQuery.data.strategyNatures = this.strategyNatures
      }
      if (this.strgLevels && this.strgLevels.length > 0) {
        this.listQuery.data.strgLevels = this.strgLevels
      }
      var date = dateFormate(new Date(), 'YYYYMMDD')
      this.listQuery.data.queryDate = date
      request({
        url: '/api/strg/instruction/list',
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
          url: '/api/strg/strgInstrDetail/list',
          method: 'POST',
          data: {
            data: {
              instructionCode: val.instructionCode,
              direction: this.listQuery.data.direction,
              offsetFlag: this.listQuery.data.offsetFlag,
              contractCode: this.listQuery.data.contractCode,
              productCode: this.listQuery.data.productCode
            },
            funcModule: '指令详细',
            funcOperation: '查询'
          }
        }).then(request => {
          this.loading = false
          this.instrDetailDtoList = request.data
          this.instrDetailDtoList.forEach(element => {
            element.unitCode = '11'
          })
        })
      }
    }
  }
}
</script>
