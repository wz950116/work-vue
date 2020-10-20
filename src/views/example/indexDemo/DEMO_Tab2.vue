<template>
  <qm-edit-tab ref='tab' :tab='tab' @closeHandler='dialogHandler'></qm-edit-tab>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: ''
        },
        topBar: [{
          name: 'add',
          type: 'dialog',
          iconName: '线性-增行',
          i18n: '弹窗增行',
          getParam() {
            return {}
          },
          component: () => import('@/views/example/indexDemo/productSelect.vue'),
          validate: this.validateAdd,
          setDefault: this.doAdd
        }, {
          name: 'delete',
          iconName: '线性-删行',
          i18n: 'biz.btn.deleteRow',
          callback: this.doDeleteRow
        }, {
          name: 'copy',
          iconName: '线性-复制',
          i18n: 'biz.btn.copy'
        }],
        table: {
          cols: [{
            label: '日期显示',
            prop: 'date',
            format: {
              func: 'dateFormat',
              dict: 'YYYY-MM-DD'
            }
          }, {
            label: '数字显示',
            prop: 'count',
            format: {
              func: 'thousands',
              dict: 3
            }
          }, {
            label: '金额显示',
            prop: 'money',
            format: {
              func: 'thousands',
              dict: 2
            }
          }, {
            label: '数据字典显示',
            prop: 'usingFlag',
            format: {
              dict: this.$t('datadict.usingFlag')
            }
          }]
        }
      }
    }
  },
  inject: ['app'],
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
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    // TAB二级弹窗回调处理
    dialogHandler() {
      // 置灰主信息中某个表单
      // this.$parent.$parent.$parent.edit.formData.part1.content[2].attrs.disabled = true
      this.app.edit.formData.part1.content[2].attrs.disabled = true
    },
    // 增行按钮做相应验证
    validateAdd() {
      if (!this.editForm.product.usingFlag) {
        this.$notify(
          notifyInfo({
            msg: this.$t('请选择状态')
          })
        )
        return false
      } else {
        return true
      }
    },
    // 增行打开弹窗设置默认查询条件
    doAdd() {
      this.$refs.tab.$refs.viewFormTab.$refs.qmDialogTable.listQuery.data.productCategoryName = '123'
    },
    doDeleteRow(param) {
      console.log(param, 111)
    }
  }
}
</script>
