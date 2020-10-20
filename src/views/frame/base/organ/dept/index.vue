<template>
  <qm-tree-form-table ref='qmTable' :treeTableData='treeTableData'></qm-tree-form-table>
</template>
<script>
import { Notification } from 'element-ui'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'deptManage',
  data() {
    return {
      treeTableData: {
        form: {
          formSelectByTree: true,
          listQuery: {
            isPage: false,
            defaultSortString: 'createDate.desc'
          },
          initSearch: true,
          treeName: '机构信息',
          expandAll: true,
          expandOnClickNode: false,
          api: {
            getTreeList: '/api/func/org/treeOrgan'
          },
          apiData: {
            getTreeList() {
              return {
                usingFlag: ''
              }
            }
          },
          leftWidth: 300,
          showCode: false,
          defaultProps: {
            children: 'children',
            key: 'code',
            label: 'name'
          },
          isTopBar: false,
          topBar: [
            {
              name: 'expand',
              permitName: ['query']
            }
          ],
          isSearch: true,
          formDataVisible: true,
          formData: [
            {
              prop: 'name',
              label: 'func.dept.deptName',
              element: 'input-validate',
              attrs: {
                clearable: true
              }
            }
            // },
            // {
            //   prop: 'reservedStr2',
            //   label: 'func.dept.ginningPlantFlg',
            //   element: 'base-select',
            //   list: this.$t('datadict.yesNo'),
            //   attrs: {
            //     clearable: true
            //   }
            // }
          ]
        },
        mainData: {
          api: {
            search: '/api/func/dept/list',
            doDelete: '/api/func/dept/remove'
          },
          apiData: {
            search(node) {
              if (node) {
                return {
                  orgCode: node['code']
                }
              } else {
                return {}
              }
            }
          },
          initSearch: true,
          isTopBar: true,
          topBar: [
            {
              name: 'add',
              type: 'dialog',
              msg: this.$t('msg.organ.orgSelect'),
              // 按钮验证函数
              // validate: () => {
              //   const flg = this.$refs.qmTable && this.$refs.qmTable.getCurrentNode()
              //   if (!flg) {
              //     Notification(
              //       notifyInfo({
              //         msg: this.msg
              //       })
              //     )
              //   }
              //   return flg
              // },
              getParam: () => {
                if (this.$refs.qmTable.currentRow) {
                  return {
                    orgCode: this.$refs.qmTable.currentRow.orgCode,
                    deptCode: this.$refs.qmTable.currentRow.code
                  }
                } else {
                  const node = this.$refs.qmTable.getCurrentNode()
                  if (node) {
                    return {
                      orgCode: node.code
                    }
                  } else {
                    return {}
                  }
                }
              },
              component: () => import('./edit.vue')
            },
            {
              name: 'view',
              allowDblClick: true,
              type: 'dialog',
              component: () => import('./edit.vue')
            },
            {
              name: 'update',
              type: 'dialog',
              component: () => import('./edit.vue')
            },
            {
              name: 'remove',
              getParam: () => {
                return this.$refs.qmTable.currentRow.id
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
            rowKey: 'code',
            expandAll: true,
            sortable: true,
            cols: [
              {
                prop: 'code',
                label: 'func.dept.deptCode',
                width: 160
              },
              {
                prop: 'name',
                label: 'func.dept.deptName',
                width: 160
              },
              {
                prop: 'orgName',
                label: 'func.dept.organName',
                width: 260
              },
              {
                prop: 'usingFlag',
                width: 80,
                align: 'center',
                label: 'biz.lbl.usingFlag',
                format: {
                  dict: this.$t('datadict.usingFlag')
                }
              },
              {
                prop: 'leader',
                label: 'func.dept.leader',
                width: 80
              },
              {
                prop: 'principal',
                label: 'func.dept.principal',
                width: 80
              },
              {
                prop: 'phone',
                label: 'func.dept.phone',
                width: 120
              },
              {
                prop: 'fax',
                label: 'func.dept.fax',
                width: 120
              },
              {
                prop: 'businessNature',
                label: 'func.dept.businessNature',
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

