<template>
  <qm-edit ref='edit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        initType: 'param',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          save: '/api/func/auditEmployee/savelist',
          update: '/api/func/auditEmployee/savelist'
        },
        apiData: {
          view(param) {
            return param.id
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.id
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view', 'detailSet'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'func.approvalGroup.group.editEmployeePart1',
            content: [
              {
                label: 'func.approvalGroup.form.name',
                prop: 'name',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'func.approvalGroup.form.groupCode',
                prop: 'groupCode',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            name: 'tabEmployee',
            label: 'func.approvalGroup.tab.tabEmployee',
            component: () => import('./tabEmployee.vue')
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
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
