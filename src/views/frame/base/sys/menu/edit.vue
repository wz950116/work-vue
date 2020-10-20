<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>
<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'

export default {
  name: 'menuEdit',
  data() {
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/sys/menu/get',
          save: '/api/sys/menu/save',
          update: '/api/sys/menu/update'
        },
        apiData: {
          view(param) {
            return param.menuRow.id
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
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['assist', 'audit']
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
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'biz.title.basicInfo',
            content: [
              {
                type: 'radio',
                label: 'platform.menu.leafFlag',
                prop: 'leafFlag',
                list: [
                  {
                    label: '目录',
                    value: '0'
                  },
                  {
                    label: '菜单',
                    value: '1'
                  }
                ],
                attrs: {
                  disabled: this.getDisabled(),
                  cols: 2
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                event: this.changeLeafFlag,
                default: '0'
              },
              {
                label: 'biz.lbl.usingFlag',
                prop: 'usingFlag',
                type: 'radio',
                list: this.$t('datadict.usingFlag'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: '1'
              },
              {
                label: 'platform.menu.parentName',
                prop: 'parentName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                default: this.getParentName()
              },
              {
                prop: 'parentCode',
                isShow: false,
                default: this.getParentCode()
              },
              {
                label: 'platform.menu.menuName',
                prop: 'menuName',
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
                label: 'platform.menu.menuEname',
                prop: 'menuEname',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'platform.menu.sortNo',
                prop: 'sortNo',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'platform.menu.icon',
                prop: 'icon',
                element: 'base-select',
                list: this.$store.state.app.icons,
                attrs: {
                  filterable: true,
                  clearable: true
                }
              },
              {
                label: 'biz.lbl.remark',
                prop: 'menuDesp',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true
                }
              }
            ]
          },
          part2: {
            titleName: 'biz.title.menuInfo',
            dtoKey: 'sysMenuExtraDto',
            hidden: true,
            content: [
              {
                label: 'platform.menu.iframeFlag',
                prop: 'iframeFlag',
                type: 'radio',
                list: this.$t('datadict.yesNo'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true
                },
                default: '1'
              },
              {
                label: 'platform.menu.iframeUrl',
                prop: 'iframeUrl',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  cols: 2
                }
              },
              {
                label: 'platform.menu.menuUrl',
                prop: 'menuUrl',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true,
                  cols: 2,
                  placeholder: '浏览器显示URL,以/开始路径'
                },
                default: '/' + toolUtil.uuid()
              },
              {
                label: 'platform.menu.component',
                prop: 'component',
                element: 'input-validate',
                attrs: {
                  clearable: true,
                  placeholder: 'views/**'
                },
                isShow: false,
                default: 'views/frame/iframe/monitor/index'
              },
              {
                label: 'platform.menu.componentName',
                prop: 'componentName',
                element: 'input-validate',
                attrs: {
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'platform.menu.moduleType',
                prop: 'moduleType',
                isShow: false,
                default: '2'
              },
              {
                label: 'platform.menu.authFlag',
                prop: 'authFlag',
                isShow: false,
                default: '4'
              },
              {
                label: 'platform.menu.hiddenFlag',
                prop: 'hiddenFlag',
                type: 'radio',
                isShow: false,
                list: this.$t('datadict.yesNo'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: '0'
              },
              {
                label: 'platform.menu.noCacheFlag',
                prop: 'noCacheFlag',
                type: 'radio',
                list: this.$t('datadict.yesNo'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                isShow: false,
                default: '0'
              },
              {
                label: 'platform.menu.reuseFlag',
                prop: 'reuseFlag',
                type: 'radio',
                list: this.$t('datadict.yesNo'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                isShow: false,
                default: '1'
              },
              {
                label: 'platform.menu.operateCode',
                prop: 'operateCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                isShow: false,
                default: 'all'
              },
              {
                label: 'platform.menu.operateName',
                prop: 'operateName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                isShow: false,
                default: '全部'
              },
              {
                label: 'platform.menu.operateEname',
                prop: 'operateEname',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                isShow: false,
                default: 'all'
              }
            ]
          }
        },
        tabs: []
      }
    }
  },

  props: {
    opType: {
      type: String,
      default: 'add'
    },
    opMode: {
      type: String,
      default: 'dialog'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },

  methods: {
    getDisabled() {
      if (this.opType === 'add') {
        return false
      } else {
        return true
      }
    },
    changeLeafFlag(param) {
      if (param && param === '1') {
        //自有菜单
        this.$refs.qmEdit.$refs.qmDialogEdit.edit.formData['part2'].hidden = false
      } else {
        this.$refs.qmEdit.$refs.qmDialogEdit.edit.formData['part2'].hidden = true
      }
    },
    // 初始化回调
    handleInitCallback(param) {
      if (param && param.leafFlag === '1' && param.selfFlag === '1') {
        //自有菜单
        this.$refs.qmEdit.$refs.qmDialogEdit.edit.formData['part2'].hidden = false
      }
    },
    getParentCode() {
      if (this.param.menuRow && this.opType === 'add') {
        return this.param.menuRow.code
      }
    },
    getParentName() {
      if (this.param.menuRow) {
        if (this.opType === 'add') {
          return this.param.menuRow.menuName
        } else {
          return this.param.menuRow.parentCode
        }
      }
    },
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
