<template>
  <qm-dialog-table :dialog='dialog' ref="qmTable" @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  props: {
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialog: {
        titleName: this.$t('func.api.title'),
        moreShowFlg: false,
        formData: [
          {
            label: 'platform.api.api',
            prop: 'apiUrl',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ],

        mainData: {
          initSearch: true,
          api: {
            search: '/api/platform/cfgApi/list'
          },
          table: {
            showCheckbox: true,
            cols: [
              {
                prop: 'apiUrl',
                label: 'func.api.apiUrl'
              },
              {
                prop: 'apiCode',
                label: 'func.api.apiCode'
              },
              {
                prop: 'apiMemo',
                label: 'func.api.apiMemo'
              }
            ]
          }
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        },
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel'
          },
          {
            name: 'biz.btn.save',
            event: this.save,
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeAndRefreshHandler', param)
    },
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
          userCodeArr.push({ apiUrl: select.apiUrl, apiCode: select.apiCode, apiMemo: select.apiMemo, roleCode: this.param })
        })
        this.loading = true
        request({
          url: '/api/func/roleApi/save',
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
