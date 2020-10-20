<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '1100px' : '1250px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <!-- 顶部按钮 -->
      <el-row class='top-operate'>
        <el-button v-db-click size="mini" style='margin-right:6px;' @click="cancel">
          <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
        </el-button>
        <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="save">
          <svg-icon icon-class="线性-详情"></svg-icon>{{$t('biz.btn.confirm')}}
        </el-button>
      </el-row>

      <header id='elHead' :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
        <el-form ref='validateForm' label-position="left" :inline="true" :model="postData" :rules='rules' class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item v-if="templateType === '2'" :label="$t('cst.satisfaction.dialog.templateCode')" prop='templateCode'>
                <base-select v-model="postData.templateCode" :attrs="{data: 'CUST_TEMPLATE', params:{usingFlag: '1', templateType: '2'}}" size="mini"></base-select>
              </el-form-item>

              <el-form-item v-if="templateType === '1'" :label="$t('cst.satisfaction.dialog.templateCode')" prop='templateCode'>
                <base-select v-model="postData.templateCode" :attrs="{data: 'CUST_TEMPLATE', params:{usingFlag: '1', templateType: '1'}}" size="mini"></base-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>

      <header>
        <el-form ref='queryForm' label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <el-col :span="8">
              <el-form-item v-if="templateType === '1'" :label="$t('cst.satisfaction.dialog.custName')" prop='custCode'>
                <base-select v-model="listQuery.data.custCode" :attrs="{data: 'CUST_INFO', clearable:true,params: {typeCode: '2',usingFlag: '1',auditStatus: '3'},}"></base-select>
              </el-form-item>
              <el-form-item v-if="templateType === '2'" :label="$t('cst.satisfaction.dialog.custName1')" prop='custCode'>
                <base-select v-model="listQuery.data.custCode" :attrs="{data: 'CUST_INFO', clearable:true,params: {typeCode: '1',usingFlag: '1',auditStatus: '3'},}"></base-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('cst.satisfaction.dialog.executeName')" prop='executeCode'>
                <base-select v-model="listQuery.data.executeCode" :attrs="{data: 'FUNC_EMPLOYEE', clearable:true}"></base-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 右侧搜索按钮 -->
          <div class="search-btn">
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
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="$t('biz.lbl.mainInfo')" name="mainInfo">
            <el-table stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :height="400" :element-loading-text="$t('route.load')" :data="tableData" @current-change="currentChange" @selection-change="handleSelectionChange">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column :width="200" :label="$t('cst.satisfaction.dialog.custName')" prop="custName"></el-table-column>
              <el-table-column :width="100" :label="$t('cst.satisfaction.dialog.typeName')" prop="typeName"></el-table-column>
              <el-table-column :width="250" :label="$t('cst.satisfaction.dialog.executeName')" prop="executeName"></el-table-column>
              <el-table-column v-if="templateType === '2'" align="right" :width="200" :label="$t('cst.satisfaction.dialog.sellAmount')" prop="sellAmount">
                <template slot-scope="scope">
                  <span>{{scope.row.sellAmount | money}}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="templateType === '1'" align="right" :width="200" :label="$t('cst.satisfaction.dialog.buyAmount')" prop="sellAmount">
                <template slot-scope="scope">
                  <span>{{scope.row.buyAmount | money}}</span>
                </template>
              </el-table-column>
              <el-table-column :width="250" :label="$t('cst.satisfaction.dialog.productName')" prop="productName"></el-table-column>
            </el-table>

            <!-- 底部 -->
            <div class='bottom-operate'>
              <!-- 分页 -->
              <el-pagination small background layout="total, sizes, prev, pager, next, jumper" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80 ,100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="$t('cst.satisfaction.dialog.evaluationProduct')" name="mainInfo">
            <el-checkbox-group v-model="evaluationProduct" size="mini" style="margin-top: 5px;margin-left: 5px">
              <el-checkbox v-for="product in products" :key="product" :label="product"></el-checkbox>
            </el-checkbox-group>
          </el-tab-pane>
        </el-tabs>
      </main>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import Vue from 'vue'

export default {
  components: {},
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      tableData: [],
      evaluationProduct: [],
      selectData: null,
      activeName: 'mainInfo',
      subActiveName: 'subInfo',
      total: 0,
      loading: true,
      products: [],
      listQuery: {
        current: 1,
        size: 20,
        isPage: true,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          custCode: '',
          executeCode: '',
          templateType: this.templateType
        },
        defaultSortString: 'id.asc'
      },
      postData: {
        templateCode: '',
        custCode: ''
      },
      rules: {
        templateCode: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {
    templateType: String
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('cst.satisfaction.dialog.title')
    }
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      this.loading = true
      request({
        url: '/api/cust/custSatisfaction/listCustInfo',
        method: 'POST',
        data: this.listQuery
      }).then(request => {
        for (let i = 0; i < request.data.length; i++) {
          var item = request.data[i]
          var typeArray = request.data[0].typeCode.split('')
          var typeName = ''
          for (let j = 0; j < typeArray.length; j++) {
            typeName += Vue.filter('dataDictFormat')(typeArray[j], this.$t('datadict.custType')) + ','
          }
          item.typeName = typeName.substring(0, typeName.length - 1)
        }
        this.tableData = request.data
        this.total = request.total
        this.loading = false
      })
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      this.$refs['validateForm'].validate(valid => {
        if (valid) {
          if (!this.selectData) {
            this.$notify(
              notifyInfo({
                msg: this.$t('biz.msg.noRowSelected')
              })
            )
            return
          }
          this.selectData.templateCode = this.postData.templateCode
          let evaluationProduct = ''
          for (let i = 0; i < this.evaluationProduct.length; i++) {
            evaluationProduct = evaluationProduct + this.evaluationProduct[i]
            if (i != this.evaluationProduct.length - 1) {
              evaluationProduct = evaluationProduct + ','
            }
          }
          this.selectData.evaluationProduct = evaluationProduct
          this.$emit('confirm', this.selectData)
        }
      })
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
      this.products = val.productName.split(',')
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
