<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  name: 'warningDetail',
  data() {
    return {
      edit: {
        type: 'view',
        mode: 'route',
        param: this.$route.params,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/warn/warning/get'
        },
        apiData: {
          view(param) {
            return param.code
          }
        },
        topButtons: [
          {
            iconName: '线性-取消',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: this.$t('data.warning.warningInfo'),
            content: [
              {
                label: 'data.warning.warningName',
                prop: 'warningName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'data.warning.warningType',
                prop: 'warningType',
                element: 'base-select',
                attrs: {
                  datadict: 'warningType',
                  disabled: true
                }
              },
              {
                label: 'data.warning.sourceCode',
                prop: 'sourceCode',
                element: 'base-select',
                attrs: {
                  disabled: true,
                  data: 'WARN_SOURCE'
                }
              },
              {
                label: 'data.warning.triggerType',
                prop: 'triggerType',
                element: 'base-select',
                list: this.$t('datadict.triggerType'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'data.warning.triggerTime',
                prop: 'triggerTime',
                element: 'el-time-picker',
                attrs: {
                  disabled: true,
                  pickerOptions: {
                    start: '00:00',
                    step: '01:00'
                  },
                  valueFormat: 'HHmmss'
                }
              },
              {
                prop: 'recordFlag',
                width: '100',
                label: 'data.warning.recordFlag',
                list: this.$t('datadict.yesNo'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'biz.lbl.usingFlag',
                prop: 'usingFlag',
                element: 'base-select',
                list: this.$t('datadict.usingFlag'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  disabled: true
                }
              }
            ]
          }
        },
        tabs: [
          {
            name: 'employeeTab',
            label: this.$t('data.warning.warningStaff'),
            component: () => import('./employeeTab.vue')
          },
          {
            name: 'msgTemplate',
            label: this.$t('data.warning.msgTemplate'),
            component: () => import('./msgTemplateTab.vue')
          },
          {
            name: 'warningCond',
            label: this.$t('data.warning.warningCond'),
            component: () => import('./condTab.vue'),
            isShow: this.$route.params.warningType === 'metrics'
          },
          {
            name: 'warningColumn',
            label: this.$t('data.warning.warningColumn'),
            component: () => import('./columnTab.vue'),
            isShow: this.$route.params.warningType === 'metrics'
          }
        ]
      }
    }
  },
  methods: {
    handleCloseDialog(param) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', param)
      } else {
        const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: backName,
            params: { ...(!!param && { refresh: !!param }) }
          })
        })
      }
    }
  }
}
</script>
