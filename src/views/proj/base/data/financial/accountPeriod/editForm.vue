<template>
  <qm-dialog ref="accountPeriodEdit" :initFun=initFun :dialog='dialog' @closeDialog='hanldeCloseDialog'></qm-dialog>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'

export default {
  data() {
    return {
      dialog: {
        type: this.$route.params.type,
        mode: this.opMode,
        param: this.$route.params,
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/data/accountPeriod/get',
          save: '/api/data/accountPeriod/save',
          update: '/api/data/accountPeriod/update'
        },
        apiData: {
          view(param) {
            return param.id
          },
          save(param) {
            return param.id
          },
          update(param) {
            return param.id
          }
        },
        formData: [
          {
            label: 'dataHq.accountPeriod.fiscalYear',
            prop: 'fiscalYear',
            element: 'el-date-picker',
            type: 'year',
            attrs: {
              data: 'fiscalYear',
              clearable: true,
              type: 'year',
              format: 'yyyy',
              'value-format': 'yyyy'
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'dataHq.accountPeriod.periodNumber',
            prop: 'periodNumber',
            element: 'el-input',
            default: '12',
            attrs: {
              data: 'periodNumber',
              disabled: true
            }
          },
          {
            label: 'dataHq.accountPeriod.quarterlyNumber',
            prop: 'quarterlyNumber',
            element: 'el-input',
            default: '4',
            attrs: {
              data: 'periodNumber',
              disabled: true
            }
          },
          {
            label: 'dataHq.accountPeriod.startDate',
            prop: 'startDate',
            element: 'el-date-picker',
            attrs: {
              data: 'startDate',
              clearable: true,
              type: 'date',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            event: {
              change: this.changeTime
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.accountPeriod.endDate',
            prop: 'endDate',
            type: 'date',
            attrs: {
              data: 'endDate',
              clearable: true,
              type: 'date',
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd',
              disabled: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'dataHq.accountPeriod.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          }
        ],
        bottomButtons: [
          {
            iconName: '线性-返回',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view']
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
            isShow: ['add', 'update']
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
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    hanldeCloseDialog(params) {
      this.$emit('closeHandler', params)
    },

    changeTime(date) {
      if (date.slice(-2) !== '01') {
        this.$refs.accountPeriodEdit.formData.startDate = this.$refs.accountPeriodEdit.formData.startDate.slice(0, 6) + '01'
      }
      var pattern = /(\d{4})(\d{2})(\d{2})/
      var formatedDate = this.$refs.accountPeriodEdit.formData.startDate.replace(pattern, '$1-$2-$3')
      var temDate = new Date(formatedDate)
      temDate.setFullYear(temDate.getFullYear() + 1)
      this.$refs.accountPeriodEdit.formData.endDate = dateFormate(
        new Date(temDate.setDate(temDate.getDate() - 1)),
        'YYYYMMDD'
      )
    },

    initFun(formData) {
      formData.fiscalYear = formData.fiscalYear + ''
    }
  }
}
</script>
