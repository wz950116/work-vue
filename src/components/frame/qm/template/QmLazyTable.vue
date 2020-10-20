<template>
  <main :style="{'width': clientWidth < 1366 ? (this.sidebar.opened && !app.isScreenFull ? '1163px' : '1323px') : 'auto'}">
    <!-- 顶部按钮 -->
    <div class='top-operate' v-if='mainData.isTopBar'>
      <el-row type='flex'>
        <slot name='add'></slot>
        <slot name='upload'></slot>
        <div>
          <el-button v-db-click size="mini" @click='getList' style='margin-right:3px;'>
            <svg-icon icon-class="线性-刷新" style="margin-right:0px;"></svg-icon>
          </el-button>
        </div>
        <div v-for='(btn, index) in mainData.topBar' :key='index'>
          <el-button v-if='btn.name !== "refresh"' v-db-click size="mini" @click='triggerEvent(btn)' style='margin-right:3px;' v-permission="btn.permitName ? btn.permitName : [btn.name]">
            <svg-icon :icon-class="btn.iconName || baseEvent[btn.name] && baseEvent[btn.name].iconName"></svg-icon>{{$t(btn.i18n) || baseEvent[btn.name] && $t(baseEvent[btn.name].i18n)}}
          </el-button>
        </div>
      </el-row>
    </div>
    <!-- 列表 -->
    <u-table ref="plTable" use-virtual :height='tableHeight' :key='key' :row-height="24" :pagination-show='false' border :show-summary='true' :summary-method="getSummaries" @sort-change="handleSortChange">
      <u-table-column fixed align='center' type="index" width="50" :label='$t("table.id")' />
      <u-table-column v-for="col in formThead" :key="col.id" :resizable="col.resizable" v-bind='col' :show-overflow-tooltip="col.showOverflowTooltip" :sortable='mainData.table.sortable && col.sortable' :prop="col.prop" :label="$t(col.label)" :fixed="col.fixed" :width="col.width">
        <template slot-scope='scope'>
          <span v-if='col.formatter'>{{ col.formatter(scope.row, scope.column, scope.row[col.prop], scope.$index) }}</span>
          <span v-else-if='!col.format'>{{ scope.row[col.prop] }}</span>
          <span v-else>{{ dataFormat(col.format.func, scope.row[col.prop], col.format.dict,col.format.dictType) }}</span>
        </template>
      </u-table-column>
    </u-table>

    <!-- 底部按钮 -->
    <div class='bottom-operate'>
      <div class='bottom-operate-left' v-if='mainData.isColset'>
        <el-table-column-set :id='mainData.table.id' :checked="checked" :checkList="tableCols" @change="checkChange"></el-table-column-set>
      </div>
      <div class='bottom-operate-right' v-show='emptyTextVisible'>
        <svg-icon icon-class='线性-惊叹号' style='color:#E6A23C'></svg-icon>{{$t('table.emptyText')}}
      </div>
      <div class="bottom-operate-left" v-show='!emptyTextVisible'>
        总计 {{ total }} 条数据
      </div>
    </div>
  </main>
</template>

<script>
import Vue from 'vue'
import screenfull from 'screenfull'
import { mapGetters } from 'vuex'
// axios访问
import request from '@/utils/frame/base/request'
import axios from 'axios'
import storage from '@/utils/frame/base/localStorage'
import session from '@/utils/frame/base/sessionStorage'
// 导出excel
import exportExcel from '@/utils/frame/base/downloadExcel'

