<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='max' style="width:900px;">
      <title-contain :titleName='$t("data.warning.warningCond")' @TitleFun="close"></title-contain>
      <main>
        <!-- 顶部按钮 -->
        <el-row class='top-operate' style='margin:3px 0;'>
          <el-button @click="addRow" size="mini">
            <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
          </el-button>
          <el-button @click="deleteRow" size="mini">
            <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
          </el-button>
        </el-row>

        <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="list" :height='374' @selection-change="handleSelectRow">
          <el-table-column align='center' type="selection" width="45" fixed></el-table-column>

          <el-table-column align="left" width="200" :label="$t('数据项')">
            <template slot-scope="scope">
              <el-select size='mini' v-model="scope.row.sourceColCode">
                <el-option v-for="item in  colList" :key="item.colCode" :label="item.colName" :value="item.colCode">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('条件')">
            <template slot-scope="scope">
              <el-select size='mini' v-model="scope.row.condCode">
                <el-option v-for="item in condList" :key="item.condCode" :label="item.condName" :value="item.condCode">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="left" :label="$t('参数标识')">
            <template slot-scope="scope">
              <el-input size='mini' v-model="scope.row.thresholdKey"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </main>
      <div class="dialog-footer">
        <el-button size="mini" @click='close()'>{{this.$t("biz.btn.cancel")}}</el-button>
        <el-button size="mini" type="primary" v-db-click @click='save()'>{{this.$t('biz.btn.save')}}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import TitleContain from '@/components/frame/TitleContain'

import request from '@/utils/frame/base/request'
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    TitleContain
  },
  props: {
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  created() {
  },
  computed: {
    dialogTitle() {
      return this.$t('data.warning.warningCond')
    }
  },
  data() {
    return {
      list: [],
      colList: [],
      condList: [],
      selectRow: null,
      loading: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      },
      index: 0
    }
  },
  methods: {
    close() {
      this.$emit('closeAndRefreshHandler', false)
    },
    save() {
      if (this.param.opType === 'add') {
        this.func.funcOperation = this.$t('biz.btn.add')
        request({
          url: '/api/warn/cond/saveWarnCond',
          method: 'post',
          data: {
            data: {
              warningCode: this.param.warningCode,
              condDtoList: this.list
            },
            funcModule: this.func.funcModule,
            funcOperation: this.func.funcOperation
          }
        }).then(response => {
          this.$emit('closeAndRefreshHandler', true)
          this.$notify(
            notifySuccess({ msg: this.$t('biz.msg.saveSuccess') })
          )
        })
      } else if (this.param.opType === 'update') {
        this.func.funcOperation = this.$t('biz.btn.update')

        request({
          url: '/api/warn/cond/updateWarnCond',
          method: 'post',
          data: {
            data: {
              warningCode: this.param.warningCode,
              groupCode: this.param.groupCode,
              condDtoList: this.list
            },
            funcModule: this.func.funcModule,
            funcOperation: this.func.funcOperation
          }
        }).then(response => {
          this.$emit('closeAndRefreshHandler', true)
          this.$notify(
            notifySuccess({ msg: this.$t('biz.msg.saveSuccess') })
          )
        })
      }
    },
    loadData() {
      if (this.param.warningCode && this.param.groupCode) {
        this.loading = true
        this.func.funcOperation = this.$t('biz.btn.view')

        request({
          url: '/api/warn/cond/listCondIdsByWarningIdGroupCode',
          method: 'post',
          data: {
            data: {
              warningCode: this.param.warningCode,
              groupCode: this.param.groupCode
            },
            funcModule: this.func.funcModule,
            funcOperation: this.func.funcOperation
          }
        }).then(response => {
          this.list = response.data

          this.loading = false
        })
      }
      if (this.param.sourceCode) {
        this.func.funcOperation = this.$t('biz.btn.search')
        request({
          url: '/api/warn/cond/listSrcCol',
          method: 'post',
          data: {
            data: this.param.sourceCode,
            funcModule: this.func.funcModule,
            funcOperation: this.func.funcOperation
          }
        })
          .then(response => {
            this.loading = false
            this.colList = response.data
          })
      }

      request({
        url: '/api/platform/cfgCondition/listAll',
        method: 'post',
        data: {
          data: {
          },
          funcModule: this.func.funcModule,
          funcOperation: this.func.funcOperation
        }
      }).then(response => {
        this.condList = response.data
      })
    },
    addRow() {
      const obj = {}
      obj.sourceCode = this.param.sourceCode
      obj.sourceColCode = ''
      obj.condCode = ''
      obj.thresholdKey = ''
      obj.colList = []
      obj.index = this.index++
      this.list.push(obj)
    },

    handleSelectRow(val) {
      this.selectRow = val
    },
    moduleChange(row) {
      row.sourceColCode = ''
      row.condCode = ''
      row.thresholdKey = ''
      request({
        url: '/api/warn/cond/listSrcCol',
        method: 'post',
        data: {
          data: this.param.sourceCode,
          funcModule: this.func.funcModule,
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        row.colList = response.data
      })
    },
    deleteRow() {
      if (this.selectRow == null) {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
      this.list = this.list.filter(item => !this.selectRow.includes(item))
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>
