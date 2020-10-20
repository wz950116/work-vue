<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '1166px' : '1326px'}">
      <title-contain titleName="编辑页代码定义" @TitleFun="$emit('closeHandler')"></title-contain>

      <el-row class='top-operate'>
        <el-button size="mini" v-db-click @click="$emit('closeHandler')">
          <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
        </el-button>
        <el-button size="mini" type='primary' v-db-click @click='onSave'>
          <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
        </el-button>
      </el-row>

      <div class='dialog-content' :style="{maxHeight: clientHeight - 180 + 'px', overflowY: 'auto'}">
        <!-- 基本设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': menuInfoVisible ? '1px' : '0'}">
          <div class='form-title'>代码信息
            <i :class="[menuInfoVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='menuInfoVisible = !menuInfoVisible'></i>
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
        <!-- 接口设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': apiTableVisible ? '1px' : '0'}">
          <div class='form-title'>接口设置
            <i :class="[apiTableVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='apiTableVisible = !apiTableVisible'></i>
          </div>
          <div class='edit-header-table' v-if='apiTableVisible'>
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addApiRow(page.codeDataJson.api)'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteApiRow(page.codeDataJson.api)'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingApi" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.api" @current-change="handleSelectRowApi">
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
        <!-- 按钮设置 -->
        <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': btnTableVisible ? '1px' : '0'}">
          <div class='form-title'>按钮设置
            <i :class="[btnTableVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='btnTableVisible = !btnTableVisible'></i>
          </div>
          <div class='edit-header-table' v-if='btnTableVisible'>
            <div class='tabs-operate' style='margin-top: 5px;'>
              <el-button v-db-click size="mini" @click='addBtnRow(page.codeDataJson.topButtons)'>
                <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
              </el-button>
              <el-button v-db-click size="mini" @click='deleteBtnRow(page.codeDataJson.topButtons)'>
                <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
              </el-button>
            </div>
            <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingBtn" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.topButtons" @current-change="handleSelectRowBtn">
              <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
              <el-table-column label='按钮图标' width='140'>
                <template slot-scope='scope'>
                  <el-select v-model="scope.row.iconName" size='mini' clearable filterable>
                    <el-option v-for="item in $store.state.app.icons" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="按钮名称" width='120'>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.name" size='mini' clearable @change="scope.row.event = eventOptions[scope.row.name]">
                    <el-option v-for="item in buttonOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label='按钮事件名' width='120'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.event" size='mini' disabled></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='按钮显示条件' width='200'>
                <template slot-scope='scope'>
                  <el-select v-model="scope.row.isShow" size='mini' multiple>
                    <el-option v-for="item in showOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label='按钮弹窗地址' width='200'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.component" size='mini' placeholder='以views开头不带后缀名'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='按钮验证方法' width='140'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.validate" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='按钮默认值设置' width='140'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.setDefault" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='按钮关闭前方法' width='140'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.beforeCallback" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='按钮关闭回调' width='140'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.callback" size='mini'></input-validate>
                </template>
              </el-table-column>
              <el-table-column label='按钮自定义保存' width='140'>
                <template slot-scope='scope'>
                  <input-validate v-model="scope.row.extraEvent" size='mini'></input-validate>
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
        <!-- 内容设置 -->
        <main :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto'}">
          <el-tabs v-model="activeName" type="border-card">
            <!-- formData设置 -->
            <el-tab-pane label='表单设置' name="formData">
              <div class='tabs-operate' style='margin-top: 5px;'>
                <el-button v-db-click size="mini" @click='addRow'>
                  <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
                </el-button>
                <el-button v-db-click size="mini" @click='deleteRow'>
                  <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
                </el-button>
              </div>
              <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingFormData" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.formData" @current-change="handleSelectRowFormData">
                <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
                <el-table-column width='140' label='表单区域唯一标识'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.part" size='mini' placeholder='不重复任意值即可'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column width='140' label='dtoKey'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.dtoKey" size='mini'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column width='140' label='是否隐藏'>
                  <template slot-scope='scope'>
                    <div style='text-align: center;'>
                      <el-checkbox v-model='scope.row.hidden'></el-checkbox>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width='140' label='表单区域标题'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.titleName" size='mini'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column width='140' align='center' label='表单区域内容'>
                  <template slot-scope='scope'>
                    <span style='color: #409EFF;cursor: pointer;' @click="onRowFormDataContentSet(scope.row)">内容设置</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- tables设置 -->
            <el-tab-pane label='列表设置' name="tables">
              <div class='tabs-operate' style='margin-top: 5px;'>
                <el-button v-db-click size="mini" @click='addRow'>
                  <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
                </el-button>
                <el-button v-db-click size="mini" @click='deleteRow'>
                  <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
                </el-button>
              </div>
              <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingTables" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.tables" @current-change="handleSelectRowTables">
                <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
                <el-table-column label='标签标识(name)' width='180'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.name" size='mini'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column label='标签名称(label)' width="180">
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.label" size='mini'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column label='标签显示条件(isShow)' width='240'>
                  <template slot-scope='scope'>
                    <el-select v-model="scope.row.isShow" size='mini' multiple>
                      <el-option v-for="item in showOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label='标签是否必输(required)' width="180">
                  <template slot-scope='scope'>
                    <div style='text-align: center;'>
                      <el-checkbox v-model='scope.row.required'></el-checkbox>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label='标签设置' align='center' width='140'>
                  <template slot-scope='scope'>
                    <span style='color: #409EFF;cursor: pointer;' @click="onRowTabsContentSet(scope.row)">内容设置</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- tabs设置 -->
            <el-tab-pane label='标签页设置' name="tabs">
              <div class='tabs-operate' style='margin-top: 5px;'>
                <el-button v-db-click size="mini" @click='addRow'>
                  <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
                </el-button>
                <el-button v-db-click size="mini" @click='deleteRow'>
                  <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
                </el-button>
              </div>
              <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingTabs" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="page.codeDataJson.tabs" @current-change="handleSelectRowTabs">
                <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
                <el-table-column label='标签标识(name)' width='140'>
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.name" size='mini'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column label='标签名称(label)' width="140">
                  <template slot-scope='scope'>
                    <input-validate v-model="scope.row.label" size='mini'></input-validate>
                  </template>
                </el-table-column>
                <el-table-column label='标签显示条件(isShow)' width='240'>
                  <template slot-scope='scope'>
                    <el-select v-model="scope.row.isShow" size='mini' multiple>
                      <el-option v-for="item in showOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label='标签是否必输(required)' width="180">
                  <template slot-scope='scope'>
                    <div style='text-align: center;'>
                      <el-checkbox v-model='scope.row.required'></el-checkbox>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label='标签设置' align='center' width='140'>
                  <template slot-scope='scope'>
                    <span style='color: #409EFF;cursor: pointer;' @click="onRowTabsContentSet(scope.row)">内容设置</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </main>
      </div>
    </div>
    <div class="mask"></div>
    <!-- 属性组设置 -->
    <el-dialog title="属性设置" :visible.sync="dialogTableVisible" width='60%' :close-on-click-modal='false'>
      <main style='padding: 5px;'>
        <el-row class='top-operate'>
          <el-button size="mini" v-db-click @click='onAddAttr' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-增行"></svg-icon>{{$t('biz.btn.addRow')}}
          </el-button>
          <el-button size="mini" v-db-click @click='onDeleteAttr' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-删行"></svg-icon>{{$t('biz.btn.deleteRow')}}
          </el-button>
        </el-row>
        <el-table stripe border class='table-content tb-edit' highlight-current-row :data="attrData" @current-change="handleSelectRowAttr">
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
    <!-- 方法设置 -->
    <el-dialog title="方法设置" :visible.sync="dialogTableVisible2" width='60%' :close-on-click-modal='false'>
      <main style='padding: 5px;'>
        <el-row class='top-operate'>
          <el-button size="mini" v-db-click @click='onAddFunc' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-增行"></svg-icon>{{$t('biz.btn.addRow')}}
          </el-button>
          <el-button size="mini" v-db-click @click='onDeleteFunc' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-删行"></svg-icon>{{$t('biz.btn.deleteRow')}}
          </el-button>
        </el-row>
        <el-table stripe border class='table-content tb-edit' highlight-current-row :data="funcData" @current-change="handleSelectRowFunc">
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
    <!-- 表单项设置 -->
    <el-dialog title="表单内容设置" :visible.sync="dialogTableVisible3" top='5vh' width='60%' :close-on-click-modal='false'>
      <main style='padding: 5px;'>
        <el-row class='top-operate'>
          <el-button size="mini" v-db-click @click='onAddFormData' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-增行"></svg-icon>{{$t('biz.btn.addRow')}}
          </el-button>
          <el-button size="mini" v-db-click @click='onDeleteFormData' style='padding: 6px 10px;'>
            <svg-icon icon-class="线性-删行"></svg-icon>{{$t('biz.btn.deleteRow')}}
          </el-button>
        </el-row>
        <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingFormDataDialog" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="formDataContent" @current-change="handleSelectRowFormDataDialog">
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column width='180'>
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
              <input-validate v-model="scope.row.prop" size='mini' :disabled='!!scope.row.propArry'></input-validate>
            </template>
          </el-table-column>
          <el-table-column width="200">
            <template slot="header" slot-scope="scope">
              复合属性(prop)
              <span style='color:#f56c6c;' :data-header='scope'>*</span>
            </template>
            <template slot-scope='scope'>
              <input-validate v-model="scope.row.propArry" size='mini' placeholder='小写逗号间隔' :disabled='!!scope.row.prop'></input-validate>
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
          <el-table-column label='字典(datadict)' width='180'>
            <template slot-scope='scope'>
              <input-validate v-model="scope.row.datadict" size='mini' :disabled='scope.row.type !== "datadict"'></input-validate>
            </template>
          </el-table-column>
          <el-table-column label='属性组(attrs)' align='center' width='140'>
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
              <input-validate v-model="scope.row.defaultVal" size='mini' placeholder='若复合属性则小写逗号间隔'></input-validate>
            </template>
          </el-table-column>
        </el-table>
      </main>
      <div slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogTableVisible3 = false">取 消</el-button>
        <el-button size='mini' type="primary" @click="onFormDataConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 列表项/标签项设置 -->
    <el-dialog title="列表内容设置" :visible.sync="dialogTableVisible4" top='5vh' width='60%' :close-on-click-modal='false'>
      <!-- 基本设置 -->
      <header :style="{'border-bottom-width': tablesBaseInfoVisible ? '1px' : '0', 'margin-top': '3px'}">
        <div class='form-title'>
          基本信息
          <i :class="[tablesBaseInfoVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='tablesBaseInfoVisible = !tablesBaseInfoVisible'></i>
        </div>
        <el-form v-if='tablesBaseInfoVisible' class="header-form-inline" :model="page" label-position="left" :rules='rules' ref="refForm2" :show-message="false">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="是否显示合计条" prop='showSummary'>
                <el-checkbox v-model='tabsContent.table.showSummary'></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否显示多选" prop='showSelection'>
                <el-checkbox v-model='tabsContent.table.showSelection'></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>
      <!-- 接口设置 -->
      <header :style="{'border-bottom-width': tablesApiInfoVisible ? '1px' : '0'}">
        <div class='form-title'>接口设置
          <i :class="[tablesApiInfoVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='tablesApiInfoVisible = !tablesApiInfoVisible'></i>
        </div>
        <div class='edit-header-table' v-if='tablesApiInfoVisible'>
          <div class='tabs-operate' style='margin-top: 5px;'>
            <el-button v-db-click size="mini" @click='addApiRow(tabsContent.api)'>
              <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
            </el-button>
            <el-button v-db-click size="mini" @click='deleteApiRow(tabsContent.api)'>
              <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
            </el-button>
          </div>
          <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row :data="tabsContent.api" @current-change="handleSelectRowApiTables">
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
      <!-- 按钮设置 -->
      <header :style="{'border-bottom-width': tablesBtnInfoVisible ? '1px' : '0'}">
        <div class='form-title'>按钮设置
          <i :class="[tablesBtnInfoVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='tablesBtnInfoVisible = !tablesBtnInfoVisible'></i>
        </div>
        <div class='edit-header-table' v-if='tablesBtnInfoVisible'>
          <div class='tabs-operate' style='margin-top: 5px;'>
            <el-button v-db-click size="mini" @click='addBtnRow(tabsContent.topBar)'>
              <svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
            </el-button>
            <el-button v-db-click size="mini" @click='deleteBtnRow(tabsContent.topBar)'>
              <svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
            </el-button>
          </div>
          <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingBtn" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tabsContent.topBar" @current-change="handleSelectRowBtnTables">
            <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
            <el-table-column label="按钮标识(name)" width='180'>
              <template slot-scope="scope">
                <input-validate v-model="scope.row.name" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='按钮图标(iconName)' width='180'>
              <template slot-scope='scope'>
                <el-select v-model="scope.row.iconName" size='mini' clearable filterable>
                  <el-option v-for="item in $store.state.app.icons" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="按钮名称(i18n)" width='180'>
              <template slot-scope="scope">
                <input-validate v-model="scope.row.i18n" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='按钮事件名(event)' width='180'>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.event" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='按钮显示条件(isShow)' width='200'>
              <template slot-scope='scope'>
                <el-select v-model="scope.row.isShow" size='mini' multiple>
                  <el-option v-for="item in showOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label='按钮弹窗地址(component)' width='280'>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.component" size='mini' placeholder='以views开头不带后缀名'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='按钮验证方法(validate)' width='180'>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.validate" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='按钮设置默认值方法(setDefault)' width='220'>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.setDefault" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='按钮关闭前方法(beforeCallback)' width='220'>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.beforeCallback" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='按钮关闭回调(callback)' width='180'>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.callback" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='按钮自定义保存(extraEvent)' width='180'>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.extraEvent" size='mini'></input-validate>
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
      <!-- 内容设置 -->
      <header :style="{'border-bottom-width': tabsContentInfoVisible ? '1px' : '0'}">
        <div class='form-title'>
          列表项信息
          <i :class="[tabsContentInfoVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='tabsContentInfoVisible = !tabsContentInfoVisible'></i>
        </div>
        <div class="edit-header-table" v-if='tabsContentInfoVisible'>
          <el-row class='tabs-operate' style='margin-top: 5px;'>
            <el-button size="mini" v-db-click @click='onAddTables' style='padding: 6px 10px;'>
              <svg-icon icon-class="线性-增行"></svg-icon>{{$t('biz.btn.addRow')}}
            </el-button>
            <el-button size="mini" v-db-click @click='onDeleteTables' style='padding: 6px 10px;'>
              <svg-icon icon-class="线性-删行"></svg-icon>{{$t('biz.btn.deleteRow')}}
            </el-button>
          </el-row>
          <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loadingTablesDialog" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tabsContent.table.cols" @current-change="handleSelectRowTablesContent">
            <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
            <el-table-column width="140">
              <template slot="header" slot-scope="scope">
                名称(label)
                <span style='color:#f56c6c;' :data-header='scope'>*</span>
              </template>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.label" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column width="140">
              <template slot="header" slot-scope="scope">
                属性(prop)
                <span style='color:#f56c6c;' :data-header='scope'>*</span>
              </template>
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.prop" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='组件名(element)' width="180">
              <template slot-scope='scope'>
                <el-select v-model="scope.row.element" size='mini' placeholder="文本、日期不选" clearable>
                  <el-option v-for="item in componentOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label='格式化方法(func)' width="180">
              <template slot-scope='scope'>
                <el-select v-model="scope.row.func" size='mini' :placeholder="$t('biz.placeholder.choose')" clearable>
                  <el-option v-for="item in formatFuncList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label='格式化参数(dict)' width="180">
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.dict" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='是否必输(required)' width="140">
              <template slot-scope='scope'>
                <div style='text-align: center;'>
                  <el-checkbox v-model='scope.row.required'></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column label='是否合计(summary)' width="140">
              <template slot-scope='scope'>
                <div style='text-align: center;'>
                  <el-checkbox v-model='scope.row.summary'></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column label='列宽(width)' width="140">
              <template slot-scope='scope'>
                <input-validate v-model="scope.row.width" size='mini'></input-validate>
              </template>
            </el-table-column>
            <el-table-column label='属性组(attrs)' align='center' width='140'>
              <template slot-scope='scope'>
                <span style='color: #409EFF;cursor: pointer;' @click="onRowAttrSet(scope.row)">属性设置</span>
              </template>
            </el-table-column>
            <el-table-column label='相关事件(event)' align='center' width='140'>
              <template slot-scope='scope'>
                <span style='color: #409EFF;cursor: pointer;' @click="onRowEventSet(scope.row)">事件设置</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </header>
      <div slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogTableVisible4 = false">取 消</el-button>
        <el-button size='mini' type="primary" @click="onTabsConfirm">确 定</el-button>
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
      activeName: 'formData',
      menuInfoVisible: true,
      apiTableVisible: true,
      btnTableVisible: true,
      tablesBaseInfoVisible: true,
      tablesApiInfoVisible: true,
      tablesBtnInfoVisible: true,
      tabsContentInfoVisible: true,

      // loading相关
      loadingApi: false,
      loadingBtn: false,
      loadingFormData: false,
      loadingTables: false,
      loadingTabs: false,
      loadingFormDataDialog: false,
      loadingTablesDialog: false,
      loadingTabsDialog: false,

      // 当前选中行对象
      currentRowAttr: {},
      currentRowFunc: {},
      currentSetAttrRow: {}, // 当前需要设置属性的行（因多个列表可能都会打开公用的属性设置弹窗）
      currentSetFuncRow: {}, // 当前需要设置方法的行（因多个列表可能都会打开公用的属性设置弹窗）
      currentRowFormData: {},
      currentRowFormDataDialog: {},
      currentRowTables: {},
      currentRowTablesContent: {},
      currentRowTabs: {},
      currentRowApi: {},
      currentRowApiTables: {},
      currentRowBtn: {},
      currentRowBtnTables: {},

      // 弹窗是否显示
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible4: false,
      dialogTableVisible5: false,

      attrData: [],
      funcData: [],
      formDataContent: [], // 表单项具体配置
      tabsContent: {
        api: [],
        topBar: [],
        table: {
          showSummary: false,
          showSelection: false,
          cols: []
        }
      },
      // 按钮选项
      buttonOptions: [
        {
          label: '关闭',
          value: 'biz.btn.close',
          event: 'close'
        },
        {
          label: '取消',
          value: 'biz.btn.cancel',
          event: 'cancel'
        },
        {
          label: '保存',
          value: 'biz.btn.save',
          event: 'save'
        },
        {
          label: '提交',
          value: 'biz.btn.submit',
          event: 'submit'
        }
      ],
      // 事件选项
      eventOptions: {
        'biz.btn.close': 'close',
        'biz.btn.cancel': 'cancel',
        'biz.btn.save': 'save',
        'biz.btn.submit': 'submit'
      },

      // 下拉选静态数据
      apiOptions: ['view', 'save', 'update', 'search'],
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
        }
      ],
      // 格式化文本选项
      formatFuncList: [
        {
          label: '日期格式化',
          value: 'dateFormat'
        },
        {
          label: '数值千分位',
          value: 'thousands'
        },
        {
          label: '字典码表回显',
          value: 'dataDictFormat'
        }
      ],
      // 组件名选项
      componentOptions: [
        {
          label: '基础下拉框',
          value: 'base-select'
        },
        {
          label: '查询弹窗',
          value: 'base-dialog-select'
        },
        {
          label: '输入框',
          value: 'input-formatter'
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
        codeType: 'submenu',
        pageType: 'detail',
        parentCode: '',
        code: '',
        sortNo: '',
        codeDataJson: {
          api: [],
          topButtons: [],
          formData: [],
          tables: [],
          tabs: []
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
          // 接口设置
          if (res.codeDataJson.api && JSON.stringify(res.codeDataJson.api) !== "{}") {
            const apis = []
            Object.keys(res.codeDataJson.api).forEach(item => {
              apis.push({
                name: item,
                value: res.codeDataJson.api[item]
              })
            })
            res.codeDataJson.api = apis
          }
          // 表单设置
          if (res.codeDataJson.formData && JSON.stringify(res.codeDataJson.formData) !== "{}") {
            const forms = []
            Object.keys(res.codeDataJson.formData).forEach(item => {
              const { content, dtoKey, hidden, titleName } = res.codeDataJson.formData[item]
              forms.push({
                part: item,
                content,
                dtoKey,
                hidden,
                titleName
              })
            })
            res.codeDataJson.formData = forms
          }
          // 列表设置
          if (res.codeDataJson.tables) {
            res.codeDataJson.tables.forEach(table => {
              if (table.content.api) {
                const apis = []
                Object.keys(table.content.api).forEach(item => {
                  apis.push({
                    name: item,
                    value: table.content.api[item]
                  })
                })
                table.content.api = apis
              }
            })
          }
          // 标签页设置
          if (res.codeDataJson.tabs) {
            res.codeDataJson.tabs.forEach(tab => {
              if (tab.content.api) {
                const apis = []
                Object.keys(tab.content.api).forEach(item => {
                  apis.push({
                    name: item,
                    value: tab.content.api[item]
                  })
                })
                tab.content.api = apis
              }
            })
          }

          this.page = res
        })
        .catch(() => {})
    },

    // 增行
    addRow() {
      if (this.activeName === 'formData') {
        this.page.codeDataJson.formData.push({
          part: '',
          dtoKey: '',
          hidden: false,
          titleName: '',
          content: {}
        })
      } else if (this.activeName === 'tables') {
        this.page.codeDataJson.tables.push({
          name: '',
          label: '',
          isShow: [],
          required: false,
          content: {}
        })
      } else if (this.activeName === 'tabs') {
        this.page.codeDataJson.tabs.push({
          name: '',
          label: '',
          isShow: [],
          required: false,
          content: {}
        })
      }
    },
    // 删行
    deleteRow() {
      if (this.activeName === 'formData') {
        const index = this.page.codeDataJson.formData.indexOf(this.currentRowFormData)
        if (index < 0) return
        this.page.codeDataJson.formData.splice(index, 1)
      } else if (this.activeName === 'tables') {
        const index = this.page.codeDataJson.tables.indexOf(this.currentRowTables)
        if (index < 0) return
        this.page.codeDataJson.tables.splice(index, 1)
      } else if (this.activeName === 'tabs') {
        const index = this.page.codeDataJson.tabs.indexOf(this.currentRowTabs)
        if (index < 0) return
        this.page.codeDataJson.tabs.splice(index, 1)
      }
    },
    // 增加接口（公用传参）
    addApiRow(obj) {
      obj.push({
        name: '',
        value: ''
      })
    },
    // 删除接口（公用传参）
    deleteApiRow(obj) {
      const index = obj.indexOf(this.currentRowApi)
      obj.splice(index, 1)
    },
    // 增加按钮（公用传参）
    addBtnRow(obj) {
      obj.push({
        name: '',
        iconName: '',
        i18n: ''
      })
    },
    // 删除按钮（公用传参）
    deleteBtnRow(obj) {
      const index = obj.indexOf(this.currentRowBtn)
      obj.splice(index, 1)
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
    // 增加表单项
    onAddFormData() {
      this.formDataContent.push({
        label: '',
        dbDataType: '',
        type: '',
        attrs: '',
        isShow: true
      })
    },
    // 删除表单项
    onDeleteFormData() {
      const index = this.formDataContent.indexOf(this.currentRowFormData)
      this.formDataContent.splice(index, 1)
    },
    // 新增列表项
    onAddTables() {
      this.tabsContent.table.cols.push({
        label: '',
        prop: '',
        width: '',
        element: '',
        required: false
      })
    },
    // 删除列表项
    onDeleteTables() {
      const index = this.tabsContent.table.cols.indexOf(this.currentRowTablesContent)
      this.tabsContent.table.cols.splice(index, 1)
    },

    // 选中属性行
    handleSelectRowAttr(val) {
      this.currentRowAttr = val
    },
    // 选中方法行
    handleSelectRowFunc(val) {
      this.currentRowFunc = val
    },
    // 选中接口设置行
    handleSelectRowApi(val) {
      this.currentRowApi = val
    },
    // 选中标签页中列表接口设置行
    handleSelectRowApiTables(val) {
      this.currentRowApiTables = val
    },
    // 选中按钮设置行
    handleSelectRowBtn(val) {
      this.currentRowBtn = val
    },
    // 选中标签页中按钮设置行
    handleSelectRowBtnTables(val) {
      this.currentRowBtnTables = val
    },
    // 选中表单
    handleSelectRowFormData(val) {
      this.currentRowFormData = val
    },
    // 选中具体表单项
    handleSelectRowFormDataDialog(val) {
      this.currentRowFormDataDialog = val
    },
    // 选中列表页
    handleSelectRowTables(val) {
      this.currentRowTables = val
    },
    // 选中列表具体列
    handleSelectRowTablesContent(val) {
      this.currentRowTablesContent = val
    },
    // 选中标签页
    handleSelectRowTabs(val) {
      this.currentRowTabs = val
    },

    // 打开属性设置弹窗
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
    // 打开方法设置弹窗
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
    // 编辑页formData内容定义
    onRowFormDataContentSet(row) {
      if (row.content && JSON.stringify(row.content) !== '{}') {
        this.formDataContent = row.content
      } else {
        this.formDataContent = []
      }
      this.dialogTableVisible3 = true
    },
    // 编辑页tables/tabs内容定义
    onRowTabsContentSet(row) {
      if (row.content && JSON.stringify(row.content) !== '{}') {
        this.tabsContent = row.content
      } else {
        this.tabsContent = {
          api: [],
          topBar: [],
          table: {
            showSummary: false,
            showSelection: false,
            cols: []
          }
        }
      }
      this.dialogTableVisible4 = true
    },
    // 获取属性值
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
    // 获取属性类型
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
    // 保存当前表单项内容
    onFormDataConfirm() {
      this.currentRowFormData.content = this.formDataContent
      this.dialogTableVisible3 = false
    },
    // 保存当前tables/tabs内容
    onTabsConfirm() {
      if (this.activeName === 'tables') {
        this.currentRowTables.content = this.tabsContent
      } else if (this.activeName === 'tabs') {
        this.currentRowTabs.content = this.tabsContent
      }
      this.dialogTableVisible4 = false
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
            // formData数据格式转换
            const len = params.codeDataJson.formData.length
            if (len >= 1) {
              params.codeDataJson.formData = params.codeDataJson.formData.reduce((sum, item) => {
                const result = sum
                if (item.content && item.content.length > 0) {
                  item.content.forEach(form => {
                    // 组件名称添加
                    if (form.type === 'input') {
                      form.element = 'input-validate'
                    } else if (form.type === 'datadict' || form.type === 'baseSelect') {
                      form.element = 'base-select'
                    }
                    // 码表数据
                    if (form.datadict) {
                      form.list = this.$t(form.datadict)
                    }
                    // 表单时间区间字段修改
                    if (form.propArry) {
                      form.props = form.propArry.replace(/\s/g, '').split(',')
                      form.default = form.defaultVal ? form.defaultVal.replace(/\s/g, '').split(',') : []
                    } else {
                      form.default = form.defaultVal
                    }
                    // 表单必填项添加
                    if (form.required) {
                      form.validate = [{
                        required: true,
                        trigger: form.type === 'input' ? 'blur' : 'change'
                      }]
                    }
                  })
                }
                sum[item.part] = {
                  dtoKey: item.dtoKey,
                  hidden: item.hidden,
                  titleName: item.titleName,
                  content: item.content
                }
                return result
              }, {})
            }
            // tables中数据格式转换
            params.codeDataJson.tables.forEach(table => {
              if (table.content.api) {
                table.content.api = table.content.api.reduce((sum, item) => {
                  const result = sum
                  if (item.name) sum[item.name] = item.value
                  return result
                }, {})
              }
              if (table.content.table && table.content.table.cols) {
                table.content.table.cols.forEach(col => {
                  delete col.format
                  if (col.func) {
                    col.format = {
                      func: col.func,
                      dict: col.func === 'datadict' ? this.$t(col.dict) : col.func === 'thounsand' ? col.dict * 1 : col.dict
                    }
                  }
                })
              }
            })
            // tabs中数据格式转换
            params.codeDataJson.tabs.forEach(tab => {
              if (tab.content.api) {
                tab.content.api = tab.content.api.reduce((sum, item) => {
                  const result = sum
                  if (item.name) sum[item.name] = item.value
                  return result
                }, {})
              }
              if (tab.content.table && tab.content.table.cols) {
                tab.content.table.cols.forEach(col => {
                  delete col.format
                  if (col.func) {
                    col.format = {
                      func: col.func,
                      dict: col.func === 'dataDictFormat' ? this.$t(col.dict) : col.func === "thousands" ? col.dict * 1 : col.dict
                    }
                  }
                })
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
