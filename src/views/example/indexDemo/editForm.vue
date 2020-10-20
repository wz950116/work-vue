<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @closeLv2Dialog='handleCloseLv2Dialog'></qm-edit>
</template>

<script>
import Vue from 'vue'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'editTagDemo',
  data() {
    return {
      edit: {
        type: (this.$route.params && this.$route.params.type) || (this.$route.query && this.$route.query.type) || this.opType,
        param: this.param || this.$route.params || this.$route.query,
        mode: this.opMode,
        api: {
          view: '/get',
          save: '/save',
          update: '/update',
          tableId: '/table'
        },
        apiData: {
          tableId(param) {
            return param
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            callback: this.handleCloseDialog,
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
            iconName: '线性-打印',
            name: 'biz.btn.print',
            event: 'print',
            isShow: true,
            component: () => import('@/views/example/dialogDemo/edit.vue') // 组件
          },
          {
            iconName: '线性-提交',
            name: '1号弹窗',
            event: this.dialogEvent,
            isShow: ['add', 'update']
          },
          {
            iconName: '线性-提交',
            name: '2号弹窗',
            event: 'set',
            isShow: ['add', 'update'],
            component: () => import('@/views/example/indexDemo/productSelect.vue'), // 组件
            validate: this.validateEvent, // 验证
            setDefault: this.doSet, // 设置默认值
            beforeCallback: this.closeCallbackValidate, // 关闭弹窗之前的验证 return true or false
            callback: this.closeCallback // 关闭弹窗回调
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            isShow: ['add', 'update'],
            extraEvent: this.save,
            showAttachment: true, // 是否在新增保存后打开附件上传弹窗
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.upload',
            iconName: '线性-上传',
            event: 'upload',
            isShow: ['add', 'update']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            dtoKey: 'product',
            hidden: false, // 若为true则隐藏该部分
            titleName: '主信息',
            content: [
              {
                type: 'date',
                label: '时间区间选择',
                props: ['startTime2', 'endTime2'],
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
                label: '查询选择',
                prop: 'productName',
                element: 'base-dialog-select',
                component: () => import('@/views/example/indexDemo/productSelect.vue'),
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
                component: () => import('@/views/example/indexDemo/productSelect.vue'),
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
                ],
                event: this.AAA
              },
              {
                type: 'combine',
                label: '组合组件',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                elements: [
                  {
                    prop: 'aaa',
                    element: 'input-validate',
                    attrs: {
                      clearable: true
                    }
                  },
                  {
                    prop: 'bbb',
                    element: 'base-select',
                    list: this.$t('datadict.usingFlag'),
                    default: '0',
                    attrs: {
                      clearable: true
                    },
                    event: this.AAA
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
          },
          part2: {
            titleName: '副信息',
            content: [
              {
                label: '商品名称',
                prop: 'productCategoryName',
                element: 'input-validate',
                attrs: {
                  clearable: true
                },
                default: '铝锭',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              {
                type: 'numberInterval',
                label: '数值区间',
                props: ['startValue', 'endValue'],
                attrs: {
                  startMin: 0,
                  startMax: 999999999999.99,
                  endMin: 0,
                  endMax: 999999999999.99,
                  type: 'thousands',
                  precision: 3
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              }
            ]
          }
        },

        tables: [
          {
            name: 'DEMO_Tab11',
            label: '商品信息',
            component: () => import('./DEMO_Tab.vue'),
            isShow: ['add', 'update'],
            required: true
          },
          {
            name: 'DEMO_Tab22',
            label: '发货计划',
            component: () => import('./DEMO_Tab2.vue'),
            isShow: ['view']
          }
        ],

        tabs: [
          {
            name: 'DEMO_Tab',
            label: '商品信息',
            component: () => import('./DEMO_Tab.vue'),
            isShow: ['add', 'update'],
            required: true
          },
          {
            name: 'DEMO_Tab2',
            label: '发货计划',
            component: () => import('./DEMO_Tab2.vue'),
            isShow: ['add', 'update']
          },
          {
            name: 'DEMO_Tab3',
            label: '表单内容',
            component: () => import('./DEMO_Tab3.vue')
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
      default: 'route'
    },
    param: {
      type: [Object, String],
      default() {
        return null
      }
    }
  },
  methods: {
    save() {
      if (1 === 1) {
        return new Promise((resolve, reject) => {
          this.$confirm(this.$t('biz.msg.confirmSubmitAudit'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              resolve(true)
            })
            .catch(() => {
              resolve(false)
            })
        })
      } else {
        return new Promise((resolve, reject) => {
          // http请求模拟
          setTimeout(() => {
            console.log(111)
            resolve(true)
          }, 2000)
        })
      }
    },
    // 按钮做相应验证
    validateEvent() {
      if (!this.$refs.qmEdit.$refs.qmRouteEdit.editForm.product.usingFlag) {
        this.$notify(
          notifyInfo({
            msg: this.$t('请选择状态')
          })
        )
        return false
      } else {
        return true
      }
    },
    // 设置打开弹窗默认值
    doSet(editForm) {
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.usingFlag = editForm.product.usingFlag
    },
    dialogEvent() {
      Vue.component('view-form-edit', () => import('@/views/example/indexDemo/productSelect.vue'))
      this.$refs.qmEdit.$refs.qmRouteEdit.dialogLv2Visible = true
    },
    handleCloseDialog(params) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', params)
      } else {
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: 'indexDemo'
          })
        })
      }
    },
    handleCloseLv2Dialog(param) {
      console.log(param, 123)
    },
    closeCallbackValidate(param) {
      return false
    },
    closeCallback(param) {
      console.log('2号弹窗关闭回调方法')
    },
    secondCloseCallback(param) {
      console.log('3号弹窗关闭回调方法')
    },
    thirdCloseCallback(param) {
      console.log('4号弹窗关闭回调方法')
    },
    onChange(params) {
      console.log(params, 111)
    },
    onEvn(params) {
      console.log(params, 222)
    },
    onChangeAll(params) {
      console.log(params, 333)
    },
    AAA() {
      console.log(888)
    }
  }
}
</script>
