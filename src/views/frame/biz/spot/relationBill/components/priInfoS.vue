<template>
  <div>
    <div class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" @click="doView">
        <svg-icon icon-class='线性-查看' />{{ $t('biz.btn.view') }}
      </el-button>
    </div>
    <el-table stripe border class='table-content table-array-row' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :default-sort="{prop:'createDate'}" @current-change="handleSelectRow" max-height="450">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")' />
      <template v-for='col in formThead'>
        <el-table-column :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='!$t(col.isSon)' show-overflow-tooltip>
          <template slot="header" slot-scope='scope'>
            <span :data-header='scope'>{{ $t(col.label) }}</span>
          </template>
          <template slot-scope='scope'>
            <slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
            <template v-else-if='col.isSon'>
              <div class='nest' style='display:block;height:24px;' v-for='(i, index) in scope.row["productDetailList"]' :key="index" :style="{'border-top': index > 0 ? '1px solid #aaaaaa' : ''}">
                <span v-if='!col.format'>{{ i[col.prop] }}</span>
                <span v-else>{{ dataFormat(col.format.func, i[col.prop], col.format.dict) }}</span>
              </div>
            </template>
            <div v-else :style='col.style'>
              <span v-if='col.formatter'>{{ col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) }}</span>
              <span v-else-if='!col.format'>{{ scope.row[col.prop] }}</span>
              <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict) }}</span>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      loading: false,
      currentRow: null,
      formThead: [
        {
          label: 'spot.contractLot.form.docMakeDt',
          prop: 'createDate',
          width: '150',
          align: 'center'
        },
        {
          label: 'spot.pricingLot.list.contractCode',
          width: '180',
          prop: 'contractCode'
        },
        {
          label: 'spot.pricingReg.list.pricingCode',
          width: '180',
          prop: 'pricingCode'
        },
        {
          label: 'spot.pricingReg.list.productName',
          width: '180',
          prop: 'productName'
        },
        {
          label: 'spot.pricingReg.list.pricingType',
          width: '90',
          align: 'center',
          prop: 'pricingType',
          format: {
            dict: this.$t('datadict.pricingType')
          }
        },
        {
          label: 'spot.pricingReg.list.pricingBenchmark',
          width: '180',
          prop: 'pricingItemName'
        },
        {
          label: 'spot.pricingReg.list.pricingTime',
          width: '90',
          align: 'center',
          prop: 'pricingTime',
          format: {
            dict: 'yyyy-MM-dd',
            func: 'dateFormat'
          }
        },
        {
          label: 'spot.pricingReg.list.pricingQuantity',
          width: '120',
          align: 'right',
          prop: 'pricingQuantity',
          format: {
            func: 'weight'
          }
        },
        {
          label: 'spot.pricingConfirm.list.confirmQuantity',
          width: '100',
          align: 'right',
          prop: 'confirmQuantity',
          format: {
            func: 'weight'
          }
        },
        {
          label: 'spot.pricingReg.list.valueUnit',
          width: '90',
          align: 'center',
          prop: 'valueUnit',
          format: {
            dict: this.$t('datadict.measurementUnit')
          }
        },
        {
          label: 'spot.pricingReg.list.price',
          width: '120',
          align: 'right',
          prop: 'price',
          format: {
            func: 'money'
          }
        },
        {
          label: 'spot.pricingConfirm.list.confirmPrice',
          width: '120',
          align: 'right',
          prop: 'confirmPrice',
          format: {
            func: 'money'
          }
        },
        {
          label: 'spot.pricingConfirm.list.currency',
          width: '90',
          align: 'center',
          prop: 'currencyName'
        }
      ],
      tableData: []
    }
  },
  props: {},
  mounted() {},
  methods: {
    dataFormat(func = 'dataDictFormat', value, list) {
      return Vue.filter(func)(value, list)
    },
    searchDataList(pkKeyList) {
      const tableData = this.tableData
      tableData.splice(0)
      if (pkKeyList === null || pkKeyList === undefined || pkKeyList.length === 0) {
        return
      }
      const pcNoList = pkKeyList.map(key => key.billNo)
      request({
        url: '/api/pricingInfo/list',
        method: 'post',
        data: {
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            contractNoList: pcNoList,
            purchaseOrSale: 'S',
            auditStatus: '3'
          }
        }
      }).then(response => {
        if (response.status) {
          for (let i = 0; i < response.data.length; i++) {
            tableData.push(response.data[i])
          }
        }
      })
    },
    doView() {
      const currentRow = this.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      this.$router.push({
        name: 'pricingRegView',
        params: {
          id: currentRow.pricingCode,
          opType: 'view',
          back: 'conRelationBill',
          backParam: this.$route.params
        }
      })
    },
    handleSelectRow(val) {
      this.currentRow = val
    }
  }
}
</script>
