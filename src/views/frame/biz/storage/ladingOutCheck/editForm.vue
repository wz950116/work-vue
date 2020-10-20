<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog' ref="qmEdit" @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'ladingOutCheckEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/warehouse/whLadingOutCheck/get',
          save: '/api/warehouse/whLadingOutCheck/save',
          update: '/api/warehouse/whLadingOutCheck/update',
          pre: {
            WH_LADING_BILL_OUT: '/api/warehouse/whLadingOutProduct/list'
          }
        },
        apiData: {
          pre(param) {
            return {
              ladingOutNo: param.preBillNo
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
            getParam: this.getParamAuditHistory,
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
                ladingOutConfirmNo: data.uk || data.ladingOutConfirmNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-新增',
            name: 'biz.btn.ladingBillOut',
            isShow: ['add', 'update'],
            event: 'set',
            component: () => import('@/views/frame/biz/storage/stock/ladingBillOutSelect.vue'), // 提单直发
            callback: this.closeProductItemCallback // 关闭弹窗回调
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.ladingOutCheck.group.FormPart1',
            content: [
              {
                label: 'storage.ladingOutCheck.form.ladingOutConfirmNo',
                prop: 'ladingOutConfirmNo',
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
                type: 'date',
                label: 'storage.ladingOutCheck.form.ladingOutConfirmDate',
                prop: 'ladingOutConfirmDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                default: toolUtil.todayYYYYMMDD(),
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'storage.ladingOutCheck.form.ladingOutType',
                prop: 'ladingOutType',
                element: 'base-select',
                list: this.$t('datadict.ladingOutType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.ladingOutCheck.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.ladingOutCheck.form.customerCode',
                prop: 'customerCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '1',
                    auditStatus: '3'
                  },
                  clearable: true,
                  filterable: true
                },
                event: {
                  changeAll: this.changeAll
                }
              },
              {
                label: 'storage.ladingOutCheck.form.settlementCode',
                prop: 'settlementCode',
                element: 'base-select',
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '1',
                    auditStatus: '3'
                  },
                  clearable: true,
                  filterable: true
                },
                event: {
                  changeAll: this.changeAllTle
                },
                isShow: false
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
                label: 'storage.ladingOutCheck.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 2,
                  maxlength: 500,
                  clearable: true
                }
              },
              {
                prop: 'ladingOutNo',
                isShow: false
              },
              {
                prop: 'ladingOutDate',
                isShow: false
              },
              {
                prop: 'customerName',
                isShow: false
              },
              {
                prop: 'settlementName',
                isShow: false
              }
            ]
          }
        },

        tables: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'whLadingOutCfmPrdDtoList',
            label: 'storage.ladingOutCheck.tab.product',
            component: () => import('./productTab.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'whLadingOutCfmPickDtoList',
            label: 'storage.ladingOutCheck.tab.productPick',
            component: () => import('./productPickTab.vue')
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
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    handlePreCallback(result) {
      this.closeProductItemCallback(result[0])
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
    changeAll(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    changeAllTle(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.settlementName = item.name
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
    },
    closeProductItemCallback(params) {
      if (params) {
        const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.whLadingOutCfmPrdDtoList[0].$refs.tab.tableData
        const pickList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.whLadingOutCfmPickDtoList[0].$refs.tab.tableData
        const whLadingOutProductDtoList = params.whLadingOutProductDtoList
        const whLadingOutPickDtoList = params.whLadingOutPickDtoList
        editForm.customerCode = params.customerCode
        editForm.customerName = params.customerName
        editForm.settlementCode = params.settlementCode
        editForm.settlementName = params.settlementName
        editForm.ladingOutType = params.ladingOutType
        editForm.ladingOutNo = params.ladingOutNo
        editForm.ladingOutDate = params.ladingOutDate
        editForm.lotNo = params.preBillNo
        productList.splice(0)
        pickList.splice(0)
        whLadingOutProductDtoList.forEach((row, index) => {
          const newData = {}
          newData['ladingOutProductNo'] = row.ladingOutProductNo
          newData['ladingOutNo'] = row.ladingOutNo
          newData['ladingOutDate'] = row.ladingOutDate
          newData['ladingOutType'] = row.ladingOutType
          newData['preBillType'] = row.preBillType
          newData['preBillNo'] = row.preBillNo
          newData['customerCode'] = row.customerCode
          newData['settlementCode'] = row.settlementCode
          newData['customerName'] = row.customerName
          newData['settlementName'] = row.settlementName
          newData['lotProductDetailCode'] = row.lotProductDetailCode
          newData['preBillProductDetailCode'] = row.preBillProductDetailCode
          newData['productCode'] = row.productCode
          newData['productName'] = row.productName
          newData['brand'] = row.brand
          newData['spec'] = row.spec
          newData['origin'] = row.origin
          newData['productKeyAttr01'] = row.productKeyAttr01
          newData['productKeyAttr02'] = row.productKeyAttr02
          newData['productKeyAttr03'] = row.productKeyAttr03
          newData['itemCount'] = row.itemCount
          newData['measurementQuantity'] = row.measurementQuantity
          newData['actualMeasurementQuantity'] = row.actualMeasurementQuantity
          newData['lastMeasurementQuantity'] = row.lastMeasurementQuantity
          newData['measurementUnitCode'] = row.measurementUnitCode
          newData['outQuantity'] = row.outQuantity
          newData['actualQuantity'] = row.actualQuantity
          newData['lastQuantity'] = row.lastQuantity
          newData['productUnitCode'] = row.productUnitCode
          newData['goodsFlag'] = row.goodsFlag
          newData['rightFlag'] = row.rightFlag
          newData['bizOrganCode'] = row.bizOrganCode
          newData['bizDeptCode'] = row.bizDeptCode
          newData['bizEmployeeCode'] = row.bizEmployeeCode
          newData['productReservedNum1'] = row.productReservedNum1
          newData['productReservedNum2'] = row.productReservedNum2
          newData['productReservedNum3'] = row.productReservedNum3
          newData['productReservedNum4'] = row.productReservedNum4
          newData['productReservedNum5'] = row.productReservedNum5
          newData['productReservedNum6'] = row.productReservedNum6
          newData['productReservedNum7'] = row.productReservedNum7
          newData['productReservedNum8'] = row.productReservedNum8
          newData['productReservedStr1'] = row.productReservedStr1
          newData['productReservedStr2'] = row.productReservedStr2
          newData['productReservedStr3'] = row.productReservedStr3
          newData['productReservedStr4'] = row.productReservedStr4
          newData['productReservedStr5'] = row.productReservedStr5
          newData['productReservedStr6'] = row.productReservedStr6
          newData['productReservedStr7'] = row.productReservedStr7
          newData['productReservedStr8'] = row.productReservedStr8
          newData['productReservedStr9'] = row.productReservedStr9
          newData['productReservedStr10'] = row.productReservedStr10
          newData['productReservedStr11'] = row.productReservedStr11
          newData['productReservedStr12'] = row.productReservedStr12
          productList.push(newData)
        })

        whLadingOutPickDtoList.forEach((row, index) => {
          const newData = {}
          newData['ladingOutPickNo'] = row.ladingOutPickNo
          newData['ladingOutProductNo'] = row.ladingOutProductNo
          newData['ladingOutNo'] = row.ladingOutNo
          newData['ladingOutDate'] = row.ladingOutDate
          newData['ladingBillNo'] = row.ladingBillNo
          newData['supplierCode'] = row.supplierCode
          newData['deliverCode'] = row.deliverCode
          newData['supplierName'] = row.supplierName
          newData['deliverName'] = row.deliverName
          newData['ladingProductNo'] = row.ladingProductNo
          newData['lotProductDetailCode'] = row.lotProductDetailCode
          newData['preBillProductDetailCode'] = row.preBillProductDetailCode
          newData['productCode'] = row.productCode
          newData['productName'] = row.productName
          newData['brand'] = row.brand
          newData['spec'] = row.spec
          newData['origin'] = row.origin
          newData['productKeyAttr01'] = row.productKeyAttr01
          newData['productKeyAttr02'] = row.productKeyAttr02
          newData['productKeyAttr03'] = row.productKeyAttr03
          newData['itemCount'] = row.itemCount
          newData['measurementQuantity'] = row.measurementQuantity
          newData['actualMeasurementQuantity'] = row.lastMeasurementQuantity
          newData['measurementUnitCode'] = row.measurementUnitCode
          newData['outQuantity'] = row.outQuantity
          newData['actualQuantity'] = row.lastQuantity
          newData['productUnitCode'] = row.productUnitCode
          newData['goodsFlag'] = row.goodsFlag
          newData['bizOrganCode'] = row.bizOrganCode
          newData['bizDeptCode'] = row.bizDeptCode
          newData['bizEmployeeCode'] = row.bizEmployeeCode
          newData['productReservedNum1'] = row.productReservedNum1
          newData['productReservedNum2'] = row.productReservedNum2
          newData['productReservedNum3'] = row.productReservedNum3
          newData['productReservedNum4'] = row.productReservedNum4
          newData['productReservedNum5'] = row.productReservedNum5
          newData['productReservedNum6'] = row.productReservedNum6
          newData['productReservedNum7'] = row.productReservedNum7
          newData['productReservedNum8'] = row.productReservedNum8
          newData['productReservedStr1'] = row.productReservedStr1
          newData['productReservedStr2'] = row.productReservedStr2
          newData['productReservedStr3'] = row.productReservedStr3
          newData['productReservedStr4'] = row.productReservedStr4
          newData['productReservedStr5'] = row.productReservedStr5
          newData['productReservedStr6'] = row.productReservedStr6
          newData['productReservedStr7'] = row.productReservedStr7
          newData['productReservedStr8'] = row.productReservedStr8
          newData['productReservedStr9'] = row.productReservedStr9
          newData['productReservedStr10'] = row.productReservedStr10
          newData['productReservedStr11'] = row.productReservedStr11
          newData['productReservedStr12'] = row.productReservedStr12
          pickList.push(newData)
        })
      }
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.ladingOutConfirmNo // 变量值
      }
    }
  }
}
</script>
