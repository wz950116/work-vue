<template>
  <qm-edit-tab :tab="tab" ref='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  name: 'product',
  data() {
    return {
      tab: {
        type: this.type,
        param: this.param,
        api: {},
        apiData: {},
        topBar: [],
        formData: [
          {
            label: 'data.product.marginSet.marginRateInit',
            prop: 'marginRateInit',
            element: 'input-formatter',
            attrs: {
              type: 'percent',
              clearable: true
            }
          },
          {
            label: 'data.product.marginSet.marginRateHold',
            prop: 'marginRateHold',
            element: 'input-formatter',
            attrs: {
              type: 'percent',
              clearable: true
            }
          },
          {
            label: 'data.product.marginSet.marginRateStop',
            prop: 'marginRateStop',
            element: 'input-formatter',
            attrs: {
              type: 'percent',
              clearable: true
            }
          },
          {
            label: 'data.product.marginSet.marginRateReturn',
            prop: 'marginRateReturn',
            element: 'input-formatter',
            attrs: {
              type: 'percent',
              clearable: true
            }
          }
        ]
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
    if (this.type !== 'add') {
      request({
        url: '/api/data/productMarginRate/getByProduct',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.$route.params.productCode
        }
      }).then(response => {
        if (response.status) {
          Object.assign(this.$refs.tab.tabForm, response.data)
        }
      })
    }
  }
}
</script>
