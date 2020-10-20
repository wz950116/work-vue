<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='treeTableDialog'>
      <!-- 头部 -->
      <title-contain titleName='出库通知相关打印' @TitleFun="$emit('closeHandler')" />

      <!-- 内容 -->
      <main style='margin: 3px 3px 43px;'>
        <div class='left-content'>
          <ul>
            <li v-for='i in items' :class="['list-item', activeUrl === i.url ? 'list-item-active' : 'list-item-unactive']" @click='activeUrl = i.url'>
              {{ i.name }}
            </li>
          </ul>
        </div>
        <div class='right-content' style='border: 1px solid #aaaaaa;border-radius: 5px 5px 0 0;'>
          <iframe :src="activeUrl" frameborder="0" width="100%" height="100%"></iframe>
        </div>
      </main>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-db-click size="mini" @click="$emit('closeHandler')">取消</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeUrl: 'http://124.193.69.147:10232/FineReport/decision/view/report?viewlet=zhongmian%2F%25E6%258F%2590%25E8%25B4%25A7%25E5%258D%2595.cpt',
      items: [
        {
          name: '打印提货单',
          url: 'http://124.193.69.147:10232/FineReport/decision/view/report?viewlet=zhongmian%2F%25E6%258F%2590%25E8%25B4%25A7%25E5%258D%2595.cpt'
        }
      ]
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
    text-align: left;
    padding-left: 5px;
    cursor: pointer;
    border-bottom: 1px solid #ebeef5;
    &:hover {
      background: linear-gradient(#f5f7fa, #e2e9f4);
    }
  }
  .list-item-unactive {
    background: #f5f7fa;
  }
  .list-item-active {
    background: linear-gradient(#f5f7fa, #e2e9f4);
  }
}
</style>