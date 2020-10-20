<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  name: 'processFormRelList',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/dingtalk/bpmProcessFormRel/list'
        },
        apiData: {
          search(param) {
            return {
              docKey: param.docKey,
              processId: param.processId
            }
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow'
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
              prop: 'processId',
              isShow: false
            },
            {
              prop: 'docKey',
              isShow: false
            },
            {
              prop: 'formName',
              width: '150',
              element: 'el-input',
              label: 'sys.bpmSet.tableTitle.formRel.formName',
              required: true,
              attrs: {
                clearable: true
              }
            },
            {
              prop: 'docFormCodeKey',
              width: '150',
              element: 'base-select',
              label: 'sys.bpmSet.tableTitle.formRel.docFormName',
              required: true,
              attrs: {
                data: 'DOC_FORM',
                params: {
                  docKey: this.param.docKey
                },
                clearable: true
              }
            },
            {
              prop: 'formType',
              width: '150',
              element: 'base-select',
              label: 'sys.bpmSet.tableTitle.formRel.formType',
              required: true,
              list: this.$t('datadict.formType'),
              attrs: {
                clearable: true,
                filterable: true
              }
            },
            {
              prop: 'requiredFlag',
              width: '150',
              element: 'base-select',
              label: 'sys.bpmSet.tableTitle.formRel.requiredFlag',
              required: true,
              list: this.$t('datadict.yesNo'),
              attrs: {
                clearable: true
              }
            },
            {
              prop: 'sortNum',
              minWidth: '50',
              element: 'input-formatter',
              label: 'sys.bpmSet.tableTitle.formRel.sortNum',
              attrs: {
                clearable: true
              }
            },
            {
              prop: 'remark',
              minWidth: '150',
              element: 'el-input',
              label: 'sys.bpmSet.tableTitle.formRel.remark',
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
    }
  },
  mounted() {},
  methods: {}
}
</script>
