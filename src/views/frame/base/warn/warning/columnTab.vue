<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='dialogHandler'></qm-edit-tab>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        type: 'view',
        param: this.param,
        editForm: this.editForm,
        api: {
          search: '/api/warn/source/listColumn'
        },
        apiData: {
          search(param) {
            return param.sourceCode
          }
        },
        topBar: [],
        table: {
          required: true,
          height: 200,
          showSelection: false,
          cols: [
            {
              prop: 'colCode',
              width: '160',
              label: 'data.warnSource.colCode',
              required: true
            },
            {
              prop: 'colName',
              width: '150',
              element: 'el-input',
              label: 'data.warnSource.colName',
              required: true,

              attrs: {
                clearable: true
              }
            },
            {
              prop: 'remark',
              minWidth: '300',
              element: 'el-input',
              label: 'biz.lbl.remark',
              attrs: {
                clearable: true
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
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    editForm: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {}
}
</script>
