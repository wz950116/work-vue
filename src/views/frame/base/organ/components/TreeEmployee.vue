<template>
  <el-tree-select :defaultProps="defaultProps" v-model='treeValue' :treeData='treeData' :clearable="clearable" :selectCheck='selectCheck' :disabled='disabled' :defaultExpandAll='defaultExpandAll' :multiple='multiple' :strictly='strictly' :nodeKey='nodeKey' :clickParent='clickParent' @change='changeHandle' @changAll='changAllHandle'></el-tree-select>
</template>

<script>
import elTreeSelect from '@/components/frame/ElTreeSelect'

import { notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'employeeOrg',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
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
    // 机构
    orgCode: String | Array,
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
      default: '1'
    },
    // 父节点是否可点击
    clickParent: {
      type: Boolean,
      default: false
    },
    jurisdiction: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    deptCode: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    },
    // 是否关联父子节点
    strictly: {
      type: Boolean,
      default: false
    },
    // 是否启用数据权限
    dataAuth: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    orgCode(value) {
      this.loadEmployee()
    },
    deptCode() {
      this.loadEmployee()
    },
    value(newValue) {
      this.treeValue = newValue
    }
  },
  mounted() {
    this.loadEmployee()
  },
  methods: {
    // 递归
    recursionNode(data) {
      if (data instanceof Array) {
        data.forEach(node => {
          if (!node.employeeCode) {
            node.disabled = true
          }
          if (node.children && node.children.length > 0) {
            this.recursionNode(node.children)
          }
        })
      }
    },
    loadEmployee() {
      request({
        url: '/api/func/employee/treeEmployee',
        method: 'POST',
        data: {
          data: {
            usingFlag: this.usingFlag,
            orgCode: this.orgCode,
            deptCode: this.deptCode,
            jurisdiction: this.jurisdiction,
            dataAuth: this.dataAuth
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          if (response.data) {
            this.treeData = response.data
            if (this.multiple) {
              this.recursionNode(this.treeData)
            }
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
      if (node && node.employeeCode) {
        return true
      } else {
        if (!this.multiple) {
          this.$notify(notifyError({ msg: this.$t('msg.organ.employeeSelect') }))
        }
        return false
      }
    }
  }
}
</script>
