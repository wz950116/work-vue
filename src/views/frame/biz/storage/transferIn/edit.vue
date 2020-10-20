<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='handleCloseDialog'></qm-edit>
</template>

<script>
import { dateFormate } from '@/utils/frame/base/index'
export default {
  name: 'transferInEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          view: '/api/warehouse/whTransferInBill/get',
          save: '/api/warehouse/whTransferInBill/save',
          update: '/api/warehouse/whTransferInBill/update'
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
                uk: this.$route.params.uk || this.$route.params.id
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
                transferInBillNo: data.uk || data.transferInBillNogBillNo
              }
            },
            event: 'print',
            isShow: ['view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'storage.transferIn.group.editFormPart1',
            content: [
              // 调入单号
              {
                label: 'storage.transferIn.form.transferInBillNo',
                prop: 'transferInBillNo',
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
              // 调入日期
              {
                type: 'date',
                label: 'storage.transferIn.form.transferInDate',
                prop: 'transferInDate',
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
              // 调出单号
              {
                label: 'storage.transferIn.form.transferOutBillNo',
                prop: 'transferOutBillNo',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  disabled: true,
                  clearable: false
                }
              },
              {},
              // 调入仓库
              {
                label: 'storage.transferIn.form.inWarehouseCode',
                prop: 'inWarehouseCode',
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
                  disabled: false,
                  clearable: true
                },
                event: {
                  evn: this.inWarehouseCodeChange
                }
              },
              // 调出仓库
              {
                label: 'storage.transferIn.form.outWarehouseCode',
                prop: 'outWarehouseCode',
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
                  disabled: false,
                  clearable: true
                },
                event: {
                  evn: this.outWarehouseCodeChange
                }
              },
              // 调入部门
              {
                label: 'storage.transferIn.list.inDeptName',
                prop: 'inDeptCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userDeptCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'TREE_DEPT',
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                event: {
                  evn: this.inDeptCodeChange
                }
              },
              // 调出部门
              {
                label: 'storage.transferIn.list.outDeptName',
                prop: 'outDeptCode',
                element: 'base-select',
                default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userDeptCode : '',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'TREE_DEPT',
                  filterable: true,
                  disabled: false,
                  clearable: true
                },
                event: {
                  evn: this.outDeptCodeChange
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
              },
              // 备注
              {
                label: 'biz.lbl.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  cols: 4,
                  maxlength: 500,
                  disabled: false,
                  clearable: true
                }
              }
            ]
          }
        },

        tables: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'whTransferInProductDtoList',
            label: 'storage.transferIn.tab.transferInProduct',
            component: () => import('./transferInProductTab.vue'),
            required: true
          },
          {
            isShow: ['add', 'update', 'assist', 'audit', 'view', 'complete'],
            name: 'whTransferInCostList',
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
      default: 'route'
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
    // 调入仓库change事件
    inWarehouseCodeChange(val) {
      this.clearTransferOutInfo()
      this.clearTransferInProductInfo()
    },
    // 调出仓库change事件
    outWarehouseCodeChange(val) {
      this.clearTransferOutInfo()
      this.clearTransferInProductInfo()
    },
    // 调入部门change事件
    inDeptCodeChange(val) {
      this.clearTransferOutInfo()
      this.clearTransferInProductInfo()
    },
    // 调出部门change事件
    outDeptCodeChange(val) {
      this.clearTransferOutInfo()
      this.clearTransferInProductInfo()
    },
    // 业务机构change事件
    bizOrganCodeChange(val) {
      this.clearTransferOutInfo()
      this.clearTransferInProductInfo()
    },
    // 清空库存调出单号
    clearTransferOutInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['transferOutBillNo'] = ''
    },
    // 清空调入商品信息
    clearTransferInProductInfo() {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.whTransferInProductDtoList[0].$refs.tab.tableData = []
    }
  }
}
</script>
