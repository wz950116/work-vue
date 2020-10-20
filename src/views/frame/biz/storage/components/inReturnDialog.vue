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
        titleName: this.$t('storage.inReturn.dialog.title'),
        formData: [
          {
            type: 'date',
            label: 'storage.inReturn.form.inReturnDate',
            props: ['inReturnDateStart', 'inReturnDateEnd'],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.inReturn.form.inReturnNo',
            prop: 'inReturnNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            label: 'storage.inReturn.form.supplierCode',
            prop: 'supplierCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
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
            label: 'storage.inReturn.form.warehouseCode',
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
            label: 'storage.inReturn.form.returnType',
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
            search: '/api/warehouse/whInReturnBill/listForNotice'
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
              // 采购退货单号
              {
                prop: 'inReturnNo',
                width: 200,
                align: 'left',
                label: 'storage.inReturn.list.inReturnNo',
                sortable: 'custom'
              },
              // 采购退货日期
              {
                prop: 'inReturnDate',
                width: 100,
                align: 'center',
                label: 'storage.inReturn.list.inReturnDate',
                format: {
                  func: 'dateFormat',
                  dict: 'YYYY-MM-DD'
                },
                sortable: 'custom'
              },
              // 供应商
              {
                prop: 'supplierName',
                width: 200,
                align: 'left',
                label: 'storage.inReturn.list.supplierName',
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
                label: 'storage.inReturn.list.returnType',
                sortable: 'custom',
                isShow: false
              },
              // 发货单位
              // {
              //   prop: 'deliverName',
              //   width: 300,
              //   align: 'left',
              //   label: 'storage.inReturn.list.deliverName',
              //   sortable: 'custom'
              // },
              // 仓库
              {
                prop: 'warehouseName',
                width: 200,
                align: 'left',
                label: 'storage.inReturn.list.warehouseName',
                sortable: 'custom'
              },
              // 库存商品明细编号
              {
                prop: 'stockDetailNo',
                width: 200,
                align: 'left',
                label: 'storage.inReturn.list.stockDetailNo'
              },
              // 商品
              {
                prop: 'productName',
                width: 100,
                align: 'left',
                label: 'storage.inReturn.list.productName'
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
                label: 'storage.inReturn.list.itemCount'
              },
              // 退换货数量
              {
                prop: 'outQuantity',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                label: 'storage.inReturn.list.outQuantity'
              },
              // 商品单位
              {
                prop: 'productUnitCode',
                width: 80,
                align: 'center',
                format: {
                  dict: this.$t('datadict.goodsUnit')
                },
                label: 'storage.inReturn.list.productUnitCode'
              },
              // 计量数量
              {
                prop: 'measurementQuantity',
                width: 100,
                format: {
                  func: 'weight'
                },
                align: 'right',
                label: 'storage.inReturn.list.measurementQuantity'
              },
              // 计量单位
              {
                prop: 'measurementUnitCode',
                width: 80,
                align: 'center',
                format: {
                  dict: this.$t('datadict.measurementUnit')
                },
                label: 'storage.inReturn.list.measurementUnitCode'
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
      if (param) {
        // 验证单号是否不同
        const inReturnNo = param[0].inReturnNo
        const supplierCode = param[0].supplierCode
        let flag = false
        param.forEach(e => {
          if (flag) {
            return
          }
          if (inReturnNo !== e.inReturnNo) {
            flag = true
          }
          if (supplierCode !== e.supplierCode) {
            flag = true
          }
        })
        if (flag) {
          this.$notify(
            notifyInfo({
              // 只有入库类型为批次入库时，才可以选择批次
              msg: this.$t('storage.outReturn.validateMsg.inNoticeNoDifferent')
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
