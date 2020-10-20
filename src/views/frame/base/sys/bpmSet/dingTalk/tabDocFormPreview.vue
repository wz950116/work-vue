<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  name: 'docFormPreview',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/dingtalk/bpmDocFormInfo/list'
        },
        apiData: {
          search(param) {
            return {
              docKey: param.moduleCode
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
                docKey: this.getDocKey()
              }
            },
            component: () => import('./docFormInfoEdit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam: () => {
              const row = this.$refs.tab.currentRow
              if (row) {
                return {
                  id: row.id,
                  docKey: row.docKey
                }
              }
            },
            component: () => import('./docFormInfoEdit.vue')
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            callback: this.deleteRowCallBack
          }
        ],
        table: {
          required: true,
          height: 200,
          showSelection: false,
          cols: [
            {
              prop: 'formBelongType',
              width: '100',
              label: 'sys.bpmSet.tableTitle.docForm.formBelongType',
              align: 'center',
              format: {
                dict: this.$t('datadict.docFormBelongType')
              }
            },
            {
              prop: 'formCodeKey',
              width: '150',
              label: 'sys.bpmSet.tableTitle.docForm.code'
            },
            {
              prop: 'formCodeName',
              width: '150',
              label: 'sys.bpmSet.tableTitle.docForm.name'
            },
            {
              prop: 'dataType',
              width: '100',
              label: 'sys.bpmSet.tableTitle.docForm.dataType',
              align: 'center',
              format: {
                dict: this.$t('datadict.formDataType')
              }
            },
            {
              prop: 'fieldInputType',
              width: '100',
              label: 'sys.bpmSet.tableTitle.docForm.fieldInputType',
              align: 'center',
              format: {
                dict: this.$t('datadict.fieldInputType')
              }
            },
            {
              prop: 'fieldAttrJson',
              width: '300',
              label: 'sys.bpmSet.tableTitle.docForm.fieldAttrJson'
            },
            {
              prop: 'sortNum',
              width: '50',
              label: 'sys.bpmSet.tableTitle.docForm.sortNum'
            },
            {
              prop: 'remark',
              minWidth: '300',
              label: 'sys.bpmSet.tableTitle.docForm.remark'
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
      return this.param.moduleCode
    },
    /**
     * 删行回调
     */
    deleteRowCallBack(currentRow) {
      request({
        url: '/api/dingtalk/bpmDocFormInfo/remove',
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
    },
    /**
     * 校验是否选中行
     */
    isSelectedRow() {
      if (this.$refs.tab.currentRow) {
        return true
      }
      this.$notify(
        notifyInfo({
          msg: this.$t('biz.msg.noRowSelected')
        })
      )
      return false
    }
  }
}
</script>
