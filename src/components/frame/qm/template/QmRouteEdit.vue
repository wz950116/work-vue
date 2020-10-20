<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <template v-for='(button, index) in edit.topButtons'>
        <qm-upload v-if="button.event === 'upload'" :attrs='button.attrs' @onFileChange='addFile' :key='index'></qm-upload>
        <qm-upload-v2 v-else-if='button.type && button.type === "upload"' v-bind='button.atrrs' :btnName='button.name' :permission="button.permitName" :key='index'></qm-upload-v2>
        <el-button v-else :key='index' size="mini" v-db-click :loading="button.showLoading ? button.loading : false" v-bind='button.attrs' v-permission="button.permitName ? button.permitName : null" style='margin-right:6px;' @click='triggerEvent(button.callback, button)'>
          <svg-icon :icon-class="button.iconName"></svg-icon>{{$t(button.name)}}
        </el-button>
      </template>
    </el-row>
    <!--流程引导 -->
    <template v-if="stepInfo && stepInfo.steps && (stepInfo.active > -1)">
      <el-steps v-if="stepShow" :active="stepInfo.active" finish-status="success" simple>
        <el-step :title="dataFormat('dataDictFormat', item, $t('datadict.bizCode'))" v-for='(item, index) in stepInfo.steps' :key='index'></el-step>
      </el-steps>
    </template>
    <!-- 流程进度 -->
    <template v-else>
      <el-alert v-if="stepShow" show-icon center :title="$t('biz.msg.stepWarn')" type="warning" style="margin: 32px 0 5px;" :closable="false"> </el-alert>
    </template>
    <!-- 头部查询 -->
    <template v-if='Array.isArray(edit.formData)'>
      <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': mainInfoVisible ? '1px' : '0'}">
        <div class='form-title'>{{$t('biz.title.mainInfo')}}
          <i :class="[mainInfoVisible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='mainInfoVisible = !mainInfoVisible'></i>
        </div>
        <el-form v-if='mainInfoVisible' :inline="true" :model="editForm" class="header-form-inline" label-position="left" :rules='rules' ref="refForm">
          <el-row :gutter="20">
            <template v-for='(form, index) in edit.formData'>
              <el-col :key='index' v-if='form.isShow' :span="form.attrs && form.attrs.cols ? form.attrs.cols * 6 : 6" :data-key='form.prop'>
                <!-- 日期 -->
                <el-form-item v-if='form.type === "date"' :required='Array.isArray(form.props) && Array.isArray(form.validate)' :label="$t(form.label)" :prop='form.prop'>
                  <template v-if='Array.isArray(form.props)'>
                    <el-row :gutter="0">
                      <el-col :span="11">
                        <el-form-item :prop="form.props[0]">
                          <el-date-picker v-model="editForm[form.props[0]]" v-bind='form.attrs' @change="(date) => changeStartTime(date, form.attrs.pickEnd)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickStart ? datePick[form.attrs.pickStart] : datePick.dateStartBefore)' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2" align='center'>~</el-col>
                      <el-col :span="11">
                        <el-form-item :prop="form.props[1]">
                          <el-date-picker v-model="editForm[form.props[1]]" v-bind='form.attrs' @change="(date) => changeEndTime(date, form.attrs.pickStart)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickEnd ? datePick[form.attrs.pickEnd] : datePick.dateEndBefore)' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                  <template v-else>
                    <template v-if="form.attrs.type === 'start'">
                      <el-date-picker v-model="editForm[form.prop]" @change="(date) => changeStartTime(date, form.attrs.pickEnd)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickStart ? datePick[form.attrs.pickStart] : datePick.dateStartBefore)' v-bind='form.attrs' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                      </el-date-picker>
                    </template>
                    <template v-else-if="form.attrs.type === 'end'">
                      <el-date-picker v-model="editForm[form.prop]" @change="(date) => changeEndTime(date, form.attrs.pickStart)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickEnd ? datePick[form.attrs.pickEnd] : datePick.dateEndBefore)' v-bind='form.attrs' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                      </el-date-picker>
                    </template>
                    <template v-else>
                      <el-date-picker v-model="editForm[form.prop]" v-bind='form.attrs' :type="form.type" :picker-options='Object.assign(func.getDefaultPickerOptions(),form.attrs.pickerOptions?form.attrs.pickerOptions:{})' :placeholder="$t('biz.placeholder.dateInput')" @change='v => triggerEvent(v, form)'>
                      </el-date-picker>
                    </template>
                  </template>
                </el-form-item>
                <!-- 单选框 -->
                <el-form-item v-else-if='form.type === "radio"' :label="$t(form.label)" :prop='form.prop'>
                  <el-radio-group v-model="editForm[form.prop]" @change='v => triggerEvent(v, form)'>
                    <el-radio v-for='item in form.list' :key="item.value" :label="item.value" v-bind='form.attrs'>{{item.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <!-- 多选框 -->
                <el-form-item v-else-if='form.type === "checkbox"' :label="$t(form.label)" :prop='form.prop'>
                  <el-checkbox-group v-model="editForm[form.prop]" @change='v => triggerEvent(v, form)'>
                    <el-checkbox v-for='item in form.list' :key="item.value" :label="item.value" v-bind='form.attrs'>{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <!-- 数值区间 -->
                <el-form-item v-else-if='form.type === "numberInterval"' :required='Array.isArray(form.props) && Array.isArray(form.validate)' :label="$t(form.label)" :prop='form.prop'>
                  <el-row :gutter="0">
                    <el-col :span="11">
                      <el-form-item :prop="form.props[0]">
                        <input-formatter :min='form.attrs.startMin' :max='form.attrs.startMax !== undefined ? form.attrs.startMax : editForm[form.props[1]]' v-model="editForm[form.props[0]]" v-bind='form.attrs' size="mini"></input-formatter>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2" align='center'>~</el-col>
                    <el-col :span="11">
                      <el-form-item :prop="form.props[1]">
                        <input-formatter :min='form.attrs.endMin !== undefined ? form.attrs.endMin : editForm[form.props[0]]' :max='form.attrs.endMax' v-model="editForm[form.props[1]]" v-bind='form.attrs' size="mini"></input-formatter>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <!-- 组合组件 -->
                <el-form-item v-else-if='form.type === "combine"' :label="$t(form.label)" :prop='form.elements[0].prop'>
                  <el-row :gutter="0">
                    <el-col :span="14">
                      <!-- 字典码表 -->
                      <el-select v-if='form.elements[0].list' v-model="editForm[form.elements[0].prop]" v-bind='form.elements[0].attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form.elements[0])'>
                        <template v-for="item in form.elements[0].list">
                          <template v-if="form.elements[0].attrs&&!form.elements[0].attrs.multiple&& (edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit')">
                            <el-option v-if="editForm[form.elements[0].prop]===item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </template>
                          <template v-else>
                            <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </template>
                        </template>
                      </el-select>
                      <!-- 公用组件 -->
                      <component v-else :is='form.elements[0].element' v-model='editForm[form.elements[0].prop]' v-bind='form.elements[0].attrs' v-on='form.elements[0].event' :opType='edit.type' :attrs='form.elements[0].attrs' :newList='form.elements[0].list' @handleSelect='dialogSelect(form.elements[0])'></component>
                    </el-col>
                    <el-col :span="10">
                      <!-- 字典码表 -->
                      <el-select v-if='form.elements[1].list' v-model="editForm[form.elements[1].prop]" v-bind='form.elements[1].attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form.elements[1])'>
                        <template v-for="item in form.elements[1].list">
                          <template v-if="form.elements[1].attrs&&!form.elements[1].attrs.multiple&& (edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit')">
                            <el-option v-if="editForm[form.elements[1].prop]===item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </template>
                          <template v-else>
                            <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </template>
                        </template>
                      </el-select>
                      <!-- 公用组件 -->
                      <component v-else :is='form.elements[1].element' v-model='editForm[form.elements[1].prop]' v-bind='form.elements[1].attrs' v-on='form.elements[1].event' :opType='edit.type' :attrs='form.elements[1].attrs' :newList='form.elements[1].list' @handleSelect='dialogSelect(form.elements[1])'></component>
                    </el-col>
                  </el-row>
                </el-form-item>
                <!-- 下拉输入 -->
                <el-form-item v-else :label="$t(form.label)" :prop='form.prop'>
                  <!-- 字典码表 -->
                  <el-select v-if='form.list && (!form.attrs || !form.attrs.data)' v-model="editForm[form.prop]" v-bind='form.attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form)'>
                    <template v-for="item in form.list">
                      <template v-if="edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit'">
                        <el-option v-if="editForm[form.prop]===item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </template>
                      <template v-else>
                        <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </template>
                    </template>
                  </el-select>
                  <!-- 公用组件 -->
                  <component v-else :is='form.element' v-model='editForm[form.prop]' v-bind='form.attrs' v-on='form.event' :opType='edit.type' :attrs='form.attrs' :newList='form.list' @handleSelect='dialogSelect(form)'></component>
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </el-form>
      </header>
    </template>
    <template v-else-if='typeof edit.formData === "object"'>
      <template v-for='(item, index) in Object.keys(edit.formData)'>
        <header :key='index' :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': edit.formData[item].visible ? '1px' : '0'}" v-if='!edit.formData[item].hidden'>
          <div class='form-title'>{{$t(edit.formData[item].titleName)}}
            <i :class="[edit.formData[item].visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='edit.formData[item].visible = !edit.formData[item].visible'></i>
          </div>
          <el-form v-if='edit.formData[item].visible' :inline="true" :model="edit.formData[item].dtoKey ? editForm[edit.formData[item].dtoKey] : editForm" class="header-form-inline" label-position="left" :rules='rules' ref="refForm">
            <el-row :gutter="20">
              <template v-for='(form, index) in edit.formData[item].content'>
                <el-col :key='index' v-if='form.isShow' :span="form.attrs && form.attrs.cols ? form.attrs.cols * 6 : 6" :data-key='form.prop'>
                  <!-- 日期 -->
                  <el-form-item v-if='form.type === "date"' :required='Array.isArray(form.props) && Array.isArray(form.validate)' :label="$t(form.label)" :prop='form.prop'>
                    <template v-if='Array.isArray(form.props)'>
                      <el-row :gutter="0">
                        <el-col :span="11">
                          <el-form-item :prop="form.props[0]">
                            <el-date-picker v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.props[0]]" v-bind='form.attrs' @change="(date) => changeStartTime(date, form.attrs.pickEnd)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickStart ? datePick[form.attrs.pickStart] : datePick.dateStartBefore)' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                            </el-date-picker>
                            <el-date-picker v-else v-model="editForm[form.props[0]]" v-bind='form.attrs' @change="(date) => changeStartTime(date, form.attrs.pickEnd)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickStart ? datePick[form.attrs.pickStart] : datePick.dateStartBefore)' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                        <el-col :span="2" align='center'>~</el-col>
                        <el-col :span="11">
                          <el-form-item :prop="form.props[1]">
                            <el-date-picker v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.props[1]]" v-bind='form.attrs' @change="(date) => changeEndTime(date, form.attrs.pickStart)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickEnd ? datePick[form.attrs.pickEnd] : datePick.dateEndBefore)' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                            </el-date-picker>
                            <el-date-picker v-else v-model="editForm[form.props[1]]" v-bind='form.attrs' @change="(date) => changeEndTime(date, form.attrs.pickStart)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickEnd ? datePick[form.attrs.pickEnd] : datePick.dateEndBefore)' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                            </el-date-picker>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </template>
                    <template v-else>
                      <template v-if="form.attrs.type === 'start'">
                        <el-date-picker v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.prop]" @change="(date) => changeStartTime(date, form.attrs.pickEnd)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickStart ? datePick[form.attrs.pickStart] : datePick.dateStartBefore)' v-bind='form.attrs' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                        </el-date-picker>
                        <el-date-picker v-else v-model="editForm[form.prop]" @change="(date) => changeStartTime(date, form.attrs.pickEnd)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickStart ? datePick[form.attrs.pickStart] : datePick.dateStartBefore)' v-bind='form.attrs' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                        </el-date-picker>
                      </template>
                      <template v-else-if="form.attrs.type === 'end'">
                        <el-date-picker v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.prop]" @change="(date) => changeEndTime(date, form.attrs.pickStart)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickEnd ? datePick[form.attrs.pickEnd] : datePick.dateEndBefore)' v-bind='form.attrs' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                        </el-date-picker>
                        <el-date-picker v-else v-model="editForm[form.prop]" @change="(date) => changeEndTime(date, form.attrs.pickStart)" :picker-options='Object.assign(func.getDefaultPickerOptions() ,form.attrs.pickEnd ? datePick[form.attrs.pickEnd] : datePick.dateEndBefore)' v-bind='form.attrs' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')">
                        </el-date-picker>
                      </template>
                      <template v-else>
                        <el-date-picker v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.prop]" v-bind='form.attrs' :picker-options='Object.assign(func.getDefaultPickerOptions(),form.attrs.pickerOptions?form.attrs.pickerOptions:{})' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')" @change='v => triggerEvent(v, form)'>
                        </el-date-picker>
                        <el-date-picker v-else v-model="editForm[form.prop]" v-bind='form.attrs' :type="form.type" :placeholder="$t('biz.placeholder.dateInput')" :picker-options='Object.assign(func.getDefaultPickerOptions(),form.attrs.pickerOptions?form.attrs.pickerOptions:{})' @change='v => triggerEvent(v, form)'>
                        </el-date-picker>
                      </template>
                    </template>
                  </el-form-item>
                  <!-- 单选框 -->
                  <el-form-item v-else-if='form.type === "radio"' :label="$t(form.label)" :prop='form.prop'>
                    <el-radio-group v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.prop]" @change='v => triggerEvent(v, form)'>
                      <el-radio v-for='item in form.list' :key="item.value" :label="item.value" v-bind='form.attrs'>{{item.label}}</el-radio>
                    </el-radio-group>
                    <el-radio-group v-else v-model="editForm[form.prop]" @change='v => triggerEvent(v, form)'>
                      <el-radio v-for='item in form.list' :key="item.value" :label="item.value" v-bind='form.attrs'>{{item.label}}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <!-- 多选框 -->
                  <el-form-item v-else-if='form.type === "checkbox"' :label="$t(form.label)" :prop='form.prop'>
                    <el-checkbox-group v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.prop]" @change='v => triggerEvent(v, form)'>
                      <el-checkbox v-for='item in form.list' :key="item.value" :label="item.value" v-bind='form.attrs'>{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                    <el-checkbox-group v-else v-model="editForm[form.prop]" @change='v => triggerEvent(v, form)'>
                      <el-checkbox v-for='item in form.list' :key="item.value" :label="item.value" v-bind='form.attrs'>{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <!-- 数值区间 -->
                  <el-form-item v-else-if='form.type === "numberInterval"' :required='Array.isArray(form.props) && Array.isArray(form.validate)' :label="$t(form.label)" :prop='form.prop'>
                    <el-row :gutter="0">
                      <el-col :span="11">
                        <el-form-item :prop="form.props[0]">
                          <input-formatter v-if='edit.formData[item].dtoKey' :min='form.attrs.startMin' :max='form.attrs.startMax !== undefined ? form.attrs.startMax : editForm[edit.formData[item].dtoKey][form.props[1]]' v-model="editForm[edit.formData[item].dtoKey][form.props[0]]" v-bind='form.attrs' size="mini"></input-formatter>
                          <input-formatter v-else :min='form.attrs.startMin' :max='form.attrs.startMax !== undefined ? form.attrs.startMax : editForm[form.props[1]]' v-model="editForm[form.props[0]]" v-bind='form.attrs' size="mini"></input-formatter>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2" align='center'>~</el-col>
                      <el-col :span="11">
                        <el-form-item :prop="form.props[1]">
                          <input-formatter v-if='edit.formData[item].dtoKey' :min='form.attrs.endMin !== undefined ? form.attrs.endMin : editForm[edit.formData[item].dtoKey][form.props[0]]' :max='form.attrs.endMax' v-model="editForm[edit.formData[item].dtoKey][form.props[1]]" v-bind='form.attrs' size="mini"></input-formatter>
                          <input-formatter v-else :min='form.attrs.endMin !== undefined ? form.attrs.endMin : editForm[form.props[0]]' :max='form.attrs.endMax' v-model="editForm[form.props[1]]" v-bind='form.attrs' size="mini"></input-formatter>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <!-- 组合组件 -->
                  <el-form-item v-else-if='form.type === "combine"' :label="$t(form.label)" :prop='form.elements[0].prop'>
                    <el-row :gutter="0">
                      <el-col :span="14">
                        <!-- 字典码表 -->
                        <template v-if='form.elements[0].list'>
                          <el-select v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.elements[0].prop]" v-bind='form.elements[0].attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form.elements[0])'>

                            <template v-for="items in form.elements[0].list">
                              <template v-if="form.elements[0].attrs&&!form.elements[0].attrs.multiple&& ( edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit')">
                                <el-option v-if="editForm[edit.formData[item].dtoKey][form.elements[0].prop]===items.value" :key="items.value" :label="items.label" :value="items.value"></el-option>
                              </template>
                              <template v-else>
                                <el-option :key="items.value" :label="items.label" :value="items.value"></el-option>
                              </template>
                            </template>

                          </el-select>
                          <el-select v-else v-model="editForm[form.elements[0].prop]" v-bind='form.elements[0].attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form.elements[0])'>
                            <template v-for="item in form.elements[0].list">
                              <template v-if="form.elements[0].attrs&&!form.elements[0].attrs.multiple&& (edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit')">
                                <el-option v-if="editForm[form.elements[0].prop]===item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
                              </template>
                              <template v-else>
                                <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                              </template>
                            </template>
                          </el-select>
                        </template>
                        <!-- 公用组件 -->
                        <template v-else>
                          <component v-if='edit.formData[item].dtoKey' :is='form.elements[0].element' v-model='editForm[edit.formData[item].dtoKey][form.elements[0].prop]' v-bind='form.elements[0].attrs' v-on='form.elements[0].event' :opType='edit.type' :attrs='form.elements[0].attrs' :newList='form.elements[0].list' @handleSelect='dialogSelect(form.elements[0])'></component>
                          <component v-else :is='form.elements[0].element' v-model='editForm[form.elements[0].prop]' v-bind='form.elements[0].attrs' v-on='form.elements[0].event' :opType='edit.type' :attrs='form.elements[0].attrs' :newList='form.elements[0].list' @handleSelect='dialogSelect(form.elements[0])'></component>
                        </template>
                      </el-col>
                      <el-col :span="10">
                        <!-- 字典码表 -->
                        <template v-if='form.elements[1].list'>
                          <el-select v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.elements[1].prop]" v-bind='form.elements[1].attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form.elements[1])'>

                            <template v-for="items in form.elements[1].list">
                              <template v-if="form.elements[1].attrs&&!form.elements[1].attrs.multiple&& (edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit')">
                                <el-option v-if="editForm[edit.formData[item].dtoKey][form.elements[1].prop]===items.value" :key="items.value" :label="items.label" :value="items.value"></el-option>
                              </template>
                              <template v-else>
                                <el-option :key="items.value" :label="items.label" :value="items.value"></el-option>
                              </template>
                            </template>
                          </el-select>
                          <el-select v-else v-model="editForm[form.elements[1].prop]" v-bind='form.elements[1].attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form.elements[1])'>
                            <template v-for="item in form.elements[1].list">
                              <template v-if="form.elements[1].attrs&&!form.elements[1].attrs.multiple&& (edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit')">
                                <el-option v-if="editForm[form.elements[1].prop]===item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
                              </template>
                              <template v-else>
                                <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                              </template>
                            </template>
                          </el-select>
                        </template>
                        <!-- 公用组件 -->
                        <template v-else>
                          <component v-if='edit.formData[item].dtoKey' :is='form.elements[1].element' v-model='editForm[edit.formData[item].dtoKey][form.elements[1].prop]' v-bind='form.elements[1].attrs' v-on='form.elements[1].event' :opType='edit.type' :attrs='form.elements[1].attrs' :newList='form.elements[1].list' @handleSelect='dialogSelect(form.elements[1])'></component>
                          <component v-else :is='form.elements[1].element' v-model='editForm[form.elements[1].prop]' v-bind='form.elements[1].attrs' v-on='form.elements[1].event' :opType='edit.type' :attrs='form.elements[1].attrs' :newList='form.elements[1].list' @handleSelect='dialogSelect(form.elements[1])'></component>
                        </template>
                      </el-col>
                    </el-row>
                  </el-form-item>
                  <!-- 下拉输入 -->
                  <el-form-item v-else :label="$t(form.label)" :prop='form.prop'>
                    <!-- 字典码表 -->
                    <template v-if='form.list && (!form.attrs || !form.attrs.data)'>
                      <el-select v-if='edit.formData[item].dtoKey' v-model="editForm[edit.formData[item].dtoKey][form.prop]" v-bind='form.attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form)'>
                        <template v-for="items in form.list">
                          <template v-if="form.attrs&&!form.attrs.multiple&& (edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit')">
                            <el-option v-if="editForm[edit.formData[item].dtoKey][form.prop]===items.value" :key="items.value" :label="items.label" :value="items.value"></el-option>
                          </template>
                          <template v-else>
                            <el-option :key="items.value" :label="items.label" :value="items.value"></el-option>
                          </template>
                        </template>
                      </el-select>
                      <el-select v-else v-model="editForm[form.prop]" v-bind='form.attrs' :placeholder="$t('biz.placeholder.choose')" @change='v => triggerEvent(v, form)'>
                        <template v-for="item in form.list">
                          <template v-if="form.attrs&&!form.attrs.multiple&& (edit.type === 'view' || edit.type === 'assist' || edit.type === 'audit')">
                            <el-option v-if="editForm[form.prop]===item.value" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </template>
                          <template v-else>
                            <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </template>
                        </template>
                      </el-select>
                    </template>
                    <!-- 公用组件 -->
                    <template v-else>
                      <component v-if='edit.formData[item].dtoKey' :is='form.element' v-model='editForm[edit.formData[item].dtoKey][form.prop]' v-bind='form.attrs' v-on='form.event' :opType='edit.type' :attrs='form.attrs' :newList='form.list' @handleSelect='dialogSelect(form)'></component>
                      <component v-else :is='form.element' v-model='editForm[form.prop]' v-bind='form.attrs' v-on='form.event' :opType='edit.type' :attrs='form.attrs' :newList='form.list' @handleSelect='dialogSelect(form)'></component>
                    </template>
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </el-form>
        </header>
      </template>
    </template>
    <template v-if='edit.tables && edit.tables.filter(v => { return v.isShow }).length > 0'>
      <template v-for='table in edit.tables'>
        <header :key='table.name' :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': table.visible ? '1px' : '0'}" v-if='table.isShow'>
          <div class='form-title'>{{$t(table.label)}}<span v-if='table.required' style='color:#f56c6c;'>*</span>
            <i :class="[table.visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='table.visible = !table.visible'></i>
          </div>
          <component :is='table.name' v-show='table.visible' v-bind='table.attrs' :type='edit.type' :opType='edit.type' :param='edit.param' :extraParam='table.extraParam' :ref='table.name' :editForm='editForm' class='edit-header-table' :content='table.content'></component>
        </header>
      </template>
    </template>
    <!-- 左右tables -->
    <template v-if='edit.tablesTwo && edit.tablesTwo.filter(v => { return v.isShow }).length > 0'>
      <template v-for='tables in edit.tablesTwo'>
        <header :key='tables.name' :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto',  'display':'flex'}" v-if='tables.isShow'>
          <div v-for='table in tables.tablesArray' :key='table.name' style="width:50%">
            <div class='form-title'>{{$t(table.label)}}<span v-if='table.required' style='color:#f56c6c;'>*</span>
              <i :class="[table.visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='table.visible = !table.visible'></i>
            </div>
            <component :is='table.name' v-show='table.visible' v-bind='table.attrs' :type='edit.type' :opType='edit.type' :param='edit.param' :extraParam='table.extraParam' :ref='table.name' :editForm='editForm' class='edit-header-table' :content='table.content'></component>
          </div>
        </header>
      </template>
    </template>
    <main v-if='edit.tabs && edit.tabs.filter(v => { return v.isShow }).length > 0' :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-tabs v-model="activeName" type="border-card">
        <template v-for='tab in edit.tabs'>
          <el-tab-pane :key='tab.name' :index='tab.name' :name="tab.name" v-if='tab.isShow'>
            <span slot="label">{{$t(tab.label)}}<span v-if='tab.required' style='color:#f56c6c;'>*</span></span>
            <component :is='tab.name' v-bind='tab.attrs' :type='edit.type' :param='edit.param' :opType='edit.type' :ref='tab.name' :editForm='editForm' :extraParam='tab.extraParam' :content='tab.content'></component>
          </el-tab-pane>
        </template>
      </el-tabs>
      <!-- 二级弹窗 -->
      <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='edit.param' :extraParam='extraParam' :opType="edit.opType" :opMode='edit.opMode' :initChooseParam='initChooseParam'></view-form-edit>
    </main>
    <main v-else>
      <!-- 二级弹窗 -->
      <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='edit.param' :extraParam='extraParam' :opType="edit.opType" :opMode='edit.opMode' :initChooseParam='initChooseParam'></view-form-edit>
    </main>
  </div>
