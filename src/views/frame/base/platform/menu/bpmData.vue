<template>
  <div class='app-container edit-page-style'>
    <!-- 头部 -->
    <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1146px' : '1306px') : 'auto'}">
      <el-row class='top-operate'>
        <el-button size="mini" type="primary" :loading="btnloading" @click="save()" style='margin-left: 0px;margin-right: 6px;'>
          <i class='el-icon-circle-check'></i>{{this.$t('biz.btn.save')}}
        </el-button>
        <el-button size="mini" @click="addRow()" style='margin-left: 0px;margin-right: 6px;'>
          <i class='el-icon-circle-plus-outline'></i>{{this.$t('biz.btn.addRow')}}
        </el-button>
        <el-button size="mini" @click="closeview" style='margin-left: 0px;margin-right: 6px;'>
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
        <el-table-column label="英文名" prop="colEname">
          <template slot-scope="scope">
            <el-input v-model="scope.row.colEname" :disabled="scope.row.authVirture == '1'"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="分组" prop="colGroup">
          <template slot-scope="scope">
            <el-input v-model="scope.row.colGroup" :disabled="scope.row.authVirture == '1'"></el-input>
          </template>
        </el-table-column>

        <el-table-column label="备用字段1" prop="reservedStr1">
          <template slot-scope="scope">
            <el-input v-model="scope.row.reservedStr1"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备用字段2" prop="reservedStr2">
          <template slot-scope="scope">
            <el-input v-model="scope.row.reservedStr2"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备用字段3" prop="reservedStr3">
          <template slot-scope="scope">
            <el-input v-model="scope.row.reservedStr3"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column label="备用字段4" prop="reservedStr4">
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

export default {
  name: 'bpmData',
  data() {
    return {
      data: [],
      row: [],
      list: [],
      tableHeader: [],
      btnloading: false,
      loading: false,
      selectRow: {},
      moduleCode: this.$route.params.moduleCode,
      dialogTextVisible: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      // 防止底部滚动条遮挡
      return this.clientWidth > 1355 ? this.clientHeight - 180 : this.clientHeight - 210
    }
  },
  created() {
    this.getList()
  },
  methods: {
    closeview() {
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
          // this.list = response.data

          this.list = response.data.filter(function(item) {
            if (item && item.moduleType) {
              return item.moduleType === '1'
            }
          })
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
      obj.moduleType = '1'
      obj.authDataType = null
      obj.authTypePart = null
      obj.disabled = true
      obj.id = null
      obj.authVirture = 0
      this.list.push(obj)
    },

    selectionChange(val) {
      this.selectRow = val
    },

    save() {
      this.btnloading = true
      columnApi
        .save(this.list, this.moduleCode, '1', {
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
    doBatchUpload() {
      this.dialogTextVisible = true
    },
    close(param) {
      this.dialogTextVisible = false
      if (param) {
        this.getList()
      }
    },
    remove(row) {
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          let rowLevel = ''
          let newList = []
          let index = 0
          for (const i in this.list) {
            if (this.list[i].colCode === row.colCode) {
              index = i * 1
              rowLevel = row.level // 删除行的level
              newList = this.list.slice(i) // 返回删除行数据以下的所有数据的数组
            }
          }
          const deleteArr = []
          for (const j in newList) {
            if (j > 0) {
              if (newList[j].level > rowLevel) {
                deleteArr.push(newList[j])
              } else {
                break
              }
            }
          }
          this.list.splice(index, deleteArr.length + 1)
        })
        .catch(() => {})
    }
  }
}
</script>
