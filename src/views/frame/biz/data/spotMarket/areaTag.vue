<template>
  <div style='padding-top:5px;height:300px;overflow:auto;'>
    <el-tree ref="tree" :data="treeData" :default-expand-all="true" show-checkbox node-key="areaCode" :default-expanded-keys="defaultExpanded" :default-checked-keys="defaultChecked" :props="defaultProps">
    </el-tree>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  name: 'spotMarket',
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'areaName'
      },
      defaultExpanded: [],
      defaultChecked: []
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.getTree()
  },
  methods: {
    getTree() {
      request({
        url: '/api/dd/area/treeArea',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          this.treeData = response.data
          if (this.type !== 'add') {
            this.getMarketArea()
          }
        })
        .catch(() => {})
    },
    getMarketArea() {
      request({
        url: '/api/dd/market/area/getByCode',
        method: 'POST',
        data: {
          data: this.param.marketCode,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          this.defaultChecked = response.data
        })
        .catch(() => {})
    }
  }
}
</script>
