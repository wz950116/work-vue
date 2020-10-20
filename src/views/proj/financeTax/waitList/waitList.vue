<template>
  <div class="app-container tree-form-table">
    <!-- 内容 -->
    <div class="left-content">
      <div class="title">单据类型</div>
      <!-- <div class="buttons" v-if="treeTableData.form.isTopBar">
        <el-row type="flex">
          <div v-for="(btn, index) in treeTableData.form.topBar" :key="index">
            <el-button
              v-db-click
              size="mini"
              @click="triggerEvent(btn)"
              style="margin-right:3px;border:1px solid #aaaaaa;"
              v-permission="btn.permitName ? [...btn.permitName, btn.name] : [btn.name]"
            >
              <svg-icon :icon-class="btn.iconName || baseEvent[btn.name].iconName"></svg-icon>
              {{$t(btn.i18n) || $t(baseEvent[btn.name].i18n)}}
            </el-button>
          </div>
        </el-row>
      </div>-->
      <div class="tree-wrapper">
        <el-tree
          ref="tree"
          :data="treeData"
          :style="{height: treeHeight + 'px'}"
          :props="{
              children: 'billDtoList',
              label: 'name'
          }"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
    </div>
    <main class="right-content" v-show="table.url">
      <div class="top-operate">
        <el-row type="flex">
          <slot name="add"></slot>
          <slot name="upload"></slot>
          <div>
            <el-button v-db-click size="mini" @click="add" style="margin-right:3px;">
              <svg-icon icon-class="线性-新增"></svg-icon>生成凭证
            </el-button>
            <div style="display: inline-block; margin-right: 2px">
              <el-select
                v-model="searchFileds.data.isVoucher"
                style="width: 150px"
                size="mini"
                placeholder="是否已记账"
              >
                <el-option label="未记账" value="0"></el-option>
                <el-option label="已记账" value="1"></el-option>
              </el-select>
            </div>
            <div style="display: inline-block; margin-right: 2px">
              <el-input
                v-model="searchFileds.data.billNo"
                placeholder="单据号"
                style="width: 150px"
                size="mini"
              ></el-input>
            </div>
            <div style="display: inline-block; margin-right: 2px">
              <el-date-picker
                style="width: 150px!important"
                v-model="searchFileds.data.startDate"
                type="date"
                placeholder="开始日期"
                value-format="yyyyMMdd"
                size="mini"
                :picker-options="pickerOptions1"
              ></el-date-picker>
            </div>
            <div style="display: inline-block; margin-right: 2px">~</div>
            <div style="display: inline-block; margin-right: 2px">
              <el-date-picker
                style="width: 150px!important"
                v-model="searchFileds.data.endDate"
                type="date"
                placeholder="结束日期"
                value-format="yyyyMMdd"
                size="mini"
                :picker-options="pickerOptions2"
              ></el-date-picker>
            </div>

            <el-button v-db-click size="mini" @click="search" style="margin-right:3px;">
              <svg-icon icon-class="线性-刷新"></svg-icon>搜索
            </el-button>
          </div>
        </el-row>
      </div>
      <pagenationTable
        ref="pagenationTable"
        :table="table"
        :searchFileds="searchFileds"
        @rowClick="rowClick"
        v-model="ids"
      ></pagenationTable>
    </main>
    <el-dialog
      title="记账凭证"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        :inline="true"
        :rules="rules"
        ref="form"
        class="demo-form-inline"
        label-width="80px"
      >
        <el-form-item label="凭证类型">
          <el-select v-model="form.voucherType">
            <el-option label="记" value="1"></el-option>
            <el-option label="转" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="凭证日期">
          <el-date-picker v-model="form.voucherDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="凭证号">
          <el-input v-model="form.voucherNo" readonly></el-input>
        </el-form-item>
        <el-form-item label="附件张数" prop="annexNum">
          <el-input-number v-model="form.annexNum" :min="1" size="mini" :max="9999"></el-input-number>
        </el-form-item>
      </el-form>
      <pagenationTable ref="pagenationTable1" :table="table1"></pagenationTable>
      <el-form :model="form" :inline="true" class="demo-form-inline" label-width="65px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="单位">
              <el-input v-model="form.reservedStr1" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="机构">
              <el-input v-model="form.reservedStr2" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="部门">
              <el-input v-model="form.reservedStr3" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职员">
              <el-input v-model="form.reservedStr4" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="单据号">
              <el-input v-model="form.pzBillNo" readonly></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="结算方式">
              <el-input v-model="form.reservedStr5" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结算日期">
              <el-input v-model="form.reservedStr6" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="数量">
              <el-input v-model="form.reservedNum1" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="币种">
              <el-input v-model="form.reservedStr7" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="汇率">
              <el-input v-model="form.reservedNum2" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="save" size="mini">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagenationTable from '@/components/frame/qm/template/PagenationTable'
