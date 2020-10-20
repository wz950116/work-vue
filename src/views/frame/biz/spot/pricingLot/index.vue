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
  name: 'pricingLot',
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
            pricingLotCode: '',
            contractCode: '',
            productCode: ''
          },
          defaultSortString: 'pricingLotCode.desc'
        },
        formData: [
          {
            label: 'spot.pricingLot.form.pricingLotCode',
            prop: 'pricingLotCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingLot.form.contractCode',
            prop: 'contractCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingLot.form.productName',
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
          search: '/api/pricingLot/list',
          doDelete: '/api/pricingLot/remove',
          cancelAudit: '/api/pricingLot/cancelAudit'
        },
        apiData: {
          search(param) {
            return param
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
                name: 'pricingLotAdd',
                params: {
                  type: 'add',
                  back: 'pricingLot'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'pricingLotUpdate',
                params: {
                  type: 'update',
                  id: currentRow.pricingLotCode,
                  back: 'pricingLot'
                }
              }
            },
            msg: this.$t('spot.pricingLot.validateMsg.update'),
            validateApi(row) {
              return {
                url: '/api/pricingLot/validatedApi',
                data: row.pricingLotCode
              }
            }
          },
          {
            name: 'remove',
            getParam(param) {
              return param.pricingLotCode
            },
            msg: this.$t('spot.pricingLot.validateMsg.remove'),
            validateApi(row) {
              return {
                url: '/api/pricingLot/validatedApi',
                data: row.pricingLotCode
              }
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'pricingLotView',
                params: {
                  type: 'view',
                  id: currentRow.pricingLotCode,
                  back: 'pricingLot'
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
                  value: currentRow.pricingLotCode // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.pricingLotCode // 变量值
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
                uk: currentRow.pricingLotCode,
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
                uk: currentRow.pricingLotCode // 变量值
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
                billNum: currentRow.pricingLotCode
              }
            }
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
              label: 'spot.pricingLot.list.auditStatus',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'spot.pricingLot.list.pricingLotCode',
              width: '140',
              prop: 'pricingLotCode'
            },
            {
              label: 'spot.pricingLot.list.contractCode',
              width: '140',
              prop: 'contractCode'
            },
            {
              label: 'spot.pricingLot.list.purchaseOrSale',
              width: '90',
              align: 'center',
              prop: 'purchaseOrSale',
              format: {
                dict: this.$t('datadict.purchaseOrSale')
              }
            },
            {
              label: 'spot.pricingLot.list.currency',
              width: '80',
              prop: 'currency',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.pricingLot.list.productName',
              width: '120',
              prop: 'productName',
              attrs: {
                data: 'DD_PRODUCT'
              }
            },
            {
              label: 'spot.pricingLot.list.pricingType',
              width: '100',
              prop: 'pricingType',
              align: 'center',
              format: {
                dict: this.$t('datadict.pricingType')
              }
            },
            {
              label: 'spot.pricingLot.list.pricingBenchmark',
              width: '100',
              prop: 'pricingItemName',
              attrs: {
                data: 'DD_PRICE_ITEM'
              }
            },
            {
              label: 'spot.pricingLot.list.pricingTimeStart',
              width: '100',
              align: 'center',
              prop: 'pricingTimeStart',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingLot.list.pricingTimeEnd',
              width: '100',
              align: 'center',
              prop: 'pricingTimeEnd',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingLot.list.pricingQuantity',
              width: '120',
              align: 'right',
              prop: 'pricingQuantity',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.pricingLot.list.valueUnit',
              width: '80',
              align: 'center',
              prop: 'valueUnit',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.pricingLot.list.premium',
              width: '100',
              prop: 'premium',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.pricingLot.list.docMaker',
              width: '80',
              prop: 'docMaker'
            },
            {
              label: 'spot.pricingLot.list.docMakeDate',
              width: '100',
              align: 'center',
              prop: 'docMakeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingLot.list.note',
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
