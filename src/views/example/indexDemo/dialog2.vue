<template>
  <qm-dialog-tab ref='qmDialogTab' :dialog='dialog' @closeDialog='handleCloseDialog' @closeLv2Dialog='handleCloseLv2Dialog'></qm-dialog-tab>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        param: this.param,
        titleName: '下拉选弹窗',
        api: {
          view: '/get',
          save: '/save',
          update: '/update'
        },
        tabs: [{
          name: 'DEMO_Tab',
          label: '常见数据',
          component: () => import ('./productSelect2.vue'),
          isShow: true,
          required: true
        }, {
          name: 'DEMO_Tab2',
          label: '全部数据',
          component: () => import ('./edit5.vue'),
          isShow: true,
          required: true
        }],
        bottomButtons: [{
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['view']
        }, {
          name: 'biz.btn.choose',
          event: 'choose',
          isShow: ['add', 'update'],
          attrs: {
            type: 'primary'
          }
        }]
      }
    }
  },
  provide() {
    return {
      app: this
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
      default () {
        return {}
      }
    }
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params.productCategoryName)
    },
    handleCloseLv2Dialog(param) {
      console.log('2号弹窗关闭回调方法')
    }
  }
}
</script>
