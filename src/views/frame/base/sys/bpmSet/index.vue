<template>
  <qm-tree-form-table :treeTableData='treeTableData' ref='qmTreeFormTable'></qm-tree-form-table>
</template>

<script>
import Vue from 'vue'
// axios访问
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'bpmSet',
  data() {
    return {
      treeTableData: {
        form: {
          initSearch: true,
          expandAll: true,
          treeName: '业务功能列表',
          leftWidth: 260,
          isSearch:true,
          api: {
            getTreeList: '/api/sys/menu/billMenu'
          },
          apiData: {
            getTreeList() {
              return ''
            }
          },
          defaultProps: {
            children: 'children',
            label: 'cname'
          },
          handleNodeClick: this.handleNodeClick
        },

        mainData: {
          initSearch: false,
          api: {
            search: '/api/bpm/businessDefine/list',
            enable: '/api/bpm/businessDefine/enable',
            disable: '/api/bpm/businessDefine/disable',
            save: '/api/bpm/businessDefine/save',
            get: '/api/bpm/businessDefine/get',
            doDelete: '/api/bpm/businessDefine/delete'
          },
          apiData: {
            search(node) {
              return {
                moduleCode: node.code,
                businessType: '1'
              }
            }
          },
          isTopBar: true,

          topBar: [
            {
              name: 'add',
              type: 'dialog',
              getParam: () => {
                const node = this.$refs.qmTreeFormTable.getCurrentNode()
                if (node && !node.children) {
                  return {
                    moduleCode: node.code,
                    businessType: '1',
                    modeType: 'add'
                  }
                }
              },
              component: () => import('@/views/frame/base/sys/bpmSet/edit.vue')
            },
            {
              name: 'update',
              type: 'dialog',
              getParam: () => {
                const row = this.$refs.qmTreeFormTable.currentRow
                if (row) {
                  return {
                    id: row.id
                  }
                }
              },
              component: () => import('@/views/frame/base/sys/bpmSet/edit.vue')
            },
            {
              name: 'enable',
              iconName: '线性-启用',
              i18n: 'biz.btn.enable',
              permitName: ['on'],

              event: this.enable
            },
            {
              name: 'disable',
              iconName: '线性-停用',
              i18n: 'biz.btn.disable',
              permitName: ['off'],

              event: this.disable
            },
            {
              name: 'detailSet',
              type: 'route',
              routeInfo: () => {
                const row = this.$refs.qmTreeFormTable.currentRow
                return {
                  name: 'bpmSetDetail',
                  params: {
                    type: 'detailSet',
                    back: 'bpmSet',
                    id: row.id,
                    bpmType: row.bpmType,
                    moduleCode: row.moduleCode,
                    processDefineKey: row.processDefineKey
                  }
                }
              }
            },
            {
              name: 'copy',
              iconName: '线性-复制',
              i18n: 'biz.btn.copy',
              type: 'dialog',
              getParam: () => {
                return this.$refs.qmTreeFormTable.currentRow
              },
              event: this.doCopy,
              component: () => import('@/views/frame/base/sys/bpmSet/copy.vue')
            },
            {
              name: 'remove',
              getParam: () => {
                const row = this.$refs.qmTreeFormTable.currentRow
                return row
              }
            },
            {
              name: 'refresh'
            }
          ],
          table: {
            cols: [
              {
                prop: 'businessName',
                width: '220',
                label: 'sys.bpmSet.list.businessName'
              },
              {
                label: 'sys.bpmSet.form.bpmType',
                prop: 'bpmType',
                width: '100',
                align: 'center',
                format: {
                  dict: this.$t('datadict.bpmType')
                }
              },
              {
                prop: 'enableFlg',
                width: '100',
                align: 'center',
                format: {
                  dict: this.$t('datadict.usingFlag')
                },
                label: 'sys.bpmSet.list.enableFlg'
              },
              {
                prop: 'processVersion',
                width: '80',
                align: 'right',
                label: 'sys.bpmSet.list.processVersion'
              },
              {
                prop: 'businessDesp',
                label: 'sys.bpmSet.list.businessDesp'
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
  },
  methods: {
    // 启用
    enable() {
      const row = this.$refs.qmTreeFormTable.currentRow
      if (row) {
        const msg = this.$t('biz.msg.confirmEnable')
        this.$confirm(msg, this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            this.loading = true
            const postData = {}
            postData.idList = []
            postData.idList.push(row.id)
            postData.processDefineKeyList = []
            postData.processDefineKeyList.push(row.processDefineKey)
            request({
              url: this.treeTableData.mainData.api.enable,
              method: 'POST',
              data: {
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.enable'),
                data: postData
              }
            })
              .then(response => {
                this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
                this.loading = false
                this.refresh()
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {})
      }
    },
    // 停用
    disable() {
      const row = this.$refs.qmTreeFormTable.currentRow
      if (row) {
        const msg = this.$t('biz.msg.confirmStop')
        this.$confirm(msg, this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            this.loading = true
            const postData = []
            postData.push(row.id)
            request({
              url: this.treeTableData.mainData.api.disable,
              method: 'POST',
              data: {
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.disable'),
                data: postData
              }
            })
              .then(response => {
                this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
                this.loading = false
                this.refresh()
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {})
      }
    },
    doCopy() {
      const row = this.$refs.qmTreeFormTable.currentRow

      if (!row) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (row.bpmType !== 'activiti') {
        this.$notify(
          notifyInfo({
            msg: this.$t('审批类型是activiti才可以复制')
          })
        )
        return
      }
      Vue.component('view-form', () => import('@/views/frame/base/sys/bpmSet/copy.vue'))
      this.$refs.qmTreeFormTable.param = row
      this.$refs.qmTreeFormTable.param.oldProcessVersion = row.processVersion
      this.$refs.qmTreeFormTable.param.oldModuleCode = row.moduleCode
      this.$refs.qmTreeFormTable.param.oldBpmType = row.bpmType
      this.$refs.qmTreeFormTable.param.oldProcessDefineKey = row.processDefineKey
      this.$refs.qmTreeFormTable.param.businessName = ''
      this.$refs.qmTreeFormTable.param.businessDesp = ''
      this.$refs.qmTreeFormTable.param.processDefineKey = ''
      this.$refs.qmTreeFormTable.param.moduleCode = ''
      this.$refs.qmTreeFormTable.param.adjustStat = ''
      this.$refs.qmTreeFormTable.param.enableFlg = '0'
      this.$refs.qmTreeFormTable.param.id = ''
      this.$refs.qmTreeFormTable.param.moduleName = ''
      this.$refs.qmTreeFormTable.param.processVersion = 0
      this.$refs.qmTreeFormTable.opType = 'copy'
      this.$refs.qmTreeFormTable.opMode = 'copy'
      this.$refs.qmTreeFormTable.dialogDetailVisible = true
    },

    handleNodeClick(node) {
      if (!node.children && !this.treeTableData.form.showCheckbox && node) {
        this.loading = true
        request({
          url: this.treeTableData.mainData.api.search,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: (this.treeTableData.mainData.apiData.search && this.treeTableData.mainData.apiData.search(node)) || node
          }
        })
          .then(response => {
            this.loading = false
            this.$refs.qmTreeFormTable.tableData = response.data
            if (this.$refs.qmTreeFormTable.tableData && this.$refs.qmTreeFormTable.tableData.length > 0) {
              this.$refs.qmTreeFormTable.emptyTextVisible = false
            } else {
              this.$refs.qmTreeFormTable.emptyTextVisible = true
            }
            // 重置表选中
            // this.currentRow = null
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    // 刷新
    refresh() {
      const node = this.$refs.qmTreeFormTable.getCurrentNode()
      this.handleNodeClick(node)
    }
  }
}
</script>
