<template>
  <qm-tree-form-table ref='qmTable' :treeTableData='treeTableData'></qm-tree-form-table>
</template>
<script>

export default {
  name: 'employeeManage',
  data() {
    return {
      treeTableData: {
        form: {
          initSearch: true,
          treeName: '单据类型',
          expandOnClickNode: false,
          expandAll: true,
          validate: node => node.accountId,
          api: {
            getTreeList: '/api/finance/account/treeList'
          },
          apiData: {
            getTreeList() {
              return {
                usingFlag: ''
              }
            }
          },
          defaultProps: {
            children: 'billDtoList',
            label: 'name'
          }
        },

        mainData: {
          api: {
            search: '/api/finance/voucher/page',
            doDelete: '/api/finance/voucher/remove'
          },
          apiData: {
            search(node) {
              return { 'accountId': node.accountId, 'billCode': node.id }
            }
          },
          form: {
            listQuery: {
              isPage: true,
              current: 1,
              size: 20,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: {}
            },
            moreShowFlg: false,

            formData: [
              {
                label: '凭证号',
                prop: 'voucherNo',
                element: 'el-input',
                attrs: {
                  clearable: true
                }
              },
              {
                type: 'date',
                label: '凭证日期',
                props: ['startDate', 'endDate'],
                attrs: {
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyy-MM-dd'
                },
                default: ['', '']
              }
            ]
          },
          initSearch: true,
          isTopBar: true,
          topBar: [
            {
              name: 'view',
              type: 'dialog',
              component: () => import('./edit.vue'),
              getParam: (data) => {
                return {
                  type: 'view',
                  data: data.id
                }
              }
            },
            // {
            //   name: 'update',
            //   type: 'dialog',
            //   component: () => import('./edit.vue')
            // },
            {
              name: 'remove',
              getParam: () => {
                return this.$refs.qmTable.currentRow.id
              }
            }, {
              name: 'refresh'
            }
          ],
          isColset: true,
          table: {
            showIndex: true,
            id: this.$route.meta.title + 'ff',
            sortable: true,
            cols: [
              // 凭证号voucherNo     凭证日期voucherDate
              // 凭证类型 voucherType    附件张数 annexNum     凭证单据号 pzBillNo
              //
              // 制单员 optEmployeeName     制单日期 createDate
              {
                prop: 'voucherNo',
                label: '凭证号',
                width: 120
              },
              {
                prop: 'voucherDate',
                label: '凭证日期',
                width: 150
              },
              {
                prop: 'voucherType',
                label: '凭证类型',
                width: 150,
                format: {
                  func: 'isAccType'
                }
              },
              {
                prop: 'annexNum',
                label: '附件张数',
                width: 120
              }, {
                prop: 'pzBillNo',
                label: '凭证单据号'
              },
              {
                prop: 'optEmployeeName',
                label: '制单员',
                width: 100
              },
              {
                prop: 'createDate',
                label: '制单日期'
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
}
</script>

