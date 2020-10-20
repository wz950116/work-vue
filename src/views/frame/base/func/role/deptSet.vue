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
        titleName: this.$t('func.role.tab.dept'),
        form: {
          formSelectByTree: true,
          treeName: this.$t('func.org.treeName'),
          isTopBar: false,
          initSearch: true,
          expandOnClickNode: false,
          leftWidth: 260,
          expandAll: true,
          api: {
            getTreeList: '/api/func/org/treeOrgan'
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
            label: 'code',
            label: 'name'
          },
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
          ]
        },
        mainData: {
          initSearch: true,
          api: {
            search: '/api/func/dept/list'
          },
          apiData: {
            search(node) {
              return {
                orgCode: node['code'],
                usingFlag: '1'
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
            cols: [
              {
                prop: 'name',
                label: 'func.dept.deptName'
              },
              {
                prop: 'code',
                label: 'func.dept.deptCode'
              },
              {
                prop: 'orgName',
                label: 'func.dept.organName'
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
              show: false
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
            dataperCode: 'dept',
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
