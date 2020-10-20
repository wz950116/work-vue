<template>
  <qm-edit :edit="edit" ref="qmEdit" @closeDialog="handleCloseDialog"></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'revisionEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/warehouse/whRevisionBill/get',
          save: '/api/warehouse/whRevisionBill/save',
          update: '/api/warehouse/whRevisionBill/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.revisionNo
          },
          save(param) {
            return param
          },
          update(param) {
            return param
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['assist', 'audit']
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核',
            name: 'biz.btn.audit',
            $refs: this.$refs,
            getParam() {
              return this.param
            },
            event: 'audit',
            isShow: ['assist', 'audit'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核历史',
            name: 'biz.btn.auditHistory',
            $route: this.$route,
            getParam() {
              return {
                moduleCode: this.$route.meta.bpmModule,
                uk: this.$route.params.uk || this.$route.params.revisionNo
              }
            },
            event: 'auditHistory',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.revisionNo,
                billType: this.$route.meta.bizCode
              }
            },
            event: 'attachment',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          // edit 打印
          {
            // 附件
            iconName: '线性-打印',
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                revisionNo: data.uk || data.revisionNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-库存',
            name: 'biz.btn.stockDetailSelect',
            event: 'set',
            validate: this.onStockDetail,
            isShow: ['add', 'update'],
            permitName: ['stockDetailProduct'],
            component: () => import('@/views/frame/biz/storage/stock/stockSelect.vue'),
            initChoose: this.initChooseAdd,
            callback: this.stockDetailCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.revision.group.editFormPart1',
            content: [
              {
                label: 'storage.revision.form.revisionNo',
                prop: 'revisionNo',
                element: 'input-validate',
                validate: [
                  {
                    required: !this.autoFlag(),
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.autoFlag(),
                  clearable: true
                }
              },
              {
                label: 'storage.revision.form.warehouseCode',
                prop: 'warehouseCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_WAREHOUSE',

                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'storage.revision.form.revisionDate',
                prop: 'revisionDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {},
              {
                label: 'biz.lbl.bizOrganName',
                prop: 'bizOrganCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userOrganCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  filterable: true,
                  data: 'FUNC_ORG',

                  clearable: true
                }
              },
              {
                label: 'biz.lbl.bizDeptName',
                prop: 'bizDeptCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userDeptCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_DEPT',
                  filterable: true,

                  clearable: true
                }
              },
              {
                label: 'biz.lbl.bizEmployeeName',
                prop: 'bizEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_EMPLOYEE',

                  clearable: true
                }
              },
              {
                label: 'biz.lbl.optName',
                prop: 'optEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              },
              {
                label: 'storage.revision.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  clearable: true,
                  maxlength: 500,
                  cols: 4
                }
              }
            ]
          }
        },

        tables: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'stockProductList',
            label: 'storage.revision.tab.stockProduct',
            component: () => import('./stockProductTab.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'revisionProductList',
            label: 'storage.revision.tab.revisionProduct',
            component: () => import('./revisionProductTab.vue'),
            required: true
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
    },
    opMode: {
      type: String,
      default: 'router'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    // 是否自动采番
    autoFlag() {
      if ((this.$route.params.type || this.$route.params.opType) === 'add') {
        const seqMode = this.$route.meta.seqMode
        if (seqMode && seqMode === '0') {
          return true
        }
        return false
      } else {
        return true
      }
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
    },
    onStockDetail() {
      if (!this.$refs.qmEdit.$refs.qmRouteEdit.editForm.warehouseCode) {
        this.$notify(
          notifyInfo({
            // 请先选择仓库
            msg: this.$t('storage.revision.validateMsg.chooseStockDetail')
          })
        )
        return false
      }
      return true
    },

    // 点击增行弹框初始化
    initChooseAdd() {
      return {
        initSearch: true,
        multiple: true,
        warehouseCode: {
          disabled: true,
          value: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.warehouseCode
        }
      }
    },
    // 选择库存商品回调
    stockDetailCallback(params) {
      // 库存商品信息
      const stockProductList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.stockProductList[0].$refs.tab.tableData
      params.forEach((row, index) => {
        var stockProduct = {}
        stockProduct['stockDetailNo'] = row.stockDetailNo
        stockProduct['contractNo'] = row.inContractNo
        stockProduct['lotNo'] = row.inLotNo
        stockProduct['inBillNo'] = row.inBillNo
        stockProduct['inProductNo'] = row.inProductNo
        stockProduct['inDetailNo'] = row.inDetailNo
        stockProduct['productCode'] = row.productCode
        stockProduct['productName'] = row.productName
        stockProduct['brand'] = row.brand
        stockProduct['spec'] = row.spec
        stockProduct['origin'] = row.origin
        stockProduct['productKeyAttr01'] = row.productKeyAttr01
        stockProduct['productKeyAttr02'] = row.productKeyAttr02
        stockProduct['productKeyAttr03'] = row.productKeyAttr03
        stockProduct['stockArea'] = row.stockArea
        stockProduct['stockPosition'] = row.stockPosition
        stockProduct['stockNo'] = row.stockNo
        stockProduct['productUnitCode'] = row.productUnitCode
        stockProduct['measurementUnitCode'] = row.measurementUnitCode

        stockProduct['itemCount'] = row.itemCount
        stockProduct['quantity'] = row.quantity
        stockProduct['restQuantity'] = row.restQuantity
        stockProduct['measurementQuantity'] = row.measurementQuantity
        stockProduct['restMeasurementQuantity'] = row.restMeasurementQuantity
        stockProductList.push(stockProduct)
      })
      // 后过滤
      const newData1 = []
      stockProductList.forEach(row => {
        if (
          !newData1
            .map(v => {
              return v.stockDetailNo
            })
            .includes(row.stockDetailNo)
        ) {
          newData1.push(row)
        }
      })
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.stockProductList[0].$refs.tab.tableData = newData1

      // 库存调整商品信息
      const revisionProductList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.revisionProductList[0].$refs.tab.tableData
      params.forEach((row, index) => {
        var revisionProduct = {}
        revisionProduct['stockDetailNo'] = row.stockDetailNo
        revisionProduct['contractNo'] = row.inContractNo
        revisionProduct['lotNo'] = row.inLotNo
        revisionProduct['inBillNo'] = row.inBillNo
        revisionProduct['inProductNo'] = row.inProductNo
        revisionProduct['inDetailNo'] = row.inDetailNo
        revisionProduct['supplierCode'] = row.supplierCode
        revisionProduct['supplierName'] = row.supplierName
        revisionProduct['deliverCode'] = row.deliverCode
        revisionProduct['deliverName'] = row.deliverName
        revisionProduct['lotProductDetailCode'] = row.lotProductDetailCode
        revisionProduct['preBillProductDetailCode'] = row.preBillProductDetailCode
        revisionProduct['productCode'] = row.productCode
        revisionProduct['brand'] = row.brand
        revisionProduct['spec'] = row.spec
        revisionProduct['origin'] = row.origin
        revisionProduct['productKeyAttr01'] = row.productKeyAttr01
        revisionProduct['productKeyAttr02'] = row.productKeyAttr02
        revisionProduct['productKeyAttr03'] = row.productKeyAttr03
        revisionProduct['stockArea'] = row.stockArea
        revisionProduct['stockPosition'] = row.stockPosition
        revisionProduct['stockNo'] = row.stockNo
        revisionProduct['productUnitCode'] = row.productUnitCode
        revisionProduct['measurementUnitCode'] = row.measurementUnitCode

        revisionProduct['revisionCount'] = row.itemCount
        revisionProduct['quantity'] = row.quantity
        revisionProduct['restQuantity'] = row.restQuantity
        revisionProduct['revisionQuantity'] = row.restQuantity
        revisionProduct['measurementQuantity'] = row.measurementQuantity
        revisionProduct['restMeasurementQuantity'] = row.restMeasurementQuantity
        revisionProduct['revisionMeasurementQuantity'] = row.restMeasurementQuantity
        revisionProductList.push(revisionProduct)
      })
      // 后过滤
      const newData2 = []
      revisionProductList.forEach(row => {
        if (
          !newData2
            .map(v => {
              return v.stockDetailNo
            })
            .includes(row.stockDetailNo)
        ) {
          newData2.push(row)
        }
      })
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.revisionProductList[0].$refs.tab.tableData = newData2
    }
  }
}
</script>
