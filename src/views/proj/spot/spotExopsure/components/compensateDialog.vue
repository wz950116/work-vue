<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' :style="{width: this.sidebar.opened ? '700px' : '850px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />

      <main>
        <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='374' @current-change="currentChange" @row-dblclick="handleDbclick">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column width="120" :label="$t('spotProj.exposure.list.productName')" prop="productName"></el-table-column>
          <el-table-column width="120" :label="$t('spotProj.exposure.list.contractNo')" prop="contractNo"></el-table-column>
          <el-table-column width="120" :label="$t('spotProj.exposure.list.documentNo')" prop="documentNo"></el-table-column>
          <el-table-column width="100" :label="$t('spotProj.exposure.list.exposureType')" prop="exposureType">
            <template slot-scope="scope">
              <span>{{scope.row.exposureType | dataDictFormat($t('datadict.exposureType'))}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('spotProj.exposure.list.redQuantity')" prop="quantity">
            <template slot-scope='scope'>
              <span>{{scope.row.redQuantity | quantityFilter | thousands}}</span>
            </template>
          </el-table-column>
          <el-table-column align="right" width="120" :label="$t('spotProj.exposure.list.price')" prop="price">
            <template slot-scope='scope'>
              <span>{{scope.row.price | priceFilter | thousands}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column width="200" :label="$t('spotProj.exposure.list.attrValue')" prop="attrValue"></el-table-column> -->
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
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'

export default {
  data() {
    return {
      activeName: 'taxList',
      mainInfoVisible: true,
      dataIsChange: false,
      onOff: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      tableData: [],
      selectData: {}
    }
  },
  props: {
    strategyCode: String,
    titleName: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  mounted() {
    this.listData()
  },
  methods: {
    listData() {
      request({
        url: '/api/strategy/strgSpotExpComp/listByCode',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.strategyCode
        }
      }).then(response => {
        this.tableData = response.data
      })
    },
    cancel() {
      this.$emit('close')
    },
    save() {
      if (this.selectData === {}) {
        if (!this.buyCurrentRow) {
          this.$notify(
            notifyInfo({
              msg: this.$t('biz.msg.noRowSelected')
            })
          )
          return
        }
      }
      this.$emit('confirm', this.selectData)
    },
    handleDbclick(data) {
      this.$emit('confirm', data)
    },
    currentChange(val) {
      this.selectData = val
    }
  }
}
</script>
