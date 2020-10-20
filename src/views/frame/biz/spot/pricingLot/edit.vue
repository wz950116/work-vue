<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @closeLv2Dialog='hanldeCloseSelectDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import Vue from 'vue'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'pricingLotEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,

        api: {
          view: '/api/pricingLot/getByCode',
          save: '/api/pricingLot/save',
          update: '/api/pricingLot/update'
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
            name: 'biz.btn.pricingRuleSelect',
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
            titleName: 'spot.pricingLot.group.editPart1',
            content: [
              {
                label: 'spot.pricingLot.form.pricingLotCode',
                prop: 'pricingLotCode',
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
                label: 'spot.pricingLot.form.contractCode',
                prop: 'contractCode',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingLot.form.purchaseOrSale',
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
                  clearable: true
                }
              },
              {
                label: 'spot.pricingLot.form.currency',
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
                  clearable: true
                }
              },
              {
                label: 'spot.pricingLot.form.productName',
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
                  clearable: true
                },
                event: {
                  changeAll: this.changeProductCode
                }
              },
              {
                label: 'spot.pricingLot.form.pricingType',
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
                },
                default: '2'
              },
              {
                label: 'spot.pricingLot.form.pricingBenchmark',
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
                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'spot.pricingLot.form.pricingTime',
                props: ['pricingTimeStart', 'pricingTimeEnd'],
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
                label: 'spot.pricingLot.form.pricingQuantity',
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
                label: 'spot.pricingLot.form.premium',
                prop: 'premium',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'price'
                }
              },
              {},
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
                default: toolUtil.todayStr(),
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.pricingLot.form.note',
                prop: 'note',
                element: 'input-validate',
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
      Vue.component('view-form-edit', () => import('./ruleSelect.vue'))
      this.$refs.qmEdit.$refs.qmRouteEdit.dialogLv2Visible = true
    },
    // 增行打开弹窗设置默认查询条件
    doAdd() {
      // this.$refs.tab.$refs.viewFormTab.$refs.qmDialogTable.listQuery.usingFlag = this.editForm.usingFlag
    },
    changeProductCode(param) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      if (param) {
        if (param.data) {
          editForm.valueUnit = param.data.measurementUnitCode
        } else {
          editForm.valueUnit = null
        }
      } else {
        editForm.valueUnit = null
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
    hanldeCloseSelectDialog(param) {
      if (param) {
        param.id = ''
        param.tenantCode = null
        param.pricingQuantity = param.rmnMemQty
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm = param

        this.edit.formData.part1.content[2].attrs.disabled = true
        this.edit.formData.part1.content[3].attrs.disabled = true
        this.edit.formData.part1.content[4].attrs.disabled = true
        this.edit.formData.part1.content[5].attrs.disabled = true
        this.edit.formData.part1.content[6].attrs.disabled = true
      }
    },
    handleInitCallback(val) {
      if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.contractCode != '') {
        this.edit.formData.part1.content[2].attrs.disabled = true
        this.edit.formData.part1.content[3].attrs.disabled = true
        this.edit.formData.part1.content[4].attrs.disabled = true
        this.edit.formData.part1.content[5].attrs.disabled = true
        this.edit.formData.part1.content[6].attrs.disabled = true
      }
    }
  }
}
</script>
