<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '1166px' : '1326px'}">
      <title-contain titleName="弹窗代码定义" @TitleFun="$emit('closeHandler')"></title-contain>

      <el-row class='top-operate'>
        <el-button size="mini" v-db-click @click="$emit('closeHandler')">
          <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
        </el-button>
        <el-button size="mini" type='primary' v-db-click @click='onSave'>
          <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
        </el-button>
      </el-row>

      <div class='dialog-content' :style="{maxHeight: clientHeight - 80 + 'px', overflowY: 'auto'}">
        <!-- 基本设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': menuInfoVisible ? '1px' : '0'}">
          <div class='form-title'>代码信息
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !menuInfoVisible}]" @click='menuInfoVisible = !menuInfoVisible'></i>
          </div>
          <el-form v-if='menuInfoVisible' class="header-form-inline" :model="page" label-position="left" :rules='rules' ref="refForm" :show-message="false">
            <el-row :gutter="20">

              <el-col :span="6">
                <el-form-item label="功能代码" prop='code'>
                  <input-validate v-model='page.code' :disabled='true' :clearable='true'></input-validate>
                </el-form-item>
              </el-col>
              <el-col :span=" 6">
                <el-form-item label="功能名称" prop='codeName'>
                  <input-validate v-model='page.codeName' :clearable='true'></input-validate>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="上级" prop='parentCode'>
                  <base-select size="mini" v-model="page.parentCode" :attrs="{data: 'CODE_FORM', disabled:true  }"></base-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="代码类型" prop='codeType'>
                  <el-select v-model="page.codeType" :disabled='true'>
                    <el-option v-for="item in $t('datadict.codeType')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="页面类型" prop='pageType' :disabled='true'>
                  <el-select v-model="page.pageType" :disabled='true'>
                    <el-option v-for="item in $t('datadict.pageType')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="样式类型" prop='styleType'>
                  <input-validate v-model='page.codeDataJson.styleType' :clearable='true'></input-validate>
                </el-form-item>
              </el-col>

              <el-col :span="6">
                <el-form-item label="弹窗名称" prop='titleName'>
                  <input-validate v-model='page.codeDataJson.titleName' :clearable='true'></input-validate>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数据加载方式" prop='initType' :disabled='true'>
                  <el-select v-model="page.codeDataJson.initType">
                    <el-option v-for="item in initTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>

            </el-row>
          </el-form>
        </header>
        <!-- 接口设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': apiDialogVisible ? '1px' : '0'}">
          <div class='form-title'>接口设置
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !apiDialogVisible}]" @click='apiDialogVisible = !apiDialogVisible'></i>
          </div>
          <div class='edit-header-table' v-if='apiDialogVisible'>
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addApiRow'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteApiRow'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingApi" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :height='100' :data="page.codeDataJson.api" @current-change="handleSelectRowApi">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column label='接口名称' width='120'>
                <template slot-scope='scope'>
                  <el-select v-model="scope.row.name" size='mini'>
                    <el-option v-for="item in apiOptions" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label='接口地址' width='520'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.value" size='mini' placeholder="例子：/api/code/codeManage/page"></input-validate>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </header>

        <!-- 接口数据json -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': pageDataTableVisible ? '1px' : '0'}">
          <div class='form-title'>接口数据json
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !pageDataTableVisible}]" @click='pageDataTableVisible = !pageDataTableVisible'></i>
          </div>
          <el-form v-if='pageDataTableVisible' class="header-form-inline" :model="page" label-position="left" :rules='rules' ref="refForm3" :show-message="false">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-input v-model='page.pageData' :clearable='true' type="textarea" rows="3"></el-input>
              </el-col>
            </el-row>
          </el-form>
        </header>
        <!-- 按钮设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': btnDialogVisible ? '1px' : '0'}">
          <div class='form-title'>按钮设置
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !btnDialogVisible}]" @click='btnDialogVisible = !btnDialogVisible'></i>
          </div>
          <div class='edit-header-table' v-if='btnDialogVisible'>
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addBtnRow'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteBtnRow'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingBtn" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :height='125' :data="page.codeDataJson.bottomButtons" @current-change="handleSelectRowBtn">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column label="按钮名称" width='120'>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.name" size='mini' clearable>
                    <el-option v-for="item in buttonOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label='按钮事件名' width='120'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.event" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='按钮显示条件' width='200'>
                <template slot-scope='scope'>
                  <el-select v-model="scope.row.isShow" size='mini' multiple>
                    <el-option v-for="item in showOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label='按钮属性' width='140' align='center'>
                <template slot-scope='scope'>
                  <span style='color: #409EFF;cursor: pointer;' @click="onRowAttrSet(scope.row)">属性设置</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </header>
        <!-- 表单设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': formDialogVisible ? '1px' : '0'}">
          <div class='form-title'>表单设置
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !formDialogVisible}]" @click='formDialogVisible = !formDialogVisible'></i>
          </div>
          <div class='edit-header-table' v-if='formDialogVisible'>
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addRow'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteRow'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingForm" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :height='220' :data="page.codeDataJson.formData" @current-change="handleSelectRowForm">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column width='140'>
                <template slot="header" slot-scope="scope">
                  名称(label)
                  <span style='color:#f56c6c;' :data-header='scope'>*</span>
                </template>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.label" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column width='140'>
                <template slot="header" slot-scope="scope">
                  属性(prop)
                  <span style='color:#f56c6c;' :data-header='scope'>*</span>
                </template>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.prop" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column width='140'>
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
              <el-table-column width='140'>
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
              <el-table-column label='字典(datadict)' width='140'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.datadict" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='复合属性(props)' width="200">
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.propArry" size='mini' placeholder='小写逗号间隔'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='属性组(attrs)' align='center' width="140">
                <template slot-scope='scope'>
                  <span style='color: #409EFF;cursor: pointer;' @click="onRowAttrSet(scope.row)">属性设置</span>
                </template>
              </el-table-column>
              <el-table-column label='相关事件(event)' align='center' width='140'>
                <template slot-scope='scope'>
                  <span style='color: #409EFF;cursor: pointer;' @click="onRowEventSet(scope.row)">事件设置</span>
                </template>
              </el-table-column>
              <el-table-column label='是否显示(isShow)' width="140">
                <template slot-scope='scope'>
                  <div style='text-align: center;'>
                    <el-checkbox v-model='scope.row.isShow'></el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label='是否必输(required)' width="140">
                <template slot-scope='scope'>
                  <div style='text-align: center;'>
                    <el-checkbox v-model='scope.row.required'></el-checkbox>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label='默认值(default)' width='180'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.default" size='mini' placeholder='若复合属性则小写逗号间隔'></input-validate>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </header>
      </div>
    </div>
    <div class="mask"></div>
    <!-- 查询条件属性组设置 -->
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
        <el-button size='mini' type="primary" @click="onAttrsConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查询条件回调方法设置 -->
    <el-dialog title="方法设置" :visible.sync="dialogTableVisible2" width='60%'>
      <main style='padding: 5px;'>
        <el-row class='top-operate'>
          <el-button size="mini" v-db-click @click='onAddFunc' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-增行"></svg-icon>{{$t('biz.btn.addRow')}}
          </el-button>
          <el-button size="mini" v-db-click @click='onDeleteFunc' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-删行"></svg-icon>{{$t('biz.btn.deleteRow')}}
          </el-button>
        </el-row>
        <el-table stripe border class='table-content tb-edit' highlight-current-row v-loading="loadingChild2" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :height='220' :data="funcData" @current-change="handleSelectRowFunc">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column label="方法名" width="150">
            <template slot-scope='scope'>
              <input-validate v-model="scope.row.key" size='mini'></input-validate>
            </template>
          </el-table-column>
          <el-table-column label="方法值">
            <template slot-scope='scope'>
              <input-validate v-model="scope.row.value" size='mini' placeholder=''></input-validate>
            </template>
          </el-table-column>
        </el-table>
      </main>
      <div slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogTableVisible2 = false">取 消</el-button>
        <el-button size='mini' type="primary" @click="onEventsConfirm">确 定</el-button>
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
      activeName: 'form',
      pageDataTableVisible: true,
      menuInfoVisible: true,
      pageInfoVisible: true,
      apiDialogVisible: true,
      btnDialogVisible: true,
      formDialogVisible: true,
      dialogTableVisible: false,
      dialogTableVisible2: false,

      loadingApi: false,
      loadingBtn: false,
      loadingForm: false,
      loadingTable: false,
      loadingChild: false,
      loadingChild2: false,

      currentRowForm: {},
      currentRowAttr: {},
      currentRowFunc: {},
      currentRowApi: {},
      currentRowBtn: {},
      currentSetAttrRow: {}, // 当前需要设置属性的行（因多个列表可能都会打开公用的属性设置弹窗）
      currentSetFuncRow: {}, // 当前需要设置方法的行（因多个列表可能都会打开公用的属性设置弹窗）

      attrData: [],
      funcData: [],
      // 按钮选项
      buttonOptions: [
        {
          label: '关闭',
          value: 'biz.btn.close'
        },
        {
          label: '取消',
          value: 'biz.btn.cancel'
        },
        {
          label: '保存',
          value: 'biz.btn.save'
        },
        {
          label: '提交',
          value: 'biz.btn.submit'
        }
      ],
      // api选项
      apiOptions: ['view', 'save', 'update'],
      // 按钮显示条件
      initTypeOptions: [
        {
          label: 'param',
          value: 'param'
        },
        {
          label: 'api',
          value: 'api'
        }
      ],
      // 按钮显示条件
      showOptions: [
        {
          label: '新增',
          value: 'add'
        },
        {
          label: '修改',
          value: 'update'
        },
        {
          label: '查看',
          value: 'view'
        }
      ],
      // 表单项
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
      // 表单规则
      rules: {
        codeName: [
          {
            required: true,
            trigger: 'blur'
          }
        ]
      },
      // 数据结构
      page: {
        pageData: '',
        codeName: '',
        codeType: 'dialog',
        pageType: 'dialog',
        parentCode: '',
        code: '',
        sortNo: '',
        codeDataJson: {
          styleType: 'mini',
          titleName: '',
          initType: 'param',
          api: [{ name: 'view', value: '/api/code/formwork/get' }],
          formData: [],
          bottomButtons: []
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
  mounted() {
    if (this.opType !== 'add') this.getPageData()
  },
  methods: {
    // 修改请求数据
    getPageData() {
      // 调取接口
      request({
        url: '/api/code/codeManage/get',
        method: 'post',
        data: {
          data: this.param,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view')
        }
      })
        .then(response => {
          const res = response.data
          if (res.codeDataJson.api) {
            const apis = []
            Object.keys(res.codeDataJson.api).forEach(item => {
              apis.push({
                name: item,
                value: res.codeDataJson.api[item]
              })
            })
            res.codeDataJson.api = apis
          }
          this.page = res
        })
        .catch(() => {})
    },
    // 增行
    addRow() {
      this.page.codeDataJson.formData.push({
        label: '',
        prop: '',
        isShow: false,
        required: false,
        default: null
      })
    },
    // 删行
    deleteRow() {
      const index = this.page.codeDataJson.formData.indexOf(this.currentRowForm)
      if (index < 0) return
      this.page.codeDataJson.formData.splice(index, 1)
    },
    // 增加接口
    addApiRow() {
      this.page.codeDataJson.api.push({
        name: '',
        value: ''
      })
    },
    // 删除接口
    deleteApiRow() {
      const index = this.page.codeDataJson.api.indexOf(this.currentRowApi)
      this.page.codeDataJson.api.splice(index, 1)
    },
    // 增加按钮
    addBtnRow() {
      this.page.codeDataJson.bottomButtons.push({
        name: '',
        event: '',
        isShow: [],
        attrs: {}
      })
    },
    // 删除按钮
    deleteBtnRow() {
      const index = this.page.codeDataJson.bottomButtons.indexOf(this.currentRowBtn)
      this.page.codeDataJson.bottomButtons.splice(index, 1)
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
    // 增加方法
    onAddFunc() {
      this.funcData.push({
        key: '',
        value: ''
      })
    },
    // 删除方法
    onDeleteFunc() {
      const index = this.funcData.indexOf(this.currentRowFunc)
      this.funcData.splice(index, 1)
    },
    // 选择当前自定义属性行
    handleSelectRowAttr(val) {
      this.currentRowAttr = val
    },
    // 选中当前自定义方法行
    handleSelectRowFunc(val) {
      this.currentRowFunc = val
    },
    // 选中接口设置行
    handleSelectRowApi(val) {
      this.currentRowApi = val
    },
    // 选中按钮设置行
    handleSelectRowBtn(val) {
      this.currentRowBtn = val
    },
    // 选中表单项设置行
    handleSelectRowForm(val) {
      this.currentRowForm = val
    },
    onRowAttrSet(row) {
      this.attrData = []
      this.dialogTableVisible = true
      this.currentSetAttrRow = row
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
    onRowEventSet(row) {
      this.funcData = []
      this.dialogTableVisible2 = true
      this.currentSetFuncRow = row
      if (row.event && Object.keys(row.event).length) {
        Object.keys(row.event).forEach(item => {
          this.funcData.push({
            key: item,
            value: row.event[item]
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
    onAttrsConfirm() {
      const result = {}
      this.attrData.forEach(attr => {
        result[attr.key] = this.getAttrVal(attr.value, attr.type)
      })
      this.currentSetAttrRow.attrs = result
      this.dialogTableVisible = false
    },
    // 保存当前行自定义方法
    onEventsConfirm() {
      const result = {}
      this.funcData.forEach(attr => {
        result[attr.key] = attr.value
      })
      this.currentSetFuncRow.event = result
      this.dialogTableVisible2 = false
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
          }).then(async () => {
            let params = JSON.parse(JSON.stringify(this.page))
            // api数据格式转换
            params.codeDataJson.api = params.codeDataJson.api.reduce((sum, item) => {
              const result = sum
              if (item.name) sum[item.name] = item.value
              return result
            }, {})
            // 表单时间区间字段修改
            params.codeDataJson.formData.forEach(form => {
              if (form.type === 'input') {
                form.element = 'input-validate'
              }
              if (form.type === 'datadict' || form.type === 'baseSelect') {
                form.element = 'base-select'
              }
              if (form.datadict) {
                form.list = this.$t(form.datadict)
              }
              if (form.propArry) {
                form.props = form.propArry.replace(/\s/g, '').split(',')
                form.default = form.default ? form.default.replace(/\s/g, '').split(',') : []
              }
            })

            request({
              url: this.opType !== 'add' ? '/api/code/codeManage/update' : '/api/code/codeManage/save',
              method: 'POST',
              data: {
                data: params,
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.save')
              }
            })
              .then(response => {
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
