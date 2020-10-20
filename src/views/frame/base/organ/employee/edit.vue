<template>
  <qm-dialog :dialog='dialog' ref='qmDialog' @closeDialog='handleCloseDialog' @handleNode='handleNode'></qm-dialog>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'

export default {
  name: 'employeeEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'max',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/func/employee/get',
          save: '/api/func/employee/save',
          update: '/api/func/employee/save'
        },

        formData: [
          {
            prop: 'code',
            label: 'func.employee.staffCode',
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
            label: 'func.employee.staffName',
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
            label: 'func.employee.gender',
            prop: 'gender',
            type: 'radio',
            list: this.$t('datadict.gender'),
            default: 'M',
            attrs: {
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'func.employee.organId',
            prop: 'orgCode',
            default: this.getDefaultOrgCode(),
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              cols: 2
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
            label: 'func.employee.deptId',
            prop: 'deptCode',
            default: this.getDefaultDeptCode(),
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              params: {
                orgCode: this.param.orgCode
              },
              cols: 2,
              clearable: true
            },
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          },
          {
            label: 'func.employee.birthday',
            prop: 'birthday',
            element: 'el-date-picker',
            attrs: {
              clearable: true,
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'func.employee.entryDate',
            prop: 'entryDate',
            element: 'el-date-picker',
            attrs: {
              clearable: true,
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'func.employee.politicalStatus',
            prop: 'politicalStatus',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.employee.type',
            prop: 'type',
            element: 'base-select',
            list: this.$t('datadict.staffType'),

            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.employee.education',
            prop: 'education',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.employee.profession',
            prop: 'profession',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.employee.maritalStat',
            prop: 'maritalStat',
            element: 'base-select',
            list: this.$t('datadict.maritalStat'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.employee.post',
            prop: 'post',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.employee.title',
            prop: 'title',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.employee.nationality',
            prop: 'nationality',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'func.employee.address',
            prop: 'address',
            element: 'input-validate',
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'func.employee.mail',
            prop: 'mail',
            element: 'input-validate',
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'func.employee.phone',
            prop: 'phone',
            element: 'input-validate',
            attrs: {
              clearable: true
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
    handleNode(node) {
      if (node) {
        this.$refs.qmDialog.formData.orgCode = node.orgCode
      }
    },
    getDefaultOrgCode() {
      if (this.opType === 'add' && this.param && this.param.orgCode) {
        return this.param.orgCode
      }
      return ''
    },

    getDefaultDeptCode() {
      if (this.opType === 'add' && this.param && this.param.deptCode) {
        return this.param.deptCode
      }
      return ''
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    },
    changeAllOrg(item) {
      this.$refs.qmDialog.formData.deptCode = ''
      const parentCodeRef = toolUtil.getDefDialogItemByProp(this, 'deptCode')
      parentCodeRef.attrs.params.orgCode = item.code
    }
  }
}
</script>
