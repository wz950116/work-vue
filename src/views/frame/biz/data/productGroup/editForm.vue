<template>
  <qm-dialog :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/dd/product/group/get',
          save: '/api/dd/product/group/save',
          update: '/api/dd/product/group/update'
        },
        formData: [
          {
            label: 'data.productGroup.form.parentCode',
            prop: 'parentCode',
            element: 'tree-group',
            default: this.getDefaultCode(),

            component: () => import('./TreeProductGroup.vue'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.productGroup.form.productGroupName',
            prop: 'productGroupName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          }
        ],
        bottomButtons: [
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
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    getDefaultCode() {
      if (this.opType === 'add') {
        return this.param
      } else {
        return ''
      }
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
