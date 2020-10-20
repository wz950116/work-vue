<template>
  <div class="app-container calendar-list-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'sysNotice',
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
            noticeDate: ''
          },
          defaultSortString: 'topFlag.desc,noticeDate.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'sys.notice.form.noticeDate',
            align: 'noticeDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          }
        ]
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/sys/sysNotice/page',
          doDelete: '/api/sys/sysNotice/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            component: () => import('@/views/frame/base/sys/notice/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/sys/notice/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/base/sys/notice/editForm.vue')
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'noticeTitle',
              label: 'sys.notice.list.noticeTitle',
              width: '200'
            },
            {
              prop: 'noticeDate',
              label: 'sys.notice.list.noticeDate',
              width: '120',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'topFlag',
              label: 'sys.notice.list.topFlag',
              width: '100',
              format: {
                dict: this.$t('datadict.yesNo')
              }
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
  methods: {}
}
</script>
