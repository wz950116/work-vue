<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @closeLv2Dialog='handleCloseLv2Dialog'></qm-edit>
</template>

<script>
import Vue from 'vue'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    const validator = (rule, value, callback, prop) => {
      if (value.length < 6) {
        $('.el-col[data-key=' + prop + '] .is-required .el-form-item__content').attr('data-content', '不得少于6位字符')
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/get',
          save: '/save',
          update: '/update'
        },
        topButtons: [
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
            iconName: '线性-提交',
            name: 'biz.btn.submit',
            event: this.submit,
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-提交',
            name: '弹窗1',
            event: this.dialogEvent,
            isShow: ['add', 'update']
          },
          {
            iconName: '线性-提交',
            name: '弹窗2',
            event: 'set',
            isShow: ['add', 'update'],
            component: () => import('@/views/example/indexDemo/productSelect.vue'), // 组件
            validate: this.validateEvent, // 验证
            setDefault: this.doSet, // 设置默认值
            callback: this.closeCallback // 关闭弹窗回调
          },
          {
            iconName: '线性-上传',
            name: '增值税发票ocr识别',
            type: 'upload',
            isShow: ['add', 'update'],
            atrrs: {
              uploadUrl: process.env.BASE_API + '/api/ocr/intsig/recognize', // 文件上传url
              showFileList: false, // 是否展示上传文件，默认false
              accept: 'image/*', // 文件类型，默认*
              multiple: false, // 是否可选择多文件，默认false
              disabled: false, // 是否不可操作，默认false
              notifyFlag: true, // 是否弹出通知，默认true
              paramData: { type: 'vat_invoice'}, // 参数，默认{}
              beforeUploadCallback: this.vatInvoiceOcrBeforeUploadCallback, // 文件上传前回调
              progressCallback: this.vatInvoiceOcrProgressCallback, // 文件上传时回调
              successCallback: this.vatInvoiceOcrSuccessCallback, // 文件上传成功回调
              errorCallback: this.vatInvoiceOcrErrorCallback, // 文件上传错误回调
              changeCallback: this.vatInvoiceOcrChangeCallback // 文件状态改变回调
            }
          },
          {
            iconName: '线性-上传',
            name: '身份证ocr识别',
            type: 'upload',
            isShow: ['add', 'update'],
            atrrs: {
              uploadUrl: process.env.BASE_API + '/api/ocr/intsig/recognize', // 文件上传url
              showFileList: false, // 是否展示上传文件，默认false
              accept: '*', // 初始化文件选择类型，默认*
              multiple: false, // 是否可选择多文件，默认false
              disabled: false, // 是否不可操作，默认false
              notifyFlag: false, // 是否弹出通知，默认true
              paramData: { type: 'vat_invoice'}, // 参数，默认{}
              beforeUploadCallback: this.idCardOcrBeforeUploadCallback, // 文件上传前回调
              progressCallback: this.idCardOcrProgressCallback, // 文件上传时回调
              successCallback: this.idCardOcrSuccessCallback, // 成功回调
              errorCallback: this.idCardOcrErrorCallback, // 异常回调
              changeCallback: this.idCardOcrChangeCallback // 文件状态改变回调
            }
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
                setDefault: this.doSet, // 设置默认值
                callback: this.secondCloseCallback
              },
              {
                label: '商品简称',
                prop: 'productCategoryAbbr',
                element: 'input-validate',
                attrs: {
                  disabled: false,
                  clearable: true
                }
              },
              {
                label: '基础档案下拉',
                prop: 'employee',
                element: 'base-select',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  clearable: true
                },
                list: [],
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              {
                type: 'date',
                label: '开始日期',
                prop: 'startDate',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  type: 'start',
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                type: 'date',
                label: '结束时间',
                prop: 'endDate',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  type: 'end',
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                type: 'radio',
                label: '单选框',
                prop: 'radio',
                list: [
                  {
                    label: '选项1',
                    value: '1'
                  },
                  {
                    label: '选项2',
                    value: '2'
                  }
                ],
                attrs: {
                  disabled: true
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
                  cols: 4
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
          }
        ]
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
      default() {
        return {}
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.edit.formData.part1.content.forEach(item => {
        if (item.prop === 'employee') {
          item.list = [
            {
              code: '0',
              name: '零'
            },
            {
              code: '1',
              name: '壹'
            }
          ]
        }
      })
    }, 3000)
  },
  methods: {
    // 按钮做相应验证
    validateEvent() {
      if (!this.$refs.qmEdit.$refs.qmDialogEdit.editForm.product.usingFlag) {
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
      this.$refs.qmEdit.$refs.qmDialogEdit.$refs.viewFormEdit.$refs.qmDialogTable.listQuery.usingFlag = editForm.product.usingFlag
    },
    dialogEvent() {
      Vue.component('view-form-edit', () => import('@/views/example/indexDemo/productSelect.vue'))
      this.$refs.qmEdit.$refs.qmDialogEdit.dialogLv2Visible = true
      // 防止被遮盖
      $(document).ready(() => {
        $(this.$refs.qmEdit.$refs.qmDialogEdit.$refs.viewFormEdit.$el)
          .appendTo('#app-main .app-container > main')
          .find('.mask')
          .css('z-index', 1999)
          .siblings('.dialog-container')
          .css('z-index', 2000)
      })
    },
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    },
    handleCloseLv2Dialog(param) {
      console.log(param)
    },
    changeStartTime() {
      console.log(111)
      // 自定义开始时间改变事件...
    },
    changeEndTime() {
      // 自定义结束时间改变事件...
    },
    closeCallback(param) {
      console.log('1号弹窗关闭回调方法')
    },
    secondCloseCallback(param) {
      console.log('2号弹窗关闭回调方法')
    },
    vatInvoiceOcrBeforeUploadCallback(file) {
      alert('增值税发票ocr识别beforeUpload回调！！！\n\nfile：\n' + JSON.stringify(file))
    },
    vatInvoiceOcrProgressCallback(event, file, fileList) {
      alert('增值税发票ocr识别progress回调！！！\nevent\n' + JSON.stringify(event) + '\n\nfile：\n' + JSON.stringify(file) + '\n\nfileList：\n' + JSON.stringify(fileList))
    },
    vatInvoiceOcrSuccessCallback(response, file, fileList) {
      alert('增值税发票ocr识别success回调！！！\n\nresponse：\n' + JSON.stringify(response) + '\n\nfile：\n' + JSON.stringify(file) + '\n\nfileList：\n' + JSON.stringify(fileList))
    },
    vatInvoiceOcrErrorCallback(err, file, fileList) {
      alert('增值税发票ocr识别error回调！！！\n\nerr：\n' + JSON.stringify(err) + '\n\nfile：\n' + JSON.stringify(file) + '\n\n\nfileList：\n' + JSON.stringify(fileList))
    },
    vatInvoiceOcrChangeCallback(file, fileList) {
      alert('增值税发票ocr识别change回调！！！\n\nfile：\n' + JSON.stringify(file) + '\n\n\nfileList：\n' + JSON.stringify(fileList))
    },
    idCardOcrBeforeUploadCallback(file) {
      alert('身份证ocr识别beforeUpload回调！！！\n\nfile：\n' + JSON.stringify(file))
    },
    idCardOcrProgressCallback(event, file, fileList) {
      alert('身份证ocr识别progress回调！！！\nevent\n' + JSON.stringify(event) + '\n\nfile：\n' + JSON.stringify(file) + '\n\nfileList：\n' + JSON.stringify(fileList))
    },
    idCardOcrSuccessCallback(response, file, fileList) {
      alert('身份证ocr识别success回调！！！\n\nresponse：\n' + JSON.stringify(response) + '\n\nfile：\n' + JSON.stringify(file) + '\n\nfileList：\n' + JSON.stringify(fileList))
    },
    idCardOcrErrorCallback(err, file, fileList) {
      alert('身份证ocr识别error回调！！！\n\nerr：\n' + JSON.stringify(err) + '\n\nfile：\n' + JSON.stringify(file) + '\n\nfileList：\n' + JSON.stringify(fileList))
    },
    idCardOcrChangeCallback(file, fileList) {
      alert('身份证ocr识别change回调！！！\n\nfile：\n' + JSON.stringify(file) + '\n\n\nfileList：\n' + JSON.stringify(fileList))
    }
  }
}
</script>
