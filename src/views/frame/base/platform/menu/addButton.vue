<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='formTableDialog'>
      <!-- 头部 -->
      <TitleContain titleName="按钮管理" @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <main>
        <el-alert title="如果下拉框里信息不全，请在平台字典中以 数据代码 AUTH_BUTTON，进行添加" type="error" show-icon style='margin:5px 0;'></el-alert>
        <el-row class='top-operate'>
          <el-button @click="addRow" size="mini">
            <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
          </el-button>
          <el-button @click="delRow" size="mini">
            <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
          </el-button>
          <el-button @click="addFormTemplate" size="mini">
            <svg-icon icon-class="线性-删行"></svg-icon>基础按钮
          </el-button>
          <el-button @click="addBizTemplate" size="mini">
            <svg-icon icon-class="线性-删行"></svg-icon>业务按钮
          </el-button>
        </el-row>
        <el-table :data="dataTable" @selection-change="handleSelectionChange" height="400" stripe v-loading="loading" :element-loading-text="$t('route.load')" element-loading-spinner="el-icon-loading" border class='table-content tb-edit' ref="multipleTable" style="border:1px solid;">
          <el-table-column align='center' type="index" width="38" label=' '></el-table-column>
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <!-- 商品名称 -->
          <el-table-column label="按钮" width='120'>
            <template slot-scope="scope">
              <el-select size='mini' filterable allow-create default-first-option clearable v-model="scope.row.operateCode" @change="buttonChange(scope.row)">
                <el-option v-for="item in buttonOptions" :key="item.dictItemVal" :label="item.dictItemName" :value="item.dictItemVal">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="编码" width='120'>
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.operateCode"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="名称" width='120'>
            <template slot-scope="scope">
              <el-input size="mini" v-model="scope.row.operateName"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="授权方式" width='120'>
            <template slot-scope="scope">
              <el-select v-model="scope.row.authFlag" size='mini' placeholder="请选择">
                <!-- <el-option key="6" label="菜单权限" value="6">
                </el-option>
                <el-option key="5" label="登陆" value="5">
                </el-option> -->
                <el-option key="4" label="操作员" value="4">
                </el-option>
              </el-select>
            </template>
          </el-table-column>

          <el-table-column label="权限" min-width='120'>
            <template slot-scope="scope">
              <el-select multiple filterable :filter-method='filterMethod' allow-create size='mini' v-model="scope.row.apiCodes">
                <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </main>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click="close" size='mini'>关闭</el-button>
        <el-button type="primary" @click="submit" :loading="this.loading" size='mini'>保存</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import TitleContain from '@/components/frame/TitleContain'
