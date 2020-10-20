<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='maxColumnsDialog'>
      <!-- 头部 -->
      <TitleContain :titleName="dialogTitle" @TitleFun="$emit('closeHandler')" />
      <!-- 内容 -->
      <header :style="{'border-bottom-width': mainInfoVisible ? '1px' : '0', 'margin-top': '3px'}">
        <div class='form-title'>菜单信息
          <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !mainInfoVisible}]" @click='mainInfoVisible = !mainInfoVisible'></i>
        </div>

        <el-form v-if='mainInfoVisible' :inline="true" class="header-form-inline" :model="formData" :rules="rules" ref="menuFormData" prop="formData" label-position="left" element-loading-spinner="el-icon-loading" v-loading="loading">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="类型" prop='flag' class='input-max-style'>
                <el-radio-group v-model="formData.flag">
                  <el-radio :disabled="catalogDisable" label="0">目录</el-radio>
                  <el-radio :disabled="menuDisable" label="1">菜单</el-radio>
                  <!-- <el-radio :disabled="buttonDisable" label="2">按钮</el-radio> -->
                  <el-radio :disabled="routeDisable" label="3">子路由</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" prop='usingFlag'>
                <el-radio-group v-model="formData.usingFlag">
                  <el-radio :label="true">启用</el-radio>
                  <el-radio :label="false">停用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上级菜单" prop='parentName'>
                <el-input :disabled="true" v-model="formData.parentName">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="菜单标识" prop='name'>
                <el-input :disabled="formData.flag==='2'" v-model="formData.name">
                </el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="meta-title" prop='metaTitle'>
                <el-input :disabled="formData.flag==='2'" v-model="formData.metaTitle">
                </el-input>
              </el-form-item>
            </el-col> -->
            <el-col :span="8">
              <el-form-item label="名称" prop='cname'>
                <el-input :disabled="formData.flag==='2'" v-model="formData.cname">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="英语名称" prop='ename'>
                <el-input :disabled="formData.flag==='2'" v-model="formData.ename">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :v-show="false">
              <el-form-item label="排序号" prop='sortNo' type="number">
                <el-input v-model="formData.sortNo">
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="图标" prop='icon'>
                <el-input v-model="formData.icon">
                </el-input>
              </el-form-item>
            </el-col>
            <template v-if="formData.flag==='1'||formData.flag==='3'">
              <template v-if=" !formData.subMenuFlag">
                <el-col :span="8">
                  <el-form-item label="是否为iframe" prop='iframeFlag'>
                    <el-radio-group v-model="formData.iframeFlag" @change='iframeFlagChange' :disabled="formData.flag==='2'||formData.flag==='0'">
                      <el-radio :label="true">是</el-radio>
                      <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="iframe url" prop='iframeUrl' class='input-textarea-style'>
                    <el-input :disabled="!formData.iframeFlag||formData.flag==='2'||formData.flag==='0'" v-model="formData.iframeUrl">
                    </el-input>
                  </el-form-item>
                </el-col>
              </template>
              <el-col :span="8">
                <el-form-item label="是否预警图表" prop='warnChart'>
                  <el-radio-group v-model="formData.warnChart" @change='warnChartChange' disabled>
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="组件复用" prop='reuseFlag'>
                  <el-radio-group v-model="formData.reuseFlag">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="组件名称" prop='componentName'>
                  <el-input v-model="formData.componentName" placeholder="vue文件中的name">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="菜单URL" prop='path'>
                  <el-input v-model="formData.path" placeholder="vue-path,以/开始绝对路径">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="vue-component" prop='component'>
                  <el-input v-model="formData.component" placeholder="views/**">
                  </el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="!formData.subMenuFlag">
                <el-form-item label="隐藏" prop='hidden'>
                  <el-radio-group v-model="formData.hidden" :disabled="formData.subMenuFlag">
                    <el-radio :label="true">隐藏</el-radio>
                    <el-radio :label="false">展示</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8" align='left'>
                <el-form-item label="无缓存" prop='noCache'>
                  <el-radio-group v-model="formData.noCache">
                    <el-radio :label="true">无</el-radio>
                    <el-radio :label="false">有</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="子路由" prop='subMenuFlag'>
                  <el-radio-group v-model="formData.subMenuFlag" @change="setSubMenuFlag" :disabled='true'>
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="formData.subMenuFlag">
                <el-form-item label="子路由类型" prop='subMenuType'>
                  <base-select size="mini" v-model="formData.subMenuType" :attrs="{datadict: 'subMenuType'}"></base-select>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </header>

      <header :style="{'border-bottom-width': moduleVisible ? '1px' : '0'}" v-if="formData.flag==='1'">
        <div class='form-title'>模块信息
          <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !moduleVisible}]" @click='moduleVisible = !moduleVisible'></i>
        </div>

        <el-form v-if='moduleVisible' :inline="true" class="header-form-inline" :model="formData" :rules="rules" ref="moduleFormData" prop="formData" label-position="left" element-loading-spinner="el-icon-loading" v-loading="loading">
          <el-row :gutter="20">

            <el-col :span="8">
              <el-form-item label="模块类型" prop='moduleType'>
                <el-select v-model="formData.moduleType" clearable placeholder="请选择">
                  <el-option key="1" label="单据" value="1">
                  </el-option>
                  <el-option key="2" label="报表" value="2">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批服务" prop='bpmService'>
                <el-input :disabled="!formData.moduleType||formData.moduleType==='2'" v-model="formData.bpmService">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审批组件" prop='bpmComponent'>
                <el-input :disabled="!formData.moduleType||formData.moduleType==='2'" v-model="formData.bpmComponent">
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="授权方式" prop='authFlag' class='input-max-style'>
                <el-radio-group v-model="formData.authFlag">
                  <el-radio label="4">操作员</el-radio>
                  <el-radio label="5">登陆</el-radio>
                  <el-radio label="3">机构管理员</el-radio>
                  <el-radio label="2">集团管理员</el-radio>
                  <el-radio label="1">平台管理员</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="业务代码" prop='bizCode'>
                <!-- 字典码表 -->
                <el-select v-model="formData.bizCode" :clearable=true :placeholder="$t('biz.placeholder.choose')">
                  <el-option v-for="item in $t('datadict.bizCode')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>
      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button @click="$emit('closeHandler')" size="mini">关闭</el-button>
        <el-button type="primary" @click="submit" :loading="this.loading" size="mini">保存</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import TitleContain from '@/components/frame/TitleContain'
