<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'brokerEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/cust/brokers/getByCode',
          save: '/api/cust/brokers/save',
          update: '/api/cust/brokers/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.id
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
            extraEvent: this.saveValidate
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
            isShow: ['view', 'update', 'assist', 'audit'],
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
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                custCode: data.uk || data.custCode
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'biz.title.mainInfo',
            content: [
              {
                label: 'cst.broker.form.custNo',
                prop: 'custCode',
                element: 'input-validate',
                validate: [
                  {
                    required: !this.autoFlag(),
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.autoFlag(),
                  clearable: true,
                  maxlength: 50
                }
              },
              {
                label: 'cst.broker.form.brokerCode',
                prop: 'brokerCode',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'cst.broker.form.custName',
                prop: 'custName',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  maxlength: 200
                }
              },
              {
                label: 'cst.broker.form.custFullName_CHS',
                prop: 'custFullnameChs',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                event: {
                  change: this.handleChangeCustFullName
                },
                attrs: {
                  clearable: true,
                  maxlength: 200
                }
              },
              {
                label: 'cst.broker.form.custFullName_EN',
                prop: 'custFullnameEn',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  maxlength: 200
                }
              },
              {
                label: 'cst.broker.form.custHeadline',
                prop: 'custHeadline',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  maxlength: 200
                }
              },
              {
                label: 'cst.broker.form.type',
                prop: 'typeCode',
                element: 'base-select',
                list: this.$t('datadict.custType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: '4',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'cst.broker.form.enterpriseType',
                prop: 'enterpriseTypeCode',
                element: 'base-select',
                list: this.$t('datadict.enterpriseType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'cst.broker.form.enterpriseForm',
                prop: 'enterpriseFormCode',
                element: 'base-select',
                list: this.$t('datadict.enterpriseForm'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'biz.lbl.usingFlag',
                prop: 'usingFlag',
                type: 'radio',
                list: this.$t('datadict.usingFlag'),
                default: '1',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'cst.broker.form.isBlacklist',
                prop: 'isBlacklist',
                type: 'radio',
                list: this.$t('datadict.yesNo'),
                default: '0',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'cst.broker.form.licenceCode',
                prop: 'licenceCode',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'cst.broker.form.licenceDueDate',
                prop: 'licenceDuedate',
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'cst.customerSupplier.form.creditRating',
                prop: 'creditRating',
                element: 'base-select',
                list: this.$t('datadict.creditRating'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                prop: 'classifyCode',
                default: '2',
                isShow: false
              }
            ]
          },
          part2: {
            titleName: 'cst.customerSupplier.title.subInfo',
            content: [
              {
                label: 'cst.broker.form.area',
                prop: 'areaCode',
                element: 'base-select',
                attrs: {
                  required: true,
                  data: 'TREE_AREA',
                  clearable: true
                }
              },
              {
                label: 'cst.broker.form.address',
                prop: 'address',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  cols: 2,
                  maxlength: 500
                }
              },
              {
                label: 'cst.broker.form.legalName',
                prop: 'legalName',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  maxlength: 200
                }
              },
              {
                label: 'cst.broker.form.registCapital',
                prop: 'registCapital',
                element: 'input-formatter',
                attrs: {
                  append: '万元',
                  gtmin: 0,
                  max: 999999999999.999,
                  type: 'thousands',
                  precision: 3,
                  maxlength: 20
                }
              },

              {
                label: 'cst.broker.form.officeAddress',
                prop: 'officeAddress',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  cols: 2,
                  maxlength: 200
                }
              },
              {
                label: 'cst.broker.form.businessScale',
                prop: 'businessScale',
                element: 'base-select',
                list: this.$t('datadict.businessScale'),
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'cst.broker.form.employees',
                prop: 'employees',
                element: 'input-formatter',
                attrs: {
                  type: 'num',
                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'cst.broker.form.foundTime',
                prop: 'foundTime',
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'cst.broker.form.scopeBusiness',
                prop: 'scopeBusiness',
                element: 'el-input',
                attrs: {
                  cols: 2,
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'cardInfoList',
            label: 'cst.broker.tab.cardInfo',
            component: () => import('./cardInfo.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'contactsList',
            label: 'cst.broker.tab.contactInfo',
            component: () => import('./contactInfo.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'bankInfoList',
            label: 'cst.broker.tab.accountInfo',
            component: () => import('./accountInfo.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'stackHoldList',
            label: 'cst.broker.tab.shareholdInfo',
            component: () => import('./shareholdInfo.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'billList',
            label: 'cst.broker.tab.taxInfo',
            component: () => import('./taxInfo.vue')
          },
          {
            isShow: ['view'],
            name: 'brokersCreditList',
            label: 'cst.broker.tab.creditInfo',
            component: () => import('./creditInfo.vue')
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
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: { ...(!!param && { refresh: !!param }) }
        })
      })
    },
    saveValidate() {
      let fail = true
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.cardInfoList[0].$refs.tab.tableData.forEach(row => {
        if (row.expiryDate < row.registDate) {
          fail = false
        }
      })
      if (!fail) {
        this.$notify(
          notifyInfo({
            msg: '失效日期不得小于注册日期'
          })
        )
      }
      return fail
    },
    handleChangeCustFullName() {
      const data = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      if (this.edit.type === 'add') {
        data.custHeadline = data.custFullnameChs
      }
    }
  }
}
</script>
