<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
// 调用Vue全局过滤器
import Vue from 'vue'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'pricingMatch',
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
            contractNo: '',
            lotNo: '',
            purchaseOrSale: '',
            merchantCode: '',
            bizEmployeeCode: '',
            signDate: ''
          },
          defaultSortString: 'contractNo.asc'
        },
        formData: [
          {
            type: 'date',
            label: 'spot.pricingMatch.form.signDate',
            props: ['signDateStart', 'signDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'spot.pricingMatch.form.contractCode',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingMatch.form.lotCode',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingMatch.form.purchaseOrSale',
            prop: 'purchaseOrSale',
            element: 'base-select',
            list: this.$t('datadict.purchaseOrSale'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.pricingMatch.form.merchants',
            prop: 'merchantCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '12',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'spot.pricingMatch.form.bizEmployeeName',
            prop: 'bizEmployeeCode',
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
          search: '/api/pricingMatch/listMatchLot'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'match',
            i18n: 'spot.pricingMatch.list.match',
            iconName: '线性-修改',
            type: 'route',
            routeInfo() {},
            $refs: this.$refs,
            event: this.doMatch,
            param() {
              return this.$refs.qmTable.currentRow
            }
          },
          {
            name: 'matchSet',
            i18n: 'spot.pricingMatch.list.matchSet',
            iconName: '线性-设置',
            type: 'dialog',
            $refs: this.$refs,
            event: this.doSet,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/biz/spot/pricingMatch/matchSet.vue')
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
          mergeProp: 'productDetailList',
          cols: [
            {
              label: 'spot.pricingMatch.list.signDate',
              width: '100',
              align: 'center',
              prop: 'signDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingMatch.list.contractCode',
              width: '180',
              prop: 'contractNo'
            },
            {
              label: 'spot.pricingMatch.list.lotCode',
              width: '180',
              prop: 'lotNo'
            },
            {
              label: 'spot.pricingMatch.list.purchaseOrSale',
              width: '100',
              align: 'center',
              prop: 'purchaseOrSale',
              format: {
                dict: this.$t('datadict.purchaseOrSale')
              }
            },
            {
              label: 'spot.pricingMatch.list.tradeType',
              width: '100',
              align: 'center',
              prop: 'tradeType',
              format: {
                dict: this.$t('datadict.tradeType')
              }
            },
            {
              label: 'spot.pricingMatch.list.companyName',
              width: '180',
              prop: 'headlineNames'
            },
            {
              label: 'spot.pricingMatch.list.merchants',
              width: '180',
              prop: 'merchantNames'
            },
            {
              label: 'spot.pricingMatch.list.lotLifeStart',
              width: '100',
              align: 'center',
              prop: 'lotLifeStart',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingMatch.list.lotLifeEnd',
              width: '100',
              align: 'center',
              prop: 'lotLifeEnd',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.pricingMatch.list.bizDeptName',
              width: '100',
              prop: 'bizDeptName'
            },
            {
              label: 'spot.pricingMatch.list.bizEmployeeName',
              width: '100',
              prop: 'bizEmployeeName'
            },
            {
              label: 'spot.pricingMatch.list.matchPoint',
              width: '100',
              align: 'center',
              prop: 'matchPoint',
              format: {
                dict: this.$t('datadict.pricingMatchPoint')
              }
            },
            {
              label: 'spot.pricingMatch.list.productName',
              width: '180',
              prop: 'productName',
              isSon: true
            },
            {
              label: 'spot.pricingMatch.list.pricingType',
              width: '100',
              align: 'center',
              prop: 'pricingType',
              isSon: true,
              format: {
                dict: this.$t('datadict.pricingType')
              }
            },
            {
              label: 'spot.pricingMatch.list.measurementQuantity',
              width: '100',
              align: 'right',
              isSon: true,
              prop: 'measurementQuantity',
              format: {
                func: 'weight'
              }
            },
            {
              label: 'spot.pricingMatch.list.matchQuantity',
              width: '100',
              align: 'right',
              isSon: true,
              prop: 'matchQuantity',
              format: {
                func: 'weight'
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
    doSet() {
      if (!this.$refs.qmTable.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      // 注册组件
      Vue.component('view-form-table', () => import('@/views/frame/biz/spot/pricingMatch/matchSet.vue'))
      const row = this.$refs.qmTable.currentRow
      row.contractCode = row.contractNo
      this.$refs.qmTable.param = row
      this.$refs.qmTable.opType = 'set'
      this.$refs.qmTable.opMode = 'dialog'
      this.$refs.qmTable.dialogDetailVisible = true
    },
    // 匹配
    doMatch() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      row.contractCode = row.contractNo
      // 前端验证
      if (!row.matchPoint) {
        this.$notify(notifyInfo({ msg: this.$t('spot.pricingMatch.msg.pricingMatchUpdateCheck') }))
        return
      }
      this.$router.push({
        name: 'pricingMatchUpdate',
        params: {
          type: 'add',
          row: row,
          back: 'pricingMatch'
        }
      })
    }
  }
}
</script>
