<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
import { notifySuccess } from '@/utils/frame/base/notifyParams'

// axios访问
import request from '@/utils/frame/base/request'
export default {
  name: 'cargoRightTransfer',
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
            billNo: '',
            billDate: '',
            rightTransferDate: '',
            productCode: '',
            rightFlag: '0',
            bizEmployeeCode: '',
            lotNo: ''
          },
          defaultSortString: 'billDate.desc'
        },
        formData: [
          {
            label: 'storage.cargoRightTransfer.form.billNo',
            prop: 'billNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.cargoRightTransfer.form.billDate',
            props: ['billStartDate', 'billEndDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            type: 'date',
            label: 'storage.cargoRightTransfer.form.rightTransferDate',
            props: ['rightTransferStartDate', 'rightTransferEndDate'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: []
          },
          {
            label: 'storage.cargoRightTransfer.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.cargoRightTransfer.form.rightFlag',
            prop: 'rightFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'storage.cargoRightTransfer.form.bizEmployeeCode',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_STAFF',
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/warehouse/whLadingBillProduct/pageRight',
          transfer: '/api/warehouse/whLadingBillProduct/updateRightFlg'
        },
        apiData: {
          search(param) {
            return param.code
          },
          doDelete(param) {
            return param.code
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'transfer',
            iconName: '线性-货权转移',
            i18n: 'biz.btn.transfer',
            event: this.getTransfer
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
              prop: 'billNo',
              width: '200',
              align: 'left',
              label: 'storage.cargoRightTransfer.list.billNo'
            },
            {
              prop: 'billType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.bizCode')
              },
              label: 'storage.cargoRightTransfer.list.billType'
            },
            {
              prop: 'billDate',
              width: '100',
              align: 'center',
              label: 'storage.cargoRightTransfer.list.billDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'rightFlag',
              width: '140',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              },
              label: 'storage.cargoRightTransfer.list.rightFlag'
            },
            {
              prop: 'rightTransferDate',
              width: '140',
              align: 'center',
              label: 'storage.cargoRightTransfer.list.rightTransferDate',
              format: {
                func: 'dateFormat',
                dict: 'YYYY-MM-DD'
              }
            },
            {
              prop: 'productName',
              width: '100',
              label: 'storage.cargoRightTransfer.list.productName'
            },
            {
              prop: 'brand',
              width: '120',
              label: 'storage.ladingBill.list.brand',
              isSon: true
            },
            {
              prop: 'spec',
              width: '120',
              label: 'storage.ladingBill.list.spec',
              isSon: true
            },
            {
              prop: 'origin',
              width: '120',
              label: 'storage.ladingBill.list.origin',
              isSon: true
            },
            {
              prop: 'itemCount',
              width: '120',
              label: 'storage.cargoRightTransfer.list.itemCount',
              format: {
                func: 'thousands',
                dict: 0
              }
            },
            {
              prop: 'measurementQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 3
              },
              label: 'storage.ladingBill.list.measurementQuantity'
            },
            {
              prop: 'measurementUnitCode',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              label: 'storage.ladingBill.list.measurementUnitName'
            },
            {
              prop: 'goodsQuantity',
              width: '120',
              align: 'right',
              format: {
                func: 'thousands',
                dict: 3
              },
              label: 'storage.ladingBill.list.ladingQuantity'
            },
            {
              prop: 'productUnitCode',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              label: 'storage.ladingBill.list.productUnitName'
            },
            {
              prop: 'bizEmployeeName',
              width: '120',
              align: 'center',
              label: 'storage.ladingBill.list.bizEmployeeName'
            },
            {
              prop: 'optEmployeeName',
              width: '120',
              align: 'center',
              label: 'storage.ladingBill.list.optEmployeeName'
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
  methods: {
    // 货权转移
    getTransfer() {
      const row = this.$refs.qmTable.currentRow
      if (row) {
        const msg = this.$t('biz.msg.confirmEnable')
        this.$confirm(msg, this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            this.loading = true
            const postData = row
            request({
              url: '/api/warehouse/whLadingBillProduct/updateRightFlg',
              method: 'POST',
              data: {
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.transfer'),
                data: postData
              }
            })
              .then(response => {
                this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
                this.loading = false
                this.refresh()
              })
              .catch(ex => {
                this.loading = false
                console.log(ex)
              })
          })
          .catch(ex => {
            console.log(ex)
          })
      }
    }
  }
}
</script>
