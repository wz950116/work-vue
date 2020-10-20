<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
// 调用Vue全局过滤器
export default {
  name: 'pricingConfirm',
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
            pricingCode: '',
            contractCode: '',
            productCode: '',
            confirmStatus: '0'
          },
          defaultSortString: 'pricingCode.desc'
        },
        formData: [
          {
            label: 'spot.pricingConfirm.form.pricingCode',
            prop: 'pricingCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingConfirm.form.contractCode',
            prop: 'contractCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingConfirm.form.productName',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'spot.pricingConfirm.form.confirmStatus',
            prop: 'confirmStatus',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/pricingInfo/listForConfirm',
          confirmCheck: '/api/pricingInfo/confirmCheck',
          doDelete: '/api/pricingInfo/remove'
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
            name: 'confirm',
            permitName: ['confirmCheck'],
            iconName: '线性-确认',
            i18n: 'biz.btn.confirmCheck',
            type: 'route',
            routeInfo() {
              return {
                name: 'pricingConfirmUpdate',
                params: {
                  type: 'update',
                  id: this.$refs.qmTable.currentRow.pricingCode,
                  back: 'pricingConfirm'
                }
              }
            },
            event: this.doConfirm,
            $refs: this.$refs,
            param() {}
          },
          {
            name: 'view',
            type: 'route',
            routeInfo() {
              return {
                name: 'pricingConfirmView',
                params: {
                  type: 'view',
                  id: this.$refs.qmTable.currentRow.pricingCode,
                  back: 'pricingConfirm'
                }
              }
            },
            $refs: this.$refs,
            param() {}
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
              label: 'spot.pricingConfirm.list.confirmStatus',
              width: '100',
              align: 'center',
              prop: 'confirmStatus',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              label: 'spot.pricingConfirm.list.pricingCode',
              width: '180',
              prop: 'pricingCode'
            },
            {
              label: 'spot.pricingConfirm.list.contractCode',
              width: '180',
              prop: 'contractCode'
            },
            {
              label: 'spot.pricingConfirm.list.purchaseOrSale',
              width: '100',
              align: 'center',
              prop: 'purchaseOrSale',
              format: {
                dict: this.$t('datadict.purchaseOrSale')
              }
            },
            {
              label: 'spot.pricingConfirm.list.currency',
              width: '80',
              align: 'center',
              prop: 'currency',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.pricingConfirm.list.productName',
              width: '120',
              prop: 'productName'
            },
            {
              label: 'spot.pricingConfirm.list.pricingType',
              width: '100',
              align: 'center',
              prop: 'pricingType',
              format: {
                dict: this.$t('datadict.pricingType')
              }
            },
            {
              label: 'spot.pricingConfirm.list.pricingBenchmark',
              width: '120',
              prop: 'pricingItemName'
            },
            {
              label: 'spot.pricingConfirm.list.pricingTime',
              width: '100',
              align: 'center',
              prop: 'pricingTime',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingConfirm.list.pricingQuantity',
              width: '100',
              align: 'right',
              prop: 'pricingQuantity',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.pricingConfirm.list.confirmQuantity',
              width: '100',
              align: 'right',
              prop: 'confirmQuantity',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.pricingConfirm.list.valueUnit',
              width: '80',
              align: 'center',
              prop: 'valueUnit',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            {
              label: 'spot.pricingConfirm.list.price',
              width: '100',
              align: 'right',
              prop: 'price',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.pricingConfirm.list.confirmPrice',
              width: '100',
              align: 'right',
              prop: 'confirmPrice',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.pricingConfirm.list.note',
              width: '120',
              prop: 'note'
            },
            {
              label: 'spot.pricingConfirm.list.confirmNote',
              width: '120',
              prop: 'confirmNote'
            },
            {
              label: 'spot.pricingConfirm.list.docMaker',
              width: '80',
              prop: 'docMaker'
            },
            {
              label: 'spot.pricingConfirm.list.docMakeDate',
              width: '100',
              align: 'center',
              prop: 'docMakeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
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
    // 更新
    doConfirm() {
      if (!this.$refs.qmTable.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (this.$refs.qmTable.currentRow.confirmStatus === '1') {
        this.$notify(
          notifyInfo({
            msg: '已确认的定价记录不能再次确认'
          })
        )
        return
      }
      if (this.$refs.qmTable.currentRow.pricingType === '3') {
        request({
          url: this.mainData.api.confirmCheck,
          method: 'POST',
          data: {
            data: this.$refs.qmTable.currentRow,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.enable')
          }
        })
          .then(response => {
            if (response.data === false) {
              this.$notify(
                notifyInfo({
                  msg: '均价记录必须要在定价期结束后才能确认'
                })
              )
            } else {
              this.$router.push({
                name: 'pricingConfirmUpdate',
                params: {
                  type: 'update',
                  id: this.$refs.qmTable.currentRow.pricingCode,
                  back: 'pricingConfirm'
                }
              })
            }
          })
          .catch(() => {})
      } else {
        this.$router.push({
          name: 'pricingConfirmUpdate',
          params: {
            type: 'update',
            id: this.$refs.qmTable.currentRow.pricingCode,
            back: 'pricingConfirm'
          }
        })
      }
    }
  }
}
</script>
