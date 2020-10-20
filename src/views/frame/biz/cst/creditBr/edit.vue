<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'custCreditBrEdit',
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
          save: '/api/cust/credit/saveBr',
          update: '/api/cust/credit/updateBr'
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
            label: 'cst.creditBr.form.custCode',
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
                typeCode: '4'
              },
              filterable: true,
              clearable: true,
              disabled: this.isReadonlyAll()
            }
          },
          {
            type: 'date',
            label: 'cst.creditBr.form.date',
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
            attrs: {
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'cst.creditBr.form.warnAmount',
            prop: 'warnAmount',
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
            label: 'cst.creditBr.form.limitAmount',
            prop: 'limitAmount',
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
            label: 'cst.creditBr.form.optEmployeeName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
            attrs: {
              data: 'TREE_STAFF',
              disabled: true
            }
          },
          {
            label: 'cst.creditBr.form.applyDt',
            prop: 'applyDt',
            element: 'input-validate',
            default: toolUtil.timeStr(),
            attrs: {
              disabled: true
            }
          }
        ],

        tabs: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'brProductList',
            label: 'cst.creditBr.tab.brProductList',
            component: () => import('./brProductList.vue')
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
    save() {},
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
