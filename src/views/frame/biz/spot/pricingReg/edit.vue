<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @closeLv2Dialog='hanldeCloseSelectDialog'></qm-edit>
</template>

<script>
import Vue from 'vue'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'pricingRegEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/pricingInfo/getByCode',
          save: '/api/pricingInfo/save',
          update: '/api/pricingInfo/update'
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
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核',
            name: 'biz.btn.audit',
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
            name: 'biz.btn.pricingLotSelect',
            type: 'dialog',
            iconName: '线性-增行',
            getParam() {
              return {}
            },
            isShow: ['add'],
            event: this.dialogEvent,
            validate: this.validateAdd,
            setDefault: this.doAdd
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spot.pricingReg.group.editPart1',
            content: [
              {
                label: 'spot.pricingReg.form.pricingCode',
                prop: 'pricingCode',
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
                label: 'spot.pricingReg.form.contractCode',
                prop: 'contractCode',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingReg.form.pricingLotCode',
                prop: 'pricingLotCode',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingReg.form.purchaseOrSale',
                prop: 'purchaseOrSale',
                element: 'base-select',
                list: this.$t('datadict.purchaseOrSale'),
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
              {
                label: 'spot.pricingReg.form.currency',
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
              {
                label: 'spot.pricingReg.form.productName',
                prop: 'productCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRODUCT',
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingReg.form.pricingType',
                prop: 'pricingType',
                element: 'base-select',
                list: this.$t('datadict.pricingType'),
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
              {
                label: 'spot.pricingReg.form.pricingBenchmark',
                prop: 'pricingBenchmark',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRICE_ITEM',
                  disabled: true,
                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'spot.pricingReg.form.pricingTime',
                prop: 'pricingTime',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'spot.pricingReg.form.pricingQuantity',
                prop: 'pricingQuantity',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'weight'
                }
              },
              {
                label: 'spot.pricingLot.form.valueUnit',
                prop: 'valueUnit',
                element: 'base-select',
                list: this.$t('datadict.measurementUnit'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingReg.form.price',
                prop: 'price',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  min: 0,
                  max: 999999999999.999,
                  type: 'money'
                }
              },
              {
                label: 'biz.lbl.optName',
                prop: 'docMaker',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'biz.lbl.optDate',
                prop: 'docMakeDate',
                default: toolUtil.todayYYYYMMDD(),
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'spot.pricingReg.form.note',
                prop: 'note',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  maxlength: 500,
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
    // 增行按钮做相应验证
    validateAdd() {
      return true
    },
    dialogEvent() {
      Vue.component('view-form-edit', () => import('./lotSelect.vue'))
      this.$refs.qmEdit.$refs.qmRouteEdit.dialogLv2Visible = true
    },
    // 增行打开弹窗设置默认查询条件
    doAdd() {
      // this.$refs.tab.$refs.viewFormTab.$refs.qmDialogTable.listQuery.usingFlag = this.editForm.usingFlag
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: Object.assign({}, this.$route.params.backParam, { refresh: !!param })
        })
      })
    },
    hanldeCloseSelectDialog(param) {
      if (param) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['pricingQuantity'] = param.rmnMemQty
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['contractCode'] = param.contractCode
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['pricingLotCode'] = param.pricingLotCode
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['purchaseOrSale'] = param.purchaseOrSale
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['currency'] = param.currency
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['productCode'] = param.productCode
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['pricingType'] = param.pricingType
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['pricingBenchmark'] = param.pricingBenchmark
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm['valueUnit'] = param.valueUnit
      }
    }
  }
}
</script>
