<template>
  <qm-dialog-table ref="dialog" :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
import { addtype } from '@/api/frame/base/finance'

export default {
  name: 'employeeEdit',
  data() {
    return {
      dialog: {
        titleName: '账套设置类型新增',
        mainData: {
          initSearch: false,
          api: {
            search: '/api/finance/ztBill/listByNotAccount'
          },
          apiData: {
            search(defaultParams) {
              return {
                ...defaultParams,
                data: this.param.accountId
              }
            }
          },
          table: {
            showCheckbox: true,
            cols: [
              {
                prop: 'name',
                label: '单据类型'
              },
              {
                prop: 'state',
                label: '状态',
                format: {
                  func: 'isState'
                }
              },
              {
                prop: 'remark',
                label: '备注'
              }
            ]
          }
        },

        bottomButtons: [{
          name: 'biz.btn.cancel',
          event: 'cancel'
        }, {
          name: 'biz.btn.save',
          event: 'choose',
          isShow: ['add', 'update'],
          attrs: {
            type: 'primary'
          }
        }]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.dialog.mainData.apiData.search = (params) => {
        return {
          ...params,
          data: this.param.accountId
        }
      }
      this.$refs.dialog.getList()
    })
  },
  methods: {
    handleNode(node) {
      if (node) {
        this.$refs.qmDialog.formData.orgCode = node.orgCode
      }
    },
    getDefaultOrgCode() {
      if (this.opType === 'add' && this.param && this.param.accountId) {
        return this.param.accountId
      }
      return ''
    },
    handleCloseDialog(param) {
      if (param) {
        const billCodes = param.map(v => v.id).join(',')
        addtype({ data: { ...this.param, billCodes }}).then(data => {
          if (data.data === true) {
            this.$emit('closeHandler', true)
          }
        })
      } else {
        this.$emit('closeHandler', param)
      }
    }
  }
}
</script>