import * as moduleApi from '@/api/frame/base/platform/module'
import request from '@/utils/frame/base/request'
import dictApi from '@/api/frame/base/sys/dict'
import { notifySuccess, notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      dialogVisible: true,
      dataTable: [],
      multipleSelection: [],
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      },
      states: [],
      statesAll: [],
      formData: {
        id: '',
        flag: '2',
        name: '',
        cname: '',
        ename: '',
        path: '',
        component: '',
        sortNo: '',
        parentName: '',
        parentCode: '',
        iconName: '',
        hidden: '',
        noAuth: '',
        adminFlag: '',
        bpmFlag: '',
        noCache: '',
        bpmModule: '',
        button: []
      },
      bpmOptions: [],
      loading: false,
      buttonDisable: false,
      menuDisable: false,
      catalogDisable: false,
      dataPropertyJson: {},
      dataJson: [],
      productCategoryArr: [],
      attributeGroupArr: [],
      buttonOptions: [],
      buttonValue: {},
      data: {
        code: '',
        flag: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '编码不可以为空',
            trigger: 'blur'
          }
        ],
        bpmModule: [
          {
            required: true,
            message: '业务模块不可以为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: ['param'],
  components: {
    TitleContain
  },

  mounted() {
    this.init()
  },
  computed: {},
  methods: {
    filterMethod(val) {
      this.states = [...this.statesAll.filter(i => i.value.toUpperCase().includes(val.toUpperCase()))].slice(0, 15)
    },
    // 增行
    addRow(file) {
      this.dataTable.push({
        id: '',
        name: '',
        cname: '',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
    },
    addFormTemplate() {
      this.dataTable = []
      // 查询
      this.dataTable.push({
        id: '',
        operateCode: 'query',
        operateName: '查询',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 查看
      this.dataTable.push({
        id: '',
        operateCode: 'view',
        operateName: '查看',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 新增
      this.dataTable.push({
        id: '',
        operateCode: 'add',
        operateName: '新增',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 修改
      this.dataTable.push({
        id: '',
        operateCode: 'update',
        operateName: '修改',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 删除
      this.dataTable.push({
        id: '',
        operateCode: 'remove',
        operateName: '删除',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 刷新
      this.dataTable.push({
        id: '',
        operateCode: 'refresh',
        operateName: '刷新',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
    },
    addBizTemplate() {
      this.dataTable = []
      // 查询
      this.dataTable.push({
        id: '',
        operateCode: 'query',
        operateName: '查询',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 查看
      this.dataTable.push({
        id: '',
        operateCode: 'view',
        operateName: '查看',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 新增
      this.dataTable.push({
        id: '',
        operateCode: 'add',
        operateName: '新增',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 修改
      this.dataTable.push({
        id: '',
        operateCode: 'update',
        operateName: '修改',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 删除
      this.dataTable.push({
        id: '',
        operateCode: 'remove',
        operateName: '删除',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 刷新
      this.dataTable.push({
        id: '',
        operateCode: 'refresh',
        operateName: '刷新',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 提交审批
      this.dataTable.push({
        id: '',
        operateCode: 'submitAudit',
        operateName: '提交审批',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 撤回审核
      this.dataTable.push({
        id: '',
        operateCode: 'withdrawAudit',
        operateName: '撤回审核',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 弃审
      this.dataTable.push({
        id: '',
        operateCode: 'cancelAudit',
        operateName: '弃审',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 弃审
      this.dataTable.push({
        id: '',
        operateCode: 'auditHistory',
        operateName: '审核历史',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 查看明细
      this.dataTable.push({
        id: '',
        operateCode: 'detail',
        operateName: '查看明细',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
      })
      // 明细设置
      this.dataTable.push({
        id: '',
        operateCode: 'detailSet',
        operateName: '明细设置',
        authFlag: '4',
        rowNum: this.dataTable.length,
        apiCodes: []
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

            this.dataTable.forEach((item, index) => {
              if (!filterArr.includes(item.rowNum)) {
                templateData.push(item)
              }
            })
            templateData.forEach((i, index) => {
              i.rowNum = index
            })
            this.dataTable = templateData
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
    buttonChange(row) {
      if (row.operateCode) {
        this.buttonOptions.forEach(button => {
          if (row.operateCode === button.dictItemVal) {
            row.operateName = button.dictItemName
            row.operateEname = button.dictItemNameEn
          }
        })
      }
    },
    closeAndRefresh() {
      this.$emit('closeHandler')
    },
    close() {
      this.$emit('closeHandler')
    },
    // 处理勾选后
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 获取初始化数据
    init() {
      this.formData.parentCode = this.param.moduleCode
      this.formData.parentName = this.param.cname
      this.formData.flag = '0'

      this.loading = true

      this.data.code = this.param.moduleCode
      // 列表请求
      this.func.funcOperation = this.$t('biz.btn.search')

      dictApi
        .cfgDictItem({ dictCode: 'AUTH_BUTTON' }, this.func)
        .then(response => {
          this.buttonOptions = response.data
        })
        .catch(() => {})
      this.func.funcOperation = this.$t('biz.btn.search')

      moduleApi
        .getButtonInfo(this.data.code, this.func)
        .then(response => {
          this.loading = false
          this.dataTable = response.data
          this.dataTable.forEach((i, index) => {
            i.rowNum = index
          })
        })
        .catch(() => {
          this.loading = false
        })

      request({
        url: '/api/platform/cfgApi/auth/select',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          this.loading = false

          this.statesAll = response.data.map(item => {
            return { value: item, label: item }
          })
          this.states = this.statesAll.slice(0, 15)
        })
        .catch(() => {
          this.loading = false
        })
    },
    submit() {
      this.save()
    },
    save() {
      this.loading = true
      this.formData.button = this.dataTable
      this.func.funcOperation = this.$t('biz.btn.save')

      moduleApi
        .saveButtonBatch(this.formData, this.func)
        .then(response => {
          this.$notify(
            notifySuccess({
              msg: '保存成功'
            })
          )
          this.closeAndRefresh()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
