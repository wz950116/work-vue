<template>
  <qm-edit :edit="edit" @closeDialog="handleCloseDialog" ref="qmEdit"></qm-edit>
</template>

<script>
export default {
  name: 'funcParam',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/msg/func/get',
          save: '/api/msg/funcParam/saveParam',
          update: '/api/msg/funcParam/saveParam'
        },
        apiData: {
          code: this.$route.params.funcCode,
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
                label: 'msg.func.msgFuncCode',
                prop: 'msgFuncCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'msg.func.msgFuncName',
                prop: 'msgFuncName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'msg.func.msgClassType',
                prop: 'msgClassType',
                element: 'base-select',
                list: this.$t('datadict.msgClassType'),
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
            name: 'funcParam',
            label: 'msg.func.set',
            component: () => import('./paramTab.vue')
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
