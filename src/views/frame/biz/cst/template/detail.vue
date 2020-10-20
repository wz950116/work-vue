<template>
  <qm-edit :edit="edit" @closeDialog="handleCloseDialog" ref="qmEdit"></qm-edit>
</template>

<script>
export default {
  name: 'cfgDictItem',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/cust/custTemplate/get',
          save: '/api/cust/custTemplateDetail/save',
          update: '/api/cust/custTemplateDetail/save'
        },
        apiData: {
          code: this.$route.params.templateCode,
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
                label: 'cst.template.form.templateCode',
                prop: 'templateCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'cst.template.form.templateName',
                prop: 'templateName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'cst.template.form.templateType',
                prop: 'templateType',
                element: 'base-select',
                list: this.$t('datadict.templateType'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'cst.template.form.usingFlag',
                prop: 'usingFlag',
                element: 'base-select',
                list: this.$t('datadict.usingFlag'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'cst.template.form.maxPoint',
                prop: 'maxPoint',
                element: 'input-formatter',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'cst.template.form.remark',
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
            name: 'detailList',
            label: 'sys.dict.editTitle',
            required: true,
            component: () => import('./itemTab.vue')
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
    submit() {
      this.$emit('closeHandler', true)
    },
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
