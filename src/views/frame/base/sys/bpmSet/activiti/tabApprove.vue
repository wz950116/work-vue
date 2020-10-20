<template>
  <qm-edit-tab :tab='tab' ref='qmTabTable'></qm-edit-tab>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/frame/base/auth'
// axios访问
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'

export default {
  name: 'bpmSet',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          view: '/api/bpm/businessDefine/get',
          search: '/api/bpm/processDetail/listProcessMode',
          publish: '/api/bpm/processDetail/deployment',
          deleteVersion: '/api/bpm/processDetail/remove',
          adjust: '/api/bpm/processDetail/adjustment'
        },
        apiData: {
          id: this.$route.params.id,
          processDefineKey: this.$route.params.processDefineKey,
          search() {
            return this.processDefineKey
          },
          view() {
            return {
              id: this.id,
              modeType: ''
            }
          },
          publish(data) {
            return data
          },
          deleteVersion(data) {
            return data
          },
          adjust(data) {
            return data
          }
        },
        topBar: [
          {
            i18n: 'biz.btn.detail',
            name: 'detail',
            iconName: '线性-查看',
            event: this.view
          },
          {
            i18n: 'biz.btn.editproc',
            name: 'editproc',
            iconName: '线性-编排',
            event: this.editProcess
          },
          {
            i18n: 'biz.btn.adjust',
            name: 'adjust',
            iconName: '线性-调整',
            event: this.adjust
          },
          {
            i18n: 'biz.btn.delete',
            name: 'delete',
            iconName: '线性-删除',
            event: this.delete
          },
          {
            i18n: 'biz.btn.publish',
            name: 'publish',
            iconName: '线性-生成',
            event: this.publish
          }
        ],
        table: {
          cols: [
            {
              prop: 'processVersion',
              width: '120',
              label: 'sys.bpmSet.list.processVersion'
            },
            {
              prop: 'deployTime',
              width: '220',
              label: 'sys.bpmSet.list.deployTime'
            },
            {
              prop: 'processDesp',
              width: '400',
              label: 'sys.bpmSet.list.processDesp'
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['iframeRouters', 'permissionRouters'])
  },
  methods: {
    // 刷新画面数据
    refresh() {
      this.loading = true
      request({
        url: this.tab.api.view,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.tab.apiData.view()
        }
      }).then(response => {
        this.$parent.$parent.$parent.editForm = response.data
      })

      request({
        url: this.tab.api.search,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.tab.apiData.search()
        }
      })
        .then(response => {
          this.$refs.qmTabTable.tableData = response.data
        })
        .catch(() => {
          this.loading = false
        })

      this.loading = false
    },

    // 编排流程图
    editProcess() {
      const row = this.$refs.qmTabTable.currentRow
      const firstRow = this.$refs.qmTabTable.tableData[0]
      if (row && row === firstRow && row.enableFlg === '0') {
        this.permissionRouters.forEach(route => {
          if (route.name === 'iframeTemp') {
            route.children.forEach(r => {
              if (r.name === 'iframeEditModel') {
                r.meta.src = process.env.BPM_BASE_URL + '/modeler.html?modelId=' + row.id + '&bpmToken=' + getToken()

                this.$router.push({
                  name: 'iframeEditModel',
                  params: {
                    hash: row.id
                  }
                })
              }
            })
          }
        })
      } else if (row && row === firstRow && row.enableFlg !== '0') {
        this.$notify(
          notifyError({
            msg: '只能修改调整中的流程版本'
          })
        )
      } else {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
      }
    },

    // 查看流程图
    view() {
      const row = this.$refs.qmTabTable.currentRow
      if (row) {
        this.iframeRouters.children.forEach(route => {
          if (route.name === 'iframeViewModel') {
            route.meta.src = process.env.BPM_BASE_URL + '/view.html?modelId=' + row.id + '&bpmToken=' + getToken()
          }
        })
        this.$router.push({
          name: 'iframeViewModel',
          params: {
            hash: row.id
          }
        })

        // this.permissionRouters.forEach(route => {
        //   if (route.name === 'iframeTemp') {
        //     route.children.forEach(r => {
        //       if (r.name === 'iframeViewModel') {
        //         r.meta.src =
        //           process.env.BPM_BASE_URL +
        //           '/view.html?modelId=' +
        //           row.id +
        //           '&bpmToken=' +
        //           getToken()

        //         this.$router.push({
        //           name: 'iframeViewModel',
        //           params: {
        //             hash: row.id
        //           }
        //         })
        //       }
        //     })
        //   }
        // })
      } else {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },

    // 调整流程
    adjust() {
      const processData = this.$parent.$parent.$parent.editForm || {}
      const row = this.$refs.qmTabTable.currentRow
      const firstRow = this.$refs.qmTabTable.$data.tableData[0]
      if (row && row === firstRow && row.enableFlg === '1' && processData.adjustStat === '0') {
        this.loading = true
        const rowFormData = this.$parent.$parent.$parent.editForm || {}
        rowFormData.oldModelId = row.id
        rowFormData.oldProcessDefineKey = rowFormData.processDefineKey
        rowFormData.oldProcessVersion = rowFormData.processVersion
        rowFormData.oldModuleCode = rowFormData.moduleCode
        rowFormData.oldBusinessType = rowFormData.businessType
        rowFormData.oldBpmType = rowFormData.bpmType
        request({
          url: this.tab.api.adjust,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.adjustment'),
            data: this.tab.apiData.adjust(rowFormData)
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
      } else if (row && row === firstRow && (row.enableFlg !== '1' || processData.adjustStat !== '0')) {
        this.$notify(
          notifyError({
            msg: '该流程版本已经在调整中，请点击编排进行修改'
          })
        )
      } else {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
      }
    },

    // 删除流程版本
    delete() {
      const row = this.$refs.qmTabTable.currentRow
      const firstRow = this.$refs.qmTabTable.tableData[0]
      if (row && row === firstRow && row.enableFlg === '0' && this.$refs.qmTabTable.$data.tableData.length > 1) {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        }).then(() => {
          this.loading = true
          const rowFormData = this.$parent.$parent.$parent.editForm || {}
          rowFormData.oldModelId = row.id
          rowFormData.oldprocessDefineKey = rowFormData.processDefineKey
          rowFormData.oldprocessVersion = row.processVersion
          rowFormData.oldBpmType = rowFormData.bpmType

          request({
            url: this.tab.api.deleteVersion,
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.delete'),
              data: this.tab.apiData.deleteVersion(rowFormData)
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
      } else if (row && row === firstRow && row.enableFlg === '1') {
        this.$notify(
          notifyError({
            msg: '只能删除调整中的版本'
          })
        )
      } else if (row && row === firstRow && this.$refs.qmTabTable.$data.tableData.length <= 1) {
        this.$notify(
          notifyError({
            msg: '不能删除唯一的流程版本'
          })
        )
      } else {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
      }
    },

    // 发布流程
    publish() {
      const row = this.$refs.qmTabTable.currentRow
      const firstRow = this.$refs.qmTabTable.tableData[0]
      if (row && row === firstRow && row.enableFlg === '0') {
        this.$confirm(this.$t('biz.msg.confirmPublish'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        }).then(() => {
          this.loading = true
          const rowFormData = this.$parent.$parent.$parent.editForm || {}
          rowFormData.oldModelId = row.id
          request({
            url: this.tab.api.publish,
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.publish'),
              data: this.tab.apiData.publish(rowFormData)
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
      } else if (row && row === firstRow && row.enableFlg === '1') {
        this.$notify(
          notifyError({
            msg: '只能发布调整中的版本'
          })
        )
      } else {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
      }
    },
    handleCloseDialog() {
      this.$emit('closeHandler')
    }
  }
}
</script>
