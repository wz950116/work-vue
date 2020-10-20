<template>
  <el-select :placeholder="$t('biz.placeholder.choose')" v-model="checkItem" @change="change" :clearable="clearable" :filterable="filterable" :disabled="disabled" :size='size'>
    <el-option v-for="item in listData" :key="item.projectCode" :label="item.projectName" :value="item.projectCode"></el-option>
  </el-select>
</template>

<script>
import { getList, getDeleteData } from '@/api/frame/base/data/projectFile'

export default {
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      flag: true,
      checkItem: this.value,
      listData: [],
      listQuery: {
        isPage: false,
        data: {},
        defaultSortString: 'projectName.asc',
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      }
    }
  },
  props: {
    value: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    queryConditions: {
      type: Object,
      default() {
        return {
          usingFlag: '1',
          projectStat: '3'
        }
      }
    },
    size: {
      type: String,
      default: 'medium'
    }
  },
  watch: {
    value(newValue) {
      if (!newValue) {
        this.checkItem = null
      } else {
        if (this.listData && this.listData.length > 0) {
          this.changeVal(newValue)
        }
      }
    }
  },
  model: {
    prop: 'value',
    event: 'setProjectName'
  },
  mounted() {
    // 渲染数据
    this.getList()
  },
  methods: {
    getDeleteData(a, b) {
      getDeleteData(a, b).then(response => {
        if (response.data) {
          this.listData.push(response.data)
        }
      })
    },
    // 列表请求
    getList() {
      this.listQuery.data = this.queryConditions
      this.listQuery.data.usingFlag = '1'
      getList(this.listQuery)
        .then(response => {
          this.listData = response.data
          if (this.value) this.changeVal(this.value)
        })
        .catch(() => {})
    },
    change(evl) {
      this.$emit('setProjectName', evl)
    },
    changeVal(newValue) {
      let isNull = false // 是否已被删除
      const ids = this.listData.map(item => {
        return item.projectCode
      }) // 下拉选id集合
      isNull = !ids.includes(newValue)
      if (isNull && this.disabled) {
        getDeleteData(newValue, this.func).then(response => {
          if (response.data) {
            this.checkItem = response.data.ProjectName
            this.change(newValue)
          }
        })
      } else if (isNull && !this.disabled) {
        this.checkItem = ''
        this.$emit('setProjectName', '')
      } else {
        this.checkItem = newValue
      }
    }
  }
}
</script>
