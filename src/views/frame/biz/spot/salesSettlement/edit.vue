<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog"></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'salesSettlementEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/contract/ssInfo/get',
          save: '/api/contract/ssInfo/save',
          update: '/api/contract/ssInfo/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.settlementNo
          },
          save(param) {
            return param
          },
          update(param) {
            return param
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
            isShow: ['add', 'update', 'assist', 'audit']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update', 'copy'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-选择文件',
            name: 'spot.contractLot.btn.settlementSelect',
            isShow: ['add'],
            event: 'set',
            component: () => import('./chooseSettlement.vue'), // 组件
            callback: this.closeLv2Dialog // 关闭弹窗回调
          },
          {
            iconName: '线性-修改',
            name: 'biz.btn.update',
            permitName: ['update'],
            isShow: ['view'],
            event: this.viewUpdate
          },
          {
            iconName: '线性-删除',
            name: 'biz.btn.delete',
            permitName: ['remove'],
            isShow: ['view'],
            event: this.viewRemove
          },
          {
            iconName: '线性-审核',
            name: 'biz.btn.audit',

            $refs: this.$refs,
            getParam() {
              return this.param
            },
            event: 'audit',
            isShow: ['assist', 'audit'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核历史',
            name: 'biz.btn.auditHistory',

            $route: this.$route,
            getParam() {
              return {
                moduleCode: this.$route.meta.bpmModule,
                uk: this.$route.params.uk || this.$route.params.settlementNo
              }
            },
            isShow: ['update', 'view', 'assist', 'audit'],
            event: 'auditHistory'
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',

            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.settlementNo,
                billType: this.$route.meta.bizCode
              }
            },
            event: 'attachment',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-打印',
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                settlementNo: data.uk || data.settlementNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spot.contractLot.group.baseInfo',
            content: [
              {
                label: 'spot.contractLot.form.settlementNo',
                prop: 'settlementNo',
                element: 'input-validate',
                validate: [
                  {
                    required: !this.autoFlag(),
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.autoFlag(),
                  clearable: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.settlementDate',
                prop: 'settlementDate',
                default: toolUtil.todayYYYYMMDD(),
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.isReadonlyAll(),
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'spot.contractLot.form.settlementReceiptType',
                prop: 'settlementType',
                element: 'base-select',
                list: this.$t('datadict.settlementReceiptType'),
                default: '2',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.isReadonlyAll(),
                  clearable: true
                },
                event: this.calcSttList
              },
              {
                label: 'spot.contractLot.form.tradeType',
                prop: 'tradeType',
                element: 'base-select',
                list: this.$t('datadict.tradeType'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.headlineName',
                prop: 'headlineName',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  cols: 2
                }
              },
              {
                label: 'spot.contractLot.form.contractNo',
                prop: 'contractNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.customerName',
                prop: 'customerName',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  cols: 2
                }
              },
              {
                label: 'spot.contractLot.form.settlementBillNo',
                prop: 'settlementBillNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {},
              {
                label: 'spot.contractLot.form.bizDeptName',
                prop: 'bizDeptName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.bizEmployeeName',
                prop: 'bizEmployeeName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'spot.contractLot.form.optEmployeeName',
                prop: 'optEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'spot.contractLot.form.docMakeDt',
                prop: 'docMakeDt',
                default: toolUtil.todayYYYYMMDD(),
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              }
            ]
          },
          part2: {
            titleName: 'spot.contractLot.group.amountInfo',
            content: [
              {
                label: 'spot.contractLot.form.amount',
                prop: 'amount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                }
              },
              {
                label: 'spot.contractLot.form.taxAmount',
                prop: 'taxAmount',
                element: 'input-formatter',
                attrs: {
                  disabled: true,
                  type: 'money'
                }
              },
              {
                label: 'spot.contractLot.form.currency',
                prop: 'currency',
                element: 'base-select',
                attrs: {
                  data: 'CURRENCY',
                  disabled: true
                }
              }
            ]
          }
        },
        tabs: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            required: true,
            name: 'prdDtlList',
            label: 'spot.contractLot.tab.productInfoTab',
            component: () => import('./prdDtltab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'feeDtlList',
            label: 'spot.contractLot.tab.feeInfoTab',
            component: () => import('./feeDtlTab.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'sttDtlList',
            label: 'spot.contractLot.tab.settlementInfoTab',
            component: () => import('./sttDtlTab.vue')
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
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  mounted() {
    const editForm = this.$refs.qmEdit.$refs.qmRouteEdit
    let activeName = editForm.activeName
    const activeFunc = this.calcSttList
    Object.defineProperty(editForm, 'activeName', {
      configurable: true,
      enumerable: true,
      get() {
        return activeName
      },
      set(newVal) {
        activeName = newVal
        activeFunc()
      }
    })
  },
  methods: {
    // 是否自动采番
    autoFlag() {
      if ((this.$route.params.type || this.$route.params.opType) === 'add') {
        const seqMode = this.$route.meta.seqMode
        if (seqMode && seqMode === '0') {
          return true
        }
        return false
      } else {
        return true
      }
    },
    isReadonlyAll() {
      return false
    },
    handleCloseDialog(param) {
      this.$store.dispatch('delVisitedViews', this.$route).then(() => this.$router.push({ name: 'salesSettlement' }))
    },
    closeLv2Dialog(param) {
      const firstRow = param[0]
      for (let i = 1; i < param.length; i++) {
        if (param[i].srcBillNo !== firstRow.srcBillNo || param[i].srcBillType !== firstRow.srcBillType) {
          this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.chooseSettlementProduct1') }))
          return
        }
        if (param[i].headlineCode !== firstRow.headlineCode) {
          this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.chooseSettlementProduct2') }))
          return
        }
        if (param[i].customerCode !== firstRow.customerCode) {
          this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.chooseSettlementProduct4') }))
          return
        }
      }
      const editForm = toolUtil.getDataEditFromSelf(this)
      const prdDtlList = toolUtil.getDataTabFromEdit(this, 'prdDtlList')
      const feeDtlList = toolUtil.getDataTabFromEdit(this, 'feeDtlList')
      const sttDtlList = toolUtil.getDataTabFromEdit(this, 'sttDtlList')
      prdDtlList.splice(0)
      feeDtlList.splice(0)
      sttDtlList.splice(0)

      for (let i = 0; i < param.length; i++) {
        const outBillInfo = param[i]
        let newRow = null
        for (let j = 0; j < prdDtlList.length; j++) {
          const prdRow = prdDtlList[j]
          if (outBillInfo.productCode === prdRow.productCode && outBillInfo.brand === prdRow.brand && outBillInfo.spec === prdRow.spec && outBillInfo.origin === prdRow.origin && outBillInfo.productKeyAttr01 === prdRow.productKeyAttr01 && outBillInfo.productKeyAttr02 === prdRow.productKeyAttr02 && outBillInfo.productKeyAttr03 === prdRow.productKeyAttr03 && outBillInfo.outPrice === prdRow.outPrice && outBillInfo.outTaxRate === prdRow.outTaxRate) {
            newRow = prdRow
            break
          }
        }
        if (newRow === null) {
          newRow = Object.assign({}, outBillInfo)
          newRow.outProductNo = outBillInfo.outProductNo
          newRow.settlementPrice = outBillInfo.outPrice
          newRow.settlementTfprice = outBillInfo.outTaxFreePrice
          newRow.settlementQuantity = outBillInfo.settlementQuantity
          newRow.settlementTaxRate = outBillInfo.outTaxRate
          newRow.outBillList = []
          prdDtlList.push(newRow)
        } else {
          newRow.outQuantity = toolUtil.toNum(newRow.outQuantity) + toolUtil.toNum(outBillInfo.outQuantity)
          newRow.acceptQuantity = toolUtil.toNum(newRow.acceptQuantity) + toolUtil.toNum(outBillInfo.acceptQuantity)
          newRow.returnQuantity = toolUtil.toNum(newRow.returnQuantity) + toolUtil.toNum(outBillInfo.returnQuantity)
          newRow.settlementQuantity = toolUtil.toNum(newRow.settlementQuantity) + toolUtil.toNum(outBillInfo.settlementQuantity)
        }
        newRow.outBillList.push({
          outBillType: outBillInfo.outBillType,
          outBillNo: outBillInfo.outBillNo,
          outProductNo: outBillInfo.outProductNo
        })
      }

      editForm.headlineCode = this.defaultNull(firstRow.headlineCode)
      editForm.headlineName = this.defaultNull(firstRow.headlineName)
      editForm.customerCode = this.defaultNull(firstRow.customerCode)
      editForm.customerName = this.defaultNull(firstRow.customerName)
      editForm.contractNo = this.defaultNull(firstRow.contractNo)
      editForm.lotNo = this.defaultNull(firstRow.lotNo)
      editForm.settlementBillType = this.defaultNull(firstRow.srcBillType)
      editForm.settlementBillNo = this.defaultNull(firstRow.srcBillNo)
      editForm.tradeType = this.defaultNull(firstRow.tradeType)
      editForm.currency = this.defaultNull(firstRow.currency)
      editForm.bizDeptCode = this.defaultNull(firstRow.bizDeptCode)
      editForm.bizEmployeeCode = this.defaultNull(firstRow.bizEmployeeCode)
      editForm.bizOrganName = this.defaultNull(firstRow.bizOrganName)
      editForm.bizDeptName = this.defaultNull(firstRow.bizDeptName)
      editForm.bizEmployeeName = this.defaultNull(firstRow.bizEmployeeName)
      editForm.amount = null
      editForm.taxAmount = null

      for (let i = 0; i < prdDtlList.length; i++) {
        const row = prdDtlList[i]
        const settlementPrice = toolUtil.toNum(row.settlementPrice)
        const settlementTfprice = toolUtil.toNum(row.settlementTfprice)
        const settlementQuantity = toolUtil.toNum(row.settlementQuantity)
        let taxedAmount = null
        let taxFreeAmount = null
        let taxAmount = null
        if (settlementQuantity !== null) {
          if (settlementPrice !== null) {
            taxedAmount = toolUtil.toNum(settlementQuantity * settlementPrice)
          }
          if (settlementTfprice !== null) {
            taxFreeAmount = toolUtil.toNum(settlementQuantity * settlementTfprice)
          }
          if (taxedAmount !== null && taxFreeAmount !== null) {
            taxAmount = toolUtil.toNum(taxedAmount - taxFreeAmount)
          }
        }
        row.taxedAmount = taxedAmount
        row.taxFreeAmount = taxFreeAmount
        row.taxAmount = taxAmount
      }
      this.calcSttList()

      // 检索费用
      const inBillKeyList = []
      for (let i = 0; i < prdDtlList.length; i++) {
        inBillKeyList.push({
          billType: prdDtlList[i].outBillType,
          billNo: prdDtlList[i].outBillNo,
          billDtlNo: prdDtlList[i].outProductNo
        })
      }
      request({
        url: '/api/contract/ssFeeDetail/listByOutBill',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: inBillKeyList
        }
      }).then(response => {
        if (response.status) {
          if (Array.isArray(response.data)) {
            for (let i = 0; i < response.data.length; i++) {
              const row = response.data[i]
              row.settlementPrice = row.feePrice
              row.settlementTfprice = row.feeTaxfreePrice
              row.settlementQuantity = row.feeQuantity
              row.settlementTaxRate = row.feeTaxRate
              row.taxedAmount = toolUtil.toNum(row.feePrice) * toolUtil.toNum(row.feeQuantity)
              row.taxFreeAmount = toolUtil.toNum(row.feeTaxfreePrice) * toolUtil.toNum(row.feeQuantity)
              row.taxAmount = toolUtil.toNum(row.taxedAmount) - toolUtil.toNum(row.taxFreeAmount)
              feeDtlList.push(row)
            }
            this.calcSttList()
          }
        }
      })
    },
    viewUpdate() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '1' && editForm.auditStatus !== '4') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.updateAuditCheck') }))
        return
      }
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'salesSettlementUpdate',
          params: {
            type: 'update',
            back: 'salesSettlement',
            settlementNo: editForm.settlementNo
          }
        })
      })
    },
    viewRemove() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      if (editForm.auditStatus !== '1' && editForm.auditStatus !== '4') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.removeAuditCheck') }))
        return
      }
      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          request({
            url: '/api/contract/ssInfo/remove',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: editForm.settlementNo
            }
          }).then(response => {
            if (response.status) {
              this.$store.dispatch('delVisitedViews', this.$route).then(() => this.$router.push({ name: 'salesSettlement' }))
            }
          })
        })
        .catch(() => {})
    },
    calcSttList() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      const prdDtlList = toolUtil.getDataTabFromEdit(this, 'prdDtlList')
      const feeDtlList = toolUtil.getDataTabFromEdit(this, 'feeDtlList')
      const sttDtlList = toolUtil.getDataTabFromEdit(this, 'sttDtlList')
      sttDtlList.splice(0)

      for (let i = 0; i < prdDtlList.length; i++) {
        const row = prdDtlList[i]
        sttDtlList.push({
          productCode: row.productCode,
          productName: row.productName,
          brand: row.brand,
          spec: row.spec,
          origin: row.origin,
          productKeyAttr01: row.productKeyAttr01,
          productKeyAttr02: row.productKeyAttr02,
          productKeyAttr03: row.productKeyAttr03,
          fundType: '货款',
          settlementPrice: row.settlementPrice,
          settlementTfprice: row.settlementTfprice,
          settlementQuantity: row.settlementQuantity,
          settlementTaxRate: row.settlementTaxRate,
          taxedAmount: row.taxedAmount,
          taxFreeAmount: row.taxFreeAmount,
          taxAmount: row.taxAmount,
          outBillList: row.outBillList
        })
      }

      if (editForm.settlementType === '1') {
        // 一票制
        for (let i = 0; i < feeDtlList.length; i++) {
          const feeRow = feeDtlList[i]
          // 应收计负数，应付计正数
          const dir = feeRow.feeDirection === '1' ? 1 : -1
          for (let j = 0; j < sttDtlList.length; j++) {
            const row = sttDtlList[j]
            let matchFlag = false
            for (let k = 0; k < row.outBillList.length; k++) {
              if (row.outBillList[i].outBillType === feeRow.outBillType && row.outBillList[i].outBillNo === feeRow.outBillNo && row.outBillList[i].outProductNo === feeRow.outProductNo) {
                matchFlag = true
                break
              }
            }
            if (matchFlag) {
              row.taxFreeAmount = toolUtil.toNum(row.taxFreeAmount) + toolUtil.toNum(feeRow.taxFreeAmount) * dir
              break
            }
          }
          for (let j = 0; j < sttDtlList.length; j++) {
            const row = sttDtlList[j]
            const taxFreeAmount = toolUtil.toNum(row.taxFreeAmount)
            const settlementQuantity = toolUtil.toNum(row.settlementQuantity)
            const settlementTaxRate = toolUtil.toNum(row.settlementTaxRate)
            row.taxAmount = (taxFreeAmount * settlementTaxRate) / 100
            row.taxedAmount = taxFreeAmount + toolUtil.toNum(row.taxAmount)
            row.settlementPrice = toolUtil.toNum(row.taxedAmount) / settlementQuantity
            row.settlementTfprice = taxFreeAmount / settlementQuantity
          }
        }
      } else {
        // 两票制
        for (let i = 0; i < feeDtlList.length; i++) {
          const row = feeDtlList[i]
          // 应收计负数，应付计正数
          const dir = row.feeDirection === '1' ? 1 : -1
          sttDtlList.push({
            productCode: row.productCode,
            productName: row.productName,
            brand: row.brand,
            spec: row.spec,
            origin: row.origin,
            productKeyAttr01: row.productKeyAttr01,
            productKeyAttr02: row.productKeyAttr02,
            productKeyAttr03: row.productKeyAttr03,
            fundType: row.feeTypeName,
            settlementPrice: toolUtil.toNum(row.settlementPrice) * dir,
            settlementTfprice: toolUtil.toNum(row.settlementTfprice) * dir,
            settlementQuantity: row.settlementQuantity,
            settlementTaxRate: row.settlementTaxRate,
            taxedAmount: toolUtil.toNum(row.taxedAmount) * dir,
            taxFreeAmount: toolUtil.toNum(row.taxFreeAmount) * dir,
            taxAmount: toolUtil.toNum(row.taxAmount) * dir
          })
        }
      }
      let taxedAmountSum = null
      let taxFreeAmountSum = null
      let taxAmountSum = null
      for (let j = 0; j < sttDtlList.length; j++) {
        const row = sttDtlList[j]
        const taxedAmount = toolUtil.toNum(row.taxedAmount)
        const taxFreeAmount = toolUtil.toNum(row.taxFreeAmount)
        const taxAmount = toolUtil.toNum(row.taxAmount)
        if (taxedAmount !== null) {
          taxedAmountSum = taxedAmountSum + taxedAmount
        }
        if (taxFreeAmount !== null) {
          taxFreeAmountSum = taxFreeAmountSum + taxFreeAmount
        }
        if (taxAmount !== null) {
          taxAmountSum = taxAmountSum + taxAmount
        }
      }
      editForm.amount = taxedAmountSum
      editForm.taxFreeAmount = taxFreeAmountSum
      editForm.taxAmount = taxAmountSum
    },
    defaultNull(val) {
      return val === undefined ? null : val
    }
  }
}
</script>
