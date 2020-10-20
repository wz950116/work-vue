<template>
  <qm-edit :edit="edit" @closeDialog="handleCloseDialog" ref="qmEdit" @initCallback='handleInitCallback' @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import Vue from 'vue'
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  name: 'ladingOutEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/warehouse/whLadingOut/getInfoByLadingOutNo',
          save: '/api/warehouse/whLadingOut/save',
          update: '/api/warehouse/whLadingOut/update',
          complete: '/api/warehouse/whLadingOut/complete',
          pre: {
            CON_SL_INFO: '/api/contract/slProductDetail/listChoose'
          }
        },
        apiData: {
          pre(param) {
            if (param.preBillType === 'CON_SL_INFO') {
              return {
                lotNo: param.preBillNo
              }
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
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update', 'assist', 'audit', 'complete']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            type: 'primary',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            isShow: ['complete'],
            attrs: {
              type: 'primary'
            }
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
          // edit 打印
          {
            // 附件
            iconName: '线性-打印',
            permitName: ['print'],
            name: 'biz.btn.print',
            getParam(data) {
              return {
                ladingOutNo: data.uk || data.ladingOutNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-批次详情',
            name: 'biz.btn.salesLot',
            isShow: ['add', 'update'],

            event: 'set',
            component: () => import('@/views/frame/biz/spot/dialog/storage/chooseLotProductSl.vue'), // 组件
            callback: this.closeLotProductSlCallback, // 关闭弹窗回调
            beforeCallback: this.closeLotProductSlCallbackValidate, // 关闭弹窗之前的验证 return true or false
            permitName: ['salesLot']
          },
          {
            iconName: '线性-新增',
            name: 'biz.btn.productItem',
            isShow: ['add', 'update'],
            permitName: ['productItem'],
            event: 'set',
            component: () => import('@/views/frame/biz/data/productItem/choose.vue'), // 组件
            callback: this.closeProductItemCallback // 关闭弹窗回调
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.ladingOut.group.editFormPart1',
            content: [
              {
                label: 'storage.ladingOut.form.ladingOutNo',
                prop: 'ladingOutNo',
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
                label: 'storage.ladingOut.form.ladingOutDate',
                prop: 'ladingOutDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                default: toolUtil.todayYYYYMMDD(),
                attrs: {
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'storage.ladingOut.form.ladingOutType',
                prop: 'ladingOutType',
                element: 'base-select',
                list: this.$t('datadict.ladingOutType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.ladingOut.form.lotNo',
                prop: 'preBillNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.ladingOut.form.currencyCode',
                prop: 'currencyCode',
                element: 'base-select',
                list: this.$t('datadict.currency'),
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
                label: 'storage.ladingOut.form.customerCode',
                prop: 'customerCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                list: [],
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '1',
                    auditStatus: '3'
                  },
                  clearable: true,
                  filterable: true,
                  disabled: this.$route.params.type === 'complete'
                },
                event: {
                  changeAll: this.changeAll
                }
              },
              {
                label: 'storage.ladingOut.form.settlementCode',
                prop: 'settlementCode',
                element: 'base-select',
                validate: [
                  {
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '1',
                    auditStatus: '3'
                  },
                  clearable: true,
                  filterable: true,
                  disabled: this.$route.params.type === 'complete'
                },
                event: {
                  changeAll: this.changeAllTle
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
                  clearable: true,
                  disabled: this.$route.params.type === 'complete'
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
                  clearable: true,
                  disabled: this.$route.params.type === 'complete'
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
                  clearable: true,
                  disabled: this.$route.params.type === 'complete'
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
                label: 'storage.ladingOut.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  maxlength: 500,
                  cols: 3
                }
              },
              {
                prop: 'customerName',
                isShow: false
              },
              {
                prop: 'settlementName',
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
        tables: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'whLadingOutProductDtoList',
            required: true,
            label: 'storage.ladingOut.tab.product',
            component: () => import('./productTab.vue')
          }
          // {
          //   isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
          //   name: 'whLadingOutPickDtoList',
          //   required: true,
          //   label: 'storage.ladingOut.tab.productPick',
          //   component: () => import('./productPickTab.vue')
          // }
        ],
        tabs: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'whLadingOutPickDtoList',
            required: true,
            label: 'storage.ladingOut.tab.productPick',
            component: () => import('./productPickTab.vue')
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'whLadingOutCostList',
            label: 'storage.outNotice.tab.cost',
            component: () => import('../components/costTab.vue')
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
        return {
          billType: this.$route.meta.bizCode
        }
      }
    }
  },
  mounted() {
    if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.ladingOutType === 'TEMP') {
      this.setDisable('currencyCode', false)
    }
  },
  methods: {
    handlePreCallback(result) {
      if (result.length === 0) {
        this.$notify(notifyError({ msg: this.$t('storage.ladingOut.msg.noPostData') }))
        return
      }
      this.closeLotProductSlCallback(result)
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.supplierCode = this.$route.params.customerCode
    },
    // 初始化页面隐藏价格
    handleInitCallback(param) {
      // 商品费用相关列禁用
      if (param.ladingOutType === 'TEMP') {
        this.setProdColsDisable(false)
        this.setDisable('currencyCode', false)
      } else {
        this.setProdColsDisable(true)
        this.setDisable('currencyCode', true)
      }
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
    changeAll(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.customerName = item.name
    },
    changeAllTle(item) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.settlementName = item.name
    },
    onBatchDetail() {
      Vue.component('view-form-edit', () => import('@/views/frame/biz/spot/dialog/storage/chooseLotProductSl.vue'))
      this.$refs.qmEdit.$refs.qmRouteEdit.dialogLv2Visible = true
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
    },

    closeProductItemCallback(params) {
      if (params) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.ladingOutType = 'TEMP'
        const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.whLadingOutProductDtoList[0].$refs.tab.tableData
        productList.splice(0)
        this.setDisable('currencyCode', false)
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
          newData['goodsFlag'] = '0'
          productList.push(newData)
        })

        this.setProdColsDisable(false)
      }

      // 设置客户下拉
      this.resetOptions(null)
    },
    closeLotProductSlCallbackValidate(params) {
      const lotInfo = params[0].lot
      for (let i = 0; i < params.length; i++) {
        if (params[i].lotNo !== lotInfo.lotNo) {
          this.$notify(
            notifyInfo({
              msg: this.$t('storage.ladingOut.msg.chooseLotProduct')
            })
          )
          return false
        }
      }
      return true
    },
    closeLotProductSlCallback(params) {
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.whLadingOutProductDtoList[0].$refs.tab.tableData
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      const lotInfo = params[0].lot
      editForm.preBillNo = lotInfo.lotNo
      editForm.currencyCode = lotInfo.currency
      editForm.lotNo = lotInfo.lotNo
      editForm.contractNo = lotInfo.contractNo
      this.setDisable('currencyCode', true)
      editForm.ladingOutType = 'LOT'
      editForm.customerCode = lotInfo.customerCodeList[0]
      productList.splice(0)
      for (let i = 0; i < params.length; i++) {
        if (params[i].lotNo !== lotInfo.lotNo) {
          this.$notify(
            notifyInfo({
              msg: this.$t('storage.ladingOut.msg.chooseLotProduct')
            })
          )
          return
        }
        params[i].lotProductDetailCode = params[i].productDetailNo
        params[i].preBillProductDetailCode = params[i].productDetailNo
        params[i].outQuantity = params[i].rmnPrdQty
        params[i].measurementQuantity = params[i].rmnMemQty
        params[i].id = null
        params[i].versionNum = null
        params[i].includeTaxPrice = 0
        params[i].includeTaxAmount = 0
        params[i].excludeTaxPrice = 0
        params[i].excludeTaxAmount = 0
        params[i].taxRate = 0
        params[i].taxAmount = 0
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
            outQuantity: productList[i].outQuantity,
            measurementQuantity: productList[i].measurementQuantity,
            productUnitCode: productList[i].productUnitCode,
            measurementUnitCode: productList[i].measurementUnitCode,
            rightFlag: productList[i].rightFlag,
            goodsFlag: productList[i].goodsFlag
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
          outQuantity: params[i].rmnPrdQty,
          measurementQuantity: params[i].rmnMemQty,
          productUnitCode: params[i].productUnitCode,
          measurementUnitCode: params[i].measurementUnitCode,
          rightFlag: '0',
          goodsFlag: '0'
        })
      }

      productList.splice(0)
      for (let i = 0; i < newData.length; i++) {
        productList.push(newData[i])
      }

      // 商品费用相关列禁用
      this.setProdColsDisable(true)
      // 设置客户下拉
      this.resetOptions(lotInfo)
    },
    setProdColsDisable(disable) {
      const tableCols = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.whLadingOutProductDtoList[0].$refs.tab.tableCols
      tableCols.forEach(col => {
        if (['includeTaxPrice', 'taxRate'].includes(col.prop)) {
          col.attrs.disabled = disable
          col.required = !disable
        }
        // 修改为隐藏了
        if (['includeTaxPrice', 'includeTaxAmount', 'excludeTaxPrice', 'excludeTaxAmount', 'taxRate', 'taxAmount'].includes(col.prop)) {
          col.isShow = !disable
        }
      })
    },
    setDisable(prop, disable) {
      this.edit.formData.part1.content.forEach(item => {
        if (item.prop === prop) {
          item.attrs.disabled = disable
        }
      })
    },
    async resetOptions(lotInfo) {
      const supplierList = []

      if (lotInfo) {
        lotInfo.customerCodeList.forEach((s, index) => {
          supplierList.push({
            code: s,
            name: lotInfo.customerNames.split(',')[index]
          })
        })
      } else {
        // 传空时base select 会默认处理
      }

      this.edit.formData.part1.content.forEach(f => {
        if (f.prop === 'customerCode') {
          f.list = supplierList
        }
      })
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.ladingOutNo // 变量值
      }
    }
  }
}
</script>
