<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'pricingReg',
  data() {
    return {
      form: {
        moduleCode: this.$route.meta.bpmModule,
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            pricingCode: '',
            contractCode: '',
            pricingLotCode: '',
            productCode: ''
          },
          defaultSortString: 'pricingCode.desc'
        },
        formData: [
          {
            label: 'spot.pricingReg.form.pricingCode',
            prop: 'pricingCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingReg.form.contractCode',
            prop: 'contractCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingReg.form.pricingLotCode',
            prop: 'pricingLotCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingReg.form.productName',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/pricingInfo/list',
          doDelete: '/api/pricingInfo/remove',
          cancelAudit: '/api/pricingInfo/cancelAudit'
        },
        apiData: {
          search(param) {
            return param.id
          },
          doDelete(param) {
            return param.id
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'pricingRegAdd',
                params: {
                  type: 'add',
                  back: 'pricingReg'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'pricingRegUpdate',
                params: {
                  type: 'update',
                  id: currentRow.pricingCode,
                  back: 'pricingReg'
                }
              }
            },
            msg: this.$t('spot.pricingLot.validateMsg.update'),
            validateApi(row) {
              return {
                url: '/api/pricingInfo/validatedApi',
                data: row.pricingCode
              }
            }
          },
          {
            name: 'remove',
            getParam(param) {
              return param.pricingCode
            },
            msg: this.$t('spot.pricingLot.validateMsg.remove'),
            validateApi(row) {
              return {
                url: '/api/pricingInfo/validatedApi',
                data: row.pricingCode
              }
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'pricingRegView',
                params: {
                  type: 'view',
                  id: currentRow.pricingCode,
                  back: 'pricingReg'
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.pricingCode // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.pricingCode // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.pricingCode,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.pricingCode // 变量值
              }
            }
          },
          {
            name: 'cancelAudit',
            msg: this.$t('biz.msg.disableCancelAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            getParam(currentRow) {
              return {
                billNum: currentRow.pricingCode
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],

        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'auditStatus',
              width: '100',
              align: 'center',
              label: 'spot.pricingReg.list.auditStatus',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'spot.pricingReg.list.pricingCode',
              width: '140',
              prop: 'pricingCode'
            },
            {
              label: 'spot.pricingReg.list.contractCode',
              width: '140',
              prop: 'contractCode'
            },
            {
              label: 'spot.pricingReg.list.pricingLotCode',
              width: '140',
              prop: 'pricingLotCode'
            },
            {
              label: 'spot.pricingReg.list.purchaseOrSale',
              width: '100',
              align: 'center',
              prop: 'purchaseOrSale',
              format: {
                dict: this.$t('datadict.purchaseOrSale')
              }
            },
            {
              label: 'spot.pricingReg.list.currency',
              width: '80',
              align: 'center',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.pricingReg.list.productName',
              width: '120',
              prop: 'productName'
            },
            {
              label: 'spot.pricingReg.list.pricingType',
              width: '100',
              align: 'center',
              prop: 'pricingType',
              format: {
                dict: this.$t('datadict.pricingType')
              }
            },
            {
              label: 'spot.pricingReg.list.pricingBenchmark',
              width: '120',
              prop: 'pricingItemName'
            },
            {
              label: 'spot.pricingReg.list.pricingTime',
              width: '100',
              align: 'center',
              prop: 'pricingTime',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingReg.list.pricingQuantity',
              width: '100',
              align: 'right',
              prop: 'pricingQuantity',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.pricingReg.list.valueUnit',
              width: '80',
              align: 'center',
              prop: 'valueUnit',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.pricingReg.list.price',
              width: '100',
              align: 'right',
              prop: 'price',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.pricingReg.list.docMaker',
              width: '100',
              prop: 'docMaker'
            },
            {
              label: 'spot.pricingReg.list.docMakeDate',
              width: '100',
              align: 'center',
              prop: 'docMakeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingReg.list.note',
              width: '200',
              prop: 'note'
            }
          ]
        },

        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  }
}
</script>
