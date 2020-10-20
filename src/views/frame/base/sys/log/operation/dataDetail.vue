
<template>
  <div>
    <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="formData.dataJsonArray" :height='400'>
      <el-table-column prop="NEW_OR_OLD_TYPE" width='200'></el-table-column>
      <el-table-column :prop="key" :label="value" width='200' v-for="(value,key)  in formData.dataPropertyJson" :key="key"></el-table-column>
    </el-table>
  </div>
</template>

<script>

// axios访问
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      formData: {},
      loading: false
    }
  },
  props: {
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 初始化数据
    getList() {
      this.loading = true
      request({
        url: '/api/sys/log/operation/detail',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.param.id
        }
      })
        .then(response => {
          this.loading = false
          this.formData = response.data
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