export default {
  data() {
    return {
      // 刷新列表标识
      key: 0,
      // 表格高度
      tableHeight: 0,
      // 当前展示的头
      formThead: [],
      // 表头数据
      tableCols: [],
      // 列设置
      checked: [],
      // 加载标识
      loading: false,
      // 总条数
      total: 0,
      // 表格展示信息
      tableData: [],
      // 是否显示暂无数据
      emptyTextVisible: true,
      // 最大化时是否显示顶部标签栏
      tagViewVisible: false,
      // 全局按钮方法
      baseEvent: {
        refresh: {
          func: this.getList,
          iconName: '线性-刷新',
          i18n: 'biz.btn.refresh'
        },
        export: {
          func: this.handleDownload,
          iconName: '线性-导出',
          i18n: 'biz.btn.export'
        }
      }
    }
  },
  inject: ['app'],
  provide() {
    return {
      QmLazyTable: this
    }
  },
  props: {
    // 主信息(按钮、表格、API等信息)
    mainData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  watch: {
    clientWidth() {
      this.tableComputed()
    },
    clientHeight() {
      this.tableComputed()
    },
    tagViewVisible() {
      this.tableComputed()
    }
  },
  beforeMount() {
    // 默认后台排序
    if (this.mainData.table.sortable === undefined) {
      this.mainData.table.sortable = 'custom'
    }

    this.mainData.table.cols.forEach(v => {
      // 根据isShow字段判断是否显示
      if (v.isShow === undefined) {
        v.isShow = true
      }
      // 默认何种排序根据this.mainData.table.sortable
      v.sortable = v.sortable === false ? false : this.mainData.table.sortable
      this.tableCols.push(v)
    })
    this.formThead = this.tableCols

    if (this.mainData.isColset) {
      this.checkChange()
    }

    if (this.mainData.initSearch !== undefined) {
      if (this.mainData.initSearch) {
        this.getList()
      }
    } else {
      if (process.env.INIT_SEARCH) {
        this.getList()
      }
    }
  },
  mounted() {
    this.tableComputed()

    // 全屏时触碰视窗顶部显示标签栏
    $(document).on('mousemove', e => {
      if (!screenfull.isFullscreen) return
      if (e.clientY === 0) {
        this.app.$refs.tagsView.visible = false
        $('.tags-view').show()
      }

      if (!$('.tags-view').is(':hidden') && e.clientY < 27) {
        $('.tags-view').show()
        // 防止在0处不移动则不触发hover效果
        $('#app-main').css('margin-top', '26px')
        this.tagViewVisible = true
      } else {
        $('.tags-view').hide()
        $('#app-main').css('margin-top', 0)
        this.tagViewVisible = false
      }
    })
  },
  methods: {
    // 列表数据请求
    getList(button) {
      this.loading = true
      if (button && button.name && button.name === 'search') {
        if (this.$parent.$refs.qmForm) {
          this.$parent.$refs.qmForm.loading = true
        }
      }
      request({
        url: this.mainData.api.search,
        method: 'POST',
        data: this.$parent.form.listQuery
      })
        .then(response => {
          if (this.$parent.$refs.qmForm) {
            this.$parent.$refs.qmForm.loading = false
          }
          this.loading = false
          this.tableData = response.data

          this.total = this.tableData.length
          if (this.total) {
            this.emptyTextVisible = false
          } else {
            this.emptyTextVisible = true
          }

          this.$refs.plTable.reloadData(this.tableData)
          // if (this.mainData.table.showSummary) {
          //   setTimeout(() => {
          //     this.tableHeight = this.tableHeight - 0.1
          //   }, 1000)
          // }
        })
        .catch(() => {
          if (this.$parent.$refs.qmForm) {
            this.$parent.$refs.qmForm.loading = false
          }
          this.loading = false
        })
    },
    // 计算列表高度
    tableComputed() {
      const elHead = document.getElementById('elHead')
      let getElHeadHeight = 0
      // 是否存在头部表单
      if (elHead) {
        getElHeadHeight = window.getComputedStyle(elHead).height.split('px')[0] * 1
      } else {
        getElHeadHeight -= 5
      }
      // 是否最大化
      if (screenfull.isFullscreen) {
        getElHeadHeight -= 76
        // 最大化时是否显示标签栏
        if (this.tagViewVisible) {
          getElHeadHeight += 26
        }
      }
      this.tableHeight = this.clientWidth < 1366 ? (this.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 188 : this.clientHeight - getElHeadHeight - 158) : this.mainData.isTopBar ? this.clientHeight - getElHeadHeight - 172 : this.clientHeight - getElHeadHeight - 142
    },
    // 按钮事件自定义
    triggerEvent(button) {
      if (button.event && typeof button.event === 'function') {
        button.event()
      } else if (this.baseEvent[button.name]) {
        this.baseEvent[button.name].func(button)
      }
    },
    // 返回指定过滤条件结果
    dataFormat(func = 'dataDictFormat', value, list, dictType) {
      if (dictType) {
        list = this.$t(dictType)
      }
      return Vue.filter(func)(value, list)
    },
    // 列设置
    checkChange() {
      this.checked = []
      request({
        url: '/api/sys/tableConfig/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.mainData.table.id
        }
      })
        .then(res => {
          if (res.data.length === 0) {
            this.tableCols.forEach(col => {
              col.checkFlag = '1'
            })
            this.key++
            this.checked = this.mainData.table.cols.map(v => {
              return v.prop
            })
          } else {
            res.data.forEach(col => {
              this.tableCols.forEach(c => {
                if (col.itemId === c.prop) {
                  c.checkFlag = col.checkFlag
                  c.sortNo = col.sortNo
                  if (c.checkFlag === '1') {
                    this.checked.push(c.prop)
                  }
                }
              })
            })
            this.tableCols = this.tableCols.sort((obj1, obj2) => {
              const value1 = obj1['sortNo']
              const value2 = obj2['sortNo']
              return value1 - value2
            })
            this.formThead = this.tableCols.filter(i => {
              if (i.checkFlag) {
                return !!+i.checkFlag
              } else {
                return true
              }
            })
            this.key++
          }
          // 防止动态设置tableHeight时合计栏被遮挡隐藏
          setTimeout(() => {
            this.$refs.plTable.reloadData(this.tableData)
          }, 100)
        })
        .catch(() => {})
    },
    // 合计方法
    getSummaries(param) {
      const { columns } = param
      const data = this.tableData
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        const values = data.map(item => Number(item[column.property]))
        const filterCol = this.mainData.table.cols.filter(col => col.prop === column.property)[0]

        if (filterCol && filterCol.summary) {
          if (filterCol.format && filterCol.format.func) {
            const value = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = Vue.filter(filterCol.format.func)(value, filterCol.format.dict)
            return
          } else {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            return
          }
        }
      })
      return [sums]
    },
    // 后台排序
    handleSortChange({ column, prop, order }) {
      const sortProp = this.mainData.table.cols.filter(col => col.prop === prop)[0].sortProp || prop
      if (this.mainData.table.sortable && this.mainData.table.sortable === 'custom') {
        if (order) {
          const asc = order === 'ascending' ? '.asc' : '.desc'
          this.$parent.form.listQuery.sortString = sortProp + asc
          this.getList()
        } else {
          this.$parent.form.listQuery.sortString = ''
          if (this.$parent.form.listQuery.defaultSortString) {
            this.getList()
          }
        }
      }
    },
    // 导出excel
    exportfunc() {
      this.loading = true
      const param = Object.assign({}, this.$parent.form.listQuery, {
        isPage: false
      })
      return request({
        url: this.mainData.api.export,
        method: 'POST',
        data: param
      })
    },
    callBackfunc() {
      this.loading = false
    },
    apiDownLoad(buttonInfo) {
      const param = Object.assign({}, this.$parent.form.listQuery, {
        isPage: false,
        funcOperation: this.$t('biz.btn.export')
      })
      param.excelInfo = {}
      if (buttonInfo.getParam) {
        param.excelInfo = buttonInfo.getParam()
      }
      if (!param.excelInfo['name']) {
        param.excelInfo['name'] = this.$t('route.' + this.$route.meta.title)
      }
      const titleData = []
      this.mainData.table.cols.map(col => {
        if (col.label) {
          titleData.push({
            name: this.$t(col.label),
            prop: col.prop
          })
        }
      })
      param.excelInfo.excelTitleInfoList = titleData

      axios({
        method: 'post',
        url: process.env.BASE_API + this.mainData.api.export,
        data: param,
        headers: {
          Authorization: 'Bearer ' + this.$store.getters.token,
          lang: storage.get('language') || 'zh',
          module: session.get('auditModule') || ''
        },
        responseType: 'blob'
      })
        .then(response => {
          if (!response.data) {
          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', param.excelInfo['name'] + '.xls')
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleDownload(buttonInfo) {
      if (buttonInfo && buttonInfo.type && buttonInfo.type === 'api') {
        // 后台导出
        this.apiDownLoad(buttonInfo)
      } else {
        exportExcel({
          fileName: this.$t('route.' + this.$route.meta.title),
          header: this.mainData.table.cols.map(col => {
            if (col.label) return this.$t(col.label)
          }),
          filterVal: this.mainData.table.cols.map(col => {
            if (col.format && col.format.dict instanceof Array) {
              return {
                val: col.prop,
                func: 'dataDictFormat',
                dicCode: col.format.dict
              }
            } else {
              return col.prop
            }
          }),
          exportfunc: this.exportfunc,
          callBackfunc: this.callBackfunc
        })
      }
    }
  }
}
</script>
