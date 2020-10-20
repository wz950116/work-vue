<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: ''
        },
        formData: [
          {
            type: 'date',
            label: '时间区间选择',
            props: ['startTime2', 'endTime2'],
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: '查询选择',
            prop: 'productName',
            element: 'base-dialog-select',
            component: () =>
              import('@/views/example/indexDemo/productSelect.vue'),
            attrs: {
              data: '品种弹窗选择',
              clearable: true
            },
            callback: this.secondCloseCallback
          },
          {
            label: '查询选择2',
            prop: 'productName2',
            element: 'base-dialog-select',
            component: () =>
              import('@/views/example/indexDemo/productSelect.vue'),
            attrs: {
              data: '品种弹窗选择',
              clearable: true
            },
            callback: this.thirdCloseCallback
          },
          {
            label: '商品简称',
            prop: 'productCategoryAbbr',
            element: 'input-validate',
            attrs: {
              clearable: true,
              disabled: false
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: '客户名称',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO', // 统一基础档案组件，传值data区分
              clearable: true,
              params: {
                typeCode: '4' // 不写:所有客户供应商经济商仓储公司， '1'只显示客户，'2'只显示供应商，
              }
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            event: {
              change: this.onChange,
              evn: this.onEvn,
              changeAll: this.onChangeAll
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
            label: '备注',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 2
            }
          }
        ]
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    editForm: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    onChange(params) {
      console.log(params, 111)
    },
    onEvn(params) {
      console.log(params, 222)
    },
    onChangeAll(params) {
      console.log(params, 333)
    }
  }
}
</script>
