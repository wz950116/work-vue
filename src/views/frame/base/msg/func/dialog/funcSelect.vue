<template>
  <qm-dialog-table :dialog='dialog' ref="qmDialogTable" @closeDialog='handleCloseDialog'></qm-dialog-table>
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
        titleName: this.$t('msg.func.title'),
        moreShowFlg: false,
        formData: [
          {
            label: 'msg.func.msgFuncCode',
            prop: 'msgFuncCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'msg.func.msgFuncName',
            prop: 'msgFuncName',
            element: 'input-validate',
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
        ],

        mainData: {
          initSearch: true,
          api: {
            search: '/api/msg/func/list'
          },
          table: {
            showCheckbox: false,
            cols: [
              {
                prop: 'msgFuncCode',
                width: '220',
                label: 'msg.func.msgFuncCode'
              },
              {
                prop: 'msgFuncName',
                minWidth: '220',
                label: 'msg.func.msgFuncName'
              },
              {
                prop: 'usingFlag',
                width: '220',
                align: 'center',
                label: 'biz.lbl.usingFlag',
                format: {
                  dict: this.$t('datadict.usingFlag')
                }
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
      this.$emit('closeHandler', param)
    },
    save() {
      const currentRow = this.$refs.qmDialogTable.currentRow
      if (!currentRow || currentRow === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      } else {
        request({
          url: '/api/warn/warning/relateMsgFuncCode',
          method: 'post',
          data: {
            data: {
              warningCode: this.param,
              msgFuncCode: currentRow.msgFuncCode
            },
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
          }
        })
          .then(response => {
            this.$notify(
              notifySuccess({
                msg: this.$t('biz.msg.saveSuccess')
              })
            )
            this.$emit('closeHandler', true)
          })
          .catch(() => {
            this.$emit('closeHandler')
          })
      }
    }
  }
}
</script>
