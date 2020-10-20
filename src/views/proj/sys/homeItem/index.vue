<template>
  <div class="app-container calendar-list-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if='$route.name === $options.name'>
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'homeItem',
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
            itemName: '',
            usingFlag: ''
          },
          defaultSortString: 'usingFlag.desc,itemName.asc'
        },
        formData: [
          {
            label: 'projSys.homeItem.itemName',
            prop: 'itemName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'projSys.homeItem.usingFlag',
            prop: 'usingFlag',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/sys/stTblSysHomeItem/list',
          doDelete: '/api/sys/stTblSysHomeItem/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {},
            component: () => import('@/views/proj/sys/homeItem/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/sys/homeItem/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.id
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/proj/sys/homeItem/editForm.vue')
          }
        ],

        isColset: false,
        table: {
          id: '',
          cols: [
            {
              prop: 'itemId',
              label: 'projSys.homeItem.itemId'
            },
            {
              prop: 'itemName',
              label: 'projSys.homeItem.itemName'
            },
            {
              prop: 'itemNameEn',
              label: 'projSys.homeItem.itemNameEn'
            },
            {
              prop: 'rptUrl',
              label: 'projSys.homeItem.rptUrl'
            },
            {
              prop: 'rptRoute',
              label: 'projSys.homeItem.rptRoute'
            },
            {
              prop: 'itemWidth',
              label: 'projSys.homeItem.itemWidth'
            },
            {
              prop: 'itemHeight',
              label: 'projSys.homeItem.itemHeight'
            },
            {
              prop: 'usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'projSys.homeItem.usingFlag'
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
  }
}
</script>
