<template>
  <qm-dialog ref="dialog" :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
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
          view: '/api/data/ddFsCompare/get',
          save: '/api/data/ddFsCompare/save',
          update: '/api/data/ddFsCompare/update'
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
            type: 'date',
            label: 'data.futuresSpotCompare.form.saveDate',
            prop: 'saveDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'data.futuresSpotCompare.form.compareType',
            prop: 'compareType',
            element: 'base-select',
            list: this.$t('datadict.compareType'),
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            event: this.typeChange
          },
          {},
          {
            label: 'data.futuresSpotCompare.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true,
              params: {
                usingFlag: '1'
              }
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'data.futuresSpotCompare.form.productOtherName',
            prop: 'productOtherName',
            element: 'input-validate',
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
          ,
          {
            label: 'data.futuresSpotCompare.form.remark',
            prop: 'remark',
            element: 'input-validate',
            attrs: {
              clearable: true,
              cols: 3
            },
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
  mounted() {
    setTimeout(() => {
      this.typeChange()
    }, 500);
  },
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    typeChange() {
      const type = this.$refs.dialog.formData.compareType
      if (type === '1') {
        this.dialog.formData[3].attrs.data = 'DD_PRODUCT'
        this.dialog.formData[3].attrs.params = {
          usingFlag: '1'
        }
      }
      if (type === '2') {
        this.dialog.formData[3].attrs.data = 'FUTURES_VARIETIES'
        this.dialog.formData[3].attrs.params = {
          usingFlag: '1',
          futuresVarietiesType: '1'
        }
      }
      if (type === '3') {
        this.dialog.formData[3].attrs.data = 'FUTURES_VARIETIES'
        this.dialog.formData[3].attrs.params = {
          usingFlag: '1',
          futuresVarietiesType: '2'
        }
      }
    }
  }
}
</script>
