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
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        baseBillNo: this.$route.params.uk || this.$route.params.id,
        api: {
          view: '/api/warehouse/whLadingBill/get',
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
            return param.uk || param.id
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
            iconName: '线性-关闭',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['assist', 'audit']
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
            showAttachment: true,
            type: 'primary',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-审核',
            name: 'biz.btn.audit',
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
            getParam: this.getParamAuditHistory,
            event: 'auditHistory',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.id,
                billType: this.$route.meta.bizCode
              }
            },
            event: 'attachment',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-批次详情',
            name: 'biz.btn.purchaseLot',
            isShow: ['add', 'update'],
            event: this.onBatchDetail,
            permitName: ['purchaseLot']
          },
          // edit 打印
          {
            // 附件
            iconName: '线性-打印',
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                ladingBillNo: data.uk || data.ladingBillNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
          // ,
          // {
          //   iconName: '线性-新增',
          //   name: 'biz.btn.productItem',
          //   isShow: ['add', 'update'],
          //   permitName: ['productItem'],
          //   event: 'set',
          //   component: () => import('@/views/frame/biz/data/productItem/choose.vue'), // 组件
          //   callback: this.closeProductItemCallback // 关闭弹窗回调
          // }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.ladingBill.group.editFormPart1',
            content: [
              {
                label: 'storage.ladingBill.form.ladingBillNo',
                prop: 'ladingBillNo',
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
                label: 'storage.ladingBill.form.ladingDate',
                prop: 'ladingDate',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                default: toolUtil.todayYYYYMMDD(),
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'storage.ladingBill.form.ladingType',
                prop: 'ladingType',
                element: 'base-select',
                list: this.$t('datadict.ladingType'),
                validate: [
                  {
                    required: true
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.ladingBill.form.lotNo',
                prop: 'preBillNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.ladingBill.form.supplierCode',
                prop: 'supplierCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  cols: 2,
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '2',
                    auditStatus: '3'
                  },
                  clearable: true,
                  filterable: true
                },
                event: {
                  changeAll: this.changeAllSupplier
                }
              },
              {
                label: 'storage.ladingBill.form.originNo',
                prop: 'originNo',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'storage.ladingBill.form.deliverCode',
                prop: 'deliverCode',
                element: 'base-select',
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  cols: 2,
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '2',
                    auditStatus: '3'
                  },
                  clearable: true,
                  filterable: true
                },
                event: {
                  changeAll: this.changeAllDeliver
                },
                isShow: false
              },
              {
                label: 'biz.lbl.bizOrganName',
                prop: 'bizOrganCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userOrganCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  filterable: true,
                  data: 'FUNC_ORG',
                  clearable: true
                }
              },
              {
                label: 'biz.lbl.bizDeptName',
                prop: 'bizDeptCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userDeptCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_DEPT',
                  filterable: true,
                  clearable: true
                }
              },
              {
                label: 'biz.lbl.bizEmployeeName',
                prop: 'bizEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  clearable: true
                }
              },
              {
                label: 'biz.lbl.optName',
                prop: 'optEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              },
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  clearable: true,
                  maxlength: 500,
                  cols: 3
                }
              },
              {
                prop: 'supplierName',
                isShow: false
              },
              {
                prop: 'deliverName',
                isShow: false
              },
              {
                prop: 'lotNo',
                isShow: false
              },
              {
                prop: 'contractNo',
                isShow: false
              }
            ]
          }
        },
        tabs: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'whLadingBillProductDtoList',
            required: true,
            label: 'storage.ladingBill.tab.product',
            component: () => import('./inProduct.vue')
          }
        ]
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
    changeAllSupplier(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.supplierName = item.name
    },
    changeAllDeliver(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.deliverName = item.name
    },
    onBatchDetail() {
      Vue.component('view-form-edit', () => import('@/views/frame/biz/spot/dialog/storage/chooseLotProductPl.vue'))
      this.$refs.qmEdit.$refs.qmRouteEdit.dialogLv2Visible = true
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: Object.assign({}, this.$route.params.backParam, { refresh: !!param })
        })
      })
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
          this.$notify(
            notifyInfo({
              msg: this.$t('storage.ladingBill.msg.chooseLotProduct')
            })
          )
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
