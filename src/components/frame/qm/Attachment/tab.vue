<template>
  <qm-edit-tab ref="tab" :tab="tab" @closeHandler="handleClose"></qm-edit-tab>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import axios from 'axios'

import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      tab: {
        type: this.$route.params.type || this.$route.params.opType || this.opType || this.type,
        param: this.param || this.$route.params,
        api: {
          search: '/api/sys/file/list'
        },
        apiData: {
          $route: this.$route,
          search(param) {
            return {
              billType: param.billType || this.$route.meta.bizCode,
              billNo: param.billNo || param.uk || param.id
            }
          }
        },
        topBar: [
          {
            name: 'upload',
            iconName: '线性-上传',
            i18n: 'biz.btn.upload',
            isShow: ['add', 'update']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update']
          },
          {
            name: 'download',
            iconName: '线性-下载',
            i18n: 'biz.btn.download',
            event: this.download
          },
          {
            name: 'preview',
            iconName: '线性-查看',
            i18n: 'biz.btn.preview',
            event: this.preview
          }
        ],
        table: {
          cols: [
            {
              label: 'biz.attach.fileName',
              prop: 'fileName',
              minWidth: '150'
            },
            {
              label: 'biz.attach.createDate',
              prop: 'uploadDate',
              width: '180',
              align: 'center'
            },
            {
              label: 'biz.attach.attachmentType',
              prop: 'attachmentType',
              element: 'base-select',
              width: '180',
              attrs: {
                data: 'FILE_TYPE',
                params: {
                  moduleCode: this.$route.meta.bpmModule
                },
                clearable: true
              }
            },
            {
              label: 'biz.attach.createUser',
              prop: 'uploadEmployeeName',
              width: '120'
            },
            {
              label: 'biz.lbl.remark',
              prop: 'remark',
              element: 'el-input',
              width: '500',
              attrs: {
                maxlength: 200,
                clearable: true
              }
            }
          ]
        }
      }
    }
  },
  created() {},
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  methods: {
    download() {
      if (!this.$refs.tab.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      axios({
        method: 'post',
        url: process.env.BASE_API + '/api/sys/file/download',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.download'),
          data: this.$refs.tab.currentRow.attachmentNo
        },
        headers: {
          Authorization: 'Bearer ' + this.$store.getters.token
        },
        responseType: 'blob'
      })
        .then(response => {
          if (response.data) {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', this.$refs.tab.currentRow.fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
        })
        .catch(error => {
          this.$notify(
            notifyError({
              msg: this.$t('file.msg.downloadError')
            })
          )
        })
    },

    preview() {
      if (!this.$refs.tab.currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      let previewData = {}
      previewData['fileName'] = this.$refs.tab.currentRow.fileName
      if (this.$refs.tab.currentRow.attachmentNo) {
        previewData['attachmentNo'] = this.$refs.tab.currentRow.attachmentNo
      } else {
        previewData['filePath'] = this.$refs.tab.currentRow.filePath
      }
      var newWin = window.open()
      // 建议给一个提示信息
      newWin.document.body.innerHTML = '加载中...'
      request({
        url: '/api/sys/file/preview',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.preview'),
          data: previewData
        }
      })
        .then(response => {
          if (process.env.PREVIEW_URL.indexOf('http') > -1) {
            newWin.location.href = process.env.PREVIEW_URL + response.data
          } else {
            newWin.location.href = window.document.location.protocol + '//' + window.document.location.host + '/preview/' + response.data
          }
        })
        .catch(() => {
          newWin.close()
        })
    },

    handleClose(params) {}
  }
}
</script>
