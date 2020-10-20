<!-- 期货价格调整单 -->
<template>
  <el-tabs v-model="activeName" type="border-card">

    <!-- 期货价格调整单（主信息） -->
    <el-tab-pane :label="$t('quotation.futuresPriceAdjust.mainInfo')" name="mainInfo" v-if="showTabs.includes('futuresMaininfoTab')">
      <futures-maininfo-tab-form :id="futureAdjustId">
      </futures-maininfo-tab-form>
    </el-tab-pane>
    <!-- 期货价格调整单（调整单明细）  -->
    <el-tab-pane :label="$t('quotation.futuresPriceAdjust.adjustmentList')" name="" v-if="showTabs.includes('futuresAdjListTab')">
      <futures-adj-list-tabs-form :id="futureAdjustId" :adjustTypeChange='adjustType' :disabled='false'>
      </futures-adj-list-tabs-form>
    </el-tab-pane>
    <!-- 期货价格调整单（调整原因） -->
    <el-tab-pane :label="$t('quotation.futuresPriceAdjust.remark')" name="" v-if="showTabs.includes('futuresAdjReasonTab')">
      <futures-adj-reason-tabs-form :id="futureAdjustId">
      </futures-adj-reason-tabs-form>
    </el-tab-pane>

    <!-- 插槽 -->
    <slot />
  </el-tabs>
</template>

<script>
import * as futuresPriceAdjust from '@/api/frame/rm/derivative/futuresPriceAdjust'
// 标签页
import futuresMaininfoTabForm from '@/views/frame/rm/derivative/components/FuturesMaininfoTab' // 期货价格调整单（主信息）
import futuresAdjListTabsForm from '@/views/frame/rm/derivative/components/FuturesAdjListTabs' // 期货价格调整单（调整单明细）
import futuresAdjReasonTabsForm from '@/views/frame/rm/derivative/components/FuturesAdjReasonTabs' // 期货价格调整单（调整原因）

export default {
  data() {
    return {
      activeName: 'mainInfo',
      futureAdjustId: '',
      futureAdjustListId: '',
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.init')
      }
    }
  },
  props: {
    id: String,
    showTabs: Array
  },
  components: {
    futuresMaininfoTabForm,
    futuresAdjListTabsForm,
    futuresAdjReasonTabsForm
  },
  watch: {
    id(newId) {
      if (newId) this.getEditData()
    }
  },
  mounted() {
    // 渲染表格数据
    if (this.id) this.getEditData()
  },
  methods: {
    // 获取初始化数据
    getEditData() {
      futuresPriceAdjust.get(this.id, this.func).then(response => {
        this.futureAdjustId = response.data.futureAdjustDto.id
        this.adjustType = response.data.futureAdjustDto.adjustType
      })
    }
  }
}
</script>
