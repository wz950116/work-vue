<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.extraParam,
        initType: 'param',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          save: '/api/sys/file/save',
          update: '/api/sys/file/save'
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
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['assist', 'audit']
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: '单据信息',
            content: [
              {
                label: '单据号',
                prop: 'billNo',
                element: 'input-validate',
                attrs: {
                  cols: 2,
                  disabled: true
                }
              },
              {
                prop: 'billType',
                isShow: false
              }
            ]
          }
        },
        tabs: [
          {
            name: 'fleAttachment',
            label: 'biz.btn.uploadAttachment',
            component: () => import('./tab.vue')
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
    extraParam: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeHandler')
    }
  }
}
</script>
