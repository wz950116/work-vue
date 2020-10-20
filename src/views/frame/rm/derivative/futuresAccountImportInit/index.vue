<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import tradeTypeDialog from '@/views/frame/rm/strategy/plan/tradeTypeDialog'

export default {
  name: 'futuresAccountImportInit',
  data() {
    return {
      typeDialogVisible: false,
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            tradingDayFrom: '',
            tradingDayTo: '',
            importDateFrom: '',
            importDateTo: '',
            brokerCode: ''
          },
          defaultSortString: 'tradingDay.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'derivative.futruesImportRecord.tradingDay',
            props: ['tradingDayFrom', 'tradingDayTo'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            type: 'date',
            label: 'derivative.futruesImportRecord.importDate',
            props: ['importDateFrom', 'importDateTo'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'derivative.futruesImportRecord.customerName',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              clearable: true,
              params: {
                typeCode: '1'
              }
            }
          },
          {
            label: 'derivative.futruesImportRecord.brokerName',
            prop: 'brokerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              clearable: true,
              params: {
                typeCode: '1'
              }
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/derivative/dvtFutureInitRcd/page'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            event: this.add
          },
          {
            name: 'view',
            type: 'route',
            $refs: this.$refs,
            event: this.view
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: 'spotExopsure',
          cols: [
            {
              prop: 'derivativeAccount',
              label: 'derivative.futruesImportRecord.derivativeAccount',
              width: '120'
            },
            {
              prop: 'tradingDay',
              align: 'center',
              width: '100',
              label: 'derivative.futruesImportRecord.tradingDay',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'uploadDt',
              align: 'center',
              width: '150',
              label: 'derivative.futruesImportRecord.uploadDt'
            },
            {
              prop: 'mainName',
              label: 'derivative.futruesImportRecord.mainName',
              width: '200'
            },
            {
              prop: 'brokerName',
              label: 'derivative.futruesImportRecord.brokerName',
              width: '200'
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
    add() {
      this.$router.push({
        name: 'futuresAccountImportInitAdd',
        params: {
          type: 'add'
        }
      })
    },
    remove() {
      const currentRows = this.$refs.qmTable.currentRow
      if (!currentRows) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRows.length !== 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
        return
      }

      const currentRow = currentRows[0]

      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/derivative/dvtFutureInitRcd/remove',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.remove'),
            data: currentRow.id
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.deleteSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    },
    view() {
      if (this.$refs.qmTable.currentRow === null) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.$router.push({
        name: 'futuresAccountImportInitView',
        params: {
          type: 'view',
          id: this.$refs.qmTable.currentRow.id
        }
      })
    }
  }
}
</script>
