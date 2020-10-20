<template>
  <el-tree-select :defaultProps="defaultProps" v-model='treeValue' :treeData='treeData' :clearable="clearable" :disabled='disabled' :selectCheck='selectCheck' :defaultExpandAll='defaultExpandAll' :multiple='multiple' :strictly='strictly' :nodeKey='nodeKey' :clickParent='clickParent' @change='changeHandle' @changAll='changAllHandle'></el-tree-select>
</template>

<script>
import elTreeSelect from '@/components/frame/ElTreeSelect'

import { notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'treeBillMenu',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'cname'
      },
      treeValue: this.value,
      treeData: []
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {
    elTreeSelect
  },
  props: {
    // 绑定值
    value: {
      type: String | Array,
      default: null
    },
    // 是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 唯一标识对应字段
    nodeKey: {
      type: String,
      default: 'code'
    },
    // 启用停用标识对应字段,1:启用，0：停用
    usingFlag: {
      type: String,
      default: ''
    },
    // 父节点是否可点击
    clickParent: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否关联父子节点
    strictly: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(newValue) {
      this.treeValue = newValue
    }
  },
  mounted() {
    this.loadTree()
  },
  methods: {
    loadTree() {
      request({
        url: '/api/sys/menu/billMenu',
        method: 'POST',
        data: {
          data: '',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          if (response.data) {
            this.treeData = response.data
          }
        })
        .catch(() => {
          this.treeData = []
        })
    },
    changeHandle(value) {
      this.$emit('change', value)
    },
    changAllHandle(node) {
      this.$emit('handleNode', node)
      this.$emit('selectChange', node)
    },
    selectCheck(node) {
      if (node && node.flag && node.flag === '1') {
        return true
      } else {
        this.$notify(notifyError({ msg: this.$t('biz.msg.disableSelectCatalog') }))
        return false
      }
    }
  }
}
</script>