import * as moduleApi from '@/api/frame/base/platform/module'
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      moduleVisible: true,
      mainInfoVisible: true,
      dialogVisible: true,
      formData: {
        warnChart: false,
        id: '',
        flag: '',
        name: '',
        cname: '',
        ename: '',
        path: '',
        component: '',
        componentName: '',
        reuseFlag: false,
        sortNo: '',
        parentName: '',
        parentCode: '',
        iconName: '',
        iframeFlag: false,
        iframeUrl: '',
        hidden: false,
        noAuth: false,
        authFlag: '4',
        moduleType: '',
        bpmService: '',
        bpmComponent: '',
        noCache: false,
        usingFlag: true,
        subMenuFlag: false,
        subMenuType: ''
      },
      loading: false,
      buttonDisable: false,
      menuDisable: false,
      routeDisable: false,
      catalogDisable: false,
      dataPropertyJson: {},
      dataJson: [],
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      productCategoryArr: [],
      attributeGroupArr: [],

      buttonValue: null,
      data: {
        id: '',
        flag: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '菜单标识不可以为空',
            trigger: 'blur'
          }
        ],
        component: '',
        componentName: [
          {
            required: true,
            message: '组件名称不可以为空',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '菜单URL不可以为空',
            trigger: 'blur'
          }
        ],
        cname: [
          {
            required: true,
            message: '名称不可以为空',
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
  computed: {
    dialogTitle() {
      if (this.param.opType === 'add') {
        return '添加目录/菜单'
      } else if (this.param.opType === 'update') {
        return '修改目录/菜单'
      } else if (this.param.opType === 'route') {
        return '管理子路由'
      }
      return '管理目录/菜单'
    }
  },
  methods: {
    warnChartChange(value) {
      if (value) {
        this.formData.component = 'views/frame/base/warn/chart/index'
        this.formData.reuseFlag = true
        this.formData.componentName = 'warnChart'
      } else {
        this.formData.component = ''
        this.formData.reuseFlag = false
        this.formData.componentName = ''
      }
    },
    iframeFlagChange(value) {
      if (value) {
        this.formData.component = 'views/frame/iframe/monitor/index'
      } else {
        this.formData.component = ''
      }
    },
    closeAndRefresh() {
      this.$emit('closeHandler', true)
    },
    // 获取初始化数据
    init() {
      // 处理菜单 目录和按钮
      if (this.param.opType === 'add') {
        if (this.param.menuRow && this.param.menuRow.flag) {
          this.formData.parentCode = this.param.menuRow.moduleCode
          this.formData.parentName = this.param.menuRow.cname
          this.formData.flag = '0'
          if (this.param.menuRow.flag === '1') {
            this.menuDisable = true
            this.catalogDisable = true
            this.formData.flag = '2'
          } else if (this.param.menuRow.flag === '0') {
            this.buttonDisable = true
            this.formData.flag = '0'
          }
        } else {
          this.menuDisable = true
          this.buttonDisable = true
          this.formData.flag = '0'
        }
        this.routeDisable = true

        return
      } else if (this.param.opType === 'route') {
        // 处理子路由
        if (this.param.menuRow) {
          this.formData.parentCode = this.param.menuRow.moduleCode
          this.formData.parentName = this.param.menuRow.cname
        }
        this.formData.flag = '3'
        this.formData.subMenuFlag = true
        this.routeDisable = true
        this.menuDisable = true
        this.catalogDisable = true
        this.buttonDisable = true
        this.formData.hidden = true
        return
      } else if (this.param.opType === 'routeupdate') {
        this.formData.flag = '3'
        this.formData.subMenuFlag = true
        this.routeDisable = true
        this.menuDisable = true
        this.catalogDisable = true
        this.buttonDisable = true
        this.formData.hidden = true

        this.data.moduleCode = this.param.menuRow.moduleCode
        this.data.flag = this.param.menuRow.flag
        this.func.funcOperation = this.$t('biz.btn.view')
        moduleApi
          .getMenuInfo(this.data, this.func)
          .then(response => {
            this.loading = false
            this.formData = response.data
          })
          .catch(() => {
            this.loading = false
          })
        return
      } else {
        this.menuDisable = true
        this.catalogDisable = true
        this.buttonDisable = true
        this.routeDisable = true

        this.data.moduleCode = this.param.menuRow.moduleCode
        this.data.flag = this.param.menuRow.flag
        this.func.funcOperation = this.$t('biz.btn.view')

        moduleApi
          .getMenuInfo(this.data, this.func)
          .then(response => {
            this.loading = false
            this.formData = response.data
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    submit() {
      if (this.formData.subMenuFlag) {
        if (!this.formData.subMenuType) {
          this.$notify(
            notifyError({
              msg: '请选择子路由类型'
            })
          )
          return
        }
      }
      this.$refs.menuFormData.validate(valid => {
        if (valid) {
          if (this.formData.flag === '1') {
            this.$refs.moduleFormData.validate(valid => {
              if (valid) {
                this.save()
              }
            })
          } else {
            this.save()
          }
        }
      })
    },
    setSubMenuFlag(subMenuFlag) {
      if (subMenuFlag) {
        this.formData.flag = '3'
        this.menuDisable = true
        this.routeDisable = false
      } else {
        this.formData.flag = '1'
        this.menuDisable = false
        this.routeDisable = true
      }
    },
    save() {
      this.loading = true
      this.func.funcOperation = this.$t('biz.btn.save')
      moduleApi
        .saveMenuInfo(this.formData, this.func)
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
<style>
</style>

