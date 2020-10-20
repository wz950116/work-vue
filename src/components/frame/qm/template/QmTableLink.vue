<template>
  <!--  下面的主题内容 各个弹出框 -->
  <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
    <!-- 顶部按钮 -->
    <div class='top-operate' v-if='mainData.isTopBar'>
      <el-row type='flex'>
        <slot name='add'></slot>
        <slot name='upload'></slot>
        <div v-for='(btn, index) in mainData.topBar' :key='index'>
          <el-dropdown v-if='btn.name === "more"' @command="triggerEvent">
            <el-button v-db-click size="mini" style='margin-right:3px;' v-permissionMultiple="btn.list">
              {{ $t(btn.i18n || 'biz.btn.moreButton') }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :key='index' v-for='(b, index) in btn.list' :command="b" v-permission="b.permitName ? b.permitName : [b.name]">
                <svg-icon :icon-class="b.iconName || baseEvent[b.name] && baseEvent[b.name].iconName"></svg-icon>
                {{ $t(b.i18n) || baseEvent[b.name] && $t(baseEvent[b.name].i18n) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button v-else v-db-click size="mini" @click='triggerEvent(btn)' style='margin-right:3px;' v-permission="btn.permitName ? btn.permitName : [btn.name]">
            <svg-icon :icon-class="btn.iconName || baseEvent[btn.name] && baseEvent[btn.name].iconName"></svg-icon>
            {{ $t(btn.i18n) || baseEvent[btn.name] && $t(baseEvent[btn.name].i18n) }}
          </el-button>
        </div>
      </el-row>
    </div>
    <!-- 列设置 -->
    <el-table :key='key' :default-expand-all="true" :rowKey="mainData.table.rowKey" v-if='mainData.isColset' stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight' @current-change="handleSelectRow" @sort-change="handleSortChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column align="center" type="selection" width="55" :fixed="mainData.table.selectionFixed" v-if="mainData.table.showCheckbox"></el-table-column>
      <template v-for="col in formThead">
        <el-table-column :key="col.prop" v-if='col.isShow' v-bind='col' :label='$t(col.label)' :fixed='col.fixed' :sortable='mainData.table.sortable && col.sortable' show-overflow-tooltip>
          <template slot-scope='scope'>
            <slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
            <template :style='col.style' v-else>
              <span v-if='col.formatter'>{{ col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) }}</span>
              <span v-else-if='!col.format'>{{ scope.row[col.prop] }}</span>
              <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict) }}</span>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 无列设置 -->
    <el-table v-else :default-expand-all="mainData.table.expandAll" :rowKey="mainData.table.rowKey" stripe border class='table-content' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='tableHeight' :show-summary='mainData.table.showSummary' :summary-method="getSummaries" :load="load" :lazy="!mainData.table.expandAll" :tree-props="treeProps" @current-change="handleSelectRow" @sort-change="handleSortChange">
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column align="center" type="selection" width="55" :fixed="mainData.table.selectionFixed" v-if="mainData.table.showCheckbox"></el-table-column>
      <template v-for='col in tableCols'>
        <el-table-column :key='col.prop' v-if='col.isShow' v-bind='col' :label='$t(col.label)' :sortable='mainData.table.sortable && col.sortable' show-overflow-tooltip>
          <template slot-scope='scope'>
            <slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
            <template :style='col.style' v-else>
              <span v-if='col.formatter'>{{ col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) }}</span>
              <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
              <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict,col.format.dictType) }}</span>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 底部按钮 -->
    <div class='bottom-operate'>
      <div class='bottom-operate-left' v-if='mainData.isColset'>
        <el-table-column-set :id='mainData.table.id' :checked="checked" :checkList="tableCols" @change="checkChange" @lockEvent='handleLockChange'></el-table-column-set>
      </div>
      <div class='bottom-operate-right' v-show='emptyTextVisible'>
        <svg-icon icon-class='线性-惊叹号' style='color:#E6A23C'></svg-icon>{{$t('table.emptyText')}}
      </div>
      <!-- 分页 -->
      <el-pagination v-if='!emptyTextVisible && mainData.bottomBar.pagination.show' small background :layout="mainData.bottomBar.pagination.layout" :current-page="$parent.form.listQuery.current" :page-sizes="mainData.bottomBar.pagination.pageSizes" :page-size="$parent.form.listQuery.size" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 联动列表 -->
    <el-table stripe border class='table-content' ref="linkTable" highlight-current-row v-loading="loadingLv2" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="linkTableData" :height='150'>
      <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
      <el-table-column align="center" type="selection" width="55" v-if="mainData.table.showCheckbox"></el-table-column>
      <template v-for='col in tableCols'>
        <el-table-column :key='col.prop' v-if='col.isShow' v-bind='col' :label='$t(col.label)' :sortable='mainData.table.sortable && col.sortable' show-overflow-tooltip>
          <template slot-scope='scope'>
            <slot v-if="col.isSlot" :name="col.prop" :row='scope.row'></slot>
            <template :style='col.style' v-else>
              <span v-if='col.formatter'>{{ col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) }}</span>
              <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
              <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict, col.format.dictType) }}</span>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 底部按钮 -->
    <div class='bottom-operate'>
      <div class="bottom-operate-left" v-show='emptyTextVisibleLv2'>
        <svg-icon icon-class="线性-惊叹号" style='color:#E6A23C'></svg-icon>{{$t('table.emptyText')}}
      </div>
    </div>
    <!-- 编辑弹窗 -->
    <view-form-table v-if='dialogDetailVisible' @closeHandler='dialogHandler' :param='param' :moduleCode='moduleCode' :opType='opType' :opMode='opMode'></view-form-table>
    <!-- 取消审核弹窗 -->
    <el-dialog width='30%' :title="$t('biz.btn.cancelAudit')" :visible.sync="dialogCancelAuditVisible" :close-on-click-modal="false" :append-to-body="true" :show-close="false">
      <div style='width:80%;margin:10px auto;text-align:center;'>
        <el-input v-model="setData.remark" autoComplete="off" :placeholder="$t('biz.placeholder.remarkNotBlank')" @keyup.enter.native="confirmCancelAudit"></el-input>
      </div>
      <div style='width:100%;height:40px;line-height:42px;background:#e6e6e6;text-align:center;'>
        <el-button size='mini' @click="dialogCancelAuditVisible = false">{{$t('biz.btn.cancel')}}</el-button>
        <el-button size='mini' type="primary" @click="confirmCancelAudit">{{$t('biz.btn.save')}}</el-button>
      </div>
    </el-dialog>
  </main>
