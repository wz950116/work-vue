<template>
  <div class='app-container edit-page-style'>
    <!-- 头部 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
      <el-row class='top-operate'>
        <el-button size="mini" type="primary" :loading=" btnloading" @click="save" style='margin-left: 0px;margin-right: 6px;'>
          <i class='el-icon-circle-check'></i>{{this.$t('biz.btn.save')}}
        </el-button>
        <el-button size="mini" @click="addRow" style='margin-left: 0px;margin-right: 6px;'>
          <i class='el-icon-circle-plus-outline'></i>{{this.$t('biz.btn.addRow')}}
        </el-button>
        <el-button size="mini" @click="close" style='margin-left: 0px;margin-right: 6px;'>
          <i class='el-icon-circle-plus-outline'></i>{{this.$t('biz.btn.close')}}
        </el-button>
      </el-row>
      <el-table class='table-content' ref="multipleTable" v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" e lement-loading-background="rgba(255, 255, 255, 0.1)" :data="list" :height='tableHeight' border stripe highlight-current-row @selection-change="selectionChange">
        <el-table-column label="唯一编码" prop="colCode">
          <template slot-scope="scope">
            <el-input v-model="scope.row.colCode" :disabled="scope.row.authVirture == '1'"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="中文名" prop="colCname">
          <template slot-scope="scope">
            <el-input v-model="scope.row.colCname" :disabled="scope.row.authVirture == '1'"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="权限分组(mapper注解,多个以,分隔)" prop="colGroup">
          <template slot-scope="scope">
            <el-input v-model="scope.row.colGroup"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="sql字段" prop="colDbname">
          <template slot-scope="scope">
            <el-input v-model="scope.row.colDbname"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="数据类型" prop="authDataType">
          <template slot-scope="scope">
            <el-select v-model="scope.row.authDataType" :disabled="scope.row.authVirture == '1'">
              <el-option key="1" value="1" label="录入" />
              <el-option key="2" value="2" label="基础档案" />
              <el-option key="3" value="3" label="字典码表" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="数据子类型" prop="authTypePart">
          <template slot-scope="scope">
            <el-select v-model="scope.row.authTypePart" :disabled="scope.row.authVirture == '1'" v-if="scope.row.authDataType == '1'">
              <el-option key="STR" value="STR" label="STR" />
              <el-option key="NUM" value="NUM" label="NUM" />
              <el-option key="DATE" value="DATE" label="DATE" />
            </el-select>
            <el-select v-model="scope.row.authTypePart" filterable clearable v-if="scope.row.authDataType == '3'">
              <el-option v-for="item in dictData" :key="item.datadictCode" :label="item.datadictName" :value="item.datadictCode" />
            </el-select>
            <el-select v-model="scope.row.authTypePart" filterable clearable :disabled="scope.row.authVirture == '1'" v-if="scope.row.authDataType == '2'">
              <el-option v-for="item in baseData" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备用字段1" prop="reservedStr1">
          <template slot-scope="scope">
            <el-input v-model="scope.row.reservedStr1"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="备用字段2" prop="reservedStr2">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reservedStr2"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备用字段3" prop="reservedStr3">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reservedStr3"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备用字段4" prop="reservedStr4">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reservedStr4"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="备用字段5" prop="reservedStr5">
            <template slot-scope="scope">
              <el-input v-model="scope.row.reservedStr5"></el-input>
            </template>
          </el-table-column> -->
        <el-table-column label="操作" width="60" fixed="right">
          <template slot-scope="scope">
            <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import columnApi from '@/api/frame/base/platform/column'
import dictApi from '@/api/frame/base/sys/dict'
import { selectDataType } from '@/api/frame/base/sys/data'

