<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @preCallback="handlePreCallback"></qm-edit>
</template>
<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'outCheckEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/warehouse/whOutCheckBill/get',
          save: '/api/warehouse/whOutCheckBill/save',
          update: '/api/warehouse/whOutCheckBill/update',
          pre: {
            WH_OUT_BILL: '/api/warehouse/whOutProduct/list'
          }
        },
        apiData: {
          pre(param) {
            return {
              outBillNo: param.preBillNo
            }
          },
          view(param) {
            return param.uk || param.id
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
                uk: this.$route.params.uk || this.$route.params.id
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
                billNo: data.uk || data.id,
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
                outBillNo: data.uk || data.outBillNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-出库单',
            name: 'biz.btn.outBillNo',
            event: 'set',
            isShow: ['add', 'update'],
            component: () => import('@/views/frame/biz/storage/outNotice/chooseOutProduct.vue'),
            initChoose: this.initChooseOutBillNo,
            callback: this.outBillNoCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.outCheck.group.editFormPart1',
            content: [
              {
                label: 'storage.outCheck.form.outBillNo',
                prop: 'outBillNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'storage.outCheck.form.outDate',
                prop: 'outDate',
                attrs: {
                  disabled: true,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'storage.outCheck.form.outType',
                prop: 'outType',
                element: 'base-select',
                list: this.$t('datadict.outType'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.outCheck.form.warehouseCode',
                prop: 'warehouseCode',
                element: 'base-select',
                attrs: {
                  data: 'DD_WAREHOUSE',
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.outCheck.form.customerCode',
                prop: 'customerCode',
                element: 'base-select',
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '1',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  disabled: true,
                  clearable: true,
                  filterable: true
                }
              },
              {
                label: 'storage.outCheck.form.settlementCode',
                prop: 'settlementCode',
                element: 'base-select',
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '1',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  disabled: true,
                  clearable: true,
                  filterable: true
                },
                isShow: false
              },
              {
                label: 'storage.outCheck.form.goodsFlag',
                prop: 'goodsFlag',
                element: 'el-checkbox',
                align: 'center',
                width: '90',
                attrs: {
                  trueLabel: '1',
                  falseLabel: '0'
                },
                isShow: false
              }
            ]
          },
          part2: {
            titleName: 'storage.outCheck.group.editFormPart2',
            content: [
              {
                label: 'storage.outCheck.form.outCheckNo',
                prop: 'outCheckNo',
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
                label: 'storage.inNotice.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'storage.inNotice.form.contractNo',
                prop: 'contractNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                },
                isShow: false
              },
              {
                type: 'date',
                label: 'storage.outCheck.form.outCheckDate',
                prop: 'outCheckDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
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
                label: 'storage.outCheck.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  clearable: true,
                  maxlength: 500,
                  cols: 2
                }
              }
            ]
          }
        },

        tables: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'outCheckProductList',
            label: 'storage.outCheck.tab.product',
            component: () => import('./productTab.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'outCheckProductPickList',
            label: 'storage.outCheck.tab.productDetail',
            component: () => import('./productDetailTab.vue'),
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
    handlePreCallback(result) {
      this.outBillNoCallback(result)
    },
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
    handleCloseDialog(params) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', params)
      } else {
        const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: backName,
            params: { ...(!!param && { refresh: !!param }) }
          })
        })
      }
    },
    // 选择出库通知商品弹窗初始化
    initChooseOutBillNo() {
      return {
        initSearch: true,
        multiple: true
      }
    },
    // 选择出库通知商品回调
    outBillNoCallback(params) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outCheckProductList[0].$refs.tab.tableData
      const checkProductPickList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outCheckProductPickList[0].$refs.tab.tableData

      for (let i = 0; i < params.length; i++) {
        if (params[i].outBillNo !== params[0].outBillNo) {
          this.$notify(notifyInfo({ msg: this.$t('storage.outCheck.validateMsg.chooseOutProductBack') }))
          return
        }
      }

      if (editForm.outBillNo !== params[0].outBillNo) {
        productList.splice(0)
        checkProductPickList.splice(0)
      }

      // 出库通知单信息
      editForm.outBillNo = params[0].outBillNo
      editForm.outDate = params[0].outDate
      editForm.outType = params[0].outType
      // editForm.preBillType = params[0].preBillType
      // editForm.preBillNo = params[0].preBillNo
      editForm.lotNo = params[0].lotNo
      editForm.contractNo = params[0].contractNo
      editForm.customerCode = params[0].customerCode
      editForm.settlementCode = params[0].settlementCode
      editForm.warehouseCode = params[0].warehouseCode
      editForm.supplierName = params[0].supplierName
      editForm.deliverName = params[0].deliverName
      editForm.warehouseName = params[0].warehouseName

      // 出库实提商品信息
      params.forEach((row, index) => {
        const product = {}
        product['outBillNo'] = row.outBillNo
        product['lotNo'] = row.lotNo
        product['contractNo'] = row.contractNo
        product['outProductNo'] = row.outProductNo
        product['productCode'] = row.productCode
        product['productName'] = row.productName
        product['brand'] = row.brand
        product['spec'] = row.spec
        product['origin'] = row.origin
        product['productKeyAttr01'] = row.productKeyAttr01
        product['productKeyAttr02'] = row.productKeyAttr02
        product['productKeyAttr03'] = row.productKeyAttr03
        product['itemCount'] = row.itemCount
        product['outQuantity'] = row.outQuantity
        product['actualQuantity'] = row.actualQuantity
        product['productUnitCode'] = row.productUnitCode
        product['measurementQuantity'] = row.measurementQuantity
        product['actualMeasurementQuantity'] = row.actualMeasurementQuantity
        product['measurementUnitCode'] = row.measurementUnitCode
        product['rightFlag'] = '1'
        if (
          !productList
            .map(v => {
              return v.outBillNo + v.outProductNo
            })
            .includes(product.outBillNo + product.outProductNo)
        ) {
          productList.push(product)
        }
      })

      // 出库实提商品拣配信息
      params.forEach((row, index) => {
        const productPickList = row.outProductPickList
        productPickList.forEach(productPick => {
          const checkProductPick = {}
          checkProductPick['outPickNo'] = productPick.outPickNo
          checkProductPick['stockDetailNo'] = productPick.stockDetailNo
          checkProductPick['purchaseContractNo'] = productPick.purchaseContractNo
          checkProductPick['purchaseLotNo'] = productPick.purchaseLotNo
          checkProductPick['inBillNo'] = productPick.inBillNo
          checkProductPick['inProductNo'] = productPick.inProductNo
          checkProductPick['inCheckNo'] = productPick.inCheckNo
          checkProductPick['inCheckDate'] = productPick.inCheckDate
          checkProductPick['inCheckProductNo'] = productPick.inCheckProductNo
          checkProductPick['inDetailNo'] = productPick.inDetailNo
          checkProductPick['productCode'] = productPick.productCode
          checkProductPick['productName'] = productPick.productName
          checkProductPick['brand'] = productPick.brand
          checkProductPick['spec'] = productPick.spec
          checkProductPick['origin'] = productPick.origin
          checkProductPick['productKeyAttr01'] = productPick.productKeyAttr01
          checkProductPick['productKeyAttr02'] = productPick.productKeyAttr02
          checkProductPick['productKeyAttr03'] = productPick.productKeyAttr03
          checkProductPick['stockArea'] = productPick.stockArea
          checkProductPick['stockPosition'] = productPick.stockPosition
          checkProductPick['stockNo'] = productPick.stockNo
          checkProductPick['itemCount'] = productPick.itemCount
          // checkProductPick['outQuantity'] = productPick.outQuantity
          checkProductPick['actualQuantity'] = productPick.outQuantity - productPick.actualQuantity
          checkProductPick['productUnitCode'] = productPick.productUnitCode
          // checkProductPick['measurementQuantity'] = productPick.measurementQuantity
          checkProductPick['actualMeasurementQuantity'] = productPick.measurementQuantity - productPick.actualMeasurementQuantity
          checkProductPick['measurementUnitCode'] = productPick.measurementUnitCode
          if (
            !checkProductPickList
              .map(v => {
                return v.outBillNo + v.outProductNo + v.outPickNo
              })
              .includes(checkProductPick.outBillNo + checkProductPick.outProductNo + checkProductPick.outPickNo)
          ) {
            checkProductPickList.push(checkProductPick)
          }
        })
      })
    }
  }
}
</script>
