<template>
  <qm-dialog ref='dialog' :dialog='dialog' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-dialog>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        extraEvent: this.handleBeforeSave,
        api: {
          view: '/api/dingtalk/bpmDocFormInfo/get',
          save: '/api/dingtalk/bpmDocFormInfo/save',
          update: '/api/dingtalk/bpmDocFormInfo/update'
        },
        apiData: {
          view(param) {
            return param.id
          }
        },
        formData: [
          {
            prop: 'id',
            default: this.getId(),
            isShow: false
          },
          {
            prop: 'docKey',
            default: this.getDocKey(),
            isShow: false
          },
          {
            prop: 'formBelongType',
            label: 'sys.bpmSet.form.formBelongType',
            element: 'base-select',
            default: '1',
            list: this.$t('datadict.docFormBelongType'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            prop: 'parentFormCode',
            element: 'base-select',
            label: 'sys.bpmSet.form.parentFormCode',
            event: {
              changeAll: this.onChangeOfParentFormCode
            },
            attrs: {
              data: 'DOC_FORM',
              params: {
                docKey: this.getDocKey(),
                // 数据类型：4-集合<实体类>
                dataType: '4'
              },
              clearable: true
            }
          },
          {
            prop: 'parentFormName',
            isShow: false
          },
          {
            prop: 'sortNum',
            label: 'sys.bpmSet.form.sortNum',
            element: 'input-formatter',
            attrs: {
              clearable: true
            }
          },
          {
            prop: 'formCode',
            label: 'sys.bpmSet.form.formCode',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              cols: 2,
              clearable: true
            }
          },
          {
            prop: 'formName',
            label: 'sys.bpmSet.form.formName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              cols: 2,
              clearable: true
            }
          },
          {
            prop: 'dataType',
            label: 'sys.bpmSet.form.dataType',
            element: 'base-select',
            list: this.$t('datadict.formDataType'),
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            prop: 'fieldInputType',
            label: 'sys.bpmSet.form.fieldInputType',
            element: 'base-select',
            list: this.$t('datadict.fieldInputType'),
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            prop: 'fieldAttrJson',
            label: 'sys.bpmSet.form.fieldAttrJson',
            element: 'el-input',
            attrs: {
              type: 'textarea',
              cols: 2,
              clearable: true
            }
          },
          {
            label: 'sys.bpmSet.form.fieldAttrJsonExplainLabel',
            element: 'el-input',
            attrs: {
              type: 'textarea',
              value: this.$t('sys.bpmSet.form.fieldAttrJsonExplainValue'),
              cols: 2,
              resize: 'none',
              readonly: true
            }
          },
          {
            prop: 'remark',
            label: 'sys.bpmSet.form.remark',
            element: 'el-input',
            attrs: {
              cols: 2,
              clearable: true
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
  mounted() {},
  methods: {
    /**
     * 关闭dialog
     */
    handleCloseDialog(params) {
      this.$emit('closeAndRefreshHandler', params)
    },
    /**
     * 获取id
     */
    getId() {
      return this.param.id
    },
    /**
     * 获取docKey
     */
    getDocKey() {
      return this.param.docKey
    },
    /**
     * 监听父表单变化
     * @param {Object} item 选中项
     */
    onChangeOfParentFormCode(item) {
      let formCodeItem = toolUtil.getDefDialogItemByProp(this, 'formCode')
      let formNameItem = toolUtil.getDefDialogItemByProp(this, 'formName')
      if (!(item && item.data)) {
        formCodeItem.attrs.prepend = undefined
        formNameItem.attrs.prepend = undefined
        return
      }
      const parentFormCode = item.data.formCode
      const parentFormName = item.data.formName
      // 更新formCode、formName前缀
      formCodeItem.attrs.prepend = parentFormCode + '.'
      formNameItem.attrs.prepend = parentFormName + '-'
      // 更新parentFormName
      const formDataRef = this.$refs.dialog.formData
      formDataRef.parentFormName = parentFormName
    },
    /**
     * 保持前处理
     */
    handleBeforeSave() {
      const formDataRef = this.$refs.dialog.formData
      const parentFormCode = formDataRef.parentFormCode
      const parentFormName = formDataRef.parentFormName
      if (toolUtil.isEmpty(parentFormCode)) {
        // 更新formCodeKey、formCodeName
        formDataRef.formCodeKey = formDataRef.formCode
        formDataRef.formCodeName = formDataRef.formName
      } else {
        // 更新formCodeKey、formCodeName
        formDataRef.formCodeKey = parentFormCode + '.' + formDataRef.formCode
        formDataRef.formCodeName = parentFormName + '-' + formDataRef.formName
      }
      return true
    },
    /**
     * 初始化回调
     */
    handleInitCallback(data) {
      if (toolUtil.isEmpty(data.parentFormCode)) {
        return
      }
      let formCodeItem = toolUtil.getDefDialogItemByProp(this, 'formCode')
      let formNameItem = toolUtil.getDefDialogItemByProp(this, 'formName')
      formCodeItem.attrs.prepend = data.parentFormCode + '.'
      formNameItem.attrs.prepend = data.parentFormName + '-'
    }
  }
}
</script>
