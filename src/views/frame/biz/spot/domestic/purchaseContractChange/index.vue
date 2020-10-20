<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'domesticPurchaseContractChange',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            contractNo: '',
            supplierCode: '',
            auditStatus: '',
            changePerson: '',
            changeDateFrom: '',
            changeDateTo: ''
          },
          defaultSortString: 'changeDt.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'spot.contractLot.form.changeDate',
            props: ['changeDateFrom', 'changeDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'spot.contractLot.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.supplierCode',
            prop: 'supplierCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'spot.contractLot.form.changeStat',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.changOptEmployeeCode',
            prop: 'optEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          submit: '/api/bpm/processInstance/startApproveProcessByModuleCode',
          search: '/api/contract/domesticPccInfo/list',
          export: '/api/contract/domesticPccInfo/export',
          doDelete: '/api/contract/domesticPccInfo/remove'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param.changeNo
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            $refs: this.$refs,
            routeInfo() {
              return {
                name: 'domPurchaseContractChangeAdd',
                params: {
                  type: 'add',
                  back: this.$refs.qmForm.$route.name
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'domPurchaseContractChangeUpdate',
                params: {
                  type: 'update',
                  changeNo: currentRow.changeNo,
                  back: this.$refs.qmForm.$route.name
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/contract/domesticPccInfo/validatedApi',
                data: row.changeNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.changeNo
            },
            validateApi(row) {
              return {
                url: '/api/contract/domesticPccInfo/validatedApi',
                data: row.changeNo
              }
            }
          },
          {
            name: 'view',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'domPurchaseContractChangeView',
                params: {
                  type: 'view',
                  changeNo: currentRow.changeNo,
                  back: this.$refs.qmForm.$route.name
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              const textValue = this.title + '单据号: ' + currentRow.changeNo
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.changeNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: textValue // 变量值
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
                uk: currentRow.changeNo,
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
                uk: currentRow.changeNo // 变量值
              }
            }
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          },
          {
            name: 'print',
            getParam(currentRow) {
              return {
                changeNo: currentRow.changeNo
              }
            }
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: '',
          mergeProp: 'productDetailList',
          cols: [
            {
              label: 'spot.contractLot.form.changeDt',
              prop: 'changeDt',
              width: '150',
              align: 'center'
            },
            {
              label: 'spot.contractLot.form.changeStat',
              prop: 'auditStatus',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              label: 'spot.contractLot.form.contractNo',
              width: '180',
              prop: 'contractNo'
            },
            {
              label: 'spot.contractLot.form.changOptEmployeeCode',
              width: '90',
              prop: 'optEmployeeName'
            },
            {
              label: 'spot.contractLot.form.tradeType',
              prop: 'tradeType',
              width: '90',
              align: 'center',
              format: {
                dict: this.$t('datadict.tradeType')
              }
            },
            {
              label: 'spot.contractLot.form.contractType',
              prop: 'contractType',
              width: '80',
              align: 'center',
              format: {
                dict: this.$t('datadict.contractType')
              }
            },
            {
              label: 'spot.contractLot.form.headlineNames',
              prop: 'headlineNames',
              width: '300'
            },
            {
              label: 'spot.contractLot.form.supplierNames',
              prop: 'supplierNames',
              width: '210'
            },
            {
              label: 'spot.contractLot.form.signDate',
              width: '90',
              prop: 'signDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.contractLifeStart',
              width: '90',
              prop: 'contractLifeStart',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.contractLifeEnd',
              width: '90',
              prop: 'contractLifeEnd',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.originalAmount',
              prop: 'originalAmount',
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.currency',
              width: '80',
              prop: 'currency',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.contractLot.form.deliveryMarketName',
              width: '90',
              prop: 'deliveryMarketName'
            },
            {
              label: 'spot.contractLot.form.productName',
              width: '180',
              prop: 'productName',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            {
              label: 'spot.contractLot.form.productQuantity',
              width: '120',
              prop: 'productQuantity',
              align: 'right',
              format: {
                func: 'weight'
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.productUnitCode',
              width: '90',
              prop: 'productUnitCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.measurementQuantity',
              width: '120',
              prop: 'measurementQuantity',
              align: 'right',
              format: {
                func: 'weight'
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.measurementUnitCode',
              width: '90',
              prop: 'measurementUnitCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              isSon: true
            },
            // payAmount 付款金额
            {
              label: 'spot.contractLot.form.payAmount',
              width: '120',
              prop: 'payAmount',
              align: 'right',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.contractLot.form.bizEmployeeName',
              width: '90',
              prop: 'bizEmployeeName'
            },
            {
              label: 'spot.contractLot.form.optEmployeeName',
              width: '90',
              prop: 'srcOptEmployeeName'
            },
            {
              label: 'spot.contractLot.form.docMakeDt',
              prop: 'docMakeDt',
              width: '150',
              align: 'center'
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
  },
  methods: {}
}
</script>
