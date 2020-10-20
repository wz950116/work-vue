
<template>
  <qm-edit :edit="edit" @closeDialog="handleCloseDialog" ref="qmEdit" @closeLv2Dialog="closeLv2Dialog" @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import Vue from 'vue'
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'ladingBillEdit',
  data() {
    return {
      edit: {
        type: this.param.type,
        mode: this.opMode,
        param: this.param,
        api: {
          view: '/api/finance/voucher/get',
          save: '/api/warehouse/whLadingBill/save',
          update: '/api/warehouse/whLadingBill/update',
          pre: {
            CON_PL_INFO: '/api/contract/plProductDetail/listChoose'
          }
        },
        apiData: {
          pre(param) {
            return {
              lotNo: param.preBillNo
            }
          },
          view(param) {
            return param.data
          }
        },
        topButtons: [
          //   // {
          //   //   iconName: '线性-关闭',
          //   //   name: 'biz.btn.close',
          //   //   event: 'close',
          //   //   isShow: ['view'],
          //   //   attrs: {
          //   //     type: 'primary'
          //   //   }
          //   // }
          //   // {
          //   //   iconName: '线性-关闭',
          //   //   name: 'biz.btn.close',
          //   //   event: 'close',
          //   //   isShow: ['assist', 'audit']
          //   // },
          //   // {
          //   //   iconName: '线性-取消',
          //   //   name: 'biz.btn.cancel',
          //   //   event: 'cancel',
          //   //   isShow: ['add', 'update']
          //   // },
          //   // {
          //   //   name: 'biz.btn.save',
          //   //   iconName: '线性-保存',
          //   //   event: 'save',
          //   //   showLoading: true,
          //   //   type: 'primary',
          //   //   isShow: ['add', 'update'],
          //   //   attrs: {
          //   //     type: 'primary'
          //   //   }
          //   // },
          //   // {
          //   //   iconName: '线性-审核',
          //   //   name: 'biz.btn.audit',
          //   //   getParam() {
          //   //     return this.param
          //   //   },
          //   //   event: 'audit',
          //   //   isShow: ['assist', 'audit'],
          //   //   attrs: {
          //   //     type: 'primary'
          //   //   }
          //   // },
          //   // {
          //   //   iconName: '线性-审核历史',
          //   //   name: 'biz.btn.auditHistory',
          //   //   $route: this.$route,
          //   //   getParam: this.getParamAuditHistory,
          //   //   event: 'auditHistory',
          //   //   isShow: ['update', 'view', 'assist', 'audit']
          //   // },
          //   // {
          //   //   iconName: '线性-附件',
          //   //   name: 'biz.btn.uploadAttachment',
          //   //   $route: this.$route,
          //   //   getParam(data) {
          //   //     return {
          //   //       billNo: data.uk || data.id,
          //   //       billType: this.$route.meta.bizCode
          //   //     }
          //   //   },
          //   //   event: 'attachment',
          //   //   isShow: ['update', 'view', 'assist', 'audit']
          //   // },
          //   // {
          //   //   iconName: '线性-批次详情',
          //   //   name: 'biz.btn.purchaseLot',
          //   //   isShow: ['add', 'update'],
          //   //   event: this.onBatchDetail,
          //   //   permitName: ['purchaseLot']
          //   // }
          //   // // {
          //   // //   iconName: '线性-新增',
          //   // //   name: 'biz.btn.productItem',
          //   // //   isShow: ['add', 'update'],
          //   // //   permitName: ['productItem'],
          //   // //   event: 'set',
          //   // //   component: () => import('@/views/frame/biz/data/productItem/choose.vue'), // 组件
          //   // //   callback: this.closeProductItemCallback // 关闭弹窗回调
          //   // // }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: '主信息',
            content: [
              {
                label: '凭证号',
                prop: 'voucherNo',
                element: 'input-validate',
                attrs: {
                  disabled: false,
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              {
                type: 'date',
                label: '凭证日期',
                prop: 'voucherDate',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  type: 'start',
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: '凭证类型',
                prop: 'voucherType',
                element: 'input-validate',
                list: [
                  { label: '记', value: '1' },
                  { label: '转', value: '2' }
                ],
                attrs: {
                  disabled: false,
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              {
                label: '附件张数',
                prop: 'annexNum',
                element: 'input-validate',
                attrs: {
                  disabled: false,
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              }
            ]
          },
          table: {
            titleName: '明细',
            data: 'mxDtoList',
            table: true,
            getSummaries: param => {
              const { columns, data } = param
              const sums = []
              columns.forEach((column, index) => {
                if (index === 0) {
                  sums[index] = '总价'
                  return
                }
                if (index === 1) {
                  sums[index] = ''
                  return
                }
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                  sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                      return prev + curr
                    } else {
                      return prev
                    }
                  }, 0)
                  sums[index] += ' 元'
                } else {
                  sums[index] = ''
                }
              })
              return sums
            },
            content: [
              { label: '摘要', prop: 'remark' },
              { label: '科目代码', prop: 'subjectCode' },
              { label: '科目名称', prop: 'subjectName' },
              { label: '借方', prop: 'debit' },
              { label: '贷方', prop: 'lender' }
            ]
          },
          part2: {
            titleName: '其他信息',
            content: [
              { label: '单位', prop: 'reservedStr1', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '机构', prop: 'reservedStr2', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '部门', prop: 'reservedStr3', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '职员', prop: 'reservedStr4', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '单据号', prop: 'pzBillNo', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '结算方式', prop: 'reservedStr5', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '日期', prop: 'reservedStr6', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '数量', prop: 'reservedNum1', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '币种', prop: 'reservedStr7', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] },
              { label: '汇率', prop: 'reservedNum2', element: 'input-validate', attrs: { disabled: false, clearable: true }, validate: [{ required: true, trigger: 'blur' }] }
            ]
          }
        }
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
    handlePreCallback(result) {
      if (result.length === 0) {
        this.$notify(notifyError({ msg: this.$t('storage.ladingBill.msg.noPostData') }))
        return
      }
      this.closeLv2Dialog(result)

      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.supplierCode = this.$route.params.supplierCode
    },
    getBillNoRequired() {
      const seqMode = this.$route.meta.seqMode
      // 手动则必输
      if (seqMode && seqMode === '1') {
        return true
      } else {
        return false
      }
    },
    getBillNoDisabled() {
      const seqMode = this.$route.meta.seqMode
      // 自动则disabled
      if (seqMode && seqMode === '0') {
        return true
      } else {
        return false
      }
    },
    changeAllSupplier(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.supplierName = item.name
    },
    changeAllDeliver(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.deliverName = item.name
    },
    onBatchDetail() {
      Vue.component('view-form-edit', () => import('@/views/frame/biz/spot/components/chooseLotProductPl.vue'))
      this.$refs.qmEdit.$refs.qmRouteEdit.dialogLv2Visible = true
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    },
    closeProductItemCallback(params) {
      if (params) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.ladingType = 'TEMP'
        const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.whLadingBillProductDtoList[0].$refs.tab.tableData
        const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        productList.splice(0)
        editForm.preBillNo = ''
        params.forEach((row, index) => {
          const newData = {}
          newData['productCode'] = row.productCode
          newData['productName'] = row.productName
          newData['brand'] = row.brand
          newData['spec'] = row.spec
          newData['origin'] = row.origin
          newData['productKeyAttr01'] = row.productKeyAttr01
          newData['productKeyAttr02'] = row.productKeyAttr02
          newData['productKeyAttr03'] = row.productKeyAttr03
          newData['productUnitCode'] = row.productUnitCode
          newData['measurementUnitCode'] = row.measurementUnitCode
          newData['rightFlag'] = '0'
          productList.push(newData)
        })
      }

      this.resetOptions(null)
    },
    closeLv2Dialog(params) {
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.whLadingBillProductDtoList[0].$refs.tab.tableData
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      const lotInfo = params[0].lot
      editForm.preBillNo = lotInfo.lotNo
      editForm.supplierCode = lotInfo.supplierCodeList[0]
      editForm.ladingType = 'LOT'
      editForm.lotNo = lotInfo.lotNo
      editForm.contractNo = lotInfo.contractNo
      for (let i = 0; i < params.length; i++) {
        if (params[i].lotNo !== lotInfo.lotNo) {
          this.$notify(notifyInfo({ msg: this.$t('storage.ladingBill.msg.chooseLotProduct') }))
          return
        }
        params[i].lotProductDetailCode = params[i].productDetailNo
        params[i].preBillProductDetailCode = params[i].productDetailNo
        params[i].ladingQuantity = params[i].rmnPrdQty
        params[i].measurementQuantity = params[i].rmnMemQty
        params[i].id = null
        params[i].versionNum = null
      }

      const newData = []
      for (let i = 0; i < productList.length; i++) {
        if (productList[i].lotNo === lotInfo.lotNo) {
          newData.push({
            lotNo: productList[i].lotNo,
            lotProductDetailCode: productList[i].lotProductDetailCode,
            preBillProductDetailCode: productList[i].preBillProductDetailCode,
            productCode: productList[i].productCode,
            productName: productList[i].productName,
            brand: productList[i].brand,
            spec: productList[i].spec,
            origin: productList[i].origin,
            productKeyAttr01: productList[i].productKeyAttr01,
            productKeyAttr02: productList[i].productKeyAttr02,
            productKeyAttr03: productList[i].productKeyAttr03,
            ladingQuantity: productList[i].ladingQuantity,
            measurementQuantity: productList[i].measurementQuantity,
            productUnitCode: productList[i].productUnitCode,
            measurementUnitCode: productList[i].measurementUnitCode,
            rightFlag: productList[i].rightFlag
          })
        }
      }

      for (let i = 0; i < params.length; i++) {
        newData.push({
          lotNo: params[i].lotNo,
          lotProductDetailCode: params[i].productDetailNo,
          preBillProductDetailCode: params[i].productDetailNo,
          productCode: params[i].productCode,
          productName: params[i].productName,
          brand: params[i].brand,
          spec: params[i].spec,
          origin: params[i].origin,
          productKeyAttr01: params[i].productKeyAttr01,
          productKeyAttr02: params[i].productKeyAttr02,
          productKeyAttr03: params[i].productKeyAttr03,
          ladingQuantity: params[i].ladingQuantity,
          measurementQuantity: params[i].measurementQuantity,
          productUnitCode: params[i].productUnitCode,
          measurementUnitCode: params[i].measurementUnitCode,
          rightFlag: '0'
        })
      }

      productList.splice(0)
      for (let i = 0; i < newData.length; i++) {
        productList.push(newData[i])
      }

      this.resetOptions(lotInfo)
    },
    async resetOptions(lotInfo) {
      const supplierList = []

      if (lotInfo) {
        lotInfo.supplierCodeList.forEach((s, index) => {
          supplierList.push({
            code: s,
            name: lotInfo.supplierNames.split(',')[index]
          })
        })
      } else {
        // 传空时base select 会默认处理
      }

      this.edit.formData.part1.content.forEach(f => {
        if (f.prop === 'supplierCode') {
          f.list = supplierList
        }
      })
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.ladingBillNo // 变量值
      }
    }
  }
}
</script>
