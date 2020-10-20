<template>
  <el-tree-select :defaultProps="defaultProps" v-model='treeValue' :treeData='treeData' :clearable="clearable" :disabled='disabled' :defaultExpandAll='defaultExpandAll' :multiple='multiple' :strictly='strictly' :nodeKey='nodeKey' :clickParent='true' @change='changeHandle'></el-tree-select>
</template>

<script>
import elTreeSelect from '@/components/frame/ElTreeSelect'
import request from '@/utils/frame/base/request'
export default {
  name: 'treeOrg',
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'productGroupName'
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
      default: 'productGroupCode'
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
      request({
        url: '/api/dd/product/group/treeProductGroup',
        method: 'POST',
        data: {
          data: '',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          if (response.data && response.data.length > 0) {
            this.treeData = response.data
          }
        })
        .catch(() => {
          this.treeData = []
        })
    },
    changeHandle(value) {
      this.$emit('change', value)
    }
  }
}
</script>
