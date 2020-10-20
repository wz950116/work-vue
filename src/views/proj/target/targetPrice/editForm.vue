<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog' style="height: 500px">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <header style='border-radius:5px;'>
        <el-form :inline="true" :model="formData" class="header-form-inline" label-position="left" :rules='rules' ref="validateForm">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="$t('target.targetPrice.name')" prop="name">
                <input-validate v-model="formData.name" :clearable='true' :disabled="disabledView()"></input-validate>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('target.targetPrice.remark')" prop='remark'>
                <input-validate v-model="formData.remark" :clearable='true' size="mini" :disabled="disabledView()"></input-validate>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>

      <main>
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane :label="$t('target.targetPrice.tabName')" name="mainInfo">
            <div class='tabs-operate' style='margin:5px 0px;'>
              <el-button v-db-click size="mini" @click="addRow" v-if="['add', 'update'].includes(type)">
                <svg-icon icon-class="线性-增行"></svg-icon>
                {{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click="deleteRow" v-if="['add', 'update'].includes(type)">
                <svg-icon icon-class="线性-删行"></svg-icon>
                {{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border height="255" ref="buyTable" class='table-content tb-edit' :data="formData.detailList" style="border:1px solid;" @current-change="selectChange">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column :label="$t('target.targetPrice.type')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('target.targetPrice.type')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <el-select size='mini' v-model="scope.row.type" :placeholder="$t('biz.placeholder.choose')" @change="e => changeType(e,scope.row)">
                    <el-option v-for="item in $t('datadict.targetPriceType')" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('target.targetPrice.priceItemCode')" width="150">
                <template slot="header" slot-scope="scope">
                  {{$t('target.targetPrice.priceItemCode')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <base-select v-model="scope.row.priceItemCode" :attrs="{data: 'DD_PRICE_ITEM', clearable: true ,filterable: true}" size="mini"></base-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('target.targetPrice.vsPriceItemCode')" width="150">
                <template slot="header" slot-scope="scope">
                  {{$t('target.targetPrice.vsPriceItemCode')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <base-select v-model="scope.row.vsPriceItemCode" :attrs="{data: 'DD_PRICE_ITEM', clearable: true ,filterable: true, disabled: scope.row.type === '3'}" size="mini"></base-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('target.targetPrice.minValue')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('target.targetPrice.minValue')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter v-model="scope.row.minValue" :min="0" :max='999999999999' :precision="0" type='thousands' size="mini"></input-formatter>
                </template>
              </el-table-column>
              <el-table-column :label="$t('target.targetPrice.maxValue')" width="120">
                <template slot="header" slot-scope="scope">
                  {{$t('target.targetPrice.maxValue')}}
                  <span style="color:#f56c6c;" :data-header='scope'>*</span>
                </template>
                <template slot-scope="scope">
                  <input-formatter v-model="scope.row.maxValue" :min="0" :max='999999999999' :precision="0" type='thousands' size="mini"></input-formatter>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </main>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button v-db-click v-if="type === 'view'" size="mini" @click="close">
          {{$t('biz.btn.close')}}
        </el-button>
        <el-button v-db-click v-if="['add', 'update'].includes(type)" size="mini" @click="cancel">
          {{$t('biz.btn.cancel')}}
        </el-button>
        <el-button type='primary' v-if="['add', 'update'].includes(type)" v-db-click size="mini" @click="save">
          {{$t('biz.btn.save')}}
        </el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import { dateFormate } from '@/utils/frame/base/index'
export default {
  components: {

  },
  data() {
    return {
      expandStatus: !!process.env.EXPAND_FLG,
      type: this.opType,
      detailData: [],
      selectData: null,
      formData: {
        detailList: []
      },
      activeName: 'mainInfo',
      rules: {
        name: [
          {
            required: !this.disabledView(),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String
    },
    param: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      return this.$t('route.' + this.$route.meta.title) + this.$t(`biz.btn.${this.type}`)
    }
  },
  mounted() {
    if (this.type !== 'add') {
      this.getData()
    }
  },
  methods: {
    getData() {
      request({
        url: '/api/target/tgtPrice/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.get'),
          data: this.param.id
        }
      }).then(response => {
        this.formData = response.data
      })
    },
    disabledView() {
      return this.type === 'view'
    },
    changeType(val, row) {
      if (val === '3') {
        row.vsPriceItemCode = ''
      }
    },
    selectChange(val) {
      this.selectData = val
    },
    addRow() {
      this.formData.detailList.push({
        type: '1'
      })
    },
    // 删行
    deleteRow(file) {
      if (this.selectData) {
        this.$confirm(
          this.$t('biz.msg.confirmDelete'),
          this.$t('biz.msg.tip'),
          {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }
        )
          .then(() => {
            this.formData.detailList.forEach((item, index) => {
              if (this.selectData === item) {
                this.formData.detailList.splice(index, 1)
              }
            })
            this.selectData = null
          })
          .catch(() => { })
      } else {
        Notification(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    close() {
      this.$emit('closeHandler', true)
    },
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.close()
        })
        .catch(() => { })
    },
    save() {
      this.$refs.validateForm.validate(valid => {
        if (valid) {
          if (this.checkSave()) {
            return
          }
          this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(() => {
              let api = '/api/target/tgtPrice/update'
              if (this.type === 'add') {
                api = '/api/target/tgtPrice/save'
              }
              request({
                url: api,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.formData
                }
              }).then(response => {
                this.$emit('closeHandler', true)
              })
            })
            .catch(() => { })
        } else {
          return false
        }
      })
    },
    checkSave() {
      const detailList = this.formData.detailList
      if (detailList.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('target.targetPrice.msg.detailListEmpty')
          })
        )
        return true
      }
      for (let i = 0; i < detailList.length; i++) {
        const data = detailList[i]
        if (!data.priceItemCode) {
          this.$notify(
            notifyInfo({
              msg: this.$t('target.targetPrice.msg.priceItemNoData')
            })
          )
          return true
        }

        if (!data.vsPriceItemCode && data.type !== '3') {
          this.$notify(
            notifyInfo({
              msg: this.$t('target.targetPrice.msg.vsPriceItemNoData')
            })
          )
          return true
        }

        if (!data.minValue) {
          this.$notify(
            notifyInfo({
              msg: this.$t('target.targetPrice.msg.minNoData')
            })
          )
          return true
        }

        if (!data.maxValue) {
          this.$notify(
            notifyInfo({
              msg: this.$t('target.targetPrice.msg.maxNoData')
            })
          )
          return true
        }
      }
      return false
    }
  }
}
</script>
