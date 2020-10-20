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
          view: '/api/sys/sysNotice/get',
          save: '/api/sys/sysNotice/save',
          update: '/api/sys/sysNotice/update'
        },
        apiData: {
          view(param) {
            return param.id
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
                label: 'sys.notice.form.noticeTitle',
                prop: 'noticeTitle',
                element: 'input-validate',
                required: true,
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  cols: 2
                }
              },
              {
                type: 'date',
                label: 'sys.notice.form.noticeDate',
                prop: 'noticeDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'sys.notice.form.topFlag',
                prop: 'topFlag',
                element: 'base-select',
                list: this.$t('datadict.yesNo'),
                align: 'center',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            name: 'noticeContent',
            label: 'sys.notice.form.noticeContent',
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
      const win = this.$loopDOM(this, 'noticeContent')[0].template.editorWin
      if (win) {
        win.setContent(
          data.noticeContent
        )
      }
    },
    onSave() {
      this.$loopDOM(this, 'qmDialogEdit').editForm.noticeContent = this.$loopDOM(this, 'noticeContent')[0].template.editorWin.getContent()
      return true
    }
  }
}
</script>
