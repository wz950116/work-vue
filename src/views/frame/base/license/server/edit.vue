<template>
  <qm-dialog :dialog='dialog' ref="qmDialog" @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
import axios from 'axios'
export default {
  name: 'rifLicenseEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/license/cfgLicense/get'
        },
        apiData: {
          param: this.param,
          view() {
            return this.param.id
          }
        },
        formData: [
          {
            label: '用户名称',
            prop: 'userName',
            element: 'input-validate',
            attrs: {
              clearable: false,
              cols: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'rif',
            prop: 'registrationInformation',
            element: 'qm-upload',
            attrs: {
              uploadUrl: process.env.BASE_API + '/api/license/uploadRif',
              cols: 2
            },
            isShow: this.getRifShow()
          },
          {
            label: 'subject',
            prop: 'subject',
            element: 'input-validate',
            attrs: {
              clearable: false,
              disabled: true,
              cols: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: '版本',
            prop: 'version',
            element: 'input-validate',
            attrs: {
              clearable: false,
              disabled: true,
              cols: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'ip',
            prop: 'ipAddress',
            element: 'input-validate',
            attrs: {
              disabled: true,
              clearable: true,
              cols: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'macAddress',
            prop: 'macAddress',
            element: 'input-validate',
            attrs: {
              disabled: true,
              clearable: true,
              cols: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: '到期日期',
            type: 'date',
            prop: 'expiryTime',
            default: this.$toolUtil.getDayAfter(30),
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd',
              cols: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: '最在在线用户数',
            prop: 'maxOnlineNum',
            element: 'input-validate',
            default: '0',
            attrs: {
              clearable: true,
              cols: 2
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'biz.lbl.remark',
            prop: 'description',
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
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.registerLic',
            event: this.exportLic,
            showLoading: true,
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
    getRifShow() {
      if (this.opType === 'add') {
        return true
      } else {
        return false
      }
    },
    attachment() {},
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    },
    exportLic() {
      this.$refs.qmDialog.$refs.refForm.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: process.env.BASE_API + '/api/license/generateLicense',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.registerLic'),
              data: this.$refs.qmDialog.formData
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
                link.setAttribute('download', 'license.lic')
                document.body.appendChild(link)
                link.click()
                link.remove()
              }
              this.$emit('closeHandler', true)
            })
            .catch(error => {
              this.$notify(
                notifyError({
                  msg: this.$t('file.msg.downloadLicError')
                })
              )
            })
        }
      })
    }
  }
}
</script>
