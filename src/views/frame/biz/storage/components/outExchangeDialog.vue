<template>
  <qm-dialog-table ref="qmDialogTable" :dialog="dialog" @closeDialog="handleCloseDialog"></qm-dialog-table>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'

export default {
  props: {
    // 是否进行初始化查询
    // 是否进行初始化查询
    initSearch: {
      type: Boolean,
      default: true
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    },
    initChooseParam: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      dialog: {
        moreShowFlg: false,
        titleName: this.$t('storage.outReturn.dialog.title'),
        formData: [
          {
            type: 'date',
            label: 'storage.outReturn.form.outReturnDate',
            props: ['outReturnDateStart', 'outReturnDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.outReturn.form.outReturnNo',
            prop: 'outReturnNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.outReturn.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
                usingFlag: '1',
                auditStatus: '3'
              },
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.outReturn.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'radio',
            label: 'storage.outReturn.form.returnType',
            prop: 'returnType',
            list: [
              {
                label: 'storage.inReturn.form.returnType1',
                value: 'RETURN'
              },
              {
                label: 'storage.inReturn.form.returnType2',
                value: 'EXCHANGE'
              }
            ],
            isShow: false
          },
          {
            label: 'biz.lbl.bizOrganName',
            prop: 'bizOrganCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_ORG',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizDeptName',
            prop: 'bizDeptCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_DEPT',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.bizEmployeeName',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'biz.lbl.optName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              filterable: true,
              disabled: false,
              clearable: true
            }
          }
        ],
        mainData: {
          api: {
            search: '/api/warehouse/whOutReturnBill/listForExchange'
          },
          apiData: {
            search(param) {
              return param
            }
          },
          initSearch: true,
          table: {
            id: '',
            showCheckbox: true,
            cols: [
              // 销售退货单号
              {
                prop: 'outReturnNo',
                width: 200,
                align: 'left',
                label: 'storage.outReturn.list.outReturnNo',
                sortable: 'custom'
              },
              // 销售退货日期
              {
                prop: 'outReturnDate',
                width: 100,
                align: 'center',
                label: 'storage.outReturn.list.outReturnDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                },
                sortable: 'custom'
              },
              // 客户
              {
                prop: 'customerName',
                width: 200,
                align: 'left',
                label: 'storage.outReturn.list.customerName',
                sortable: 'custom'
              },
              // 退换货类型
              {
                prop: 'returnType',
                width: 100,
                align: 'center',
                format: {
                  dict: this.$t('datadict.returnType')
                },
                label: 'storage.outReturn.list.returnType',
                sortable: 'custom'
              },
              // 仓库
              {
                prop: 'warehouseName',
                width: 200,
                align: 'left',
                label: 'storage.outReturn.list.warehouseName',
                sortable: 'custom'
              },
              // 原出库单号
              {
                prop: 'outBillNo',
                width: 200,
                align: 'left',
                label: 'storage.outReturn.list.outBillNo'
              },
              // 商品
              {
                prop: 'productName',
                width: 100,
                align: 'left',
                label: 'storage.outReturn.list.productName'
              },
              // 商品属性
              ...this.$store.state.user.mainGoodColsTxt,
              // 退货件数
              {
                prop: 'itemCount',
                width: 80,
                format: {
                  func: 'num'
                },
                align: 'right',
                label: 'storage.outReturn.list.itemCount'
              },
              // 退换货数量
              {
                prop: 'inQuantity',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                label: 'storage.outReturn.list.inQuantity'
              },
              // 商品单位
              {
                prop: 'productUnitCode',
                width: 80,
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                },
                label: 'storage.outReturn.list.productUnitCode'
              },
              // 计量数量
              {
                prop: 'measurementQuantity',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                label: 'storage.outReturn.list.measurementQuantity'
              },
              // 计量单位
              {
                prop: 'measurementUnitCode',
                width: 80,
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                label: 'storage.outReturn.list.measurementUnitCode'
              },
              // 业务机构
              {
                prop: 'bizOrganName',
                width: 100,
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizOrganName'
              },
              // 业务部门
              {
                prop: 'bizDeptName',
                width: 100,
                align: 'center',
                sortable: 'custom',
                label: 'biz.lbl.bizDeptName'
              },
              // 业务员
              {
                prop: 'bizEmployeeName',
                width: 100,
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.bizEmployeeName'
              },
              // 制单人
              {
                prop: 'optEmployeeName',
                width: 100,
                sortable: 'custom',
                align: 'center',
                label: 'biz.lbl.optName'
              }
            ]
          },

          bottomBar: {
            pagination: {
              show: true,
              layout: 'total, sizes, prev, pager, next, jumper',
              pageSizes: [20, 40, 60, 80, 100]
            }
          }
        },
        bottomBar: {
          pagination: {
            show: true,
            layout: 'total, sizes, prev, pager, next, jumper',
            pageSizes: [20, 40, 60, 80, 100]
          }
        },
        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.choose',
            event: 'choose',
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.$refs.qmDialogTable.listQuery.data.returnType = this.initChooseParam.returnType.value
    if (this.$props.initChooseParam.tradeTypeList) {
      if (Array.isArray(this.$props.initChooseParam.tradeTypeList.value)) {
        if (this.$props.initChooseParam.tradeTypeList.value.length > 0) {
          const formData = this.dialog.formData
          let tradeTypeDef = null
          for (let i = 0; i < formData.length; i++) {
            if (formData[i].prop === 'tradeType') {
              tradeTypeDef = formData[i]
              break
            }
          }
          const tradeTypeDict = this.$t('datadict.tradeType')
          tradeTypeDef.list = []
          for (let i = 0; i < tradeTypeDict.length; i++) {
            if (this.$props.initChooseParam.tradeTypeList.value.includes(tradeTypeDict[i].value)) {
              tradeTypeDef.list.push(tradeTypeDict[i])
            }
          }
          if (this.$props.initChooseParam.tradeTypeList.value.length === 1) {
            tradeTypeDef.attrs.disabled = true
            this.$refs.qmDialogTable.listQuery.data.tradeType = this.$props.initChooseParam.tradeTypeList.value[0]
          }
        }
      }
    }
  },
  methods: {
    // 关闭回调
    handleCloseDialog(param) {
      // 验证单号是否不同

      if (param) {
        const outReturnNo = param[0].outReturnNo
        const customerCode = param[0].customerCode
        let flag = false
        param.forEach(e => {
          if (flag) {
            return
          }
          if (outReturnNo !== e.outReturnNo) {
            flag = true
          }
          if (customerCode !== e.customerCode) {
            flag = true
          }
        })
        if (flag) {
          this.$notify(
            notifyInfo({
              // 只有入库类型为批次入库时，才可以选择批次
              msg: this.$t('storage.outReturn.validateMsg.outNoticeNoDifferent')
            })
          )
          return
        }
      }

      this.$emit('closeHandler', param)
    }
  }
}
</script>
