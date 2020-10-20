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
  name: 'futuresContractPosition',
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
            label: 'target.futuresContractPosition.organCode',
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
          search: '/api/target/tgtFtConPosition/list',
          doDelete: '/api/target/tgtFtConPosition/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            component: () => import('@/views/proj/target/futuresContractPosition/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/target/futuresContractPosition/editForm.vue')
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
            component: () => import('@/views/proj/target/futuresContractPosition/editForm.vue')
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
          id: 'futuresContractPosition',
          cols: [
            {
              prop: 'targetName',
              label: 'target.futuresContractPosition.targetName',
              width: 150
            },
            {
              prop: 'organName',
              label: 'target.futuresContractPosition.organCode',
              width: 150
            },
            {
              prop: 'futuresVarietiesName',
              label: 'target.futuresContractPosition.futuresVarietiesCode',
              width: 150
            },
            {
              prop: 'startDate',
              align: 'center',
              label: 'target.futuresContractPosition.startDate',
              width: 120,
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'endDate',
              align: 'center',
              label: 'target.futuresContractPosition.endDate',
              width: 120,
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'optEmployeeName',
              label: 'target.futuresContractPosition.optEmployeeName',
              width: 150
            },
            {
              prop: 'warningName',
              label: 'target.futuresContractPosition.warningName',
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
      this.selectData = this.$refs.qmTable.currentRow
      this.dialogVisible = true
    },
    confirm(val) {
      request({
        url: '/api/target/tgtFtConPosition/updateWarn',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
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
