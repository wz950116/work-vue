<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData">
        <template slot="pendingDesp" slot-scope="scope">
          <span v-if="scope.row.businessType === '2'">{{scope.row.todoThat}}</span>
          <span v-else-if="scope.row.businessType === '1'">
            <span v-if="scope.row.todoThat">{{scope.row.todoThat}}；</span>
            {{$t('office.todo.tableName.submitter')}}：{{scope.row.submitter}}
          </span>
          <span v-else>
            <span v-if="scope.row.todoThat">{{scope.row.todoThat}}；</span>
            {{$t('office.todo.tableName.submitter')}}：{{scope.row.submitter}}；{{$t('office.todo.tableName.assistMsg')}}：{{scope.row.assistMsg}}
          </span>
        </template>
      </qm-table>
    </template>
  </div>
</template>
<script>
// axios访问
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'

export default {
  name: 'todo',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {},
          camelToUnderlineFlg: false,
          defaultSortString: 'startTime.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'bpm.haveTodo.form.toDoDate',
            props: ['toDoDateStart', 'toDoDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            },
            default: this.$toolUtil.getLatestMonth()
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/bpm/backlog/listExtWithReceive',
          claimTask: '/api/bpm/task/claimTask',
          getUserTaskNodeInfo: '/api/bpm/task/getUserTaskNodeInfo'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'process',
            iconName: '线性-处理',
            i18n: '处理',
            event: this.process
          },
          {
            name: 'refresh'
          },
          {
            name: 'view',
            type: 'route',
            allowDblClick: true,
            routeInfo(param) {
              param.opType = 'view'
              param.back = param.back ? param.back : 'todo'
              const componentName = param.bpmComponent
              const routeOption = {
                name: componentName,
                params: param
              }
              return routeOption
            }
          }
        ],
        initSearch: true,
        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'startTime',
              width: '150',
              align: 'center',
              label: 'bpm.todo.list.startTime'
            },
            {
              prop: 'businessName',
              width: '220',
              label: 'bpm.todo.list.businessName'
            },
            {
              prop: 'pendingContent',
              width: '220',
              label: 'bpm.todo.list.pendingContent'
            },
            {
              prop: 'pendingDesp',
              isSlot: true,
              label: 'bpm.todo.list.pendingDesp',
              sortable: false
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
  mounted() {},
  methods: {
    // 待办领取之后跳转页面
    toReceive(row) {
      if (row.bpmComponent) {
        this.$refs.qmTable.opType = 'audit' // 普通
        this.goApproveRoute(row)
      }
    },
    // 待办领取处理
    receive(row) {
      this.taskId = row.id
      request({
        url: this.mainData.api.claimTask,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.claim'),
          data: {
            assignee: '', // 当前账号
            taskId: row.id // 任务ID
          }
        }
      })
        .then(response => {
          if (response.data) {
            this.$notify(
              notifySuccess({
                msg: this.$t('biz.msg.claimTaskSuccess')
              })
            )
          }
          this.toReceive(row)
        })
        .catch(() => {})
    },
    // 处理行
    process() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      } else if (row.taskStatusType === '1') {
        this.receive(row)
      } else {
        if (row.bpmComponent) {
          if (row.assistId) {
            this.$refs.qmTable.opType = 'assist' // 协助
          } else {
            this.$refs.qmTable.opType = 'audit' // 普通
          }
          this.goApproveRoute(row)
        }
      }
    },
    goApproveRoute(param) {
      param.opType = this.$refs.qmTable.opType
      param.back = param.back ? param.back : 'todo'
      const componentName = param.bpmComponent
      const routeOption = {
        name: componentName,
        params: param
      }
      this.$router.push(routeOption)
    }
  }
}
</script>
