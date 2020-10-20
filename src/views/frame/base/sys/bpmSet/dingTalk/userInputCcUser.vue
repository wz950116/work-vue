<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
        },
        apiData: {
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            event: this.doAddRow
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow'
          }
        ],
        table: {
          cols: [
            {
              label: '抄送节点',
              prop: 'ccPosition',
              element: 'base-select',
              width: '270',
              default: 'APPROVED',
              list: [
                { value: 'START', code: 'START', label: '开始' },
                { value: 'APPROVED', code: 'APPROVED', label: '通过' },
                { value: 'REJECT', code: 'REJECT', label: '拒绝' },
                { value: 'TERMINATE', code: 'TERMINATE', label: '撤销' }
              ],
              required: true,
              attrs: {
                multiple: true,
                clearable: true
              }
            },
            {
              label: '抄送人',
              prop: 'ccUserId',
              element: 'base-select',
              required: true,
              attrs: {
                filterable: true,
                clearable: true,
                data: 'DING_USER_INFO',
                multiple: true
              }
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'param'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  beforeMount() {
  },
  mounted() {
    if (Array.isArray(this.param.dingCcUserList)) {
      const tableData = this.$refs.tab.tableData
      for (let i = 0; i < this.param.dingCcUserList.length; i++) {
        const row = this.param.dingCcUserList[i]
        let ccPosition = null
        let ccUserId = null
        if (Array.isArray(row.ccPosition) && row.ccPosition.length > 0) {
          ccPosition = row.ccPosition
        }
        if (Array.isArray(row.ccUserId) && row.ccUserId.length > 0) {
          ccUserId = row.ccUserId
        }
        tableData.push({
          ccPosition: ccPosition,
          ccUserId: ccUserId
        })
      }
    }
  },
  methods: {
    doAddRow() {
      const datalist = toolUtil.getDataTabFromSelf(this)
      datalist.push({
        ccPosition: ['APPROVED']
      })
    }
  }
}
</script>
