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
          save: '/api/code/codeReport/menu/add'
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
                label: '类型',
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
                label: '上级目录',
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
                label: '名称',
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
                label: '英语名称',
                prop: 'menuEname',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: '排序号',
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
                prop: 'id',
                default: this.param,
                isShow: false
              }
            ]
          },
          part2: {
            titleName: 'biz.title.menuInfo',
            dtoKey: 'sysMenuExtraDto',
            hidden: true,
            content: [
              {
                label: '是否为iframe',
                prop: 'iframeFlag',
                default: '0',
                isShow: false
              },
              {
                label: '菜单URL',
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
                label: 'component',
                prop: 'component',
                element: 'input-validate',
                attrs: {
                  clearable: false,
                  placeholder: 'views/**'
                },
                default: 'views/frame/base/generator/formwork/report'
              },
              {
                label: '组件名称',
                prop: 'componentName',
                element: 'input-validate',
                attrs: {
                  clearable: true
                },
                default: 'formworkReport'
              },
              {
                label: '菜单类型',
                prop: 'moduleType',
                isShow: false,
                default: '2'
              },
              {
                label: '授权方式',
                prop: 'authFlag',
                isShow: false,
                default: '4'
              },
              {
                label: '是否隐藏',
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
                label: '是否无缓存',
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
                label: '组件复用',
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
                label: '操作代码',
                prop: 'operateCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                default: 'all'
              },
              {
                label: '操作名称',
                prop: 'operateName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                default: '全部'
              },
              {
                label: '操作英文名称',
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
