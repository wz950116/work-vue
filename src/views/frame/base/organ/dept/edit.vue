<template>
  <qm-dialog :dialog='dialog' :initFun='initFun' ref='qmDialog' @closeDialog='handleCloseDialog' @handleNode='handleNode'></qm-dialog>
</template>

<script>
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'

export default {
  name: 'deptEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'max',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/func/dept/get',
          save: '/api/func/dept/save',
          update: '/api/func/dept/save'
        },

        formData: [
          {
            prop: 'code',
            label: 'func.dept.deptCode',
            element: 'input-validate',
            validate: [
              {
                required: !this.autoFlag(),
                trigger: 'blur'
              }
            ],
            attrs: {
              maxlength: 10,
              disabled: this.autoFlag(),
              clearable: true
            }
          },
          {
            label: 'func.dept.deptName',
            prop: 'name',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'func.dept.organId',
            prop: 'orgCode',
            element: 'base-select',
            default: this.getDefaultOrgCode(),
            attrs: {
              clearable: true,
              cols: 2,
              data: 'FUNC_ORG'
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            event: {
              changeAll: this.changeAllOrg
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            default: '1',
            attrs: {
              clearable: false
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'func.dept.parentId',
            prop: 'parentCode',
            element: 'base-select',
            default: this.getDefaultDeptCode(),
            validate: [
              {
                required: false,
                trigger: 'change'
              }
            ],
            attrs: {
              data: 'FUNC_DEPT',
              params: {
                orgCode: this.param.orgCode
              },
              cols: 2,
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'func.dept.leader',
            prop: 'leader',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'func.dept.principal',
            prop: 'principal',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'func.dept.phone',
            prop: 'phone',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'func.dept.fax',
            prop: 'fax',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'func.dept.businessNature',
            prop: 'businessNature',
            element: 'input-validate',
            attrs: {
              clearable: true
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'biz.lbl.remark',
            prop: 'remark',
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
            name: 'biz.btn.save',
            event: 'save',
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

  methods: {
    autoFlag() {
      if (this.opType === 'add') {
        return process.env.FUNC_AUTO_SEQ
      } else {
        return true
      }
    },
    initFun(formData) {
      if (formData && formData.deptCode) {
        this.dialog.formData.forEach(item => {
          if (item.prop === 'orgCode') {
            item.attrs.disabled = true
          }
        })
      }
    },
    handleNode(node) {
      if (node) {
        if (node.deptCode) {
          this.$refs.qmDialog.formData.orgCode = node.orgCode
          this.dialog.formData.forEach(item => {
            if (item.prop === 'orgCode') {
              item.attrs.disabled = true
            }
          })
        }
      } else {
        this.dialog.formData.forEach(item => {
          if (item.prop === 'orgCode') {
            item.attrs.disabled = false
          }
        })
      }
    },
    getDefaultOrgCode() {
      if (this.opType === 'add') {
        return this.param.orgCode
      } else {
        return ''
      }
    },
    getDefaultDeptCode() {
      if (this.opType === 'add') {
        return this.param.deptCode
      } else {
        return ''
      }
    },
    attachment() {},
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    },
    changeAllOrg(item) {
      this.$refs.qmDialog.formData.parentCode = ''
      const parentCodeRef = toolUtil.getDefDialogItemByProp(this, 'parentCode')
      parentCodeRef.attrs.params.orgCode = item.code
    }
  }
}
</script>
