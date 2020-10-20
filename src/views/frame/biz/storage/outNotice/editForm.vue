<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @initCallback='handleInitCallback' @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import { notifyInfo, notifyError } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'outNoticeEdit',
  data() {
    return {
      contractNos: [],
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),

        api: {
          view: '/api/warehouse/whOutBill/get',
          save: '/api/warehouse/whOutBill/save',
          update: '/api/warehouse/whOutBill/update',
          complete: '/api/warehouse/whOutBill/complete',
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
            event: 'save',
            showLoading: true,
            showAttachment: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
            // extraEvent: this.waningCheck
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
                uk: this.$route.params.uk || this.$route.params.outBillNo
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
                outBillNo: data.uk || data.outBillNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-批次详情',
            name: 'biz.btn.salesLot',
            event: 'set',
            validate: this.onBatchDetail,
            isShow: ['add', 'update'],
            permitName: ['salesLot'],
            component: () => import('@/views/frame/biz/spot/dialog/storage/chooseLotProductSl.vue'),
            setDefault: this.lotNoSetDefault,
            callback: this.lotNoCallback
          },
          {
            iconName: '线性-新增',
            name: 'biz.btn.productItem',
            isShow: ['add', 'update'],
            permitName: ['productItem'],
            event: 'set',
            component: () => import('@/views/frame/biz/data/productItem/choose.vue'), // 组件
            callback: this.closeProductItemCallback // 关闭弹窗回调
          },
          // 采购退货
          {
            iconName: '线性-新增',
            name: 'biz.btn.purchaseReturn',
            isShow: ['add', 'update'],
            event: 'set',
            component: () => import('@/views/frame/biz/storage/components/inReturnDialog.vue'), // 组件
            initChoose: this.returnDialogChoose,
            callback: this.returnDialogCallback // 关闭弹窗回调
          },
          // 采购换货
          {
            iconName: '线性-新增',
            name: 'biz.btn.purchaseExchange',
            isShow: ['add', 'update'],
            event: 'set',
            component: () => import('@/views/frame/biz/storage/components/inReturnDialog.vue'), // 组件
            initChoose: this.exchangeDialogChoose,
            callback: this.exchangeDialogCallback // 关闭弹窗回调
          },
          // 销售换货
          {
            iconName: '线性-新增',
            name: 'biz.btn.sellExchange',
            isShow: ['add', 'update'],
            event: 'set',
            component: () => import('@/views/frame/biz/storage/components/outExchangeDialog.vue'), // 组件
            initChoose: this.exchangeDialogChoose,
            callback: this.sellExchangeDialogCallback // 关闭弹窗回调
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.outNotice.group.editFormPart1',
            content: [
              {
                label: 'storage.outNotice.form.outBillNo',
                prop: 'outBillNo',
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
                label: 'storage.outNotice.form.outDate',
                prop: 'outDate',
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
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'storage.outNotice.form.outType',
                prop: 'outType',
                element: 'base-select',
                list: this.$t('datadict.outNormalType'),
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
                event: this.onOutTypeChange
              },
              {
                label: 'storage.outNotice.form.warehouseCode',
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
                  clearable: true,
                  params: {}
                }
              },
              {
                label: 'storage.outNotice.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.outNotice.form.contractNo',
                prop: 'contractNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'storage.outNotice.form.customerCode',
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
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  filterable: true
                },
                event: {
                  evn: this.onCustomerCodeChange
                }
              },
              {
                label: 'storage.outNotice.form.settlementCode',
                prop: 'settlementCode',
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
                    typeCode: '1',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  filterable: true
                },
                isShow: false
              },
              // {
              //   label: 'storage.outNotice.form.headlineCode',
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
              //     disabled: this.$route.params.type === 'complete',
              //     data: 'FUNC_ORG',
              //     clearable: true
              //   }
              // },
              {
                label: 'storage.outNotice.form.currencyCode',
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
                  disabled: false,
                  disabled: this.$route.params.type === 'complete',
                  clearable: true
                }
              },
              {
                label: 'storage.outNotice.form.custCreditNo',
                prop: 'custCreditNo',
                element: 'base-dialog-select',
                component: () => import('@/views/frame/biz/cst/components/creditCsDialog.vue'),
                validateFunc: this.custCreditValidateFunc,
                initChoose: this.custCreditInitChoose,
                callback: this.custCreditCallback,
                attrs: {
                  disabled: this.$route.params.type === 'complete',
                  clearable: true
                }
              },
              {
                label: 'storage.outNotice.form.inReturnNo',
                prop: 'inReturnNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
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
                label: 'storage.outNotice.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 3,
                  disabled: this.$route.params.type === 'complete',
                  clearable: true,
                  maxlength: 500
                }
              }
            ]
          }
        },

        tables: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'outProductList',
            label: 'storage.outNotice.tab.product',
            component: () => import('./productTab.vue'),
            required: true
          }
        ],
        tabs: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'outProductPickList',
            label: 'storage.outNotice.tab.productDetail',
            component: () => import('./productDetailTab.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'outBillCostList',
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
    if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.outType === 'TEMP') {
      this.setDisable('currencyCode', false)
    }
  },
  methods: {
    disabledListData(flag, type) {
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].tab.table.cols
      productList.forEach(e => {
        if (e.prop === 'measurementQuantity' || e.prop === 'outQuantity') {
          e.attrs.disabled = flag
        }
      })

      if (type !== 'outReturnProductNo') {
        const detailList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductPickList[0].tab.table.cols
        detailList.forEach(e => {
          if (e.prop === 'measurementQuantity' || e.prop === 'outQuantity') {
            e.attrs.disabled = flag
          }
        })
      }

      const formData = this.edit.formData.part1.content
      formData.forEach(e => {
        if (e.prop == 'warehouseCode' || e.prop === 'customerCode' || e.prop === 'custCreditNo' || e.prop === 'currencyCode') {
          e.attrs.disabled = flag
        }
      })
      if (type !== 'outReturnProductNo') {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductPickList[0].tab.topBar[0].isShow = !flag
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductPickList[0].tab.topBar[1].isShow = !flag
      }
    },
    sellExchangeDialogCallback(param) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.outType = 'SELL_EXCHANGE'
      editForm.outReturnNo = param[0].outReturnNo
      // 前置单据销售退货
      editForm.preBillType = 'WH_OUT_RETURN'
      editForm.preBillNo = param[0].outReturnNo
      // 销售换货需要保存 销售批次和销售合同号
      editForm.lotNo = param[0].sellLotNo
      editForm.contractNo = param[0].sellContractNo
      editForm.warehouseCode = param[0].warehouseCode
      editForm.customerCode = param[0].customerCode
      editForm.settlementCode = param[0].customerCode
      editForm.currencyCode = param[0].currencyCode
      editForm.custCreditNo = ''
      this.genProduct(param, 'outReturnProductNo')
      // 销售换货需要重新拣配
      // this.genProductDetail(param)
      this.disabledListData(true, 'outReturnProductNo')
    },
    returnDialogCallback(param) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.outType = 'PURCHASE_RETURN'
      editForm.inReturnNo = param[0].inReturnNo
      // 前置单据采购退货
      editForm.preBillType = 'WH_IN_RETURN'
      editForm.preBillNo = param[0].inReturnNo
      editForm.warehouseCode = param[0].warehouseCode
      editForm.customerCode = param[0].supplierCode
      editForm.settlementCode = param[0].supplierCode
      editForm.currencyCode = param[0].currencyCode
      editForm.custCreditNo = ''
      this.genProduct(param, 'inReturnProductNo')
      this.genProductDetail(param)
      this.disabledListData(true, 'inReturnProductNo')
    },
    exchangeDialogCallback(param) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.outType = 'PURCHASE_EXCHANGE'
      editForm.inReturnNo = param[0].inReturnNo
      // 前置单据采购退货
      editForm.preBillType = 'WH_IN_RETURN'
      editForm.preBillNo = param[0].inReturnNo
      editForm.warehouseCode = param[0].warehouseCode
      editForm.customerCode = param[0].supplierCode
      editForm.settlementCode = param[0].supplierCode
      editForm.currencyCode = param[0].currencyCode
      editForm.custCreditNo = ''
      this.genProduct(param, 'inReturnProductNo')
      this.genProductDetail(param)
      this.disabledListData(true, 'inReturnProductNo')
    },
    genProductDetail(param) {
      const inDetailNoList = []
      var map = {}
      param.forEach(e => {
        inDetailNoList.push(e.inDetailNo)
        map[e.inDetailNo] = e
      })
      request({
        url: '/api/warehouse/stockProductDetail/listByReturn',
        method: 'post',
        data: {
          isPage: false,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            inBillNo: param[0].inBillNo,
            inDetailNoList: inDetailNoList,
            // 退换货类型
            returnChangeFlag: '1'
          }
        }
      }).then(response => {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductPickList[0].$refs.tab.tableData = response.data
        const detailList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductPickList[0].$refs.tab.tableData
        detailList.forEach(e => {
          const returnDetailInfo = map[e.inDetailNo]
          e.outQuantity = returnDetailInfo.outQuantity
          e.measurementQuantity = returnDetailInfo.measurementQuantity
        })
      })
    },
    genProduct(param, detailNo) {
      const paramDetailList = param
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].$refs.tab.tableData = []
      const productDetailList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].$refs.tab.tableData
      paramDetailList.forEach(e => {
        var obj = {}
        if (detailNo === 'outReturnProductNo') {
          obj.lotNo = e.sellLotNo
          obj.contractNo = e.sellContractNo
        } else {
          obj.lotNo = e.lotNo
          obj.contractNo = e.contractNo
        }
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
        if (detailNo === 'outReturnProductNo') {
          obj.outQuantity = e.inQuantity
        } else {
          obj.outQuantity = e.outQuantity
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
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].tab.topBar[0].isShow = false
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].tab.topBar[1].isShow = false
      } else {
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].tab.topBar[0].isShow = true
        this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].tab.topBar[1].isShow = true
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
    // 选择合同验证
    custCreditValidateFunc() {
      var customerNo = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerCode
      if (customerNo === '') {
        this.$notify(notifyInfo({ msg: this.$t('请选择客户') }))
        return false
      }
      return true
    },
    custCreditCallback(result) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.custCreditNo = result.custCreditNo
    },
    custCreditInitChoose() {
      return {
        billNo: {
          value: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.outBillNo
        },
        custCode: {
          disabled: true,
          value: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerCode
        }
      }
    },
    handlePreCallback(result) {
      if (result.length === 0) {
        this.$notify(
          notifyError({
            msg: this.$t('storage.outNotice.validateMsg.noPostData')
          })
        )
        return
      }
      this.lotNoCallback(result)
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      editForm.supplierCode = this.$route.params.customerCode
    },
    // 初始化：根据批次信息重置客户选项
    handleInitCallback(param) {
      if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.lotNo) {
        request({
          url: '/api/contract/slInfo/get',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: param.lotNo
          }
        }).then(response => {
          if (response.data) {
            const lotInfo = response.data
            if (lotInfo.outType === 'LOT') {
              this.resetOptions(lotInfo)
            }
          }
        })
      }

      // 商品费用相关列禁用
      if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.outType === 'TEMP') {
        this.setProdColsDisable(false)
      } else {
        this.setProdColsDisable(true)
      }

      this.getSwitchInfo(param.whType)
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
    onBatchDetail() {
      // if (this.$refs.qmEdit.$refs.qmRouteEdit.editForm.outType !== 'LOT') {
      //   this.$notify(
      //     notifyInfo({
      //       msg: this.$t('只有出库类型为批次出库时，才可以选择批次。')
      //     })
      //   )
      //   return false
      // }
      return true
    },
    // 选择批次商品设置默认值

    lotNoSetDefault() {
      //const customerCode = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.customerCode
      // this.$loopDOM(this, 'qmDialogTable').listQuery.data.customerCode = customerCode
      // if (customerCode) {
      //   this.$loopDOM(this, 'qmDialogTable').dialog.formData.forEach(info => {
      //     if (info.prop === 'customerCode') info.attrs.disabled = true
      //   })
      // }
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    // 选择批次商品回调
    lotNoCallback(params) {
      this.disabledListData(false, null)
      const lotInfo = params[0].lot
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].$refs.tab.tableData
      const outProductPickList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductPickList[0].$refs.tab.tableData
      const outBillCostList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outBillCostList[0].$refs.tab.tableData

      for (let i = 0; i < params.length; i++) {
        if (params[i].lotNo !== lotInfo.lotNo) {
          this.$notify(
            notifyInfo({
              msg: this.$t('storage.outNotice.validateMsg.chooseLotProduct')
            })
          )
          return
        }
      }

      if (editForm.outType !== 'LOT') {
        editForm.outType = 'LOT'
        productList.splice(0)
        outProductPickList.splice(0)
        outBillCostList.splice(0)
      } else if (editForm.lotNo !== lotInfo.lotNo) {
        productList.splice(0)
        outProductPickList.splice(0)
        outBillCostList.splice(0)
      }
      editForm.lotNo = lotInfo.lotNo
      editForm.contractNo = lotInfo.contractNo
      editForm.currencyCode = lotInfo.currency
      this.setDisable('currencyCode', true)
      editForm.customerCode = lotInfo.customerCodeList[0]
      editForm.settlementCode = lotInfo.customerCodeList[0]
      // editForm.headlineCode = lotInfo.headlineCodeList[0]

      // 根据批次信息重置客户选项
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
            outQuantity: params[i].rmnPrdQty,
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
          !outBillCostList
            .map(v => {
              return v.lotProductDetailCode
            })
            .includes(params[i].productDetailNo)
        ) {
          this.getLotFee(params[i].productDetailNo, outBillCostList)
        }
      }

      this.getSwitchInfo(params[0].whType)

      // 商品费用相关列禁用
      this.setProdColsDisable(true)
      this.productBtnDisplay(false)
    },
    // 获取销售合同配货信息
    getSwitchInfo(whType) {
      if (whType === '1') {
        this.contractNos = []
        return
      }
      // 获取严格控制开关是否打开
      request({
        url: '/api/sys/sysProcess/getValueByCode',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: 'SALE_LOCK_SWITCH'
        }
      }).then(response => {
        if (response.data !== '1') {
          this.contractNos = []
          return
        }
        // 获取销售合同配货信息
        this.getSaleContractInfo(whType)
      })
    },
    getSaleContractInfo(whType) {
      const contractNo = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.contractNo
      request({
        url: '/api/contract/whSaleContract/listByContract',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: { contractNo: contractNo }
        }
      }).then(response => {
        const contractInfo = response.data
        let warehouseCodeList = ''
        contractInfo.forEach(e => {
          if (whType === '2') {
            this.contractNos.push(e.documentNo)
          }
          if (whType === '3') {
            warehouseCodeList = warehouseCodeList + e.warehouseCode + ','
          }
        })
        if (whType === '3') {
          this.edit.formData.part1.content.forEach(e => {
            if (e.prop === 'warehouseCode') {
              warehouseCodeList.substring(0, warehouseCodeList.length - 1)
              this.$set(e.attrs.params, 'warehouseCode', warehouseCodeList)
            }
          })
        }
      })
    },
    // 取得批次费用信息
    getLotFee(productDetailNo, billCostList) {
      request({
        url: '/api/contract/slEstimatedCost/list',
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
            billCostList.push({
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
              intercourseFlag: fee.costFlag
            })
          })
        }
      })
    },
    closeProductItemCallback(params) {
      this.disabledListData(false, null)
      if (params) {
        const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
        const outType = editForm.outType
        const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].$refs.tab.tableData
        const outProductPickList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductPickList[0].$refs.tab.tableData
        const outBillCostList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outBillCostList[0].$refs.tab.tableData

        if (outType !== 'TEMP') {
          editForm.outType = 'TEMP'
          productList.splice(0)
          outProductPickList.splice(0)
          outBillCostList.splice(0)
          editForm.lotNo = null
          // editForm.customerCode = null
          // editForm.settlementCode = null
          // editForm.currencyCode = null
          // editForm.headlineCode = null
          this.setDisable('customerCode', false)
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
    onOutTypeChange(value) {
      if (value === 'LOT') {
        // 批次出库
      } else if (value === 'TEMP') {
        // 散购出库
      }
    },
    onCustomerCodeChange(param) {
      if (!this.$refs.qmEdit.$refs.qmRouteEdit.editForm.settlementCode) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.settlementCode = param
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
      const tableCols = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.outProductList[0].$refs.tab.tableCols
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
      const customerList = []
      // const headlineList = []

      if (lotInfo) {
        lotInfo.customerCodeList.forEach((s, index) => {
          customerList.push({
            code: s,
            name: lotInfo.customerNames.split(',')[index]
          })
        })
      } else {
        // 传空时base select 会默认处理
      }

      this.edit.formData.part1.content.forEach(f => {
        if (f.prop === 'customerCode') {
          f.list = customerList
        }
      })
    },
    async waningCheck() {
      // 调用货量、货值预警api
      const { data } = await request({
        url: '/api/warehouse/inCheck/warningApi',
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
