<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='dialog.titleName' @TitleFun="$emit('closeDialog')" />

      <!-- 内容 -->
      <header style='border-radius:5px;'>
        <el-form ref='queryForm' label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <template v-for='(f, index) in dialog.formData'>
              <el-col :span="8" :key='index' v-if='f.isShow !== false'>
                <!-- 日期 -->
                <el-form-item v-if='f.type === "daterange"' :label="$t(f.label)" :prop='f.bind'>
                  <el-date-picker v-model="listQuery.data[f.bind]" type="daterange" range-separator="~" start-placeholder="" end-placeholder="" v-bind='f.attrs' v-on='f.event' @change='changeDaterangeTime(f)'>
                  </el-date-picker>
                </el-form-item>
                <el-form-item v-else-if='f.type === "date"' :label="$t(f.label)">
                  <el-row :gutter="0">
                    <el-col :span="11">
                      <el-date-picker v-model="listQuery.data[f.props[0]]" v-bind='f.attrs' @change="changeStartTime" :picker-options='dateStartBefore' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')">
                      </el-date-picker>
                    </el-col>
                    <el-col :span="2" align='center'>~</el-col>
                    <el-col :span="11">
                      <el-date-picker v-model="listQuery.data[f.props[1]]" v-bind='f.attrs' @change="changeEndTime" :picker-options='dateEndBefore' :type="f.type" :placeholder="$t('biz.placeholder.dateInput')">
                      </el-date-picker>
                    </el-col>
                  </el-row>
                </el-form-item>
                <!-- 单选框 -->
                <el-form-item v-else-if='f.type === "radio"' :label="$t(f.label)">
                  <el-radio-group v-model="listQuery.data[f.prop]">
                    <el-radio v-for='item in f.list' :key="item.value" :label="item.value" v-bind='f.attrs'>{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- 多选框 -->
                <el-form-item v-else-if='f.type === "checkbox"' :label="$t(f.label)">
                  <el-checkbox-group v-model="listQuery.data[f.prop]">
                    <el-checkbox v-for='item in f.list' :key="item.value" :label="item.value" v-bind='f.attrs'>{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <!-- 数值区间 -->
                <el-form-item v-else-if='f.type === "numberInterval"' :label="$t(f.label)">
                  <el-row :gutter="0">
                    <el-col :span="11">
                      <input-formatter :min='f.attrs.startMin' :max='f.attrs.startMax !== undefined ? f.attrs.startMax : listQuery.data[f.props[1]]' v-model="listQuery.data[f.props[0]]" v-bind='f.attrs' size="mini"></input-formatter>
                    </el-col>
                    <el-col :span="2" align='center'>~</el-col>
                    <el-col :span="11">
                      <input-formatter :min='f.attrs.endMin !== undefined ? f.attrs.endMin : listQuery.data[f.props[0]]' :max='f.attrs.endMax' v-model="listQuery.data[f.props[1]]" v-bind='f.attrs' size="mini"></input-formatter>
                    </el-col>
                  </el-row>
                </el-form-item>
                <!-- 下拉输入 -->
                <el-form-item v-else :label="$t(f.label)" :prop='f.prop'>
                  <!-- 字典码表 -->
                  <el-select v-if='f.list' v-model="listQuery.data[f.prop]" v-bind='f.attrs' :placeholder="$t('biz.placeholder.choose')">
                    <el-option v-for="item in f.list" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <!-- 公用组件 -->
                  <component v-else :is='f.element' v-model='listQuery.data[f.prop]' v-bind='f.attrs' v-on='f.event' :attrs='f.attrs'></component>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
          <!-- 右侧搜索按钮 -->
          <div class="search-btn" v-permission="['query']">
            <el-button type="primary" :loading="loading" @click="getList" v-db-click>
              {{$t('biz.lbl.search')}}
            </el-button>
          </div>
        </el-form>
      </header>
      <main>
        <div class='qm_echarts' ref='chart'></div>
      </main>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-for='(button, index) in dialog.bottomButtons' :key='index' v-db-click size="mini" v-bind='button.attrs' @click='triggerEvent(button.event)'>
          {{$t(button.name)}}
        </el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { dateFormate } from '@/utils/frame/base/index'

export default {
  data() {
    return {
      loading: false,
      dataIsChange: false,
      // 总条数
      total: 0,
      // 是否显示暂无数据
      emptyTextVisible: true,
      listQuery: {
        data: {},
        current: 1,
        size: 20,
        isPage: false,
        importance: undefined,
        title: undefined,
        type: undefined,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      extraQuery: {},
      extraChoice: [],

      rules: {},
      currentRow: null,
      multipleSelection: [],
      tableCols: [],
      tableData: [],
      dateStartBefore: {},
      dateEndBefore: {}
    }
  },
  provide() {
    return {
      QmDialogTable: this
    }
  },
  props: {
    dialog: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  beforeMount() {
    // 初始化formData数据
    if (this.dialog.formData instanceof Array) {
      this.dialog.formData.forEach(v => {
        let val = v.default || ''
        // 设置查询默认条件
        if (this.dialog.initChooseParam) {
          const props = this.dialog.initChooseParam[v.prop]
          if (props) {
            val = props.value || val
            v.attrs = Object.assign(v.attrs, props)
          }
        }
        if (v.prop) this.$set(this.listQuery.data, v.prop, val)
        if (v.props instanceof Array && (v.type === 'date' || v.type === 'daterange')) {
          let defaultVal = ['', '']
          defaultVal[0] = v.default && v.default[0]
          defaultVal[1] = v.default && v.default[1]
          if (v.defaultFunc && !v.defaultFunc.includes('.')) {
            defaultVal = new Function(`return ${this.func[v.defaultFunc]}`)()()
          }
          this.$set(this.listQuery.data, v.props[0], defaultVal[0])
          this.changeStartTime(defaultVal[0], v.attrs.pickEnd)
          this.$set(this.listQuery.data, v.props[1], defaultVal[1])
          this.changeEndTime(defaultVal[1], v.attrs.pickStart)

          if (v.type === 'daterange' && v.bind && v.default) {
            this.$set(this.listQuery.data, v.bind, [this.listQuery.data[v.props[0]], this.listQuery.data[v.props[1]]])
          }
        } else if (v.props instanceof Array && v.default instanceof Array) {
          this.$set(this.listQuery.data, v.props[0], v.default[0])
          this.changeStartTime(v.default[0], v.attrs.pickEnd)
          this.$set(this.listQuery.data, v.props[1], v.default[1])
          this.changeEndTime(v.default[1], v.attrs.pickStart)
        } else if (v.default) {
          this.$set(this.listQuery.data, v.prop, v.default)
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
  },
  mounted() {
    // 初始化
    if (this.dialog.mainData.initSearch) {
      this.getList()
    }
  },
  updated() {
    this.dataIsChange = true
  },
  methods: {
    // 时间变化
    changeDaterangeTime(form) {
      this.listQuery.data[form.props[0]] = this.listQuery.data[form.bind] ? this.listQuery.data[form.bind][0] : ''
      this.listQuery.data[form.props[1]] = this.listQuery.data[form.bind] ? this.listQuery.data[form.bind][1] : ''
      this.$emit('evn')
      this.$emit('change')
    },

    // 列表数据请求
    getList() {
      for (const i in this.extraQuery) {
        if (this.extraQuery[i].label) {
          this.listQuery.data[this.extraQuery[i].label] = this.extraQuery[i].value
        }
      }
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          this.loading = true
          request({
            url: this.dialog.mainData.api.search,
            method: 'POST',
            data: this.dialog.mainData.apiData && this.dialog.mainData.apiData.search ? this.dialog.mainData.apiData.search(this.listQuery) : this.listQuery
          })
            .then(response => {
              this.loading = false
              this.$emit('initChart', response.data)
            })
            .catch(() => {
              this.loading = false
              this.$emit('initChart')
            })
        } else {
          return false
        }
      })
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
    },

    // 更多条件修改时禁用已选择的选项
    handleExtraQueryChange(val) {
      const list = []
      for (const i in this.extraQuery) {
        if (this.extraQuery[i].label) list.push(this.extraQuery[i].label)
      }
      this.extraChoice = list
    },

    // 按钮事件自定义
    triggerEvent(event) {
      if (typeof event === 'function') {
        event()
      } else if (typeof event === 'string' && this[event]) {
        this[event]()
      }
    },

    // 关闭通用事件
    close() {
      this.$emit('closeDialog')
    }
  }
}
</script>
