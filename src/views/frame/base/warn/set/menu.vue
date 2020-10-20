<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>
<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'

export default {
  name: 'warnMenuEdit',
  data() {
    return {
      edit: {
        type: 'add',
        mode: this.opMode,
        param: this.param,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          save: '/api/warn/warning/menu'
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
            titleName: 'data.warnSet.baseInfo',
            content: [
              {
                label: 'data.warnSet.leafFlag',
                prop: 'leafFlag',
                default: '1',
                isShow: false
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
                prop: 'parentCode',
                isShow: false
              },
              {
                label: 'data.warnSet.parentName',
                prop: 'parentName',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/base/warn/set/catalog.vue'),
                callback: this.parentCodeCallback,
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: false
                }
              },
              {
                label: 'data.warnSet.menuName',
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
                label: 'data.warnSet.menuEname',
                prop: 'menuEname',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'data.warnSet.sortNo',
                prop: 'sortNo',
                default: '0',
                isShow: false
              },
              {
                label: 'biz.lbl.remark',
                prop: 'menuDesp',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true
                }
              },
              {
                prop: 'warningCode',
                default: this.param,
                isShow: false
              }
            ]
          },
          part2: {
            titleName: 'data.warnSet.menuInfo',
            dtoKey: 'sysMenuExtraDto',
            hidden: true,
            content: [
              {
                label: 'data.warnSet.iframeFlag',
                prop: 'iframeFlag',
                default: '0',
                isShow: false
              },
              {
                label: 'data.warnSet.menuUrl',
                prop: 'menuUrl',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  cols: 2,
                  placeholder: '浏览器显示URL,以/开始路径'
                },
                default: '/' + toolUtil.uuid()
              },
              {
                label: 'data.warnSet.component',
                prop: 'component',
                element: 'input-validate',
                attrs: {
                  clearable: false,
                  placeholder: 'views/**'
                },
                default: 'views/frame/base/warn/chart/index'
              },
              {
                label: 'data.warnSet.componentName',
                prop: 'componentName',
                element: 'input-validate',
                attrs: {
                  clearable: true
                },
                default: 'warnChart'
              },
              {
                label: 'data.warnSet.moduleType',
                prop: 'moduleType',
                isShow: false,
                default: '2'
              },
              {
                label: 'data.warnSet.authFlag',
                prop: 'authFlag',
                isShow: false,
                default: '4'
              },
              {
                label: 'data.warnSet.hiddenFlag',
                prop: 'hiddenFlag',
                type: 'radio',
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
                label: 'data.warnSet.noCacheFlag',
                prop: 'noCacheFlag',
                type: 'radio',
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
                label: 'data.warnSet.reuseFlag',
                prop: 'reuseFlag',
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
              {},
              {
                label: 'data.warnSet.operateCode',
                prop: 'operateCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                default: 'all'
              },
              {
                label: 'data.warnSet.operateName',
                prop: 'operateName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                default: '全部'
              },
              {
                label: 'data.warnSet.operateEname',
                prop: 'operateEname',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
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
    parentCodeCallback(param) {
      if (param) {
        this.$refs.qmEdit.$refs.qmDialogEdit.editForm['parentName'] = param.cname
        this.$refs.qmEdit.$refs.qmDialogEdit.editForm['parentCode'] = param.code
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
