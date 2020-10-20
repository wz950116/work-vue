<template>
  <qm-edit-tab ref="tab" :tab="tab"></qm-edit-tab>
</template>

<script>
export default {
  data() {
    return {
      tab: {
        type: this.type,
        param: this.$route.params,
        api: {
          search: '/api/cust/custTemplateDetail/get'
        },
        apiData: {
          search(param) {
            return param.templateCode
          }
        },
        topBar: [
          {
            name: 'add',
            iconName: '线性-增行',
            i18n: 'biz.btn.addRow',
            isShow: ['add', 'update', 'detailSet']
          },
          {
            name: 'delete',
            iconName: '线性-删行',
            i18n: 'biz.btn.deleteRow',
            isShow: ['add', 'update', 'detailSet']
          }
        ],
        table: {
          height: 450,
          cols: [
            {
              label: 'cst.template.templateDetail.templateColumn',
              prop: 'templateColumn',
              element: 'base-select',
              isShow: false,
              list: this.$t('datadict.evaluateColumn'),
              attrs: {
                clearable: false
              }
            },
            {
              label: 'cst.template.templateDetail.templateColumn',
              prop: 'templateColumn',
              element: 'base-select',
              isShow: false,
              list: this.$t('datadict.satisfactionColumn'),
              attrs: {
                clearable: false
              }
            },
            {
              label: 'cst.template.templateDetail.templateQuestion',
              prop: 'templateQuestion',
              element: 'input-validate',
              required: true
            },
            {
              label: 'cst.template.templateDetail.questionPoint',
              prop: 'questionPoint',
              element: 'input-formatter',
              required: true,
              attrs: {
                clearable: true,
                max: 999999,
                min: 0,
                precision: 0
              }
            },
            {
              label: 'cst.template.templateDetail.sortNum',
              prop: 'sortNum',
              element: 'input-formatter',
              required: true,
              attrs: {
                clearable: true,
                max: 999999,
                min: 0,
                precision: 0
              }
            },
            {
              label: 'cst.template.templateDetail.remark',
              prop: 'remark',
              element: 'el-input'
            },
            {
              label: 'cst.template.templateDetail.usingFlag',
              prop: 'usingFlag',
              element: 'base-select',
              list: this.$t('datadict.usingFlag'),
              default: '1',
              required: true,
              attrs: {
                clearable: false
              }
            }
          ]
        }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'update'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.$parent.$parent.$parent.editForm.templateType === '1') {
        this.tab.table.cols[0].isShow = true
        this.tab.table.cols[0].required = true
      } else {
        this.tab.table.cols[1].isShow = true
        this.tab.table.cols[1].required = true
      }
    }, 500)
  }
}
</script>
