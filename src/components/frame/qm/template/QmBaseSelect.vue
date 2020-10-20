<template>
  <div>
    <el-select v-if='attrs.datadict' v-model="newValue" v-bind='attrs' :size='size' :placeholder="$t('biz.placeholder.choose')" @change="change" @visible-change="visibleChange">
      <el-option v-for="item in $t('datadict.' + attrs.datadict)" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <tree-org v-else-if='attrs.data === "TREE_ORGAN"' v-model="newValue" v-bind='attrs' @change='change' @handleNode='changeAll'></tree-org>
    <tree-dept v-else-if='attrs.data === "TREE_DEPT"' v-model="newValue" v-bind='attrs' @change='change' @handleNode='changeAll'></tree-dept>
    <tree-employee v-else-if='attrs.data === "TREE_STAFF"' v-model="newValue" v-bind='attrs' @change='change' @handleNode='changeAll'></tree-employee>
    <tree-org-base-dept v-else-if='attrs.data === "TREE_ORG_DEPT"' v-model="newValue" v-bind='attrs' @change='change' @handleNode='changeAll'></tree-org-base-dept>
    <tree-area v-else-if='attrs.data === "TREE_AREA"' v-model="newValue" v-bind='attrs' @change='change' @handleNode='changeAll'></tree-area>
    <el-select v-else ref='qmBaseSelect' class="el-icon-search_1" v-model="newValue" v-bind='attrs' :remote="attrs.remote || remoteSelectData.has(attrs.data)" :remote-method="attrs.remote || remoteSelectData.has(attrs.data) ? remoteMethod : null" :filter-method="attrs.labelShowCode ? filterMethod : null" :size='size' :loading='loading' :placeholder="$t('biz.placeholder.choose')" @change="change" @visible-change="visibleChange" @click.native="listDataShow($event)">
      <el-option v-for="item in list" :key="item.code" :label="item.name" :disabled="item.disabled" :value="item.code">
        <span style="float:left;margin-right:2px;" v-if="attrs.labelShowCode">{{ item.name }}</span>
        <span style="float:right;color:#8492a6;" v-if="attrs.labelShowCode">{{ item.code }}</span>
      </el-option>
    </el-select>

    <base-select-list ref='qmBaseSelectList' v-if='dialogListVisible' @closeHandler='dialogHandler' :opType="opType"></base-select-list>
  </div>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      newValue: this.value,
      list: [],
      listAll: [],
      loading: false,
      dialogListVisible: false
    }
  },
  model: {
    prop: 'value',
    event: 'evn'
  },
  components: {
    treeOrg: () => import('@/views/frame/base/organ/components/TreeOrg.vue'),
    treeDept: () => import('@/views/frame/base/organ/components/TreeDept.vue'),
    treeEmployee: () => import('@/views/frame/base/organ/components/TreeEmployee.vue'),
    TreeOrgBaseDept: () => import('@/views/frame/base/organ/components/TreeOrgBaseDept.vue'),
    treeArea: () => import('@/views/frame/biz/data/area/TreeArea.vue')
  },
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    opType: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    newList: {
      type: Array,
      default() {
        return []
      }
    },
    newRowList: {
      type: Array,
      default() {
        return []
      }
    },
    attrs: {
      type: Object,
      default() {
        // {
        //     data: String, 数据类型，必须
        //     params: String[], 附加参数，可选
        //     dispField: String 显示字段，可选
        // }
        return {}
      }
    }
  },
  watch: {
    attrs: {
      deep: true,
      handler() {
        this.initData()
      }
    },
    value(newVal) {
      if (this.attrs.datadict) {
        this.newValue = newVal
      } else {
        if (!newVal) {
          this.newValue = null
        } else {
          // 当下拉数据已返回并且value值也返回
          if (this.list && this.list.length > 0) {
            this.changeVal(newVal)
          } else if (this.attrs.data && this.attrs.data.includes('TREE')) {
            this.newValue = newVal
          }
        }
      }
    },
    // 表单
    newList(list) {
      this.list = list
    },
    // 列表项
    newRowList(list) {
      if (this.attrs.canChangeList) {
        this.list = list
      }
    }
  },
  computed: {
    ...mapGetters(['baseSelectList', 'remoteSelectData'])
  },
  beforeMount() {
    if (this.attrs) {
      this.attrs.filterable = this.attrs.filterable === false ? this.attrs.filterable : true
      // 是否展示code
      if (this.attrs.labelShowCode === undefined) {
        if (this.attrs.remote || (this.attrs.data && this.remoteSelectData.has(this.attrs.data))) {
          this.attrs.labelShowCode = true
        }
      }
    }
  },
  mounted() {
    // 若自定义下拉选数据
    if (this.attrs.canChangeList) {
      this.list = this.newRowList
      return false
    }
    // 若为远程搜索默认则显示前DEFAULT_REMOTE_SIZE条
    if (this.remoteSelectData.has(this.attrs.data)) {
      if (this.attrs.params === undefined) {
        this.attrs.params = {}
      }
      this.attrs.params.size = this.attrs.params.size || process.env.DEFAULT_REMOTE_SIZE
    }
    this.initData()

    if (this.attrs.showMoreList)
      $('.el-icon-search_1 .el-input .el-input__suffix .el-input__suffix-inner .el-icon-')
        .addClass('el-icon-search')
        .removeClass('el-select__caret')
  },
  methods: {
    async initData(params) {
      if (this.attrs.data) {
        if (this.attrs.data === 'DATE') {
          // 年度选择组件
          const nowYear = new Date().getFullYear()
          for (let i = nowYear - 5; i <= nowYear + 5; i++) {
            this.list.push({
              name: i + '年',
              code: i + ''
            })
          }
        } else if (!this.attrs.data.includes('TREE')) {
          let dataList = await this.$store.dispatch('GetBaseSelectList', JSON.stringify(this.attrs))
          // 若未查到缓存 或 远程自定义参数查询 则重新调接口
          if (!dataList || params) {
            // 储存当前下拉数据
            const response = await request({
              url: '/api/dd/selectData/list',
              method: 'POST',
              data: {
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.search'),
                data: {
                  type: this.attrs.data,
                  queryParams: Object.assign({}, this.attrs.params, params),
                  dataAuth: this.attrs.dataAuth
                }
              }
            })
            dataList = response.data
            // 储存当前下拉数据初始化值
            this.$store.dispatch('SetBaseSelectList', {
              key: JSON.stringify(this.attrs),
              value: dataList
            })
          }
          this.loading = false
          if (this.attrs.dispField !== undefined && this.attrs.dispField !== null && this.attrs.dispField !== '') {
            for (let i = 0; i < dataList.length; i++) {
              const data = dataList[i]
              data.name = data.data[this.attrs.dispField]
            }
          }
          this.list = dataList
          this.listAll = dataList

          // 远程搜索添加提示选项
          if ((this.attrs.remote || this.remoteSelectData.has(this.attrs.data)) && this.list.length === this.attrs.params.size) {
            this.list.push({
              name: `远程搜索结果仅显示前${this.attrs.params.size}条`,
              disabled: true
            })
          }

          // 当下拉数据已返回并且value值也返回
          if (this.value) this.changeVal(this.value)
        }
      } else if (this.attrs.datadict) {
        this.list = this.$t('datadict.' + this.attrs.datadict)
      }
    },
    // 判断基础档案下拉数据是否被删除，若删除则不赋值
    changeVal(newVal) {
      let isNull = false // 是否已被删除
      if (newVal && this.list && this.list.length > 0) {
        // 下拉选id集合
        const ids = this.list.map(item => {
          return item.code
        })
        const valueArray = []
        if (Array.isArray(newVal)) {
          newVal.forEach(data => {
            isNull = !ids.includes(data)
            if (isNull) {
              valueArray.push(data)
            }
          })
        } else {
          isNull = !ids.includes(newVal)
          if (isNull) {
            valueArray.push(newVal)
          }
        }
        if (valueArray && valueArray.length > 0) {
          request({
            url: '/api/dd/selectData/get',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: {
                type: this.attrs.data,
                code: valueArray,
                dataAuth: this.attrs.dataAuth
              }
            }
          }).then(response => {
            if (response.data && response.data.length > 0) {
              response.data.forEach(data => {
                // 每次用于获取最新code集合，防止返回两条相同数据时unshift两次
                const codes = this.list.map(item => item.code)
                if (!codes.includes(data.code)) {
                  this.list.unshift(data)
                }
              })
              this.newValue = newVal
            }
          })
        } else {
          this.newValue = newVal
        }
      }
    },
    change(evl) {
      this.$emit('evn', evl)
      this.$emit('change', evl)
      if (Array.isArray(evl)) {
        const arr = []
        this.list.forEach(item => {
          if (evl.includes(item.code)) {
            arr.push(item)
          }
        })
        this.$emit('changeAll', arr)
      } else {
        this.list.forEach(item => {
          if (item.code === evl || item.key === evl) {
            this.$emit('changeAll', item)
          } else if (evl === '') {
            this.$emit('changeAll', evl)
          }
        })
      }
    },
    changeAll(item) {
      this.$emit('changeAll', item)
    },
    visibleChange(view) {
      this.$emit('visibleChange', view)
      if (!view) {
        setTimeout(() => {
          if (this.attrs.remote || this.remoteSelectData.has(this.attrs.data)) {
            this.remoteMethod('')
          }
        }, 50)
      } else {
        // 针对自定义过滤条件，每次打开显示全部，否则为原来过滤结果
        if (this.attrs.labelShowCode) this.list = this.listAll
      }
    },
    filterMethod(query) {
      if (this.attrs.labelShowCode) {
        this.list = this.listAll.filter(item => {
          return item.code.includes(query) || item.name.includes(query)
        })
      }
    },
    remoteMethod(query) {
      this.loading = true

      if (this.newList && this.newList.length) {
        if (query !== '') {
          this.loading = false
          this.list = this.newList.filter(item => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        } else {
          this.loading = false
          this.list = this.newList
        }
      } else {
        this.initData({
          size: this.attrs.params.size || process.env.DEFAULT_REMOTE_SIZE,
          name: query
        })
      }
    },

    // 打开更多数据选择弹窗
    listDataShow(e) {
      e.stopPropagation()
      if (e.target.className.includes('el-icon-search')) {
        // 防止下拉选被默认打开
        this.$refs.qmBaseSelect.blur()
        // 保存当前组件配置项
        this.$emit('handleSelect')
        // 打开弹窗
        Vue.component('base-select-list', this.attrs.component)
        this.dialogListVisible = true
        $(document).ready(() => {
          $(this.$refs.qmBaseSelectList.$el)
            .appendTo('body')
            .find('.mask')
            .css('z-index', 1999)
            .siblings('.dialog-container')
            .css('z-index', 2000)
        })
      }
    },

    // 关闭更多数据选择弹窗
    dialogHandler(param) {
      if (param) {
        this.change(param)
        // 传递给各自页面根据需求进行赋值
        this.$emit('closeHandler', param)
      }
      this.dialogListVisible = false
    }
  }
}
</script>
