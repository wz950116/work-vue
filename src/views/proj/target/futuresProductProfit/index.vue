<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>

    <warnDialog v-if="dialogVisible" @confirm="confirm" @close="close"></warnDialog>
  </div>
</template>

<script>
import warnDialog from '@/views/proj/target/components/warnDialog'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'

export default {
  name: 'futuresProductProfit',
  components: {
    warnDialog
  },
  data() {
    return {
      dialogVisible: false,
      selectData: {},
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            exchangeName: ''
          },
          defaultSortString: 'organName.desc'
        },
        formData: [
          {
            label: 'target.futuresProductProfit.targetName',
            prop: 'targetName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'target.futuresProductProfit.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              params: {
                usingFlag: '1'
              },
              clearable: true
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/target/tgtFtProdProfit/list',
          doDelete: '/api/target/tgtFtProdProfit/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            component: () => import('@/views/proj/target/futuresProductProfit/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/target/futuresProductProfit/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/target/futuresProductProfit/editForm.vue')
          },
          {
            name: 'warnRelation',
            i18n: 'biz.btn.warnRelation',
            $refs: this.$refs,
            event: this.warnRelation
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
          id: 'futuresProductProfit',
          cols: [
            {
              prop: 'targetName',
              label: 'target.futuresProductProfit.targetName',
              width: 150
            },
            {
              prop: 'organName',
              label: 'target.futuresProductProfit.organCode',
              width: 150
            },
            {
              prop: 'startDate',
              align: 'center',
              label: 'target.futuresProductProfit.startDate',
              width: 120,
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'endDate',
              align: 'center',
              label: 'target.futuresProductProfit.endDate',
              width: 120,
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'optEmployeeName',
              label: 'target.futuresProductProfit.optEmployeeName',
              width: 150
            },
            {
              prop: 'warningName',
              label: 'target.futuresProductProfit.warningName',
              width: 150
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
    warnRelation() {
      if (!this.$refs.qmTable.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.selectData = this.$refs.qmTable.currentRow
      this.dialogVisible = true
    },
    confirm(val) {
      request({
        url: '/api/target/tgtFtProdProfit/updateWarn',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            id: this.selectData.id,
            warnCode: val.warningCode
          }
        }
      }).then(request => {
        this.$refs.qmTable.getList()
      })
      this.dialogVisible = false
    },
    close() {
      this.dialogVisible = false
    }
  }
}
</script>
