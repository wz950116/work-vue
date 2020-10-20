<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog"></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  name: 'inCheckEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/warehouse/whUnregistBill/get',
          save: '/api/warehouse/whUnregistBill/save',
          update: '/api/warehouse/whUnregistBill/update'
        },
        apiData: {
          view(param) {
            return param.uk || param.id
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
            isShow: ['add', 'update'],
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
                uk: this.$route.params.id
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
                billNo: this.$route.params.id,
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
                unregistNo: data.uk || data.unregistNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'biz.title.mainInfo',
            content: [
              {
                label: 'storage.unregistBill.form.unregistNo',
                prop: 'unregistNo',
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
                label: 'storage.unregistBill.form.unregistDate',
                prop: 'unregistDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd',
                  clearable: true
                }
              },
              {
                label: 'storage.unregistBill.form.registNo',
                prop: 'registNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'storage.registBill.form.productCode',
                prop: 'productCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'DD_PRODUCT',
                  clearable: true
                }
              },
              {
                label: 'storage.unregistBill.form.warehouseCode',
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
                  clearable: true
                }
              },
              {
                label: 'storage.unregistBill.form.bizEmployeeCode',
                prop: 'bizEmployeeCode',
                element: 'base-select',
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
              }
            ]
          }
        },
        tables: [
          {
            name: 'detailList',
            label: 'storage.unregistBill.tab.product',
            component: () => import('./productTab.vue'),
            required: true
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
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
    },
    // 选择入库通知商品设置默认值
    inBillNoSetDefault() {
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.noRest = '1'
      this.$loopDOM(this, 'qmDialogTable').listQuery.data.goodsFlag = '0'
      this.$loopDOM(this, 'qmDialogTable').getList()
    },
    // 选择入库通知商品回调
    inBillNoCallback(params) {
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.detailList[0].$refs.tab.tableData

      for (let i = 0; i < params.length; i++) {
        if (params[i].inBillNo !== params[0].inBillNo) {
          this.$notify(notifyInfo({ msg: this.$t('storage.inCheck.validateMsg.chooseInProductBack') }))
          return
        }
      }

      params.forEach((row, index) => {
        const product = {}
        product['inBillNo'] = row.inBillNo
        product['lotNo'] = row.lotNo
        product['supplierCode'] = row.supplierCode
        product['warehouseCode'] = row.warehouseCode
        product['supplierName'] = row.supplierName
        product['warehouseName'] = row.warehouseName
        product['inBillNo'] = row.inBillNo
        product['lotNo'] = row.lotNo
        product['contractNo'] = row.contractNo
        product['inProductNo'] = row.inProductNo
        product['supplierCode'] = row.supplierCode
        product['supplierName'] = row.supplierName
        product['lotProductDetailCode'] = row.lotProductDetailCode
        product['preBillProductDetailCode'] = row.preBillProductDetailCode
        product['productCode'] = row.productCode
        product['productName'] = row.productName
        product['brand'] = row.brand
        product['spec'] = row.spec
        product['origin'] = row.origin
        product['productKeyAttr01'] = row.productKeyAttr01
        product['productKeyAttr02'] = row.productKeyAttr02
        product['productKeyAttr03'] = row.productKeyAttr03
        product['itemCount'] = row.itemCount
        product['actualCount'] = row.null
        product['registQuantity'] = row.inQuantity
        product['productUnitCode'] = row.productUnitCode
        product['registMeasurementQuantity'] = row.measurementQuantity
        product['measurementUnitCode'] = row.measurementUnitCode
        product['rightFlag'] = '1'
        if (
          !productList
            .map(v => {
              return v.inBillNo + v.inProductNo
            })
            .includes(product.inBillNo + product.inProductNo)
        ) {
          productList.push(product)
        }
      })
    }
  }
}
</script>
