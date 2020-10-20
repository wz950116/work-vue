<template>
  <qm-dialog ref='dialog' :dialog='dialog' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-dialog>
</template>

<script>
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import collectionUtil from '@/utils/frame/base/collectionUtil.js'
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
          view: '/api/dingtalk/bpmProcessCondition/get',
          save: '/api/dingtalk/bpmProcessCondition/save',
          update: '/api/dingtalk/bpmProcessCondition/update'
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
            label: 'sys.bpmSet.form.moduleCode',
            element: 'el-input',
            default: this.getDocKey(),
            isShow: false,
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: true
            }
          },
          {
            prop: 'processId',
            label: 'sys.bpmSet.form.processId',
            element: 'el-input',
            default: this.getProcessId(),
            isShow: false,
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: true
            }
          },
          {
            prop: 'conditionDimension',
            element: 'base-select',
            label: 'sys.bpmSet.form.conditionDimension',
            event: {
              changeAll: this.onChangeOfConditionDimension
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              data: 'DOC_FORM',
              params: {
                docKey: this.getDocKey(),
                formBelongType: '1'
              }
            }
          },
          {
            prop: 'relOperator',
            element: 'base-select',
            label: 'sys.bpmSet.form.relOperator',
            list: this.$t('datadict.relationOperator'),
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            event: this.onChangeOfRelOperator

          },
          {
            prop: 'conditionValue',
            label: 'sys.bpmSet.form.conditionValue',
            element: 'el-input',
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
            prop: 'conditionValueDescription',
            isShow: false
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
  mounted() { },
  methods: {
    /**
     * dialog关闭回调
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
     * 获取单据key
     */
    getDocKey() {
      return this.param.docKey
    },
    /**
     * 获取流程id
     */
    getProcessId() {
      return this.param.processId
    },
    /**
     * 初始化
     */
    handleInitCallback(data) {
      if (data && toolUtil.isNotEmpty(data.conditionDimension)) {
        // 处理数据值表单
        this.handleConditionValueForm(data.conditionDimension)
      }
    },
    onChangeOfRelOperator() {
      const conditionValueItem = this.dialog.formData[5]
      if (conditionValueItem.element === 'base-select') {
        if (conditionValueItem.attrs) {
          if (conditionValueItem.attrs.params) {
          } else {
            conditionValueItem.attrs.params = {}
          }
        } else {
          conditionValueItem.attrs = {
            params: {}
          }
        }
      }

      const formDataRef = this.$refs.dialog.formData
      if (formDataRef.relOperator === 'in') {
        if (conditionValueItem.element === 'base-select') {
          formDataRef.conditionValue = []
          formDataRef.conditionValueDescription = ''
          this.dialog.formData[5].attrs.multiple = true
        }
      } else {
        if (Array.isArray(formDataRef.conditionValue)) {
          formDataRef.conditionValue = ''
          formDataRef.conditionValueDescription = ''
        }
        if (this.dialog.formData[5].attrs) {
          if (this.dialog.formData[5].attrs.multiple) {
            delete this.dialog.formData[5].attrs.multiple
          }
        }
      }
    },
    /**
     * 监听数据项改变
     * @param {Object} item 选中项
     */
    onChangeOfConditionDimension(item) {
      const formDataRef = this.$refs.dialog.formData
      // 清空数据值
      formDataRef['conditionValue'] = ''
      formDataRef['conditionValueDescription'] = ''

      // 若数据为空，则终止
      if (!(item && item.data)) {
        return
      }
      // 处理数据值项
      this.handleContionValueItem(item.data)
    },
    /**
     * 监听[下拉框]数据值改变
     */
    onSelectChangeOfConditionValue(item) {
      if (Array.isArray(item)) {
        let conditionValueDescription = ''
        for (let i = 0; i < item.length; i++) {
          if (i > 0) {
            conditionValueDescription = conditionValueDescription + ', '
          }
          conditionValueDescription = conditionValueDescription + (item[i].name ? item[i].name : item[i].label)
        }
        const formDataRef = this.$refs.dialog.formData
        formDataRef.conditionValueDescription = conditionValueDescription
      } else {
        const formDataRef = this.$refs.dialog.formData
        formDataRef['conditionValueDescription'] = item.name ? item.name : item.label
      }
    },
    /**
     * 监听[日期]数据值改变
     */
    onDateChangeOfConditionValue() {
      const formDataRef = this.$refs.dialog.formData
      formDataRef['conditionValueDescription'] = formDataRef['conditionValue']
    },
    /**
     * 监听[输入框]数据值改变
     */
    onInputChangeOfConditionValue(val) {
      const formDataRef = this.$refs.dialog.formData
      formDataRef['conditionValueDescription'] = val
    },
    /**
     * 处理数据值表单
     * @param {string} formCode 表单code
     */
    handleConditionValueForm(formCode) {
      // 若val为空，则终止
      if (toolUtil.isEmpty(formCode)) {
        return
      }

      let conditionValueItem = toolUtil.getDefDialogItemByProp(this, 'conditionValue')
      // 获取数据项的信息
      request({
        url: '/api/dingtalk/bpmDocFormInfo/list',
        method: 'POST',
        data: {
          data: {
            docKey: this.getDocKey(),
            formCode: formCode,
            deleteFlag: '0'
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        const formInfoList = response.data
        if (collectionUtil.isEmpty(formInfoList)) {
          this.initConditionValueItem(conditionValueItem)
          return
        }
        // 处理数据值项
        this.handleContionValueItem(formInfoList[0])
      }).catch(error => {
        this.initConditionValueItem(conditionValueItem)
      })
    },
    /**
     * 处理数据值项
     * @param {Object} formInfo 表单信息
     */
    handleContionValueItem(formInfo) {
      const dataType = formInfo.dataType
      const fieldInputType = formInfo.fieldInputType
      const fieldAttrJson = formInfo.fieldAttrJson
      let conditionValueItem = toolUtil.getDefDialogItemByProp(this, 'conditionValue')
      // 若字段输入类型为数据字典或基础档案，则展示下拉框
      if (toolUtil.isNotEmpty(fieldAttrJson) && (fieldInputType === '2' || fieldInputType === '3')) {

        this.retainCmnProptiesOfConditionValueItem(conditionValueItem)
        conditionValueItem.element = 'base-select'
        conditionValueItem.attrs = JSON.parse(fieldAttrJson)
        const formData = this.$refs.dialog.formData
        if (formData.relOperator === 'in') {
          conditionValueItem.attrs.multiple = true

          if (formData.conditionValue === null || formData.conditionValue === undefined || formData.conditionValue === '') {
            formData.conditionValue = []
          } else {
            try {
              const conditionArray = JSON.parse(formData.conditionValue)
              if (Array.isArray(conditionArray)) {
                formData.conditionValue = JSON.parse(formData.conditionValue)
              }
            } catch (ex) {
            }
          }
        }
        this.appendCmnAttrsProptiesOfConditionValueItem(conditionValueItem)
        conditionValueItem.event = {}
        conditionValueItem.event.changeAll = this.onSelectChangeOfConditionValue
        return
      }
      // 数值类型
      if (dataType === '2') {
        this.retainCmnProptiesOfConditionValueItem(conditionValueItem)
        conditionValueItem.element = 'input-formatter'
        if (toolUtil.isNotEmpty(fieldAttrJson)) {
          conditionValueItem.attrs = JSON.parse(fieldAttrJson)
        } else {
          conditionValueItem.attrs = {}
          conditionValueItem.attrs.min = -9999999999999
          conditionValueItem.attrs.max = 9999999999999
        }
        this.appendCmnAttrsProptiesOfConditionValueItem(conditionValueItem)
        conditionValueItem.event = {}
        conditionValueItem.event.change = this.onInputChangeOfConditionValue
        return
      }
      // 日期类型
      if (dataType === '3') {
        this.retainCmnProptiesOfConditionValueItem(conditionValueItem)
        conditionValueItem.type = 'datetime'
        conditionValueItem.attrs = toolUtil.isNotEmpty(fieldAttrJson) ? JSON.parse(fieldAttrJson) : {}
        conditionValueItem.attrs.format = 'yyyy-MM-dd HH:mm:ss'
        conditionValueItem.attrs['value-format'] = 'yyyy-MM-dd HH:mm:ss'
        this.appendCmnAttrsProptiesOfConditionValueItem(conditionValueItem)
        conditionValueItem.event = this.onDateChangeOfConditionValue
        return
      }
      this.initConditionValueItem(conditionValueItem)
    },
    /**
     * 保留公共属性
     * @param {Object} item 数据值项
     */
    retainCmnProptiesOfConditionValueItem(item) {
      // 保留prop、label、validate
      item.type = ''
      item.element = ''
      item.attrs = {}
      item.event = {}
    },
    /**
     * 追加attrs公共属性
     * @param {Object} item 数据值项
     */
    appendCmnAttrsProptiesOfConditionValueItem(item) {
      // 保留cols、clearable
      item.attrs = item.attrs || {}
      item.attrs.cols = 2
      item.attrs.clearable = true
    },
    /**
     * 初始化数据值属性
     * @param {Object} item 数据值项
     */
    initConditionValueItem(item) {
      this.retainCmnProptiesOfConditionValueItem(item)
      item.element = 'el-input'
      this.appendCmnAttrsProptiesOfConditionValueItem(item)
      item.event = {}
      item.event.change = this.onInputChangeOfConditionValue
    }
  }
}
</script>
