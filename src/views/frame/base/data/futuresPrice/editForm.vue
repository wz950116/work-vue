<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'

export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/data/ddFuturesPrice/get',
          save: '/api/data/ddFuturesPrice/save',
          update: '/api/data/ddFuturesPrice/update'
        },
        apiData: {
          view(params) {
            return params.id
          },
          save(params) {
            return params.id
          },
          update(params) {
            return params.id
          }
        },
        formData: [
          {
            label: 'data.futuresPrice.form.contractCode',
            prop: 'contractCode',
            element: 'base-select',
            attrs: {
              data: 'FUTURES_CONTRACT',
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            type: 'date',
            label: 'data.futuresPrice.form.saveDate',
            prop: 'saveDate',
            default: dateFormate(new Date(), 'yyyyMMdd'),
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.futuresPrice.form.settlementPrice',
            prop: 'settlementPrice',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.futuresPrice.form.lastPrice',
            prop: 'lastPrice',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'data.futuresPrice.form.highestPrice',
            prop: 'highestPrice',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            label: 'data.futuresPrice.form.lowestPrice',
            prop: 'lowestPrice',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
            }
          },
          {
            label: 'data.futuresPrice.form.openPrice',
            prop: 'openPrice',
            element: 'input-formatter',
            attrs: {
              min: 0,
              max: 999999999999,
              type: 'thousands',
              precision: 2
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
