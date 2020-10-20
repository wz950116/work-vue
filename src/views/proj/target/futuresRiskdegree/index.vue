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
  name: 'futuresRiskdegree',
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
            label: 'target.futuresRiskdegree.custCode',
            prop: 'custCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                usingFlag: '1',
                typeCode: '4'
              },
              clearable: true
            }
          },
          {
            label: 'target.futuresRiskdegree.derivativeAccount',
            prop: 'derivativeAccount',
            element: 'base-select',
            attrs: {
              data: 'DERIVATIVE_ACCOUNT',
              clearable: true
            }
          },
          {
            label: 'target.futuresRiskdegree.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              params: {
                usingFlag: '1'
              },
              clearable: true
            }
          },
          {
            label: 'target.futuresRiskdegree.derivativeCategory',
            prop: 'derivativeCategory',
            element: 'base-select',
            list: this.$t('datadict.derivativeCategory'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/target/tgtFtAccoRiskdegree/list',
          doDelete: '/api/target/tgtFtAccoRiskdegree/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            component: () => import('@/views/proj/target/futuresRiskdegree/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/target/futuresRiskdegree/editForm.vue')
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
            component: () => import('@/views/proj/target/futuresRiskdegree/editForm.vue')
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
          id: 'futuresRiskdegree',
          cols: [
            {
              prop: 'organName',
              align: 'center',
              label: 'target.futuresRiskdegree.organCode',
              width: 150
            },
            {
              prop: 'custName',
              label: 'target.futuresRiskdegree.custCode',
              width: 150
            },
            {
              prop: 'derivativeAccount',
              label: 'target.futuresRiskdegree.derivativeAccount',
              width: 150
            },
            {
              prop: 'riskDegree',
              align: 'right',
              label: 'target.futuresRiskdegree.riskDegree',
              width: 120,
              format: {
                func: 'thousands',
                dict: 4
              }
            },
            {
              prop: 'riskDegreeNow',
              align: 'right',
              label: 'target.futuresRiskdegree.riskDegreeNow',
              width: 120,
              format: {
                func: 'thousands',
                dict: 4
              }
            },
            {
              prop: 'optEmployeeName',
              label: 'target.futuresRiskdegree.optEmployeeName',
              width: 150
            },
            {
              prop: 'warningName',
              label: 'target.futuresRiskdegree.warningName',
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
        url: '/api/target/tgtFtAccoRiskdegree/updateWarn',
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
