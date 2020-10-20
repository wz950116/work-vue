<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'stockBeginOpenEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/warehouse/whBeginData/get',
          save: '/api/warehouse/whBeginData/save',
          update: '/api/warehouse/whBeginData/update'
        },
        apiData: {
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
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            showLoading: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
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
            isShow: ['update', 'view']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'transaction.transactionBalanceInit.group.editPart1',
            content: [
              // 单据号
              {
                label: 'storage.beginOpen.form.inBillNo',
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
                  clearable: false
                }
              },
              // 初始化日期
              {
                type: 'date',
                label: 'storage.beginOpen.form.inDate',
                prop: 'inDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: false,
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                },
                default: dateFormate(new Date(), 'yyyyMMdd')
              },
              // 仓库
              {
                label: 'storage.beginOpen.form.warehouseCode',
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
                  filterable: true,
                  clearable: true
                }
              },
              // 供应商
              {
                label: 'storage.beginOpen.form.supplierCode',
                prop: 'supplierCode',
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
                    typeCode: '12',
                    usingFlag: '1',
                    auditStatus: '3'
                  },
                  filterable: true,
                  clearable: true
                }
              },
              // 商品
              {
                label: 'storage.beginOpen.form.productCode',
                prop: 'productCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  data: 'DD_PRODUCT',
                  filterable: true,
                  clearable: true
                }
              },
              // 品牌
              {
                label: 'storage.beginOpen.form.brand',
                prop: 'brand',
                element: 'input-validate',
                isShow: this.$store.state.user.showGoodCols.includes('brand'),
                attrs: {
                  clearable: true
                }
              },
              // 规格
              {
                label: 'storage.beginOpen.form.spec',
                prop: 'spec',
                element: 'input-validate',
                isShow: this.$store.state.user.showGoodCols.includes('spec'),
                attrs: {
                  clearable: true
                }
              },
              // 产地
              {
                label: 'storage.beginOpen.form.origin',
                prop: 'origin',
                element: 'input-validate',
                isShow: this.$store.state.user.showGoodCols.includes('origin'),
                attrs: {
                  clearable: true
                }
              },
              // 物资主属性01
              {
                label: 'storage.beginOpen.form.productKeyAttr01',
                prop: 'productKeyAttr01',
                isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr01'),
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              // 物资主属性02
              {
                label: 'storage.beginOpen.form.productKeyAttr02',
                prop: 'productKeyAttr02',
                isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr02'),
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              // 物资主属性03
              {
                label: 'storage.beginOpen.form.productKeyAttr03',
                prop: 'productKeyAttr03',
                isShow: this.$store.state.user.showGoodCols.includes('productKeyAttr03'),
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              // 库区
              {
                label: 'storage.beginOpen.form.stockArea',
                prop: 'stockArea',
                element: 'input-validate'
              },
              // 库位
              {
                label: 'storage.beginOpen.form.stockPosition',
                prop: 'stockPosition',
                element: 'input-validate'
              },
              // 仓储号
              {
                label: 'storage.beginOpen.form.stockNo',
                prop: 'stockNo',
                element: 'input-validate'
              },
              // 库存件数
              {
                label: 'storage.beginOpen.form.itemCount',
                prop: 'itemCount',
                element: 'input-formatter',
                attrs: {
                  type: 'num',
                  disabled: false,
                  clearable: true
                }
              },
              // 库存数量
              {
                label: 'storage.beginOpen.form.quantity',
                prop: 'quantity',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'weight',
                  disabled: false,
                  clearable: true
                }
              },
              // 币种
              {
                label: 'storage.beginOpen.form.currencyCode',
                prop: 'currencyCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'CURRENCY',
                  disabled: false,
                  clearable: true
                },
                default: 'CNY'
              },
              // 汇率
              {
                label: 'storage.beginOpen.form.exchangeRate',
                prop: 'exchangeRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'price',
                  disabled: false,
                  clearable: true
                }
              },
              // 税率
              {
                label: 'storage.beginOpen.form.taxRate',
                prop: 'taxRate',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'num',
                  disabled: false,
                  clearable: true
                }
              },
              // 定价价格
              {
                label: 'storage.beginOpen.form.pricePricing',
                prop: 'pricePricing',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'price',
                  disabled: false,
                  clearable: true
                }
              },
              // 定价数量
              {
                label: 'storage.beginOpen.form.measurementQuantity',
                prop: 'measurementQuantity',
                element: 'input-formatter',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  type: 'weight',
                  disabled: false,
                  clearable: true
                }
              },
              {
                label: 'storage.beginOpen.form.productUnitCode',
                prop: 'productUnitCode',
                element: 'base-select',
                list: this.$t('datadict.measurementUnit'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              // 计量单位编码
              {
                label: 'storage.beginOpen.form.measurementUnitCode',
                prop: 'measurementUnitCode',
                element: 'base-select',
                list: this.$t('datadict.measurementUnit'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              // 业务机构
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
                  data: 'FUNC_ORG',
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                event: {
                  evn: this.bizOrganCodeChange
                }
              },
              // 业务部门
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
                  disabled: false,
                  clearable: true
                }
              },
              // 业务员
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
                  filterable: true,
                  disabled: false,
                  clearable: true
                }
              },
              // 操作员
              {
                label: 'biz.lbl.optName',
                prop: 'optEmployeeCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  disabled: true
                }
              }
            ]
          }
        },

        tabs: []
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
      default: 'route'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  methods: {
    // 初始化回调
    handleInitCallback(param) {},
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
    // 本页面关闭
    handleCloseDialog(param) {
      if (this.opMode === 'dialog') {
        this.$emit('closeHandler', param)
      } else {
        const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
        this.$store.dispatch('delVisitedViews', this.$route).then(() => {
          this.$router.push({
            name: backName,
            params: { ...(!!param && { refresh: !!param }) }
          })
        })
      }
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {}
  }
}
</script>
