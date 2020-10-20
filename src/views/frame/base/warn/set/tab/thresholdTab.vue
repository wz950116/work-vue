<template>
  <qm-edit-tab v-if="showTemplate" ref='qmEditTable' :tab='tabData' @initCallback='handleInitCallback' @closeHandler='handleClose'></qm-edit-tab>
</template>

<script>
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      showTemplate: false,
      tabData: {
        type: this.type,
        api: {
          search: '/api/warn/warnCondThreshold/list'
        },
        apiData: {
          extraParam: this.extraParam,
          search() {
            return { groupCode: this.extraParam.groupCode, warningCode: this.extraParam.warningCode }
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            isShow: ['add', 'update'],
            type: 'dialog',
            param: this.extraParam,
            getParam() {
              return {
                groupCode: this.param.groupCode,
                sourceCode: this.param.sourceCode,
                warningCode: this.param.warningCode
              }
            },
            // 弹窗组件
            component: () => import('./thresholdSet.vue')
          },
          {
            name: 'update',
            isShow: ['add', 'update'],
            type: 'dialog',
            param: this.extraParam,
            getParam(currentRow) {
              return {
                batchId: currentRow.batchId,
                groupCode: this.param.groupCode,
                sourceCode: this.param.sourceCode,
                warningCode: this.param.warningCode
              }
            },
            // 弹窗组件
            component: () => import('./thresholdSet.vue')
          },
          {
            name: 'delete',
            isShow: ['add', 'update'],
            event: this.doDelete
          }
        ],
        isColset: false,
        table: {
          id: this.$route.meta.title,
          showSelection: false,
          cols: []
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    extraParam: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  async mounted() {
    await request({
      url: '/api/warn/cond/listSrcColByType',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          sourceCode: this.extraParam.sourceCode,
          propType: 'dimension'
        }
      }
    }).then(response => {
      this.dimensionList = response.data
      const dimensionParam = {}
      this.dimensionList.forEach(d => {
        this.tabData.table.cols.push({
          label: d.colName,
          prop: d.colCode,
          width: '150',
          element: 'base-select',
          attrs: Object.assign({}, d.propAttrObject, { disabled: true, clearable: false })
        })
      })
    })

    await request({
      url: '/api/warn/cond/listCondIdsByWarningIdGroupCode',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          warningCode: this.extraParam.warningCode,
          groupCode: this.extraParam.groupCode
        }
      }
    }).then(response => {
      if (response.data) {
        response.data.forEach((s, index) => {
          this.tabData.table.cols.push({
            label: s.thresholdKey,
            prop: s.id,
            width: '120'
          })
        })
      }
    })

    this.showTemplate = true
  },
  methods: {
    handleInitCallback(tabData) {
      if (tabData && tabData.length > 0) {
        tabData.forEach(data => {
          if (data.dimension) {
          }
        })
      }
    },
    doDelete() {
      if (!this.$refs.qmEditTable.currentRow) {
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
      })
        .then(() => {
          request({
            url: '/api/warn/warnCondThreshold/remove',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: this.$refs.qmEditTable.currentRow.batchId
            }
          })
            .then(response => {
              this.loading = false
              this.$notify(notifySuccess({ msg: this.$t('biz.msg.deleteSuccess') }))
              this.$refs.qmEditTable.getList()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },
    handleClose(params) {
      if (params) {
        this.$refs.qmEditTable.getList()
      }
    }
  }
}
</script>
