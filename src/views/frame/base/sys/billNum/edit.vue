<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/sys/billNumDef/get',
          save: '/api/sys/billNumDef/update',
          update: '/api/sys/billNumDef/update'
        },
        apiData: {
          view(param) {
            return param.moduleCode
          }
        },
        topButtons: [
          {
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            attrs: {
              type: 'primary'
            },
            isShow: ['add', 'update']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'sys.bill.dialogPart1',
            content: [
              {
                label: 'sys.bill.numMode',
                prop: 'numMode',
                type: 'radio',
                list: this.$t('datadict.billCodeMode'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.name',
                prop: 'name',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.numMark',
                prop: 'numMark',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.numLength',
                prop: 'numLength',
                element: 'input-formatter',
                attrs: {
                  min: 0,
                  max: 12,
                  maxlength: 12,
                  type: 'integer',
                  precision: 0
                }
              },
              {
                label: 'sys.bill.moduleCode',
                prop: 'moduleCode',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                element: 'base-select',
                attrs: {
                  data: 'MENU_MODULE',
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'sys.bill.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 3,
                  clearable: true
                }
              }
            ]
          },
          part2: {
            titleName: 'sys.bill.dialogPart2',
            content: [
              {
                label: 'sys.bill.part01Type',
                prop: 'part01Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part02Type',
                prop: 'part02Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part03Type',
                prop: 'part03Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part04Type',
                prop: 'part04Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part05Type',
                prop: 'part05Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part06Type',
                prop: 'part06Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part07Type',
                prop: 'part07Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part08Type',
                prop: 'part08Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part09Type',
                prop: 'part09Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'sys.bill.part10Type',
                prop: 'part10Type',
                element: 'base-select',
                list: this.$t('datadict.numDefType'),
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              }
            ]
          }
        }
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'view'
    },
    opMode: {
      type: String,
      default: 'dialog'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
