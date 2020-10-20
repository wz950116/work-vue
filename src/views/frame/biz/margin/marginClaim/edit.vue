<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'marginClaimEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/margin/marginClaim/get',
          save: '/api/margin/marginClaim/save',
          update: '/api/margin/marginClaim/update'
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
            },
            extraEvent: this.beforeSaveCheck
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
                billNo: data.claimNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-选择文件',
            name: 'biz.btn.selectFundReceive',
            isShow: ['add'],
            event: 'set',
            component: () => import('@/views/frame/biz/fund/dialog/fundReceiveDialog.vue'),
            initChoose: this.selectFundReceiveInitChoose,
            callback: this.selectFundReceiveCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'margin.marginClaim.tab.editPart1',
            content: [
              // 认领单号
              {
                label: 'margin.marginClaim.form.claimNo',
                prop: 'claimNo',
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
              // 认领日期
              {
                type: 'date',
                label: 'margin.marginClaim.form.claimDate',
                prop: 'claimDate',
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
                label: 'margin.marginClaim.form.customerNo',
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
              // 收款单号
              {
                label: 'margin.marginClaim.form.receiveNo',
                prop: 'receiveNo',
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
              // 收款方式
              {
                label: 'margin.marginClaim.form.receiveType',
                prop: 'receiveType',
                element: 'base-select',
                list: this.$t('datadict.settlementType'),
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
              {},
              {},
              // 认领类型
              {
                label: 'margin.marginClaim.form.claimType',
                prop: 'claimType',
                element: 'base-select',
                list: this.$t('datadict.marginClaimType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: '1',
                attrs: {
                  disabled: false
                },
                event: this.claimTypeChange
              },
              // 认领金额
              {
                label: 'margin.marginClaim.form.claimAmount',
                prop: 'claimAmount',
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
                label: 'margin.marginClaim.form.currency',
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
            name: 'marginClaimDetailDtoList',
            label: 'margin.marginClaim.tab.marginClaimDetailDtoList',
            component: () => import('./marginClaimDetailDtoList.vue'),
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
    // 初始化回调
    handleInitCallback(param) {
      // 初始化时，设置为true，防止接口返回快慢导致下方详细数据被刷新
      this.claimTypeChange(param.claimType, true)
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
    // 选择收款登记弹框初始化
    selectFundReceiveInitChoose() {
      return {
        initSearch: true,
        multiple: false,
        typeCodeList: {
          disabled: true,
          value: ['1', '2', '12']
        }
      }
    },
    // 选择收款登记回调函数
    selectFundReceiveCallback(param) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerNo = param.customerNo
      editForm.customerName = param.customerName
      editForm.receiveNo = param.receiveNo
      editForm.receiveType = param.receiveType
      editForm.currency = param.currency
      editForm.bizOrganCode = param.bizOrganCode
      editForm.receiveAmount = toolUtil.toNum(param.receiveAmount)
      editForm.claimAmountAble = toolUtil.toNum(param.receiveAmount) - toolUtil.toNum(param.claimAmount)
      this.clearClaimDetailInfo()
    },
    beforeSaveCheck() {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      const dtlList = toolUtil.getDataTabFromEdit(this, 'marginClaimDetailDtoList')
      if (editForm.claimAmountAble !== null && editForm.claimAmountAble !== undefined) {
        let claimAmount = 0
        for (let i = 0; i < dtlList.length; i++) {
          claimAmount = claimAmount + toolUtil.toNum(dtlList[i].claimAmount)
        }
        if (claimAmount > toolUtil.toNum(editForm.claimAmountAble)) {
          this.$notify(notifyInfo({ msg: this.$t('认领金额大于已收款的可认领金额') }))
          return false
        }
      }
      return true
    },
    // 客户change事件
    customerNoChange(val) {
      this.clearReceiveInfo()
      this.clearClaimDetailInfo()
    },
    changeAllCustomerNo(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 认领类型change事件
    claimTypeChange(val, isInit) {
      const dtlList = toolUtil.getRefTabFromEdit(this, 'marginClaimDetailDtoList')
      if (this.$route.params.type === 'add' || this.$route.params.type === 'update') {
        if (val === '1') {
          dtlList.tab.topBar[0].isShow = true
          dtlList.tab.topBar[1].isShow = false
        } else {
          dtlList.tab.topBar[0].isShow = false
          dtlList.tab.topBar[1].isShow = true
        }
      }
      this.clearClaimDetailInfo(isInit)
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      this.clearReceiveInfo()
      this.clearClaimDetailInfo()
    },
    // 清空收款登记信息
    clearReceiveInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveNo'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['receiveType'] = ''
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = ''
    },
    // 清空认领详细信息
    clearClaimDetailInfo(isInit) {
      if (this.$refs.qmEdit.$refs.qmRouteEdit.$refs.marginClaimDetailDtoList[0] && !isInit) {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.marginClaimDetailDtoList[0].$refs.tab.tableData = []
      }
    }
  }
}
</script>
