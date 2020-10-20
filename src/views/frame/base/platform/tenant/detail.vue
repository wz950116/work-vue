<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
export default {
  name: 'tenantDetail',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/platform/cfgTenant/get'
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
            isShow: ['detailSet'],
            attrs: {
              type: 'primary'
            }
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'platform.tenant.tenantInfo',
            content: [
              {
                label: 'platform.tenant.name',
                prop: 'name',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'platform.tenant.contactor',
                prop: 'contactor',
                element: 'input-validate',
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
                  cols: 4,
                  disabled: true
                }
              }
            ]
          }
        },
        tabs: [
          {
            name: 'funcTab',
            label: 'platform.tenant.funcTab',
            component: () => import('./funcTab.vue')
          },
          {
            name: 'dataperTab',
            label: 'platform.tenant.dataperTab',
            component: () => import('./dataperTab.vue')
          },
          {
            name: 'componentTab',
            label: 'platform.tenant.componentTab',
            component: () => import('./componentTab.vue')
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
