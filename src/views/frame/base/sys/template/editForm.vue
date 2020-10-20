<template>
  <qm-edit :edit="edit" @closeDialog="handleCloseDialog" ref="qmEdit" @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
export default {
  name: 'templateFrom',
  data() {
    return {
      editorWin: null,
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        api: {
          view: '/api/sys/template/get',
          save: '/api/sys/template/save',
          update: '/api/sys/template/update'
        },
        apiData: {
          view(param) {
            return param.templateCode
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update', 'detailSet']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            isShow: ['add', 'update', 'detailSet'],
            attrs: {
              type: 'primary'
            },
            extraEvent: this.onSave
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'biz.title.mainInfo',
            content: [
              {
                label: 'file.template.templateCode',
                prop: 'templateCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'file.template.templateName',
                prop: 'templateName',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              {
                label: 'file.template.businessCategory',
                prop: 'billType',
                element: 'base-select',
                list: this.$t('datadict.templateCategory'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              {
                label: 'biz.lbl.usingFlag',
                prop: 'usingFlag',
                element: 'base-select',
                list: this.$t('datadict.usingFlag'),
                default: '1',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4
                }
              }
            ]
          }
        },

        tabs: [
          {
            name: 'templateInfo',
            label: 'file.template.template',
            component: () => import('./qmeditor.vue')
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
    opMode: {
      type: String,
      default: 'dialog'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    },
    handleInitCallback(data) {
      const win = this.$loopDOM(this, 'templateInfo')[0].template.editorWin
      if (win) {
        win.setContent(
          data.templateContent
        )
      }
    },
    onSave() {
      this.$loopDOM(this, 'qmDialogEdit').editForm.templateContent = this.$loopDOM(this, 'templateInfo')[0].template.editorWin.getContent()
      return true
    }
  }
}
</script>
