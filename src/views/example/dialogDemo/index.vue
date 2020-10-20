<template>
  <div style='padding:50px;'>
    <el-row>
      <el-col :span='4'>
        <el-button @click='dialogVisible = true'>iframe查询</el-button>
      </el-col>
      <el-col :span='4'>
        <el-button @click='dialogVisible2 = true'>简单弹窗</el-button>
      </el-col>
      <el-col :span='4'>
        <el-button @click='dialogVisible3 = true'>合并列表</el-button>
      </el-col>
      <el-col :span='4'>
        <el-button @click='dialogVisible4 = true'>查询列表</el-button>
      </el-col>
      <el-col :span='4'>
        <el-button @click='dialogVisible5 = true'>树状列表</el-button>
      </el-col>
    </el-row>
    <!-- 弹窗 -->
    <iframe-search v-if='dialogVisible' @closeHandler='dialogHandler'></iframe-search>
    <edit-form-col v-if='dialogVisible2' @closeHandler='dialogHandler2'></edit-form-col>
    <edit-array-table v-if='dialogVisible3' @closeHandler='dialogHandler3'></edit-array-table>
    <edit-form-table v-if='dialogVisible4' @closeHandler='dialogHandler4'></edit-form-table>
    <edit-form-table-tree v-if='dialogVisible5' @closeHandler='dialogHandler5'></edit-form-table-tree>
  </div>
</template>

<script>
import iframeSearch from './edit'
import editFormCol from './edit2'
import editArrayTable from './edit3'
import editFormTable from './edit4'
import editFormTableTree from './edit5'
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false
    }
  },
  components: {
    iframeSearch,
    editFormCol,
    editArrayTable,
    editFormTable,
    editFormTableTree
  },
  methods: {
    // 关闭定价信息弹窗回调
    dialogHandler(params) {
      this.dialogVisible = false
    },
    dialogHandler2(params) {
      this.dialogVisible2 = false
    },
    dialogHandler3(params) {
      this.dialogVisible3 = false
    },
    dialogHandler4(params) {
      this.dialogVisible4 = false
    },
    dialogHandler5(params) {
      this.dialogVisible5 = false
    }
  }
}
</script>
