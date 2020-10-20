<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='treeDialog'>
      <!-- 头部 -->
      <title-contain :titleName='dialog.titleName' @TitleFun="$emit('closeDialog')" />
      <!-- 内容 -->
      <main>
        <el-form v-if='dialog.form.isSearch'>
          <el-form-item>
            <input-validate v-model="filterText" clearable size="mini" placeholder="输入关键字进行过滤" style="padding:5px;"></input-validate>
          </el-form-item>
        </el-form>
        <el-tree ref="tree" :render-content="renderContent" :data="treeData" :default-checked-keys="defaultCheckedKeys" :show-checkbox="dialog.form.showCheckbox" :check-strictly='dialog.form.strictly' :node-key="dialog.form.defaultProps.key ? dialog.form.defaultProps.key : id" :props="dialog.form.defaultProps" :default-expand-all="dialog.form.expandAll" :expand-on-click-node='dialog.form.expandOnClickNode' :check-on-click-node="true" @node-click="handleNodeClick" @check-change="handleNodeChange" :filter-node-method="filterNode">
        </el-tree>
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
import request from '@/utils/frame/base/request'
import { confirmTip } from '@/utils/frame/base/notifyParams'

export default {
  data() {
    return {
      multipleSelection: [],
      loading: false,
      filterText: '',
      currentRow: null,
      checkedNodes: [],
      checkedKeys: [],
      defaultCheckedKeys: [], // 默认勾选的节点的 key 的数组
      treeData: []
    }
  },
  props: {
    dialog: {
      type: Object,
      default() {
        return {}
      }
    },
    selectCheck: {
      type: Function,
      default: null
    }
  },
  beforeMount() {},

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    if (this.dialog.form.initSearch) {
      this.getTree()
    }
  },
  methods: {
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
          // 初始化数据回调
          this.$emit('initCallback', this.treeData)
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
            this.defaultCheckedKeys = response.data
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

    // 树点击
    handleNodeClick(node) {
      if (this.dialog.form.handleNodeClick && typeof this.dialog.form.handleNodeClick === 'function') {
        this.dialog.form.handleNodeClick(node)
      }
    },
    // 树选择
    handleNodeChange(node) {
      if (this.dialog.form.handleNodeChange && typeof this.dialog.form.handleNodeChange === 'function') {
        this.dialog.form.handleNodeChange(node)
      } else {
        this.checkedNodes = this.$refs.tree.getCheckedNodes()
        this.checkedKeys = this.$refs.tree.getCheckedKeys()
      }
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
          this.$emit('closeDialog', this.$refs.tree.getCheckedKeys())
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

    // 清空通用事件
    clear() {
      this.$refs.tree.setCheckedKeys([])
    }
  }
}
</script>
