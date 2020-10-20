<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '1166px' : '1326px'}">
      <title-contain titleName="查询页代码定义" @TitleFun="$emit('closeHandler')"></title-contain>

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
                  <input-validate v-model='page.parentCode' :disabled='true' :clearable='true'></input-validate>
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

            </el-row>
          </el-form>
        </header>
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': pageInfoVisible ? '1px' : '0'}">
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
        <!-- 接口设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': apiTableVisible ? '1px' : '0'}">
          <div class='form-title'>接口设置
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !apiTableVisible}]" @click='apiTableVisible = !apiTableVisible'></i>
          </div>
          <div class='edit-header-table' v-if='apiTableVisible'>
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addApiRow'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteApiRow'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingApi" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.mainData.api" @current-change="handleSelectRowApi">
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
          <div class='tabs-operate' style='margin: 5px 0 0 5px;'>
            <el-button v-db-click size="mini" @click='addRowToFormTable'>
              <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.add') }}
            </el-button>
            <el-button v-db-click size="mini" @click='page.pageData = ""'>
              <svg-icon icon-class="线性-清除"></svg-icon>{{ $t('biz.btn.clear') }}
            </el-button>
          </div>
          <el-form v-if='pageDataTableVisible' style='padding: 3px 5px 5px;' :model="page" label-position="left" :rules='rules' ref="refForm3" :show-message="false">
            <el-row>
              <el-col :span="24">
                <el-input v-model='page.pageData' :clearable='true' type="textarea" rows="3"></el-input>
              </el-col>
            </el-row>
          </el-form>
        </header>
        <!-- 按钮设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': btnTableVisible ? '1px' : '0'}">
          <div class='form-title'>按钮设置
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !btnTableVisible}]" @click='btnTableVisible = !btnTableVisible'></i>
          </div>
          <div class='edit-header-table' v-if='btnTableVisible'>
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addBtnRow'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteBtnRow'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingBtn" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.mainData.topBar" @current-change="handleSelectRowBtn">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column label='按钮名称' width='120'>
                <template slot-scope='scope'>
                  <el-select size='mini' filterable allow-create default-first-option clearable v-model="scope.row.name" @change="buttonChange(scope.row)">
                    <el-option v-for="item in buttonOptions" :key="item.dictItemVal" :label="item.dictItemName" :value="item.dictItemVal"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="编码" width='120'>
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.operateCode" :disabled="true"></el-input>
                </template>
              </el-table-column>
              <el-table-column label='按钮类型' width='120'>
                <template slot-scope='scope'>
                  <el-select v-model="scope.row.type" size='mini' clearable :placeholder="$t('biz.placeholder.choose')" @change="buttonOpenTypeChange(scope.row)">
                    <el-option label="路由" value="route"></el-option>
                    <el-option label="复杂弹窗" value="dialog"></el-option>
                    <el-option label="简单弹窗" value="modal"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label='i18n' width='140'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.i18n" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label="图标" width='120'>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.iconName" size='mini' clearable filterable>
                    <el-option v-for="item in $store.state.app.icons" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column label='权限别名' align='center'>
                <template slot-scope='scope'>
                  <el-select size='mini' filterable allow-create multiple clearable v-model="scope.row.permitName">
                  </el-select>
                </template>
              </el-table-column> -->
              <el-table-column label="打开/跳转组件" width="180">
                <template slot-scope='scope'>
                  <base-select size="mini" v-model="scope.row.componentCode" :attrs="{data: 'CODE_FORM'}"></base-select>
                </template>
              </el-table-column>
              <!-- <el-table-column label="组件" width="180">
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.component" size='mini'></input-validate>
                </template>
              </el-table-column> -->
            </el-table>
          </div>
        </header>
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': selectTableVisible ? '1px' : '0'}">
          <div class='form-title'>查询条件设置
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !selectTableVisible}]" @click='selectTableVisible = !selectTableVisible'></i>
          </div>
          <div class='edit-header-table' v-if='selectTableVisible'>
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addRow'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteRow'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingForm" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.form.formData" @current-change="handleSelectRowForm">
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
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': listTableVisible ? '1px' : '0'}">
          <div class='form-title'>列表设置
            <i :class="['el-icon-arrow-down', {'el-icon-arrow-up' : !listTableVisible}]" @click='listTableVisible = !listTableVisible'></i>
          </div>
          <div class='edit-header-table' v-if='listTableVisible'>
            <!-- 列表设置 -->
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addRow'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteRow'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingTable" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.mainData.table.cols" @current-change="handleSelectRowTable">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column>
                <template slot="header" slot-scope="scope">
                  名称(label)
                  <span style='color:#f56c6c;' :data-header='scope'>*</span>
                </template>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.label" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column>
                <template slot="header" slot-scope="scope">
                  属性(prop)
                  <span style='color:#f56c6c;' :data-header='scope'>*</span>
                </template>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.prop" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='文本处理' prop='type'>
                <template slot-scope='scope'>
                  <el-select v-model="scope.row.type" size='mini' clearable :placeholder="$t('biz.placeholder.choose')" @clear='colTypeClear(scope.row)' @change='val => { colTypeChange(val, scope.row) }'>
                    <el-option v-for="item in colType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label='格式化方法(func)' prop='func'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.func" size='mini' :disabled='!scope.row.type || scope.row.type === "dict"'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='格式化参数(dict)' prop='dict'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.dict" size='mini' :disabled='!scope.row.type'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='是否显示(isShow)' prop='isShow'>
                <template slot-scope='scope'>
                  <div style='text-align: center;'>
                    <el-checkbox v-model='scope.row.isShow'></el-checkbox>
                  </div>
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
        <el-table stripe border class='table-content tb-edit' highlight-current-row v-loading="loadingChild" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="attrData" @current-change="handleSelectRowAttr">
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
        <el-table stripe border class='table-content tb-edit' highlight-current-row v-loading="loadingChild2" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="funcData" @current-change="handleSelectRowFunc">
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

      menuInfoVisible: true,
      pageInfoVisible: true,
      apiTableVisible: true,
      btnTableVisible: true,
      pageDataTableVisible: true,
      selectTableVisible: true,
      listTableVisible: true,
      dialogTableVisible: false,
      dialogTableVisible2: false,

      loadingApi: false,
      loadingBtn: false,
      loadingForm: false,
      loadingTable: false,
      loadingChild: false,
      loadingChild2: false,

      currentRowForm: {},
      currentRowTable: {},
      currentRowAttr: {},
      currentRowFunc: {},
      currentRowApi: {},
      currentRowBtn: {},

      attrData: [],
      funcData: [],
      apiAuthOptions: [],
      // 按钮选项
      buttonOptions: [],
      // api选项
      apiOptions: ['search', 'doDelete', 'set', 'cancelAudit', 'export', 'submit'],
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
      // 列表项
      tableData: {
        isTopBar: false,
        initSearch: true,
        isColset: false,
        id: '',
        sortable: ''
      },
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
        ]
      },
      // 数据结构
      page: {
        codeName: '',
        codeType: 'menu',
        pageType: 'index',
        parentCode: '',
        code: '',
        pageData: '',
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
            isTopBar: false,
            initSearch: true,
            isColset: false,
            api: [{ name: 'search', value: '/api/code/formwork/list' }],
            topBar: [],
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
  mounted() {
    this.init()
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
          if (res.codeDataJson.mainData.api && JSON.stringify(res.codeDataJson.mainData.api) !== '{}') {
            const apis = []
            Object.keys(res.codeDataJson.mainData.api).forEach(item => {
              apis.push({
                name: item,
                value: res.codeDataJson.mainData.api[item]
              })
            })
            res.codeDataJson.mainData.api = apis
          }
          this.page = res
        })
        .catch(() => {})
    },
    // 初始化下拉数据
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
    // 按钮设置联动
    buttonChange(row) {
      if (row.name) {
        this.buttonOptions.forEach(button => {
          if (row.name === button.dictItemVal) {
            row.operateName = button.dictItemName
            row.operateCode = button.dictItemVal
            row.operateEname = button.dictItemNameEn
            row.permitName.push(button.dictItemVal)
          }
        })
      }
    },
    // 按钮打开类型联动
    buttonOpenTypeChange(row) {
      row.component = ''
      if (row.type === 'route') {
        row.component = 'views/frame/base/generator/formwork/edit'
      } else if (row.type === 'dialog') {
        row.component = 'views/frame/base/generator/formwork/edit'
      } else if (row.type === 'modal') {
        row.component = 'views/frame/base/generator/formwork/dialog'
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
    addRow() {
      if (this.activeName === 'form') {
        this.page.codeDataJson.form.formData.push({
          label: '',
          prop: '',
          isShow: true,
          required: false,
          default: null
        })
      } else if (this.activeName === 'table') {
        this.page.codeDataJson.mainData.table.cols.push({
          label: '',
          prop: '',
          isShow: true
        })
      }
    },
    // 删行
    deleteRow() {
      if (this.activeName === 'form') {
        const index = this.page.codeDataJson.form.formData.indexOf(this.currentRowForm)
        if (index < 0) return
        this.page.codeDataJson.form.formData.splice(index, 1)
      } else if (this.activeName === 'table') {
        const index = this.page.codeDataJson.mainData.table.cols.indexOf(this.currentRowTable)
        if (index < 0) return
        this.page.codeDataJson.mainData.table.cols.splice(index, 1)
      }
    },
    // 增加接口
    addApiRow() {
      this.page.codeDataJson.mainData.api.push({
        name: '',
        value: ''
      })
    },
    // 删除接口
    deleteApiRow() {
      const index = this.page.codeDataJson.mainData.api.indexOf(this.currentRowApi)
      this.page.codeDataJson.mainData.api.splice(index, 1)
    },
    // 增加按钮
    addBtnRow() {
      this.page.codeDataJson.mainData.topBar.push({
        name: '',
        type: '',
        i18n: '',
        apiCodes: [],
        operateCode: '',
        operateName: '',
        operateEname: '',
        component: '',
        componentCode: ''
      })
    },
    // 删除按钮
    deleteBtnRow() {
      const index = this.page.codeDataJson.mainData.topBar.indexOf(this.currentRowBtn)
      this.page.codeDataJson.mainData.topBar.splice(index, 1)
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
    handleSelectRowFunc(val) {
      this.currentRowFunc = val
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
    onRowEventSet(row) {
      this.funcData = []
      this.dialogTableVisible2 = true
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
    // json数据转列表
    addRowToFormTable() {
      try {
        const data = JSON.parse(this.page.pageData)
        if (Array.isArray(data)) {
          this.page.codeDataJson.form.formData.push(...data)
          this.page.codeDataJson.mainData.table.cols.push(...data)
        } else {
          this.$notify(notifyError({ msg: this.$t('biz.msg.dataFormatError') }))
        }
      } catch (e) {
        this.$notify(notifyError({ msg: this.$t('biz.msg.dataFormatError') }))
      }
    },
    // 保存当前行自定义属性
    onAttrsConfirm() {
      const result = {}
      this.attrData.forEach(attr => {
        result[attr.key] = this.getAttrVal(attr.value, attr.type)
      })
      this.currentRowForm.attrs = result
      this.dialogTableVisible = false
    },
    // 保存当前行自定义方法
    onEventsConfirm() {
      const result = {}
      this.funcData.forEach(attr => {
        result[attr.key] = attr.value
      })
      this.currentRowForm.event = result
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
            params.codeDataJson.mainData.api = params.codeDataJson.mainData.api.reduce((sum, item) => {
              const result = sum
              if (item.name) sum[item.name] = item.value
              return result
            }, {})
            // 表单时间区间字段修改
            params.codeDataJson.form.formData.forEach(form => {
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
            //不分页
            if (params.codeDataJson.mainData.bottomBar.pagination.show) {
              params.codeDataJson.form.listQuery.isPage = true
            } else {
              params.codeDataJson.form.listQuery.isPage = false
            }
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
                    dict: this.$t(col.dict)
                  }
                }
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
