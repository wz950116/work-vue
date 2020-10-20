<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>

    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>

<script>
export default {
  name: 'port',
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
          defaultSortString: 'portCode.desc'
        },
        formData: [
          {
            label: 'data.port.portName',
            prop: 'portName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.port.usingFlag',
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
          search: '/api/data/ddPort/list',
          doDelete: '/api/data/ddPort/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/base/data/port/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.portCode
            },
            component: () => import('@/views/frame/base/data/port/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.portCode
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.portCode
            },
            component: () => import('@/views/frame/base/data/port/editForm.vue')
          },
          {
            name: 'export'
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
              prop: 'portCode',
              width: '120',
              label: 'data.port.portCode'
            },
            {
              prop: 'portName',
              width: '120',
              label: 'data.port.portName'
            },
            {
              prop: 'enPortName',
              width: '120',
              label: 'data.port.enPortName'
            },
            {
              prop: 'areaName',
              width: '120',
              label: 'data.port.areaCode'
            },
            {
              prop: 'usingFlag',
              width: '100',
              label: 'data.port.usingFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
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
  }
}
</script>
