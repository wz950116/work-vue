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
        titleName: this.$t('func.role.tab.employee'),
        form: {
          listQuery: {
            isPage: true,
            defaultSortString: 'code.asc'
          },
          formSelectByTree: true,
          treeName: this.$t('func.org.treeName'),
          isTopBar: false,
          initSearch: true,
          isSearch: true,
          expandOnClickNode: false,
          leftWidth: 260,
          showCode: false,
          expandAll: true,
          api: {
            getTreeList: '/api/func/dept/treeOrgBaseDept'
          },
          apiData: {
            getTreeList() {
              return {}
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
          initSearch: true,
          api: {
            search: '/api/func/employee/list'
          },
          apiData: {
            search(node) {
              if (node) {
                return {
                  orgCode: node.orgCode,
                  deptCode: node.deptCode,
                  usingFlag: '1'
                }
              } else {
                return {
                  usingFlag: '1'
                }
              }
            },
            init() {
              return {
                usingFlag: '1'
              }
            }
          },
          table: {
            showCheckbox: true,
            multiple: true,
            cols: [
              {
                prop: 'name',
                label: 'func.employee.staffName'
              },
              {
                prop: 'code',
                label: 'func.employee.staffCode'
              },
              {
                prop: 'gender',
                label: 'func.employee.gender',
                format: {
                  dict: this.$t('datadict.gender')
                }
              },
              {
                prop: 'orgCode',
                label: 'func.employee.organName'
              },
              {
                prop: 'deptCode',
                label: 'func.employee.deptName'
              },
              {
                prop: 'usingFlag',
                width: '100',
                label: 'biz.lbl.usingFlag',
                format: {
                  dict: this.$t('datadict.usingFlag')
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
        },

        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['view']
          },
          {
            name: 'biz.btn.save',
            event: this.save,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    param: String
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeAndRefreshHandler', params)
    },

    // 保存通用事件
    save() {
      if (!this.$refs.qmTable.multipleSelection || this.$refs.qmTable.multipleSelection.length < 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        // 操作员账户

        const userCodeArr = []
        this.$refs.qmTable.multipleSelection.forEach(select => {
          userCodeArr.push({
            dataperItem: select.code,
            dataperCode: 'employee',
            roleCode: this.param
          })
        })
        this.loading = true
        request({
          url: '/api/func/funcRoleDataper/save',
          method: 'POST',
          data: {
            data: userCodeArr,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
          }
        })
          .then(response => {
            this.$notify(notifySuccess({ msg: this.$t('biz.msg.updateSuccess') }))
            this.loading = false
            this.handleCloseDialog(true)
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
