<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog' ref='qmRouteEdit'></qm-edit>
</template>

<script>
export default {
  name: 'orgFuncDetail',
  data() {
    return {
      edit: {
        type: 'view',
        mode: 'route',
        param: this.$route.params,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/func/orgFunc/get'
        },
        apiData: {
          code: this.$route.params.code,
          view() {
            return this.code
          }
        },
        topButtons: [
          {
            iconName: '线性-取消',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'func.org.organInfo',
            content: [
              {
                label: 'func.org.organName',
                prop: 'orgCode',
                element: 'tree-org',
                component: () => import('@/views/frame/base/organ/components/TreeOrg.vue'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'biz.lbl.usingFlag',
                prop: 'usingFlag',
                element: 'base-select',
                list: this.$t('datadict.usingFlag'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  disabled: true,
                  cols: 4
                }
              }
            ]
          }
        },
        tabs: [
          {
            name: 'funcTab',
            label: 'func.orgFunc.funcTab',
            component: () => import('./funcTab.vue')
          }
        ]
      }
    }
  },
  methods: {
    handleCloseDialog(param) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', param)
      } else {
        const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: backName,
            params: { ...(!!param && { refresh: !!param }) }
          })
        })
      }
    }
  }
}
</script>
