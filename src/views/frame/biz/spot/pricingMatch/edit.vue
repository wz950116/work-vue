<template>
  <qm-edit ref='edit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'pricingMatchUpdate',
  data() {
    return {
      edit: {
        changeFlag: false,
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/pricingMatch/listMatchProduct'
        },
        apiData: {
          view(param) {
            return param.row
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
            event: this.save,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spot.pricingMatch.group.editPart1',
            content: [
              {
                label: 'spot.pricingMatch.form.contractCode',
                prop: 'contractCode',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingMatch.form.lotCode',
                prop: 'lotNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingMatch.form.purchaseOrSale',
                prop: 'purchaseOrSale',
                element: 'base-select',
                list: this.$t('datadict.purchaseOrSale'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingMatch.form.tradeType',
                width: '90',
                prop: 'tradeType',
                element: 'base-select',
                list: this.$t('datadict.tradeType'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingMatch.form.companyName',
                width: '180',
                element: 'input-validate',
                prop: 'headlineNames',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingMatch.form.merchants',
                width: '180',
                element: 'input-validate',
                prop: 'merchantNames',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingMatch.form.signDate',
                width: '120',
                prop: 'signDate',
                format: {
                  dict: 'yyyy-MM-dd',
                  func: 'dateFormat'
                },
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingMatch.form.bizDeptName',
                width: '90',
                prop: 'bizDeptName',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'spot.pricingMatch.form.bizEmployeeName',
                width: '90',
                prop: 'bizEmployeeName',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'spot.pricingMatch.form.lotLife',
                props: ['lotLifeStart', 'lotLifeEnd'],
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'spot.pricingMatch.form.matchPoint',
                width: '90',
                prop: 'matchPoint',
                element: 'base-select',
                list: this.$t('datadict.pricingMatchPoint'),
                attrs: {
                  disabled: true,
                  clearable: true
                }
              }
            ]
          }
        },
        tables: [
          {
            isShow: ['add'],
            name: 'pricingMatchProductList',
            label: 'spot.pricingMatch.group.editPart2',
            component: () => import('../components/pricingMatchProductTag.vue')
          },
          {
            isShow: ['add'],
            name: 'pricingMatchInfoList',
            label: 'spot.pricingMatch.group.editPart3',
            component: () => import('../components/pricingMatchInfoTag.vue')
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
  mounted() {
    setTimeout(() => {
      this.$refs.edit.$refs.qmRouteEdit.editForm = this.edit.param.row
    }, 300)
  },
  methods: {
    save() {
      const tableData = this.$refs.edit.$refs.qmRouteEdit.$children[3].$refs.tab.tableData
      if (tableData && tableData.length > 0) {
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i].matchQuantity && tableData[i].matchQuantity > tableData[i].validQuantity) {
            this.$notify(notifyError({ msg: this.$t('spot.pricingMatch.msg.matchQuantityError') }))
            return false
          }
        }

        const currResidualQuantity = this.refrashResidualQuantity()

        if (currResidualQuantity && currResidualQuantity > 0) {
          this.$notify(notifyError({ msg: this.$t('spot.pricingMatch.msg.refrashResidualUnfinish') }))
          return false
        } else if (currResidualQuantity && currResidualQuantity < 0) {
          this.$notify(notifyError({ msg: this.$t('spot.pricingMatch.msg.refrashResidualError') }))
          return false
        } else if (currResidualQuantity === 0) {
          request({
            url: '/api/pricingMatch/savelist',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.save'),
              data: tableData
            }
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: this.$t('biz.msg.saveSuccess') }))
              this.edit.changeFlag = false
              return true
            })
            .catch(() => {
              this.$notify(notifyError({ msg: this.$t('biz.msg.saveFailed') }))
              return false
            })
        } else {
          this.$notify(notifyError({ msg: this.$t('spot.pricingMatch.msg.noPricingInfo') }))
        }
      } else {
        this.$notify(notifyError({ msg: this.$t('spot.pricingMatch.msg.noPricingInfo') }))
      }
    },
    refrashResidualQuantity() {
      const tableData = this.$refs.edit.$refs.qmRouteEdit.$children[3].$refs.tab.tableData
      let total = 0
      if (tableData && tableData.length > 0) {
        for (let i = 0; i < tableData.length; i++) {
          total += Number(tableData[i].matchQuantity)
        }
      }
      const currentRow = this.$refs.edit.$refs.qmRouteEdit.$children[2].$refs.tab.currentRow
      currentRow.residualQuantity = currentRow.measurementQuantity - total
      return currentRow.residualQuantity
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: { ...(!!param && { refresh: !!param }) }
        })
      })
    }
  }
}
</script>
