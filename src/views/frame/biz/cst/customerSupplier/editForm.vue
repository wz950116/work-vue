<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='initPage'></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'customerSupplierEdit',
  data() {
    return {
      edit: {
        type: this.getOpType(),
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/cust/customer/getByCode',
          save: '/api/cust/customer/save',
          update: '/api/cust/customer/update'
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
                label: 'cst.customerSupplier.form.custNo',
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
                label: 'cst.customerSupplier.form.custName',
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
                label: 'cst.customerSupplier.form.custFullName_CHS',
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
                label: 'cst.customerSupplier.form.custFullName_EN',
                prop: 'custFullnameEn',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  maxlength: 200
                }
              },
              {
                label: 'cst.customerSupplier.form.custHeadline',
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
                label: 'cst.customerSupplier.form.superiorName',
                prop: 'custParentCode',
                element: 'base-select',
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '12',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  filterable: true,
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.enterpriseType',
                prop: 'enterpriseTypeCode',
                element: 'base-select',
                list: this.$t('datadict.enterpriseType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: '2',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.enterpriseForm',
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
                label: 'cst.customerSupplier.form.isBlacklist',
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
                label: 'cst.customerSupplier.form.reverseFlag',
                prop: 'reverseFlag',
                type: 'radio',
                list: this.$t('datadict.reverseFlag'),
                default: '0',
                event: this.reverseFlagChange,
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
                label: 'cst.customerSupplier.form.type',
                prop: 'typeCodeList',
                element: 'base-select',
                list: this.$t('datadict.custcsType'),
                event: this.handleChangeType,
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true,
                  multiple: true
                }
              },
              {
                label: 'cst.customerSupplier.form.reverseOrganCode',
                prop: 'reverseOrganCode',
                element: 'base-select',
                attrs: {
                  required: false,
                  data: 'FUNC_ORG',
                  clearable: true,
                  disabled: true
                }
              },
              {
                label: 'cst.customerSupplier.form.productType',
                prop: 'productType',
                element: 'input-validate',
                attrs: {
                  cols: 2,
                  clearable: true
                }
              },
              {
                prop: 'allocationType',
                label: 'cst.customerSupplier.form.allocationType',
                isShow: ['view'],
                type: 'radio',
                list: this.$t('datadict.custAllocationType'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'cst.customerSupplier.form.buyTrade',
                prop: 'buytradeCodeList',
                element: 'base-select',
                list: this.$t('datadict.tradeWay'),
                attrs: {
                  cols: 2,
                  clearable: true,
                  multiple: true
                }
              },
              {
                label: 'cst.customerSupplier.form.saleTrade',
                prop: 'saletradeCodeList',
                element: 'base-select',
                list: this.$t('datadict.tradeWay'),
                attrs: {
                  cols: 2,
                  clearable: true,
                  multiple: true
                }
              },
              {
                label: 'cst.customerSupplier.form.currency',
                prop: 'currency',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: 'CNY',
                attrs: {
                  clearable: true
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
                label: 'cst.customerSupplier.form.fundRecvMinRate',
                prop: 'fundRecvMinRate',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  max: 100,
                  type: 'percent',
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.fundRecvPeriod',
                prop: 'fundRecvPeriod',
                element: 'input-formatter',
                attrs: {
                  disabled: false,
                  min: 0,
                  max: 9999999999,
                  type: 'num',
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.goodRecvMinRate',
                prop: 'goodRecvMinRate',
                element: 'input-formatter',
                attrs: {
                  disabled: false,
                  min: 0,
                  max: 100,
                  type: 'percent',
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.goodRecvPeriod',
                prop: 'goodRecvPeriod',
                element: 'input-formatter',
                attrs: {
                  disabled: false,
                  min: 0,
                  max: 9999999999,
                  type: 'num',
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.totalAmountCheck',
                prop: 'totalAmountCheck',
                element: 'input-formatter',
                attrs: {
                  disabled: false,
                  min: 0,
                  type: 'money',
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.isParentCredit',
                prop: 'isParentCredit',
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
                label: 'cst.customerSupplier.form.coopMode',
                prop: 'coopMode',
                element: 'el-input',
                attrs: {
                  clearable: true,
                  cols: 4,
                  maxlength: 500
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
                label: 'cst.customerSupplier.form.area',
                prop: 'areaCode',
                element: 'base-select',
                attrs: {
                  required: true,
                  data: 'TREE_AREA',
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.address',
                prop: 'address',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  cols: 2,
                  maxlength: 500
                }
              },
              {
                label: 'cst.customerSupplier.form.legalName',
                prop: 'legalName',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  maxlength: 200
                }
              },
              {
                label: 'cst.customerSupplier.form.registCapital',
                prop: 'registCapital',
                element: 'input-formatter',
                attrs: {
                  append: '万元',
                  min: 0,
                  max: 999999999999.999,
                  type: 'thousands',
                  precision: 3,
                  maxlength: 20
                }
              },
              {
                label: 'cst.customerSupplier.form.officeAddress',
                prop: 'officeAddress',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  cols: 2,
                  maxlength: 200
                }
              },
              {
                label: 'cst.customerSupplier.form.businessScale',
                prop: 'businessScale',
                element: 'base-select',
                list: this.$t('datadict.businessScale'),
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'cst.customerSupplier.form.employees',
                prop: 'employees',
                element: 'input-formatter',
                attrs: {
                  type: 'num',
                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'cst.customerSupplier.form.foundTime',
                prop: 'foundTime',
                pickerOptions: {
                  disabledDate(time) {
                    return time.getTime() > Date.now()
                  }
                },
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'cst.customerSupplier.form.scopeBusiness',
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
            label: 'cst.customerSupplier.tab.cardInfo',
            component: () => import('./cardInfo.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'contactsList',
            label: 'cst.customerSupplier.tab.contactInfo',
            component: () => import('./contactInfo.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'bankInfoList',
            label: 'cst.customerSupplier.tab.accountInfo',
            component: () => import('./accountInfo.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'stackHoldList',
            label: 'cst.customerSupplier.tab.shareholdInfo',
            component: () => import('./shareholdInfo.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'billList',
            label: 'cst.customerSupplier.tab.taxInfo',
            component: () => import('./taxInfo.vue')
          },
          {
            isShow: ['view'],
            name: 'creditList',
            label: 'cst.customerSupplier.tab.creditInfo',
            component: () => import('./creditInfo.vue')
          },
          {
            isShow: ['view'],
            name: 'allocationInfoList',
            label: 'cst.customerSupplier.tab.allocationInfo',
            component: () => import('./allocationInfo.vue')
          }
          // {
          //   isShow: ['view'],
          //   name: 'defaultRecords',
          //   label: 'cst.customerSupplier.tab.defaultRecords',
          //   component: () => import('./defaultRecords.vue')
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
    initPage(val) {
      this.handleChangeType()
      this.reverseFlagChange()
    },
    reverseFlagChange() {
      let val = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.reverseFlag
      const contentList = this.edit.formData.part1.content
      if (val === '1') {
        for (let i = 0; i < contentList.length; i++) {
          const data = contentList[i]
          if (data.prop === 'reverseOrganCode') {
            this.$set(data.attrs, 'required', true)
            this.$set(data.attrs, 'disabled', false)
            this.$set(this.$refs.qmEdit.$refs.qmRouteEdit.rules, 'reverseOrganCode', [
              {
                required: true,
                trigger: 'change'
              }
            ])
          }
        }
      } else {
        for (let i = 0; i < contentList.length; i++) {
          const data = contentList[i]
          if (data.prop === 'reverseOrganCode') {
            this.$refs.qmEdit.$refs.qmRouteEdit.editForm.reverseOrganCode = ''
            this.$set(data.attrs, 'required', false)
            this.$set(data.attrs, 'disabled', true)
            this.$set(this.$refs.qmEdit.$refs.qmRouteEdit.rules, 'reverseOrganCode', [
              {
                required: false,
                trigger: 'change'
              }
            ])
          }
        }
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
      // 判断收款比例管控和欠款总额管控只能选择一种
      const data = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      if (data.fundRecvMinRate !== '' && data.totalAmountCheck !== '') {
        this.$notify(notifyInfo({ msg: this.$t('cst.customerSupplier.validateMsg.collectionCheck') }))
        fail = false
      }
      return fail
    },
    handleChangeType() {
      const typeCodeList = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.typeCodeList
      const data = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      if (this.$route.params.type === 'view') {
        return
      }
      if (typeCodeList.length === 2) {
        this.edit.formData.part1.content[13].attrs.disabled = false
        this.edit.formData.part1.content[14].attrs.disabled = false
        this.edit.formData.part1.content[15].attrs.disabled = false
      } else if (typeCodeList.length === 1) {
        if (typeCodeList[0] === '1') {
          this.edit.formData.part1.content[13].attrs.disabled = true
          this.edit.formData.part1.content[14].attrs.disabled = true
          this.edit.formData.part1.content[15].attrs.disabled = false
          data.productType = null
          data.buytradeCode = null
          data.buytradeCodeList = []
        } else if (typeCodeList[0] === '2') {
          this.edit.formData.part1.content[13].attrs.disabled = false
          this.edit.formData.part1.content[14].attrs.disabled = false
          this.edit.formData.part1.content[15].attrs.disabled = true
          data.saletradeCode = null
          data.saletradeCodeList = []
        }
      } else {
        this.edit.formData.part1.content[13].attrs.disabled = false
        this.edit.formData.part1.content[14].attrs.disabled = false
        this.edit.formData.part1.content[15].attrs.disabled = false
      }
    },
    handleChangeCustFullName() {
      const data = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      if (this.edit.type === 'add') {
        data.custHeadline = data.custFullnameChs
      }
    },
    /**
     * 获取操作类型
     */
    getOpType() {
      return this.$route.params.type || this.$route.params.opType
    }
  }
}
</script>
