<!-- 期货价格调整单 -->
<template>
  <el-tabs v-model="activeName" type="border-card">
    <el-tab-pane :label="$t('biz.title.mainInfo')" name="baseInfoTab" v-if="showTabs.includes('baseInfoTab')">
      <el-form :inline="true" :model="baseInfo" class="header-form-inline" label-position="left" ref="refForm">
        <el-row :gutter="0">
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubAdjust.makeDate')" prop='makeDate'>
              <el-date-picker v-model="baseInfo.makeDate" type="date" format="yyyy-MM-dd" value-format='yyyyMMdd' :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubAdjust.documentNo')" prop='documentNo'>
              <el-input v-model="baseInfo.documentNo" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubAdjust.derivativeSubAccount')" prop='derivativeSubAccount'>
              <el-input v-model="baseInfo.derivativeSubAccount" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('derivative.futuresSubAdjust.makeUserName')" prop='makeUserName'>
              <el-input v-model="baseInfo.makeUserName" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-tab-pane>
    <el-tab-pane :label="$t('derivative.futuresSubAdjust.listDetailBefore')" name="adjustBeforeTab" v-if="showTabs.includes('adjustBeforeTab')">
      <futures-account-tab :detailDatas='listDetailBefore' :adjustType='type' :useType='useType'></futures-account-tab>
    </el-tab-pane>
    <el-tab-pane :label="$t('derivative.futuresSubAdjust.listDetailAfter')" name="adjustAfterTab" v-if="showTabs.includes('adjustAfterTab')">
      <futures-account-tab :detailDatas='listDetailAfter' :adjustType='type' :useType='useType'></futures-account-tab>
    </el-tab-pane>
    <el-tab-pane :label="$t('derivative.futuresSubAdjust.adjustReason')" name="adjustReasonTab" v-if="showTabs.includes('adjustReasonTab')">
      <futures-adj-reason-tab v-model="baseInfo.adjustReason" ref='adjustReason' :disabled='true'></futures-adj-reason-tab>
    </el-tab-pane>
    <slot />
  </el-tabs>
</template>

<script>
import * as futuresSubAdjust from '@/api/frame/rm/derivative/futuresAccountAdjust'

// 标签页
import futuresAccountTab from '@/views/frame/rm/derivative/components/FuturesAccountTab'
import futuresAdjReasonTab from '@/views/frame/rm/derivative/components/FuturesAdjReasonTab'

export default {
  data() {
    return {
      activeName: 'baseInfoTab',
      type: 'view',
      useType: 'subAdjust',
      baseInfo: {},
      listDetailBefore: [],
      listDetailAfter: []
    }
  },
  props: {
    id: String,
    showTabs: Array
  },
  components: {
    futuresAccountTab,
    futuresAdjReasonTab
  },
  watch: {
    id(newId) {
      if (newId) this.getView()
    }
  },
  mounted() {
    // 渲染表格数据
    if (this.id) this.getView()
  },
  methods: {
    // 获取初始化数据
    getView() {
      const params = {
        data: this.id,
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.init')
      }
      futuresSubAdjust
        .getView(params)
        .then(response => {
          this.baseInfo = response.data.baseInfo
          this.listDetailBefore = response.data.oldDataList
          this.listDetailAfter = response.data.newDataList
        })
        .catch(() => {
        })
    }
  }
}
</script>
