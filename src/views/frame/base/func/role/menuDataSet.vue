<template>
	<div v-el-drag-dialog class='dialog-wrapper'>
		<div class='dialog-container' type='max' style="width:900px;">
			<!-- 头部 -->
			<title-contain :titleName='titleName' @TitleFun="cancel"></title-contain>

			<main>
				<!-- 顶部按钮 -->
				<el-row class='top-operate' style='margin:3px 0;'>
					<el-button @click="addRow" size="mini">
						<svg-icon icon-class="线性-增行"></svg-icon>{{ $t('biz.btn.addRow') }}
					</el-button>
					<el-button @click="deleteRow" size="mini">
						<svg-icon icon-class="线性-删行"></svg-icon>{{ $t('biz.btn.deleteRow') }}
					</el-button>
				</el-row>

				<el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row v-loading="loading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="list" :height='374' @selection-change="handleSelectionChange" style='border:1px solid;'>
					<el-table-column align='center' type="selection" width="45" fixed></el-table-column>
					<el-table-column align="left" width="200" prop="moduleCode">
						<template slot="header" slot-scope="scope">
							{{$t('func.role.moduleId')}}
							<span style='color:#f56c6c;' :data-header='scope'>*</span>
						</template>
						<template slot-scope="scope">
							<el-select size='mini' v-model="scope.row.moduleCode" filterable clearable @change="moduleChange(scope.row)">
								<el-option v-for="item in moduleList" :key="item.code" :label="item.menuName" :value="item.code">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column align="left" width="200" prop="colCode">
						<template slot="header" slot-scope="scope">
							{{$t('func.role.colCode')}}
							<span style='color:#f56c6c;' :data-header='scope'>*</span>
						</template>
						<template slot-scope="scope">
							<el-select size='mini' v-model="scope.row.colCode" filterable clearable @change="colChange(scope.row)">
								<el-option v-for="item in scope.row.colList" :key="item.colCode" :label="item.colCname" :value="item.colCode">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column width="150" align="left" prop="condTypeId">
						<template slot="header" slot-scope="scope">
							{{$t('func.role.condTypeId')}}
							<span style='color:#f56c6c;' :data-header='scope'>*</span>
						</template>
						<template slot-scope="scope">
							<el-select size='mini' v-model="scope.row.condTypeId" filterable @change="condChange(scope.row)">
								<el-option v-for="item in scope.row.condList" :key="item.id" :label="item.condName" :value="item.id">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column align="left" prop="condValue">
						<template slot="header" slot-scope="scope">
							{{$t('func.role.condValue')}}
							<span style='color:#f56c6c;' :data-header='scope'>*</span>
						</template>
						<template slot-scope="scope">
							<data-value-part v-model="scope.row.condValue" :rowIndex="scope.row.index" :colEnt="scope.row.colEnt" :multiple="scope.row.multiple" @change="partChange">
							</data-value-part>
						</template>
					</el-table-column>
				</el-table>
			</main>

			<div class="dialog-footer">
				<el-button @click='cancel()' size='mini'>{{this.$t("biz.btn.cancel")}}</el-button>
				<el-button type="primary" @click='save()' size='mini'>{{this.$t('biz.btn.save')}}</el-button>
			</div>
		</div>
		<div class="mask"></div>

	</div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import TitleContain from '@/components/frame/TitleContain'
