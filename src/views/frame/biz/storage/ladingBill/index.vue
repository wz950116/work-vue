<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData">
        <template slot="moreCheckbox">
          <el-checkbox size="mini"></el-checkbox>
        </template>
      </qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ladingBill',
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
            ladingBillNo: '',
            ladingDate: '',
            bizEmployeeCode: '',
            preBillNo: '',
            supplierCode: '',
            deliverCode: '',
            productCodeList: []
          },
          defaultSortString: 'ladingDate.desc,ladingBillNo.desc',
          camelToUnderlineFlg: true
        },
        formData: [
          {
            type: 'date',
            label: 'storage.ladingBill.form.ladingDate',
            props: ['ladingStartDate', 'ladingEndDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.ladingBill.form.ladingBillNo',
            prop: 'ladingBillNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.ladingBill.list.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.ladingBill.form.productCode',
            prop: 'productCodeList',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              clearable: true,
              multiple: true
            },
            default: []
          },
          {
            label: 'storage.ladingBill.form.preBIllNo',
            prop: 'preBIllNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.ladingBill.form.supplierCode',
            prop: 'supplierCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'storage.ladingBill.form.deliverCode',
            prop: 'deliverCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                auditStatus: '3'
              },
              filterable: true,
              clearable: true
            },
            isShow: false
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              filterable: true,
              data: 'FUNC_ORG',
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizDeptName',
            prop: 'bizDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizEmployeeName',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.optName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/warehouse/whLadingBill/page',
          export: '/api/warehouse/whLadingBill/export',
          doDelete: '/api/warehouse/whLadingBill/remove',
          cancelAudit: '/api/warehouse/whLadingBill/cancelAudit'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'ladingBillAdd',
                params: {
                  type: 'add',
                  back: 'ladingBill'
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'ladingBillUpdate',
                params: {
                  type: 'update',
                  id: currentRow.ladingBillNo,
                  back: 'ladingBill'
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/warehouse/whLadingBill/validatedApi',
                data: row.ladingBillNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.ladingBillNo
            }
          },
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'ladingBillView',
                params: {
                  type: 'view',
                  id: currentRow.ladingBillNo,
                  back: 'ladingBill'
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
                  value: currentRow.ladingBillNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: this.title + '单据号: ' + currentRow.ladingBillNo // 变量值
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
                uk: currentRow.ladingBillNo,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            $refs: this.$refs,
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                uk: currentRow.ladingBillNo // 变量值
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
                billNum: currentRow.ladingBillNo
              }
            }
          },
          {
            name: 'export',
            getParam() {
              return {
                autoWidth: true
              }
            }
          },
          //list 打印
          {
            name: 'print',
            getParam(currentRow) {
              return {
                ladingBillNo: currentRow.ladingBillNo
              }
            }
          },
          {
            name: 'refresh'
          },
          {
            name: 'selectBill',
            type: 'route',
            $route: this.$route,
            routeInfo(currentRow) {
              return {
                name: 'jointSearch',
                params: {
                  billNo: currentRow.ladingBillNo,
                  billType: this.$route.meta.bizCode,
                  back: this.$route.name
                }
              }
            }
          },
          {
            msg: this.$t('storage.ladingBill.msg.inNotice'),
            name: 'next',
            permitName: ['inNotice'],
            type: 'route',
            i18n: 'storage.ladingBill.btn.inNotice',
            validate(currentRow) {
              return currentRow.auditStatus === '3'
            },
            routeInfo(currentRow) {
              return {
                name: 'inNoticeAdd',
                params: {
                  type: 'add',
                  preBillNo: currentRow.ladingBillNo,
                  preBillType: 'WH_LADING_BILL',
                  back: 'ladingBill'
                }
              }
            }
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title + '_index',
          mergeProp: 'whLadingBillProductDtoList',
          sortable: 'custom',
          showCheckbox: true,
          cols: [
            {
              prop: 'auditStatus',
              width: '80',
              label: 'storage.ladingBill.list.auditStatus',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'ladingBillNo',
              width: '180',
              align: 'left',
              label: 'storage.ladingBill.list.ladingBillNo'
            },
            {
              prop: 'ladingDate',
              width: '120',
              align: 'center',
              format: {
                func: 'dateFormat'
              },
              label: 'storage.ladingBill.list.ladingDate'
            },
            {
              prop: 'ladingType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.ladingType')
              },
              label: 'storage.ladingBill.list.ladingType'
            },
            {
              prop: 'preBillType',
              align: 'center',
              width: '120',
              format: {
                dict: this.$t('datadict.bizCode')
              },
              label: 'storage.ladingBill.list.preBIllType'
            },
            {
              prop: 'preBillNo',
              width: '180',
              align: 'left',
              label: 'storage.ladingBill.list.preBIllNo'
            },
            {
              prop: 'supplierName',
              width: '180',
              align: 'left',
              label: 'storage.ladingBill.list.supplierName'
            },
            {
              prop: 'deliverName',
              width: '180',
              align: 'left',
              label: 'storage.ladingBill.list.deliverName',
              isShow: false
            },
            {
              prop: 'productName',
              width: '100',
              align: 'left',
              label: 'storage.ladingBill.list.productName',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            {
              prop: 'rightFlag',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'storage.ladingBill.list.rightFlag',
              isSon: true
            },
            {
              prop: 'itemCount',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.ladingBill.list.itemCount',
              isSon: true
            },
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.ladingBill.list.measurementQuantity',
              isSon: true
            },
            {
              prop: 'measurementUnitCode',
              width: '60',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'storage.ladingBill.list.measurementUnitName',
              isSon: true
            },
            {
              prop: 'ladingQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'weight'
              },
              label: 'storage.ladingBill.list.ladingQuantity',
              isSon: true
            },
            {
              prop: 'productUnitCode',
              width: '60',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'storage.ladingBill.list.productUnitName',
              isSon: true
            },
            {
              prop: 'bizOrganName',
              width: '90',
              align: 'center',
              label: 'biz.lbl.bizOrganName'
            },
            {
              prop: 'bizDeptName',
              width: '90',
              align: 'center',
              label: 'biz.lbl.bizDeptName'
            },
            {
              prop: 'bizEmployeeName',
              width: '90',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            {
              prop: 'optEmployeeName',
              width: '90',
              align: 'center',
              label: 'biz.lbl.optName'
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
