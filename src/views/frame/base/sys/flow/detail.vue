<template>
  <qm-edit :edit="edit" @closeDialog="handleCloseDialog" ref="qmEdit"></qm-edit>
</template>

<script>
export default {
  name: 'sysFlowDetail',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/sys/flow/get',
          save: '/api/sys/flowNode/save',
          update: '/api/sys/flowNode/save'
        },
        apiData: {
          code: this.$route.params.code,
          view() {
            return this.code
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
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'biz.title.mainInfo',
            content: [
              {
                label: 'sys.flow.name',
                prop: 'name',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'sys.flow.code',
                prop: 'code',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true
                }
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
                ],
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'sys.flow.flowType',
                prop: 'flowType',
                element: 'base-select',
                list: this.$t('datadict.sysFlowType'),
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'sys.flow.startBillType',
                prop: 'startBillType',
                element: 'base-select',
                list: this.$t('datadict.bizCode'),
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
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
            name: 'sysFlowNodes',
            label: 'sys.flow.sysFlowNodes',
            required: true,
            component: () => import('./nodeTab.vue')
          }
        ]
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
