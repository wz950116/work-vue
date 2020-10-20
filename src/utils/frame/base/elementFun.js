import { dateFormate } from '@/utils/frame/base/index'

const elementFun = {
  // 重置查询表单
  resetForm() {
    if (this.$refs.queryForm) {
      this.$refs.queryForm.resetFields()
      this.getList()
    }
  },
  // 查询
  onSubmit() {
    this.getList()
  },
  // 页码跳转、N条每页
  handleSizeChange(val) {
    this.listQuery.size = val
    this.getList()
  },
  // 点击翻页
  handleCurrentChange(val) {
    this.listQuery.current = val
    this.getList()
  },
  // 单选
  handleSelectRow(val) {
    this.currentRow = val
  },
  // 多选
  handleCurrent(row, event, column) {
    this.$refs.multipleTable.toggleRowSelection(row)
  },
  // 多选框勾选
  toggleSelection(rows) {
    if (rows) {
      rows.forEach(row => {
        this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(row)
      })
    } else {
      this.$refs.multipleTable.clearSelection()
    }
  },
  handleSelectionChange(val) {
    this.multipleSelection = val
    // 通过操作dom更改选中行底色
    this.$nextTick(() => {
      if (!this.$refs.multipleTable) return
      $(this.$refs.multipleTable.$el).find('.el-table__row td').removeClass('select-row-bg-color')
      $(this.$refs.multipleTable.$el).find('.is-checked').parents('.el-table__row').find('td').addClass('select-row-bg-color')
    })
  },
  // 开始时间变化
  changeStartTime(date) {
    this.dateEndBefore = {
      disabledDate(time) {
        return dateFormate(time, 'YYYYMMDD') * 1 < date * 1
      }
    }
  },
  // 开始时间变化
  changeEndTime(date) {
    this.dateStartBefore = {
      disabledDate(time) {
        return date ? dateFormate(time, 'YYYYMMDD') * 1 > date * 1 : false
      }
    }
  }
}

export default elementFun
