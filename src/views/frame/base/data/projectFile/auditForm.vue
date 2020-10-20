<template>
  <qm-edit :edit='edit' @closeDialog='hanldeCloseDialog'></qm-edit>
</template>

<script>
export default {
  data() {
    return {
      edit: {
        type: this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        baseBillNo: this.$route.params.uk,
        baseBillType: this.$route.meta.bizCode,
        api: {
          view: '/api/dd/project/getByCode'
        },
        apiData: {
          view(param) {
            return param.uk
          }
        },
        topButtons: [
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['assist', 'audit']
          },
          {
            iconName: '线性-审核',
            name: 'biz.btn.audit',
            $refs: this.$refs,
            getParam() {
              return this.param
            },
            event: 'audit',
            isShow: ['assist', 'audit']
          },
          {
            iconName: '线性-全选',
            name: 'biz.btn.auditHistory',
            $refs: this.$refs,
            getParam() {
              return this.param
            },
            isShow: ['audit', 'assist'],
            event: 'auditHistory'
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: [
          {
            label: 'dataHq.projectFile.projectFileName',
            prop: 'projectName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'dataHq.projectFile.projectFileCode',
            prop: 'projectCode',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'dataHq.projectFile.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              clearable: true,
              cols: 2
            }
          },
          {
            label: 'dataHq.projectFile.remark',
            prop: 'remark',
            element: 'el-input',
            attrs: {
              clearable: true,
              cols: 2
            }
          }
        ]
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
      type: [Object, String],
      default() {
        return null
      }
    }
  },
  methods: {
    hanldeCloseDialog(param) {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'project',
          params: { ...(!!param && { refresh: !!param }) }
        })
      })
    }
  }
}
</script>
