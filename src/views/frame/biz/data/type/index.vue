<template>
  <div class="app-container calendar-list-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'type',
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
            typeName: '',
            usingFlag: ''
          },
          defaultSortString: 'typeCode.asc'
        },
        formData: [
          {
            label: 'dataHq.type.form.groupCode',
            prop: 'groupCode',
            element: 'base-select',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              data: 'DD_TYPE_GROUP',
              clearable: true
            }
          },
          {
            label: 'dataHq.type.form.typeName',
            prop: 'typeName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.type.form.typeCode',
            prop: 'typeCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'dataHq.type.form.usingFlag',
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
        initSearch: true,
        api: {
          search: '/api/dd/type/list',
          doDelete: '/api/dd/type/remove'
        },

        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              // TODO //return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/biz/data/type/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/biz/data/type/editForm.vue')
          },
          {
            name: 'remove',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow.typeCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            $refs: this.$refs,
            getParam() {
              return this.$refs.qmTable.currentRow
            },
            component: () => import('@/views/frame/biz/data/type/editForm.vue')
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
              prop: 'groupName',
              label: 'dataHq.type.list.groupName'
            },
            {
              prop: 'typeName',
              label: 'dataHq.type.list.typeName'
            },
            {
              prop: 'typeCode',
              label: 'dataHq.type.list.typeCode'
            },
            {
              prop: 'usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'dataHq.type.list.usingFlag'
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
