<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
export default {
  name: 'inCheckEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/warehouse/inCheckBill/get',
          save: '/api/warehouse/inCheckBill/save',
          update: '/api/warehouse/inCheckBill/update',
          pre: {
            WH_IN_BILL: '/api/warehouse/inProduct/list'
          }
        },
        apiData: {
          pre(param) {
            return {
              inBillNo: param.preBillNo
            }
          },
          view(param) {
            return param.uk || param.inCheckNo
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
            // extraEvent: this.waningCheck
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
                uk: this.$route.params.uk || this.$route.params.inCheckNo
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
                billNo: data.uk || data.inCheckNo,
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
                inCheckNo: data.uk || data.inCheckNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          },
          {
            iconName: '线性-入库单',
            name: 'biz.btn.inBIllNo',
            event: 'set',
            // validate: this.onInBillNo,
            isShow: ['add', 'update'],
            component: () => import('@/views/frame/biz/storage/inNotice/chooseInProduct.vue'),
            initChoose: this.inBillNoInitChoose,
            callback: this.inBillNoCallback
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.inCheck.group.editFormPart1',
            content: [
              {
                label: 'storage.inCheck.form.inBillNo',
                prop: 'inBillNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                type: 'date',
                label: 'storage.inCheck.form.inDate',
                prop: 'inDate',
                attrs: {
                  disabled: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
                }
              },
              {
                label: 'storage.inCheck.form.inType',
                prop: 'inType',
                element: 'base-select',
                list: this.$t('datadict.inNormalType'),
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'storage.inCheck.form.ladingBillNo',
                prop: 'ladingBillNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'storage.inCheck.form.supplierCode',
                prop: 'supplierName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'storage.inCheck.form.deliverCode',
                prop: 'deliverName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                isShow: false
              },
              {
                label: 'storage.inCheck.form.warehouseCode',
                prop: 'warehouseName',
                element: 'input-validate',
                attrs: {
                  disabled: true
                }
              },
              {
                label: 'storage.inCheck.form.lotNo',
                prop: 'lotNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                }
              },
              {
                label: 'storage.inCheck.form.contractNo',
                prop: 'contractNo',
                element: 'input-validate',
                attrs: {
                  disabled: true,
                  clearable: true
                },
                isShow: false
              },
              {
                label: 'storage.inCheck.form.preBillType',
                prop: 'preBillType',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                isShow: false
              },
              {
                label: 'storage.inCheck.form.preBillNo',
                prop: 'preBillNo',
                element: 'input-validate',
                attrs: {
                  disabled: true
                },
                isShow: false
              }
            ]
          },
          part2: {
            titleName: 'storage.inCheck.group.editFormPart2',
            content: [
              {
                label: 'storage.inCheck.form.inCheckNo',
                prop: 'inCheckNo',
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
                label: 'storage.inCheck.form.inCheckDate',
                prop: 'inCheckDate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  valueFormat: 'yyyyMMdd'
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
                label: 'storage.inNotice.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  clearable: true,
                  maxlength: 500,
                  cols: 2
                }
              }
            ]
          }
        },

        tables: [
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'inCheckProductList',
            label: 'storage.inCheck.tab.product',
            component: () => import('./productTab.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view'],
            name: 'inCheckDetailList',
            label: 'storage.inCheck.tab.productDetail',
            component: () => import('./productDetailTab.vue'),
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
    handlePreCallback(result) {
      this.inBillNoCallback(result)
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
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName
        })
      })
    },
    // 选择入库通知商品设置默认值
    inBillNoInitChoose() {
      return {
        initSearch: true,
        multiple: true
      }
    },
    // 选择入库通知商品回调
    inBillNoCallback(params) {
      const editForm = this.$refs.qmEdit.$refs.qmRouteEdit.editForm
      const productList = this.$refs.qmEdit.$refs.qmRouteEdit.$refs.inCheckProductList[0].$refs.tab.tableData

      for (let i = 0; i < params.length; i++) {
        if (params[i].inBillNo !== params[0].inBillNo) {
          this.$notify(notifyInfo({ msg: this.$t('storage.inCheck.validateMsg.chooseInProductBack') }))
          return
        }
      }

      if (editForm.inBillNo !== params[0].inBillNo) {
        productList.splice(0)
      }

      editForm.inBillNo = params[0].inBillNo
      editForm.inDate = params[0].inDate
      editForm.inType = params[0].inType
      editForm.ladingBillNo = params[0].ladingBillNo
      editForm.lotNo = params[0].lotNo
      editForm.contractNo = params[0].contractNo
      // editForm.preBillType = params[0].preBillType
      // editForm.preBillNo = params[0].preBillNo
      editForm.supplierCode = params[0].supplierCode
      editForm.deliverCode = params[0].deliverCode
      editForm.warehouseCode = params[0].warehouseCode
      editForm.supplierName = params[0].supplierName
      editForm.deliverName = params[0].deliverName
      editForm.warehouseName = params[0].warehouseName

      params.forEach((row, index) => {
        const product = {}
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
        product['inQuantity'] = row.inQuantity
        product['restQuantity'] = row.restQuantity > 0 ? row.restQuantity : 0
        product['actualQuantity'] = null
        product['productUnitCode'] = row.productUnitCode
        product['measurementQuantity'] = row.measurementQuantity
        product['restMeasurementQuantity'] = row.restMeasurementQuantity > 0 ? row.restMeasurementQuantity : 0
        product['actualMeasurementQuantity'] = null
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
