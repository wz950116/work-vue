<template>
  <qm-edit :edit='edit' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>

<script>
export default {
  name: 'wareHouseEdit',
  data() {
    return {
      edit: {
        type: this.opType,
        mode: this.opMode,
        param: this.param,
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/dd/warehouse/get',
          save: '/api/dd/warehouse/save',
          update: '/api/dd/warehouse/update'
        },
        apiData: {
          view(param) {
            return param
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
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'data.warehouse.group.editFormPart1',
            content: [
              {
                label: 'data.warehouse.form.warehouseName',
                prop: 'warehouseName',
                element: 'input-validate',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'data.warehouse.form.storeCompanyCode',
                prop: 'storeCompanyCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  data: 'CUST_INFO',
                  filterable: true,
                  clearable: true,
                  cols: 2,
                  params: {
                    typeCode: '3',
                    usingFlag: '1',
                    auditStatus: '3'
                  }
                }
              },
              {
                label: 'data.warehouse.form.warehouseType',
                prop: 'warehouseType',
                element: 'base-select',
                list: this.$t('datadict.warehouseType'),
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
              {
                label: 'data.warehouse.form.warehouseLevel',
                prop: 'warehouseLevel',
                element: 'base-select',
                list: this.$t('datadict.warehouseLevel'),
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'biz.lbl.usingFlag',
                prop: 'usingFlag',
                element: 'base-select',
                list: this.$t('datadict.usingFlag'),
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
              {
                label: 'data.warehouse.form.contact',
                prop: 'contact',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'data.warehouse.form.tel',
                prop: 'tel',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'data.warehouse.form.mail',
                prop: 'mail',
                element: 'input-validate',
                attrs: {
                  clearable: true
                }
              },
              {
                label: 'data.warehouse.form.areaCode',
                prop: 'areaCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'TREE_AREA',
                  clearable: true
                }
              },
              {
                label: 'data.warehouse.form.address',
                prop: 'address',
                element: 'el-input',
                attrs: {
                  clearable: true,
                  cols: 2
                }
              },
              {
                label: 'data.warehouse.form.allocationType',
                prop: 'allocationType',
                type: 'radio',
                list: this.$t('datadict.allocationType'),
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                event: this.changeAllocationType,
                default: '0'
              },
              {
                label: 'data.warehouse.form.remark',
                prop: 'remark',
                element: 'el-input',
                attrs: {
                  clearable: true,
                  cols: 4
                }
              }
            ]
          }
        },

        tabs: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'warehouseProductList',
            label: 'data.warehouse.tab.productTag',
            component: () => import('./productTag.vue')
          },
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'warehouseAllocationList',
            label: 'data.warehouse.tab.allocationTag',
            component: () => import('./allocationTag.vue')
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
      default: 'dialog'
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
    handleInitCallback(param) {
      this.changeAllocationType(param.allocationType)
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    },
    changeAllocationType(param) {
      //手动分配时展示
      this.edit.tabs.forEach(table => {
        if (param === '1') {
          if (table.name === 'warehouseAllocationList') {
            table.isShow = true
          }
        }

        if (param === '0') {
          if (table.name === 'warehouseAllocationList') {
            table.isShow = false
          }
        }
      })
    }
  }
}
</script>
