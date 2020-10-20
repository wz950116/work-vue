<!-- 期货价格调整单(调整单明细) -->
<template>
  <div>
    <!-- 价格补录 -->
    <template v-if='adjustTypeChange=== "2"'>
      <div class='operate' v-if="!disabled">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :btnName="$t('biz.btn.import')" />
        <el-button @click="downTemp()" size="mini">
          <i class='el-icon-download'></i>{{ $t('biz.btn.export') }}
        </el-button>
      </div>
      <el-table :height="tableHeight" :data="myDetailData" key="supDetailData" stripe v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.1)" border class='table-content tb-edit' ref="multipleTable" style="border:1px solid">
        <el-table-column align='center' type="index" width="50" label=' ' fixed></el-table-column>
        <el-table-column align='center' prop='priceDate' :label="$t('quotation.futuresPriceAdjust.priceDate')" width='100'>
          <template slot-scope='scope'>
            <span>{{scope.row.priceDate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='exchangeName' :label="$t('quotation.futuresPriceAdjust.exchangeName')" min-width='150'></el-table-column>
        <el-table-column prop='futuresVarietiesName' :label="$t('quotation.futuresPriceAdjust.futuresVarietiesName')" min-width='100'></el-table-column>
        <el-table-column prop='futuresContractName' :label="$t('quotation.futuresPriceAdjust.futuresContractName')" min-width='150'></el-table-column>
        <el-table-column prop='futuresContractCode' :label="$t('quotation.futuresPriceAdjust.futuresContractCode')" min-width='150'></el-table-column>
        <!-- 补录只显示开盘价的 -->
        <el-table-column align="right" prop='openPriceOld' :label="$t('quotation.futuresPriceAdjust.openPriceOld')" min-width='200' v-if="disabled">
          <template slot-scope='scope'>
            <span>{{scope.row.openPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='openPrice' :label="$t('quotation.futuresPriceAdjust.openPrice')" min-width='200' v-if="!disabled"></el-table-column>
        <el-table-column align="right" prop='closingPriceOld' :label="$t('quotation.futuresPriceAdjust.closingPriceOld')" min-width='200' v-if="disabled">
          <template slot-scope='scope'>
            <span>{{scope.row.closingPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='closingPrice' :label="$t('quotation.futuresPriceAdjust.closingPrice')" min-width='200' v-if="!disabled"></el-table-column>
        <el-table-column align="right" prop='highestPriceOld' :label="$t('quotation.futuresPriceAdjust.highestPriceOld')" min-width='200' v-if="disabled">
          <template slot-scope='scope'>
            <span>{{scope.row.highestPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='highestPrice' :label="$t('quotation.futuresPriceAdjust.highestPrice')" min-width='200' v-if="!disabled"></el-table-column>
        <el-table-column align="right" prop='lowestPriceOld' :label="$t('quotation.futuresPriceAdjust.lowestPriceOld')" min-width='200' v-if="disabled">
          <template slot-scope='scope'>
            <span>{{scope.row.lowestPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='lowestPrice' :label="$t('quotation.futuresPriceAdjust.lowestPrice')" min-width='200' v-if="!disabled"></el-table-column>
        <el-table-column align="right" prop='settlementPriceOld' :label="$t('quotation.futuresPriceAdjust.settlementPriceOld')" min-width='200' v-if="disabled">
          <template slot-scope='scope'>
            <span>{{scope.row.settlementPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='settlementPrice' :label="$t('quotation.futuresPriceAdjust.settlementPrice')" min-width='200' v-if="!disabled"></el-table-column>
        <el-table-column align="center" prop='currencyName' :label="$t('quotation.futuresPriceAdjust.currency')" min-width='100'>
        </el-table-column>
        <el-table-column prop='result' :label="$t('quotation.futuresPriceAdjust.result')" min-width='220' show-overflow-tooltip></el-table-column>
      </el-table>
    </template>
    <!-- 价格调整 -->
    <template v-else>
      <div class='operate' v-if="!disabled">
        <el-button @click="addRow" size="mini">
          <svg-icon icon-class="增行"></svg-icon>{{ $t('biz.btn.addRow') }}
        </el-button>
        <el-button @click="delRow" size="mini">
          <svg-icon icon-class="删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
        </el-button>
      </div>
      <el-table :height="tableHeight" :data="myDetailData" key="adjDetailData" stripe v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.1)" border class='table-content tb-edit' ref="multipleTable" style="border:1px solid" @row-click="handleCurrent" @selection-change="selectionChange">
        <el-table-column align='center' type="index" fixed="left" width="50" label=' '></el-table-column>
        <el-table-column type="selection" fixed="left" width="42" v-if='!disabled'></el-table-column>
        <el-table-column align='center' prop='priceDate' :label="$t('quotation.futuresPriceAdjust.priceDate')" min-width='200'>
          <template slot-scope='scope'>
            <span>{{scope.row.priceDate | dateFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop='exchangeName' show-overflow-tooltip :label="$t('quotation.futuresPriceAdjust.exchangeName')" min-width='160'></el-table-column>
        <el-table-column prop='futuresVarietiesName' show-overflow-tooltip :label="$t('quotation.futuresPriceAdjust.futuresVarietiesName')" min-width='120'></el-table-column>
        <el-table-column prop='futuresContractName' show-overflow-tooltip :label="$t('quotation.futuresPriceAdjust.futuresContractName')" min-width='120'></el-table-column>
        <el-table-column prop='futuresContractCode' :label="$t('quotation.futuresPriceAdjust.futuresContractCode')" min-width='200'></el-table-column>
        <el-table-column align="right" prop='openPriceOld' :label="$t('quotation.futuresPriceAdjust.openPriceOld')" min-width='200' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.openPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <!-- 开盘价 查看的时候只能查看 编辑的时候可以修改 -->
        <el-table-column align='right' prop='openPrice' :label="$t('quotation.futuresPriceAdjust.openPrice')" min-width='200'>
          <template slot-scope='scope'>
            <span>{{scope.row.openPrice | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='closingPriceOld' :label="$t('quotation.futuresPriceAdjust.closingPriceOld')" min-width='200' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.closingPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' prop='closingPrice' :label="$t('quotation.futuresPriceAdjust.closingPrice')" min-width='200'>
          <template slot-scope='scope'>
            <span>{{scope.row.closingPrice | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='highestPriceOld' :label="$t('quotation.futuresPriceAdjust.highestPriceOld')" min-width='200' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.highestPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='highestPrice' :label="$t('quotation.futuresPriceAdjust.highestPrice')" min-width='200'>
          <template slot-scope='scope'>
            <span>{{scope.row.highestPrice | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='lowestPriceOld' :label="$t('quotation.futuresPriceAdjust.lowestPriceOld')" min-width='200' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.lowestPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='lowestPrice' :label="$t('quotation.futuresPriceAdjust.lowestPrice')" min-width='200'>
          <template slot-scope='scope'>
            <span>{{scope.row.lowestPrice | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop='settlementPriceOld' :label="$t('quotation.futuresPriceAdjust.settlementPriceOld')" min-width='200' show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.settlementPriceOld | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align='right' prop='settlementPrice' :label="$t('quotation.futuresPriceAdjust.settlementPrice')" min-width='200'>
          <template slot-scope='scope'>
            <span>{{scope.row.settlementPrice | numFilter(8) | thousandth}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop='currencyName' :label="$t('quotation.futuresPriceAdjust.currency')" min-width='80'>
        </el-table-column>
      </el-table>
    </template>
    <!-- 弹窗 -->
    <edit-dialog v-if='dialogVisible' @close='closeHandlerDialog'></edit-dialog>
  </div>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import * as futuresPriceAdjust from '@/api/frame/rm/derivative/futuresPriceAdjust'
import editDialog from '@/views/frame/rm/derivative/futuresPriceAdjust/editDialog'
import UploadExcelComponent from '@/components/frame/UploadExcel/index.vue'
import { mapGetters } from 'vuex'
import { getList as getFuturesContractCode } from '@/api/frame/base/data/futuresContract'
import exchangeApi from '@/api/frame/base/data/exchange'
import { parseTime } from '@/utils/frame/base/index'
import { getList as getFuturesVarietiesName } from '@/api/frame/base/data/futuresVarieties'
import currencyApi from '@/api/frame/base/data/currency'

export default {
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      myDetailData: this.detailData,
      type: this.$route.query.type,
      loading: false,
      isChange: false,
      dialogVisible: false,
      multipleSelection: [],
      emptyText: ' ',
      // 调整单list数据是否禁止下载
      listDatadisDown: false,
      formData: {
        listDetail: []
      }
    }
  },
  props: {
    id: String,
    disabled: {
      type: Boolean,
      default: true
    },
    adjustTypeChange: {
      type: String,
      default: null
    },
    detailData: {
      type: Array
    }
  },
  components: {
    editDialog,
    UploadExcelComponent
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1355
        ? this.clientHeight - 370
        : this.clientHeight - 390 // 防止底部滚动条遮挡
    }
  },
  filters: {
    unitFormat(id, list, row) {
      if (list && list.length > 0) {
        for (const i in list) {
          if (list[i].id === id) {
            row.unit = list[i].unit
            return list[i].unit
          }
        }
      }
    }
  },
  watch: {
    id(newValue) {
      if (newValue) this.getList()
    },
    detailData(value) {
      this.myDetailData = value
    },
    myDetailData(value) {
      this.$emit('closeHandler', value)
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      // 期货价格调整单
      if (this.id) {
        futuresPriceAdjust
          .get(this.id, this.func)
          .then(response => {
            this.myDetailData = response.data.futureAdjustDetailDtoList
            this.myDetailData.forEach((i, index) => {
              i.rowNum = index
            })
          })
          .catch(() => {})
      }
    },

    // 文件校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 文件上传
    handleSuccess({ results, header }) {
      if (results) {
        var myDetailData = []
        var futuresVarietiesNameList = []
        var futuresContractCodeList = []
        var futuresContractNameList = []
        var exchangeList = []
        var currencyList = []
        this.pageLoading = true
        // 导入的数据不能为空
        if (results.length === 0) {
          this.showDialog = false
          this.$notify(
            notifyInfo({
              msg: this.$t('导入的文件数据为空!')
            })
          )
        } else {
          results.forEach(element => {
            const obj = {}
            obj.moduleCode = this.moduleCode
            obj.priceDate = element['价格日期']
            obj.exchangeName = element['交易所']
            obj.futuresVarietiesName = element['品种']
            obj.futuresContractName = element['合约名称']
            obj.futuresContractCode = element['合约代码']
            obj.openPrice = element['开盘价']
            obj.closingPrice = element['收盘价']
            obj.highestPrice = element['最高价']
            obj.lowestPrice = element['最低价']
            obj.settlementPrice = element['结算价']
            obj.currencyName = element['币种']
            obj.result = []
            obj.disabled = true
            obj.id = null
            obj.authVirture = 0
            // 价格日期非空校验
            if (obj.priceDate === undefined) {
              obj.tempResult = '价格日期不能为空!'
              obj.result.push(obj.tempResult)
              this.pageLoading = false
            }
            // 交易所存在系统中
            exchangeApi
              .getList(
                {
                  isPage: false,
                  data: {}
                },
                this.func
              )
              .then(response => {
                response.data.forEach(val => {
                  exchangeList.push(val.exchangeName)
                })
                if (exchangeList.indexOf(obj.exchangeName) === -1) {
                  obj.tempResult = '交易所不存在,请确认!'
                  obj.result.push(obj.tempResult)
                  this.pageLoading = false
                }
              })
              .catch(() => {
                this.loading = false
              })
            // 校验品种存在系统中
            getFuturesVarietiesName(
              {
                isPage: false,
                data: {}
              },
              this.func
            )
              .then(response => {
                response.data.forEach(val => {
                  futuresVarietiesNameList.push(val.futuresVarietiesName)
                })
                if (
                  futuresVarietiesNameList.indexOf(obj.futuresVarietiesName) ===
                  -1
                ) {
                  obj.tempResult = '品种不存在,请确认!'
                  obj.result.push(obj.tempResult)
                  this.pageLoading = false
                }
              })
              .catch(() => {
                this.loading = false
              })
            // 合约代码是否存在系统中
            getFuturesContractCode(
              {
                isPage: false,
                data: {}
              },
              this.func
            )
              .then(response => {
                this.loading = false
                response.data.forEach(val => {
                  futuresContractCodeList.push(val.futuresContractCode)
                  futuresContractNameList.push(val.futuresContractName)
                })
                if (
                  futuresContractCodeList.indexOf(obj.futuresContractCode) ===
                  -1
                ) {
                  obj.tempResult = '期货合约不存在,请确认!'
                  obj.result.push(obj.tempResult)
                  this.pageLoading = false
                }
              })
              .catch(() => {
                this.loading = false
              })
            var re = /^[0-9]+.?[0-9]*$/
            // 价格都为空,则跳过这个数据继续执行
            if (
              (obj.openPrice === undefined || obj.openPrice === '') &&
              (obj.closingPrice === undefined || obj.closingPrice === '') &&
              (obj.highestPrice === undefined || obj.highestPrice === '') &&
              (obj.lowestPrice === undefined || obj.lowestPrice === '') &&
              (obj.settlementPrice === undefined || obj.settlementPrice === '')
            ) {
              return
            } else {
              // 开盘价
              if (
                !re.test(obj.openPrice) ||
                obj.openPrice === '' ||
                obj.openPrice === undefined
              ) {
                obj.tempResult = '开盘价只能输入数字或不能为空!'
                obj.result.push(obj.tempResult)
                this.pageLoading = false
              }
              // 收盘价
              if (
                !re.test(obj.closingPrice) ||
                obj.closingPrice === '' ||
                obj.closingPrice === undefined
              ) {
                obj.tempResult = '收盘价只能输入数字或不能为空!'
                obj.result.push(obj.tempResult)
                this.pageLoading = false
              }
              // 最高价
              if (
                !re.test(obj.highestPrice) ||
                obj.highestPrice === '' ||
                obj.highestPrice === undefined
              ) {
                obj.tempResult = '最高价只能输入数字或不能为空!'
                obj.result.push(obj.tempResult)
                this.pageLoading = false
              }
              // 最低价
              if (
                !re.test(obj.lowestPrice) ||
                obj.lowestPrice === '' ||
                obj.lowestPrice === undefined
              ) {
                obj.tempResult = '最低价只能输入数字或不能为空!'
                obj.result.push(obj.tempResult)
                this.pageLoading = false
              }
              // 结算价
              if (
                !re.test(obj.settlementPrice) ||
                obj.settlementPrice === '' ||
                obj.settlementPrice === undefined
              ) {
                obj.tempResult = '结算价只能输入数字或不能为空!'
                obj.result.push(obj.tempResult)
                this.pageLoading = false
              }
            }
            // 合约代码非空校验
            if (obj.futuresContractCode === undefined) {
              obj.tempResult = '合约代码不能为空!'
              obj.result.push(obj.tempResult)
              this.pageLoading = false
            }
            // 合约名称非空校验
            if (obj.futuresContractName === undefined) {
              obj.tempResult = '合约名称不能为空!'
              obj.result.push(obj.tempResult)
              this.pageLoading = false
            }
            // 币种校验
            currencyApi
              .getList(
                {
                  isPage: false,
                  data: {}
                },
                this.func
              )
              .then(response => {
                response.data.forEach(val => {
                  currencyList.push(val.currencyName)
                })
                if (currencyList.indexOf(obj.currencyName) === -1) {
                  obj.tempResult = '币种不存在,请确认!'
                  obj.result.push(obj.tempResult)
                  this.pageLoading = false
                }
              })
              .catch(() => {
                this.loading = false
              })
            myDetailData.push(obj)
          })
          this.myDetailData = myDetailData
          this.$emit('closeHandler', myDetailData)
        }
      }
    },
    // 导出
    downTemp() {
      const date = parseTime(new Date(), '{y}{m}{d}')
      futuresPriceAdjust
        .listFutureAdjustWait({ data: date }, this.func)
        .then(response => {
          import('@/vendor/frame/Export2Excel').then(excel => {
            const tHeader = [
              '价格日期',
              '交易所',
              '品种',
              '合约名称',
              '合约代码',
              '开盘价',
              '收盘价',
              '最高价',
              '最低价',
              '结算价',
              '币种'
            ]
            const filter = [
              'priceDate',
              'exchangeName',
              'futuresVarietiesName',
              'futuresContractName',
              'futuresContractCode',
              'openPrice',
              'closingPrice',
              'highestPrice',
              'lowestPrice',
              'settlementPrice',
              'currencyName'
            ]
            const data = this.formatJson(filter, response.data)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '期货价格调整单数据导出',
              autoWidth: true,
              bookType: 'xlsx'
            })
            this.downloadLoading = false
          })
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 处理勾选后
    selectionChange(val) {
      this.multipleSelection = val
      this.$emit('selected', val)
      // 通过操作dom更改选中行底色
      this.$nextTick(() => {
        if (!this.$refs.multipleTable) return
        $(this.$refs.multipleTable.$el)
          .find('.el-table__row td')
          .removeClass('select-row-bg-color')
        $(this.$refs.multipleTable.$el)
          .find('.is-checked')
          .parents('.el-table__row')
          .find('td')
          .addClass('select-row-bg-color')
      })
    },
    handleCurrent(row, event, column) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 增行
    addRow() {
      this.dialogVisible = true
    },
    // 删行
    delRow() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(
          this.$t('biz.msg.confirmDelete'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            const filterArr = this.multipleSelection.map(
              select => select.rowNum
            )
            const templateData = []

            this.myDetailData.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })
            templateData.forEach((i, index) => {
              i.rowNum = index
            })
            this.myDetailData = templateData
            this.$emit('closeHandler', templateData)
          })
          .catch(() => {})
      } else {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    // 弹框关闭
    closeHandlerDialog(list) {
      if (list) {
        this.myDetailData = this.formData.listDetail.concat(list)
        this.myDetailData.forEach((i, index) => {
          i.rowNum = index
        })
      }
      this.$emit('closeHandler', this.myDetailData)
      this.dialogVisible = false
    }
  }
}
</script>
