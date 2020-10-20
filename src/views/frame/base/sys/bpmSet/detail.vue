<template>
  <qm-edit :edit='edit' ref='qmEdit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  name: 'bpmSetDetail',
  data() {
    return {
      edit: {
        type: 'view',
        mode: this.opMode,
        param: this.$route.params || this.param,
        api: {
          view: '/api/bpm/businessDefine/get'
        },
        apiData: {
          id: this.$route.params.id,
          view() {
            return {
              id: this.id,
              modeType: ''
            }
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
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'sys.bpmSet.group.detailPart1',
            content: [
              {
                label: 'sys.bpmSet.form.moduleCode',
                prop: 'moduleCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'sys.bpmSet.form.businessName',
                prop: 'businessName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },

              {
                label: 'sys.bpmSet.form.bpmType',
                prop: 'bpmType',
                element: 'base-select',
                list: this.$t('datadict.bpmType'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'sys.bpmSet.form.enableFlg',
                prop: 'enableFlg',
                element: 'base-select',
                list: this.$t('datadict.usingFlag'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'sys.bpmSet.form.processVersion',
                prop: 'processVersion',
                element: 'input-formatter',
                attrs: {
                  type: 'num',
                  disabled: true
                }
              },
              {
                label: 'sys.bpmSet.form.businessDesp',
                prop: 'businessDesp',
                element: 'el-input',
                attrs: {
                  cols: 3,
                  disabled: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            name: 'tabApprove',
            label: 'sys.bpmSet.tab.tabApprove',
            component: () => import('./activiti/tabApprove.vue'),
            isShow: this.$route.params.bpmType === 'activiti'
          },
          {
            name: 'tabEmployee',
            label: 'sys.bpmSet.tab.tabEmployee',
            component: () => import('./activiti/tabEmployee.vue'),
            isShow: this.$route.params.bpmType === 'activiti'
          },
          {
            name: 'tabProcessSet',
            label: 'sys.bpmSet.tab.tabProcessSet',
            component: () => import('./dingTalk/tabProcessSet.vue'),
            isShow: this.$route.params.bpmType === 'dingTalk'
          },
          {
            name: 'tabDocFormPreview',
            label: 'sys.bpmSet.tab.tabDocFormPreview',
            component: () => import('./dingTalk/tabDocFormPreview.vue'),
            isShow: this.$route.params.bpmType === 'dingTalk'
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
      default: 'router'
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
</script>
