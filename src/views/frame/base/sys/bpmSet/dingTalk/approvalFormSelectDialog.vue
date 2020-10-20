<template>
  <qm-dialog-table ref='qmDialogTable' :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-table>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('sys.bpmSet.approvalFormSelect.titleName'),
        moreShowFlg: false,
        initChooseParam: this.initChooseParam,
        formData: [
          {
            prop: 'processInstName',
            label: 'sys.bpmSet.approvalFormSelect.form.processInstTitle',
            element: 'input-validate',
            default: '',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            prop: 'processInstType',
            label: 'sys.bpmSet.approvalFormSelect.form.processInstType',
            element: 'base-select',
            default: [],
            attrs: {
              data: 'DING_APPROVAL_TYPE',
              params: {},
              multiple: true,
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            prop: 'processInstCreater',
            label: 'sys.bpmSet.approvalFormSelect.form.processInstCreater',
            element: 'base-select',
            default: [],
            attrs: {
              data: 'DING_USER_INFO',
              params: {},
              multiple: true,
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'sys.bpmSet.approvalFormSelect.form.processInstCreateTime',
            props: ['createStartTime', 'createEndTime'],
            type: 'date',
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            prop: 'startWithCtFlag',
            label: 'sys.bpmSet.approvalFormSelect.form.startWithCtFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            default: '1',
            attrs: {
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
        ],
        mainData: {
          api: {
            search: '/api/cust/bpmInstChangeHis/listApprovalFormInfo'
          },
          apiData: {
            search(listQuery) {
              const newListQuery = Object.assign(listQuery, {
                defaultSortString: 'createDt.desc'
              })
              return newListQuery
            }
          },
          // initSearch: true,
          table: {
            sortable: 'custom',
            selectionFixed: true,
            showCheckbox: true,
            cols: [
              {
                prop: 'billName',
                label: 'sys.bpmSet.approvalFormSelect.col.billName',
                width: 180,
                align: 'left'
              },
              {
                prop: 'billNo',
                label: 'sys.bpmSet.approvalFormSelect.col.billNo',
                width: 180,
                align: 'left'
              },
              {
                prop: 'processName',
                label: 'sys.bpmSet.approvalFormSelect.col.processInstType',
                width: 300,
                align: 'left'
              },
              {
                prop: 'title',
                label: 'sys.bpmSet.approvalFormSelect.col.processInstTitle',
                width: 300,
                align: 'left'
              },
              {
                prop: 'dingUserName',
                label: 'sys.bpmSet.approvalFormSelect.col.processInstCreater',
                width: 150,
                align: 'center'
              },
              {
                prop: 'mobile',
                label: 'sys.bpmSet.approvalFormSelect.col.createrMobile',
                width: 150,
                align: 'center'
              },
              {
                prop: 'createDt',
                label: 'sys.bpmSet.approvalFormSelect.col.processInstCreateTime',
                minWidth: 150,
                align: 'center'
              },
              {
                prop: 'finishDt',
                label: 'sys.bpmSet.approvalFormSelect.col.processInstFinishTime',
                minWidth: 150,
                align: 'center'
              },
              {
                prop: 'result',
                label: 'sys.bpmSet.approvalFormSelect.col.dingAuditResult',
                width: 90,
                align: 'center',
                format: {
                  dict: this.$t('datadict.dingAuditResult')
                }
              }
            ]
          }
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        },
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    // 列表是否支持多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 是否进行初始化查询
    initSearch: {
      type: Boolean,
      default: false
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    },
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  created() { },
  mounted() {
    request({
      url: '/api/dingtalk/bpmUserBaseInfo/getCurrentDingUser',
      method: 'post',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: null
      }
    }).then(response => {
      if (response.status) {
        if (response.data) {
          if (response.data.userId) {
            this.dialog.formData[2].default.push(response.data.userId)
          }
        }
        this.$refs.qmDialogTable.getList()
      }
    })
  },
  methods: {
    // 关闭回调
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
