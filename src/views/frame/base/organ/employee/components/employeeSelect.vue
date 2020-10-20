<template>
  <qm-dialog-tree-table ref="qmTable" :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-tree-table>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
// axios访问
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('func.role.tab.user'),
        form: {
          listQuery: {
            isPage: true,
            defaultSortString: 'code.asc'
          },
          formSelectByTree: true,
          treeName: this.$t('func.org.treeName'),
          isTopBar: false,
          topBar: [],
          isSearch: true,
          initSearch: true,
          expandOnClickNode: false,
          leftWidth: 300,
          expandAll: true,
          api: {
            getTreeList: '/api/func/dept/treeOrgBaseDept'
          },
          apiData: {
            getTreeList() {
              return {
                usingFlag: '1'
              }
            }
          },
          defaultProps: {
            children: 'children',
            key: 'code',
            label: 'name'
          },
          formDataVisible: true,
          formData: [
            {
              prop: 'name',
              label: 'func.employee.staffName',
              element: 'input-validate',
              attrs: {
                clearable: true
              }
            }
          ]
        },
        mainData: {
          initSearch: false,
          api: {
            search: '/api/func/employee/list'
          },
          apiData: {
            search(node) {
              if (node) {
                return { orgCode: node.orgCode, deptCode: node.deptCode }
              } else {
                return {}
              }
            },
            init() {
              return {}
            }
          },

          table: {
            showCheckbox: false,
            multiple: true,
            cols: [
              {
                prop: 'name',
                label: 'func.employee.staffName',
                width: 100
              },
              {
                prop: 'code',
                label: 'func.employee.staffCode',
                width: 120
              },
              {
                prop: 'usingFlag',
                label: 'biz.lbl.usingFlag',
                format: {
                  dict: this.$t('datadict.usingFlag')
                },
                width: 100
              },
              {
                prop: 'orgName',
                label: 'func.employee.organName',
                width: 120
              },
              {
                prop: 'deptName',
                label: 'func.employee.deptName'
              },
              {
                prop: 'gender',
                label: 'func.employee.gender',
                format: {
                  dict: this.$t('datadict.gender')
                },
                width: 100
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
        },

        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  methods: {
    // 关闭回调
    handleCloseDialog(param) {
      if (param) {
        this.$emit('closeHandler', param.code)
      } else {
        this.$emit('closeHandler')
      }
    }
  }
}
</script>
