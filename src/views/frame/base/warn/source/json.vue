<template>
  <qm-dialog :dialog='dialog' :param='param' :opType="opType" @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'dictShowEdit',
  data() {
    return {
      dialog: {
        type: 'update',
        initType: 'param',
        initChooseParam: this.initChooseParam,
        param: this.param,
        styleType: 'medium',
        titleName: '字段属性',
        api: {},
        formData: [
          {
            label: 'attrs',
            prop: 'json',
            element: 'el-input',
            attrs: {
              cols: 4,
              rows: 3,
              type: 'textarea',
              clearable: true
            }
          },
          {
            label: '字典下拉说明',
            prop: 'jsondata',
            element: 'el-input',
            attrs: {
              cols: 4,
              disabled: true,
              placeholder: ` 例子：{"filterable":true,"clearable":true, "datadict": "letterCreditDirection"  } `
            }
          },
          {
            label: '数据下拉说明',
            prop: 'jsondata',
            element: 'el-input',
            attrs: {
              cols: 4,
              disabled: true,
              placeholder: ` 例子：{"filterable":true,"clearable":true,"data":"FUNC_DEPT"} `
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
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
    },
    initChooseParam: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
