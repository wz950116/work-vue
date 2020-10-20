<template>
  <div class="app-container tree-form-table">
    <!-- 内容 -->
    <div class='left-content'>
      <div class='title' :title='treeTableData.form.treeName'>{{treeTableData.form.treeName}}</div>
      <div class="buttons" v-if="treeTableData.form.isTopBar">
        <el-row type='flex'>
          <div v-for='(btn, index) in treeTableData.form.topBar' :key='index'>
            <el-button v-db-click size="mini" @click='triggerEvent(btn, true)' style='margin-right:3px;border:1px solid #aaaaaa;' v-permission="btn.permitName ? [...btn.permitName, btn.name] : [btn.name]">
              <svg-icon :icon-class="btn.iconName || baseEvent[btn.name] && baseEvent[btn.name].iconName"></svg-icon>{{$t(btn.i18n) || $t(baseEvent[btn.name].i18n)}}
            </el-button>
          </div>
        </el-row>
      </div>
      <div class='tree-wrapper'>
        <el-table :default-expand-all="true" :rowKey="treeTableData.form.table.rowKey" stripe border class='table-content' ref="tree" highlight-current-row style="border:1px solid;" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="treeData" :height='tableHeight - 96' @current-change="handleCheckChange" @row-click="handleNodeClick">
          <el-table-column align='center' v-if="treeTableData.form.table.showIndex" type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <template v-for='col in formtableCols'>
            <el-table-column v-if='col.isShow && col.formatter' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='treeTableData.mainData.table.sortable' show-overflow-tooltip>
            </el-table-column>
            <el-table-column v-else-if='col.isShow' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='treeTableData.mainData.table.sortable' show-overflow-tooltip>
              <template slot-scope='scope'>
                <slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
                <template :style='col.style' v-else>
                  <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
                  <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict,col.format.dictType) }}</span>
                </template>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <!--        <el-tree ref="tree" :data="treeData" :style='{height: treeTableData.form.isTopBar ? tableHeight - 90 + "px" : tableHeight - 52 + "px"}' :expand-on-click-node='treeTableData.form.expandOnClickNode' :show-checkbox="treeTableData.form.showCheckbox" node-key="id" :default-expand-all="treeTableData.form.expandAll" :props="treeTableData.form.defaultProps" :check-on-click-node="true" @check-change="handleCheckChange" @node-click="handleNodeClick">-->
        <!--        </el-tree>-->
      </div>
    </div>
    <main class='right-content'>
      <div class='title' :title='treeTableData.mainData.treeName'>{{treeTableData.mainData.treeName}}</div>
      <template v-if="CurrentNode">
        <div class="top-operate" v-if="treeTableData.mainData.isTopBar">
          <el-row type='flex'>
            <slot name='add'></slot>
            <slot name='upload'></slot>
            <div v-for='(btn, index) in treeTableData.mainData.topBar' :key='index'>
              <el-button v-db-click size="mini" @click='triggerEvent(btn)' style='margin-right:3px;'>
                <svg-icon :icon-class="btn.iconName || baseEvent[btn.name] && baseEvent[btn.name].iconName"></svg-icon>{{$t(btn.i18n) || $t(baseEvent[btn.name].i18n)}}
              </el-button>
            </div>
          </el-row>
        </div>
      </template>
      <el-table :default-expand-all="true" :rowKey="treeTableData.mainData.table.rowKey" stripe border class='table-content' ref="singleTable" highlight-current-row style="border:1px solid;" v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight - 96' @current-change="handleSelectRow">
        <el-table-column align='center' v-if="treeTableData.mainData.table.showIndex" type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
        <template v-for='col in tableCols'>
          <el-table-column v-if='col.isShow && col.formatter' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='treeTableData.mainData.table.sortable' show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-else-if='col.isShow' :key='col.prop' v-bind='col' :label='$t(col.label)' :sortable='treeTableData.mainData.table.sortable' show-overflow-tooltip>
            <template slot-scope='scope'>
              <slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
              <template :style='col.style' v-else>
                <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
                <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict,col.format.dictType) }}</span>
              </template>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <!-- 底部按钮 -->
      <div class='bottom-operate'>
        <div class="bottom-operate-left" v-show='emptyTextVisible'>
          <i class="el-icon-warning" style='color:#E6A23C'></i>&nbsp;{{$t('table.emptyText')}}
        </div>
        <!-- 分页 -->
        <el-pagination v-if='!emptyTextVisible &&treeTableData.mainData.bottomBar.pagination.show' small background :layout="treeTableData.mainData.bottomBar.pagination.layout" :current-page="20" :page-sizes="treeTableData.mainData.bottomBar.pagination.pageSizes" :page-size="1" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
      </div>

      <!-- 编辑弹窗 -->
      <view-form v-if='dialogDetailVisible' @closeHandler='dialogHandler' :param='param' :opType="opType" :opMode='opMode'></view-form>
    </main>
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
      CurrentNode: null,
      // 总条数
      total: 0,
      // 当前选中行
      currentRow: null,
      // 选中接点
      currentNode: null,
      // 所有列数组
      tableCols: [],
      formtableCols: [],
      // 右侧结果列表
      tableData: [],
      // 左侧数查询列表
      treeData: [],
      // 是否显示暂无数据
      emptyTextVisible: true,
      // 编辑页控制显示隐藏
      dialogDetailVisible: false,
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
          i18n: 'biz.btn.expand'
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
      return this.clientWidth < 1366 ? this.clientHeight - 118 : this.clientHeight - 101
    }
  },
  beforeMount() {
    // 初始化列表
    this.treeTableData.mainData.table.cols.forEach(v => {
      // 根据isShow字段判断是否显示
      if (v.isShow === undefined) {
        v.isShow = true
      }
      this.tableCols.push(v)
    })
    // 初始化列表
    this.treeTableData.form.table.cols.forEach(v => {
      // 根据isShow字段判断是否显示
      if (v.isShow === undefined) {
        v.isShow = true
      }
      this.formtableCols.push(v)
    })
    if (this.treeTableData.mainData.table.sortable === undefined) {
      this.treeTableData.mainData.table.sortable = 'true'
    }
  },
  mounted() {
    this.getTree()
    if (this.treeTableData.mainData.initSearch) {
      this.initTable()
    }
  },
  methods: {
    getCurrentNode() {
      return this.currentNode
    },
    refresh(buttonInfo) {
      if (buttonInfo.refTree) {
        this.getTree()
      }
      if (this.getCurrentNode()) {
        this.handleNodeClick(this.getCurrentNode())
      }
    },
    treeRefresh() {
      this.getTree()
    },
    expandNode() {},
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
          this.CurrentNode = null
        })
        .catch(() => {})
    },

    // 按钮事件自定义
    triggerEvent(button, boo) {
      if (button.event && typeof button.event === 'function') {
        button.event()
      } else if (this.baseEvent[button.name]) {
        this.baseEvent[button.name].func(button, boo)
      }
    },

    // 返回指定过滤条件结果
    dataFormat(func = 'dataDictFormat', value, list, dictType) {
      if (dictType) {
        list = this.$t(dictType)
      }
      return Vue.filter(func)(value, list)
    },

    // 单选
    handleSelectRow(val) {
      this.currentRow = val
    },

    // 列表数据请求
    initTable() {
      this.loading = true
      request({
        url: this.treeTableData.mainData.api.search,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        }
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
          // 重置表选中
          // this.currentRow = null
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 树点击(单选)
    handleNodeClick(node) {
      this.CurrentNode = node
      if (this.treeTableData.form.handleNodeClick && typeof this.treeTableData.form.handleNodeClick === 'function') {
        this.treeTableData.form.handleNodeClick(node)
      } else if (!this.treeTableData.form.showCheckbox) {
        if (node) {
          // 点击判断
          if (this.treeTableData.form.validate && !this.treeTableData.form.validate(node)) return

          this.loading = true
          request({
            url: this.treeTableData.mainData.api.search,
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: (this.treeTableData.mainData.apiData.search && this.treeTableData.mainData.apiData.search(node)) || node
            }
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

    // 勾选树(多选)
    handleCheckChange(data) {
      this.currentNode = data
      if (this.treeTableData.form.handleCheckChange && typeof this.treeTableData.form.handleCheckChange === 'function') {
        this.treeTableData.form.handleCheckChange(data)
      } else if (this.treeTableData.form.showCheckbox) {
        this.loading = true
        request({
          url: this.treeTableData.mainData.api.search,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: data
          }
        })
          .then(response => {
            this.loading = false
            this.tableData = response.data

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
    },

    // 删除
    doDelete(buttonInfo, boo) {
      const data = boo ? this.getCurrentNode() : this.currentRow
      if (!data) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (buttonInfo.getParam) {
        this.deleteData = buttonInfo.getParam(data)
      } else {
        this.deleteData = [data]
      }
      this.funcOperationI18n = this.$t(buttonInfo.i18n) || this.$t('biz.btn.delete')
      this.operationMsgInfo = this.$t(buttonInfo.successMsgInfo) || this.$t('biz.msg.deleteSuccess')
      confirmTip(this, 'confirmDelete')
        .then(() => {
          this.loading = true
          request({
            url: this.treeTableData[boo ? 'form' : 'mainData'].api.doDelete,
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
              if (buttonInfo.refTree) {
                this.getTree()
              }
              const currentNode = this.getCurrentNode()
              this.$refs.tree.setCurrentRow(currentNode)
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
    doView(buttonInfo, boo) {
      const data = boo ? this.getCurrentNode() : this.currentRow
      if (!data) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      // 点击权限判断 如果返回为false 则验证不通过
      if (buttonInfo.validate && !buttonInfo.validate(data)) {
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
          this.param = data
        }
        this.opType = 'view'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo())
      }
    },
    // 更新
    doUpdate(buttonInfo, boo) {
      const data = boo ? this.getCurrentNode() : this.currentRow
      if (!data) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      // 点击权限判断 如果返回为false 则验证不通过
      if (buttonInfo.validate && !buttonInfo.validate(data)) {
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
          this.param = data
        }
        this.opType = 'update'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo())
      }
    },
    // 编辑关闭回调
    dialogHandler(param, boo) {
      if (param) {
        const currentNode = this.getCurrentNode()
        if (boo) {
          this.getTree()
        }
        this.handleNodeClick(currentNode)
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
      this.$parent.form.listQuery.size = val
      this.handleNodeClick(val)
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.$parent.form.listQuery.current = val
      this.handleNodeClick(val)
    }
  }
}
</script>

<style lang='scss' scoped>
.tree-form-table {
  display: flex;
  .left-content {
    min-width: 554px;
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
        padding: 10px 10px 5px;
        overflow: auto;
        min-width: 100%;
        display: inline-block !important;
      }
    }
  }
  .right-content {
    flex: 1;
    min-width: 554px;
    background: #fff;
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
  }
}
</style>
