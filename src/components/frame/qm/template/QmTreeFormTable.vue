<template>
  <div class="app-container tree-form-table">
    <!-- 内容 -->
    <div class='left-content' :style='{width: treeTableData.form.leftWidth ? treeTableData.form.leftWidth + "px" : "200px" }'>
      <div class='title' :title='treeTableData.form.treeName'>{{treeTableData.form.treeName}}</div>
      <div class="buttons" v-if="treeTableData.form.isTopBar">
        <el-row type='flex'>
          <div v-for='(btn, index) in treeTableData.form.topBar' :key='index'>
            <el-button v-db-click size="mini" @click='triggerEvent(btn)' style='margin-right:3px;border:1px solid #aaaaaa;' v-permission="btn.permitName ? [...btn.permitName, btn.name] : [btn.name]">
              <svg-icon :icon-class="btn.iconName || baseEvent[btn.name] && baseEvent[btn.name].iconName"></svg-icon>{{$t(btn.i18n) || $t(baseEvent[btn.name].i18n)}}
            </el-button>
          </div>
        </el-row>
      </div>
      <div class='tree-wrapper' :style='{height: treeTableData.form.isTopBar ? (treeTableData.form.topBar.length > 4 ? treeHeight - 87 + "px" : treeHeight - 70 + "px") : treeHeight - 32 + "px"}'>
        <el-form v-if='treeTableData.form.isSearch'>
          <el-form-item>
            <input-validate v-model="filterText" clearable size="mini" placeholder="输入关键字进行过滤" style="padding:5px;"></input-validate>
          </el-form-item>
        </el-form>
        <el-tree ref="tree" :key='key' highlight-current :render-content="renderContent" :data="treeData" :expand-on-click-node='treeTableData.form.expandOnClickNode' :show-checkbox="treeTableData.form.showCheckbox" :node-key="treeTableData.form.defaultProps.key ? treeTableData.form.defaultProps.key : 'id'" :default-expand-all="treeTableData.form.expandAll" :props="treeTableData.form.defaultProps" :check-on-click-node="true" :filter-node-method="filterNode" @node-click="handleNodeClick">
        </el-tree>
      </div>
    </div>
    <div class='right-content'>
      <header ref='formTableDialogHeader' v-if='treeTableData.form.formDataVisible' style='border-radius:5px;margin:0 0 3px;'>
        <el-form ref='queryForm' @submit.native.prevent label-position="left" :inline="true" :model="listQuery.data" class='header-form-inline'>
          <el-row :gutter="20" style='width:94%;'>
            <template v-for='(f, index) in treeTableData.form.formData'>
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
      <main>
        <div class="top-operate" v-if="treeTableData.mainData.isTopBar">
          <el-row type='flex'>
            <slot name='add'></slot>
            <slot name='upload'></slot>
            <div>
              <el-button v-db-click size="mini" @click='refresh' style='margin-right:3px;'>
                <svg-icon icon-class="线性-刷新" style="margin-right:0px;"></svg-icon>
              </el-button>
            </div>
            <div v-for='(btn, index) in treeTableData.mainData.topBar' :key='index'>
              <el-button v-if='btn.name !== "refresh"' v-db-click size="mini" @click='triggerEvent(btn)' style='margin-right:3px;' v-permission="btn.permitName ? [...btn.permitName, btn.name] : [btn.name]">
                <svg-icon :icon-class="btn.iconName || baseEvent[btn.name] && baseEvent[btn.name].iconName"></svg-icon>{{$t(btn.i18n) || $t(baseEvent[btn.name].i18n)}}
              </el-button>
            </div>
          </el-row>
        </div>
        <u-table ref="singleTable" :data="tableData" :tree-config="treeConfig" :height='tableHeight' use-virtual :row-height="24" :rowKey="treeTableData.mainData.table.rowKey" :row-id="treeTableData.mainData.table.rowKey || 'id'" stripe highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" @sort-change="handleSortChange" @current-change="handleSelectRow">
          <u-table-column align='center' v-if="treeTableData.mainData.table.showIndex" type="index" fixed="left" width="50" :label='$t("table.id")'></u-table-column>
          <template v-for='col in tableCols'>
            <u-table-column v-if='col.isShow && col.formatter' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='treeTableData.mainData.table.sortable' show-overflow-tooltip>
            </u-table-column>
            <u-table-column v-else-if='col.isShow' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='treeTableData.mainData.table.sortable' show-overflow-tooltip>
              <template slot-scope='scope'>
                <slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
                <template :style='col.style' v-else>
                  <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
                  <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict,col.format.dictType) }}</span>
                </template>
              </template>
            </u-table-column>
          </template>
        </u-table>

        <!-- 底部按钮 -->
        <div class='bottom-operate'>
          <div class="bottom-operate-left" v-show='emptyTextVisible'>
            <i class="el-icon-warning" style='color:#E6A23C'></i>&nbsp;{{$t('table.emptyText')}}
          </div>
          <!-- 分页 -->
          <el-pagination v-if='!emptyTextVisible && treeTableData.mainData.bottomBar.pagination.show' small background :layout="treeTableData.mainData.bottomBar.pagination.layout" :current-page="listQuery && listQuery.current" :page-sizes="treeTableData.mainData.bottomBar.pagination.pageSizes" :page-size="listQuery && listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
          </el-pagination>
        </div>
      </main>

      <!-- 编辑弹窗 -->
      <view-form v-if='dialogDetailVisible' @closeHandler='dialogHandler' :param='param' :opType="opType" :opMode='opMode'></view-form>
    </div>
  </div>
