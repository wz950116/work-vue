<template>
  <div class="app-container dashboard">
    <div :style="{'width': clientWidth < 1366 ? (this.sidebar.opened ? '1163px' : '1323px') : 'auto'}">
      <el-row :gutter='10' style='padding: 0 10px;margin-top: 10px;'>
        <el-col v-for='item in list' v-dragging="{ item, list, group: item }" :key="item.id" :span='item.width * 1' class='dashboard_module'>
          <component :is='item.blockType' :block='item' @refreshList='initData()'></component>
        </el-col>
      </el-row>
      <div class='add_module' @click='addModuleVisible = true'>
        <i class='el-icon-plus'></i>
      </div>
    </div>

    <div v-el-drag-dialog v-if='addModuleVisible' class='dialog-wrapper'>
      <div class='dialog-container' type='miniColumnsDialog'>
        <title-contain titleName='新增模块' @TitleFun="cancle" />
        <el-form ref="refForm" :model="form" :rules='rules'>
          <el-form-item label="模块类型" prop='blockType'>
            <el-select v-model="form.blockType" placeholder="" @change='blockTypeChange'>
              <el-option v-for='option in $t("datadict.blockType")' :label="option.label" :value="option.value" :key="option.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模块内容" prop='empCompList'>
            <el-drag-select v-model="form.empCompList" multiple placeholder="">
              <el-option v-for="item in contentOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-drag-select>
          </el-form-item>
          <el-form-item label="模块宽度" prop='width'>
            <el-select v-model="form.width" placeholder="">
              <el-option v-for='option in widthOptions' :label="option.label" :value="option.value" :key="option.value" :disabled="option.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size='mini' @click="cancle">取 消</el-button>
          <el-button size='mini' type="primary" :loading='loading' @click="onConfirm">确 定</el-button>
        </div>
      </div>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import Todo from '@/views/frame/dashboard/components/todo.vue'
import Msg from '@/views/frame/dashboard/components/msg.vue'
import Chart from '@/views/frame/dashboard/components/chart.vue'
import Notice from '@/views/frame/dashboard/components/notice.vue'
import ElDragSelect from '@/components/frame/DragSelect'

export default {
  name: 'dashboard',
  data () {
    return {
      isDragged: true,
      loading: false,
      addModuleVisible: false,
      form: {
        width: '',
        blockType: '',
        empCompList: []
      },
      list: [],
      contentOptions: [],
      widthOptions: [
        {
          label: '1/2',
          value: 12
        },
        {
          label: '1/3',
          value: 8
        },
        {
          label: '2/3',
          value: 16
        },
        {
          label: '1/4',
          value: 6
        },
        {
          label: '3/4',
          value: 18
        },
        {
          label: '100%',
          value: 24
        }
      ],
      rules: {
        blockType: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        empCompList: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        width: [
          {
            required: true,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight', 'dashboardRefresh'])
  },
  components: {
    Todo,
    Chart,
    Notice,
    Msg,
    ElDragSelect
  },
  mounted () {
    this.$dragging.$on('dragged', ({ value }) => {
      if (!this.isDragged) return
      // 拖拽后重新排序
      value.list.forEach((item, index) => {
        item.sortNo = index
      })
      request({
        url: '/api/sys/sysEmpBlock/sort',
        method: 'POST',
        data: {
          data: value.list,
          funcModule: '业务员区块',
          funcOperation: '排序'
        }
      }).then(response => {
        this.isDragged = true
      })
      this.isDragged = false
    })
    this.initData()
  },
  methods: {
    // 获取已有模块数据
    initData () {
      request({
        url: '/api/sys/sysEmpBlock/list',
        method: 'POST',
        data: {
          data: {},
          funcModule: '业务员区块',
          funcOperation: '查询'
        }
      })
        .then(response => {
          this.list = response.data
        })
        .catch(() => { })
    },
    blockTypeChange (val) {
      this.widthOptions.forEach(option => {
        if (val === 'todo' && option.value < 12) {
          option.disabled = true
        } else {
          option.disabled = false
        }
      })
      // 请求模块内容下拉数据
      this.form.empCompList = []
      request({
        url: '/api/dd/selectData/list',
        method: 'POST',
        data: {
          data: {
            type: 'TENANT_COMP',
            queryParams: {
              blockType: this.form.blockType
            }
          },
          funcModule: '租户组件',
          funcOperation: '查询'
        }
      }).then(response => {
        this.contentOptions = response.data
      })
    },
    // 保存
    onConfirm () {
      this.$refs.refForm.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.form)
          params.empCompList = []
          this.form.empCompList.forEach((compCode, sortNo) => {
            params.empCompList.push({
              sortNo,
              compCode
            })
          })
          this.loading = true
          request({
            url: '/api/sys/sysEmpBlock/save',
            method: 'POST',
            data: {
              data: params,
              funcModule: '业务员区块',
              funcOperation: '保存'
            }
          }).then(response => {
            this.loading = false
            this.addModuleVisible = false
            this.initData()
            this.form = { empCompList: [] }
            this.contentOptions = []
          })
        }
      })
    },
    cancle () {
      this.addModuleVisible = false
      this.form = { empCompList: [] }
      this.contentOptions = []
    }
  }
}
</script>

<style scoped lang='scss'>
.dashboard {
  width: 100%;
  margin-bottom: 10px;
  .dashboard_module {
    font-size: 14px;
    margin-bottom: 10px;
    .el-tabs {
      border: 1px solid #eaeefb;
      border-radius: 3px;
      box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.16);
      padding: 10px;
      background: #ffffff;
    }
  }
  .add_module {
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    margin: 20px auto;
    border: 2px dashed #666666;
    font-size: 32px;
    cursor: pointer;
  }
}
</style>
