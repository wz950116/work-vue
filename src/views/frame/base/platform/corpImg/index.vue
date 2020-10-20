<template>
  <div class="app-container">

    <qm-form ref='qmForm' :form='form'></qm-form>

    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <!--     <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)"> -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>

    <!-- </template> -->

  </div>
</template>

<script>
import { notifySuccess, confirmTip } from '@/utils/frame/base/notifyParams'
// axios访问
import request from '@/utils/frame/base/request'
export default {
  name: 'corpImgAuditManage',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          camelToUnderlineFlg: true,
          defaultSortString: 'createDate.desc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            name: '',
            usingFlag: ''
          }
        },

        formData: [
          {
            label: 'sys.corpImg.tenantName',
            prop: 'tenantName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.corpImg.imageName',
            prop: 'imageName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'sys.corpImg.showSite',
            prop: 'showSite',
            element: 'base-select',
            list: this.$t('datadict.imgShowSite'),
            attrs: {
              clearable: false
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: false
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/platform/corpImg/page'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'update',
            type: 'dialog',
            opType: 'audit',
            permitName: ['audit'],
            i18n: 'biz.btn.audit',
            iconName: '线性-审核',
            msg: '审批状态是审核中的才可以进行审核',
            validate: currentRow => {
              const flg = currentRow && currentRow.auditStatus === '2'
              return flg
            },
            getParam: currentRow => {
              return { id: currentRow.id, tenantCode: currentRow.tenantCode }
            },
            component: () => import('./edit.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            opType: 'view',
            getParam: currentRow => {
              return { id: currentRow.id, tenantCode: currentRow.tenantCode }
            },
            component: () => import('./edit.vue')
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          sortable: 'custom',
          id: this.$route.meta.title,
          cols: [
            {
              prop: 'imageName',
              width: '200',
              label: 'sys.corpImg.imageName'
            },
            {
              prop: 'showSite',
              width: '150',
              label: 'sys.corpImg.showSite',
              format: {
                dict: this.$t('datadict.imgShowSite')
              }
            },
            {
              prop: 'auditStatus',
              width: '120',
              label: 'biz.lbl.auditStatus',
              align: 'center',
              format: {
                dict: this.$t('datadict.auditStatus')
              }
            },
            {
              prop: 'tenantName',
              width: '120',
              label: 'sys.corpImg.tenantName'
            },
            {
              prop: 'usingFlag',
              align: 'center',
              width: '80',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              prop: 'remark',
              sortable: false,
              'min-width': '300',
              label: 'biz.lbl.remark'
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
  components: {},
  methods: {}
}
</script>

