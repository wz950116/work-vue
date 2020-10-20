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
              <div class='nest' style='display:block;height:24px;' v-for='(i, index) in scope.row["inProductList"]' :key="index" :style="{'border-top': index > 0 ? '1px solid #aaaaaa' : ''}">
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
          label: 'spot.contractLot.form.contractNo',
          width: '180',
          prop: 'contractNo'
        },
        {
          label: 'spot.contractLot.form.lotNo',
          width: '180',
          prop: 'lotNo'
        },
        {
          label: 'storage.inNotice.list.inBillNo',
          prop: 'inBillNo',
          width: '180'
        },
        {
          label: 'storage.inNotice.list.inDate',
          prop: 'inDate',
          width: '90',
          format: {
            func: 'dateFormat',
            dict: 'YYYY-MM-DD'
          }
        },
        {
          label: 'storage.ladingBill.list.supplierName',
          prop: 'supplierName',
          width: '240'
        },
        {
          label: 'storage.ladingBill.form.deliverCode',
          prop: 'deliverName',
          width: '240'
        },
        {
          label: 'storage.inNotice.list.warehouseName',
          prop: 'warehouseName',
          width: '240'
        },
        {
          label: 'spot.contractLot.form.productName',
          width: '180',
          prop: 'productName',
          isSon: true
        },
        ...this.$store.state.user.mainGoodColsTxtSon,
        {
          prop: 'itemCount',
          width: '120',
          align: 'right',
          label: 'storage.inNotice.list.itemCount',
          format: {
            func: 'thousands',
            dict: 0
          },
          isSon: true
        },
        {
          prop: 'inQuantity',
          width: '120',
          align: 'right',
          label: 'storage.inNotice.list.inQuantity',
          format: {
            func: 'thousands',
            dict: 3
          },
          isSon: true
        },
        {
          prop: 'actualQuantity',
          width: '120',
          align: 'right',
          label: 'storage.inCheck.list.actualQuantity',
          format: {
            func: 'thousands',
            dict: 3
          },
          isSon: true
        },
        {
          prop: 'productUnitCode',
          width: '90',
          align: 'center',
          label: 'storage.inNotice.list.productUnitCode',
          format: {
            dict: this.$t('datadict.goodsUnit')
          },
          isSon: true
        },
        {
          prop: 'measurementQuantity',
          width: '120',
          align: 'right',
          label: 'storage.inNotice.list.inMeasurementQuantity',
          format: {
            func: 'thousands',
            dict: 3
          },
          isSon: true
        },
        {
          prop: 'actualMeasurementQuantity',
          width: '120',
          align: 'right',
          label: 'storage.inCheck.list.actualMeasurementQuantity',
          format: {
            func: 'thousands',
            dict: 3
          },
          isSon: true
        },
        {
          prop: 'measurementUnitCode',
          width: '90',
          align: 'center',
          label: 'storage.inNotice.list.measurementUnitCode',
          format: {
            dict: this.$t('datadict.measurementUnit')
          },
          isSon: true
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
      const billNo = pkKeyList.map(key => key.billNo)
      const billDtlNo = pkKeyList.map(key => key.billDtlNo)
      request({
        url: '/api/warehouse/inBill/list',
        method: 'post',
        data: {
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            inBillNoList: billNo,
            inProductNoList: billDtlNo,
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
        name: 'ladingBillView',
        params: {
          id: currentRow.ladingBillNo,
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
