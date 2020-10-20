<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '1166px' : '1326px'}">
      <title-contain :titleName='titleName' @TitleFun="$emit('closeHandler')"></title-contain>
      <el-row class='top-operate'>
        <el-button size="mini" v-db-click @click="$emit('closeHandler')">
          <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
        </el-button>
        <el-button size="mini" type='primary' v-db-click @click='onSave'>
          <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
        </el-button>
        <el-button size="mini" type='success' v-db-click @click='onExplain'>
          <svg-icon icon-class="线性-生成"></svg-icon>解析SQL
        </el-button>

      </el-row>

      <div class='dialog-content' :style="{maxHeight: clientHeight - 80 + 'px', overflowY: 'auto'}">
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': menuInfoVisible ? '1px' : '0'}">
          <div class='form-title'>
            报表信息
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !menuInfoVisible}]" @click='menuInfoVisible = !menuInfoVisible'></i>
          </div>
          <el-form v-if='menuInfoVisible' class="header-form-inline" :model="page" label-position="left" :rules='rules' ref="refForm" :show-message="false">
            <el-row :gutter="20">

              <el-col :span="6">
                <el-form-item label="功能名称" prop='codeName'>
                  <input-validate v-model='page.codeName' :clearable='true'></input-validate>
                </el-form-item>
              </el-col>

              <el-col :span="18">
                <el-form-item label="报表说明" prop='remark'>
                  <el-input v-model="page.remark" :clearable='true'>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="查询sql" prop='sqlStatement'>
                  <el-input v-model="page.sqlStatement" :clearable='true' type="textarea">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="sql注意说明">
                  <el-input :disabled="true" value='1、作为查询条件和展示的列，都查在SQL里查询出来'>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </header>
        <header :style=" {'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px' ) : 'auto' , 'border-bottom-width' : pageInfoVisible ? '1px' : '0' }">
          <div class='form-title'>
            页面信息
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !pageInfoVisible}]" @click='pageInfoVisible = !pageInfoVisible'></i>
          </div>
          <el-form v-if='pageInfoVisible' class="header-form-inline" :model="page" label-position="left" :rules='rules' ref="refForm2" :show-message="false">
            <el-row :gutter="20">

              <el-col :span="6">
                <el-form-item label="显示更多查询" prop='moreShowFlg'>
                  <el-checkbox v-model='page.codeDataJson.form.moreShowFlg'></el-checkbox>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="显示顶部按钮" prop='isTopBar'>
                  <el-checkbox v-model='page.codeDataJson.mainData.isTopBar'></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="初始化请求" prop='initSearch'>
                  <el-checkbox v-model='page.codeDataJson.mainData.initSearch'></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="列设置" prop='isColset'>
                  <el-checkbox v-model='page.codeDataJson.mainData.isColset'></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="列表ID" prop='id'>
                  <input-validate v-model='page.codeDataJson.mainData.table.id' :clearable='true' placeholder="可以同菜单标识(全局唯一)"></input-validate>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="默认排序" prop='defaultSortString'>
                  <el-input v-model='page.codeDataJson.form.listQuery.defaultSortString' value=''>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="列表排序" prop='sortable'>
                  <input-validate v-model='page.codeDataJson.mainData.table.sortable' :clearable='true'></input-validate>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否分页" prop='show'>
                  <el-checkbox v-model='page.codeDataJson.mainData.bottomBar.pagination.show'></el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="是否驼峰转成大写下划线" prop='camelToUnderlineFlg'>
                  <el-checkbox v-model='page.codeDataJson.form.listQuery.camelToUnderlineFlg'></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </header>
        <main :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto'}">
          <el-tabs type="border-card" value="form">
            <el-tab-pane label='查询条件设置' name="form">
              <div class='tabs-operate' style='margin-top: 5px;'>

                <el-button v-db-click size="mini" @click='deleteConditionRow'>
                  <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
                </el-button>
              </div>
              <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingForm" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :height='220' :data="page.codeDataJson.form.formData" @current-change="handleSelectRowForm">
                <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
                <el-table-column show-overflow-tooltip>
                  <template slot="header" slot-scope="scope">
                    名称(label)
                    <span style='color:#f56c6c;' :data-header='scope'>*</span>
                  </template>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.label" size='mini'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip>
                  <template slot="header" slot-scope="scope">
                    属性(prop)
                    <span style='color:#f56c6c;' :data-header='scope'>*</span>
                  </template>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.prop" size='mini' :disabled='true'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop='dbDataType'>
                  <template slot="header" slot-scope="scope">
                    数据类型
                    <span style='color:#f56c6c;' :data-header='scope'>*</span>
                  </template>
                  <template slot-scope='scope'>
                    <el-select v-model="scope.row.dbDataType" size='mini' clearable :placeholder="$t('biz.placeholder.choose')">
                      <el-option v-for="item in dbDataType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>

                <el-table-column show-overflow-tooltip>
                  <template slot="header" slot-scope="scope">
                    表单类型
                    <span style='color:#f56c6c;' :data-header='scope'>*</span>
                  </template>
                  <template slot-scope='scope'>
                    <el-select v-model="scope.row.type" size='mini' :placeholder="$t('biz.placeholder.choose')">
                      <el-option v-for="item in formType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='字典(datadict)' prop='datadict'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.datadict" size='mini' placeholder="例:datadict.yesNo"></input-validate>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='复合属性(props)' align='center' width="200">
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.propArry" size='mini' placeholder=' 小写逗号(,)间隔'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='属性组(attrs)' align='center' width="100">
                  <template slot-scope='scope'>
                    <span style='color: #409EFF;cursor: pointer;' @click="onRowAttrSet(scope.row)">属性设置</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='是否显示' width="100">
                  <template slot-scope='scope'>
                    <div style='text-align: center;'>
                      <el-checkbox v-model='scope.row.isShow'></el-checkbox>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='是否必输' width="100">
                  <template slot-scope='scope'>
                    <div style='text-align: center;'>
                      <el-checkbox v-model='scope.row.required'></el-checkbox>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='默认值'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.default" size='mini'></input-validate>
                  </template>
                </el-table-column>

                <el-table-column show-overflow-tooltip label='toolUtil函数'>
                  <template slot-scope='scope'>
                    <el-input v-model="scope.row.defaultFunc" size='mini' placeholder="例:getLatestWeek"></el-input>
                  </template>
                </el-table-column>

              </el-table>
            </el-tab-pane>
          </el-tabs>
        </main>

        <main :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto'}">
          <el-tabs type="border-card" value='table'>
            <el-tab-pane label='列表设置' name="table">
              <div class='tabs-operate' style='margin-top: 5px;'>
                <el-button v-db-click size="mini" @click='deleteRow'>
                  <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
                </el-button>
              </div>
              <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingTable" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :height='220' :data="page.codeDataJson.mainData.table.cols" @current-change="handleSelectRowTable">
                <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
                <el-table-column show-overflow-tooltip>
                  <template slot="header" slot-scope="scope">
                    名称(label)
                    <span style='color:#f56c6c;' :data-header='scope'>*</span>
                  </template>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.label" size='mini'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip>
                  <template slot="header" slot-scope="scope">
                    属性(prop)
                    <span style='color:#f56c6c;' :data-header='scope'>*</span>
                  </template>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.prop" size='mini' :disabled='true'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='文本处理' prop='type'>
                  <template slot-scope='scope'>
                    <el-select v-model="scope.row.type" size='mini' clearable :placeholder="$t('biz.placeholder.choose')" @clear='colTypeClear(scope.row)' @change='val => { colTypeChange(val, scope.row) }'>
                      <el-option v-for="item in colType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='格式化方法(func)' prop='func'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.func" size='mini' :disabled='!scope.row.type || scope.row.type === "dict"'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='格式化参数(dict)' prop='dict'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.dict" size='mini' placeholder="例:datadict.yesNo" :disabled='!scope.row.type'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip label='是否显示(isShow)' prop='isShow'>
                  <template slot-scope='scope'>
                    <div style='text-align: center;'>
                      <el-checkbox v-model='scope.row.isShow'></el-checkbox>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </main>
      </div>
    </div>
    <div class="mask"></div>
    <el-dialog title="属性设置" :visible.sync="dialogTableVisible" width='60%'>
      <main style='padding: 5px;'>
        <el-row class='top-operate'>
          <el-button size="mini" v-db-click @click='onAddAttr' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-增行"></svg-icon>{{$t('biz.btn.addRow')}}
          </el-button>
          <el-button size="mini" v-db-click @click='onDeleteAttr' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-删行"></svg-icon>{{$t('biz.btn.deleteRow')}}
          </el-button>
        </el-row>
        <el-table stripe border class='table-content tb-edit' highlight-current-row v-loading="loadingChild" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :height='220' :data="attrData" @current-change="handleSelectRowAttr">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column label="属性名" width="150">
            <template slot-scope='scope'>
              <input-validate v-model="scope.row.key" size='mini'></input-validate>
            </template>
          </el-table-column>
          <el-table-column label="属性值类型" width="200">
            <template slot-scope='scope'>
              <el-select v-model="scope.row.type" size='mini' :placeholder="$t('biz.placeholder.choose')">
                <el-option label="字符串" value="string"></el-option>
                <el-option label="布尔值" value="boolean"></el-option>
                <el-option label="数值" value="number"></el-option>
                <el-option label="数组" value="array"></el-option>
                <el-option label="对象" value="object"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="属性值">
            <template slot-scope='scope'>
              <input-validate v-model="scope.row.value" size='mini' placeholder='若为对象则严格输入JSON格式的值，若数组则小写逗号间隔即可'></input-validate>
            </template>
          </el-table-column>
        </el-table>
      </main>
      <div slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogTableVisible = false">取 消</el-button>
        <el-button size='mini' type="primary" @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      titleName: '',
      buttonOptions: [],
      menuInfoVisible: true,
      pageInfoVisible: true,
      apiTableVisible: true,
      btnTableVisible: true,
      loadingApi: false,
      loadingBtn: false,
      loadingForm: false,
      loadingTable: false,
      currentRowForm: {},
      currentRowTable: {},
      currentRowAttr: {},
      currentRowApi: {},
      currentRowBtn: {},
      dialogTableVisible: false,
      attrData: [],
      apiAuthOptions: [],
      apiOptions: ['search', 'doDelete', 'set', 'cancelAudit', 'export', 'submit'],
      loadingChild: false,
      // 表单项
      formRules: {},
      formType: [
        {
          label: '输入框',
          value: 'input'
        },
        {
          label: '数值区间',
          value: 'numberInterval'
        },
        {
          label: '字典码表下拉框',
          value: 'datadict'
        },
        {
          label: '基础接口下拉框',
          value: 'baseSelect'
        },
        {
          label: '单选框',
          value: 'radio'
        },
        {
          label: '多选框',
          value: 'checkbox'
        },
        {
          label: '日期框',
          value: 'date'
        },
        {
          label: '日期区间',
          value: 'rangeDate'
        }
      ],
      // 列表项
      colType: [
        {
          label: '码表回显',
          value: 'dict'
        },
        {
          label: '时间格式化',
          value: 'date'
        },
        {
          label: '数值格式化',
          value: 'number'
        }
      ],
      // 数据库数据类型
      dbDataType: [
        {
          label: '字符串',
          value: 'STR'
        },
        {
          label: '数字',
          value: 'NUM'
        },
        {
          label: '日期',
          value: 'DATE'
        }
      ],
      rules: {
        codeName: [
          {
            required: true,
            trigger: 'blur'
          }
        ],
        sqlStatement: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      },
      // 数据结构
      page: {
        codeName: '',
        sqlStatement: '',
        remark: '',
        moduleCode: '',
        codeType: 'report',
        pageType: 'index',
        parentCode: '',
        code: '',
        sortNo: '',
        codeDataJson: {
          form: {
            moreShowFlg: false,
            listQuery: {
              camelToUnderlineFlg: true,
              isPage: true,
              current: 1,
              size: 20,
              funcModule: '',
              funcOperation: '',
              defaultSortString: '',
              data: {}
            },
            formData: []
          },
          mainData: {
            isTopBar: true,
            initSearch: true,
            isColset: false,
            api: [],
            topBar: [
              {
                name: 'refresh'
              },
              {
                name: 'export'
              }
            ],
            table: {
              id: '',
              sortable: 'custom',
              cols: []
            },
            bottomBar: {
              pagination: {
                show: true,
                layout: 'total, sizes, prev, pager, next, jumper',
                pageSizes: [20, 40, 60, 80, 100]
              }
            }
          }
        }
      }
    }
  },
  props: {
    opType: {
      type: String
    },
    param: {
      type: [Object, String],
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  created() {
    this.titleName = '报表页面' + this.$t(`biz.btn.${this.opType}`)
  },
  mounted() {
    this.init()

    // 是否初始化
    if (this.opType !== 'add') this.getPageData()
  },

  methods: {
    // 修改请求数据
    getPageData() {
      // 调取接口
      request({
        url: '/api/code/codeReport/get',
        method: 'post',
        data: {
          data: this.param,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view')
        }
      })
        .then(response => {
          const res = response.data

          this.page = res
        })
        .catch(() => {})
    },
    onExplain() {
      if (this.page.sqlStatement) {
        request({
          url: '/api/code/codeReport/explain',
          method: 'post',
          data: {
            data: this.page.sqlStatement,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search')
          }
        })
          .then(response => {
            if (response.data) {
              // 有则跳过，无则添加
              response.data.forEach(col => {
                if (this.page.codeDataJson.form.formData) {
                  let formFlag = true
                  this.page.codeDataJson.form.formData.forEach(form => {
                    if (col.colCode === form.prop) {
                      formFlag = false
                    }
                  })
                  if (formFlag) {
                    this.page.codeDataJson.form.formData.push({
                      label: '',
                      dbDataType: 'STR',
                      prop: col.colCode,
                      propArry: '',
                      attrs: {},
                      type: 'input',
                      isShow: true,
                      required: false,
                      default: null,
                      defaultFunc: ''
                    })
                  }
                }

                if (this.page.codeDataJson.mainData.table.cols) {
                  let formFlag = true
                  this.page.codeDataJson.mainData.table.cols.forEach(form => {
                    if (col.colCode === form.prop) {
                      formFlag = false
                    }
                  })
                  if (formFlag) {
                    this.page.codeDataJson.mainData.table.cols.push({
                      label: '',
                      prop: col.colCode,
                      isShow: true
                    })
                  }
                }
              })
            }
          })
          .catch(() => {})
      } else {
        this.$notify(
          notifyError({
            msg: 'sql不可以为空'
          })
        )
      }
    },
    init() {
      request({
        url: '/api/platform/cfgDictItem/list',
        method: 'post',
        data: {
          data: { dictCode: 'AUTH_BUTTON' },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          this.buttonOptions = response.data
        })
        .catch(() => {})

      request({
        url: '/api/platform/cfgApi/auth/select',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          this.apiAuthOptions = response.data.map(item => {
            return { value: item, label: item }
          })
        })
        .catch(() => {})
    },

    buttonChange(row) {
      if (row.name) {
        this.buttonOptions.forEach(button => {
          if (row.name === button.dictItemVal) {
            row.operateName = button.dictItemName
            row.operateCode = button.dictItemVal
            row.operateEname = button.dictItemNameEn
          }
        })
      }
    },
    // 单元格文本类型修改
    colTypeChange(val, row) {
      if (val === 'dict') {
        this.$set(row, 'func', '')
      }
    },
    // 单元格文本类型清除
    colTypeClear(row) {
      this.$set(row, 'dict', '')
      this.$set(row, 'func', '')
    },
    // 增行
    addConditionRow() {
      this.page.codeDataJson.form.formData.push({
        label: '',
        prop: '',
        isShow: false,
        required: false,
        default: null
      })
    },
    // 删行
    deleteConditionRow() {
      const index = this.page.codeDataJson.form.formData.indexOf(this.currentRowForm)
      if (index < 0) return
      this.page.codeDataJson.form.formData.splice(index, 1)
    },
    // 增行
    addRow() {
      this.page.codeDataJson.mainData.table.cols.push({
        label: '',
        prop: '',
        isShow: false
      })
    },
    // 删行
    deleteRow() {
      const index = this.page.codeDataJson.mainData.table.cols.indexOf(this.currentRowTable)
      if (index < 0) return
      this.page.codeDataJson.mainData.table.cols.splice(index, 1)
    },

    // 增加属性
    onAddAttr() {
      this.attrData.push({
        key: '',
        type: '',
        value: ''
      })
    },
    // 删除属性
    onDeleteAttr() {
      const index = this.attrData.indexOf(this.currentRowAttr)
      this.attrData.splice(index, 1)
    },
    // 选中当前行
    handleSelectRowForm(val) {
      this.currentRowForm = val
    },
    handleSelectRowTable(val) {
      this.currentRowTable = val
    },
    handleSelectRowAttr(val) {
      this.currentRowAttr = val
    },
    handleSelectRowApi(val) {
      this.currentRowApi = val
    },
    handleSelectRowBtn(val) {
      this.currentRowBtn = val
    },
    onRowAttrSet(row) {
      this.attrData = []
      this.dialogTableVisible = true
      if (row.attrs && Object.keys(row.attrs).length) {
        Object.keys(row.attrs).forEach(item => {
          this.attrData.push({
            key: item,
            type: this.getAttrType(row.attrs[item]),
            value: typeof row.attrs[item] === 'string' ? row.attrs[item] : JSON.stringify(row.attrs[item])
          })
        })
      }
    },
    getAttrVal(value, type) {
      switch (type) {
        case 'boolean':
          return !!value
        case 'array':
          return value.replace(/\s/g, '').split(',')
        case 'number':
          return +value
        case 'object':
          return JSON.parse(value)
        default:
          return value
      }
    },
    getAttrType(value) {
      switch (Object.prototype.toString.call(value)) {
        case '[object Boolean]':
          return 'boolean'
        case '[object Array]':
          return 'array'
        case '[object Number]':
          return 'number'
        case '[object Object]':
          return 'object'
        default:
          return 'string'
      }
    },
    // 保存当前行自定义属性
    onConfirm() {
      const result = {}
      this.attrData.forEach(attr => {
        result[attr.key] = this.getAttrVal(attr.value, attr.type)
      })
      this.currentRowForm.attrs = result
      this.dialogTableVisible = false
    },

    // 保存菜单
    onSave() {
      this.$refs.refForm.validate(valid => {
        if (valid) {
          this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          }).then(() => {
            // 查询信息
            const formData = []
            let params = JSON.parse(JSON.stringify(this.page))
            // 表单时间区间字段修改
            params.codeDataJson.form.formData.forEach(form => {
              if (form.type === 'input') {
                form.element = 'input-validate'
              }
              if (form.type === 'datadict' || form.type === 'baseSelect') {
                form.element = 'base-select'
              }
              if (form.datadict) {
                form.dictlist = form.datadict
              }
              if (form.propArry) {
                form.props = form.propArry.replace(/\s/g, '').split(',')
              }
              formData.push({
                prop: form.prop,
                props: form.props,
                dbDataType: form.dbDataType
              })
            })
            // 查询信息
            params.formData = formData
            //不分页
            if (params.codeDataJson.mainData.bottomBar.pagination.show) {
              params.codeDataJson.form.listQuery.isPage = true
            } else {
              params.codeDataJson.form.listQuery.isPage = false
            }
            // 表格按钮
            params.codeDataJson.mainData.topBar = [{ name: 'refresh' }, { name: 'export' }]
            // 列表数据格式化
            params.codeDataJson.mainData.table.cols.forEach(col => {
              // 文本处理
              if (col.type) {
                if (col.func) {
                  col.format = {
                    func: col.func,
                    dict: col.dict
                  }
                } else {
                  col.format = {
                    dictType: col.dict
                  }
                }
              }
            })

            request({
              url: this.opType === 'add' ? '/api/code/codeReport/save' : '/api/code/codeReport/update',
              method: 'POST',
              data: {
                data: params,
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.save')
              }
            })
              .then(response => {
                // 接口调用保存数据...
                this.$emit('closeHandler', true)
                this.$notify(notifySuccess({ msg: this.$t('biz.msg.saveSuccess') }))
              })
              .catch(() => {
                this.$notify(notifyError({ msg: this.$t('biz.msg.saveFailed') }))
              })
          })
        }
      })
    }
  }
}
</script>
