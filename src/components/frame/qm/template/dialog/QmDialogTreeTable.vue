<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div ref='treeTableDialog' class='dialog-container' type='treeTableDialog'>
      <!-- 头部 -->
      <title-contain :titleName='dialog.titleName' @screenChange="setTableHeight" @TitleFun="$emit('closeDialog')" />

      <!-- 内容 -->
      <main>
        <div class='left-content' :style='{width: dialog.form.leftWidth ? dialog.form.leftWidth + "px" : "200px" }'>
          <div class='title' :title='dialog.form.treeName'>{{dialog.form.treeName}}</div>
          <div class="buttons" ref='treeButtons' v-if="dialog.form.isTopBar">
            <el-row type='flex'>
              <div v-for='(btn, index) in dialog.form.topBar' :key='index'>
                <el-button v-db-click size="mini" @click='triggerEvent(btn)' style='margin-right:3px;border:1px solid #aaaaaa;'>
                  <svg-icon :icon-class="btn.iconName || baseEvent[btn.name] && baseEvent[btn.name].iconName"></svg-icon>{{$t(btn.i18n) || $t(baseEvent[btn.name].i18n)}}
                </el-button>
              </div>
            </el-row>
          </div>
          <div class='tree-wrapper' :style="{ height: treeHeight + 'px' }">
            <el-form v-if='dialog.form.isSearch'>
              <el-form-item>
                <input-validate v-model="filterText" clearable size="mini" placeholder="输入关键字进行过滤" style="padding:5px;"></input-validate>
              </el-form-item>
            </el-form>
            <el-tree ref="tree" :data="treeData" :default-checked-keys='checkedKeys' :render-content="renderContent" :show-checkbox="dialog.form.showCheckbox" :check-strictly='dialog.form.strictly' :node-key="dialog.form.defaultProps.key || 'id'" :props="dialog.form.defaultProps" :default-expand-all="dialog.form.expandAll" :expand-on-click-node='dialog.form.expandOnClickNode' :check-on-click-node="true" :filter-node-method="filterNode" @node-click="handleNodeClick" @check-change="handleTreeCheckChange">
            </el-tree>
          </div>
        </div>
        <div class='right-content' :style='{minWidth: dialog.form.leftWidth ? (985+200-dialog.form.leftWidth) + "px" : "985px" }'>
          <header ref='formTableDialogHeader' v-if='dialog.form.formDataVisible' style='border-radius:5px;margin:0 0 3px;'>
            <el-form ref='queryForm' @submit.native.prevent label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
              <el-row :gutter="20" style='width:94%;'>
                <template v-for='(f, index) in dialog.form.formData'>
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
              </el-row>
              <!-- 右侧搜索按钮 -->
              <div class="search-btn" v-permission="['query']">
                <el-button type="primary" :loading="loading" @click="handleSearchClick" v-db-click>
                  {{$t('biz.lbl.search')}}
                </el-button>
              </div>
            </el-form>
          </header>
          <el-table stripe border class='table-content' ref="singleTable" highlight-current-row style="border:1px solid;margin-top:0;" v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight' @selection-change="handleSelectionChange" @row-click='handleClick' @current-change="handleSelectRow">
            <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
            <el-table-column type="selection" width="55" align="center" :fixed="dialog.mainData.table.selectionFixed" v-if="dialog.mainData.table.showCheckbox">
            </el-table-column>
            <template v-for='col in tableCols'>
              <el-table-column v-if='col.isShow && col.formatter' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='dialog.mainData.table.sortable' show-overflow-tooltip>
              </el-table-column>
              <el-table-column v-else-if='col.isShow' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='dialog.mainData.table.sortable' show-overflow-tooltip>
                <template slot-scope='scope'>
                  <slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
                  <div v-if="col.formType && col.formType == 'checkbox'">
                    <el-checkbox-group v-if="col.checkboxList" v-model="scope.row[col.prop]">
                      <el-checkbox v-for="item in col.checkboxList" :key="item.key" :label="item.value" :value="item.value" :disabled="handleCheckboxDisabled(item.value,col,scope.row)">
                        <span>{{item.label}}</span>
                      </el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-else v-model="scope.row[col.prop]">
                      <el-checkbox v-for="item in scope.row[col.checkboxProp]" :key="item.code" :label="item.value" :value="item.value" :disabled="handleCheckboxDisabled(item.value,col,scope.row)">
                        <span>{{item.name}}</span>
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div :style='col.style' v-else>
                    <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
                    <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict,col.format.dictType) }}</span>
                  </div>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <div class='bottom-operate'>
            <div class="bottom-operate-left" v-show='emptyTextVisible'>
              <svg-icon icon-class="线性-惊叹号" style='color:#E6A23C'></svg-icon>{{$t('table.emptyText')}}
            </div>
            <!-- 分页 -->
            <el-pagination v-if='!emptyTextVisible && dialog.mainData.bottomBar && dialog.mainData.bottomBar.pagination && dialog.mainData.bottomBar.pagination.show' small background layout="total,sizes,prev, pager, next" :current-page="listQuery.current" :page-sizes="[20, 40, 60, 80, 100]" :page-size="listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
            </el-pagination>
          </div>
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
// 调用Vue全局过滤器
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { dateFormate } from '@/utils/frame/base/index'
import { confirmTip, notifyInfo } from '@/utils/frame/base/notifyParams'

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
      tableHeight: null,
      treeHeight: null,
      loading: false,
      total: 0,
      currentRow: null,
      addQueryConditionVisible: true,
      dateStartBefore: {},
      dateEndBefore: {},
      checkedKeys: [],
      multipleSelection: [],
      emptyTextVisible: false,
      nodeInfo: {},
      tableCols: [],
      tableData: [],
      treeData: [],
      filterText: '',
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
      }
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
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  beforeMount() {
    // 组件注册
    registerComponent(this.dialog.formData)
    // 初始化列表
    this.dialog.mainData.table.cols.forEach(v => {
      // 根据isShow字段判断是否显示
      if (v.isShow === undefined) {
        v.isShow = true
      }
      this.tableCols.push(v)
    })
  },
  mounted() {
    if (this.dialog.form.initSearch) {
      this.getTree()
    }

    if (this.dialog.mainData.initSearch) {
      this.initTable()
    }

    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight, false)
  },
  destroyed() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    // 列表数据请求
    initTable() {
      this.loading = true
      if (this.dialog.mainData.apiData.init()) {
        this.listQuery.data = this.dialog.mainData.apiData.init()
      }
      request({
        url: this.dialog.mainData.api.search,
        method: 'POST',
        data: this.listQuery
      })
        .then(response => {
          this.loading = false
          this.tableData = response.data
          this.total = response.total
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 树状数据请求
    getTree() {
      request({
        url: this.dialog.form.api.getTreeList,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.dialog.form.apiData.getTreeList()
        }
      })
        .then(response => {
          this.treeData = response.data
        })
        .catch(() => {})

      if (this.dialog.form.showCheckbox && this.dialog.form.api.getCheckedList) {
        request({
          url: this.dialog.form.api.getCheckedList,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: this.dialog.form.apiData.getCheckedList()
          }
        })
          .then(response => {
            this.checkedKeys = response.data
          })
          .catch(() => {})
      }
    },

    // 按钮事件自定义
    triggerEvent(event) {
      if (typeof event === 'function') {
        event()
      } else if (typeof event === 'string' && this[event]) {
        this[event]()
      }
    },

    // 返回指定过滤条件结果
    dataFormat(func = 'dataDictFormat', value, list, dictType) {
      if (dictType) {
        list = this.$t(dictType)
      }
      return Vue.filter(func)(value, list)
    },

    // 设置列表动态高度
    setTableHeight() {
      $(document).ready(() => {
        if (this.dialog.form.formDataVisible) {
          this.tableHeight = this.$refs.treeTableDialog.offsetHeight - 115 - this.$refs.formTableDialogHeader.offsetHeight
        } else {
          this.tableHeight = this.$refs.treeTableDialog.offsetHeight - 112
        }
        if (this.dialog.form.isTopBar) {
          this.treeHeight = this.$refs.treeTableDialog.offsetHeight - 109 - this.$refs.treeButtons.offsetHeight
        } else {
          this.treeHeight = this.$refs.treeTableDialog.offsetHeight - 109
        }
      })
    },

    // 过滤节点
    filterNode(value, data) {
      if (!value) return true
      if (this.dialog.form.showCode) {
        return data[this.dialog.form.defaultProps.label].toLowerCase().indexOf(value.toLowerCase()) !== -1 || data[this.dialog.form.defaultProps.key || 'id'].toLowerCase().indexOf(value.toLowerCase()) !== -1
      } else {
        return data[this.dialog.form.defaultProps.label].toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
    },

    renderContent(h, { node, data, store }) {
      if (this.dialog.form.showCode) {
        return (
          <span>
            {node.key} {node.label}
          </span>
        )
      } else {
        return <span>{node.label}</span>
      }
    },

    // 单选
    handleSelectRow(val) {
      this.currentRow = val
    },

    handleClick(row) {
      if (this.dialog.form.handleRowClick && typeof this.dialog.form.handleRowClick === 'function') {
        this.dialog.form.handleRowClick(row)
      } else {
        this.$refs.singleTable.toggleRowSelection(row)
      }
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 查询按钮
    handleSearch() {
      this.listQuery.current = 1
      this.handleSearchClick()
    },

    // 查询
    handleSearchClick() {
      if (this.dialog.form.formSelectByTree) {
        const dataInfo = Object.assign({}, this.listQuery.data, this.dialog.mainData.apiData.search({}))
        this.listQuery.data = dataInfo

        this.loading = true
        request({
          url: this.dialog.mainData.api.search,
          method: 'POST',
          data: this.listQuery
        })
          .then(response => {
            this.tableData = response.data
            this.total = response.total
            if (this.tableData && this.tableData.length > 0) {
              this.emptyTextVisible = false
            } else {
              this.emptyTextVisible = true
            }
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        const dataInfo = this.dialog.form.formDataVisible ? Object.assign({}, this.dialog.mainData.apiData.search(this.nodeInfo), this.listQuery.data) : this.dialog.mainData.apiData.search(this.nodeInfo)

        if (this.dialog.form.handleSearchClick && typeof this.dialog.form.handleSearchClick === 'function') {
          this.dialog.form.handleSearchClick(dataInfo)
        } else {
          if (this.nodeInfo) {
            this.loading = true
            this.listQuery.data = dataInfo
            request({
              url: this.dialog.mainData.api.search,
              method: 'POST',
              data: this.listQuery
            })
              .then(response => {
                this.tableData = response.data
                this.total = response.total
                if (this.tableData && this.tableData.length > 0) {
                  this.emptyTextVisible = false
                } else {
                  this.emptyTextVisible = true
                }
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          }
        }
      }
    },

    // 树点击
    handleNodeClick(node) {
      this.nodeInfo = node
      if (this.dialog.form.handleNodeClick && typeof this.dialog.form.handleNodeClick === 'function') {
        this.dialog.form.handleNodeClick(node)
      } else {
        if (node) {
          this.loading = true
          this.listQuery.data = this.dialog.mainData.apiData.search(node)
          this.listQuery.current = 1
          request({
            url: this.dialog.mainData.api.search,
            method: 'POST',
            data: this.listQuery
          })
            .then(response => {
              this.tableData = response.data
              this.total = response.total
              this.loading = false
              if (this.tableData && this.tableData.length > 0) {
                this.emptyTextVisible = false
              } else {
                this.emptyTextVisible = true
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },
    /**
     * 处理树形节点是否选中
     *
     * @param {Object} nodeData 节点数据
     * @param {Bool} checked 是否被选中
     * @param {Bool} chirdrenNodeChecked 节点的子树中是否有被选中的节点
     */
    handleTreeCheckChange(nodeData, checked, chirdrenNodeChecked) {
      if (this.dialog.form.handleTreeCheckChange && typeof this.dialog.form.handleTreeCheckChange === 'function') {
        this.dialog.form.handleTreeCheckChange(nodeData, checked, chirdrenNodeChecked)
      }
    },
    /**
     * 处理checkbox是否可选
     *
     * @param {String|Number} checkboxVal checkbox的值
     * @param {Object} col 列对象
     * @param {Object} row 行对象
     */
    handleCheckboxDisabled(checkboxVal, col, row) {
      if (col && Array.isArray(col.disabledList)) {
        return col.disabledList.length < 1 ? false : col.disabledList.includes(checkboxVal)
      }
      if (col && Array.isArray(col.abledList)) {
        return col.abledList.length < 1 ? true : !col.abledList.includes(checkboxVal)
      }
      if (col && typeof col.disabledCheckboxEvent === 'function') {
        return col.disabledCheckboxEvent(checkboxVal, row)
      }
      return false
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

    // 页码跳转、N条每页
    handleSizeChange(val) {
      this.listQuery.size = val
      this.handleSearchClick()
    },

    // 点击翻页
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.handleSearchClick()
    },

    // 保存通用事件
    save() {
      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          if (this.dialog.mainData.table.showCheckbox) {
            this.$emit('closeDialog', this.multipleSelection)
          } else {
            this.$emit('closeDialog', this.currentRow)
          }
        })
        .catch(() => {})
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

    // 清空通用事件
    clear() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
