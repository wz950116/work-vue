<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
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
        titleName: this.$t('sys.log.operationDetail'),
        api: {
          view: '/api/sys/log/operation/detail'
        },
        apiData: {
          view() {
            return this.params
          }
        },
        topButtons: [{
          iconName: '线性-关闭',
          name: 'biz.btn.close',
          event: 'close',
          isShow: ['view'],
          attrs: {
            type: 'primary'
          }
        }],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'biz.title.mainInfo',
            content: [{
              label: 'sys.log.operationTime',
              prop: 'createDate',
              element: 'input-validate'
            }, {
              label: 'sys.log.account',
              prop: 'account',
              element: 'input-validate'
            },
            {
              label: 'sys.log.bizModel',
              prop: 'funcModule',
              element: 'input-validate'
            }, {
              label: 'sys.log.operation',
              prop: 'funcOperation',
              element: 'input-validate'
            }, {
              label: 'sys.log.bizData',
              prop: 'dataType',
              element: 'input-validate'
            }, {
              label: 'sys.log.outline',
              prop: 'dataDescription',
              element: 'input-validate'
            }]
          }
        },
        tabs: [
          {
            name: 'dataDetail',
            label: 'sys.log.dataDetail',
            component: () => import('./dataDetail.vue')
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
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
