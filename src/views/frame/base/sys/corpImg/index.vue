<template>
  <div class="app-container">

    <qm-form ref='qmForm' :form='form'></qm-form>

    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <!-- <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)"> -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>

    <!-- </template> -->

  </div>
</template>

<script>
import { notifySuccess, confirmTip } from '@/utils/frame/base/notifyParams'
// axios访问
import request from '@/utils/frame/base/request'
export default {
  name: 'corpImgSubmitManage',
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
          search: '/api/platform/corpImg/page',
          doDelete: '/api/platform/corpImg/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            $refs: this.$refs,
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            $refs: this.$refs,
            msg: '审批状态是审核中和已通过的不可以修改',
            validate: currentRow => {
              const flg = currentRow && (currentRow.auditStatus === '1' || currentRow.auditStatus === '4')
              return flg
            },
            getParam() {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('./edit.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            getParam: () => {
              return this.$refs.qmTable.currentRow.id
            },
            component: () => import('./edit.vue')
          },
          {
            name: 'set',
            iconName: '线性-审核',
            permitName: ['submitAudit'],
            i18n: 'biz.btn.submitAudit',
            url: '/api/platform/corpImg/submitAudit',
            msg: '审批状态是草拟状态才可以提交审核',
            validate: currentRow => {
              const flg = currentRow && currentRow.auditStatus === '1'
              return flg
            },
            getParam(currentRow) {
              return currentRow.id
            }
          },
          {
            name: 'set',
            iconName: '线性-启用',
            permitName: ['on'],
            i18n: 'biz.btn.enable',
            msg: '审批状态是已通过可以提交启用',
            validate: currentRow => {
              const flg = currentRow && currentRow.auditStatus === '3'
              return flg
            },
            url: '/api/platform/corpImg/updateUsingFlag',
            getParam(currentRow) {
              return {
                usingFlag: '1',
                id: currentRow.id
              }
            }
          },
          {
            name: 'set',
            iconName: '线性-停用',
            permitName: ['off'],
            msg: '审批状态是已通过可以提交停用',
            validate: currentRow => {
              const flg = currentRow && currentRow.auditStatus === '3'
              return flg
            },
            i18n: 'biz.btn.disable',
            url: '/api/platform/corpImg/updateUsingFlag',
            getParam(currentRow) {
              return {
                usingFlag: '0',
                id: currentRow.id
              }
            }
          },
          {
            name: 'remove',
            msg: '审批状态是草拟和已拒绝才可以删除',
            validate: currentRow => {
              const flg = currentRow && (currentRow.auditStatus === '1' || currentRow.auditStatus === '4')
              return flg
            },
            getParam(currentRow) {
              return currentRow.id
            }
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
              width: '120',
              label: 'sys.corpImg.showSite',
              format: {
                dict: this.$t('datadict.imgShowSite')
              }
            },
            {
              prop: 'auditStatus',
              width: '120',
              align: 'center',
              label: 'biz.lbl.auditStatus',
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
              width: '80',
              align: 'center',
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

