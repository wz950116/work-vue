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
          view: '/api/dd/organ/calendar/get',
          save: '/api/dd/organ/calendar/save',
          update: '/api/dd/organ/calendar/update'
        },
        apiData: {
          view(params) {
            return params.id
          }
        },
        formData: [{
          label: 'data.organCalendar.form.organCode',
          prop: 'organCode',
          element: 'base-select',
          validate: [{
            required: true,
            trigger: 'change'
          }],
          attrs: {
            data: 'TREE_ORGAN',
            clearable: true,
            usingFlag: '1'
          }
        }, {
          type: 'date',
          label: 'data.organCalendar.form.calendar',
          prop: 'calendarDate',
          attrs: {
            clearable: true,
            format: 'yyyy-MM-dd',
            'value-format': 'yyyyMMdd'
          }
        }],
        bottomButtons: [{
          iconName: '线性-关闭',
          name: 'biz.btn.close',
          event: 'close',
          isShow: ['view'],
          attrs: {
            type: 'primary'
          }
        }, {
          iconName: '线性-取消',
          name: 'biz.btn.cancel',
          event: 'cancel',
          isShow: ['add', 'update']
        }, {
          name: 'biz.btn.save',
          iconName: '线性-保存',
          event: 'save',
          showLoading: true,
          isShow: ['add', 'update'],
          attrs: {
            type: 'primary'
          }
        }]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
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