import { notifyError, confirmTip, notifyInfo} from '@/utils/frame/base/notifyParams'
import dataValuePart from './components/DataValuePart'
import request from '@/utils/frame/base/request'
export default {
  components: {
    TitleContain,
    dataValuePart
  },
  props: {
    param: Object
  },
  computed: {
    ...mapGetters(['permissionRouters', 'sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientWidth > 1355 ? this.clientHeight - 650 : this.clientHeight - 660 // 防止底部滚动条遮挡
    },
    dialogTitle() {
      return this.$t('func.role.dataSetting')
    }
  },
  data() {
    return {
      titleName: this.$t('func.role.dataSetting') + '(' + this.dataFormat('dataDictFormat', this.param.authDirection, this.$t('datadict.authDirection')) + ')',
      list: [],
      staffTree: [],
      staffIds: {},
      moduleMap: {},
      colMap: {},
      condMap: {},
      checkedKeys: null,
      loadFlag: true,
      moduleList: null,
      multipleSelection: [],
      selectRow: null,
      loading: false,
      multiple: true,
      index: 0
    }
  },

  methods: {
    dataFormat(func = 'dataDictFormat', value, list) {
      return Vue.filter(func)(value, list)
    },
    cancel() {
      confirmTip(this, 'confirmCancel')
        .then(() => {
          this.$emit('closeAndRefreshHandler')
        })
        .catch(() => {})
    },
    close() {
      this.$emit('closeAndRefreshHandler')
    },
    save() {
      if(this.list){
        let checkFlag= true
         this.list.forEach(item => {
          if(item.moduleCode&&item.colCode&&item.condTypeId&&item.condValue){
          }else{
            checkFlag=false
          }
        })
        if(!checkFlag){
          this.$notify(
              notifyInfo({
                msg: '所有必输项不可以为空'
              })
            )
            return
        }
      }
      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(e => {
        request({
          url: '/api/func/roleDataperMod/saveMenuDataAuth',
          method: 'post',
          data: {
            data: {
              roleCode: this.param.code,
              authDirection: this.param.authDirection,
              moduleColCondList: this.list
            },
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
          }
        }).then(response => {
          this.$emit('closeAndRefreshHandler', true)
        })
      })
    },
    loadData() {
      this.loading = true
      request({
        url: '/api/func/roleDataperMod/listCodeByRoleCode',
        method: 'post',
        data: {
          data: {
            roleCode: this.param.code,
            authDirection: this.param.authDirection
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          for (const i in response.data) {
            response.data[i].index = this.index++
            if (response.data[i].condCode.includes('in')) {
              response.data[i].multiple = true
            } else {
              response.data[i].multiple = false
            }
            if (response.data[i].condCode.includes('in')) {
              response.data[i].condValue = response.data[i].condValue
                .substring(1, response.data[i].condValue.length - 1)
                .replace(new RegExp('"', 'gm'), '')
                .split(',')
            }
          }
          this.list = response.data
          for (const i in this.list) {
            request({
              url: '/api/func/roleDataperMod/listModuleColForMenuAuth',
              method: 'post',
              data: {
                data: this.list[i].moduleCode,
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.search')
              }
            }).then(response => {
              this.list[i].colList = response.data
              for (var j in this.list[i].colList) {
                this.colMap[this.list[i].colList[j].colCode] = this.list[i].colList[j]
              }
              this.list[i].colEnt = this.colMap[this.list[i].colCode]

              var dataType = this.colMap[this.list[i].colCode].authDataType
              var typePart = this.colMap[this.list[i].colCode].authTypePart
              if (dataType !== '1') {
                typePart = null
              }

              request({
                url: '/api/platform/cfgCondType/listCondTypesByDataType',
                method: 'post',
                data: {
                  data: {
                    authDataType: dataType,
                    authTypePart: typePart
                  },
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.search')
                }
              }).then(response => {
                this.list[i].condList = response.data
                for (var j in this.list[i].condList) {
                  this.condMap[this.list[i].condList[j].id] = this.list[i].condList[j]
                }
              })
            })
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      request({
        url: '/api/func/roleDataperMod/listModulesByRoleCode',
        method: 'post',
        data: {
          data: this.param.code,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        this.moduleList = response.data
        for (var id in this.moduleList) {
          this.moduleMap[this.moduleList[id].code] = this.moduleList[id]
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addRow() {
      const obj = {}
      obj.moduleCode = ''
      obj.moduleName = ''
      obj.colDbname = ''
      obj.condTypeId = ''
      obj.colCode = ''
      obj.colCname = ''
      obj.condName = ''
      obj.condCode = ''
      obj.condValue = null
      obj.colList = []
      obj.condList = []
      obj.colEnt = null
      obj.multiple = false
      obj.index = this.index++
      this.list.push(obj)
    },

    handleSelectRow(val) {
      this.selectRow = val
    },
    moduleChange(row) {
      row.colDbname = ''
      row.condTypeId = ''
      row.condCode = ''
      row.condValue = null
      row.condList = []
      row.moduleName = this.moduleMap[row.moduleCode].menuName

      request({
        url: '/api/func/roleDataperMod/listModuleColForMenuAuth',
        method: 'post',
        data: {
          data: row.moduleCode,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      }).then(response => {
        row.colList = response.data
        for (var i in row.colList) {
          this.colMap[row.colList[i].colCode] = row.colList[i]
        }
      })
    },
    colChange(row) {
      row.condTypeId = ''
      row.condValue = null
      row.colEnt = this.colMap[row.colCode]
      if (row.colEnt) {
        row.colCode = this.colMap[row.colCode].colCode
        row.colCname = this.colMap[row.colCode].colCname
        row.colDbname = this.colMap[row.colCode].colDbname
        var dataType = this.colMap[row.colCode].authDataType
        var typePart = this.colMap[row.colCode].authTypePart
        if (dataType !== '1') {
          typePart = null
        }

        request({
          url: '/api/platform/cfgCondType/listCondTypesByDataType',
          method: 'post',
          data: {
            data: {
              authDataType: dataType,
              authTypePart: typePart
            },
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search')
          }
        }).then(response => {
          row.condList = response.data
          for (var i in row.condList) {
            this.condMap[row.condList[i].id] = row.condList[i]
          }
        })
      }
    },
    condChange(row) {
      row.condName = this.condMap[row.condTypeId].condName
      row.condCode = this.condMap[row.condTypeId].condCode
      if (this.condMap[row.condTypeId].condCode.includes('in')) {
        row.condValue = null
        row.multiple = true
      } else {
        row.condValue = null
        row.multiple = false
      }
    },
    deleteRow() {
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      }
      var newList = []
      var deleteIndex = []
      for (const i in this.multipleSelection) {
        deleteIndex.push(this.multipleSelection[i].index)
      }
      for (const i in this.list) {
        if (!deleteIndex.includes(this.list[i].index)) {
          newList.push(this.list[i])
        }
      }
      this.list = newList
    },
    partChange(rowIndex, value, name) {
      for (const i in this.list) {
        if (this.list[i].index === rowIndex) {
          this.list[i].condValue = value
          this.list[i].condCvalue = name
        }
      }
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>
