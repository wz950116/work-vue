<template>
  <el-tree-select :defaultProps="defaultProps" v-model='treeValue' :treeData='treeData' :clearable="clearable" :disabled='disabled' :defaultExpandAll='defaultExpandAll' :multiple='multiple' :strictly='strictly' nodeKey='dictItemCode' :clickParent='clickParent' @change='changeHandle'></el-tree-select>
</template>

<script>
import elTreeSelect from '@/components/frame/ElTreeSelect'
import request from '@/utils/frame/base/request'
export default {
  name: 'treeDict',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'dictItemName'
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
    dictCode: {
      type: String,
      default: ''
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
    // 父节点是否可点击
    clickParent: {
      type: Boolean,
      default: false
    },
    titleFlg: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否关联父子节点
    strictly: {
      type: Boolean,
      default: false
    },
    clearable: {
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
    this.loadArea()
  },
  methods: {
    loadArea() {
      this.treeData = []
      if (this.dictCode !== null && this.dictCode !== undefined && this.dictCode !== '') {
        request({
          url: '/api/dd/treeDict/get',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: this.dictCode
          }
        }).then(response => {
          if (response.status) {
            const buff = []
            const dictItem = response.data.dictItem
            for (let i = 0; i < dictItem.length; i++) {
              buff.push(dictItem[i])
            }
            while (buff.length > 0) {
              const prtItem = buff.pop()
              if (response.data.usingFlag === '1' && prtItem.usingFlag === '1') {
                prtItem.disabled = false
              } else {
                prtItem.disabled = true
              }
              if (Array.isArray(prtItem.children) && prtItem.children.length > 0) {
                prtItem.leaf = false
              } else {
                prtItem.children = null
                prtItem.leaf = true
              }
              if (prtItem.leaf === false) {
                for (let i = 0; i < prtItem.children.length; i++) {
                  buff.push(prtItem.children[i])
                }
              }
            }
            this.treeData = dictItem
          }
        })
      }
    },
    changeHandle(value) {
      this.$emit('change', value)
    }
  }
}
</script>
