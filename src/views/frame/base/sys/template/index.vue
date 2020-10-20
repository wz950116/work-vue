<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'>

    </qm-table>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'warning',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          defaultSortString: 'createDate.desc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        },
        formData: [
          {
            label: 'file.template.templateCode',
            prop: 'templateCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'file.template.templateName',
            prop: 'templateName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'file.template.businessCategory',
            prop: 'billType',
            element: 'base-select',
            list: this.$t('datadict.templateCategory'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/sys/template/list',
          updateUsingFlag: '/api/sys/template/updateUsingFlag',
          doDelete: '/api/sys/template/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./editForm.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            component: () => import('./editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('./editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.templateCode
            }
          },
          {
            name: 'on',
            iconName: '线性-启用',
            i18n: 'biz.btn.enable',
            validate(currentRow) {
              return currentRow.usingFlag === '0'
            },
            event: this.enable
          },
          {
            name: 'off',
            iconName: '线性-停用',
            i18n: 'biz.btn.disable',
            validate(currentRow) {
              return currentRow.usingFlag === '1'
            },
            event: this.disable
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          cols: [
            {
              prop: 'templateCode',
              width: '200',
              label: 'file.template.templateCode'
            },
            {
              prop: 'templateName',
              width: '200',
              label: 'file.template.templateName'
            },
            {
              prop: 'billType',
              width: '100',
              label: 'file.template.businessCategory',
              format: {
                dict: this.$t('datadict.templateCategory')
              }
            },
            {
              prop: 'usingFlag',
              width: '100',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              prop: 'remark',
              label: 'biz.lbl.remark',
              'min-width': '300',
              'show-overflow-tooltip': 'true'
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
    enable() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (row.usingFlag === '1') {
        this.$notify(notifyInfo({ msg: this.$t('file.template.validateMsg.enable') }))
        return
      }
      request({
        url: this.mainData.api.updateUsingFlag,
        method: 'POST',
        data: {
          data: {
            usingFlag: '1',
            templateCode: row.templateCode
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.enable')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
          this.$refs.qmTable.getList()
        })
        .catch(() => {})
    },
    disable() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (row.usingFlag === '0') {
        this.$notify(notifyInfo({ msg: this.$t('file.template.validateMsg.disable') }))
        return
      }
      request({
        url: this.mainData.api.updateUsingFlag,
        method: 'POST',
        data: {
          data: {
            usingFlag: '0',
            templateCode: row.templateCode
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.disable')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
          this.$refs.qmTable.getList()
        })
        .catch(() => {})
    }
  }
}
</script>