import request from '@/utils/frame/base/request'
export default {
    data() {
        return {
            pickerOptions1: {
                disabledDate: time => {
                    let str = this.searchFileds.data.endDate
                    if (str) {
                        let arr = str.split('')
                        arr.splice(4, 0, '-')
                        arr.splice(7, 0, '-')
                        str = arr.join('')
                        return time.getTime() > new Date(str).getTime()
                    } else {
                        return false
                    }
                }
            },
            pickerOptions2: {
                disabledDate: time => {
                    let str = this.searchFileds.data.startDate
                    if (str) {
                        let arr = str.split('')
                        arr.splice(4, 0, '-')
                        arr.splice(7, 0, '-')
                        str = arr.join('')
                        return time.getTime() < new Date(str).getTime()
                    } else {
                        return false
                    }
                }
            },
            rules: {
                annexNum: [
                    {
                        required: true
                    }
                ]
            },
            form1: {},
            ids: [],
            title: '',
            form: {},
            dialogVisible: false,
            searchFileds: {
                data: {
                    billCode: '',
                    accountId: '',
                    startDate: '',
                    endDate: ''
                },
                funcModule: '生成财务凭证',
                funcOperation: '查询'
            },
            table: {
                // url: '/api/finance/entry/list',
                method: 'post',
                tableHeight: window.innerHeight - 168,
                thead: [
                    {
                        prop: 'billNo',
                        label: '单据号',
                        width: 160
                    },
                    {
                        prop: 'billDate',
                        label: '单据日期',
                        width: 100,
                        formatter(row) {
                            let str = row.billDate
                            if (str) {
                                let arr = str.split('')
                                arr.splice(4, 0, '-')
                                arr.splice(7, 0, '-')
                                str = arr.join('')
                            }
                            return str
                        }
                    },
                    {
                        prop: 'voucherNo',
                        label: '凭证号',
                        width: 100
                    },
                    {
                        prop: 'voucherDate',
                        label: '凭证日期',
                        width: 100
                    },
                    {
                        prop: 'customer',
                        label: '往来单位',
                        width: 100
                    },
                    {
                        prop: 'currency',
                        label: '币种',
                        width: 100
                    },
                    {
                        prop: 'amount',
                        label: '含税金额',
                        width: 100
                    },
                    {
                        prop: 'bizOrganName',
                        label: '业务机构名称',
                        width: 120
                    },
                    {
                        prop: 'bizDeptName',
                        label: '业务部门名称',
                        width: 120
                    },
                    {
                        prop: 'bizEmployeeName',
                        label: '业务员名称',
                        width: 110
                    },
                    {
                        prop: 'optEmployeeName',
                        label: '操作员名称',
                        width: 110
                    },
                    {
                        prop: 'createDate',
                        label: '制单日期',
                        width: 100
                    },
                    {
                        prop: 'remark',
                        label: '备注'
                    }
                ]
            },
            table1: {
                // url: '/api/finance/entry/list',
                method: 'post',
                hidePage: true,
                tableData: [],
                show_summary: true,
                summaryMethod({ data }) {
                    return [
                        `合计（${data.length}条）`,
                        '',
                        '',
                        eval(data.map(ele => ele.debit).join('+')),
                        eval(data.map(ele => ele.lender).join('+'))
                    ]
                },
                thead: [
                    {
                        prop: 'remark',
                        label: '摘要'
                    },
                    {
                        prop: 'subjectCode',
                        label: '科目代码'
                    },
                    {
                        prop: 'subjectName',
                        label: '科目名称'
                    },
                    {
                        prop: 'debit',
                        label: '借方'
                    },
                    {
                        prop: 'lender',
                        label: '贷方'
                    }
                ]
            },
            treeData: [],
            loading: false
        }
    },
    created() {
        request
            .post('/api/finance/account/treeList', {
                ...{
                    funcModule: '生成财务凭证',
                    funcOperation: '查询树'
                }
            })
            .then(res => {
                this.treeData = res.data
            })
    },
    watch: {
        dialogVisible(bol) {
            if (bol && this.$refs.form) {
                this.$nextTick(() => {
                    this.$refs.form.clearValidate()
                })
            }
        }
    },
    methods: {
        search() {
            this.$refs.pagenationTable.getList()
        },
        save() {
            this.$refs.form.validate(bol => {
                bol &&
                    request
                        .post('/api/finance/voucher/save', {
                            data: {
                                ...this.searchFileds.data,
                                ...this.form,
                                pzBillNo: this.table1.tableData[0].pzBillNo
                            },
                            ...{
                                funcModule: '生成财务凭证',
                                funcOperation: '新增'
                            }
                        })
                        .then(res => {
                            this.$notify({
                                type: 'success',
                                title: '提示',
                                message: '新增成功'
                            })
                            this.$refs.pagenationTable.getList()
                            this.dialogVisible = false
                        })
            })
        },
        rowClick(row) {
            this.item = row
        },
        add() {
            if (this.item) {
                request
                    .post('/api/finance/voucher/initVoucher', {
                        data: {
                            ...this.searchFileds.data,
                            pzBillNo: this.item.billNo
                        },
                        ...{
                            funcModule: '生成财务凭证',
                            funcOperation: '查询详情'
                        }
                    })
                    .then(res => {
                        res.data.voucherType = '1'
                        this.form = res.data
                        this.table1.tableData = res.data.mxDtoList
                        this.dialogVisible = true
                    })
            } else {
                this.$notify({
                    type: 'error',
                    title: '提示',
                    message: '请选择一条数据'
                })
            }
        },
        handleNodeClick(data, node) {
            if (node.level != 2) {
                return
            }
            this.$set(this.table, 'url', '/api/finance/voucher/billPage')
            this.searchFileds.data.billCode = data.id
            this.searchFileds.data.accountId = data.accountId
            this.$nextTick(() => {
                this.$refs.pagenationTable.getList()
            })
        }
    },
    computed: {
        treeHeight() {
            return window.innerHeight - 136
        }
    },
    components: {
        pagenationTable
    }
}
</script>
<style scoped lang='scss'>
.tree-form-table {
    display: flex;
    .left-content {
        width: 200px;
        min-width: 200px;
        border: 1px solid #aaaaaa;
        border-radius: 5px 5px 0 0;
        margin-right: 3px;
        background: #ffffff;
        .title {
            height: 30px;
            line-height: 30px;
            text-indent: 10px;
            background: #e2e9f4;
            border-bottom: 1px solid #aaaaaa;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .buttons {
            padding: 5px;
            border-bottom: 1px solid #aaaaaa;
            background: #e2e2e2;
            overflow-x: auto;
            .el-row {
                .el-button {
                    padding: 6px 8px;
                }
            }
        }
        .tree-wrapper {
            overflow-x: auto;
            .el-tree {
                padding: 10px 10px 5px;
                overflow: auto;
                min-width: 100%;
                display: inline-block !important;
            }
        }
    }
    .right-content {
        flex: 1;
        min-width: 954px;
    }
}
</style>
<style lang='scss'>
.demo-form-inline {
    .el-input-number__decrease,
    .el-input-number__increase {
        display: none !important;
        height: 23px;
        border-bottom: 1px solid #ddd;
    }
}
</style>