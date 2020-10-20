<template>
  <div>
    <el-table :data="table.tableData || tableData" style="width: 100%;" :height="table.tableHeight" :class="tableClass" ref="multipleTable" tooltip-effect="dark" :row-key="table.id || 'id'" :highlight-current-row="true" :show-summary="table.show_summary || false" :summary-method="table.summaryMethod" border @row-click="rowClick" @selection-change="selectionChange" @sort-change="sortChange" v-loading="loading">
      <template v-for="(item, index) in table.thead">
        <el-table-column v-if="typeof item.itemDetail == 'function'" :key="index" :label="item.label" :width="item.width" :sortable="item.sortable || false" :fixed="item.fixed || false">
          <template slot-scope="{row}">
            <span @click="item.itemDetail(row)" style="color: #409eff;cursor: pointer;">{{row[item.prop]}}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.operate" :key="index" :label="item.label" :width="item.width">
          <template slot-scope="{row, $index}">
            <template v-if="item.operate.length && item.operate[0].icon">
              <template v-for="(ele, index1) in operateList(item.operate, row, $index)">
                <el-button type="primary" :icon="ele.icon" circle :key="index1" @click.stop="openClick(ele, row)" size="mini" :disabled="Boolean(ele.disable) && ele.disable(row, $index, tableData.length)"></el-button>
              </template>
            </template>
            <template v-else-if="item.operate.length">
              <template v-if="operateList(item.operate, row, $index).length < 4">
                <template v-for="(ele, index1) in operateList(item.operate, row, $index)">
                  <span :key="index1" @click.stop="openClick(ele, row)" :style="{color: ele.color || '#409eff'}" style="cursor: pointer;margin-right: 10px;">
                    <i :class="'fontIcon fa fa-'+ele.fontIcon" v-if="ele.fontIcon"></i>
                    {{ele.label|| ''}}
                  </span>
                </template>
              </template>
              <template v-else>
                <template v-for="(ele, index1) in operateList(item.operate, row, $index).slice(0, 2)">
                  <span :key="index1" @click.stop="openClick(ele, row)" style="color: #409eff;cursor: pointer;margin-right: 10px;">
                    <i :class="'fontIcon fa fa-'+ele.fontIcon" v-if="ele.fontIcon"></i>
                    {{ele.label|| ''}}
                  </span>
                </template>
                <el-popover placement="right" trigger="hover">
                  <ul class="oprate_ul">
                    <li @click.stop="openClick(ele, row)" v-for="(ele, index1) in operateList(item.operate, row, $index).slice(2)" :key="index1">{{ele.label|| ''}}</li>
                  </ul>
                  <span slot="reference" class="more_png"></span>
                </el-popover>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.img" :prop="item.prop" :key="index" :label="item.label" width="150" :sortable="item.sortable || false" :fixed="item.fixed || false">
          <template slot-scope="{row}">
            <img style="width: 130px; height: 130px" :src="row[item.prop] || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'" />
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.imgs" :prop="item.prop" :key="index" :label="item.label" width="150" :sortable="item.sortable || false" :fixed="item.fixed || false">
          <template slot-scope="{row}">
            <img v-for="(item, index) in row[item.prop]" :key="index" style="width: 130px; height: 130px" :src="item || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'" />
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.html" :prop="item.prop" :key="index" :label="item.label" :width="item.width" :sortable="item.sortable || false" :fixed="item.fixed || false">
          <template slot-scope="{row}">
            <div v-html="row[item.prop]"></div>
          </template>
        </el-table-column>
        <el-table-column v-else show-overflow-tooltip :type="item.type" :width="item.type == 'index' || item.type == 'selection' ? 50 : item.width" :formatter="item.formatter" :key="index" :prop="item.prop" :label="item.label" :sortable="item.sortable || false" :reserve-selection="item.type == 'selection' ? true : false"></el-table-column>
      </template>
    </el-table>
    <div class="bottom-operate" v-if="table.hidePage !== true">
      <el-pagination background :small="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current" :page-sizes="page.limits" :page-size="page.limit" layout="sizes,total,prev,pager,next,jumper" :total="page.total"></el-pagination>
    </div>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
