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
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'

export default {
  name: 'simpleMatch',
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
            matchCode: '',
            makeDateStart: '',
            makeDateEnd: '',
            productCode: '',
            documentNo: '',
            direction: '',
            bizOrganCode: '',
            bizDeptCode: '',
            bizEmployeeCode: '',
            makeUser: ''
          },
          defaultSortString: 'makeDate.desc, matchCode.desc'
        },
        formData: [
          {
            width: 120,
            label: 'strategy.simpleMatch.form.matchCode',
            prop: 'matchCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'strategy.simpleMatch.form.makeDate',
            props: ['makeDateStart', 'makeDateEnd'],
            default: ['', ''],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            width: 120,
            label: 'strategy.simpleMatch.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.simpleMatch.form.documentNo',
            prop: 'documentNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'strategy.simpleMatch.form.direction',
            prop: 'direction',
            element: 'base-select',
            width: 120,
            list: this.$t('datadict.spotDirection'),
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.simpleMatch.form.bizOrganCode',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.simpleMatch.form.bizDeptCode',
            prop: 'bizDeptCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_DEPT',
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.simpleMatch.form.bizEmployeeCode',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_STAFF',
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.simpleMatch.form.makeUser',
            prop: 'makeUser',
            element: 'base-select',
            attrs: {
              data: 'TREE_STAFF',
              clearable: true
            }
          }
        ]
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/strategy/strgSimpleMatch/list'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            event: this.add
          },
          {
            name: 'update',
            type: 'route',
            $refs: this.$refs,
            event: this.update
          },
          {
            name: 'remove',
            $refs: this.$refs,
            event: this.remove
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
            permitName: ['query'],
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: 'simpleMatch',
          cols: [
            {
              prop: 'matchCode',
              label: 'strategy.simpleMatch.list.matchCode',
              width: '150 '
            },
            {
              prop: 'makeDate',
              align: 'center',
              width: '100',
              label: 'strategy.simpleMatch.list.makeDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'productName',
              width: '120',
              label: 'strategy.simpleMatch.list.productName'
            },
            {
              prop: 'documentNo',
              width: '120',
              label: 'strategy.simpleMatch.list.documentNo'
            },
            {
              prop: 'direction',
              align: 'center',
              width: '80',
              label: 'strategy.simpleMatch.list.direction',
              format: {
                dict: this.$t('datadict.spotDirection')
              }
            },
            {
              prop: 'rawQuantity',
              align: 'right',
              width: '120',
              label: 'strategy.simpleMatch.list.rawQuantity',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'futuresQuantity',
              align: 'right',
              width: '120',
              label: 'strategy.simpleMatch.list.futuresQuantity',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'relateProportion',
              align: 'right',
              width: '120',
              label: 'strategy.simpleMatch.list.relateProportion'
            },
            {
              prop: 'bizOrganName',
              width: '100',
              label: 'strategy.simpleMatch.list.bizOrganName'
            },
            {
              prop: 'bizDeptName',
              width: '100',
              label: 'strategy.simpleMatch.list.bizDeptName'
            },
            {
              prop: 'bizEmployeeName',
              width: '80',
              label: 'strategy.simpleMatch.list.bizEmployeeName'
            },
            {
              prop: 'makeUserName',
              width: '80',
              label: 'strategy.simpleMatch.list.makeUserName'
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
        name: 'simpleMatchAdd',
        params: {
          type: 'add'
        }
      })
    },
    update() {
      if (this.$refs.qmTable.currentRow === null) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.$router.push({
        name: 'simpleMatchEdit',
        params: {
          type: 'update',
          uk: this.$refs.qmTable.currentRow.matchCode
        }
      })
    },
    remove() {
      var currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strategy/strgSimpleMatch/remove',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.remove'),
            data: currentRow.matchCode
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
        name: 'simpleMatchView',
        params: {
          type: 'view',
          uk: this.$refs.qmTable.currentRow.matchCode
        }
      })
    }
  }
}
</script>
