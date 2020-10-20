<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <header style='border-radius:5px;'>
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item :label="$t('spotProj.exposure.form.documentNo')" prop="documentNo">
                <input-validate v-model="listQuery.data.documentNo" :clearable='true'></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('spotProj.exposure.form.exposureType')" prop='exposureType'>
                <el-select v-model="listQuery.data.exposureType" :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="item in $t('datadict.exposureType')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('spotProj.exposure.form.productCode')" prop='productCode'>
                <base-select v-model="listQuery.data.productCode" :attrs="{data: 'DD_PRODUCT', clearable:true}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('spotProj.exposure.form.tradeDate')" prop='tradeDate'>
                <el-date-picker v-model="listQuery.data.tradeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn" v-permission="['query']">
            <el-button type="primary" @click="listData" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
          <!-- 展开收起 -->
          <div class='expand' @click='expand' v-show='false'>
            <i v-if='expandStatus' class='el-icon-arrow-up'></i>
            <i v-else class='el-icon-arrow-down'></i>
          </div>
        </el-form>
      </header>

      <main>
        <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="400" :element-loading-text="$t('route.load')" :data="tableData" @current-change="currentChange" @selection-change="handleSelectionChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column v-if="match" type="selection" width="42" fixed></el-table-column>
          <el-table-column v-if="match" width="120" :label="$t('spotProj.exposure.list.matchQuantity')" prop="matchQuantity">
            <template slot-scope="scope">
              <input-formatter :min='0' :max='scope.row.noMatchQuantity' type='thousands' :precision='3' v-model="scope.row.matchQuantity" size="mini"></input-formatter>
            </template>
          </el-table-column>
          <el-table-column v-if="match" align="right" width="120" :label="$t('spotProj.exposure.list.noMatchQuantity')" prop="noMatchQuantity">
            <template slot-scope='scope'>
              <span>{{scope.row.noMatchQuantity | quantityFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('spotProj.exposure.list.productName')" prop="productName"></el-table-column>
          <el-table-column width="120" :label="$t('spotProj.exposure.list.contractNo')" prop="contractNo"></el-table-column>
          <el-table-column width="120" :label="item.columnTxt" :key="item.id" v-for="item in productItemInfo">
            <template slot-scope='scope'>
              <span>{{scope.row[item.columnName]}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('spotProj.exposure.list.price')" prop="price">
            <template slot-scope='scope'>
              <span>{{scope.row.price | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column width="120" :label="$t('spotProj.exposure.list.documentNo')" prop="documentNo"></el-table-column>
          <el-table-column align="center" width="100" :label="$t('spotProj.exposure.list.exposureType')" prop="exposureType">
            <template slot-scope="scope">
              <span>{{scope.row.exposureType | dataDictFormat($t('datadict.exposureType'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="80" :label="$t('spotProj.exposure.list.direction')" prop="direction">
            <template slot-scope="scope">
              <span>{{scope.row.direction | dataDictFormat($t('datadict.spotDirection'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('spotProj.exposure.list.documentQuantity')" prop="documentQuantity">
            <template slot-scope='scope'>
              <span>{{scope.row.documentQuantity | quantityFilter | thousands}}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部 -->
        <div class='bottom-operate'>
          <!-- 分页 -->
          <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
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
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  components: {},
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      tableData: [],
      selectData: null,
      activeName: 'mainInfo',
      subActiveName: 'subInfo',
      total: 0,
      loading: true,
      productItemInfo: [],
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          documentNo: '',
          tradeDate: '',
          productCode: this.productCode,
          direction: this.direction,
          notCompelete: this.notCompelete,
          exposureType: this.hedgingMode,
          confirmStat: '1'
        },
        defaultSortString: 'id.asc'
      }
    }
  },
  props: {
    productCode: {
      type: String,
      default: ''
    },
    direction: String,
    hedgingMode: {
      type: String,
      default: ''
    },
    title: String,
    match: {
      type: Boolean,
      default: false
    },
    notCompelete: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('spotProj.exposure.dialog.title')
    }
  },
  mounted() {
    this.listData()
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
    listData() {
      this.loading = true
      request({
        url: '/api/spot/strgExposure/list',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        this.tableData = request.data
        this.tableData.forEach(e => {
          e.matchQuantity = e.noMatchQuantity
        })
        this.total = request.total
        this.loading = false
      })
    },
    handleDbclick(data) {
      if (this.match) {
        this.$emit('confirm', [data])
      } else {
        this.$emit('confirm', data)
      }
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (this.selectData.length === 0) {
        this.$notify(
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
      this.selectData = val
    },
    currentChange(val) {
      this.selectData = val
    },
    // 展开收起
    expand() {
      this.expandStatus = !this.expandStatus
      this.tableComputed()
    },
    tableComputed() {
      this.$nextTick(() => {
        const getElHeadHeight = window.getComputedStyle(document.getElementById('elHead')).height.split('px')[0]
        if (this.$parent.$refs.qmTable) {
          this.$parent.$refs.qmTable.tableHeight = this.clientWidth < 1366 ? (this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 188 : this.clientHeight - getElHeadHeight - 158) : this.$parent.$refs.qmTable.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 172 : this.clientHeight - getElHeadHeight - 142
        }
      })
    }
  }
}
</script>
