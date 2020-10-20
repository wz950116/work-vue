<template>
  <qm-edit-tab ref='tab' :tab='tab'></qm-edit-tab>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'

export default {
  name: 'component',
  data() {
    return {
      subMenuCode: '',
      tab: {
        type: this.type,
        param: this.param,
        api: {
          search: '/api/bpm/billChangeHis/listBillByModuleUK'
        },
        apiData: {
          search(param) {
            return param
          }
        },
        topBar: [
          {
            name: 'view',
            allowDblClick: true,
            iconName: '线性-查看',
            i18n: 'biz.btn.view',
            type: 'route',
            isShow: true,
            event: this.doView
          }
        ],
        table: {
          cols: [
            {
              label: 'bpm.common.createDate',
              prop: 'createDate',
              width: 150
            },
            {
              label: 'bpm.common.changeName',
              prop: 'changeName',
              width: 80
            },
            {
              label: 'biz.lbl.remark',
              prop: 'remark'
            }
          ]
        }
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
  beforeMount() {
    request({
      url: '/api/platform/cfgModule/getMenuCodeByMenuType',
      method: 'post',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.get'),
        data: {
          moduleCode: this.param.moduleCode || this.$route.meta.bpmModule,
          subMenuType: 'his'
        }
      }
    }).then(response => {
      this.subMenuCode = response.data
    })
  },
  methods: {
    doView() {
      const currentRow = this.$refs.tab.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (this.subMenuCode) {
        const param = {}
        param.opType = 'view'
        param.back = this.$route.name
        param.backParam = this.$route.params
        param.id = currentRow.id
        param.billHis = true
        param.uk = currentRow.billNo
        const routeOption = {
          name: this.subMenuCode,
          params: param
        }
        this.$router.push(routeOption)
      } else {
        this.$notify(notifyError({ msg: this.$t('biz.msg.noViewPage') }))
      }
    }
  }
}
</script>
