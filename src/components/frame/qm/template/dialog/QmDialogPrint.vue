<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='treeTableDialog'>
      <!-- 头部 -->
      <title-contain titleName='打印预览' @TitleFun="$emit('closeHandler')" />

      <!-- 内容 -->
      <main style='margin: 3px 3px 43px;'>
        <div class='left-content'>
          <ul>
            <li v-for='i in list' :key="i.id" :class="['list-item', activeId === i.id ? 'list-item-active' : 'list-item-unactive']" @click='doPrint(i.data)'>
              {{ i.name }}
            </li>
          </ul>
        </div>
        <div class='right-content'>
          <iframe :src="activeUrl" frameborder="0" width="100%" height="100%"></iframe>
        </div>
      </main>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="$emit('closeHandler', true)">关闭</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import { mapGetters } from 'vuex'
import session from '@/utils/frame/base/sessionStorage'
export default {
  data() {
    return {
      activeUrl: this.active,
      activeId: ''
    }
  },
  props: {
    active: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters(['md5'])
  },
  mounted() {
    request({
      url: '/api/sys/sysBillPrint/list',
      method: 'post',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: {
          moduleCode: this.$attrs.moduleCode || this.$root.$route.meta.bpmModule
        },
        sortString: 'printDefault.desc, printName.asc'
      }
    }).then(response => {
      if (response.status) {
        for (let i = 0; i < response.data.length; i++) {
          const billPrint = response.data[i]
          if (billPrint.printDefault === '1') {
            this.doPrint(billPrint)
          }
          this.list.push({
            name: billPrint.printName,
            url: billPrint.printJsppath,
            data: billPrint,
            id: billPrint.id
          })
        }
      }
    })
  },
  methods: {
    doPrint(tempData) {
      let url = process.env.REPORT_URL + '?viewlet=' + encodeURIComponent(tempData.printJsppath)
      url = url + '&token=' + encodeURIComponent(this.md5)
      url = url + '&tenantCode=' + encodeURIComponent(tempData.tenantCode)
      this.activeId = tempData.id
      for (let paramKey in this.$attrs.param) {
        const paramVal = this.$attrs.param[paramKey]
        url = url + '&' + encodeURIComponent(paramKey) + '=' + encodeURIComponent(paramVal)
      }
      if (this.activeUrl !== url) {
        this.activeUrl = url
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.left-content {
  .list-item {
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
    &:hover {
      background: linear-gradient(#f5f7fa, #5594e7cc);
    }
  }
  .list-item-unactive {
    background: #f5f7fa;
  }
  .list-item-active {
    background: linear-gradient(#f5f7fa, #4890eecc);
  }
}
.right-content {
  border: 1px solid #aaaaaa;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
}
</style>