</template>

<script>
// 调用Vue全局过滤器
import Vue from 'vue'
// vuex辅助函数
import { mapGetters } from 'vuex'
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo, notifySuccess, confirmTip } from '@/utils/frame/base/notifyParams'
// 导出excel
import exportExcel from '@/utils/frame/base/downloadExcel'

export default {
  data() {
    return {
      // 编辑页面参数传值
      param: {},
      // 加载标识
      loading: false,
      // 强制刷新列表标识
      key: 0,
      // 总条数
      total: 0,
      // 当前选中行
      currentRow: null,
      // 选中接点
      currentNode: null,
      // 所有列数组
      tableCols: [],
      // 右侧结果列表
      tableData: [],
      // 左侧数查询列表
      treeData: [],
      // 是否显示暂无数据
      emptyTextVisible: true,
      // 编辑页控制显示隐藏
      dialogDetailVisible: false,
      // 节点过滤
      filterText: '',
      listQuery: {
        data: {},
        current: 1,
        size: 20,
        isPage: false,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      // 树列表配置项
      treeConfig: {
        children: 'children',
        expandAll: this.treeTableData.form.expandAll
      },
      // 全局按钮方法
      baseEvent: {
        add: {
          func: this.doAdd,
          iconName: '线性-新增',
          i18n: 'biz.btn.add'
        },
        view: {
          func: this.doView,
          iconName: '线性-查看',
          i18n: 'biz.btn.view'
        },
        detailSet: {
          func: this.doView,
          iconName: '线性-设置',
          i18n: 'biz.btn.detailSet'
        },
        update: {
          func: this.doUpdate,
          iconName: '线性-修改',
          i18n: 'biz.btn.update'
        },
        remove: {
          func: this.doDelete,
          iconName: '线性-删除',
          i18n: 'biz.btn.delete'
        },
        refresh: {
          func: this.refresh,
          iconName: '线性-刷新',
          i18n: 'biz.btn.refresh'
        },
        export: {
          func: this.handleDownload,
          iconName: '线性-导出',
          i18n: 'biz.btn.export'
        },
        print: {
          iconName: '线性-打印',
          i18n: 'biz.btn.print'
        },
        expand: {
          func: this.expandNode,
          iconName: '线性-设置',
          i18n: this.treeTableData.form.expandAll ? 'biz.btn.contract' : 'biz.btn.expand'
        }
      }
    }
  },
  props: {
    treeTableData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      if (this.treeTableData.form.formDataVisible) {
        return this.clientWidth < 1366 ? this.clientHeight - 118 - 105 : this.clientHeight - 101 - 105
      } else {
        return this.clientWidth < 1366 ? this.clientHeight - 184 : this.clientHeight - 167
      }
    },
    treeHeight() {
      return this.clientWidth < 1366 ? this.clientHeight - 118 : this.clientHeight - 101
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  beforeMount() {
    // 初始化数据
    if (this.treeTableData.form.formDataVisible && this.listQuery && this.listQuery.data) {
      this.treeTableData.form.formData.forEach(v => {
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
        } else if (v.default) {
          this.$set(this.listQuery.data, v.prop, v.default)
        } else if (v.type === 'checkbox' || (v.attrs && v.attrs.multiple)) {
          this.$set(this.listQuery.data, v.prop, [])
        } else {
          this.$set(this.listQuery.data, v.prop, '')
        }

        // 根据isShow字段判断是否显示
        if (v.isShow === undefined) {
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
    //init listQuery
    if (this.treeTableData.form.isSearch === undefined) {
      this.treeTableData.form.isSearch = true
    }
    //init listQuery
    if (this.treeTableData.form.listQuery) {
      this.listQuery = Object.assign({}, this.listQuery, this.treeTableData.form.listQuery)
    }

    if (this.treeTableData.mainData.table.sortable === undefined) {
      if (this.listQuery && this.listQuery.isPage) {
        this.treeTableData.mainData.table.sortable = 'custom'
      } else {
        this.treeTableData.mainData.table.sortable = 'true'
      }
    }
    // 初始化列表
    this.treeTableData.mainData.table.cols.forEach(v => {
      // 根据isShow字段判断是否显示
      if (v.isShow === undefined) {
        v.isShow = true
      }
      v.sortable = v.sortable === false ? false : this.treeTableData.mainData.table.sortable

      this.tableCols.push(v)
    })
  },
  mounted() {
    this.getTree()
    if (this.treeTableData.mainData.initSearch) {
      this.initTable()
    }
  },
  methods: {
    // 列表数据请求
    initTable() {
      if (!this.currentNode) return
      this.loading = true
      let data = {}
      if (this.listQuery) {
        data = {
          ...this.listQuery,
          data: (this.treeTableData.mainData.apiData.search && this.treeTableData.mainData.apiData.search(this.currentNode)) || this.currentNode
        }
      } else {
        data = {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: (this.treeTableData.mainData.apiData.search && this.treeTableData.mainData.apiData.search(this.currentNode)) || this.currentNode
        }
      }
      request({
        url: this.treeTableData.mainData.api.search,
        method: 'POST',
        data
      })
        .then(response => {
          this.loading = false
          this.tableData = response.data

          this.total = response.total

          if (this.tableData && this.tableData.length > 0) {
            this.emptyTextVisible = false
          } else {
            this.emptyTextVisible = true
          }
        })
        .catch(() => {
          this.loading = false
        })
    },

    // 树数据请求
    getTree() {
      request({
        url: this.treeTableData.form.api.getTreeList,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.treeTableData.form.apiData.getTreeList()
        }
      })
        .then(response => {
          this.treeData = response.data
        })
        .catch(() => {})
    },

    getCurrentNode() {
      return this.$refs.tree.getCurrentNode()
    },

    refresh() {
      if (this.getCurrentNode()) {
        if (this.treeTableData.form.formDataVisible) {
          this.handleSearchClick()
        } else {
          this.handleNodeClick(this.getCurrentNode())
        }
      }
    },

    // 按钮事件自定义
    triggerEvent(button) {
      if (button.event && typeof button.event === 'function') {
        button.event()
      } else if (this.baseEvent[button.name]) {
        this.baseEvent[button.name].func(button)
      }
    },

    // 返回指定过滤条件结果
    dataFormat(func = 'dataDictFormat', value, list, dictType) {
      if (dictType) {
        list = this.$t(dictType)
      }
      return Vue.filter(func)(value, list)
    },

    // 过滤节点
    filterNode(value, data) {
      if (!value) return true
      if (this.treeTableData.form.showCode) {
        return data[this.treeTableData.form.defaultProps.label].toLowerCase().indexOf(value.toLowerCase()) !== -1 || data[this.treeTableData.form.defaultProps.key || 'id'].toLowerCase().indexOf(value.toLowerCase()) !== -1
      } else {
        return data[this.treeTableData.form.defaultProps.label].toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
    },

    // 树点击
    handleSearchClick() {
      if (this.treeTableData.form.formSelectByTree) {
        const dataInfo = Object.assign({}, this.listQuery.data, this.treeTableData.mainData.apiData.search({}))
        this.listQuery.data = dataInfo

        this.loading = true
        request({
          url: this.treeTableData.mainData.api.search,
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
        if (this.currentNode === null || JSON.stringify(this.currentNode) === '{}') {
          this.$notify(
            notifyInfo({
              msg: '请先选择左侧' + this.treeTableData.form.treeName
            })
          )
          return
        }
        const dataInfo = this.treeTableData.form.formDataVisible ? Object.assign({}, this.treeTableData.mainData.apiData.search(this.currentNode), this.listQuery.data) : this.treeTableData.mainData.apiData.search(this.currentNode)
        if (this.treeTableData.form.handleSearchClick && typeof this.treeTableData.form.handleSearchClick === 'function') {
          this.treeTableData.form.handleSearchClick(dataInfo)
        } else {
          if (this.currentNode) {
            this.loading = true
            this.listQuery.data = dataInfo
            request({
              url: this.treeTableData.mainData.api.search,
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

    // handleSearchClick() {
    //   if (this.currentNode === null || JSON.stringify(this.currentNode) === '{}') {
    //     this.$notify(
    //       notifyInfo({
    //         msg: '请先选择左侧' + this.treeTableData.form.treeName
    //       })
    //     )
    //     return
    //   }
    //   const dataInfo = this.treeTableData.form.formDataVisible ? Object.assign({}, this.treeTableData.mainData.apiData.search(this.currentNode), this.listQuery.data) : this.treeTableData.mainData.apiData.search(this.currentNode)
    //   if (this.treeTableData.form.handleSearchClick && typeof this.treeTableData.form.handleSearchClick === 'function') {
    //     this.treeTableData.form.handleSearchClick(dataInfo)
    //   } else {
    //     if (this.currentNode) {
    //       this.loading = true
    //       this.listQuery.data = dataInfo
    //       request({
    //         url: this.treeTableData.mainData.api.search,
    //         method: 'POST',
    //         data: this.listQuery
    //       })
    //         .then(response => {
    //           this.tableData = response.data
    //           this.total = response.total
    //           if (this.tableData && this.tableData.length > 0) {
    //             this.emptyTextVisible = false
    //           } else {
    //             this.emptyTextVisible = true
    //           }
    //           this.loading = false
    //         })
    //         .catch(() => {
    //           this.loading = false
    //         })
    //     }
    //   }
    // },

    // 单选
    handleSelectRow(val) {
      this.currentRow = val
    },

    // 树点击
    handleNodeClick(node) {
      this.currentNode = node
      this.currentRow = null
      if (this.treeTableData.form.handleNodeClick && typeof this.treeTableData.form.handleNodeClick === 'function') {
        this.treeTableData.form.handleNodeClick(node)
      } else if (!this.treeTableData.form.showCheckbox) {
        if (node) {
          // 点击判断
          if (this.treeTableData.form.validate && !this.treeTableData.form.validate(node)) return

          this.loading = true

          this.listQuery.data = this.treeTableData.mainData.apiData.search(node)

          request({
            url: this.treeTableData.mainData.api.search,
            method: 'POST',
            data: this.listQuery
          })
            .then(response => {
              this.loading = false
              this.tableData = response.data
              this.total = response.total
              if (this.tableData && this.tableData.length > 0) {
                this.emptyTextVisible = false
              } else {
                this.emptyTextVisible = true
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.initTable()
        }
      }
    },

    // 删除
    doDelete(buttonInfo) {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (buttonInfo.getParam) {
        this.deleteData = buttonInfo.getParam()
      } else {
        this.deleteData = [this.currentRow]
      }
      this.funcOperationI18n = this.$t(buttonInfo.i18n) || this.$t('biz.btn.delete')
      this.operationMsgInfo = this.$t(buttonInfo.successMsgInfo) || this.$t('biz.msg.deleteSuccess')
      confirmTip(this, 'confirmDelete')
        .then(() => {
          this.loading = true
          request({
            url: this.treeTableData.mainData.api.doDelete,
            method: 'POST',
            data: {
              data: this.deleteData,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.funcOperationI18n
            }
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: this.operationMsgInfo }))
              this.loading = false

              const currentNode = this.$refs.tree.getCurrentNode()
              this.handleNodeClick(currentNode)
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {})
    },

    // 新增
    doAdd(buttonInfo) {
      // 点击权限判断 如果返回为false 则验证不通过
      if (buttonInfo.validate && !buttonInfo.validate(this.currentRow)) {
        if (buttonInfo.msg) {
          this.$notify(notifyInfo({ msg: buttonInfo.msg }))
        }
        return
      }
      // 编辑页弹窗组件注册
      if (buttonInfo.type === 'dialog') {
        // 注册组件
        Vue.component('view-form', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam()
        }
        this.opType = 'add'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo())
      }
    },

    // 查看
    doView(buttonInfo) {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      // 点击权限判断 如果返回为false 则验证不通过
      if (buttonInfo.validate && !buttonInfo.validate(this.currentRow)) {
        if (buttonInfo.msg) {
          this.$notify(notifyInfo({ msg: buttonInfo.msg }))
        }
        return
      }
      if (buttonInfo.type === 'dialog') {
        Vue.component('view-form', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam()
        } else {
          this.param = this.currentRow
        }
        this.opType = 'view'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo())
      }
    },

    // 更新
    doUpdate(buttonInfo) {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      // 点击权限判断 如果返回为false 则验证不通过
      if (buttonInfo.validate && !buttonInfo.validate(this.currentRow)) {
        if (buttonInfo.msg) {
          this.$notify(notifyInfo({ msg: buttonInfo.msg }))
        }
        return
      }
      if (buttonInfo.type === 'dialog') {
        Vue.component('view-form', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam()
        } else {
          this.param = this.currentRow
        }
        this.opType = 'update'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo())
      }
    },

    // 设置
    expandNode() {
      this.key++
      this.treeTableData.form.expandAll = !this.treeTableData.form.expandAll
      this.baseEvent.expand.i18n = this.baseEvent.expand.i18n === 'biz.btn.expand' ? 'biz.btn.contract' : 'biz.btn.expand'
    },

    // 编辑关闭回调
    dialogHandler(param) {
      if (param) {
        if (this.treeTableData.form.formDataVisible) {
          this.handleSearchClick()
        } else {
          const currentNode = this.$refs.tree.getCurrentNode()
          this.handleNodeClick(currentNode)
        }
      }
      this.dialogDetailVisible = false
    },

    // 导出excel
    exportfunc() {
      this.loading = true
      const param = Object.assign({}, this.$parent.form.listQuery, {
        isPage: false
      })
      return request({
        url: this.treeTableData.mainData.api.search,
        method: 'POST',
        data: param
      })
    },

    callBackfunc() {
      this.$parent.form.listQuery.isPage = true
      this.loading = false
    },

    handleDownload() {
      exportExcel({
        fileName: this.$t('route.' + this.$route.meta.title),
        header: this.treeTableData.mainData.table.cols.map(col => {
          if (col.label) return this.$t(col.label)
        }),
        filterVal: this.treeTableData.mainData.table.cols.map(col => {
          if (col.format && col.format.dict instanceof Array) {
            return {
              val: col.prop,
              dicCode: col.format.dict
            }
          } else {
            return col.prop
          }
        }),
        exportfunc: this.exportfunc,
        callBackfunc: this.callBackfunc
      })
    },

    // 页码跳转、N条每页
    handleSizeChange(val) {
      if (this.listQuery) {
        this.listQuery.size = val
        this.handleNodeClick(this.currentNode)
      }
    },

    // 点击翻页
    handleCurrentChange(val) {
      if (this.listQuery) {
        this.listQuery.current = val
        this.handleNodeClick(this.currentNode)
      }
    },

    renderContent(h, { node, data, store }) {
      if (this.treeTableData.form.showCode) {
        return (
          <span>
            {node.key} {node.label}
          </span>
        )
      } else {
        return <span>{node.label}</span>
      }
    },
    // 后台排序
    handleSortChange({ column, prop, order }) {
      const sortProp = this.treeTableData.mainData.table.cols.filter(col => col.prop === prop)[0].sortProp || prop
      if (this.treeTableData.mainData.table.sortable && this.treeTableData.mainData.table.sortable === 'custom') {
        if (order) {
          const asc = order === 'ascending' ? '.asc' : '.desc'
          this.listQuery.sortString = sortProp + asc
          this.initTable()
        } else {
          this.listQuery.sortString = ''
          if (this.listQuery.defaultSortString) {
            this.initTable()
          }
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.tree-form-table {
  display: flex;
  .left-content {
    width: 200px;
    min-width: 200px;
    border: 1px solid #aaaaaa;
    border-radius: 5px 5px 0 0;
    margin-right: 3px;
    background: #ffffff;
    .title {
      height: 30px;
      line-height: 30px;
      text-indent: 10px;
      background: #e2e9f4;
      border-bottom: 1px solid #aaaaaa;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .buttons {
      padding: 5px;
      border-bottom: 1px solid #aaaaaa;
      background: #e2e2e2;
      overflow-x: auto;
      .el-row {
        .el-button {
          padding: 6px 8px;
        }
      }
    }
    .tree-wrapper {
      overflow-x: auto;
      .el-tree {
        padding: 5px 5px;
        overflow: auto;
        min-width: 100%;
        display: inline-block !important;
      }
    }
  }
  .right-content {
    flex: 1;
    min-width: 954px;

    & > header {
      background: #fff;
      border: 1px solid #ababab;
      border-radius: 5px;
      margin-bottom: 5px;
      // form版面
      .header-form-inline {
        position: relative;
        padding: 3px 10px;
        .el-row {
          .el-form-item-more {
            display: flex;
            margin-top: 2px;
            height: 27px;
            .el-form-item-more-left {
              width: 96px;
              .el-input--small .el-input__inner {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              }
            }
            .el-form-item-more-right {
              flex: 1;
              .el-input--small .el-input__inner {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
              }
            }
            .el-input--small .el-input__inner,
            .el-input--small .el-input__icon {
              height: 24px;
              line-height: 24px;
              padding: 0 6px;
              font-size: 12px;
            }
          }
          .more-query {
            display: inline-block;
            margin-top: 8px;
            color: #3e6db5;
            cursor: pointer;
          }
        }
        .search-btn {
          position: absolute;
          right: 16px;
          top: 5px;
          .el-button--small {
            font-size: 12px;
            border-radius: 3px;
            padding: 5px 9px !important;
            float: right;
          }
        }
      }
    }

    & > main {
      .top-operate {
        width: 100%;
        z-index: 99;
        margin-bottom: 3px;
        .el-row {
          .el-button {
            padding: 6px 10px;
          }
          .el-button + .el-button {
            margin-left: -2px;
          }
        }
      }
      .bottom-operate {
        background: #fff;
        height: 36px;
        line-height: 36px;
        border: 1px solid #ababab;
        border-top: none;
        border-radius: 0 0 5px 5px;
        .bottom-operate-left {
          float: left;
          color: #606266;
          margin-left: 15px;
        }
        .bottom-operate-right {
          float: right;
          font-size: 12px;
          color: #606266;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
