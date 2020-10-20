<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'>
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
  name: 'haveTodo',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            toDoDate: ''
          },
          camelToUnderlineFlg: false,
          defaultSortString: 'endTime.desc'
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
          search: '/api/bpm/backlog/listHaveFinished',
          reverse: '/api/bpm/backlog/reverseTask'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'reverse',
            iconName: '线性-关闭',
            i18n: '退审',
            event: this.reverse
          },
          {
            name: 'view',
            allowDblClick: true,
            event: this.view
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            getParam(currentRow) {
              return {
                row: currentRow,
                opType: 'history',
                moduleCode: currentRow.moduleCode,
                uk: currentRow.uk, // 变量值
                id: currentRow.id
              }
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'endTime',
              width: '150',
              label: 'bpm.haveTodo.list.endTime'
            },
            {
              prop: 'businessName',
              width: '220',
              label: 'bpm.haveTodo.list.businessName'
            },
            {
              prop: 'pendingContent',
              width: '220',
              label: 'bpm.haveTodo.list.pendingContent'
            },
            {
              prop: 'pendingDesp',
              isSlot: true,
              label: 'bpm.haveTodo.list.pendingDesp',
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
    // 退审
    reverse() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      } else {
        request({
          url: this.$refs.qmTable.mainData.api.reverse,
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: { id: row.id }
          }
        })
          .then(response => {
            if (response.data) {
              this.$notify(
                notifySuccess({
                  msg: this.$t('biz.msg.submitSuccess')
                })
              )
            }
          })
          .catch(() => {})
      }
    },
    view() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(
          notifyError({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
      } else {
        if (row.bpmComponent) {
          this.$refs.qmTable.opType = 'view'
          this.goApproveRoute(row)
        }
      }
    },
    goApproveRoute(param) {
      param.opType = this.$refs.qmTable.opType
      param.back = param.back ? param.back : 'haveTodo'
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
