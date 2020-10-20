<!-- 期货价格管理单主信息 -->
<template>
  <el-form :inline="true" :model="formData" class="header-form-inline" label-position="left" ref="refForm">
    <el-row :gutter="0">
      <el-col :span="6">
        <el-form-item :label="$t('quotation.futuresPriceAdjust.adjustDate')" prop='adjustDate'>
          <input-validate v-model.trim="formData.adjustDate" :placeholder="$t('biz.placeholder.dateInput')" :disabled='true'></input-validate>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="$t('quotation.futuresPriceAdjust.adjustNo')" prop='adjustNo'>
          <input-validate v-model.trim="formData.adjustNo" :placeholder="$t('biz.placeholder.input')" :disabled='true'></input-validate>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="$t('quotation.futuresPriceAdjust.adjustType')" prop='adjustType'>
          <el-select v-model="formData.adjustType" clearable filterable :placeholder="$t('biz.placeholder.choose')" :disabled='true'>
            <el-option v-for="(item, index) in $t('datadict.priceAdjustType')" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item :label="$t('quotation.futuresPriceAdjust.staffName')" prop='staffName'>
          <input-validate v-model.trim="formData.staffName" :placeholder="$t('biz.placeholder.input')" :disabled='true'></input-validate>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import * as futuresPriceAdjust from '@/api/frame/rm/derivative/futuresPriceAdjust'

export default {
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      type: this.$route.query.type,
      formData: {
        adjustDate: '',
        adjustNo: '',
        adjustType: '',
        staffName: ''
      }
    }
  },
  components: {
  },
  props: {
    id: String,
    disabled: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    id(newId) {
      if (newId) this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.id) {
        futuresPriceAdjust.get(this.id, this.func).then(response => {
          this.formData = response.data.futureAdjustDto
        }).catch(() => { })
      }
    }
  }
}
</script>
