<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'transactionBalanceInitEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/transaction/balanceInit/get',
          save: '/api/transaction/balanceInit/save',
          update: '/api/transaction/balanceInit/update'
        },
        apiData: {
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
          {
            iconName: '线性-打印',
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                billNo: data.uk || data.id
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'transaction.transactionBalanceInit.group.editPart1',
            content: [
              // 单据号
              {
                label: 'transaction.transactionBalanceInit.form.balanceInitNo',
                prop: 'balanceInitNo',
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
              // 初始化日期
              {
                type: 'date',
                label: 'transaction.transactionBalanceInit.form.balanceInitDate',
                prop: 'balanceInitDate',
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
              // 客户
              {
                label: 'transaction.transactionBalanceInit.form.customerNo',
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
                    typeCode: '12',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  cols: 2,
                  filterable: true,
                  disabled: false,
                  clearable: true
                }
              },
              // 往来类型
              {
                label: 'transaction.transactionBalanceInit.form.transactionType',
                prop: 'transactionType',
                element: 'base-select',
                list: this.$t('datadict.transactionType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                default: 'BUSINESS'
              },
              // 往来明细类型
              {
                label: 'transaction.transactionBalanceInit.form.transactionDetailType',
                prop: 'transactionDetailType',
                element: 'base-select',
                list: this.$t('datadict.transactionDetailType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                default: 'BUY'
              },
              // 初始化金额
              {
                label: 'transaction.transactionBalanceInit.form.balanceInitAmount',
                prop: 'balanceInitAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'money',
                  disabled: false,
                  clearable: true
                }
              },
              // 币种
              {
                label: 'transaction.transactionBalanceInit.form.currency',
                prop: 'currency',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                default: 'CNY'
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
                },
                event: {
                  evn: this.bizOrganCodeChange
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
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: []
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
    // 初始化回调
    handleInitCallback(param) {},
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
    // 业务机构change事件
    bizOrganCodeChange(val) {}
  }
}
</script>
