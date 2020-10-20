<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
// 调用Vue全局过滤器
import Vue from 'vue'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'approvalGroup',
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
          defaultSortString: 'code.asc'
        },

        formData: [
          {
            prop: 'name',
            label: 'func.approvalGroup.list.name',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
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
          search: '/api/func/auditGroup/list',
          doDelete: '/api/func/auditGroup/remove'
        },
        apiData: {
          search(param) {
            return param.id
          },
          delete(param) {
            return param.id
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/func/approvalGroup/edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/func/approvalGroup/edit.vue')
          },
          {
            name: 'detailSet',
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow
            },
            event: this.doEditEmployee
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
              prop: 'name',
              width: '220',
              label: 'func.approvalGroup.list.name'
            },
            {
              prop: 'usingFlag',
              width: '100',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'func.approvalGroup.list.usingFlag'
            },
            {
              prop: 'remark',
              width: '360',
              sortable:false,
              label: 'func.approvalGroup.list.remark'
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
  mounted() {
    // 初始化数据
    this.$refs.qmTable.getList()
  },
  methods: {
    doEditEmployee() {
      if (!this.$refs.qmTable.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      Vue.component('view-form-table', () => import('@/views/frame/base/func/approvalGroup/editEmployee.vue'))
      const row = this.$refs.qmTable.currentRow
      this.$refs.qmTable.param = row
      this.$refs.qmTable.param.groupCode = row.code

      this.$refs.qmTable.opType = 'detailSet'
      this.$refs.qmTable.opMode = 'dialog'
      this.$refs.qmTable.dialogDetailVisible = true
    }
  }
}
</script>
