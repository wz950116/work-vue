<template>
  <qm-dialog ref='qmDialog' :dialog='dialog' @closeDialog='handleCloseDialog' :initFun=initFun></qm-dialog>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  name: 'corpImgSubmitEdit',

  data() {
    return {
      uploadDisabled: true,
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'medium',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/platform/corpImg/get'
        },
        apiData: {
          id: this.param.id,
          view() {
            return this.id
          }
        },
        formData: [
          {
            label: 'sys.corpImg.imageName',
            prop: 'imageName',
            element: 'input-validate',
            attrs: {
              disabled: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'sys.corpImg.showSite',
            prop: 'showSite',
            element: 'base-select',
            list: this.$t('datadict.imgShowSite'),
            event: this.setImageSize,
            attrs: {
              clearable: false,
              disabled: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'sys.corpImg.siteSize',
            prop: 'siteSize',
            element: 'input-validate',
            attrs: {
              disabled: true
            }
          },

          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            default: '0',
            attrs: {
              disabled: true
            }
          },
          {
            prop: 'auditStatus',
            isShow: false
          },
          {
            label: 'biz.lbl.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              cols: 4,
              disabled: true
            }
          },
          {
            label: 'sys.corpImg.imagePath',
            prop: 'imagePath',
            element: 'image-upload',
            attrs: {
              imageData: {
                tenantCode: this.param.tenantCode
              },
              disabled: true,
              cols: 4
            }
          },
          {
            label: 'sys.corpImg.auditComment',
            prop: 'auditComment',
            element: 'el-input',
            attrs: {
              cols: 4,
              clearable: true
            }
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['audit']
          },
          {
            name: 'biz.btn.refuse',
            event: this.doRefuse,
            isShow: ['audit']
          },
          {
            name: 'biz.btn.agree',
            event: this.doAgree,
            isShow: ['audit'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  created() {},
  methods: {
    doRefuse() {
      request({
        url: '/api/platform/corpImg/audit',
        method: 'POST',
        data: {
          data: {
            id: this.param.id,
            auditStatus: '4',
            auditComment: this.$refs.qmDialog.formData['auditComment']
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.refuse')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.operationSuccess') }))
          this.$emit('closeHandler', true)
        })
        .catch(() => {})
    },
    doAgree() {
      request({
        url: '/api/platform/corpImg/audit',
        method: 'POST',
        data: {
          data: {
            id: this.param.id,
            auditStatus: '3',
            auditComment: this.$refs.qmDialog.formData['auditComment']
          },
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.agree')
        }
      })
        .then(response => {
          this.$notify(notifySuccess({ msg: this.$t('biz.msg.operationSuccess') }))
          this.$emit('closeHandler', true)
        })
        .catch(() => {})
    },
    initFun() {
      const showSite = this.$refs.qmDialog.formData['showSite']
      if (showSite) {
        this.$refs.qmDialog.formData['siteSize'] = this.$toolUtil.dataFormat('dataDictFormat', showSite, this.$t('datadict.imgSiteSize'))
      } else {
        this.$refs.qmDialog.formData['siteSize'] = ''
      }
    },
    setImageSize() {
      const showSite = this.$refs.qmDialog.formData['showSite']
      if (showSite) {
        this.$refs.qmDialog.formData['siteSize'] = this.$toolUtil.dataFormat('dataDictFormat', showSite, this.$t('datadict.imgSiteSize'))
      } else {
        this.$refs.qmDialog.formData['siteSize'] = ''
      }
    },
    attachment() {},
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
