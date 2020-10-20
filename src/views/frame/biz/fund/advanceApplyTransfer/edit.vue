<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @preCallback='handlePreCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'advanceApplyTransferEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          pre: {
            FUND_APPLY: '/api/fund/apply/get',
            ADVANCE_APPLY_TRANSFER_CHECK: '/api/fund/apply/get'
          },
          view: '/api/fund/applyAdvTran/get',
          save: '/api/fund/applyAdvTran/save',
          update: '/api/fund/applyAdvTran/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
          },
          pre(param) {
            // 可以根据不同的 preBillType 返回没的数据
            return param.preBillNo
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
                billNo: data.transferNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectAdvApply',
            isShow: ['add'],
            event: 'set',
            component: () => import('@/views/frame/biz/fund/dialog/fundAdvApplyDialog.vue'),
            initChoose: this.selectAdvApplyInitChoose,
            callback: this.selectAdvApplyCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'fund.advanceApplyTransfer.group.editPart1',
            content: [
              // 单据号
              {
                label: 'fund.advanceApplyTransfer.form.transferNo',
                prop: 'transferNo',
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
              // 转换日期
              {
                type: 'date',
                label: 'fund.advanceApplyTransfer.form.transferDate',
                prop: 'transferDate',
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
                label: 'fund.advanceApplyTransfer.form.customerNo',
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
                  disabled: true,
                  clearable: true
                },
                event: {
                  evn: this.customerNoChange,
                  changeAll: this.changeAllCustomerNo
                }
              },
              // 付款申请单号
              {
                label: 'fund.advanceApplyTransfer.form.applyNo',
                prop: 'applyNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              // 采购合同号
              {
                label: 'fund.advanceApplyTransfer.form.contractNoParent',
                prop: 'contractNo',
                element: 'input-validate',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              // 转换金额
              {
                label: 'fund.advanceApplyTransfer.form.transferAmount',
                prop: 'transferAmount',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'money',
                  disabled: true,
                  clearable: true
                }
              },
              // 币种
              {
                label: 'fund.advanceApplyTransfer.form.currency',
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
                  disabled: true,
                  clearable: true
                }
              },
              // 业务机构
              {
                label: 'biz.lbl.bizOrganName',
                prop: 'bizOrganCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_ORG',
                  filterable: true,
                  disabled: true,
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
            name: 'fundApplyAdvTranDeDtoList',
            label: 'fund.advanceApplyTransfer.tab.transferDetailInfoTab',
            component: () => import('./transferDetailInfoTab.vue'),
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
    // 选择付款申请弹框初始化
    selectAdvApplyInitChoose() {
      return {
        initSearch: true,
        multiple: false
      }
    },
    // 上级数据查询返回
    handlePreCallback(param) {
      this.selectAdvApplyCallback(param)
    },
    // 选择付款申请回调函数
    selectAdvApplyCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.applyNo = param.applyNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerNo = param.customerNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerName = param.customerName
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.contractNo = param.contractNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currency = param.currency
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizOrganCode = param.bizOrganCode
      this.clearTransferDetailInfo()
    },
    // 客户change事件
    customerNoChange(val) {
      this.clearAdvApplyInfo()
      this.clearTransferDetailInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      // this.clearCustomerInfo()
      this.clearAdvApplyInfo()
      this.clearTransferDetailInfo()
    },
    // 清空预付款申请信息
    clearAdvApplyInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.applyNo = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.contractNo = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currency = ''
    },
    // 清空转换详细信息
    clearTransferDetailInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.fundApplyAdvTranDeDtoList[0].$refs.tab.tableData = []
    }
  }
}
</script>