</template>

<script>
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { encriptPwd } from '@/utils/frame/base/encript.js'
import session from '@/utils/frame/base/sessionStorage'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'

import { dateFormate } from '@/utils/frame/base/index'
import { notifySuccess, confirmTip, notifyInfo } from '@/utils/frame/base/notifyParams'
const registerComponent = data => {
  data.forEach(item => {
    if (item.component && item.element !== 'base-dialog-select' && item.element !== 'base-select') {
      Vue.component(item.name, item.component)
    }
  })
}
export default {
  data() {
    return {
      func: toolUtil,
      stepShow: false,
      stepInfo: {},
      loading: false,
      bpmFlg: session.get('bpmFlg') || 'false',
      activeName: this.edit.tabs && this.edit.tabs[0] && this.edit.tabs[0].name,
      editForm: {},
      rules: {},
      mainInfoVisible: true,
      dataIsChange: false,
      onOff: false,
      dialogLv2Visible: false,
      datePick: {
        dateStartBefore: {},
        dateEndBefore: {}
      },
      dialogSelectProp: {}, // 打开弹窗的标识,
      initChooseParam: {}, // 打开弹窗额外参数传入
      extraParam: {} // 打开弹窗额外参数传入
    }
  },
  provide() {
    return {
      QmRouteEdit: this
    }
  },
  props: {
    edit: {
      type: Object,
      default() {
        return {}
      }
    },
    componentName: {
      type: String,
      default() {
        return 'QmRouteEdit'
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth'])
  },
  beforeMount() {
    let attachmentFlag = false
    let stepFlag = true
    let attachmentParam = {}
    // 按钮权限初始化
    this.edit.topButtons = this.edit.topButtons.filter(v => {
      if (process.env.ATTACHMENT_TAB_FLG && v.event === 'attachment') {
        attachmentFlag = true
        attachmentParam = v.getParam(this.edit.param)
        return false
      } else if (this.bpmFlg === 'false' && v.event === 'auditHistory') {
        return false
      } else {
        if (v.event === 'step') {
          stepFlag = false
        }
        return v.isShow === true || (v.isShow && v.isShow.includes(this.edit.type))
      }
    })
    if (stepFlag && this.edit.isStep && this.edit.apiData && this.edit.apiData.step) {
      this.edit.topButtons.push({
        iconName: '线性-查看',
        name: 'biz.btn.step',
        event: 'step',
        isShow: true
      })
    }

    //历史数据
    if (this.$route.params.billHis) {
      this.edit.topButtons = []
      this.edit.topButtons.push({
        iconName: '线性-关闭',
        name: 'biz.btn.close',
        event: 'close',
        isShow: true,
        attrs: {
          type: 'primary'
        }
      })
    }

    // 组件注册
    if (Array.isArray(this.edit.tables)) registerComponent(this.edit.tables)
    if (Array.isArray(this.edit.tablesTwo)) {
      this.edit.tablesTwo.forEach(item => {
        registerComponent(item.tablesArray)
      })
    }
    //组件注册 并添加附件TAB
    if (Array.isArray(this.edit.tabs)) {
      if (attachmentFlag) {
        this.edit.tabs.push({
          isShow: ['add', 'update', 'assist', 'audit', 'view', 'copy', 'account'],
          name: 'fleAttachment',
          label: 'biz.btn.uploadAttachment',
          extraParam: attachmentParam,
          component: () => import('@/components/frame/qm/Attachment/billTab')
        })
      }
      registerComponent(this.edit.tabs)
    } else {
      if (attachmentFlag) {
        this.edit.tabs = []
        this.edit.tabs.push({
          isShow: ['add', 'update', 'assist', 'audit', 'view', 'copy', 'account'],
          name: 'fleAttachment',
          label: 'biz.btn.uploadAttachment',
          extraParam: attachmentParam,
          component: () => import('@/components/frame/qm/Attachment/billTab')
        })
        registerComponent(this.edit.tabs)
      }
    }

    if (this.edit.topButtons) {
      this.edit.topButtons.forEach(v => {
        this.$set(v, 'loading', false)
      })
    }

    // 初始化editForm数据
    if (Array.isArray(this.edit.formData)) {
      this.edit.formData.forEach(v => {
        const val = v.default ? v.default : v.type === 'checkbox' || (v.attrs && v.attrs.multiple) ? [] : ''
        this.$set(this.editForm, v.prop, val)
        if (v.props) {
          this.$set(this.editForm, v.props[0], val[0])
          this.$set(this.editForm, v.props[1], val[1])
        }
        // 若初始化有值则手动触发change事件锁定日期选择范围
        if (v.default && v.type === 'date' && v.attrs.type === 'start') {
          this.changeStartTime(val, v.attrs.pickEnd)
        }
        if (v.default && v.type === 'date' && v.attrs.type === 'end') {
          this.changeEndTime(val, v.attrs.pickStart)
        }
        if ((this.edit.type === 'view' || this.edit.type === 'assist' || this.edit.type === 'audit' || this.edit.type === 'account') && v.attrs) {
          v.attrs.disabled = true
        }
      })
      // 根据isShow字段判断是否显示
      this.edit.formData.forEach(v => {
        if (v.isShow === undefined) {
          v.isShow = true
        } else {
          if (Array.isArray(v.isShow)) {
            v.isShow = v.isShow.includes(this.edit.type)
          }
        }

        // 校验规则
        if (v.validate) {
          if (Array.isArray(v.props)) {
            this.rules[v.props[0]] = v.validate
            this.rules[v.props[1]] = v.validate
          } else if (Array.isArray(v.elements)) {
            this.rules[v.elements[0].prop] = v.validate
          } else {
            this.rules[v.prop] = v.validate
          }
          if (v.validate[0].validatorFn && typeof v.validate[0].validatorFn === 'function') {
            v.validate[0].validator = (rule, value, callback) => {
              v.validate[0].validatorFn(rule, value, callback, v.prop)
            }
          }
          if (v.attrs && v.list) v.attrs.clearable = false
        }
        // 注册组件
        if (v.component && v.element !== 'base-dialog-select' && v.element !== 'base-select') {
          Vue.component(v.element, v.component)
        }
      })
    } else if (typeof this.edit.formData === 'object') {
      Object.keys(this.edit.formData).forEach(f => {
        this.$set(this.edit.formData[f], 'visible', true)
        if (this.edit.formData[f].content) {
          // 若改部分信息外包字段则先初始化
          if (this.edit.formData[f].dtoKey) this.$set(this.editForm, this.edit.formData[f].dtoKey, {})
          this.edit.formData[f].content.forEach(v => {
            const val = v.default ? v.default : v.type === 'checkbox' || (v.attrs && v.attrs.multiple) ? [] : ''
            if (this.edit.formData[f].dtoKey) {
              this.$set(this.editForm[this.edit.formData[f].dtoKey], v.prop, val)
              if (v.props) {
                this.$set(this.editForm[this.edit.formData[f].dtoKey], v.props[0], val[0])
                this.$set(this.editForm[this.edit.formData[f].dtoKey], v.props[1], val[1])
              }
            } else {
              this.$set(this.editForm, v.prop, val)
              if (v.props) {
                this.$set(this.editForm, v.props[0], val[0])
                this.$set(this.editForm, v.props[1], val[1])
              }
            }
            // 若初始化有值则手动触发change事件锁定日期选择范围
            if (v.default && v.type === 'date' && v.attrs.type === 'start') {
              this.changeStartTime(val, v.attrs.pickEnd)
            }
            if (v.default && v.type === 'date' && v.attrs.type === 'end') {
              this.changeEndTime(val, v.attrs.pickStart)
            }
            if ((this.edit.type === 'view' || this.edit.type === 'assist' || this.edit.type === 'audit' || this.edit.type === 'account') && v.attrs) {
              v.attrs.disabled = true
            }
          })
          // 校验规则
          this.edit.formData[f].content.forEach(v => {
            // 根据isShow字段判断是否显示
            if (v.isShow === undefined) {
              v.isShow = true
            } else {
              if (Array.isArray(v.isShow)) {
                v.isShow = v.isShow.includes(this.edit.type)
              }
            }
            // 校验规则
            if (v.validate) {
              if (Array.isArray(v.props)) {
                this.rules[v.props[0]] = v.validate
                this.rules[v.props[1]] = v.validate
              } else if (Array.isArray(v.elements)) {
                this.rules[v.elements[0].prop] = v.validate
              } else {
                this.rules[v.prop] = v.validate
              }
              if (v.validate[0].validatorFn && typeof v.validate[0].validatorFn === 'function') {
                v.validate[0].validator = (rule, value, callback) => {
                  v.validate[0].validatorFn(rule, value, callback, v.prop)
                }
              }
              if (v.attrs && v.list) v.attrs.clearable = false
            }
            // 注册组件
            if (v.component && v.element !== 'base-dialog-select' && v.element !== 'base-select') {
              Vue.component(v.element, v.component)
            }
          })
        } else if (this.edit.formData[f].table) {
          this.$set(this.editForm, this.edit.formData[f].table.key, [])
          this.$set(this.tableData, this.edit.formData[f].table.key, [])
        }
      })
    }
    if (this.edit.tabs && this.edit.tabs.length > 0) {
      this.edit.tabs.forEach(v => {
        // 根据isShow字段判断是否显示
        if (v.isShow === undefined) {
          v.isShow = true
        } else {
          if (Array.isArray(v.isShow)) {
            v.isShow = v.isShow.includes(this.edit.type)
          }
        }
      })
      const tempTabs = this.edit.tabs.filter(v => {
        return v.isShow
      })
      this.activeName = tempTabs.length > 0 ? tempTabs[0].name : ''
    }
    if (this.edit.tables) {
      this.edit.tables.forEach(t => {
        // 每个table控制展开收起标识初始化
        this.$set(t, 'visible', true)
        // 根据isShow字段判断是否显示
        if (t.isShow === undefined) {
          t.isShow = true
        } else if (Array.isArray(t.isShow)) {
          t.isShow = t.isShow.includes(this.edit.type)
        }
      })
    }
    if (this.edit.tablesTwo) {
      this.edit.tablesTwo.forEach(a => {
        a.tablesArray.forEach(t => {
          // 每个table控制展开收起标识初始化
          this.$set(t, 'visible', true)
          // 根据isShow字段判断是否显示
          if (t.isShow === undefined) {
            t.isShow = true
          } else if (Array.isArray(t.isShow)) {
            t.isShow = t.isShow.includes(this.edit.type)
          }
        })
      })
    }
    // 查看则清空校验规则
    if (this.edit.type === 'view') {
      this.rules = {}
    }
    //单据类型
    this.$set(this.editForm, 'baseBillType', this.$route.meta.bizCode)
    this.$set(this.editForm, 'baseModuleCode', this.$route.meta.bpmModule)
    if (this.edit['baseBillNo']) this.$set(this.editForm, 'baseBillNo', this.edit['baseBillNo'])
  },
  mounted() {
    // 是否初始化
    if (this.edit.type !== 'add') {
      if (this.$route.params.billHis) {
        this.getEditAllData()
      } else {
        this.getEditData()
      }
    }
    // 上级新增下级单据,有新增并且有上级单据号
    if (this.edit.type === 'add' && this.edit.param && this.edit.param.preBillNo) {
      this.getPreData()
    }
    if (this.edit.isStep) this.getStepsData()
    // 删除缓存数据
    session.remove('hashData')
  },
  updated() {
    if (this.onOff) {
      this.dataIsChange = true
    }
    this.onOff = true
  },
  methods: {
    // 获取初始化数据
    getEditData() {
      let viewData = (this.$route.params && this.$route.params.id) || (this.$route.query && this.$route.query.id)
      if (this.edit.apiData && this.edit.apiData.view && this.edit.apiData.view(this.edit.param)) {
        viewData = this.edit.apiData.view(this.edit.param)
      }
      if (!this.edit.api.view) return

      if (!this.editForm['baseBillNo'] && viewData) {
        if (typeof viewData === 'string') {
          this.editForm['baseBillNo'] = viewData
        }
      }

      //记录当前单据号
      NProgress.start()
      request({
        url: this.edit.api.view,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view'),
          data: viewData
        }
      })
        .then(response => {
          NProgress.done()
          this.editForm = Object.assign({}, this.editForm, response.data)
          // 初始化数据回调
          this.$emit('initCallback', this.editForm)

          this.onOff = false
        })
        .catch(() => {
          NProgress.done()
        })
    },

    // 获取初始化全部数据，包含tab页数据
    getEditAllData() {
      let viewData = (this.$route.params && this.$route.params.id) || (this.$route.query && this.$route.query.id)

      NProgress.start()
      request({
        url: '/api/bpm/billChangeHis/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.view'),
          data: viewData
        }
      })
        .then(response => {
          NProgress.done()
          this.editForm = Object.assign({}, this.editForm, response.data)

          if (this.edit.tables) {
            this.edit.tables.forEach(t => {
              if (t.name && this.$refs[t.name] && this.$refs[t.name].length > 0) {
                this.$refs[t.name][0].tableData = this.editForm[t.name]
              }
            })
          }
          if (this.edit.tablesTwo) {
            this.edit.tablesTwo.forEach(a => {
              a.tablesArray.forEach(t => {
                if (t.name && this.$refs[t.name] && this.$refs[t.name].length > 0) {
                  this.$refs[t.name][0].tableData = this.editForm[t.name]
                }
              })
            })
          }
          if (this.edit.tabs) {
            this.edit.tabs.forEach(t => {
              if (t.name) {
                if (this.$refs[t.name][0].$refs.tab) {
                  this.$refs[t.name][0].$refs.tab.tableData = this.editForm[t.name]
                } else {
                  this.$refs[t.name][0].tableData = this.editForm[t.name]
                }
              }
            })
          }
          // 初始化数据回调
          this.$emit('initCallback', this.editForm)

          this.onOff = false
        })
        .catch(() => {
          NProgress.done()
        })
    },

    // 获取step数据
    getStepsData() {
      const data = {}
      // 合同号
      data.contractNo = this.$route.params && this.$route.params.contractNo
      // 前置单据号
      data.preBillNo = this.$route.params && this.$route.params.preBillNo
      // 当前单据类型
      data.billType = this.$route.meta.bizCode
      if (this.edit.apiData && this.edit.apiData.step) {
        request({
          url: '/api/biz/flow/step',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: Object.assign(data, this.edit.apiData.step(this.edit.param))
          }
        })
          .then(response => {
            this.stepInfo = response.data
          })
          .catch(() => { })
      }
    },
    step() {
      this.stepShow = !this.stepShow
    },

    // 获取上级单据
    getPreData() {
      if (this.$route.params && this.$route.params.preBillType && this.$route.params.preBillNo) {
        let apiData
        if (this.edit.apiData && this.edit.apiData.pre && this.edit.apiData.pre(this.edit.param)) {
          apiData = this.edit.apiData.pre(this.edit.param)
        }
        let url
        if (typeof this.edit.api.pre === 'string') {
          url = this.edit.api.pre
        } else {
          url = this.edit.api.pre[this.$route.params.preBillType]
        }
        if (url) {
          NProgress.start()

          request({
            url: url,
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.view'),
              data: apiData
            }
          })
            .then(response => {
              NProgress.done()

              // 初始化数据回调
              if (response.data) {
                this.$emit('preCallback', response.data)
              }
            })
            .catch(() => {
              NProgress.done()
            })
        }
      }
    },

    // 返回指定过滤条件结果
    dataFormat(func = 'dataDictFormat', value, list, dictType) {
      if (dictType) {
        list = this.$t(dictType)
      }
      return Vue.filter(func)(value, list)
    },

    // 按钮事件自定义
    triggerEvent(defaultParam, btn) {
      if (typeof btn.event === 'function') {
        btn.event(defaultParam)
      } else if (typeof btn.event === 'string' && this[btn.event]) {
        this[btn.event](btn)
      }
      this.dialogSelectProp = btn
    },

    // 顶部按钮打开弹窗
    set(buttonInfo) {
      if (buttonInfo.validate && !buttonInfo.validate()) return
      if (buttonInfo.component) {
        // 注册组件
        if (buttonInfo.initChoose) {
          this.initChooseParam = buttonInfo.initChoose()
        } else {
          this.initChooseParam = {}
        }
        Vue.component('view-form-edit', buttonInfo.component)
        this.dialogLv2Visible = true
        this.dialogSelectProp = buttonInfo
        $(document).ready(() => {
          $(this.$refs.viewFormEdit.$el)
            .find('.mask')
            .css('z-index', 1999)
            .siblings('.dialog-container')
            .css('z-index', 2000)
          if (buttonInfo.setDefault) buttonInfo.setDefault(this.editForm)
        })
      }
    },

    // 表单区打开弹窗选择数据
    dialogSelect(col) {
      if (col.validateFunc && !col.validateFunc()) return
      if (col.component) {
        // 注册组件
        if (col.initChoose) {
          this.initChooseParam = col.initChoose()
        } else {
          this.initChooseParam = {}
        }
        Vue.component('view-form-edit', col.component)
        this.dialogLv2Visible = true
        this.dialogSelectProp = col
        $(document).ready(() => {
          $(this.$refs.viewFormEdit.$el)
            .find('.mask')
            .css('z-index', 1999)
            .siblings('.dialog-container')
            .css('z-index', 2000)
          if (col.setDefault) col.setDefault(this.editForm)
        })
      }
    },

    // 开始时间变化
    changeStartTime(date, pick) {
      if (pick) {
        this.$set(this.datePick, pick, {
          disabledDate(time) {
            return dateFormate(time, 'YYYYMMDD') * 1 < date * 1
          }
        })
      } else {
        this.datePick.dateEndBefore = {
          disabledDate(time) {
            return dateFormate(time, 'YYYYMMDD') * 1 < date * 1
          }
        }
      }
    },

    // 结束时间变化
    changeEndTime(date, pick) {
      if (pick) {
        this.$set(this.datePick, pick, {
          disabledDate(time) {
            return date ? dateFormate(time, 'YYYYMMDD') * 1 > date * 1 : false
          }
        })
      } else {
        this.datePick.dateStartBefore = {
          disabledDate(time) {
            return date ? dateFormate(time, 'YYYYMMDD') * 1 > date * 1 : false
          }
        }
      }
    },

    // 保存通用事件
    async save(buttonInfo) {
      const validateArr = []
      const validateArr2 = []
      const validateMsg = []
      if (Array.isArray(this.$refs.refForm)) {
        this.$refs.refForm.forEach(r => {
          r.validate(valid => {
            validateArr.push(valid)
          })
        })
      } else {
        this.$refs.refForm.validate(valid => {
          validateArr.push(valid)
        })
      }
      if (!validateArr.includes(false)) {
        // 列表参数追加并验证
        if (this.edit.tables) {
          this.edit.tables.forEach(t => {
            if (this.$refs[t.name] && this.$refs[t.name].length > 0) {
              this.editForm[t.name] = this.$refs[t.name][0].$refs.tab ? this.$refs[t.name][0].$refs.tab.tableData : this.$refs[t.name][0].tableData
              // 行验证
              if (this.editForm[t.name]) {
                if (this.editForm[t.name].length === 0) {
                  if (t.required) {
                    validateMsg.push(this.$t(t.label))
                    validateArr2.push(false)
                  }
                } else if (this.$refs[t.name][0].tab) {
                  // 列表列验证
                  this.$refs[t.name][0].tab.table.cols.forEach(v => {
                    if (v.required) {
                      this.editForm[t.name].forEach(detail => {
                        if (!detail[v.prop] && detail[v.prop] !== 0) {
                          validateMsg.push(this.$t(v.label))
                          validateArr2.push(false)
                        }
                      })
                    }
                  })
                }
              }
            } else {
              this.editForm[t.name] = []
            }
          })
        }
        // 列表参数追加并验证2
        if (this.edit.tablesTwo) {
          this.edit.tablesTwo.forEach(a => {
            a.tablesArray.forEach(t => {
              if (this.$refs[t.name] && this.$refs[t.name].length > 0) {
                this.editForm[t.name] = this.$refs[t.name][0].$refs.tab ? this.$refs[t.name][0].$refs.tab.tableData : this.$refs[t.name][0].tableData
                // 行验证
                if (this.editForm[t.name]) {
                  if (this.editForm[t.name].length === 0) {
                    if (t.required) {
                      validateMsg.push(this.$t(t.label))
                      validateArr2.push(false)
                    }
                  } else if (this.$refs[t.name][0].tab) {
                    // 列表列验证
                    this.$refs[t.name][0].tab.table.cols.forEach(v => {
                      if (v.required) {
                        this.editForm[t.name].forEach(detail => {
                          if (!detail[v.prop] && detail[v.prop] !== 0) {
                            validateMsg.push(this.$t(v.label))
                            validateArr2.push(false)
                          }
                        })
                      }
                    })
                  }
                }
              } else {
                this.editForm[t.name] = []
              }
            })
          })
        }
        // 标签页参数追加并验证
        if (this.edit.tabs && !validateArr2.includes(false)) {
          this.edit.tabs.forEach(t => {
            if (this.$refs[t.name] && this.$refs[t.name].length > 0) {
              if (this.$refs[t.name][0].$refs && this.$refs[t.name][0].$refs.tab) {
                this.editForm[t.name] = this.$refs[t.name][0].$refs.tab ? this.$refs[t.name][0].$refs.tab.tableData : this.$refs[t.name][0].tableData
                if (Array.isArray(this.editForm[t.name])) {
                  // 行验证
                  if (this.editForm[t.name].length === 0) {
                    if (t.required) {
                      validateMsg.push(this.$t(t.label))
                      validateArr2.push(false)
                    }
                  } else {
                    // 列验证
                    this.$refs[t.name][0].tab.table.cols.forEach(v => {
                      if (v.required) {
                        this.editForm[t.name].forEach(detail => {
                          if (!detail[v.prop] && detail[v.prop] !== 0) {
                            validateMsg.push(this.$t(v.label))
                            validateArr2.push(false)
                          }
                        })
                      }
                    })
                  }
                } else if (this.$refs[t.name][0].$refs.tab.$refs.refForm) {
                  this.$refs[t.name][0].$refs.tab.$refs.refForm.validate(valid => {
                    if (!valid) {
                      validateMsg.push('表单必填项')
                      validateArr2.push(valid)
                    }
                  })
                  this.editForm[t.name] = this.$refs[t.name][0].$refs.tab.tabForm
                }
              } else if (this.$refs[t.name][0].$refs && this.$refs[t.name][0].$refs.tree) {
                this.editForm[t.name] = this.$refs[t.name][0].$refs.tree.getCheckedKeys()
              }
            } else {
              this.editForm[t.name] = []
            }
          })
        }
        if (!validateArr2.includes(false)) {
          // 自定义保存事件
          if (buttonInfo.extraEvent) {
            const flag = await buttonInfo.extraEvent()
            if (!flag) return
          }
          const h = this.$createElement
          const confirmText = this.$t('biz.msg.confirmSave').split('\n')
          const newDatas = []
          for (const i in confirmText) {
            newDatas.push(h('p', null, confirmText[i]))
          }
          this.$confirm(this.$t('biz.msg.tip'), {
            message: h('div', null, newDatas),
            type: 'warning',
            closeOnClickModal: false,
            confirmButtonText: this.$t('biz.btn.confirm'),
            cancelButtonText: this.$t('biz.btn.cancel')
          })
            .then(async () => {
              // 加密的处理
              if (Array.isArray(this.edit.formData)) {
                this.edit.formData.forEach(v => {
                  if (v.attrs && v.attrs.encript) {
                    this.editForm[v.prop] = encriptPwd(this.editForm[v.prop])
                  }
                })
              } else if (typeof this.edit.formData === 'object') {
                Object.keys(this.edit.formData).forEach(f => {
                  if (this.edit.formData[f].content) {
                    this.edit.formData[f].content.forEach(v => {
                      if (v.attrs && v.attrs.encript) {
                        if (this.edit.formData[f].dtoKey) {
                          this.editForm[this.edit.formData[f].dtoKey][v.prop] = encriptPwd(this.editForm[this.edit.formData[f].dtoKey][v.prop])
                        } else {
                          this.editForm[v.prop] = encriptPwd(this.editForm[v.prop])
                        }
                      }
                    })
                  }
                })
              }
              let url = ''
              switch (this.edit.type) {
                case 'add':
                  url = this.edit.api.save
                  break
                case 'update':
                  url = this.edit.api.update
                  break
                case 'complete':
                  url = this.edit.api.complete
                  break
                default:
                  url = this.edit.api.update
              }

              buttonInfo.loading = true
              request({
                url,
                method: 'POST',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.save'),
                  data: this.editForm
                }
              })
                .then(response => {
                  if (response) {
                    buttonInfo.loading = false
                    this.$notify(
                      notifySuccess({
                        msg: this.$t('biz.msg.saveSuccess')
                      })
                    )

                    // 内置附件，则不提示
                    if (process.env.ATTACHMENT_TAB_FLG === false && buttonInfo.showAttachment && this.edit.type === 'add') {
                      this.$set(this.edit, 'topButtons', [
                        {
                          iconName: '线性-关闭',
                          name: 'biz.btn.close',
                          event: 'close',
                          isShow: ['view'],
                          attrs: {
                            type: 'primary'
                          }
                        }
                      ])
                      // 新增保存后弹出附件上传
                      this.$confirm(this.$t('biz.msg.confirmSaveAttachment'), this.$t('biz.msg.tip'), {
                        type: 'warning',
                        closeOnClickModal: false,
                        confirmButtonText: this.$t('biz.btn.confirm'),
                        cancelButtonText: this.$t('biz.btn.cancel')
                      })
                        .then(() => {
                          this.attachment({
                            billNo: response.data,
                            billType: this.$route.meta.bizCode
                          })
                          return
                        })
                        .catch(() => {
                          this.$emit('closeDialog', true)
                        })
                    } else if (typeof buttonInfo.callback === 'function') {
                      buttonInfo.callback()
                    } else {
                      this.$emit('closeDialog', true)
                    }
                  }
                })
                .catch(() => {
                  buttonInfo.loading = false
                  session.remove('hashData')
                })
            })
            .catch(() => {})
        } else {
          let msgs = ''
          validateMsg.forEach(lable => {
            msgs += lable + '不能为空; '
          })
          this.$notify(
            notifyInfo({
              msg: msgs
            })
          )
          return false
        }
      } else {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.saveCheck')
          })
        )
        return false
      }
    },

    // 取消通用事件
    cancel(buttonInfo) {
      // 若界面发生修改则关闭时提示
      if (this.dataIsChange) {
        confirmTip(this, 'confirmCancel')
          .then(() => {
            if (typeof buttonInfo.callback === 'function') {
              buttonInfo.callback()
            } else {
              this.$emit('closeDialog')
            }
          })
          .catch(() => { })
      } else {
        if (typeof buttonInfo.callback === 'function') {
          buttonInfo.callback()
        } else {
          this.$emit('closeDialog')
        }
      }
    },

    // 关闭通用事件
    close(buttonInfo) {
      if (typeof buttonInfo.callback === 'function') {
        buttonInfo.callback()
      } else {
        this.$emit('closeDialog')
      }
    },

    // 二级弹窗关闭回调
    dialogHandler(param) {
      if (param && JSON.stringify(this.dialogSelectProp) !== '{}') {
        this.$nextTick(() => {
          if (this.dialogSelectProp.beforeCallback) {
            if (this.dialogSelectProp.beforeCallback(param)) {
              this.dialogLv2Visible = false
            } else {
              return false
            }
          } else {
            this.dialogLv2Visible = false
          }
          if (typeof this.dialogSelectProp.callback === 'function') {
            this.dialogSelectProp.callback(param)
          } else {
            this.$emit('closeLv2Dialog', param)
          }
        })
      } else {
        this.dialogLv2Visible = false
      }
    },

    // 附件
    attachment(buttonInfo) {
      this.edit.opType = this.edit.type === 'add' ? 'update' : this.edit.type
      this.extraParam = buttonInfo.getParam ? buttonInfo.getParam(this.edit.param) : buttonInfo
      Vue.component('view-form-edit', () => import('@/components/frame/qm/Attachment/index.vue'))
      this.dialogLv2Visible = true
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el)
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },

    // 审批
    audit() {
      this.edit.opType = this.edit.type
      Vue.component('view-form-edit', () => import('@/views/frame/base/bpm/components/approveDialog.vue'))
      this.dialogLv2Visible = true
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el)
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    // 单据联查
    doSelectBill(buttonInfo) {
      this.$router.push(buttonInfo.getParam(this.editForm))
    },
    // 审批历史
    async auditHistory(buttonInfo) {
      this.edit.opType = this.edit.type
      Vue.component('view-form-edit', () => import('@/views/frame/base/bpm/components/approveHistory.vue'))
      if (buttonInfo.getParam) {
        const buttonParam = await buttonInfo.getParam()
        this.edit.param = Object.assign({}, this.edit.param, buttonParam)
      }
      this.dialogLv2Visible = true
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el)
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    // 打印
    print(buttonInfo) {
      this.edit.opType = this.edit.type === 'add' ? 'update' : this.edit.type
      Vue.component('view-form-edit', () => import('@/components/frame/qm/template/dialog/QmDialogPrint.vue'))
      if (buttonInfo.getParam) {
        this.edit.param = Object.assign({}, this.edit.param, buttonInfo.getParam(this.editForm))
      }
      this.dialogLv2Visible = true
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el)
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    // 增行
    addFile(file) {
      if (file && file.response && file.response.data) {
        this.$emit('fileCallback', file.response.data)
      }
    }
  }
}
</script>
