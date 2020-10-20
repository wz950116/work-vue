<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog"></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'feeSettlementEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/fee/feeSettle/get',
          save: '/api/fee/feeSettle/save',
          update: '/api/fee/feeSettle/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
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
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update', 'assist', 'audit']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update', 'copy'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-选择文件',
            name: 'fee.feeSettle.btn.feeDetailSelect',
            isShow: ['add'],
            event: 'set',
            component: () => import('@/views/frame/biz/fee/dialog/feeDetailNoSettleDialog'), // 组件
            validate: this.feeDetailValidateFunc,
            initChoose: this.feeDetailInitChoose,
            callback: this.closeLv2Dialog // 关闭弹窗回调
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
            isShow: ['update', 'view', 'assist', 'audit'],
            event: 'auditHistory'
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
          {
            iconName: '线性-打印',
            name: 'biz.btn.print',
            getParam(data) {
              return {
                settleNo: data.uk || data.settleNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spot.contractLot.group.baseInfo',
            content: [
              {
                label: 'fee.feeSettle.form.settleNo',
                prop: 'settleNo',
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
                label: 'fee.feeSettle.form.settleDate',
                prop: 'settleDate',
                default: toolUtil.todayYYYYMMDD(),
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.isReadonlyAll(),
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              // 服务商
              {
                label: 'fee.feeSettle.form.customerNo',
                prop: 'customerNo',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                event: {
                  evn: this.customerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 业务机构
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
                  data: 'FUNC_ORG',
                  filterable: true,
                  disabled: false,
                  clearable: true
                }
              },
              // 业务部门
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
                  disabled: false,
                  clearable: true
                }
              },
              // 业务员
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
                  filterable: true,
                  disabled: false,
                  clearable: true
                }
              },
              // 操作员
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
              // 备注
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  disabled: false,
                  clearable: true
                }
              }
            ]
          }
        },
        tabs: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'feeSettleFeeDetailDtoList',
            label: 'fee.feeSettle.tab.feeSettleFeeDetailDtoList',
            component: () => import('./feeSettlementFeeDetailTab.vue')
          }
          // {
          //   isShow: ['add', 'update', 'view', 'assist', 'audit'],
          //   name: 'settleDetailDtoList',
          //   label: 'fee.feeSettle.tab.settleDetailDtoList',
          //   component: () => import('./feeSettlementDetailTab.vue')
          // }
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
    isReadonlyAll() {
      return false
    },
    handleCloseDialog(param) {
      this.$store.dispatch('delVisitedViews', this.$route).then(() => this.$router.push({ name: 'feeSettlement' }))
    },
    closeLv2Dialog(param) {
      var feeSettleFeeDetailDtoList = []
      param.forEach(element => {
        feeSettleFeeDetailDtoList.push({
          typeCode: element.typeCode,
          feeDetailNo: element.feeDetailNo + '',
          feeNo: element.feeNo,
          feeDate: element.feeDate,
          customerNo: element.customerNo,
          feeContractNo: element.feeContractNo,
          feeDirection: element.feeDirection,
          feeNameCode: element.feeNameCode,
          feeQuantity: element.feeQuantity,
          quantityUnit: element.quantityUnit,
          excludeTaxPrice: element.excludeTaxPrice,
          excludeTaxAmount: element.excludeTaxAmount,
          taxRate: element.taxRate,
          taxAmount: element.taxAmount,
          includeTaxPrice: element.includeTaxPrice,
          includeTaxAmount: element.includeTaxAmount,
          currency: element.currency,
          feeName: element.feeName,
          customerName: element.customerName,
          brand: element.brand,
          spec: element.spec,
          origin: element.origin,
          productKeyAttr01: element.productKeyAttr01,
          productKeyAttr02: element.productKeyAttr02,
          productKeyAttr03: element.productKeyAttr03,
          productName: element.productName,
          productCode: element.productCode,
          feeIncludeTaxPrice: element.includeTaxPrice,
          feeExcludeTaxPrice: element.excludeTaxPrice,
          feeTaxRate: element.taxRate,
          costQuantity: element.feeQuantity
        })
      })

      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.feeSettleFeeDetailDtoList[0].$refs.tab.tableData = feeSettleFeeDetailDtoList
      // this.editFeeSettlementDetail()
    },
    // editFeeSettlementDetail() {
    //   var feeSettleFeeDetailDtoList = toolUtil.getDataTabFromEdit(this, 'feeSettleFeeDetailDtoList')
    //   var settleDetailDtoList = toolUtil.getDataTabFromEdit(this, 'settleDetailDtoList')
    //   settleDetailDtoList.splice(0)
    //   const compareStrArray = []
    //   for (var i = 0; i < feeSettleFeeDetailDtoList.length; i++) {
    //     var obj = feeSettleFeeDetailDtoList[i]
    //     var str = obj.feeNameCode + obj.currency + toolUtil.toNum(obj.taxRate) + obj.quantityUnit + obj.productCode + obj.brand + obj.spec + obj.origin + obj.productKeyAttr01 + obj.productKeyAttr02 + obj.productKeyAttr03
    //     if (!compareStrArray.includes(str)) {
    //       compareStrArray.push(str)
    //     }
    //     feeSettleFeeDetailDtoList[i].compareStr = str
    //   }
    //   for (var i = 0; i < compareStrArray.length; i++) {
    //     const list = []
    //     for (var j = 0; j < feeSettleFeeDetailDtoList.length; j++) {
    //       if (compareStrArray[i] === feeSettleFeeDetailDtoList[j].compareStr) {
    //         list.push(feeSettleFeeDetailDtoList[j])
    //       }
    //     }
    //     if (list.length > 0) {
    //       var sumQuantity = 0
    //       // 不含税金额
    //       var excludeTaxAmount = 0
    //       // 含税金额
    //       var includeTaxAmount = 0
    //       // 税额
    //       var taxAmount = 0
    //       // 应收金额  1
    //       var receivableAmount = 0
    //       // 应付金额 2
    //       var handleAmount = 0
    //       for (var j = 0; j < list.length; j++) {
    //         if (list[j].feeDirection === '1') {
    //           receivableAmount = Number(receivableAmount) + Number(list[j].includeTaxAmount)
    //         }
    //         if (list[j].feeDirection === '2') {
    //           handleAmount = Number(handleAmount) + Number(list[j].includeTaxAmount)
    //         }
    //         sumQuantity = Number(sumQuantity) + Number(list[j].feeQuantity)
    //         excludeTaxAmount = Number(excludeTaxAmount) + Number(list[j].excludeTaxAmount)
    //         taxAmount = Number(taxAmount) + Number(list[j].taxAmount)
    //         includeTaxAmount = Number(includeTaxAmount) + Number(list[j].includeTaxAmount)
    //       }
    //       var feeDirection = ''
    //       if (Number(receivableAmount) - Number(handleAmount) > 0) {
    //         feeDirection = '1'
    //       }
    //       if (Number(receivableAmount) - Number(handleAmount) < 0) {
    //         feeDirection = '2'
    //       }
    //       var includeTaxPrice = (Number(includeTaxAmount) / Number(sumQuantity)).toFixed(2)
    //       var excludeTaxPrice = (Number(excludeTaxAmount) / Number(sumQuantity)).toFixed(6)
    //       settleDetailDtoList.push({
    //         feeNameCode: list[0].feeNameCode,
    //         quantityUnit: list[0].quantityUnit,
    //         taxRate: list[0].taxRate,
    //         currency: list[0].currency,
    //         feeQuantity: sumQuantity,
    //         excludeTaxAmount: excludeTaxAmount,
    //         excludeTaxPrice: excludeTaxPrice,
    //         taxAmount: taxAmount,
    //         includeTaxAmount: includeTaxAmount,
    //         includeTaxPrice: includeTaxPrice,
    //         customerNo: list[0].customerNo,
    //         feeName: list[0].feeName,
    //         customerName: list[0].customerName,
    //         feeDirection: feeDirection,
    //         brand: list[0].brand,
    //         spec: list[0].spec,
    //         origin: list[0].origin,
    //         productKeyAttr01: list[0].productKeyAttr01,
    //         productKeyAttr02: list[0].productKeyAttr02,
    //         productKeyAttr03: list[0].productKeyAttr03,
    //         productName: list[0].productName,
    //         productCode: list[0].productCode
    //       })
    //     }
    //   }
    // },
    customerNoChange() {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.feeSettleFeeDetailDtoList[0].$refs.tab.tableData = []
      // this.$refs.qmEdit.$refs.qmRouteEdit.$refs.settleDetailDtoList[0].$refs.tab.tableData = []
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    feeDetailValidateFunc() {
      var customerNo = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerNo
      var bizOrganCode = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode
      if ((!customerNo || customerNo === '') && (!bizOrganCode || bizOrganCode === '')) {
        this.$notify(notifyInfo({ msg: this.$t('请选择结算商和业务机构') }))
        return false
      }
      if (!customerNo || customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('请选择结算商') }))
        return false
      }
      if (!bizOrganCode || bizOrganCode === '') {
        this.$notify(notifyInfo({ msg: this.$t('请选择机构') }))
        return false
      }
      return true
    },
    feeDetailInitChoose() {
      return {
        initSearch: true,
        multiple: true,
        customerNo: {
          disabled: true,
          value: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerNo
        },
        bizOrganCode: {
          disabled: true,
          value: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode
        },
        transactionFlag: {
          value: '1'
        }
      }
    }
  }
}
</script>

