<template>
  <div class="app-container tree-form-table">
    <!-- 内容 -->
    <div class="left-content">
      <div class="title">分录</div>
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
              <svg-icon icon-class="线性-新增"></svg-icon>新增
            </el-button>
            <el-button v-db-click size="mini" @click="edit" style="margin-right:3px;">
              <svg-icon icon-class="线性-修改"></svg-icon>修改
            </el-button>
            <el-button v-db-click size="mini" @click="del" style="margin-right:3px;">
              <svg-icon icon-class="线性-删除"></svg-icon>删除
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
      :title="title"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      custom-class="demo-form-inline"
    >
      <el-form :model="form" :rules="rules" :inline="true" ref="form" label-width="80px">
        <el-form-item label="科目编码" prop="subjectCode">
          <el-input v-model="form.subjectCode"></el-input>
        </el-form-item>
        <el-form-item label="科目名称" prop="subjectName">
          <el-input v-model="form.subjectName"></el-input>
        </el-form-item>
        <el-form-item label="余额方向" prop="toLoan" style="width: 250px">
          <el-radio-group v-model="form.toLoan">
            <el-radio label="J">借</el-radio>
            <el-radio label="D">贷</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分录状态" prop="state" style="width: 250px">
          <el-radio-group v-model="form.state">
            <el-radio label="1">启用</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="序号" prop="num">
          <el-input-number size="mini" v-model="form.num" :min="1" :max="9999"></el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark"></el-input>
        </el-form-item>
        <div style="margin: 20px 0 10px 0px">
          查询示例：SELECT
          <span style="color: red">金额,科目代码,科目名称,摘要,</span>往来单位,机构,部门,职员,结算方式,单号,日期,数量,币种,汇率 FROM 单据表 WHERE 单据号=?
          <p>（注：红色字段为必查项，其余可用’’填充或,隔开，租户代码值请用:tenant，如TENANT_CODE=:tenant）</p>
        </div>
        <el-form-item prop="dbSql" style="margin-top: 65px">
          <el-input v-model="form.dbSql" type="textarea" :autosize="{ minRows: 8, maxRows: 8}"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 75px">
          <el-button @click="checkSql" size="mini">检验Sql</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="sure" size="mini">确 定</el-button>
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
            rules: {
                num: [
                    {
                        required: true,
                        message: '序号不能为空'
                    }
                ],
                subjectCode: [
                    {
                        required: true,
                        message: '科目编码不能为空'
                    }
                ],
                subjectName: [
                    {
                        required: true,
                        message: '科目名称不能为空'
                    }
                ],
                toLoan: [
                    {
                        required: true,
                        message: '请选择余额方向'
                    }
                ],
                dbSql: [
                    {
                        required: true,
                        message: 'SQL不能为空'
                    }
                ]
            },

            ids: [],
            title: '',
            form: {},
            dialogVisible: false,
            searchFileds: {
                data: {
                    billCode: '',
                    accountId: ''
                }
            },
            table: {
                // url: '/api/finance/entry/list',
                hidePage: true,
                method: 'post',
                tableHeight: window.innerHeight - 131,
                thead: [
                    {
                        type: 'selection'
                    },
                    {
                        prop: 'subjectCode',
                        label: '凭证科目代码'
                    },
                    {
                        prop: 'subjectName',
                        label: '凭证科目'
                    },
                    {
                        prop: 'toLoan',
                        label: '借/贷',
                        formatter(row) {
                            const obj = {
                                J: '借',
                                D: '贷'
                            }
                            return obj[row.toLoan]
                        }
                    },
                    {
                        prop: 'state',
                        label: '状态',
                        formatter(row) {
                            return row.state ? '启用' : '停用'
                        }
                    },
                    {
                        prop: 'num',
                        label: '排序'
                    },
                    {
                        prop: 'remark',
                        label: '备注'
                    }
                ]
            },
            treeData: [],
            loading: false
        }
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
    created() {
        request
            .post('/api/finance/account/treeList', {
                funcModule: '财务凭证分录设置',
                funcOperation: '查询树'
            })
            .then(res => {
                this.treeData = res.data
            })
    },
    methods: {
        del() {
            if (this.ids.length) {
                this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    request
                        .post('/api/finance/entry/remove', {
                            data: this.ids.map(ele => ele.id).join(','),
                            ...{
                                funcModule: '财务凭证分录设置',
                                funcOperation: '删除'
                            }
                        })
                        .then(() => {
                            this.$notify({
                                type: 'success',
                                title: '提示',
                                message: '删除成功'
                            })
                            this.$refs.pagenationTable.getList()
                        })
                })
            } else {
                this.$notify({
                    type: 'error',
                    title: '提示',
                    message: '请至少选择一条数据'
                })
            }
        },
        rowClick(row) {
            this.item = row
        },
        edit() {
            if (this.item) {
                this.title = '编辑分录'
                this.form = this.item
                this.dialogVisible = true
            } else {
                this.$notify({
                    type: 'error',
                    title: '提示',
                    message: '请选择一条数据'
                })
            }
        },
        checkSql() {
            this.$refs.form.validateField('dbSql', err => {
                if (err) {
                    return
                } else {
                    request
                        .post('/api/finance/entry/checkSql', {
                            data: this.form.dbSql,
                            ...{
                                funcModule: '财务凭证分录设置',
                                funcOperation: '检验Sql'
                            }
                        })
                        .then(res => {
                            this.$notify({
                                type: 'success',
                                title: '提示',
                                message: '检验通过'
                            })
                        })
                }
            })
        },
        sure() {
            this.$refs.form.validate(bol => {
                bol &&
                    request
                        .post(
                            `/api/finance/entry/${
                                this.title == '新增分录' ? 'save' : 'update'
                            }`,
                            {
                                data: {
                                    ...this.searchFileds.data,
                                    ...this.form
                                },
                                ...{
                                    funcModule: '财务凭证分录设置',
                                    funcOperation:
                                        this.title == '新增分录'
                                            ? '新增'
                                            : '编辑'
                                }
                            }
                        )
                        .then(res => {
                            this.$notify({
                                type: 'success',
                                title: '提示',
                                message: '操作成功'
                            })
                            this.dialogVisible = false
                            this.$refs.pagenationTable.getList()
                        })
            })
        },
        add() {
            this.title = '新增分录'
            this.form = {
                state: '1'
            }
            this.dialogVisible = true
        },
        handleNodeClick(data, node) {
            // eslint-disable-next-line eqeqeq
            if (node.level != 2) {
                return
            }
            this.table.url = '/api/finance/entry/list'
            this.searchFileds = {
                data: {
                    billCode: data.id,
                    accountId: data.accountId
                },
                funcModule: '财务凭证分录设置',
                funcOperation: '查询'
            }
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
