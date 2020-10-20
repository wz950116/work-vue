<template>
  <qm-edit :edit='edit' ref='qmEdit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.opType,
        mode: this.opMode,
        param: this.param,
        api: {
          view: '/api/warn/source/get',
          save: '/api/warn/source/insert',
          update: '/api/warn/source/update'
        },
        apiData: {
          view(param) {
            return param.id
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
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'data.warnSource.sourceInfo',
            content: [
              {
                label: 'data.warnSource.sourceName',
                prop: 'sourceName',
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
                label: 'data.warnSource.sourceCode',
                prop: 'sourceCode',
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
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true
                }
              },
              {
                label: 'data.warnSource.sql',
                prop: 'sqlStatement',
                element: 'el-input',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'textarea',
                  cols: 4,
                  clearable: true
                }
              },
              {
                label: 'sql说明',
                prop: 'sqlremark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  clearable: true,
                  disabled: true,
                  placeholder: 'SQL查询字段都必须是下划线大写的方式，as 别名也是下划线大写，不可以用驼峰，列信息会展示成驼峰方式'
                }
              }
            ]
          }
        },
        tables: [
          {
            name: 'warnSrcColDtoList',
            required: true,
            label: 'data.warnSource.columnInfo',
            component: () => import('./editTable.vue')
          }
        ],
        tabs: []
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
      default: 'router'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    submit() {
      this.$emit('closeHandler', true)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