function deleteEmptyKey(obj) {
  for (let key in obj) {
    if (typeof obj[key] == 'object') {
      deleteEmptyKey(obj[key])
    } else {
      if (obj[key] === '') {
        delete obj[key]
      }
    }
  }
  return obj
}
export default {
  props: {
    table: {
      type: Object,
      required: true,
      default() {
        return {
          system: '', // 系统
          url: '', // 列表接口
          id: '', // 列表每一条的主键
          defaultSelect: [],
          thead: [
            {
              prop: '',
              label: '',
              type: '',
              itemDetail: function() {},
              operate: []
            }
          ]
        }
      }
    },
    searchFileds: {
      // 搜索条件
      type: Object,
      default() {
        return {}
      }
    },
    tableClass: {
      type: String,
      default: 'my_el_table'
    }
  },
  data() {
    return {
      loading: false,
      page: {
        current: 1,
        limits: [10, 30, 50, 100, 200],
        limit: 10,
        total: 0,
        prop: '',
        order: ''
      },
      tableData: []
    }
  },
  computed: {
    tableHeight() {
      return 0
    }
  },
  created() {
    this.getList()
  },
  mounted() {},
  watch: {
    'table.defaultSelect'() {
      this.$refs.multipleTable.clearSelection()
      this.selectDefault()
    }
  },
  methods: {
    operateList(arr, row, $index) {
      return arr.filter(ele => {
        return !ele.show || ele.show(row, $index)
      })
    },
    // 点击事件
    openClick(ele, row) {
      ele.event(row)
    },
    sortChange({ prop, order }) {
      if (order) {
        this.page.prop = prop
        this.page.order = order.replace('ending', '')
      } else {
        this.page.prop = ''
        this.page.order = ''
      }
      this.getList()
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
      this.$emit('rowClick', row)
    },
    handleCurrentChange(val) {
      this.page.current = val
      this.getList()
    },
    handleSizeChange(val) {
      this.page.limit = val
      this.getList()
    },
    selectionChange(arr) {
      this.$emit('input', arr)
    },
    selectDefault() {
      if (this.table.defaultSelect) {
        this.$nextTick(() => {
          for (let item of this.table.defaultSelect) {
            for (let ele of this.tableData) {
              if (item === ele[this.table.id || 'id']) {
                this.$refs.multipleTable.toggleRowSelection(ele, true)
                break
              }
            }
          }
        })
      }
    },
    getList() {
      if (!this.table.url || this.table.tableData) return
      let params = {}
      if (this.table.hidePage) {
        params = JSON.parse(JSON.stringify(this.searchFileds))
      } else {
        params = {
          current: this.page.current,
          size: this.page.limit,
          sortString: this.page.prop || this.page.order ? `${this.page.prop}.${this.page.order}` : '',
          isPage: true,
          ...JSON.parse(JSON.stringify(this.searchFileds))
        }
      }
      let method = this.table.method || 'get'
      let config
      if (method == 'get') {
        config = {
          params
        }
      } else {
        config = params
      }
      this.loading = true
      this.tableData = []
      return request[method](this.table.url, deleteEmptyKey(config))
        .then(res => {
          this.tableData = res.data
          this.page.total = res.total
          this.selectDefault()
          return res.data
        })
        .finally(() => {
          this.loading = false
          setTimeout(() => {
            let spans = this.$el.querySelectorAll('td .cell .el-tooltip.item')
            spans.forEach(ele => {
              let cell = ele.parentNode
              if (cell.clientWidth > ele.clientWidth + 20) {
                cell.innerHTML = cell.innerText
              } else {
                ele.style.display = 'inline'
              }
            })
          }, 300)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
// /deep/ .el-pagination {
//     margin-top: 8px;
//     padding: 10px;
// }

// /deep/ .el-pagination__sizes {
//     position: relative;
//     top: -2px;
// }

/deep/ .el-table {
  thead th {
    background: #f5f5f5;
  }
  td,
  th {
    padding: 11px 0;
  }
  .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
/deep/ .el-table--border {
  border-right: 1px solid #ebeef5;
}

.fontIcon {
  font-size: 16px;
  color: #99a9bf;
}

.fontIcon:hover {
  color: #409eff;
}

.hoveTitle {
  text-align: left;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.more_png {
  display: inline-block;
  width: 16px;
  height: 16px;
  // background: url('~@/assets/images/buttons_more.png');
  vertical-align: sub;
  cursor: pointer;
}

.oprate_ul {
  margin: 0;

  li {
    cursor: pointer;
    color: rgb(64, 158, 255);
  }
}
</style>