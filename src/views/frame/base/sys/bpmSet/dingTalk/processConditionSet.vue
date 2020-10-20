<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  name: 'processConditionList',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/dingtalk/bpmProcessCondition/list'
        },
        apiData: {
          search(praram) {
            return {
              docKey: praram.docKey,
              processId: praram.processId
            }
          }
        },
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            i18n: 'biz.btn.add',
            getParam: () => {
              return {
                docKey: this.getDocKey(),
                processId: this.getProcessId()
              }
            },
            component: () => import('./processConditionEditDialog.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam: () => {
              const row = this.$refs.tab.currentRow
              if (row) {
                return {
                  id: row.id,
                  docKey: this.getDocKey()
                }
              }
            },
            component: () => import('./processConditionEditDialog.vue')
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            callback: this.deleteRowCallBack
          }
        ],
        table: {
          cols: [
            {
              prop: 'conditionDimension',
              width: '150',
              element: 'base-select',
              label: 'sys.bpmSet.tableTitle.processCondition.conditionDimension',
              attrs: {
                disabled: true,
                data: 'DOC_FORM',
                params: {
                  docKey: this.param.docKey
                }
              }
            },
            {
              prop: 'relOperator',
              width: '150',
              label: 'sys.bpmSet.tableTitle.processCondition.relOperator',
              format: {
                dict: this.$t('datadict.relationOperator')
              }
            },
            {
              prop: 'conditionValueDescription',
              width: '300',
              label: 'sys.bpmSet.tableTitle.processCondition.conditionValue'
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
  methods: {
    /**
     * 获取单据key
     */
    getDocKey() {
      return this.param.docKey
    },
    /**
     * 获取流程id
     */
    getProcessId() {
      return this.param.processId
    },
    /**
     * 删行回调
     * @param {Object} currentRow 当前行
     */
    deleteRowCallBack(currentRow) {
      request({
        url: '/api/dingtalk/bpmProcessCondition/remove',
        method: 'POST',
        data: {
          data: currentRow.id,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.delete')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.updateSuccess') }))
        })
        .catch(() => {})
    }
  }
}
</script>
