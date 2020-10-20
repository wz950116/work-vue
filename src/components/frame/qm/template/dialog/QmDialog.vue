<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :type='styleType.class'>
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="$emit('closeDialog')" />
      <!-- 顶部按钮 -->
      <el-row class='top-operate' v-if='dialog.topButtons && dialog.topButtons.length > 0'>
        <el-button v-for='(button, index) in dialog.topButtons.filter(v => { return v.isShow.includes(dialog.type) })' :key='index' v-db-click size="mini" v-bind='button.attrs' @click='triggerEvent(button)'>
          {{$t(button.name)}}
        </el-button>
      </el-row>
      <!-- 内容 -->
      <el-form @submit.native.prevent ref="refForm" :model="formData" label-position="left" :rules='rules' :show-message="false">
        <el-row :gutter="20">
          <template v-for='(f, index) in dialog.formData'>
            <el-col v-if='f.isShow' :key='index' :span="f.span ? f.span : ( f.attrs && f.attrs.cols ? styleType.span * f.attrs.cols > 24 ? 24 : styleType.span * f.attrs.cols : styleType.span)" :data-key='f.prop'>
              <!-- 日期 -->
              <el-form-item v-if='f.type === "date" || f.type === "datetime"' :required='f.props instanceof Array && f.validate instanceof Array' :prop='f.prop' :label="$t(f.label)">
                <template v-if='f.props instanceof Array'>
                  <el-row :gutter="0">
                    <el-col :span="11">
                      <el-form-item :prop="f.props[0]">
                        <el-date-picker v-model="formData[f.props[0]]" v-bind='f.attrs' @change="(date) => changeStartTime(date, f.attrs.pickEnd)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,f.attrs.pickStart ? datePick[f.attrs.pickStart] : datePick.dateStartBefore)' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" align='center'>~</el-col>
                    <el-col :span="11">
                      <el-form-item :prop="f.props[1]">
                        <el-date-picker v-model="formData[f.props[1]]" v-bind='f.attrs' @change="(date) => changeEndTime(date, f.attrs.pickStart)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,f.attrs.pickEnd ? datePick[f.attrs.pickEnd] : datePick.dateEndBefore)' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
                <template v-else>
                  <template v-if="f.attrs.type === 'start'">
                    <el-date-picker v-model="formData[f.prop]" v-on="f.event" @change="(date) => changeStartTime(date, f.attrs.pickEnd)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,f.attrs.pickStart ? datePick[f.attrs.pickStart] : datePick.dateStartBefore)' v-bind='f.attrs' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')">
                    </el-date-picker>
                  </template>
                  <template v-else-if="f.attrs.type === 'end'">
                    <el-date-picker v-model="formData[f.prop]" v-on="f.event" @change="(date) => changeEndTime(date, f.attrs.pickStart)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,f.attrs.pickEnd ? datePick[f.attrs.pickEnd] : datePick.dateEndBefore)' v-bind='f.attrs' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')">
                    </el-date-picker>
                  </template>
                  <template v-else>
                    <el-date-picker v-model="formData[f.prop]" v-bind='f.attrs' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')" :picker-options='Object.assign(func.getDefaultPickerOptions(),f.attrs.pickerOptions?f.attrs.pickerOptions:{})' @change='triggerEvent(f)'>
                    </el-date-picker>
                  </template>
                </template>
              </el-form-item>
              <!-- 单选框 -->
              <el-form-item v-else-if='f.type === "radio"' :prop='f.prop' :label="$t(f.label)">
                <el-radio-group v-model="formData[f.prop]" @change='triggerEvent(f)'>
                  <el-radio v-for='item in f.list' :key="item.value" :label="item.value" :disabled="f.attrs && f.attrs.disabled ? f.attrs.disabled : handleRadioDisabled(item.value,f)" v-bind='f.attrs'>{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 多选框 -->
              <el-form-item v-else-if='f.type === "checkbox"' :prop='f.prop' :label="$t(f.label)">
                <el-checkbox-group v-model="formData[f.prop]" @change='triggerEvent(f)'>
                  <el-checkbox v-for='item in f.list' :key="item.value" :label="item.value" v-bind='f.attrs'>{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!-- 下拉输入 -->
              <el-form-item v-else :label="$t(f.label)" :prop='f.prop' :class='f.className'>
                <!-- 字典码表 -->
                <el-select v-if='f.list && (!f.attrs || !f.attrs.data)' v-model="formData[f.prop]" v-bind='f.attrs' :placeholder="$t('biz.placeholder.choose')" @change='triggerEvent(f)'>
                  <template v-for="(item, index) in f.list">
                    <template v-if="f.attrs && !f.attrs.multiple && dialog.type === 'view'">
                      <el-option :key=" index" v-if="formData[f.prop]===item.value" :label="item.label" :value="item.value"></el-option>
                    </template>
                    <template v-else>
                      <el-option :key="index" :label="item.label" :value="item.value"></el-option>
                    </template>
                  </template>
                </el-select>
                <!-- 公用组件 -->
                <component :opType='dialog.type' v-else :is='f.element' v-model='formData[f.prop]' v-bind='f.attrs' :newList='f.list' @onFileChange='addFile' @handleNode='handleNode' v-on='f.event' :attrs='f.attrs' @handleSelect='dialogSelect(f)'></component>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button :loading="button.showLoading ? loading : false" v-for='(button, index) in dialog.bottomButtons.filter(v => { return Array.isArray(v.isShow) ? v.isShow.includes(dialog.type) : v.isShow })' :key='index' v-db-click size="mini" v-bind='button.attrs' @click='triggerEvent(button)'>
          {{$t(button.name)}}
        </el-button>
      </div>
    </div>
    <div class="mask"></div>
    <!-- 二级弹窗 -->
    <view-form-dialog ref='viewFormDialog' :param='dialog.param' v-if='dialogSelectVisible' @closeHandler='dialogHandler'></view-form-dialog>
  </div>
</template>

<script>
import { encriptPwd } from '@/utils/frame/base/encript.js'
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { dateFormate } from '@/utils/frame/base/index'
import { notifySuccess, confirmTip } from '@/utils/frame/base/notifyParams'
import toolUtil from '@/utils/frame/base/toolUtil.js'

// 注册组件
const registerComponent = data => {
  if (data && data.length > 0) {
    data.forEach(item => {
      if (item.component && item.element !== 'base-dialog-select' && item.element !== 'base-select') {
        Vue.component(item.element, item.component)
      }
    })
  }
}
export default {
  data() {
    return {
      func: toolUtil,
      loading: false,
      dataIsChange: false,
      styleType: {},
      formData: {},
      rules: {},
      onOff: false,
      datePick: {
        dateStartBefore: {},
        dateEndBefore: {}
      },
      dialogSelectVisible: false,
      dialogSelectProp: null,
      dialogMap: {
        mini: {
          class: 'miniColumnsDialog',
          span: 12
        },
        medium: {
          class: 'mediumColumnsDialog',
          span: 8
        },
        max: {
          class: 'maxColumnsDialog',
          span: 6
        }
      }
    }
  },
  provide() {
    return {
      QmDialog: this
    }
  },
  props: {
    dialog: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    initFun: {
      type: Function,
      default: null
    }
  },
  computed: {
    titleName() {
      return this.dialog.titleName + this.$t(`biz.btn.${this.dialog.type}`)
    }
  },
  beforeMount() {
    // 组件注册
    registerComponent(this.dialog.formData)

    // 顶部按钮处理
    if (this.dialog.bottomButtons) {
      this.dialog.bottomButtons.forEach(v => {
        this.$set(v, 'loading', false)
      })
    }

    // 初始化formData数据
    if (this.dialog.formData instanceof Array) {
      this.dialog.formData.forEach(v => {
        const val = v.default || ''
        this.$set(this.formData, v.prop, val)
        if (this.dialog.type === 'view' && v.attrs) {
          v.attrs.disabled = true
        }
        // 校验规则
        // 根据isShow字段判断是否显示
        if (v.isShow !== undefined) {
          v.isShow = typeof v.isShow === 'boolean' ? v.isShow : v.isShow.includes(this.dialog.type)
        } else {
          v.isShow = true
        }
        // 校验规则
        if (v.validate) {
          this.rules[v.prop] = v.validate
          if (v.validate[0].validatorFn && typeof v.validate[0].validatorFn === 'function') {
            v.validate[0].validator = (rule, value, callback) => {
              v.validate[0].validatorFn(rule, value, callback, v.prop)
            }
          }
        }
      })
    }
    // 查看则清空校验规则
    if (this.dialog.type === 'view') {
      this.rules = {}
    }
  },
  mounted() {
    // 弹窗尺寸选择
    this.styleType = this.dialogMap[this.dialog.styleType]
    // 是否初始化
    if (this.dialog.type !== 'add') this.getEditData()
  },
  updated() {
    if (this.onOff) {
      this.dataIsChange = true
    }
    this.onOff = true
  },
  methods: {
    // 获取初始化数据
    getEditData() {
      // initType:'api' 或者 'param'
      if (this.dialog.initType && this.dialog.initType === 'param') {
        this.formData = Object.assign({}, this.dialog.param, this.dialog.initChooseParam)
      } else {
        const viewData = this.dialog.apiData && this.dialog.apiData.view(this.dialog.param) ? this.dialog.apiData.view(this.dialog.param) : this.dialog.param.id ? this.dialog.param.id : this.dialog.param
        if (!this.dialog.api.view) return
        request({
          url: this.dialog.api.view,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.view'),
            data: viewData
          }
        })
          .then(response => {
            this.$emit('initCallback', response.data)
            this.formData = Object.assign({}, this.formData, response.data)
            this.onOff = false
            if (this.initFun) {
              this.initFun(this.formData)
            }
          })
          .catch(() => {})
      }
    },

    // 选择数据带出通用事件
    choose() {
      this.$emit('closeDialog', this.formData)
    },

    // 树节点点击回调
    handleNode(value) {
      this.$emit('handleNode', value)
    },

    // 文件上传回调
    addFile(value) {
      if (value && value.response && value.response.data) {
        this.formData = Object.assign({}, this.formData, value.response.data)
      }
    },

    // 打开弹窗选择数据
    dialogSelect(col) {
      this.dialogSelectProp = col
      if (col.component) {
        // 注册组件
        Vue.component('view-form-dialog', col.component)
        this.dialogSelectVisible = true
        // 将弹窗插入body防止被遮盖
        $(document).ready(() => {
          $(this.$refs.viewFormDialog.$el).appendTo('body')
          $('body > .dialog-wrapper > .mask')
            .css('z-index', 1999)
            .siblings('.dialog-container')
            .css('z-index', 2000)
        })
      }
    },

    // 编辑关闭回调
    dialogHandler(param) {
      if (param && this.dialogSelectProp && JSON.stringify(this.dialogSelectProp) !== '{}') {
        this.$nextTick(() => {
          if (param.closeParent) {
            this.$emit('closeDialog', param)
          }
          if (this.dialogSelectProp.beforeCallback) {
            if (this.dialogSelectProp.beforeCallback(param)) {
              this.dialogSelectVisible = false
            } else {
              return false
            }
          } else {
            this.dialogSelectVisible = false
          }
          if (typeof this.dialogSelectProp.callback === 'function') {
            this.dialogSelectProp.callback(param)
          } else {
            const prop = this.dialogSelectProp.prop ? this.dialogSelectProp.prop : this.dialogSelectProp
            this.formData[prop] = param
          }
        })
      } else {
        this.dialogSelectVisible = false
      }
    },

    // 按钮事件自定义
    triggerEvent(button) {
      if (typeof button.event === 'function') {
        button.event()
      } else if (typeof button.event === 'string' && this[button.event]) {
        this[button.event](button)
      }
    },

    // 开始时间变化
    changeStartTime(date, pick) {
      if (pick) {
        this.$set(this.datePick, pick, {
          disabledDate(time) {
            return dateFormate(time, 'YYYYMMDD') * 1 < date * 1
          }
        })
      } else {
        this.datePick.dateEndBefore = {
          disabledDate(time) {
            return dateFormate(time, 'YYYYMMDD') * 1 < date * 1
          }
        }
      }
    },

    // 结束时间变化
    changeEndTime(date, pick) {
      if (pick) {
        this.$set(this.datePick, pick, {
          disabledDate(time) {
            return date ? dateFormate(time, 'YYYYMMDD') * 1 > date * 1 : false
          }
        })
      } else {
        this.datePick.dateStartBefore = {
          disabledDate(time) {
            return date ? dateFormate(time, 'YYYYMMDD') * 1 > date * 1 : false
          }
        }
      }
    },

    // 保存通用事件
    save(buttonInfo) {
      this.$refs.refForm.validate(async valid => {
        if (valid) {
          // 自定义同步保存事件
          if (this.dialog.extraEvent) {
            const flag = await this.dialog.extraEvent()
            if (!flag) return
          }
          // 自定义异步保存事件
          if (buttonInfo.extraEvent) {
            const flag = await buttonInfo.extraEvent()
            if (!flag) return
          }
          this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(async () => {
              // 加密的处理
              if (this.dialog.formData instanceof Array) {
                this.dialog.formData.forEach(v => {
                  if (v.attrs && v.attrs.encript) {
                    this.formData[v.prop] = encriptPwd(this.formData[v.prop])
                  }
                })
              }

              this.loading = true
              request({
                url: this.dialog.type === 'add' ? this.dialog.api.save : this.dialog.api.update,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.formData
                }
              })
                .then(response => {
                  this.loading = false
                  this.$notify(notifySuccess({ msg: this.$t('biz.msg.saveSuccess') }))

                  this.$emit('closeDialog', true)
                })
                .catch(() => {
                  this.loading = false
                })
            })
            .catch(() => {})
        } else {
          return false
        }
      })
    },

    /**
     * 处理checkbox是否可选
     *
     * @param {String|Number} radioVal radio的值
     * @param {Object} formData 数据对象
     */
    handleRadioDisabled(radioVal, formData) {
      if (formData && Array.isArray(formData.disabledList)) {
        return formData.disabledList.length < 1 ? false : formData.disabledList.includes(radioVal)
      }
      if (formData && Array.isArray(formData.abledList)) {
        return formData.abledList.length < 1 ? true : !formData.abledList.includes(radioVal)
      }
      if (formData && typeof formData.disabledRadioEvent === 'function') {
        return formData.disabledRadioEvent(radioVal, formData)
      }
      return false
    },

    // 取消通用事件
    cancel() {
      // 若界面发生修改则关闭时提示
      if (this.dataIsChange) {
        confirmTip(this, 'confirmCancel')
          .then(() => {
            this.$emit('closeDialog')
          })
          .catch(() => {})
      } else {
        this.$emit('closeDialog')
      }
    },

    // 关闭通用事件
    close() {
      this.$emit('closeDialog')
    }
  }
}
</script>
