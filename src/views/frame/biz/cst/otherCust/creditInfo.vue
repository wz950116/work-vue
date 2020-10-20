<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  name: 'warehoueCompany',
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType,
        param: this.$route.params,
        api: {
          search: '/api/cust/credit/listWh'
        },
        apiData: {
          search(param) {
            return { custCode: param.uk || param.id }
          }
        },
        table: {
          height: 200,
          cols: [
            {
              width: 220,
              label: 'cst.warehoueCompany.list.status',
              prop: 'auditStatus',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.custName',
              prop: 'custName'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.warehouseName',
              prop: 'warehouseName'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.areaCode',
              prop: 'areaCode'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.warehouseType',
              prop: 'warehouseType',
              align: 'center',
              format: {
                dict: this.$t('datadict.warehouseType')
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.warehouseLevel',
              prop: 'warehouseLevel',
              align: 'center',
              format: {
                dict: this.$t('datadict.warehouseLevel')
              }
            },
            {
              width: 80,
              label: 'biz.lbl.usingFlag',
              prop: 'usingFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.contact',
              prop: 'contact'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.tel',
              prop: 'tel'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.mail',
              prop: 'mail'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.address',
              prop: 'address'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.remark',
              prop: 'remark'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.warehouseValue',
              prop: 'warehouseValue',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.warningValue',
              prop: 'warningValue',
              format: {
                func: 'thousands',
                dict: 2
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.currency',
              prop: 'currency',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.warehouseVolume',
              prop: 'warehouseVolume',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.warningVolume',
              prop: 'warningVolume',
              format: {
                func: 'thousands',
                dict: 3
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.startDate',
              prop: 'startDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.endDate',
              prop: 'endDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.creditDays',
              prop: 'creditDays',
              format: {
                func: 'thousands',
                dict: 0
              }
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.unit',
              prop: 'unit'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.applyDepart',
              prop: 'applyDepart'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.applicant',
              prop: 'optEmployeeName'
            },
            {
              width: 220,
              label: 'cst.warehoueCompany.list.applicantTime',
              prop: 'applyDt',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  }
}
</script>
