<template>
  <qm-edit-tab ref="tab" :tab="tab"></qm-edit-tab>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import { parseTime } from '@/utils/frame/base/index'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import Vue from 'vue'
import {
  numFormat, // 上传文件转换为字典码表key值
  toDateFromString, // 验证时间是否有效
  verifyNamber, // 验证是数字
  verifyInteger // 验证是整数
} from '@/utils/frame/base/validate'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/warehouse/inProduct/listByInBillNo'
        },
        apiData: {
          search(param) {
            return param.uk || param.inBillNo
          }
        },
        topBar: [
          // {
          //   name: 'add',
          //   type: 'dialog',
          //   iconName: '线性-增行',
          //   i18n: 'biz.btn.addRow',
          //   component: () => import('@/views/frame/biz/data/productItem/choose.vue'),
          //   isShow: ['add', 'update'],
          //   validate: this.validateAdd
          // },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update'],
            callback: this.deleteCallBack
          },
          {
            name: 'copy',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            isShow: ['add', 'update']
          },
          {
            name: 'import',
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            isShow: ['add', 'update'],
            validate: this.validateImport,
            handleSuccess: this.handleSuccess,
            beforeUpload: this.beforeUpload
          }
        ],
        table: {
          showSummary: true,
          height: 200,
          cols: [
            {
              label: 'storage.inNotice.list.productName',
              prop: 'productName',
              width: '180'
            },
            ...(this.$route.params.type === 'complete' ? this.$store.state.user.mainGoodColsTxt : this.$store.state.user.mainGoodCols),
            ...(this.$route.params.type === 'complete' ? this.$store.state.user.reserveGoodColsTxt : this.$store.state.user.reserveGoodCols),
            {
              label: 'storage.inNotice.list.rightFlag',
              prop: 'rightFlag',
              width: '90',
              element: 'el-checkbox',
              align: 'center',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              }
            },
            {
              label: 'storage.inNotice.list.itemCount',
              prop: 'itemCount',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              attrs: {
                min: 0,
                max: 999999999999,
                type: 'num',
                precision: 0,
                disabled: this.$route.params.type === 'complete',
                clearable: true
              }
            },
            {
              label: 'storage.inNotice.list.inQuantity',
              prop: 'inQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              required: true,
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight',
                disabled: this.$route.params.type === 'complete',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              event: this.onInQuantityChange
            },
            {
              label: 'storage.inNotice.list.goodsFlag',
              prop: 'goodsFlag',
              width: '90',
              element: 'el-checkbox',
              align: 'center',
              attrs: {
                trueLabel: '1',
                falseLabel: '0'
              },
              isShow: this.$route.params.type === 'view' || this.$route.params.type === 'complete'
            },
            {
              label: 'storage.inNotice.list.settlementQuantity',
              prop: 'settlementQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight',
                disabled: false,
                clearable: true
              },
              format: {
                func: 'weight'
              },
              isShow: this.$route.params.type === 'view' || this.$route.params.type === 'complete'
            },
            {
              label: 'storage.inNotice.list.actualQuantity',
              prop: 'actualQuantity',
              width: '120',
              align: 'right',
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight',
                clearable: true
              },
              format: {
                func: 'weight'
              }
            },
            {
              label: 'storage.inNotice.list.productUnitCode',
              prop: 'productUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              }
            },
            {
              label: 'storage.inNotice.list.measurementQuantity',
              prop: 'measurementQuantity',
              element: 'input-formatter',
              width: 120,
              align: 'right',
              validate: [
                {
                  required: true,
                  trigger: 'blur'
                }
              ],
              required: true,
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight',
                disabled: this.$route.params.type === 'complete',
                clearable: true
              },
              format: {
                func: 'weight'
              },
              event: this.onMeasurementQuantityChange
            },
            {
              label: 'storage.inNotice.list.actualMeasurementQuantity',
              prop: 'actualMeasurementQuantity',
              width: '120',
              align: 'right',
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'weight',
                clearable: true
              },
              format: {
                func: 'weight'
              }
            },
            {
              label: 'storage.inNotice.list.measurementUnitCode',
              prop: 'measurementUnitCode',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'storage.inNotice.list.includeTaxPrice',
              prop: 'includeTaxPrice',
              width: '120',
              align: 'right',
              element: 'input-formatter',
              required: true,
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                disabled: this.$route.params.type === 'complete',
                type: 'money'
              },
              format: {
                func: 'money'
              },
              event: this.onIncludeTaxPriceChange,
              isShow: true
            },
            {
              label: 'storage.inNotice.list.includeTaxAmount',
              prop: 'includeTaxAmount',
              width: '120',
              align: 'right',
              required: false,
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
              format: {
                func: 'money'
              },
              isShow: true
            },
            {
              label: 'storage.inNotice.list.excludeTaxPrice',
              prop: 'excludeTaxPrice',
              width: '120',
              align: 'right',
              required: false,
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
              format: {
                func: 'money'
              },
              isShow: true
            },
            {
              label: 'storage.inNotice.list.excludeTaxAmount',
              prop: 'excludeTaxAmount',
              width: '120',
              align: 'right',
              required: false,
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
              format: {
                func: 'money'
              },
              isShow: true
            },
            {
              label: 'storage.inNotice.list.taxRate',
              prop: 'taxRate',
              element: 'input-formatter',
              width: '120',
              align: 'right',
              required: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money',
                disabled: this.$route.params.type === 'complete'
              },
              format: {
                func: 'money'
              },
              event: this.onTaxRateChange,
              isShow: true
            },
            {
              label: 'storage.inNotice.list.taxAmount',
              prop: 'taxAmount',
              width: '120',
              align: 'right',
              summary: true,
              required: false,
              summary: true,
              attrs: {
                min: 0,
                max: 999999999999.999,
                type: 'money'
              },
              format: {
                func: 'money'
              },
              isShow: true
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {},
  methods: {
    // validateAdd() {
    //   if (this.editForm.inType !== 'TEMP') {
    //     this.$notify(notifyInfo({ msg: this.$t('只有入库类型为散购入库时，才可以新增行。') }))
    //     return false
    //   } else {
    //     return true
    //   }
    // },
    deleteCallBack() {
      // TODO 删除商品所相应的费用信息
    },
    onInQuantityChange(param) {
      const row = param.row
      // if (param.val) {
      //   row.measurementQuantity = param.val
      // }
      const quantity = Number(row.measurementQuantity)
      const includeTaxPrice = Number(row.includeTaxPrice)
      const taxRate = Number(row.taxRate)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    onMeasurementQuantityChange(param) {
      const row = param.row
      const quantity = Number(param.val)
      const includeTaxPrice = Number(row.includeTaxPrice)
      const taxRate = Number(row.taxRate)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    onIncludeTaxPriceChange(param) {
      const row = param.row
      const quantity = Number(row.measurementQuantity)
      const includeTaxPrice = Number(param.val)
      const taxRate = Number(row.taxRate)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    onTaxRateChange(param) {
      const row = param.row
      const quantity = Number(row.measurementQuantity)
      const includeTaxPrice = Number(row.includeTaxPrice)
      const taxRate = Number(param.val)
      this.calculate(row, quantity, includeTaxPrice, taxRate)
    },
    calculate(row, quantity, includeTaxPrice, taxRate) {
      if (this.editForm.inType === 'TEMP') {
        row.includeTaxAmount = quantity * includeTaxPrice
        row.excludeTaxPrice = (includeTaxPrice / (1 + taxRate / 100)).toFixed(6)
        row.excludeTaxAmount = (row.includeTaxAmount / (1 + taxRate / 100)).toFixed(2)
        row.taxAmount = row.includeTaxAmount - row.excludeTaxAmount
      }
    },
    validateImport() {
      if (this.editForm.inDate === '') {
        this.$notify(notifyInfo({ msg: this.$t('请先选择入库日期') }))
        return false
      }
      if (this.editForm.warehouseCode === '') {
        this.$notify(notifyInfo({ msg: this.$t('请先选择仓库') }))
        return false
      }
      if (this.$refs.tab.tableData.length === 0) {
        this.$notify(notifyInfo({ msg: this.$t('请先选择入库商品信息') }))
        return false
      }
      return true
    },
    // 文件校验
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$notify(notifyInfo({ msg: this.$t('Please do not upload files larger than 1m in size.') }))
      return false
    },
    // 文件导入
    async handleSuccess(data) {
      if (data.header1.length !== 16) {
        this.$notify(notifyInfo({ msg: this.$t('导入模板错误') }))
        return
      }
      const results1 = data.results1
      results1.splice(results1.length - 1, 1)
      if (results1.length === 0) {
        this.$notify(notifyInfo({ msg: this.$t('导入数据不能为空') }))
        return
      }
      if (results1) {
        // 校验输入内容
        // 必须项目检查未作，日期、数值格式检查未作：导入的是其他系统导出的文件
        // 重复数据检查未作：导入的是其他系统导出的文件
        // 检查日期、仓库与入库通知表单输入项是否一致
        const inDate = this.editForm.inDate
        const warehouseCode = this.editForm.warehouseCode
        var warehouseName = ''
        await request({
          url: '/api/dd/selectData/get',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              type: 'DD_WAREHOUSE',
              code: [warehouseCode]
            }
          }
        }).then(response => {
          if (response.data && response.data.length > 0) {
            warehouseName = response.data[0].name
          }
        })
        for (var j in results1) {
          for (var v in results1[j]) {
            results1[j][v] = results1[j][v].trim()
            if (results1[j][v].indexOf(',') !== -1) {
              results1[j][v] = results1[j][v].replace(/,/g, '')
            }
          }
          // if (results1[j]['日期'].replace(/[\/-]/g, '') !== inDate) {
          //   this.$notify(notifyInfo({ msg: this.$t('导入数据不正确，日期与入库通知页面不一致') }))
          //   return
          // }
          // var dateImport = toolUtil.dateFormateToYYYYMMDD(new Date(results1[j]['日期']))
          // if (dateImport != inDate) {
          //   this.$notify(notifyInfo({ msg: this.$t('导入数据不正确，日期与入库通知页面不一致') }))
          //   return
          // }
          if (results1[j]['仓库'] !== warehouseName) {
            this.$notify(notifyInfo({ msg: this.$t('导入数据不正确，仓库与入库通知页面不一致') }))
            return
          }
        }

        // 检查导入的商品物资范围是否超过了页面上的入库商品信息
        // const map1 = results1.map(v => {
        //   return this.getStockAttr(v)
        // })
        // const map2 = results1.map(v => {
        //   return this.getStockAttr2(v)
        // })
        // const productList = this.$refs.tab.tableData;
        // const map3 = productList.map(v => {
        //   return this.getProductAttr(v)
        // })
        // for (var idx in map1) {
        //   if (!map2.includes(map1[idx])) {
        //     this.$notify(notifyInfo({ msg: this.$t('导入数据不正确，导入的商品物资范围不能大于入库商品信息的物资范围') }))
        //     return
        //   }
        // }
        const productList = this.$refs.tab.tableData
        const map3 = productList.map(v => {
          return this.getProductAttr(v)
        })
        for (var idx in results1) {
          var stock = results1[idx]
          var stockAttr = this.getStockAttr(stock)
          var stockAttr2 = this.getStockAttr2(stock)
          if (!map3.includes(stockAttr) && !map3.includes(stockAttr2)) {
            this.$notify(notifyInfo({ msg: this.$t('导入数据不正确，导入的商品物资范围不能大于入库商品信息的物资范围') }))
            return
          }
        }

        // 将导入文件的过入数量、过入重量填入对应入库商品的件数、入库数量
        // const map11 = {};
        // for (var idx in results1) {
        //   var stock = results1[idx]
        //   map11[this.getStockAttr(stock)] = {
        //     'itemCount': stock['过入数量'],
        //     'inQuantity': stock['过入重量']
        //   }
        // }
        // for (var idx in productList) {
        //   var product = productList[idx]
        //   product.itemCount = map11[this.getProductAttr(product)].itemCount;
        //   product.inQuantity = map11[this.getProductAttr(product)].inQuantity;
        // }
        const map11 = {}
        const map12 = {}
        for (var idx in results1) {
          var stock = results1[idx]
          if (!map11[this.getStockAttr(stock)]) {
            map11[this.getStockAttr(stock)] = []
          }
          map11[this.getStockAttr(stock)].push({
            productKeyAttr01: stock['捆包号'],
            inQuantity: stock['过入数量'],
            measurementQuantity: stock['过入重量'],
            productUnitCode: stock['数量单位'],
            measurementUnitCode: stock['重量单位']
          })
          if (!map12[this.getStockAttr2(stock)]) {
            map12[this.getStockAttr2(stock)] = []
          }
          map12[this.getStockAttr2(stock)].push({
            productKeyAttr01: stock['捆包号'],
            inQuantity: stock['过入数量'],
            measurementQuantity: stock['过入重量'],
            productUnitCode: stock['数量单位'],
            measurementUnitCode: stock['重量单位']
          })
        }
        var productListNew = []
        for (var idx in productList) {
          var product = productList[idx]
          var map = map11
          if (product['productKeyAttr01'] && product['productKeyAttr01'] != '-') {
            map = map12
          }
          if (map[this.getProductAttr(product)]) {
            for (var rIdx in map[this.getProductAttr(product)]) {
              var ret = map[this.getProductAttr(product)][rIdx]
              // 检查数量单位、重量单位是否一致
              var productUnitName = Vue.filter('dataDictFormat')(product.productUnitCode, this.$t('datadict.goodsUnit'))
              var measurementUnitName = Vue.filter('dataDictFormat')(product.measurementUnitCode, this.$t('datadict.measurementUnit'))
              if (ret.productUnitCode && ret.productUnitCode != productUnitName) {
                this.$notify(notifyInfo({ msg: this.$t('导入数据不正确，数量单位与入库商品信息不一致') }))
                return
              }
              if (ret.measurementUnitCode && ret.measurementUnitCode != measurementUnitName) {
                this.$notify(notifyInfo({ msg: this.$t('导入数据不正确，重量单位与入库商品信息不一致') }))
                return
              }
              productListNew.push({
                lotNo: product.lotNo,
                contractNo: product.contractNo,
                lotProductDetailCode: product.lotProductDetailCode,
                preBillProductDetailCode: product.preBillProductDetailCode,
                productCode: product.productCode,
                productName: product.productName,
                brand: product.brand,
                spec: product.spec,
                origin: product.origin,
                productKeyAttr01: ret.productKeyAttr01,
                productKeyAttr02: product.productKeyAttr02,
                productKeyAttr03: product.productKeyAttr03,
                itemCount: product.itemCount,
                inQuantity: ret.inQuantity,
                measurementQuantity: ret.measurementQuantity,
                productUnitCode: product.productUnitCode,
                measurementUnitCode: product.measurementUnitCode,
                rightFlag: product.rightFlag,
                goodsFlag: product.goodsFlag
              })
            }
          } else {
            productListNew.push(product)
          }
        }
        this.$refs.tab.tableData = productListNew
      }
    },
    getStockAttr(param) {
      var productAtr = ''
      productAtr += param['品名'] ? param['品名'] : ''
      productAtr += param['材质'] ? param['材质'] : ''
      productAtr += param['规格'] ? param['规格'] : ''
      productAtr += param['产地'] ? param['产地'] : ''
      return productAtr
    },
    getStockAttr2(param) {
      var productAtr = ''
      productAtr += this.getStockAttr(param)
      productAtr += param['捆包号'] ? param['捆包号'] : ''
      return productAtr
    },
    getProductAttr(param) {
      var productAtr = ''
      productAtr += param.productName
      productAtr += param.brand == '-' ? '' : param.brand
      productAtr += param.spec == '-' ? '' : param.spec
      productAtr += param.origin == '-' ? '' : param.origin
      if (param.productKeyAttr01 && param.productKeyAttr01 != '-') {
        productAtr += param.productKeyAttr01
      }
      return productAtr
    }
  }
}
</script>
