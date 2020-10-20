<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'feeInfoEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        // baseBillNo: this.$route.params.uk || this.$route.param.id.feeNo,
        api: {
          view: '/api/fee/feeInfo/get',
          save: '/api/fee/feeInfo/save',
          update: '/api/fee/feeInfo/update'
        },
        apiData: {
          view(param) {
            if (param.uk) {
              return { feeNo: param.uk }
            }
            if (param.id) {
              return param.id
            }
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
                uk: this.$route.params.uk || this.$route.params.id.feeNo
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
                billNo: data.uk || (data.type !== 'add' ? data.id.feeNo : data.feeNo),
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
                feeNo: data.uk || data.id.feeNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'fee.feeInvoice.group.editPart1',
            content: [
              // 单据号
              {
                label: 'fee.feeInfo.form.feeNo',
                prop: 'feeNo',
                element: 'input-validate',
                validate: [
                  {
                    required: !this.autoFlag(),
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.autoFlag(),
                  clearable: false
                }
              },
              // 费用日期
              {
                type: 'date',
                label: 'fee.feeInfo.form.feeDate',
                prop: 'feeDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                },
                default: dateFormate(new Date(), 'yyyyMMdd')
              },
              // 服务商
              {
                label: 'fee.feeInfo.form.customerNo',
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
              {},
              // // 费用合同
              // {
              //   label: 'fee.feeInfo.form.feeContractNo',
              //   prop: 'feeContractNo',
              //   element: 'base-dialog-select',
              //   component: () => import('@/views/frame/biz/fee/dialog/feeContractDialog.vue'),
              //   validateFunc: this.feeContractValidateFunc,
              //   initChoose: this.feeContractInitChoose,
              //   callback: this.feeContractCallback,
              //   attrs: {
              //     disabled: false,
              //     clearable: true
              //   }
              // },
              // // 费用方向
              // {
              //   label: 'fee.feeInfo.form.feeDirection',
              //   prop: 'feeDirection',
              //   element: 'base-select',
              //   list: this.$t('datadict.feeDirection'),
              //   validate: [
              //     {
              //       required: true,
              //       trigger: 'change'
              //     }
              //   ],
              //   attrs: {
              //     disabled: false,
              //     clearable: true
              //   }
              // },
              // {},
              // {},
              // // 不含税金额
              // {
              //   label: 'fee.feeInfo.form.excludeTaxAmount',
              //   prop: 'excludeTaxAmount',
              //   element: 'input-formatter',
              //   validate: [
              //     {
              //       required: true,
              //       trigger: 'blur'
              //     }
              //   ],
              //   attrs: {
              //     type: 'money',
              //     disabled: true,
              //     clearable: true
              //   }
              // },
              // // 税额
              // {
              //   label: 'fee.feeInfo.form.taxAmount',
              //   prop: 'taxAmount',
              //   element: 'input-formatter',
              //   validate: [
              //     {
              //       required: true,
              //       trigger: 'blur'
              //     }
              //   ],
              //   attrs: {
              //     type: 'money',
              //     disabled: true,
              //     clearable: true
              //   }
              // },
              // // 含税金额
              // {
              //   label: 'fee.feeInfo.form.includeTaxAmount',
              //   prop: 'includeTaxAmount',
              //   element: 'input-formatter',
              //   validate: [
              //     {
              //       required: true,
              //       trigger: 'blur'
              //     }
              //   ],
              //   attrs: {
              //     type: 'money',
              //     disabled: true,
              //     clearable: true
              //   }
              // },
              // // 币种
              // {
              //   label: 'fee.feeInfo.form.currency',
              //   prop: 'currency',
              //   element: 'base-select',
              //   list: this.$t('datadict.currency'),
              //   validate: [
              //     {
              //       required: true,
              //       trigger: 'change'
              //     }
              //   ],
              //   attrs: {
              //     disabled: false,
              //     clearable: true
              //   },
              //   default: 'CNY'
              // },
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
            name: 'feeDetailInfoDtoList',
            label: 'fee.feeInfo.tab.feeInfoDetailInfoTab',
            component: () => import('./detailInfoTab.vue'),
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
      default: 'route'
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
    // 本页面关闭
    handleCloseDialog(param) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', param)
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

    // 客户change事件
    customerNoChange(val) {
      var feeDetailList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.feeDetailInfoDtoList[0].$refs.tab.tableData
      if (feeDetailList != null && feeDetailList.length > 0) {
        feeDetailList.forEach(element => {
          element.feeContractNo = ''
        })
      }
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    }
  }
}
</script>
