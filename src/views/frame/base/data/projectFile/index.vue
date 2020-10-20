<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'>
        <!-- isException 此列特殊处理-->
        <template slot='isException' slot-scope='scope'>
          <el-tag size="mini" v-if="scope.row.isException==='1'" type="danger">{{$t('sys.log.fail')}}</el-tag>
          <el-tag size="mini" v-else type="success">{{$t('sys.log.success')}}</el-tag>
        </template>
      </qm-table>
    </template>
  </div>
</template>
<script>
import request from '@/utils/frame/base/request'
// 提醒
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
export default {
  name: 'projectFile',
  data() {
    return {
      dialogVisibleSp: false,
      // moduleCode: this.$route.meta.bpmModule,
      isShow: true,
      bpmProcessDefineKey: 'CTRMApproveProject',
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            projectName: '',
            projectCode: '',
            usingFlag: ''
          },
          defaultSortString: 'usingFlag.desc,createDate.desc'
        },
        formData: [
          {
            label: 'dataHq.projectFile.projectFileName',
            prop: 'projectName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.projectFile.projectFileCode',
            prop: 'projectCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.projectFile.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/dd/project/list',
          doDelete: '/api/dd/project/remove',
          doRetrial: '/api/dd/project/cancelAudit'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {},
            component: () => import('@/views/frame/base/data/projectFile/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            validateApi(row) {
              return {
                url: '/api/dd/project/checkAudit', // 接口
                data: this.$refs.qmTable.currentRow.projectCode // 参数
              }
            },
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/data/projectFile/edit.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            validateApi(row) {
              return {
                url: '/api/dd/project/checkAudit', // 接口
                data: this.$refs.qmTable.currentRow.projectCode // 参数
              }
            },
            getParam() {
              return this.$refs.qmTable.currentRow.projectCode
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return {
                row: this.$refs.qmTable.currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: this.$refs.qmTable.currentRow.projectCode // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: '考核主体: ' + this.$refs.qmTable.currentRow.projectCode // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'auditStatus',
              width: '100',
              format: {
                dict: this.$t('datadict.auditStatus')
              },
              label: 'dataHq.projectFile.projectStat'
            },
            {
              prop: 'projectName',
              label: 'dataHq.projectFile.projectFileName'
            },
            {
              prop: 'projectCode',
              label: 'dataHq.projectFile.projectFileCode'
            },
            {
              prop: 'usingFlag',
              width: '100',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'dataHq.projectFile.usingFlag'
            },
            {
              prop: 'remark',
              label: 'dataHq.projectFile.remark'
            }
          ]
        },

        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        }
      }
    }
  },
  methods: {
    // 关闭弹窗回调
    closeHandler(isSubmit, params) {
      this.dialogVisibleSp = false
      this.loading = true
      const nextUserObj = {
        bpmVariableParamList: params,
        id: this.id
      }
      if (isSubmit) {
        request({
          url: this.mainData.api.doSubmit,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.submit'),
            data: nextUserObj
          }
        })
          .then(response => {
            this.loading = false
            this.$notify(notifySuccess({ msg: this.$t('biz.msg.submitSuccess') }))
            this.$refs.qmTable.getList()
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.loading = false
        this.$refs.qmTable.getList()
      }
    }
  }
}
</script>

