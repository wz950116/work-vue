<template>
  <div class="app-container edit-page-style">
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click='close()'>
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click='saveEdit()'>
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click='addRow()'>
        <svg-icon icon-class="线性-增行"></svg-icon>{{$t('biz.btn.addRow')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click='delRow()'>
        <svg-icon icon-class="线性-删行"></svg-icon>{{$t('biz.btn.deleteRow')}}
      </el-button>
    </el-row>

    <el-table :data="tableData" stripe v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" border class='table-content tb-edit' ref="multipleTable" style="border:1px solid;" @selection-change="handleSelectionChange">
      <el-table-column type="index" align="center" width="50" label=' '></el-table-column>
      <el-table-column type="selection" align="center" width="60"></el-table-column>
      <el-table-column :label="$t('projSys.authorization.moduleName')" align="center">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.menuName">
            <el-option v-for="item in moduleData" :key="item.id" :label="item.menuName" :value="item.menuName">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('projSys.authorization.moduleCode')" align="center">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.menuCode" @change="toModuleChange(scope.row)">
            <el-option v-for="item in moduleData" :key="item.id" :label="item.menuCode" :value="item.menuCode">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('projSys.authorization.authorizationType')" align="center">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.authorizationType" :placeholder="$t('data.common.pleaseSelect')">
            <el-option v-for="item in $t('datadict.authorizationFlag')" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column :label="$t('projSys.authorization.expireDate')">
        <template slot-scope="scope">
          <el-date-picker clearable v-model="scope.row.expireDate" @change="changeStartTime" :picker-options='dateStartBefore' type="datetime" range-separator="-" :placeholder="$t('biz.placeholder.dateInput')" format="yyyy-MM-dd HH:mm:ss" value-format='yyyy-MM-dd HH:mm:ss'>
          </el-date-picker>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部按钮 -->
    <!-- <footerBar>
      <el-button v-db-click @click="close">{{ $t('biz.btn.close') }}</el-button>
      <el-button v-db-click type='primary' @click="saveEdit">{{ $t('biz.btn.save') }}</el-button>
    </footerBar> -->
  </div>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import { mapGetters } from 'vuex'
import elementFun from '@/utils/frame/base/elementFun'
import authApi from '@/api/proj/sys/authorizedMonitor'
export default {
  name: 'grantLicense',
  data() {
    return {
      tableData: [],
      dateStartBefore: {},
      activeName: 'first',
      multipleSelection: [],
      loading: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      },
      tableDatas: {
        authorizedMonitorList: []
      },
      moduleData: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  mounted() {
    this.getEditData()
  },
  methods: {
    ...elementFun,
    toModuleChange(val) {
      let obj = {}
      obj = this.moduleData.find(item => {
        return item.menuCode === val.menuCode
      })
      val.menuName = obj.menuName
      val.id = obj.id
    },
    // 获取初始化数据
    getEditData() {
      this.func.funcOperation = this.$t('biz.btn.view')
      authApi
        .getListFuncModule(this.func)
        .then(response => {
          this.moduleData = response.data
          this.moduleData.forEach(v => {
            var row = {
              menuCode: v.menuCode,
              menuName: v.menuName,
              authorizationType: '1',
              expireDate: '2022-01-01 00:00:00',
              rowNum: this.tableData.length
            }
            this.toModuleChange(row)
            this.tableData.push(row)
          })
        })
        .catch(() => {})
    },
    // 处理勾选后
    handleSelectionChange(val) {
      this.multipleSelection = val
      // 通过操作dom更改选中行底色
      this.$nextTick(() => {
        $(this.$refs.multipleTable.$el)
          .find('.el-table__row td')
          .removeClass('select-row-bg-color')
        $(this.$refs.multipleTable.$el)
          .find('.is-checked')
          .parents('.el-table__row')
          .find('td')
          .addClass('select-row-bg-color')
      })
    },
    // 增行
    addRow() {
      this.tableData.push({
        moduleCode: '',
        moduleName: '',
        authorizationType: '',
        expireDate: '',
        rowNum: this.tableData.length
      })
    },
    // 删行
    delRow() {
      if (this.multipleSelection.length > 0) {
        this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            const filterArr = this.multipleSelection.map(select => select.rowNum)
            const templateData = []

            this.tableData.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })

            this.tableData = templateData
            this.tableData.forEach((i, index) => {
              i.rowNum = index
            })
          })
          .catch(() => {})
      } else {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
    },
    // 保存
    saveEdit() {
      this.func.funcOperation = this.$t('biz.btn.add')
      authApi
        .save(this.tableData, this.func)
        .then(() => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.insertSuccess')
            })
          )
          // this.close()
        })
        .catch(() => {})
    },
    // 关闭
    close() {
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'showLicense',
          params: {
            refresh: true
          }
        })
      })
    }
  }
}
</script>
