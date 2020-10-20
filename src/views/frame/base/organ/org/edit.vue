<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  name: 'orgEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        defaultParentCode: '',
        styleType: 'max',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/func/org/get',
          save: '/api/func/org/save',
          update: '/api/func/org/save'
        },

        formData: [
          {
            label: 'func.org.organCode',
            prop: 'code',
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
            label: 'func.org.organName',
            prop: 'name',
            element: 'input-validate',
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
            label: 'func.org.organAbbr',
            prop: 'abbr',
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
            label: 'func.org.title',
            prop: 'title',
            element: 'input-validate',
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
          // {
          //   label: 'func.org.organFullName',
          //   prop: 'fullName',
          //   element: 'input-validate',
          //   attrs: {
          //     clearable: true,
          //     cols: 2
          //   },
          //   validate: [
          //     {
          //       trigger: 'blur'
          //     }
          //   ]
          // },
          {
            label: 'func.org.parentId',
            prop: 'parentCode',
            default: this.getDefaultOrgCode(),
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              clickParent: true,
              multiple: false,
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'func.org.address',
            prop: 'address',
            element: 'input-validate',
            attrs: {
              clearable: true,
              cols: 2
            },
            validate: [
              {
                trigger: 'blur'
              }
            ]
          },
          {
            label: 'func.org.zipCode',
            prop: 'zipCode',
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
            label: 'func.org.fax',
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
            label: 'func.org.taxNumber',
            prop: 'taxNumber',
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
            label: 'func.org.legalRepresentative',
            prop: 'legalRepresentative',
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
            label: 'func.org.principal',
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
    // 是否自动采番
    autoFlag() {
      if (this.opType === 'add') {
        return process.env.FUNC_AUTO_SEQ
      } else {
        return true
      }
    },
    getDefaultOrgCode() {
      if (this.opType === 'add') {
        return this.param
      } else {
        return ''
      }
    },
    getTreeOrgDisabled() {
      if (this.opType === 'add') {
        return false
      } else {
        return true
      }
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
