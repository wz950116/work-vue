<template>
  <qm-edit :edit="edit" @closeDialog="handleCloseDialog" ref="qmEdit" @initCallback='handleInitCallback' @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'inNoticeEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/warehouse/inBill/get',
          save: '/api/warehouse/inBill/save',
          update: '/api/warehouse/inBill/update',
          complete: '/api/warehouse/inBill/complete',
          pre: {
            WH_LADING_BILL: '/api/warehouse/whLadingBillProduct/page',
            CON_PL_INFO: '/api/contract/plProductDetail/listChoose'
          }
        },
        apiData: {
          pre(param) {
            if (param.preBillType === 'WH_LADING_BILL') {
              return {
                ladingBillNo: param.preBillNo
              }
            }
            if (param.preBillType === 'CON_PL_INFO') {
              return {
                lotNo: param.preBillNo
              }
            }
          },
          view(param) {
            return param.uk || param.inBillNo
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
            isShow: ['add', 'update', 'assist', 'audit', 'complete']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            },
            extraEvent: this.waningCheck
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
            getParam() {
              return {
                moduleCode: this.$route.meta.bpmModule,
                uk: this.$route.params.uk || this.$route.params.inBillNo
              }
            },
            event: 'auditHistory',
            isShow: ['update', 'view', 'assist', 'audit']
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.inBillNo,
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
                inBillNo: data.uk || data.inBillNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-批次详情',
            name: 'biz.btn.purchaseLot',
            event: 'set',
            validate: this.onPurchaseLot,
            isShow: ['add', 'update'],
            permitName: ['purchaseLot'],
            component: () => import('@/views/frame/biz/spot/dialog/storage/chooseLotProductPl.vue'),
            setDefault: this.lotNoSetDefault,
            callback: this.lotNoCallback
          },
          {
            iconName: '线性-提单',
            name: 'biz.btn.ladingBill',
            event: 'set',
            validate: this.onLadingBill,
            isShow: ['add', 'update'],
            permitName: ['ladingBill'],
            component: () => import('@/views/frame/biz/storage/stock/ladingBillSelect.vue'),
            setDefault: this.ladingNoSetDefault,
            callback: this.ladingNoCallback
          },
          // 物资商品入库
          {
            iconName: '线性-新增',
            name: 'biz.btn.productItem',
            isShow: ['add', 'update'],
            permitName: ['productItem'],
            event: 'set',
            component: () => import('@/views/frame/biz/data/productItem/choose.vue'), // 组件
            callback: this.closeProductItemCallback // 关闭弹窗回调
          },
          // 销售退货
          {
            iconName: '线性-新增',
            name: 'biz.btn.sellReturn',
            isShow: ['add', 'update'],
            event: 'set',
            component: () => import('@/views/frame/biz/storage/components/outReturnDialog.vue'), // 组件
            initChoose: this.returnDialogChoose,
            callback: this.returnDialogCallback // 关闭弹窗回调
          },
          // 销售换货
          {
            iconName: '线性-新增',
            name: 'biz.btn.sellExchange',
            isShow: ['add', 'update'],
            event: 'set',
            component: () => import('@/views/frame/biz/storage/components/outReturnDialog.vue'), // 组件
            initChoose: this.exchangeDialogChoose,
            callback: this.exchangeDialogCallback // 关闭弹窗回调
          },
          // 采购换货
          {
            iconName: '线性-新增',
            name: 'biz.btn.purchaseExchange',
            isShow: ['add', 'update'],
            event: 'set',
            component: () => import('@/views/frame/biz/storage/components/inExchangeDialog.vue'), // 组件
            initChoose: this.exchangeDialogChoose,
            callback: this.purchaseExchangeDialogCallback // 关闭弹窗回调
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.inNotice.group.editFormPart1',
            content: [
              {
                label: 'storage.inNotice.form.inBillNo',
                prop: 'inBillNo',
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
                label: 'storage.inNotice.form.inDate',
                prop: 'inDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'storage.inNotice.form.inType',
                prop: 'inType',
                element: 'base-select',
                list: this.$t('datadict.inNormalType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: true
                },
                // default: 'LOT',
                event: this.onInTypeChange
              },
              {
                label: 'storage.inNotice.form.ladingBillNo',
                prop: 'ladingBillNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.inNotice.form.supplierCode',
                prop: 'supplierCode',
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
                    typeCode: '2',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  filterable: true
                },
                event: {
                  evn: this.onSupplierCodeChange
                }
              },
              {
                label: 'storage.inNotice.form.deliverCode',
                prop: 'deliverCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'CUST_INFO',
                  params: {
                    typeCode: '2',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  filterable: true
                },
                isShow: false
              },
              {
                label: 'storage.inNotice.form.warehouseCode',
                prop: 'warehouseCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_WAREHOUSE',
                  disabled: this.$route.params.type === 'complete',
                  clearable: true
                }
              },
              {
                label: 'storage.inNotice.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.inNotice.form.contractNo',
                prop: 'contractNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                },
                isShow: false
              },
              // {
              //   label: 'storage.inNotice.form.headlineCode',
              //   prop: 'headlineCode',
              //   element: 'base-select',
              //   validate: [
              //     {
              //       required: true,
              //       trigger: 'change'
              //     }
              //   ],
              //   list: [],
              //   attrs: {
              //                        disabled: this.$route.params.type === 'complete',
              //     data: 'FUNC_ORG',
              //     clearable: true
              //   }
              // },
              {
                label: 'storage.inNotice.form.currencyCode',
                prop: 'currencyCode',
                element: 'base-select',
                list: this.$t('datadict.currency'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  disabled: this.$route.params.type === 'complete',
                  clearable: true
                }
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
                  disabled: this.$route.params.type === 'complete',
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
                  disabled: this.$route.params.type === 'complete',
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
                  disabled: this.$route.params.type === 'complete',
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
                label: 'storage.inNotice.form.outReturnNo',
                prop: 'outReturnNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'storage.inNotice.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  maxlength: 500,
                  cols: 3
                }
              }
            ]
          }
        },

        tables: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'inProductList',
            label: 'storage.inNotice.tab.product',
            component: () => import('./productTab.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'inBillCostList',
            label: 'storage.inNotice.tab.cost',
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
    if (this.$refs.qmEdit && this.$refs.qmEdit.$refs.qmRouteEdit && this.$refs.qmEdit.$refs.qmRouteEdit.editForm && this.$refs.qmEdit.$refs.qmRouteEdit.editForm.inType === 'TEMP') {
      this.setDisable('currencyCode', false)
    }
  },
  methods: {
    disabledListData(flag) {
      const detailList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].tab.table.cols
      detailList.forEach(e => {
        if (e.prop === 'measurementQuantity' || e.prop === 'inQuantity') {
          e.attrs.disabled = flag
        }
      })

      const formData = this.edit.formData.part1.content
      formData.forEach(e => {
        if (e.prop === 'currencyCode') {
          e.attrs.disabled = flag
        }
      })
    },
    returnDialogCallback(param) {
      for (let i = 0; i < param.length; i++) {
        if (param[i].inBillNo !== param[0].inBillNo) {
          this.$notify(notifyInfo({ msg: this.$t('storage.inNotice.validateMsg.chooseOutReturnProductBack') }))
          return
        }
      }

      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.inType = 'SELL_RETURN'
      editForm.outReturnNo = param[0].outReturnNo
      editForm.preBillType = 'WH_OUT_RETURN'
      editForm.preBillNo = param[0].outReturnNo
      editForm.warehouseCode = param[0].warehouseCode
      editForm.supplierCode = param[0].supplierCode
      editForm.settlementCode = param[0].supplierCode
      editForm.lotNo = param[0].lotNo
      editForm.contractNo = param[0].contractNo
      editForm.currencyCode = param[0].currencyCode
      this.genProduct(param, 'outReturnProductNo')
      this.disabledListData(true)
    },
    exchangeDialogCallback(param) {
      for (let i = 0; i < param.length; i++) {
        if (param[i].inBillNo !== param[0].inBillNo) {
          this.$notify(notifyInfo({ msg: this.$t('storage.inNotice.validateMsg.chooseOutReturnProductBack') }))
          return
        }
      }
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.inType = 'SELL_EXCHANGE'
      editForm.outReturnNo = param[0].outReturnNo
      editForm.preBillType = 'WH_OUT_RETURN'
      editForm.preBillNo = param[0].outReturnNo
      editForm.lotNo = param[0].lotNo
      editForm.contractNo = param[0].contractNo
      editForm.warehouseCode = param[0].warehouseCode
      editForm.supplierCode = param[0].supplierCode
      editForm.settlementCode = param[0].supplierCode
      editForm.currencyCode = param[0].currencyCode
      this.genProduct(param, 'outReturnProductNo')
      this.disabledListData(true)
    },
    // 采购换货回调
    purchaseExchangeDialogCallback(param) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.inType = 'PURCHASE_EXCHANGE'
      editForm.outReturnNo = param[0].inReturnNo
      editForm.preBillType = 'WH_IN_RETURN'
      editForm.preBillNo = param[0].inReturnNo
      editForm.lotNo = param[0].lotNo
      editForm.contractNo = param[0].contractNo
      editForm.warehouseCode = param[0].warehouseCode
      editForm.supplierCode = param[0].supplierCode
      editForm.settlementCode = param[0].supplierCode
      editForm.currencyCode = param[0].currencyCode
      this.genProduct(param, 'inReturnProductNo')
      this.disabledListData(true)
    },
    genProduct(param, detailNo) {
      const paramDetailList = param
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].$refs.tab.tableData = []
      const productDetailList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].$refs.tab.tableData
      paramDetailList.forEach(e => {
        var obj = {}
        obj.lotNo = e.lotNo
        obj.contractNo = e.contractNo
        obj.lotProductDetailCode = e.logProductDetailCode
        obj.preBillProductDetailCode = e[detailNo]
        obj.productCode = e.productCode
        obj.productName = e.productName
        obj.brand = e.brand
        obj.spec = e.spec
        obj.origin = e.origin
        obj.productKeyAttr01 = e.productKeyAttr01
        obj.productKeyAttr02 = e.productKeyAttr02
        obj.productKeyAttr03 = e.productKeyAttr03
        obj.itemCount = e.itemCount
        if (detailNo === 'inReturnProductNo') {
          obj.inQuantity = e.outQuantity
        } else {
          obj.inQuantity = e.inQuantity
        }
        obj.measurementQuantity = e.measurementQuantity
        obj.productUnitCode = e.productUnitCode
        obj.measurementUnitCode = e.measurementUnitCode
        obj.rightFlag = '0'
        obj.goodsFlag = '0'
        productDetailList.push(obj)
      })
      // 商品费用相关列启用
      this.setProdColsDisable(true)
      this.productBtnDisplay(true)
    },
    productBtnDisplay(flag) {
      if (flag) {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].tab.topBar[0].isShow = false
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].tab.topBar[1].isShow = false
      } else {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].tab.topBar[0].isShow = true
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].tab.topBar[1].isShow = true
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.inReturnNo = ''
      }
    },
    exchangeDialogChoose() {
      return {
        returnType: {
          value: 'EXCHANGE'
        }
      }
    },
    returnDialogChoose(alue) {
      return {
        returnType: {
          value: 'RETURN'
        }
      }
    },
    handlePreCallback(result) {
      if (result.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('storage.ladingBill.msg.noPostData')
          })
        )
        return
      }

      if (this.$route.params.preBillType === 'WH_LADING_BILL') {
        this.ladingNoCallback(result)
      }
      if (this.$route.params.preBillType === 'CON_PL_INFO') {
        this.lotNoCallback(result)
      }
    },
    // 初始化：根据批次信息重置供应商选项
    handleInitCallback(param) {
      if (param.lotNo) {
        request({
          url: '/api/contract/plInfo/get',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: param.lotNo
          }
        }).then(response => {
          if (response.data) {
            const lotInfo = response.data
            this.resetOptions(lotInfo)
          }
        })
      }

      // 商品费用相关列禁用
      if (param.inType === 'TEMP') {
        this.setProdColsDisable(false)
      } else {
        this.setProdColsDisable(true)
      }
    },
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
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
    onPurchaseLot() {
      // if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.inType !== 'LOT') {
      //   this.$notify(
      //     notifyInfo({
      //       // 只有入库类型为批次入库时，才可以选择批次
      //       msg: this.$t('storage.inNotice.validateMsg.chooseLotProduct')
      //     })
      //   )
      //   return false
      // }
      return true
    },
    // 选择批次商品设置默认值
    lotNoSetDefault() {
      // 批次选择暂时不从父页面传递检索条件
      // const supplierCode = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.supplierCode
      // this.$loopDOM(this, 'qmDialogTable').listQuery.data.supplierCode = supplierCode
      // if (supplierCode) {
      //   this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
      //     if (info.prop === 'supplierCode') info.attrs.disabled = true
      //   })
      // }
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    // 选择批次商品回调
    lotNoCallback(params) {
      this.disabledListData(false)
      const lotInfo = params[0].lot
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].$refs.tab.tableData
      const inBillCostList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inBillCostList[0].$refs.tab.tableData

      for (let i = 0; i < params.length; i++) {
        if (params[i].lotNo !== lotInfo.lotNo) {
          this.$notify(
            notifyInfo({
              msg: this.$t('storage.inNotice.validateMsg.chooseLotProductBack')
            })
          )
          return
        }
      }

      if (editForm.inType !== 'LOT') {
        editForm.inType = 'LOT'
        editForm.ladingBillNo = null
        productList.splice(0)
        inBillCostList.splice(0)
      } else if (editForm.lotNo !== lotInfo.lotNo) {
        productList.splice(0)
        inBillCostList.splice(0)
      }
      editForm.lotNo = lotInfo.lotNo
      editForm.contractNo = lotInfo.contractNo
      editForm.currencyCode = lotInfo.currency
      this.setDisable('currencyCode', true)
      editForm.supplierCode = lotInfo.supplierCodeList[0]
      editForm.deliverCode = lotInfo.supplierCodeList[0]
      // editForm.headlineCode = lotInfo.headlineCodeList[0]

      // 根据批次信息重置供应商选项
      this.resetOptions(lotInfo)

      for (let i = 0; i < params.length; i++) {
        if (
          !productList
            .map(v => {
              return this.getProductAttr(v)
            })
            .includes(this.getProductAttr(params[i]))
        ) {
          productList.push({
            lotNo: params[i].lotNo,
            contractNo: params[i].contractNo,
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
            inQuantity: params[i].rmnPrdQty,
            measurementQuantity: params[i].rmnMemQty,
            productUnitCode: params[i].productUnitCode,
            measurementUnitCode: params[i].measurementUnitCode,
            rightFlag: '0',
            goodsFlag: '0'
          })
        }
      }

      // 取得批次费用信息
      for (let i = 0; i < params.length; i++) {
        if (
          !inBillCostList
            .map(v => {
              return v.lotProductDetailCode
            })
            .includes(params[i].productDetailNo)
        ) {
          this.getLotFee(params[i].productDetailNo, inBillCostList)
        }
      }

      // 商品费用相关列禁用
      this.setProdColsDisable(true)
      this.productBtnDisplay(false)
    },
    // 取得批次费用信息
    getLotFee(productDetailNo, billCostList) {
      request({
        url: '/api/contract/plEstimatedCost/list',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            lotNo: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.lotNo,
            productDetailNo: productDetailNo,
            feeOccurs: this.param.billType
          }
        }
      }).then(response => {
        if (response.data && response.data.length > 0) {
          response.data.forEach(fee => {
            const row = {
              lotProductDetailCode: fee.productDetailNo,
              settlementCode: fee.settlementCode,
              feeDirection: fee.feeDirection,
              feeCode: fee.feeCode,
              productCode: fee.productCode,
              productName: fee.productName,
              brand: fee.brand,
              spec: fee.spec,
              origin: fee.origin,
              productKeyAttr01: fee.productKeyAttr01,
              productKeyAttr02: fee.productKeyAttr02,
              productKeyAttr03: fee.productKeyAttr03,
              quantity: fee.quantity,
              includeTaxPrice: fee.includeTaxPrice,
              includeTaxAmount: fee.includeTaxAmount,
              excludeTaxPrice: fee.excludeTaxPrice,
              excludeTaxAmount: fee.excludeTaxAmount,
              currencyCode: fee.currencyCode,
              taxRate: fee.taxRate,
              taxAmount: fee.taxAmount,
              costFlag: fee.costFlag,
              intercourseFlag: fee.costFlag,
              list: []
            }
            billCostList.push(row)
            // 初始化费用名称下拉数据
            this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inBillCostList[0].onSettlementCodeChange({
              val: fee.settlementCode,
              row
            })
          })
        }
      })
    },
    onLadingBill() {
      // if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.inType !== 'LADING') {
      //   this.$notify(
      //     notifyInfo({
      //       // 只有入库类型为提单入库时，才可以选择提单
      //       msg: this.$t('storage.inNotice.validateMsg.chooseLadingProduct')
      //     })
      //   )
      //   return false
      // }
      return true
    },
    // 选择提单商品设置默认值
    ladingNoSetDefault() {
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    // 选择提单商品回调
    ladingNoCallback(params) {
      this.disabledListData(false)
      const firstRow = params[0]
      if (firstRow.ladingBillNo) {
        const ladingBillNo = firstRow.ladingBillNo
        for (let i = 0; i < params.length; i++) {
          if (ladingBillNo !== params[i].ladingBillNo) {
            this.$notify(
              notifyInfo({
                msg: this.$t('storage.inNotice.validateMsg.chooseLadingProductBack')
              })
            )
            return
          }
        }

        const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        const inType = editForm.inType
        const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].$refs.tab.tableData
        const inBillCostList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inBillCostList[0].$refs.tab.tableData

        if (inType !== 'LADING') {
          editForm.inType = 'LADING'
          productList.splice(0)
          inBillCostList.splice(0)
        }
        editForm.ladingBillNo = ladingBillNo
        editForm.supplierCode = firstRow.supplierCode
        // editForm.headlineCode = firstRow.headlineCode
        this.setDisable('supplierCode', true)
        if (!editForm.deliverCode) {
          editForm.deliverCode = firstRow.supplierCode
        }
        if (firstRow.preBillType === 'CON_PL_INFO') {
          editForm.lotNo = firstRow.preBillNo
          editForm.contractNo = firstRow.contractNo
          request({
            url: '/api/contract/plInfo/get',
            method: 'post',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: firstRow.preBillNo
            }
          }).then(response => {
            if (response.data) {
              const lotInfo = response.data
              this.resetOptions(lotInfo)
              editForm.currencyCode = lotInfo.currency
              this.setDisable('currencyCode', true)
            }
          })
        } else {
          editForm.lotNo = null
          this.setDisable('currencyCode', false)
        }

        const newData = []
        for (let i = 0; i < productList.length; i++) {
          if (productList[i].preBillNo === ladingBillNo || productList[i].ladingBillNo === ladingBillNo) {
            newData.push(productList[i])
          } else {
            // TODO 删除商品所相应的费用信息
          }
        }
        for (let i = 0; i < params.length; i++) {
          if (
            !newData
              .map(v => {
                return this.getProductAttr(v)
              })
              .includes(this.getProductAttr(params[i]))
          ) {
            newData.push({
              lotNo: params[i].lotNo,
              contractNo: params[i].contractNo,
              lotProductDetailCode: params[i].lotProductDetailCode,
              preBillProductDetailCode: params[i].ladingProductNo,
              productCode: params[i].productCode,
              productName: params[i].productName,
              brand: params[i].brand,
              spec: params[i].spec,
              origin: params[i].origin,
              productKeyAttr01: params[i].productKeyAttr01,
              productKeyAttr02: params[i].productKeyAttr02,
              productKeyAttr03: params[i].productKeyAttr03,
              inQuantity: params[i].restQuantity,
              measurementQuantity: params[i].restMeasurementQuantity,
              productUnitCode: params[i].productUnitCode,
              measurementUnitCode: params[i].measurementUnitCode,
              rightFlag: params[i].rightFlag,
              goodsFlag: '0'
            })
          }
        }
        productList.splice(0)
        for (let i = 0; i < newData.length; i++) {
          productList.push(newData[i])
        }

        // 取得批次费用信息
        for (let i = 0; i < params.length; i++) {
          if (
            !inBillCostList
              .map(v => {
                return v.lotProductDetailCode
              })
              .includes(params[i].productDetailNo)
          ) {
            this.getLotFee(params[i].productDetailNo, inBillCostList)
          }
        }
      }

      // 商品费用相关列禁用
      this.setProdColsDisable(true)
    },
    closeProductItemCallback(params) {
      this.disabledListData(false)
      if (params) {
        const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        const inType = editForm.inType
        const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].$refs.tab.tableData
        const inBillCostList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inBillCostList[0].$refs.tab.tableData
        if (inType !== 'TEMP') {
          editForm.inType = 'TEMP'
          productList.splice(0)
          inBillCostList.splice(0)
          editForm.lotNo = null
          editForm.ladingBillNo = null
          // editForm.supplierCode = null
          // editForm.deliverCode = null
          // editForm.currencyCode = null
          // editForm.headlineCode = null
          this.setDisable('supplierCode', false)
          this.setDisable('currencyCode', false)
          // 客户选项改为默认范围
          this.resetOptions(null)
        }
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
      }

      // 商品费用相关列启用
      this.setProdColsDisable(false)
      this.productBtnDisplay(false)
    },
    onInTypeChange(param) {
      if (param === 'LOT') {
        // 批次入库
      } else if (param === 'LADING') {
        // 提单入库
      } else if (param === 'TEMP') {
        // 散购入库
      }
    },
    onSupplierCodeChange(param) {
      if (!this.$refs.qmEdit.$refs.qmRouteEdit.editForm.deliverCode) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.deliverCode = param
      }
    },
    setDisable(prop, disable) {
      this.edit.formData.part1.content.forEach(item => {
        if (item.prop === prop) {
          item.attrs.disabled = disable
        }
      })
    },
    getProductAttr(param) {
      var productAtr = ''
      if (param.lotProductDetailCode) {
        productAtr += param.lotProductDetailCode
      } else if (param.productDetailNo) {
        productAtr += param.productDetailNo
      }
      productAtr += param.brand
      productAtr += param.spec
      productAtr += param.origin
      productAtr += param.productKeyAttr01
      productAtr += param.productKeyAttr02
      productAtr += param.productKeyAttr03
      return productAtr
    },
    setProdColsDisable(disable) {
      const tableCols = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inProductList[0].$refs.tab.tableCols
      tableCols.forEach(col => {
        if (['includeTaxPrice', 'taxRate'].includes(col.prop)) {
          col.required = !disable
        }
        if (['includeTaxPrice', 'includeTaxAmount', 'excludeTaxPrice', 'excludeTaxAmount', 'taxRate', 'taxAmount'].includes(col.prop)) {
          col.isShow = !disable
        }
      })
    },
    async resetOptions(lotInfo) {
      const supplierList = []
      // const headlineList = []

      if (lotInfo) {
        lotInfo.supplierCodeList.forEach((s, index) => {
          supplierList.push({
            code: s,
            name: lotInfo.supplierNames.split(',')[index]
          })
        })
        // lotInfo.headlineCodeList.forEach((s, index) => {
        //   headlineList.push({
        //     code: s,
        //     name: lotInfo.headlineNames.split(',')[index]
        //   })
        // })
      } else {
        // 传空时base select 会默认处理
      }

      this.edit.formData.part1.content.forEach(f => {
        if (f.prop === 'supplierCode') {
          f.list = supplierList
        }
        // if (f.prop === 'headlineCode') {
        //   f.list = headlineList
        // }
      })
    },
    async waningCheck() {
      // 调用货量、货值预警api
      const { data } = await request({
        url: '/api/warehouse/inBill/warningApi',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        }
      })
      if (data) {
        const flag = await this.$confirm(data, this.$t('biz.msg.tip'), {
          type: 'warning',
          closeOnClickModal: false,
          confirmButtonText: this.$t('biz.btn.confirm'),
          cancelButtonText: this.$t('biz.btn.cancel')
        })
          .then(() => {
            return new Promise(resolve => {
              resolve(true)
            })
          })
          .catch(() => {
            return new Promise(resolve => {
              resolve(false)
            })
          })

        return flag
      } else {
        return true
      }
    }
  }
}
</script>
