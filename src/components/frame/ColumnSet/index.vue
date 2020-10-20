<template>
  <el-tooltip class="item" effect="dark" content="列设置" placement="top">
    <el-popover placement="top-start" trigger="click" @after-leave="hanldeAfterLeave">
      <div class='menu-item_first'>
        <el-checkbox-group v-model="hasCheck" :min='1' size="mini" v-if='isClick'>
          <template v-for="check in checks">
            <div :key="check.itemId" v-if='check.isShow !== false' class='check-group' @mousedown='onMouseDown(check.prop, $event)' @mouseup='onMouseUp(check.prop, $event)'>
              <el-checkbox :label="check.prop" :key="check.prop" style='width:90%;'>
                {{ $t(check.label) }}
              </el-checkbox>
              <i :class="[check.fixed ? 'el-icon-lock' : 'el-icon-unlock']" style='' @click.stop='handleLocked(check.prop)'></i>{{ check.fixed }}
            </div>
          </template>
        </el-checkbox-group>
        <div style='padding:10px;'>
          <el-button v-db-click size='mini' :loading="loading" type="primary" @click='save'>{{ $t('biz.btn.save') }}</el-button>
          <el-button v-db-click size='mini' @click="reset">{{ $t('biz.btn.reset') }}</el-button>
        </div>
      </div>
      <svg-icon slot="reference" icon-class='线性-设置' className='setting' @click.stop.native="popoverShow"></svg-icon>
    </el-popover>
  </el-tooltip>
</template>

<script>
import tableConfigApi from '@/api/frame/base/sys/tableColumnSet'

export default {
  data() {
    return {
      loading: false,
      iconVisible: false,
      isClick: false,
      multipleSelection: [],
      dragIndex: null,
      hasCheck: this.checked,
      checks: this.checkList,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.save')
      }
    }
  },
  props: {
    id: String,
    checked: Array,
    checkList: Array
  },
  watch: {
    checked(val) {
      this.hasCheck = val
    },
    checkList(val) {
      // 重新对checks赋值保证响应视图
      this.checks = val
    }
  },
  methods: {
    handleLocked(prop) {
      this.$emit('lockEvent', prop)
    },
    hanldeAfterLeave() {
      this.iconVisible = false
      this.isClick = false
      //this.$emit('change')
    },
    onMouseDown(dragChecked, e) {
      this.dragIndex = this.checks.map(v => v.prop).indexOf(dragChecked)
    },
    onMouseUp(dragChecked, e) {
      const dragIndex = this.checks.map(v => v.prop).indexOf(dragChecked)
      const targetItem = this.checks[dragIndex]
      const fromItem = this.checks[this.dragIndex]
      if (dragIndex !== this.dragIndex) {
        this.checks.splice(this.dragIndex, 1, targetItem)
        this.checks.splice(dragIndex, 1, fromItem)
      }
    },
    save() {
      this.loading = true
      const arr = []

      this.checks.forEach((c, index) => {
        arr.push({
          itemId: c.prop,
          sortNo: index,
          checkFlag: this.hasCheck.includes(c.prop) ? '1' : '0',
          reservedStr1: c.fixed ? '1' : '0'
        })
      })
      const params = {
        tableId: this.id,
        sysTableConfigList: arr
      }
      tableConfigApi
        .setTableConfig(params, this.func)
        .then(res => {
          this.loading = false
          this.$emit('change')
        })
        .catch(e => {
          this.loading = false
        })
    },
    reset() {
      this.$emit('change')
    },
    popoverShow() {
      this.iconVisible = true
      this.isClick = true
    }
  }
}
</script>

<style lang='scss'>
.el-popover {
  min-width: unset !important;
  padding: 0 !important;
  .el-checkbox-group {
    max-height: 500px;
    overflow: auto;
    .check-group {
      padding: 8px 10px;
      .el-checkbox__label {
        color: #606266 !important;
        font-size: 12px;
        padding-right: 5px;
      }
      i {
        float: right;
        margin-top: -18px;
        font-size: 16px;
        cursor: pointer;
        z-index: 999;
      }
      .el-icon-lock {
        color: #e6a23c !important;
      }
      &:hover {
        background: #ecf5ff;
      }
    }
  }
}
.el-popover label.el-checkbox .el-checkbox__label {
  cursor: move;
}
.el-popover .el-checkbox + .el-checkbox {
  margin-left: 0;
}
</style>
