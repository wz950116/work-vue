<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog' ref='qmEdit' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'negotiateEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/warehouse/whNegotiate/get',
          save: '/api/warehouse/whNegotiate/save',
          update: '/api/warehouse/whNegotiate/update'
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
                negotiateNo: data.uk || data.negotiateNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.negotiate.group.editFormPart1',
            content: [
              {
                label: 'storage.negotiate.form.negotiateNo',
                prop: 'negotiateNo',
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
                label: 'storage.negotiate.form.contractCode',
                prop: 'contractNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/spot/components/chooseContractInfoSc.vue'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: this.$route.query.type === 'view',
                  clearable: true
                },
                setDefault: this.contractNoSetDefault,
                callback: this.contractNoCallback
              },
              {
                label: 'storage.negotiate.form.customerCode',
                prop: 'customerCode',
                element: 'base-select',
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                list: [],
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '1',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  disabled: false,
                  clearable: true,
                  filterable: true
                },
                event: {
                  changeAll: this.changeAllSupplier
                }
              },
              {},
              {
                label: 'storage.negotiate.form.originalCurrencyAmt',
                prop: 'originalCurrencyAmt',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'thousands',
                  precision: 3,
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'storage.negotiate.form.negotiateDate',
                prop: 'negotiateDate',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: this.$route.query.type === 'view',
                  required: true,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                type: 'date',
                label: 'storage.negotiate.form.draftsAtDate',
                prop: 'draftsAtDate',
                attrs: {
                  disabled: this.$route.query.type === 'view',
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
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
                  disabled: this.$route.query.type === 'view',
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
                  disabled: this.$route.query.type === 'view',
                  clearable: true
                }
              },
              {
                label: 'storage.outNotice.form.bizEmployeeCode',
                prop: 'bizEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'TREE_STAFF',
                  disabled: this.$route.query.type === 'view',
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
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
                label: 'storage.negotiate.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  disabled: this.$route.query.type === 'view',
                  clearable: true,
                  cols: 4
                }
              }
            ]
          },
          part2: {
            titleName: 'storage.negotiate.group.editFormPart2',
            content: [
              {
                label: 'storage.negotiate.form.letterCreditNo',
                prop: 'lcNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/lc/dialog/lcReceiveDialog.vue'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: this.$route.query.type === 'view',
                  clearable: true
                },
                validateFunc: this.onLetterCreditNo,
                setDefault: this.letterCreditNoSetDefault,
                callback: this.letterCreditNoCallback
              },
              {
                prop: 'lcReceiveNo',
                isShow: false
              },
              {
                label: 'storage.negotiate.form.letterCreditAmount',
                prop: 'lcAmt',
                element: 'input-formatter',
                validate: [
                  {
                    required: false,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'thousands',
                  precision: 3,
                  disabled: true
                }
              },
              {
                label: 'storage.negotiate.form.currencyCode',
                prop: 'currencyCode',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.negotiate.form.negotiatedBankCode',
                prop: 'negotiateBankCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_BANK',
                  disabled: false,
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'negotiateOutDtoList',
            label: 'storage.negotiate.tab.product',
            component: () => import('./productTab.vue'),
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
    // 初始化：根据合同信息重置客户选项
    handleInitCallback(param) {
      if (param.contractNo) {
        request({
          url: '/api/contract/scInfo/get',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: param.contractNo
          }
        }).then(response => {
          if (response.data) {
            const contractInfo = response.data
            this.resetOptions(contractInfo)
          }
        })
      }
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
    // 选择信用证检查
    onLetterCreditNo() {
      if (!this.$refs.qmEdit.$refs.qmRouteEdit.editForm.contractNo) {
        this.$notify(
          notifyInfo({
            msg: this.$t('storage.negotiate.validateMsg.contractNoRequired')
          })
        )
        return false
      }
      return true
    },
    // 选择信用证设置默认值
    letterCreditNoSetDefault() {
      const contractNo = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.contractNo
      const customerCode = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerCode
      const currencyCode = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currencyCode
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.contractNo = contractNo
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.customerNo = customerCode
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.currency = currencyCode
      if (contractNo) {
        this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
          if (info.prop === 'contractNo') info.attrs.disabled = true
        })
      }
      if (customerCode) {
        this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
          if (info.prop === 'customerNo') info.attrs.disabled = true
        })
      }
      if (currencyCode) {
        this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
          if (info.prop === 'currency') info.attrs.disabled = true
        })
      }
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    // 选择信用证回调
    letterCreditNoCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.lcNo = param.letterCreditNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.lcReceiveNo = param.receiveNo
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.lcAmt = param.letterCreditAmount
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.negotiateBankCode = param.adviseBank
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currencyCode = param.currency
    },
    changeAllSupplier(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    // 选择合同设置默认值
    contractNoSetDefault() {
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    // 选择合同回调
    contractNoCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.contractNo = param.contractNo
      this.resetOptions(param)
      // this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currencyCode = param.currency
    },
    async resetOptions(contractInfo) {
      const customerList = []
      if (contractInfo) {
        contractInfo.customerCodeList.forEach((s, index) => {
          customerList.push({
            code: s,
            name: contractInfo.customerNames.split(',')[index]
          })
        })
      } else {
        // 传空时base select 会默认处理
      }
      this.edit.formData.part1.content.forEach(f => {
        if (f.prop === 'customerCode') {
          f.list = customerList
        }
      })
    }
  }
}
</script>