</template>

<script>
// 调用Vue全局过滤器
import Vue from 'vue'
import screenfull from 'screenfull'
// vuex辅助函数
import { mapGetters } from 'vuex'
// 提醒
import { confirmTip, notifyInfo, notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
// axios访问
import request from '@/utils/frame/base/request'
import axios from 'axios'
import storage from '@/utils/frame/base/localStorage'
import session from '@/utils/frame/base/sessionStorage'
// 导出excel
import exportExcel from '@/utils/frame/base/downloadExcel'
import bpmUtil from '@/utils/frame/bpm/bpmUtil.js'
import bpmDingUtil from '@/utils/frame/bpm/bpmDingUtil.js'

export default {
  data() {
    return {
      // 树列表全部数据
      tableAllData: [],
      // 树列表配置项
      treeProps: {
        children: 'children',
        hasChildren: 'children'
      },
      // 编辑页面参数传值
      param: {},
      // 操作当前行时接口参数 类型：Array/Objct/String
      setData: {
        remark: ''
      },
      // 弹窗类型
      opType: '',
      // 编辑模式：dialog or route
      opMode: '',
      // 审核按钮
      moduleCode: this.$route.meta.bpmModule,
      // 列表更新标识
      key: 1,
      funcOperationI18n: '',
      operationMsgInfo: '',
      // 表格高度
      tableHeight: 0,
      // 全部列
      tableCols: [],
      // 经过滤后展示列
      formThead: [],
      // 列设置
      checked: [],
      // 加载标识
      loading: false,
      // 总条数
      total: 0,
      // 显示维护页面显示标识
      editVisible: false,
      // 显示维护页面的类型：是查看还是修改
      dialogType: '',
      // 弹窗唯一标识
      dialogId: '',
      // 当前选中行信息
      currentRow: null,
      // 表格信息
      tableData: [],
      // 二级列表加载
      loadingLv2: false,
      // 二级列表数据
      linkTableData: [],
      // 是否显示暂无数据
      emptyTextVisible: true,
      emptyTextVisibleLv2: true,
      // 编辑页控制显示隐藏
      dialogDetailVisible: false,
      // 取消审核弹窗显示隐藏
      dialogCancelAuditVisible: false,
      // 最大化时是否显示顶部标签栏
      tagViewVisible: false,
      // 全局按钮方法
      baseEvent: {
        add: {
          func: this.doAdd,
          iconName: '线性-新增',
          i18n: 'biz.btn.add'
        },
        next: {
          func: this.doNext,
          iconName: '线性-新增',
          i18n: 'biz.btn.add'
        },
        view: {
          func: this.doView,
          iconName: '线性-查看',
          i18n: 'biz.btn.view'
        },
        detail: {
          func: this.doDetail,
          iconName: '线性-查看',
          i18n: 'biz.btn.detail'
        },
        detailSet: {
          func: this.doDetail,
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
        clean: {
          func: this.doClean,
          iconName: '线性-重置',
          i18n: 'biz.btn.clean'
        },
        refresh: {
          func: this.getList,
          iconName: '线性-刷新',
          i18n: 'biz.btn.refresh'
        },
        set: {
          func: this.doSet,
          iconName: '线性-设置',
          i18n: 'biz.btn.setting'
        },
        submitAudit: {
          func: this.doAudit,
          iconName: '线性-审核',
          i18n: 'biz.btn.submitAudit'
        },
        auditHistory: {
          func: this.showAuditHistory,
          iconName: '线性-审核历史',
          i18n: 'biz.btn.auditHistory'
        },
        cancelAudit: {
          func: this.doCancelAudit,
          iconName: '线性-退审',
          i18n: 'biz.btn.cancelAudit'
        },
        generate: {
          func: this.doGenerate,
          iconName: '线性-生成',
          i18n: 'biz.btn.generate'
        },
        export: {
          func: this.handleDownload,
          iconName: '线性-导出',
          i18n: 'biz.btn.export'
        },
        print: {
          iconName: '线性-打印',
          i18n: 'biz.btn.print'
        }
      }
    }
  },
  inject: ['app'],
  provide() {
    return {
      QmTable: this
    }
  },
  props: {
    // 主信息(按钮、表格、API等信息)
    mainData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  watch: {
    clientWidth() {
      this.tableComputed()
    },
    clientHeight() {
      this.tableComputed()
    },
    tableCols: {
      deep: true,
      handler() {
        this.formThead = this.tableCols.filter(i => {
          if (i.checkFlag) {
            return !!+i.checkFlag
          } else {
            return true
          }
        })
        this.key++ // 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
      }
    },
    tagViewVisible() {
      this.tableComputed()
    }
  },
  beforeMount() {
    if (this.mainData.topBar) {
      this.mainData.topBar.forEach(v => {
        this.$set(v, 'loading', false)
      })
    }
    // 默认后台排序
    if (this.mainData.table.sortable === undefined) {
      this.mainData.table.sortable = 'custom'
    }
    // 列设置
    this.mainData.table.cols.forEach(v => {
      // 根据isShow字段判断是否显示
      if (v.isShow === undefined) {
        v.isShow = true
      }
      // 默认何种排序根据this.mainData.table.sortable
      v.sortable = v.sortable === false ? false : this.mainData.table.sortable
      this.tableCols.push(v)
    })
    this.formThead = this.tableCols

    //  默认为true
    if (this.mainData.isColset === undefined) {
      this.$set(this.mainData, 'isColset', false)
    }
    if (this.mainData.isColset && this.mainData.table) {
      if (this.mainData.table.id === undefined || this.mainData.table.id === '') {
        this.$set(this.mainData.table, 'id', this.$route.meta.title)
      }
      this.checkChange()
    }

    if (this.mainData.initSearch !== undefined) {
      if (this.mainData.initSearch) {
        this.getList()
      }
    } else {
      if (process.env.INIT_SEARCH) {
        this.getList()
      }
    }
  },
  mounted() {
    this.tableComputed()

    // 全屏时触碰视窗顶部显示标签栏
    $(document).on('mousemove', e => {
      if (!screenfull.isFullscreen) return
      if (e.clientY === 0) {
        this.app.$refs.tagsView.visible = false
        $('.tags-view').show()
      }

      if (!$('.tags-view').is(':hidden') && e.clientY < 27) {
        $('.tags-view').show()
        // 防止在0处不移动则不触发hover效果
        $('#app-main').css('margin-top', '26px')
        this.tagViewVisible = true
      } else {
        $('.tags-view').hide()
        $('#app-main').css('margin-top', 0)
        this.tagViewVisible = false
      }
    })
  },
  methods: {
    // 列表数据请求
    getList(button) {
      this.loading = true
      if (this.mainData.table.rowKey && !this.mainData.table.expandAll) {
        this.tableData = []
      }
      if (button && button.name && button.name === 'search') {
        if (this.$parent.$refs.qmForm) {
          this.$parent.$refs.qmForm.loading = true
        }
      }
      request({
        url: this.mainData.api.search,
        method: 'POST',
        data: this.$parent.form.listQuery
      })
        .then(response => {
          this.loading = false
          if (this.$parent.$refs.qmForm) {
            this.$parent.$refs.qmForm.loading = false
          }
          this.tableData = response.data
          this.total = response.total
          // 防止动态设置tableHeight时合计栏被遮挡隐藏
          setTimeout(() => {
            this.tableHeight = this.tableHeight - 0.1
          }, 1000)
          if (this.tableData && this.tableData.length > 0) {
            this.emptyTextVisible = false
          } else {
            this.emptyTextVisible = true
          }
        })
        .catch(() => {
          this.loading = false
          if (this.$parent.$refs.qmForm) {
            this.$parent.$refs.qmForm.loading = false
          }
        })
    },
    // 计算列表高度
    tableComputed() {
      const elHead = document.getElementById('elHead')
      let getElHeadHeight = 0
      // 是否存在头部表单
      if (elHead) {
        getElHeadHeight = window.getComputedStyle(elHead).height.split('px')[0] * 1
      } else {
        getElHeadHeight -= 5
      }
      // 减去联动列表高度
      getElHeadHeight += 150
      // 是否最大化
      if (screenfull.isFullscreen) {
        getElHeadHeight -= 76
        // 最大化时是否显示标签栏
        if (this.tagViewVisible) {
          getElHeadHeight += 26
        }
      }
      this.tableHeight = this.clientWidth < 1366 ? (this.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 188 : this.clientHeight - getElHeadHeight - 158) : this.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 172 : this.clientHeight - getElHeadHeight - 142
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
    // 是否锁定
    handleLockChange(prop) {
      const arr = []
      this.tableCols.forEach((c, index) => {
        if (c.prop === prop) {
          c.fixed = !c.fixed
        }
        arr.push(c)
      })
      this.tableCols = arr
    },
    // 列设置
    checkChange() {
      this.checked = []
      request({
        url: '/api/sys/tableConfig/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.mainData.table.id
        }
      })
        .then(res => {
          if (res.data.length === 0) {
            this.tableCols.forEach(col => {
              col.checkFlag = '1'
            })
            this.key++
            this.checked = this.mainData.table.cols.map(v => {
              return v.prop
            })
          } else {
            res.data.forEach(col => {
              this.tableCols.forEach(c => {
                if (col.itemId === c.prop) {
                  c.checkFlag = col.checkFlag
                  c.sortNo = col.sortNo
                  if (c.checkFlag === '1') {
                    this.checked.push(c.prop)
                  }
                }
              })
            })
            this.tableCols = this.tableCols.sort((obj1, obj2) => {
              const value1 = obj1['sortNo']
              const value2 = obj2['sortNo']
              return value1 - value2
            })
          }
        })
        .catch(() => { })
    },
    // 合计方法
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        const values = data.map(item => Number(item[column.property]))
        const filterCol = this.mainData.table.cols.filter(col => col.prop === column.property)[0]

        if (filterCol && filterCol.summary) {
          if (filterCol.format && filterCol.format.func) {
            const value = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = Vue.filter(filterCol.format.func)(value, filterCol.format.dict)
            return
          } else {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            return
          }
        }
      })
      return sums
    },
    // 删除
    doDelete(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
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
      // 后端验证
      if (buttonInfo.validateApi) {
        const param = buttonInfo.validateApi(this.currentRow)
        if (param && param.url) {
          request({
            url: param.url,
            method: 'POST',
            data: {
              data: param.data,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.check')
            }
          })
            .then(response => {
              if (response.status && response.msgText) {
                this.$notify(
                  notifyError({
                    msg: response.msgText
                  })
                )
              } else {
                this.confirmDelete(buttonInfo)
              }
            })
            .catch(() => { })
        }
      } else {
        this.confirmDelete(buttonInfo)
      }
    },
    // 验证通过 确认删除
    confirmDelete(buttonInfo) {
      if (buttonInfo.getParam) {
        this.setData = buttonInfo.getParam(this.currentRow)
      } else {
        this.setData = this.currentRow.id || this.currentRow.map(v => v.id)
      }
      this.funcOperationI18n = this.$t(buttonInfo.i18n) || this.$t('biz.btn.delete')
      this.operationMsgInfo = this.$t(buttonInfo.successMsgInfo) || this.$t('biz.msg.deleteSuccess')
      confirmTip(this, 'confirmDelete')
        .then(() => {
          this.loading = true
          request({
            url: this.mainData.api.doDelete,
            method: 'POST',
            data: {
              data: this.setData,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.funcOperationI18n
            }
          })
            .then(response => {
              this.$notify(notifySuccess({ msg: this.operationMsgInfo }))
              this.loading = false
              this.getList()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => { })
    },
    // 设置
    doSet(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
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
      // 后端验证
      if (buttonInfo.validateApi) {
        const param = buttonInfo.validateApi(this.currentRow)
        if (param && param.url) {
          request({
            url: param.url,
            method: 'POST',
            data: {
              data: param.data,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.check')
            }
          })
            .then(response => {
              if (response.status && response.msgText) {
                this.$notify(
                  notifyError({
                    msg: response.msgText
                  })
                )
              } else {
                this.confirmSet(buttonInfo)
              }
            })
            .catch(() => { })
        }
      } else {
        this.confirmSet(buttonInfo)
      }
    },
    // 设置操作
    confirmSet(buttonInfo) {
      if (buttonInfo.getParam) {
        this.setData = buttonInfo.getParam(this.currentRow)
      } else {
        this.setData = this.currentRow.id || this.currentRow.map(v => v.id)
      }
      this.funcOperationI18n = this.$t(buttonInfo.i18n) || this.$t('biz.btn.setting')
      this.operationMsgInfo = this.$t(buttonInfo.successMsgInfo) || this.$t('biz.msg.updateSuccess')

      this.loading = true
      request({
        url: this.mainData.api.set,
        method: 'POST',
        data: {
          data: this.setData,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.funcOperationI18n
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.operationMsgInfo }))
          this.loading = false
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
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

      // 后端验证
      if (buttonInfo.validateApi) {
        const param = buttonInfo.validateApi(this.currentRow)
        if (param && param.url) {
          request({
            url: param.url,
            method: 'POST',
            data: {
              data: param.data,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.check')
            }
          })
            .then(response => {
              if (response.status && response.msgText) {
                this.$notify(
                  notifyError({
                    msg: response.msgText
                  })
                )
              } else {
                this.confirmAdd(buttonInfo)
              }
            })
            .catch(() => { })
        }
      } else {
        this.confirmAdd(buttonInfo)
      }
    },
    // 验证通过 确认新增
    confirmAdd(buttonInfo) {
      // 编辑页弹窗组件注册
      if (buttonInfo.type === 'dialog') {
        // 注册组件
        Vue.component('view-form-table', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam(this.currentRow)
        }
        this.opType = 'add'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo(this.currentRow))
      }
    },
    // 新增下级单据
    doNext(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
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

      // 后端验证
      if (buttonInfo.validateApi) {
        const param = buttonInfo.validateApi(this.currentRow)
        if (param && param.url) {
          request({
            url: param.url,
            method: 'POST',
            data: {
              data: param.data,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.check')
            }
          })
            .then(response => {
              if (response.status && response.msgText) {
                this.$notify(
                  notifyError({
                    msg: response.msgText
                  })
                )
              } else {
                this.confirmNext(buttonInfo)
              }
            })
            .catch(() => { })
        }
      } else {
        this.confirmNext(buttonInfo)
      }
    },
    // 验证通过 确认新增
    confirmNext(buttonInfo) {
      // 编辑页弹窗组件注册
      if (buttonInfo.type === 'dialog') {
        // 注册组件
        Vue.component('view-form-table', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam(this.currentRow)
        }
        this.opType = 'add'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo(this.currentRow))
      }
    },
    // 弃审
    doCancelAudit(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
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
      if (buttonInfo.getParam) {
        this.setData = buttonInfo.getParam(this.currentRow)
      } else {
        this.setData['id'] = this.currentRow.id || this.currentRow.map(v => v.id)
      }
      this.setData['bpmType'] = this.$route.meta.bpmType

      this.dialogCancelAuditVisible = true
    },
    // 确认取消审核
    confirmCancelAudit() {
      this.loading = true
      request({
        url: this.mainData.api.cancelAudit,
        method: 'POST',
        data: {
          data: this.setData,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.cancelAudit')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.cancelSuccess') }))
          this.dialogCancelAuditVisible = false
          this.loading = false
          this.getList()
        })
        .catch(e => {
          this.loading = false
        })
    },
    // 审核
    doAudit(buttonInfo) {
      // 点击权限判断 如果返回为false 则验证不通过
      if (buttonInfo.validate && !buttonInfo.validate(this.currentRow)) {
        if (buttonInfo.msg) {
          this.$notify(notifyInfo({ msg: buttonInfo.msg }))
        }
        return
      }

      // 后端验证
      if (buttonInfo.validateApi) {
        const param = buttonInfo.validateApi(this.currentRow)
        if (param && param.url) {
          request({
            url: param.url,
            method: 'POST',
            data: {
              data: param.data,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.check')
            }
          })
            .then(response => {
              if (response.status && response.msgText) {
                this.$notify(
                  notifyError({
                    msg: response.msgText
                  })
                )
              } else {
                this.confirmAudit(buttonInfo)
              }
            })
            .catch(() => { })
        }
      } else {
        this.confirmAudit(buttonInfo)
      }
    },
    // 确认审核
    confirmAudit(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      // 审批处理
      if (this.$route.meta.bpmType === 'activiti') {
        this.auditByActiviti(buttonInfo)
      } else if (this.$route.meta.bpmType === 'dingTalk') {
        this.auditByDingTalk(buttonInfo)
      }
    },
    /**
     * 钉钉审批
     * @param {Object} buttonInfo 按钮信息
     */
    auditByDingTalk(buttonInfo) {
      this.loading = true
      let inputParam = {}
      if (buttonInfo.getParam) {
        inputParam = buttonInfo.getParam(this.currentRow)
        if (inputParam.row.auditStatus !== '1') {
          this.$notify(
            notifyError({
              msg: this.$t('biz.msg.disableSubmit')
            })
          )
          this.loading = false
          return
        }
      }

      bpmDingUtil.auditByDingTalk(this, this.moduleCode, inputParam)
      // // 获取钉钉[手输]表单
      // const inputFormQryParam = bpmUtil.createDingInputFormQryParam(this.moduleCode, inputParam.uk.value)
      // bpmUtil.getDingInputForm(
      //   inputFormQryParam,
      //   this,
      //   responseData => {
      //     // this.loading = false
      //     // // 若存在[手输]表单，则弹框填写相关信息
      //     // if (responseData.formExistFlag) {
      //     //   const dialogData = responseData.dialogData
      //     // 注册组件
      //     Vue.component('view-form-table', () => import('@/views/frame/base/sys/bpmSet/dingTalk/userInputDialog'))
      //     this.param = buttonInfo.getParam(this.currentRow)
      //     this.param.dialogData = responseData.dialogData
      //     this.param.dingCcUserList = responseData.dingCcUserList
      //     this.param.dingSubmitDeptId = responseData.dingSubmitDeptId
      //     this.param.moduleCode = this.moduleCode
      //     this.dialogDetailVisible = true
      //     return
      //     // }

      //     // // 若无[手输]表单，则直接启动审批
      //     // this.param = buttonInfo.getParam(this.currentRow)
      //     // this.startAuditByDingTalk()
      //   },
      //   response => {
      //     this.loading = false
      //   },
      //   () => {
      //     this.loading = false
      //   }
      // )
    },
    /**
     * activiti审批
     * @param {Object} buttonInfo 按钮信息
     */
    auditByActiviti(buttonInfo) {
      // 编辑页弹窗组件注册
      if (buttonInfo.type === 'dialog') {
        // 注册组件
        Vue.component('view-form-table', () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog'))
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam(this.currentRow)
          if (this.param.row.auditStatus !== '1') {
            this.$notify(
              notifyError({
                msg: this.$t('biz.msg.disableSubmit')
              })
            )
            return
          }
          this.id = this.param.row.id
          this.dialogDetailVisible = true
        }
        this.opMode = buttonInfo.type
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo(this.currentRow))
      }
    },
    // 审批历史
    showAuditHistory(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.opType = 'view'
      Vue.component('view-form-table', () => import('@/views/frame/base/bpm/components/approveHistory.vue'))
      if (buttonInfo.getParam) {
        this.param = buttonInfo.getParam(this.currentRow)
        this.id = this.param.row.id
        this.dialogDetailVisible = true
      }
      this.opMode = buttonInfo.type
    },
    // 查看
    doView(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
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

      // 后端验证
      if (buttonInfo.validateApi) {
        const param = buttonInfo.validateApi(this.currentRow)

        if (param && param.url) {
          request({
            url: param.url,
            method: 'POST',
            data: {
              data: param.data,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.check')
            }
          })
            .then(response => {
              if (response.status && response.msgText) {
                this.$notify(
                  notifyError({
                    msg: response.msgText
                  })
                )
              } else {
                this.confirmView(buttonInfo)
              }
            })
            .catch(() => { })
        }
      } else {
        this.confirmView(buttonInfo)
      }
    },
    // 验证通过 确认查看
    confirmView(buttonInfo) {
      if (buttonInfo.type === 'dialog') {
        Vue.component('view-form-table', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam(this.currentRow)
        } else {
          this.param = this.currentRow
        }
        this.opType = 'view'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo(this.currentRow))
      }
    },
    // 查看明细
    doDetail(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
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

      // 后端验证
      if (buttonInfo.validateApi) {
        const param = buttonInfo.validateApi(this.currentRow)

        if (param && param.url) {
          request({
            url: param.url,
            method: 'POST',
            data: {
              data: param.data,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.check')
            }
          })
            .then(response => {
              if (response.status && response.msgText) {
                this.$notify(
                  notifyError({
                    msg: response.msgText
                  })
                )
              } else {
                this.confirmView(buttonInfo)
              }
            })
            .catch(() => { })
        }
      } else {
        this.confirmView(buttonInfo)
      }
    },
    // 验证通过 确认查看明细
    confirmDetail(buttonInfo) {
      if (buttonInfo.type === 'dialog') {
        Vue.component('view-form-table', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam(this.currentRow)
        } else {
          this.param = this.currentRow
        }
        this.opType = 'view'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo(this.currentRow))
      }
    },
    // 更新
    doUpdate(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      // 前端验证
      if (buttonInfo.validate && !buttonInfo.validate(this.currentRow)) {
        if (buttonInfo.msg) {
          this.$notify(notifyInfo({ msg: buttonInfo.msg }))
        }
        return
      }
      // 后端验证
      if (buttonInfo.validateApi) {
        const param = buttonInfo.validateApi(this.currentRow)
        if (param && param.url) {
          request({
            url: param.url,
            method: 'POST',
            data: {
              data: param.data,
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.check')
            }
          })
            .then(response => {
              if (response.status && response.msgText) {
                this.$notify(
                  notifyError({
                    msg: response.msgText
                  })
                )
              } else {
                this.confirmUpdate(buttonInfo)
              }
            })
            .catch(() => { })
        }
      } else {
        this.confirmUpdate(buttonInfo)
      }
    },
    // 验证通过 确认更新
    confirmUpdate(buttonInfo) {
      if (buttonInfo.type === 'dialog') {
        Vue.component('view-form-table', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam(this.currentRow)
        } else {
          this.param = this.currentRow
        }
        this.opType = 'update'
        this.opMode = buttonInfo.type
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo(this.currentRow))
      }
    },
    // 生成弹窗
    doGenerate(buttonInfo) {
      if (!this.currentRow || this.currentRow.length === 0) {
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
      // 编辑页弹窗组件注册
      if (buttonInfo.type === 'dialog') {
        // 注册组件
        Vue.component('view-form-table', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam(this.currentRow)
        }
        this.opType = 'add'
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo())
      }
    },
    // 编辑关闭回调
    dialogHandler(param, query) {
      if (param) {
        // 提交审批
        if (this.param && this.param.type === 'audit') {
          // 关闭[手输]表单弹窗
          this.dialogDetailVisible = false
          // 启动[钉钉]审批
          if (bpmUtil.isAuditOfDingTalk(this)) {
            bpmDingUtil.startAuditByDingTalk(this, query)
            return
          }

          // 启动[activity]审批
          this.startAuditByActiviti(query)
        } else {
          this.getList()
        }
      }
      this.dialogDetailVisible = false
    },
    // /**
    //  * 启动[钉钉]审批
    //  * @param {Object} inputFormInfo 手动输入信息
    //  */
    // startAuditByDingTalk(inputFormInfo) {
    //   this.loading = true
    //   const inputParam = this.param
    //   let bpmVarParamList = []
    //   bpmUtil.addVarParam(bpmVarParamList, inputParam.uk)
    //   bpmUtil.addVarParam(bpmVarParamList, inputParam.todotext)
    //   const auditDataParam = bpmUtil.createAduitParam(this.moduleCode, inputParam.uk.value, bpmVarParamList, inputFormInfo)
    //   bpmUtil.auditByDingTalk(
    //     auditDataParam,
    //     this,
    //     responseData => {
    //       this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
    //       this.getList()
    //     },
    //     () => {
    //       this.getList()
    //     },
    //     () => {
    //       this.getList()
    //     }
    //   )
    // },
    /**
     * 启动[activity]审批
     */
    startAuditByActiviti(query) {
      this.loading = true
      query.push(this.param.uk)
      query.push(this.param.todotext)

      const nextUserObj = {
        bpmVariableParamList: query,
        moduleCode: this.moduleCode
      }

      request({
        url: this.mainData.api.submit ? this.mainData.api.submit : '/api/bpm/processInstance/startApproveProcessByModuleCode',
        method: 'POST',
        data: {
          data: nextUserObj,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
          this.getList()
        })
        .catch(() => {
          this.getList()
        })
    },
    // 导出excel
    exportfunc() {
      this.loading = true
      const param = Object.assign({}, this.$parent.form.listQuery, {
        isPage: false
      })
      return request({
        url: this.mainData.api.search,
        method: 'POST',
        data: param
      })
    },
    callBackfunc() {
      this.$parent.form.listQuery.isPage = true
      this.loading = false
    },
    apiDownLoad(buttonInfo) {
      const param = Object.assign({}, this.$parent.form.listQuery, {
        isPage: false,
        funcOperation: this.$t('biz.btn.export')
      })
      param.excelInfo = {}
      if (buttonInfo.getParam) {
        param.excelInfo = buttonInfo.getParam()
      }
      if (!param.excelInfo['name']) {
        param.excelInfo['name'] = this.$t('route.' + this.$route.meta.title)
      }
      const titleData = []
      this.mainData.table.cols.map(col => {
        if (col.label) {
          titleData.push({
            name: this.$t(col.label),
            prop: col.prop
          })
        }
      })
      param.excelInfo.excelTitleInfoList = titleData

      axios({
        method: 'post',
        url: process.env.BASE_API + this.mainData.api.export,
        data: param,
        headers: {
          Authorization: 'Bearer ' + this.$store.getters.token,
          lang: storage.get('language') || 'zh',
          module: session.get('auditModule') || ''
        },
        responseType: 'blob'
      })
        .then(response => {
          if (!response.data) {
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', param.excelInfo['name'] + '.xls')
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleDownload(buttonInfo) {
      if (buttonInfo && buttonInfo.type && buttonInfo.type === 'api') {
        // 后台导出
        this.apiDownLoad(buttonInfo)
      } else {
        exportExcel({
          fileName: this.$t('route.' + this.$route.meta.title),
          header: this.mainData.table.cols.map(col => {
            if (col.label) return this.$t(col.label)
          }),
          filterVal: this.mainData.table.cols.map(col => {
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
      }
    },
    // 页码跳转、N条每页
    handleSizeChange(val) {
      this.$parent.form.listQuery.size = val
      this.getList()
    },
    // 点击翻页
    handleCurrentChange(val) {
      this.$parent.form.listQuery.current = val
      this.getList()
    },
    // 后台排序
    handleSortChange({ column, prop, order }) {
      const sortProp = this.mainData.table.cols.filter(col => col.prop === prop)[0].sortProp || prop
      if (this.mainData.table.sortable && this.mainData.table.sortable === 'custom') {
        if (order) {
          const asc = order === 'ascending' ? '.asc' : '.desc'
          this.$parent.form.listQuery.sortString = sortProp + asc
          this.getList()
        } else {
          this.$parent.form.listQuery.sortString = ''
          if (this.$parent.form.listQuery.defaultSortString) {
            this.getList()
          }
        }
      }
    },
    // 单选
    handleSelectRow(val) {
      if (!this.mainData.table.showCheckbox) this.currentRow = val
      if (this.mainData.linkTable) {
        this.loadingLv2 = true
        request({
          url: this.mainData.api.search_lv2,
          method: 'POST',
          data: this.mainData.apiData && this.mainData.apiData.search_lv2 ? this.mainData.apiData.search_lv2(this.currentRow) : this.currentRow
        })
          .then(response => {
            this.loading = false
            this.linkTableData = response.data
            this.total = response.total
            if (this.total && this.total > 0) {
              this.emptyTextVisibleLv2 = false
            } else {
              this.emptyTextVisibleLv2 = true
            }
          })
          .catch(() => {
            this.loadingLv2 = false
          })
      }
    },
    // 多选
    handleSelectionChange(val) {
      if (this.mainData.table.showCheckbox) this.currentRow = val
    }
  }
}
</script>
