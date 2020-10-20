<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @initCallback='initCallback' @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'custCreditCsEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          pre: {
            CUST_INFO: '/api/cust/customer/getByCode'
          },
          view: '/api/cust/credit/get',
          save: '/api/cust/credit/saveCs',
          update: '/api/cust/credit/updateCs'
        },
        apiData: {
          pre(param) {
            return param.preBillNo
          },
          view(param) {
            return param.uk || param.custCreditNo
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
            $refs: this.$refs,
            getParam: this.getParamAuditHistory,
            isShow: ['update', 'view', 'assist', 'audit'],
            event: 'auditHistory'
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.custCreditNo,
                billType: this.$route.meta.bizCode
              }
            },
            event: 'attachment',
            isShow: ['update', 'view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: [
          {
            label: 'cst.creditCs.form.custCode',
            prop: 'custCode',
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
                auditStatus: '3',
                typeCode: '12'
              },
              cols: 2,
              filterable: true,
              clearable: true,
              disabled: this.isReadonlyAll()
            },
            event: {
              changeAll: this.changeCustCode
            }
          },
          {
            label: 'cst.creditCs.form.creditType',
            prop: 'creditType',
            element: 'base-select',
            list: this.$t('datadict.creditType'),
            default: '1',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              disabled: true
            },
            event: this.creditTypeChange
          },
          {
            label: 'cst.creditCs.form.creditQuotaType',
            prop: 'creditQuotaType',
            element: 'base-select',
            list: this.$t('datadict.creditQuotaType'),
            default: '4',
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true
            },
            event: this.creditQuotaTypeChange
          },
          {
            label: 'cst.creditCs.form.custHeadline',
            prop: 'custHeadline',
            element: 'input-validate',
            attrs: {
              disabled: true,
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'cst.creditCs.form.creditQuota',
            prop: 'creditQuota',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              gtmin: 0,
              type: 'money',
              disabled: this.isReadonlyAll()
            }
          },
          {
            label: 'cst.creditCs.form.usedAmount',
            prop: 'usedAmount',
            element: 'input-formatter',
            attrs: {
              disabled: true,
              type: 'money',
              precision: 2
            }
          },
          {
            label: 'cst.creditCs.form.custTypeName',
            prop: 'typeCode',
            element: 'base-select',
            list: this.$t('datadict.custType2'),
            attrs: {
              disabled: true
            }
          },
          {
            label: 'cst.creditCs.form.creditWay',
            prop: 'creditWay',
            element: 'base-select',
            list: this.$t('datadict.creditWay'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true,
              disabled: this.isReadonlyAll()
            }
          },
          {
            label: 'cst.creditCs.form.limitByContract',
            prop: 'limitByContract',
            element: 'input-formatter',
            attrs: {
              min: 0,
              type: 'money',
              disabled: this.isReadonlyAll()
            }
          },
          {
            label: 'cst.creditCs.form.docType',
            prop: 'docType',
            element: 'base-select',
            list: this.$t('datadict.custCreditDocType'),
            // validate: [
            //   {
            //     required: true,
            //     trigger: 'blur'
            //   }
            // ],
            attrs: {
              clearable: true,
              disabled: true
            },
            isShow: false,
            event: this.docTypeChange
          },
          {
            label: 'cst.creditCs.form.docNo',
            prop: 'docNo',
            element: 'base-dialog-select',
            // validate: [
            //   {
            //     required: true,
            //     trigger: 'blur'
            //   }
            // ],
            attrs: {
              clearable: true,
              disabled: true
            },
            isShow: false,
            callback: this.docNoCallback
          },
          {
            label: 'cst.creditCs.form.netDays',
            prop: 'netDays',
            element: 'input-formatter',
            validate: [
              {
                trigger: 'blur'
              }
            ],
            attrs: {
              min: 0,
              type: 'num',
              disabled: this.isReadonlyAll()
            },
            isShow: true
          },
          {
            label: 'cst.creditCs.form.payWay',
            prop: 'payWay',
            element: 'base-select',
            list: this.$t('datadict.payWay'),
            attrs: {
              clearable: true,
              disabled: this.isReadonlyAll()
            },
            isShow: true
          },
          {
            type: 'date',
            label: 'cst.creditCs.form.date',
            props: ['dateStart', 'dateEnd'],
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            default: '1',
            attrs: {
              disabled: true
            }
          },
          {
            label: 'cst.creditCs.form.optEmployeeName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
            attrs: {
              data: 'TREE_STAFF',
              disabled: true
            }
          },
          {
            label: 'cst.creditCs.form.applyDt',
            prop: 'applyDt',
            element: 'input-validate',
            default: toolUtil.timeStr(),
            attrs: {
              disabled: true
            }
          },
          {
            label: 'cst.creditCs.form.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              type: 'textarea',
              cols: 4,
              disabled: this.isReadonlyAll()
            }
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
    // 选择单据号回调--字段可能需要判断下
    docNoCallback(param) {
      if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.docType === 'P') {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.docNo = param.applyNo
      }
      if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.docType === 'S') {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.docNo = param.outBillNo
      }
    },
    initCallback(data) {
      this.creditTypeChange(data.creditType)
      this.creditQuotaTypeChange(data.creditQuotaType)
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: { ...(!!param && { refresh: !!param }) }
        })
      })
    },
    isReadonlyAll() {
      return false
    },
    docTypeChange(docType) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.docNo = ''
      if (docType === 'P') {
        toolUtil.getDefFormItemByProp(this, 'docNo').attrs.disabled = false
        toolUtil.getDefFormItemByProp(this, 'docNo').component = ('view-form-edit', () => import('@/views/frame/biz/fund/components/fundApplyDialog.vue'))
      } else if (docType === 'S') {
        toolUtil.getDefFormItemByProp(this, 'docNo').attrs.disabled = false
        toolUtil.getDefFormItemByProp(this, 'docNo').component = ('view-form-edit', () => import('@/views/frame/biz/storage/components/outNoticeDialog.vue'))
      } else {
        toolUtil.getDefFormItemByProp(this, 'docNo').attrs.disabled = true
      }
    },
    creditTypeChange(creditType) {
      const editForm = toolUtil.getDataEditFromSelf(this)
      // if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.docType === 'P') {
      //   toolUtil.getDefFormItemByProp(this, 'docNo').attrs.disabled = false
      //   toolUtil.getDefFormItemByProp(this, 'docNo').component = ('view-form-edit', () => import('@/views/frame/biz/fund/components/fundApplyDialog.vue'))
      // } else if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.docType === 'S') {
      //   toolUtil.getDefFormItemByProp(this, 'docNo').attrs.disabled = false
      //   toolUtil.getDefFormItemByProp(this, 'docNo').component = ('view-form-edit', () => import('@/views/frame/biz/storage/components/outNoticeDialog.vue'))
      // }
      // 一般授信的场合
      if (creditType === '1') {
        toolUtil.getDefFormItemByProp(this, 'dateStart').isShow = true
        toolUtil.getDefFormItemByProp(this, 'dateEnd').isShow = true
        toolUtil.getDefFormItemByProp(this, 'limitByContract').isShow = true
        toolUtil.getDefFormItemByProp(this, 'docType').isShow = false
        toolUtil.getDefFormItemByProp(this, 'docNo').isShow = false
        toolUtil.getDefFormItemByProp(this, 'dateStart').validate[0].required = true
        toolUtil.getDefFormItemByProp(this, 'dateEnd').validate[0].required = true
        // toolUtil.getDefFormItemByProp(this, 'docType').validate[0].required = false
        // toolUtil.getDefFormItemByProp(this, 'docNo').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'creditWay').attrs.disabled = false
        editForm.creditWay = '1'
        editForm.docType = null
        editForm.docNo = null
      } else {
        // 临时授信的场合
        toolUtil.getDefFormItemByProp(this, 'dateStart').isShow = false
        toolUtil.getDefFormItemByProp(this, 'dateEnd').isShow = false
        toolUtil.getDefFormItemByProp(this, 'limitByContract').isShow = false
        toolUtil.getDefFormItemByProp(this, 'docType').isShow = true
        toolUtil.getDefFormItemByProp(this, 'docNo').isShow = true
        toolUtil.getDefFormItemByProp(this, 'dateStart').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'dateEnd').validate[0].required = false
        toolUtil.getDefFormItemByProp(this, 'creditWay').attrs.disabled = true
        editForm.dateStart = null
        editForm.dateEnd = null
        // 授信方式 = 个设
        editForm.creditWay = '2'
        editForm.limitByContract = null
      }
    },
    // 额度类型变化时修改
    creditQuotaTypeChange(creditQuotaType) {
      const editForm = toolUtil.getDataEditFromSelf(this)
      // 授信额度为支付额度时，展示合同限额
      if (creditQuotaType === '4') {
        toolUtil.getDefFormItemByProp(this, 'limitByContract').isShow = true
        toolUtil.getDefFormItemByProp(this, 'creditType').attrs.disabled = true
        editForm.creditType = '1'
        //toolUtil.getDefFormItemByProp(this, 'dummy3dummy3').isShow = true
      } else {
        toolUtil.getDefFormItemByProp(this, 'limitByContract').isShow = false
        toolUtil.getDefFormItemByProp(this, 'creditType').attrs.disabled = false
        //toolUtil.getDefFormItemByProp(this, 'dummy3').isShow = false
        editForm.limitByContract = null
      }
    },
    changeCustCode(dataInfo) {
      const custInfo = dataInfo.data
      const editForm = toolUtil.getDataEditFromSelf(this)
      editForm.typeCode = custInfo.typeCode
      editForm.custHeadline = custInfo.custHeadline
      //TODO
      // if (toolUtil.isEmpty(custInfo.custParentCode)) {
      //   // 个别
      //   editForm.creditWay = '2'
      //   toolUtil.getDefFormItemByProp(this, 'creditWay').attrs.disabled = true
      // } else {
      //   // 统设
      //   editForm.creditWay = '1'
      //   toolUtil.getDefFormItemByProp(this, 'creditWay').attrs.disabled = false
      // }
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.custCreditNo // 变量值
      }
    },
    handlePreCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['custCode'] = param.custCode
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['custHeadline'] = param.custHeadline
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['typeCode'] = param.typeCode
      // for (let i = 0; i < this.edit.formData.length; i++) {
      //   var data = this.edit.formData[i]
      //   if (data.prop === 'custCode') {
      //     data.attrs.disabled = true
      //   }
      // }
    }
  }
}
</script>
