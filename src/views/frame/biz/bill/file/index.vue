<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'

import request from '@/utils/frame/base/request'
import axios from 'axios'
export default {
  name: 'bizFileMangement',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {},
          defaultSortString: 'uploadDate.asc'
        },
        formData: [
          {
            label: '合同类型',
            prop: 'contractType',
            element: 'base-select',
            list: this.$t('datadict.fileContractType'),
            attrs: {
              clearable: true,
              filterable: true
            }
          },

          {
            label: '合同号',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          // {
          //   label: '合同归档',
          //   prop: 'contractFiling',
          //   element: 'base-select',
          //   list: this.$t('datadict.yesNo')
          // },
          {
            label: '单据类型',
            prop: 'billType',
            element: 'base-select',
            list: this.$t('datadict.bizCode'),
            attrs: {
              clearable: true,
              filterable: true
            }
          },
          {
            label: '单据号',
            prop: 'billNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: '客商名称',
            prop: 'customerName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: '附件名称',
            prop: 'fileName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/bill/file/list'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'download',
            iconName: '线性-下载',
            i18n: 'biz.btn.download',
            event: this.download
          },
          // 刷新
          {
            name: 'refresh'
          }
        ],

        isColset: true,
        initSearch: false,
        sortable: 'custom',
        table: {
          showCheckbox: true,
          id: this.$t('route.' + this.$route.meta.title),
          cols: [
            {
              label: '合同类型',
              width: '120',
              align: 'center',
              prop: 'contractType',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            {
              label: '合同号',
              width: '180',
              prop: 'contractNo'
            },
            {
              label: '客商名称',
              width: '180',
              prop: 'customerName'
            },
            {
              label: '单据类型',
              align: 'center',
              width: '120',
              prop: 'billType',
              format: {
                dict: this.$t('datadict.bizCode')
              }
            },
            {
              label: '单据号',
              width: '180',
              prop: 'billNo'
            },
            {
              label: '附件名称',
              width: '180',
              prop: 'fileName'
            },
            {
              label: '上传人',
              width: '80',
              prop: 'uploadEmployee',
              align: 'center'
            },
            {
              label: '上传时间',
              width: '160',
              prop: 'uploadDate',
              align: 'center'
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
  mounted() {},
  methods: {
    download() {
      if (!this.$refs.qmTable.currentRow || this.$refs.qmTable.currentRow.length === 0) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      const attachmentNoArray = []
      this.$refs.qmTable.currentRow.forEach(attachement => {
        attachmentNoArray.push(attachement.attachmentNo)
      })

      axios({
        method: 'post',
        url: process.env.BASE_API + '/api/sys/file/zip',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.download'),
          data: attachmentNoArray
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
            link.setAttribute('download', '文档.zip')
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
    }
  }
}
</script>
