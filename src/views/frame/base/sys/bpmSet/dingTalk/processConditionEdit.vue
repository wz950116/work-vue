<template>
  <qm-edit :edit='edit' ref='qmEdit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  name: 'processConditionEdit',
  data() {
    return {
      edit: {
        type: this.param.opType || this.opType,
        mode: this.opMode,
        param: this.param,
        api: {
          view: '/api/dingtalk/bpmProcessBaseInfo/get'
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
            isShow: ['view', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'sys.bpmSet.group.detailPart1',
            content: [
              {
                prop: 'docKey',
                label: 'sys.bpmSet.form.moduleCode',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                prop: 'processId',
                label: 'sys.bpmSet.form.processId',
                element: 'input-validate',
                attrs: {
                  cols: 2,
                  disabled: true,
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            name: 'processConditionList',
            label: 'sys.bpmSet.tab.tabProcessConditionSet',
            component: () => import('./processConditionSet.vue')
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
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
    handleCloseDialog() {
      this.$emit('closeAndRefreshHandler')
    }
  }
}
</script>
