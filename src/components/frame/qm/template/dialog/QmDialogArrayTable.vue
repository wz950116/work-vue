<template>
	<div v-el-drag-dialog class='dialog-wrapper'>
		<div ref='formTableDialog' class='dialog-container' type='formTableDialog'>
			<!-- 头部 -->
			<title-contain :titleName='dialog.titleName' @screenChange="setTableHeight" @TitleFun="$emit('closeDialog')" />

			<!-- 内容 -->
			<header ref='formTableDialogHeader' style='border-radius:5px;'>
				<el-form ref='queryForm' @submit.native.prevent label-position="left" :rules='rules' :inline="true" :model="listQuery.data" class='header-form-inline'>
					<el-row :gutter="20" style='width:94%;'>
						<template v-for='(f, index) in dialog.formData'>
							<el-col :span="8" :key='index' v-if='f.isShow !== false'>
								<!-- 日期 -->
								<el-form-item v-if='f.type === "date"' :label="$t(f.label)">
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
						<!-- 更多 -->
						<template>
							<el-col :span="6" v-for='item in items' :key='item.bind' class='el-form-item-more'>
								<div class='el-form-item-more-left'>
									<el-select clearable v-model="extraQuery[item.bind].label" filterable :placeholder="$t('biz.placeholder.choose')" @change='handleExtraQueryChange'>
										<el-option v-for='i in item.list' :label="i.label" :value="i.prop" :key="i.prop" :disabled="extraChoice.includes(i.prop)"></el-option>
									</el-select>
								</div>
								<div class='el-form-item-more-right'>
									<el-input v-model='extraQuery[item.bind].value'></el-input>
								</div>
							</el-col>
							<el-col :span="6" v-if='dialog.moreShowFlg && addQueryConditionVisible'>
								<span class='more-query' @click='addQueryCondition'>查询扩展&nbsp;+</span>
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
				<el-table stripe border class='table-content table-array-row' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" style="border:1px solid;" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight' @selection-change="handleSelectionChange" @row-click='handleClick' @current-change="handleSelectRow" @sort-change="handleSortChange">
					<el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
					<template v-for='col in tableCols'>
						<el-table-column v-if='col.isShow' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='col.sortable' show-overflow-tooltip>
							<template slot-scope='scope'>
								<!-- 自定义内容 -->
								<slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
								<!-- 合并行 -->
								<template v-else-if='col.isSon'>
									<div class='nest' style='display:block;height:24px;' v-for='(i, index) in scope.row[dialog.mainData.table.mergeProp]' :key="index" :style="{'border-top': index > 0 ? '1px solid #aaaaaa' : ''}">
										<span v-if='!col.format'>{{ i[col.prop] }}</span>
										<span v-else>{{ dataFormat(col.format.func, i[col.prop], col.format.dict,col.format.dictType) }}</span>
									</div>
								</template>
								<!-- 当前列字段是否存在于对象中 -->
								<div v-else :style='col.style'>
									<span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
									<span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict,col.format.dictType) }}</span>
								</div>
							</template>
						</el-table-column>
					</template>
				</el-table>
				<!-- 底部按钮 -->
				<div class='bottom-operate' v-if='dialog.bottomBar'>
					<div class="bottom-operate-left" v-show='emptyTextVisible'>
						<svg-icon icon-class="线性-惊叹号" style='color:#E6A23C'></svg-icon>{{$t('table.emptyText')}}
					</div>
					<!-- 分页 -->
					<el-pagination v-if='!emptyTextVisible' small background layout="total,sizes,prev, pager, next" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80, 100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
					</el-pagination>
				</div>
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
import { mapGetters } from 'vuex'
import { dateFormate } from '@/utils/frame/base/index'
import { notifyInfo, confirmTip } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      tableHeight: null,
      loading: false,
      dataIsChange: false,
      total: 0,
      emptyTextVisible: true,
      listQuery: {
        data: {},
        current: 1,
        size: 20,
        isPage: true,
        importance: undefined,
        title: undefined,
        type: undefined,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      items: [],
      extraQuery: {},
      extraChoice: [],
      addQueryConditionVisible: true,
      rules: {},
      currentRow: null,
      multipleSelection: [],
      tableCols: [],
      tableData: [],
      dateStartBefore: {},
      dateEndBefore: {}
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
  computed: {
    ...mapGetters(['clientHeight'])
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
            if (props.value && props['disabled']) {
              v.attrs['disabled'] = props['disabled']
            }
          }
        }
        if (v.prop) this.$set(this.listQuery.data, v.prop, val)
        if (v.props instanceof Array && v.default instanceof Array) {
          this.$set(this.listQuery.data, v.props[0], v.default[0])
          this.changeStartTime(v.default[0], v.attrs.pickEnd)
          this.$set(this.listQuery.data, v.props[1], v.default[1])
          this.changeEndTime(v.default[1], v.attrs.pickStart)
        } else if (v.default) {
          this.$set(this.listQuery.data, v.prop, v.default)
        }
      })
      // 校验规则
      this.dialog.formData.forEach(v => {
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
    if (this.dialog.mainData.table.sortable === undefined) {
      this.dialog.mainData.table.sortable = 'custom'
    }
    // 初始化列表
    this.dialog.mainData.table.cols.forEach(v => {
      // 根据isShow字段判断是否显示
      if (v.isShow === undefined) {
        v.isShow = true
      }
      if (v.isSon || v.sortable === false) {
        v.sortable = false
      } else {
        v.sortable = this.dialog.mainData.table.sortable
      }
      this.tableCols.push(v)
    })
  },
  mounted() {
    // 初始化
    if (this.dialog.mainData.initSearch) {
      this.getList()
    }

    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight, false)
  },
  updated() {
    this.dataIsChange = true
  },
  destroyed() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
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
              this.tableData = response.data
              this.total = response.total
              if (this.total && this.total > 0) {
                this.emptyTextVisible = false
              } else {
                this.emptyTextVisible = true
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },

    // 返回指定过滤条件结果
    dataFormat(func = 'dataDictFormat', value, list, dictType) {
      if (dictType) {
        list = this.$t(dictType)
      }
      return Vue.filter(func)(value, list)
    },

    // 按钮事件自定义
    triggerEvent(event) {
      if (typeof event === 'function') {
        event()
      } else if (typeof event === 'string' && this[event]) {
        this[event]()
      }
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

    // 单选
    handleSelectRow(val) {
      this.currentRow = val
    },

    handleClick(row) {
      this.$refs.singleTable.toggleRowSelection(row)
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 查询更多条件
    addQueryCondition() {
      const list = []
      const hasList = Object.keys(this.listQuery.data)
      this.dialog.mainData.table.cols.forEach(v => {
        if (!hasList.includes(v.prop)) {
          list.push(v)
        }
      })
      this.$set(this.extraQuery, `extra${this.items.length}`, {
        label: '',
        value: ''
      })
      this.items.push({
        list: list,
        bind: `extra${this.items.length}`
      })

      this.setTableHeight()

      if (this.items.length >= list.length) {
        this.addQueryConditionVisible = false
        return
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

    // 设置列表动态高度
    setTableHeight() {
      $(document).ready(() => {
        this.tableHeight = this.$refs.formTableDialog.offsetHeight - 115 - this.$refs.formTableDialogHeader.offsetHeight
      })
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

    // 选择数据带出通用事件
    choose() {
      if (this.dialog.mainData.table.showCheckbox) {
        if (!this.multipleSelection || this.multipleSelection.length === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('biz.msg.noRowSelected')
            })
          )
          return
        }
        this.$emit('closeDialog', this.multipleSelection)
      } else {
        if (!this.currentRow || this.currentRow.length === 0) {
          this.$notify(
            notifyInfo({
              msg: this.$t('biz.msg.noRowSelected')
            })
          )
          return
        }
        this.$emit('closeDialog', this.currentRow)
      }
    },

    // 页码跳转、N条每页
    handleSizeChange(val) {
      this.listQuery.size = val
      this.getList()
    },

    // 点击翻页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.getList()
    },

    // 清空通用事件
    clear() {
      Object.keys(this.listQuery.data).forEach(prop => {
        this.listQuery.data[prop] = ''
      })
    },

    // 后台排序
    handleSortChange({ column, prop, order }) {
      const sortProp = this.dialog.mainData.table.cols.filter(col => col.prop === prop)[0].sortProp || prop
      if (this.dialog.mainData.table.sortable && this.dialog.mainData.table.sortable === 'custom') {
        if (order) {
          const asc = order === 'ascending' ? '.asc' : '.desc'
          this.listQuery.sortString = sortProp + asc
          this.getList()
        } else {
          this.listQuery.sortString = ''
          if (this.listQuery.defaultSortString) {
            this.getList()
          }
        }
      }
    }
  }
}
</script>
