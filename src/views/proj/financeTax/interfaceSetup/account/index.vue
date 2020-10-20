<template>
  <qm-double-table ref='qmTable' :treeTableData='treeTableData'></qm-double-table>
</template>
<script>
export default {
  name: 'employeeManage',
  data() {
    return {
      treeTableData: {
        form: {
          treeName: '账套设置',
          initSearch: true,
          expandOnClickNode: false,
          expandAll: true,
          api: {
            getTreeList: '/api/finance/account/list',
            doDelete: '/api/finance/account/remove'
          },
          isTopBar: true,
          topBar: [
            {
              name: 'add',
              type: 'dialog',
              component: () => import('./editTree.vue')
            },
            {
              name: 'update',
              type: 'dialog',
              component: () => import('./editTree.vue')
            },
            {
              name: 'remove',
              refTree: true,
              getParam: data => {
                return data.id
              }
            },
            {
              refTree: true,
              name: 'refresh'
            }
          ],
          apiData: {
            getTreeList() {
              return {
                usingFlag: ''
              }
            }
          },
          table: {
            showIndex: true,
            id: this.$route.meta.title + 'ff',
            sortable: true,
            cols: [
              {
                prop: 'name',
                label: '账套名称',
                width: 120
              },
              {
                prop: 'interfanceName',
                label: '总凭证接口',
                width: 120
              },
              {
                prop: 'url',
                label: '接口URL',
                width: 120
              },
              {
                prop: 'isMaster',
                label: '是否主帐套',
                width: 120,
                format: {
                  func: 'is'
                }
              },
              {
                prop: 'state',
                label: '状态',
                width: 120,
                format: {
                  func: 'isState'
                }
              },
              {
                prop: 'remark',
                label: 'data.account.list.remake',
                width: 120
              }
            ]
          },
          defaultProps: {
            children: 'children',
            label: 'name'
          }
        },

        mainData: {
          treeName: '单据类型',
          api: {
            search: '/api/finance/ztBill/listByAccount',
            doDelete: '/api/finance/ztBill/remove'
          },
          formData: [
            {
              label: 'data.spotPrice.form.priceItemName',
              prop: 'priceItemCode',
              element: 'base-select',
              attrs: {
                data: 'DD_PRICE_ITEM',
                clearable: true,
                params: {
                  usingFlag: '1',
                  priceItemTypeList: '1,4'
                }
              }
            },
            {
              type: 'date',
              label: 'data.spotPrice.form.pricingDate',
              props: ['pricingDateStart', 'pricingDateEnd'],
              attrs: {
                format: 'yyyy-MM-dd',
                'value-format': 'yyyyMMdd'
              },
              default: ['', '']
            }
          ],
          apiData: {
            search(node) {
              return node.id
            }
          },
          initSearch: true,
          isTopBar: true,
          topBar: [
            {
              name: 'add',
              type: 'dialog',
              getParam: () => {
                const node = this.$refs.qmTable.CurrentNode
                if (node) {
                  return {
                    accountId: node.id
                  }
                } else {
                  return {}
                }
              },
              component: () => import('./edit.vue')
            },
            {
              name: 'remove',
              getParam: () => {
                return {
                  accountId: this.$refs.qmTable.CurrentNode.id,
                  billCodes: this.$refs.qmTable.currentRow.id
                }
              }
            },
            {
              name: 'refresh'
            }
          ],
          isColset: true,
          table: {
            showIndex: true,
            id: this.$route.meta.title + 'ff',
            sortable: true,
            cols: [
              {
                prop: 'name',
                label: 'data.account.list.type',
                width: 100
              },
              {
                prop: 'state',
                label: '状态',
                width: 120,
                format: {
                  func: 'isState'
                }
              },
              {
                prop: 'code',
                label: 'data.account.list.remake',
                width: 120
              }
            ]
          },
          bottomBar: {
            pagination: {
              show: false
            }
          }
        }
      }
    }
  }
}
</script>

