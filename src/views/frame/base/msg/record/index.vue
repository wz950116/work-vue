<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'></qm-table>
  </div>
</template>
<script>
import { notifySuccess } from '@/utils/frame/base/notifyParams'

// axios访问
import request from '@/utils/frame/base/request'
export default {
  name: 'msgRecord',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          importance: undefined,
          title: undefined,
          type: undefined,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          defaultSortString: 'userSendDt.desc',
          data: {
            msgRecordNo: ''
          }
        },
        formData: [
          {
            type: 'date',
            label: 'msg.record.userSendDt',
            props: ['userSendDtFrom', 'userSendDtTo'],
            default: this.$toolUtil.getLatestMonth(),
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'msg.record.msgSendStat',
            prop: 'msgSendStat',
            element: 'base-select',
            list: this.$t('datadict.msgSendStat'),
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        api: {
          search: '/api/msg/record/list'
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            getParam(currentRow) {
              return currentRow.msgRecordNo
            },
            component: () => import('./edit.vue')
          },
          {
            name: 'resend',
            iconName: '线性-刷新',
            i18n: 'biz.btn.retry',
            event: this.doResend
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          cols: [
            {
              label: 'msg.record.msgRecordNo',
              prop: 'msgRecordNo',
              width: '150'
            },
            {
              label: 'msg.record.userSendDt',
              prop: 'userSendDt',
              width: '150',
              align: 'center'
            },
            {
              label: 'msg.record.senderName',
              prop: 'senderName',
              width: '100'
            },
            {
              prop: 'msgSendStat',
              width: '100',
              align: 'center',
              label: 'msg.record.msgSendStat',
              format: {
                dict: this.$t('datadict.msgSendStat')
              }
            },
            {
              label: 'msg.record.tenantName',
              prop: 'tenantName',
              width: '100'
            },
            {
              label: 'msg.record.msgFuncCode',
              width: '120',
              prop: 'msgFuncCode'
            },
            {
              label: 'msg.record.msgFuncName',
              width: '120',
              prop: 'msgFuncName'
            },
            {
              label: 'msg.record.msgTaskId',
              prop: 'taskId',
              width: '100'
            },

            {
              label: 'msg.record.msgProcessId',
              prop: 'processId',
              width: '100'
            },

            {
              label: 'msg.record.recipientName',
              width: '100',
              prop: 'recipientName'
            },
            {
              label: 'msg.record.msgChannelName',
              width: '120',
              prop: 'msgChannelName'
            },
            {
              label: 'msg.record.msgTempletName',
              width: '120',
              prop: 'msgTempletName'
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
    doResend(row) {
      if (row !== null) {
        this.$confirm(this.$t('msg.record.confirmResend'), this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            this.selectRow = row
            this.resend()
          })
          .catch(() => {})
      }
    },
    resend() {
      this.loading = true
      request({
        url: '/api/msg/record/resend',
        method: 'post',
        data: {
          data: this.$refs.qmTable.currentRow.msgRecordNo
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('msg.record.resendSuccess') }))
          this.loading = false
          this.$refs.qmTable.getList()
        })
        .catch(e => {
          this.loading = false
        })
    }
  }
}
</script>

