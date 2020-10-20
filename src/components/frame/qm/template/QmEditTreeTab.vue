<template>
  <div>
    <div v-if='tab.topBar' class='tabs-operate' style='margin-top:5px;'>
      <el-button v-db-click size="mini" v-for='btn in tab.topBar.filter(v => { return v.isShow })' :key='btn.name' @click='triggerEvent(btn)' :disabled='btn.disabled'>
        <svg-icon :icon-class="btn.iconName || baseEvent[btn.name] && baseEvent[btn.name].iconName"></svg-icon>{{ $t(btn.i18n) || $t(baseEvent[btn.name].i18n) }}
      </el-button>
    </div>
    <el-table :key='key' :default-expand-all="tab.table.expandAll" :rowKey="tab.table.rowKey" type="expand" stripe border class='table-content qm-tree-table' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='400' @current-change="handleSelectRow">
      <el-table-column align='center' type="selection" width="45" fixed v-if="tab.table.showSelection"></el-table-column>
      <template v-for='col in tableCols'>
        <el-table-column v-if='col.isShow' :key='col.prop' v-bind='col' :label='$t(col.label)' show-overflow-tooltip>
          <template slot-scope='scope'>
            <template v-if='tab.type === "view" || tab.type === "detail" || tab.type === "detailSet"' :style='col.style'>
              <span v-if='!col.format'>{{ scope.row[col.prop] }}</span>
              <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict,col.format.dictType) }}</span>
            </template>
            <template v-else :style='col.style'>
              <!-- 日期 -->
              <el-date-picker v-if='col.type === "date"' v-model="scope.row[col.prop]" size='mini' v-bind='col.attrs' :type="col.type" :placeholder="$t('biz.placeholder.dateInput')"></el-date-picker>
              <!-- 字典码表 -->
              <el-select v-else-if='col.list' v-model="scope.row[col.prop]" size='mini' v-bind='col.attrs' :placeholder="$t('biz.placeholder.choose')">
                <el-option v-for="item in col.list" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <!-- 公用组件 -->
              <component v-else :is='col.element' v-model='scope.row[col.prop]' size='mini' v-bind='col.attrs' :attrs='col.attrs'></component>
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 编辑弹窗 -->
    <view-form v-if='dialogDetailVisible' @closeHandler='dialogHandler' :param='param' :opType="opType" :opMode='opMode'></view-form>
  </div>
</template>

<script>
// 调用Vue全局过滤器
import Vue from 'vue'
// axios访问
import request from '@/utils/frame/base/request'
// 提醒
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      loading: false,
      param: {},
      opType: '',
      // 编辑模式：dialog or route
      opMode: '',
      currentRow: null,
      tableCols: [],
      tableData: [],
      // 编辑页控制显示隐藏
      dialogDetailVisible: false,
      // 强制刷新列表标识
      key: 0,
      baseEvent: {
        add: {
          func: this.doAdd,
          iconName: '线性-增行',
          i18n: 'biz.btn.addRow'
        },
        delete: {
          func: this.doDelete,
          iconName: '线性-删行',
          i18n: 'biz.btn.deleteRow'
        },

        update: {
          func: this.doUpdate,
          iconName: '线性-修改',
          i18n: 'biz.btn.update'
        },
        set: {
          func: this.doSet,
          iconName: '线性-设置',
          i18n: 'biz.btn.setting'
        },
        expand: {
          func: this.expandAll,
          iconName: '线性-设置',
          i18n: this.tab.table.expandAll ? 'biz.btn.contract' : 'biz.btn.expand'
        }
      }
    }
  },
  props: {
    tab: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.tab.table.cols.forEach(v => {
      // 根据isShow字段判断是否显示
      if (v.isShow === undefined) {
        v.isShow = true
      }
      this.tableCols.push(v)
    })

    if (this.tab.topBar) {
      this.tab.topBar.forEach(v => {
        // 根据isShow字段判断是否显示
        if (v.isShow !== undefined) {
          if (typeof v.isShow !== 'boolean') {
            v.isShow = v.isShow.includes(this.tab.type)
          }
        } else {
          v.isShow = true
        }
      })
    }

    if (this.tab.type !== 'add') this.getList()
  },
  methods: {
    // 编辑关闭回调
    dialogHandler(param) {
      if (param) {
        this.getList()
      }
      this.dialogDetailVisible = false
    },
    // 返回指定过滤条件结果
    dataFormat(func = 'dataDictFormat', value, list, dictType) {
      if (dictType) {
        list = this.$t(dictType)
      }
      return Vue.filter(func)(value, list)
    },
    expandAll() {
      this.key++
      this.tab.table.expandAll = !this.tab.table.expandAll
      this.baseEvent.expand.i18n = this.baseEvent.expand.i18n === 'biz.btn.expand' ? 'biz.btn.contract' : 'biz.btn.expand'
    },
    // 初始化数据
    getList() {
      if (!this.tab.api.search) return
      this.loading = true
      request({
        url: this.tab.api.search,
        method: 'POST',

        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.tab.apiData.search
        }
      })
        .then(response => {
          this.loading = false
          this.tableData = response.data
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 按钮事件自定义
    triggerEvent(button) {
      if (button.event && typeof button.event === 'function') {
        button.event()
      } else if (this.baseEvent[button.name]) {
        this.baseEvent[button.name].func(button)
      }
    },

    // 新增
    doSet(buttonInfo) {
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
      if (buttonInfo.type === 'dialog') {
        Vue.component('view-form', buttonInfo.component)
        if (buttonInfo.getParam) {
          this.param = buttonInfo.getParam()
        } else {
          this.param = this.currentRow
        }

        this.opType = 'update'
        this.dialogDetailVisible = true
      } else if (buttonInfo.type === 'route') {
        this.$router.push(buttonInfo.routeInfo())
      }
    },
    // 增行
    doAdd() {
      const row = {}
      this.tableCols.forEach(c => {
        row[c.prop] = ''
      })
      this.tableData.push({
        ...row,
        rowNum: this.tableData.length
      })
    },
    // 删行
    doDelete() {
      if (!this.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      if (typeof this.currentRow.rowNum === 'number') {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            this.tableData.splice(this.currentRow.rowNum, 1)
          })
          .catch(() => {})
      } else {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    handleSelectRow(val) {
      this.currentRow = val
    }
  }
}
</script>

<style lang="scss">
.qm-tree-table {
  .el-table__body-wrapper {
    overflow-y: auto;
  }
}
</style>
