<template>
  <qm-dialog ref='qmDialog' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
import request from '@/utils/frame/base/request'

export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        titleName: '增行',
        api: {
          view: '',
          save: '',
          update: ''
        },
        formData: [
          {
            type: 'date',
            label: '时间区间选择2',
            props: ['startTime2', 'endTime2'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            validate: [{
              required: true,
              trigger: 'change'
            }]
          },
          {
            label: '商品名称',
            prop: 'productCategoryName',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: '查询选择',
            prop: 'productName',
            element: 'base-dialog-select',
            component: () => import('@/views/example/indexDemo/productSelect.vue'),
            attrs: {
              data: '品种弹窗选择',
              clearable: true
            }
          },
          {
            label: '商品编码',
            prop: 'productCategoryCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: '状态',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            default: '0',
            attrs: {
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
            label: '期始日期',
            prop: 'startDate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            event: {
              change: this.changeStartTime
            },
            attrs: {
              type: 'start',
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            type: 'date',
            label: '期止日期',
            prop: 'endDate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            event: {
              change: this.changeEndTime
            },
            attrs: {
              type: 'end',
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            type: 'checkbox',
            label: '多选框',
            prop: 'checkbox',
            list: [{
              label: '选项1',
              value: '1'
            }, {
              label: '选项2',
              value: '2'
            }],
            default: []
          },
          {
            label: '备注',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 2
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            event: 'save',
            extraEvent: this.save,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.submit',
            event: this.submit,
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
    async save() {
      // if (1 === 2) {
      //   return new Promise((resolve, reject) => {
      //     this.$confirm(
      //       this.$t('biz.msg.confirmSubmitAudit'),
      //       this.$t('biz.msg.tip'),
      //       {
      //         type: 'warning',
      //         closeOnClickModal: false,
      //         confirmButtonText: this.$t('biz.btn.confirm'),
      //         cancelButtonText: this.$t('biz.btn.cancel')
      //       }
      //     )
      //       .then(() => {
      //         resolve(true)
      //       })
      //       .catch(() => {
      //         resolve(false)
      //       })
      //   })
      // } else {
      //   return new Promise((resolve, reject) => {
      //     // http请求模拟
      //     setTimeout(() => {
      //       console.log(111)
      //       resolve(true)
      //     }, 2000)
      //   })
      // }

      try {
        const result = await request({
          url: '/api/dd/product/list22',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {}
          }
        })
        if (result.data.length) {
          return 11112222
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    },
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    // 开始时间变化
    changeStartTime(date) {
      this.dateEndBefore = {
        disabledDate(time) {
          return dateFormate(time, 'YYYYMMDD') * 1 < date * 1
        }
      }
    },
    // 结束时间变化
    changeEndTime(date) {
      this.dateStartBefore = {
        disabledDate(time) {
          return date ? dateFormate(time, 'YYYYMMDD') * 1 > date * 1 : false
        }
      }
    }
  }
}
</script>
