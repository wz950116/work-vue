<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
export default {
  name: 'domesticSalesLotHistory',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            lotNo: this.$route.params.lotNo,
            histroyFlag: '1'
          },
          defaultSortString: 'id.asc'
        },
        formData: [
          {
            label: 'spot.contractLot.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            default: this.$route.params.lotNo,
            attrs: {
              disabled: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/domesticContract/slcInfo/list'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        isTopBar: true,
        initSearch: true,
        topBar: [
          {
            name: 'view',
            type: 'route',
            $refs: this.$refs,
            routeInfo() {
              const row = this.$refs.qmTable.currentRow
              return {
                name: 'domesticSalesLotChangeView',
                params: {
                  type: 'view',
                  changeNo: row.changeNo,
                  back: this.$refs.qmForm.$route.name,
                  backParam: this.$refs.qmForm.$route.params
                }
              }
            },
            param() {
              return this.$refs.qmTable.currentRow
            }
          },
          {
            name: 'attachment',
            iconName: '线性-附件',
            i18n: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.changeNo,
                billType: this.$route.meta.bizCode
              }
            },
            event: 'attachment'
          },
          {
            name: 'refresh',
            $refs: this.$refs,
            validate() {}
          }
        ],
        isColset: true,
        table: {
          id: '',
          cols: [
            {
              label: 'spot.contractLot.form.changeDt',
              prop: 'changeDt',
              width: '150',
              align: 'center'
            },
            {
              label: 'spot.contractLot.form.contractNo',
              width: '180',
              prop: 'contractNo'
            },
            {
              label: 'spot.contractLot.form.lotNo',
              width: '180',
              prop: 'lotNo'
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
              label: 'spot.contractLot.form.headlineNames',
              width: '300',
              prop: 'headlineNames'
            },
            {
              label: 'spot.contractLot.form.customerNames',
              width: '210',
              prop: 'customerNames'
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
              label: 'spot.contractLot.form.lotLifeStart',
              width: '90',
              prop: 'lotLifeStart',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.lotLifeEnd',
              width: '90',
              prop: 'lotLifeEnd',
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
              width: '180',
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
  }
}
</script>
