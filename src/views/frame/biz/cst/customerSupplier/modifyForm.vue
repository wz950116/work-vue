<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='initPage'></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'customerSupplierEdit',
  data() {
    return {
      edit: {
        type: this.getOpType(),
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/cust/customer/getByCode',
          update: '/api/cust/customer/modify'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
          }
        },
        topButtons: [
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['modify']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['modify'],
            attrs: {
              type: 'primary'
            },
            extraEvent: this.saveValidate
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'biz.title.mainInfo',
            content: [
              {
                label: 'cst.customerSupplier.form.custNo',
                prop: 'custCode',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'cst.customerSupplier.form.custName',
                prop: 'custName',
                element: 'input-validate',
                attrs: {
                  cols: 2,
                  disabled: true
                }
              }
            ]
          }
        },

        tabs: [
          {
            isShow: ['modify'],
            name: 'cardInfoList',
            label: 'cst.customerSupplier.tab.cardInfo',
            component: () => import('./cardInfo.vue')
          },
          {
            isShow: ['modify'],
            name: 'contactsList',
            label: 'cst.customerSupplier.tab.contactInfo',
            component: () => import('./contactInfo.vue')
          },
          {
            isShow: ['modify'],
            name: 'bankInfoList',
            label: 'cst.customerSupplier.tab.accountInfo',
            component: () => import('./accountInfo.vue')
          },
          {
            isShow: ['modify'],
            name: 'stackHoldList',
            label: 'cst.customerSupplier.tab.shareholdInfo',
            component: () => import('./shareholdInfo.vue')
          },
          {
            isShow: ['modify'],
            name: 'billList',
            label: 'cst.customerSupplier.tab.taxInfo',
            component: () => import('./taxInfo.vue')
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
        return {}
      }
    }
  },
  methods: {
    initPage(val) {
      this.handleChangeType()
      this.reverseFlagChange()
    },
    reverseFlagChange() {
      let val = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.reverseFlag
      const contentList = this.edit.formData.part1.content
      if (val === '1') {
        for (let i = 0; i < contentList.length; i++) {
          const data = contentList[i]
          if (data.prop === 'reverseOrganCode') {
            this.$set(data.attrs, 'required', true)
            this.$set(data.attrs, 'disabled', false)
            this.$set(this.$refs.qmEdit.$refs.qmRouteEdit.rules, 'reverseOrganCode', [
              {
                required: true,
                trigger: 'change'
              }
            ])
          }
        }
      } else {
        for (let i = 0; i < contentList.length; i++) {
          const data = contentList[i]
          if (data.prop === 'reverseOrganCode') {
            this.$refs.qmEdit.$refs.qmRouteEdit.editForm.reverseOrganCode = ''
            this.$set(data.attrs, 'required', false)
            this.$set(data.attrs, 'disabled', true)
            this.$set(this.$refs.qmEdit.$refs.qmRouteEdit.rules, 'reverseOrganCode', [
              {
                required: false,
                trigger: 'change'
              }
            ])
          }
        }
      }
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: { ...(!!param && { refresh: !!param }) }
        })
      })
    },
    saveValidate() {
      let fail = true
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.cardInfoList[0].$refs.tab.tableData.forEach(row => {
        if (row.expiryDate < row.registDate) {
          fail = false
        }
      })
      if (!fail) {
        this.$notify(
          notifyInfo({
            msg: '失效日期不得小于注册日期'
          })
        )
      }
      // 判断收款比例管控和欠款总额管控只能选择一种
      // const data = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      // if (data.fundRecvMinRate !== '' && data.totalAmountCheck !== '') {
      //   this.$notify(notifyInfo({ msg: this.$t('cst.customerSupplier.validateMsg.collectionCheck') }))
      //   fail = false
      // }
      return fail
    },
    handleChangeType() {
      const typeCodeList = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.typeCodeList
      const data = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      if (this.$route.params.type === 'view') {
        return
      }
      if (typeCodeList.length === 2) {
        this.edit.formData.part1.content[13].attrs.disabled = false
        this.edit.formData.part1.content[14].attrs.disabled = false
        this.edit.formData.part1.content[15].attrs.disabled = false
      } else if (typeCodeList.length === 1) {
        if (typeCodeList[0] === '1') {
          this.edit.formData.part1.content[13].attrs.disabled = true
          this.edit.formData.part1.content[14].attrs.disabled = true
          this.edit.formData.part1.content[15].attrs.disabled = false
          data.productType = null
          data.buytradeCode = null
          data.buytradeCodeList = []
        } else if (typeCodeList[0] === '2') {
          this.edit.formData.part1.content[13].attrs.disabled = false
          this.edit.formData.part1.content[14].attrs.disabled = false
          this.edit.formData.part1.content[15].attrs.disabled = true
          data.saletradeCode = null
          data.saletradeCodeList = []
        }
      } else {
        this.edit.formData.part1.content[13].attrs.disabled = false
        this.edit.formData.part1.content[14].attrs.disabled = false
        this.edit.formData.part1.content[15].attrs.disabled = false
      }
    },
    handleChangeCustFullName() {
      const data = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      if (this.edit.type === 'add') {
        data.custHeadline = data.custFullnameChs
      }
    },
    /**
     * 获取操作类型
     */
    getOpType() {
      return this.$route.params.type || this.$route.params.opType
    }
  }
}
</script>
