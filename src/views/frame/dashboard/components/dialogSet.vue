<template>
  <div class='more'>
    <el-dropdown trigger="click" @command="handleCommand">
      <i class='el-icon-more-outline'></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-refresh-right" command="refresh">刷新</el-dropdown-item>
        <el-dropdown-item icon="el-icon-setting" command="set">设置</el-dropdown-item>
        <el-dropdown-item icon="el-icon-close" command='remove'>移除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog append-to-body v-el-drag-dialog title="模块设置" :visible.sync="dialogFormVisible" :width="block.blockType === 'todo' ? '80%' : '40%'">
      <el-form ref="refForm" :model="blockInfo" :rules='rules'>
        <el-form-item label="模块宽度" prop='width'>
          <el-select v-model="blockInfo.width" placeholder="">
            <el-option v-for='option in widthOptions' :label="option.label" :value="option.value" :key="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模块内容" prop='empCompList'>
          <el-drag-select v-model="blockInfo.empCompList" multiple placeholder="">
            <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-drag-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogFormVisible = false">取 消</el-button>
        <el-button size='mini' type="primary" :loading='loading' @click="onConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import ElDragSelect from '@/components/frame/DragSelect'
import { notifySuccess, confirmTip } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      loading: false,
      dialogFormVisible: false,
      blockInfo: {
        width: '',
        empCompList: []
      },
      options: [],
      widthOptions: [
        {
          label: '1/2',
          value: '12',
          disabled: this.block.blockType === 'chart'
        },
        {
          label: '1/3',
          value: '8',
          disabled:
            this.block.blockType === 'todo' || this.block.blockType === 'chart'
        },
        {
          label: '2/3',
          value: '16'
        },
        {
          label: '1/4',
          value: '6',
          disabled:
            this.block.blockType === 'todo' || this.block.blockType === 'chart'
        },
        {
          label: '3/4',
          value: '18'
        },
        {
          label: '100%',
          value: '24'
        }
      ],
      rules: {
        width: [
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
        ]
      }
    }
  },
  components: {
    ElDragSelect
  },
  props: {
    block: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'set') {
        // 置空
        this.blockInfo = {
          width: '',
          empCompList: []
        }
        this.dialogFormVisible = true
        // 请求当前模块数据
        request({
          url: '/api/sys/sysEmpBlock/get',
          method: 'POST',
          data: {
            data: this.block.blockCode,
            funcModule: '业务员组件',
            funcOperation: '查询'
          }
        }).then(response => {
          if (response.data) {
            this.blockInfo = response.data
            this.blockInfo.empCompList = this.blockInfo.empCompList.map(
              v => v.compCode
            )
          }
        })

        // 请求模块内容下拉数据
        request({
          url: '/api/dd/selectData/list',
          method: 'POST',
          data: {
            data: {
              type: 'TENANT_COMP',
              queryParams: {
                blockType: this.block.blockType
              }
            },
            funcModule: '业务员区块',
            funcOperation: '查询单个'
          }
        }).then(response => {
          this.options = response.data
        })
      } else if (command === 'remove') {
        confirmTip(this, 'confirmDelete')
          .then(() => {
            request({
              url: '/api/sys/sysEmpBlock/remove',
              method: 'POST',
              data: {
                data: this.block.blockCode,
                funcModule: '业务员区块',
                funcOperation: '删除'
              }
            }).then(response => {
              this.$notify(
                notifySuccess({ msg: this.$t('biz.msg.deleteSuccess') })
              )
              this.$emit('refreshList')
            })
          })
          .catch(() => {})
      } else if (command === 'refresh') {
        this.$emit('changeBlock')
      }
    },
    onConfirm() {
      this.$refs.refForm.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.blockInfo)
          params.empCompList = []
          this.blockInfo.empCompList.forEach((compCode, sortNo) => {
            params.empCompList.push({
              sortNo,
              compCode,
              blockCode: this.block.blockCode,
              blockType: this.block.blockType
            })
          })
          confirmTip(this, 'confirmSave')
            .then(() => {
              this.loading = true
              request({
                url: '/api/sys/sysEmpBlock/update',
                method: 'POST',
                data: {
                  data: params,
                  funcModule: '业务员区块',
                  funcOperation: '更新'
                }
              }).then(response => {
                this.loading = false
                this.dialogFormVisible = false
                // 刷新内容
                this.$emit('changeBlock')
                // 修改宽度
                this.$emit('refreshList')
              })
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>

<style scoped>
.more {
  float: right;
  margin-right: 10px;
  font-size: 18px;
  cursor: pointer;
}
</style>