export default {
  name: 'authData',
  components: {},
  data() {
    return {
      list: [],
      tableHeader: [],
      dictData: [],
      loading: false,
      btnloading: false,
      selectRow: {},
      baseData: [],

      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      },
      listQuery: {
        current: 1,
        isPage: false,
        data: {
          usingFlag: '1'
        },
        defaultSortString: 'dictCode.asc'
      },
      moduleCode: this.$route.params.moduleCode
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      // 防止底部滚动条遮挡
      return this.clientWidth < 1366 ? this.clientHeight - 148 : this.clientHeight - 131
    }
  },
  created() {
    this.getList()
  },
  methods: {
    close() {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
    },
    getList() {
      columnApi
        .getColumnByModuleCode(this.moduleCode, {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        })
        .then(response => {
          this.list = response.data.filter(function(item) {
            if (item && item.moduleType) {
              return item.moduleType === '3'
            }
          })
        })

      this.func.funcOperation = this.$t('biz.btn.search')
      dictApi.getList(this.listQuery, this.func).then(response => {
        this.dictData = response.data
      })

      selectDataType().then(response => {
        this.baseData = response.data
      })
    },
    addRow() {
      const obj = {}
      obj.moduleCode = this.moduleCode
      obj.colCode = ''
      obj.colCname = ''
      obj.colEname = ''
      obj.colDbname = ''
      obj.colGroup = ''
      obj.reservedStr1 = ''
      obj.reservedStr2 = ''
      obj.reservedStr3 = ''
      obj.reservedStr4 = ''
      obj.reservedStr5 = ''
      obj.moduleType = '3'
      obj.authDataType = null
      obj.authTypePart = null
      obj.disabled = true
      obj.id = null
      obj.authVirture = 0
      this.list.push(obj)
    },
    addvirtureRow() {
      const obj = {}
      obj.moduleCode = this.moduleCode
      obj.colCode = 'belongOrgan'
      obj.colCname = '所属机构'
      obj.colEname = ''
      obj.colDbname = ''
      obj.colGroup = ''
      obj.reservedStr1 = ''
      obj.reservedStr2 = ''
      obj.reservedStr3 = ''
      obj.reservedStr4 = ''
      obj.reservedStr5 = ''
      obj.moduleType = '3'
      obj.authDataType = '2'
      obj.authTypePart = 'ORGAN'
      obj.disabled = true
      obj.id = null
      obj.authVirture = 1
      this.list.push(obj)
      const obj1 = {}
      obj1.moduleCode = this.moduleCode
      obj1.colCode = 'belongDept'
      obj1.colCname = '所属部门'
      obj1.colEname = ''
      obj1.colDbname = ''
      obj1.colGroup = ''
      obj1.reservedStr1 = ''
      obj1.reservedStr2 = ''
      obj1.reservedStr3 = ''
      obj1.reservedStr4 = ''
      obj1.reservedStr5 = ''
      obj1.moduleType = '3'
      obj1.authDataType = '2'
      obj1.authTypePart = 'DEPT'
      obj1.disabled = true
      obj1.id = null
      obj1.authVirture = 1
      this.list.push(obj1)
      const obj2 = {}
      obj2.moduleCode = this.moduleCode
      obj2.colCode = 'belongStaff'
      obj2.colCname = '所属员工'
      obj2.colEname = ''
      obj2.colDbname = ''
      obj2.colGroup = ''
      obj2.reservedStr1 = ''
      obj2.reservedStr2 = ''
      obj2.reservedStr3 = ''
      obj2.reservedStr4 = ''
      obj2.reservedStr5 = ''
      obj2.moduleType = '3'
      obj2.authDataType = '2'
      obj2.authTypePart = 'STAFF'
      obj2.disabled = true
      obj2.id = null
      obj2.authVirture = 1
      this.list.push(obj2)
    },
    selectionChange(val) {
      this.selectRow = val
    },

    save() {
      this.btnloading = true
      columnApi
        .save(this.list, this.moduleCode, '3', {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save')
        })
        .then(response => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.saveSuccess')
            })
          )
          this.getList()

          this.btnloading = false
        })
        .catch(e => {
          this.btnloading = false
        })
    },
    remove(row) {
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          for (const i in this.list) {
            if (this.list[i] === row) {
              this.list.splice(i, 1)
            }
          }
        })
        .catch(() => {})
    }
  }
}
</script>
