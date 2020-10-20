<template>
  <qm-edit ref="qmEdit" :edit="edit" @closeDialog="handleCloseDialog" @initCallback='initCallback' @preCallback="handlePreCallback"></qm-edit>
</template>

<script>
import toolUtil from '@/utils/frame/base/toolUtil.js'
import selectData from '@/views/frame/biz/data/selectData/selectData.js'
import request from '@/utils/frame/base/request'
export default {
  name: 'custCreditWhEdit',
  data() {
    return {
      edit: {
        type: this.$route.params.type || this.$route.params.opType || this.opType,
        mode: this.opMode,
        param: Object.assign({}, this.param, this.$route.params),
        api: {
          pre: {
            CUST_INFO: '/api/cust/customer/getByCode'
          },
          view: '/api/cust/credit/get',
          save: '/api/cust/credit/saveWh',
          update: '/api/cust/credit/updateWh'
        },
        apiData: {
          pre(param) {
            return param.preBillNo
          },
          view(param) {
            return param.uk || param.custCreditNo
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
            iconName: '线性-关闭',
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
            $refs: this.$refs,
            getParam: this.getParamAuditHistory,
            isShow: ['update', 'view', 'assist', 'audit'],
            event: 'auditHistory'
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.uk || data.custCreditNo,
                billType: this.$route.meta.bizCode
              }
            },
            event: 'attachment',
            isShow: ['update', 'view', 'assist', 'audit']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: [
          {
            label: 'cst.creditWh.form.custName',
            prop: 'custCode',
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
                usingFlag: '1',
                auditStatus: '3',
                typeCode: '3'
              },
              filterable: true,
              clearable: true,
              disabled: this.isReadonlyAll()
            },
            event: {
              change: this.changeCustCode
            }
          },
          {
            type: 'date',
            label: 'cst.creditWh.form.date',
            props: ['dateStart', 'dateEnd'],
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'biz.lbl.auditStatus',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.auditStatus'),
            attrs: {
              disabled: true,
              clearable: true
            }
          },
          {
            label: 'cst.creditWh.form.warnAmount',
            prop: 'warnAmount',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              gtmin: 0,
              type: 'money',
              disabled: this.isReadonlyAll()
            }
          },
          {
            label: 'cst.creditWh.form.limitAmount',
            prop: 'limitAmount',
            element: 'input-formatter',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              gtmin: 0,
              type: 'money',
              disabled: this.isReadonlyAll()
            }
          },
          {
            label: 'cst.creditWh.form.optEmployeeName',
            prop: 'optEmployeeCode',
            element: 'base-select',
            default: (this.$route.params.type || this.$route.params.opType) === 'add' ? this.$store.state.user.userEmployeeCode : '',
            attrs: {
              data: 'TREE_STAFF',
              disabled: true
            }
          },
          {
            label: 'cst.creditWh.form.applyDt',
            prop: 'applyDt',
            element: 'input-validate',
            default: toolUtil.timeStr(),
            attrs: {
              disabled: true
            }
          }
        ],

        tabs: [
          {
            isShow: ['add', 'update', 'view', 'assist', 'audit'],
            name: 'whProductList',
            label: 'cst.creditWh.tab.whProductList',
            component: () => import('./whProductList.vue')
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
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  mounted() {
    if (this.edit.param.type === 'add') {
      this.getWarehouseList().then(dataList => {
        const warehouseCodeDef = toolUtil.getDefTableColByProp(this, 'whProductList', 'warehouseCode')
        warehouseCodeDef.list.splice(0)
        for (let i = 0; i < dataList.length; i++) {
          warehouseCodeDef.list.push({
            key: dataList[i].code,
            value: dataList[i].code,
            label: dataList[i].name
          })
        }
      })
    }
  },
  methods: {
    save() {},
    handleCloseDialog(param) {
      const backName = this.$route.params.back ? this.$route.params.back : 'dashboard'
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: backName,
          params: { ...(!!param && { refresh: !!param }) }
        })
      })
    },
    isReadonlyAll() {
      return false
    },
    changeCustCode(custCode) {
      if (event) {
        if (event.srcElement.nodeName) {
        } else {
          return
        }
      }
      this.getWarehouseList().then(dataList => {
        const warehouseCodeDef = toolUtil.getDefTableColByProp(this, 'whProductList', 'warehouseCode')
        warehouseCodeDef.list.splice(0)
        const warehouseCodeMap = {}
        for (let i = 0; i < dataList.length; i++) {
          if (custCode === dataList[i].data.storeCompanyCode || toolUtil.isEmpty(custCode)) {
            warehouseCodeDef.list.push({
              key: dataList[i].code,
              value: dataList[i].code,
              label: dataList[i].name
            })
            warehouseCodeMap[dataList[i].code] = dataList[i].name
          }
        }
        const whProductList = toolUtil.getDataTabFromEdit(this, 'whProductList')
        for (let i = 0; i < whProductList.length; i++) {
          const row = whProductList[i]
          if (warehouseCodeMap[row.warehouseCode] === undefined) {
            row.warehouseCode = null
          }
        }
      })
    },
    initCallback(data) {
      if (this.edit.param.type !== 'add') {
        const custCode = data.custCode
        this.getWarehouseList().then(dataList => {
          const warehouseCodeDef = toolUtil.getDefTableColByProp(this, 'whProductList', 'warehouseCode')
          warehouseCodeDef.list.splice(0)
          const warehouseCodeMap = {}
          var wMap = new Map()
          for (let i = 0; i < dataList.length; i++) {
            if (custCode === dataList[i].data.storeCompanyCode || toolUtil.isEmpty(custCode)) {
              warehouseCodeDef.list.push({
                key: dataList[i].code,
                value: dataList[i].code,
                label: dataList[i].name
              })
              warehouseCodeMap[dataList[i].code] = dataList[i].name
              wMap.set(dataList[i].code, dataList[i].name)
            }
          }
          var list = []
          request({
            url: '/api/cust/creditWhProduct/listByCustCreditNo',
            method: 'POST',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.search'),
              data: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.custCreditNo
            }
          }).then(response => {
            response.data.forEach(element => {
              if (!wMap.get(element.warehouseCode)) {
                list.push(element.warehouseCode)
              }
            })
            if (list.length > 0) {
              request({
                url: '/api/dd/selectData/get',
                method: 'POST',
                data: {
                  funcModule: '下拉框',
                  funcOperation: '查询删除',
                  data: {
                    type: 'DD_WAREHOUSE',
                    code: list
                  }
                }
              }).then(response => {
                response.data.forEach(data => {
                  warehouseCodeDef.list.push({
                    key: data.code,
                    value: data.code,
                    label: data.name,
                    disabled: true
                  })
                })
              })
            }
          })
        })
      }
    },
    getWarehouseList() {
      return new Promise((resolve, reject) => {
        const editForm = toolUtil.getDataEditFromSelf(this)
        if (Array.isArray(editForm.warehouseList)) {
          resolve(editForm.warehouseList)
          return
        }
        selectData.listSelectData('DD_WAREHOUSE', { usingFlag: '1' }).then(dataList => {
          editForm.warehouseList = dataList
          resolve(editForm.warehouseList)
        })
      })
    },
    getParamAuditHistory() {
      const editForm = toolUtil.getDataEditFromSelf(this)
      return {
        row: editForm,
        moduleCode: this.$route.meta.bpmModule,
        uk: editForm.custCreditNo // 变量值
      }
    },
    handlePreCallback(param) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm['custCode'] = param.custCode
      // for (let i = 0; i < this.edit.formData.length; i++) {
      //   var data = this.edit.formData[i]
      //   if (data.prop === 'custCode') {
      //     data.attrs.disabled = true
      //   }
      // }
    }
  }
}
</script>
