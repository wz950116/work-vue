<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import QmSelectPrompt from '@/components/frame/qm/qmSelectPrompt/index.js'
export default {
  name: 'purchaseContract',
  data() {
    return {
      moduleCode: this.$route.meta.bpmModule,
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            contractNo: '',
            supplierCode: '',
            productCode: '',
            auditStatus: '',
            contractType: '',
            deliveryMarketCode: '',
            signDateFrom: '',
            signDateTo: '',
            bizEmployeeCode: ''
          },
          defaultSortString: 'docMakeDt.desc'
        },
        formData: [
          {
            type: 'date',
            label: 'spot.contractLot.form.signDate',
            props: ['signDateFrom', 'signDateTo'],
            attrs: {
              format: 'yyyy-MM-dd',
              valueFormat: 'yyyyMMdd'
            }
          },
          {
            label: 'spot.contractLot.form.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.supplierCode',
            prop: 'supplierCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '2',
                usingFlag: '1',
                auditStatus: '3'
              },
              clearable: true,
              filterable: true
            }
          },
          {
            label: 'spot.contractLot.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.contractState',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.contractStat'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.contractType',
            prop: 'contractType',
            element: 'base-select',
            list: this.$t('datadict.contractType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.deliveryMarketCode',
            prop: 'deliveryMarketCode',
            element: 'base-select',
            attrs: {
              data: 'DD_SPOT_MARKET',
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.bizEmployeeCode',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/contract/pcInfo/list',
          export: '/api/contract/pcInfo/export',
          doDelete: '/api/contract/pcInfo/remove'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param.contractNo
          }
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            $refs: this.$refs,
            routeInfo() {
              return {
                name: 'purchaseContractAdd',
                params: {
                  type: 'add',
                  back: this.$refs.qmForm.$route.name
                }
              }
            }
          },
          {
            name: 'update',
            permitName: ['copy'],
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'purchaseContractCopy',
                params: {
                  type: 'copy',
                  contractNo: currentRow.contractNo,
                  back: this.$refs.qmForm.$route.name
                }
              }
            }
          },
          {
            name: 'update',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'purchaseContractUpdate',
                params: {
                  type: 'update',
                  contractNo: currentRow.contractNo,
                  back: this.$refs.qmForm.$route.name
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/contract/pcInfo/validatedApi',
                data: row.contractNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.contractNo
            },
            validateApi(row) {
              return {
                url: '/api/contract/pcInfo/validatedApi',
                data: row.contractNo
              }
            }
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'purchaseContractView',
                params: {
                  type: 'view',
                  contractNo: currentRow.contractNo,
                  back: this.$refs.qmForm.$route.name
                }
              }
            }
          },
          {
            name: 'submitAudit',
            type: 'dialog',
            title: this.$t('route.' + this.$route.meta.title),
            getParam(currentRow) {
              const textValue = this.title + '单据号: ' + currentRow.contractNo
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.contractNo // 变量值
                },
                todotext: {
                  name: 'CURR_BIZ_TODO_TEXT',
                  value: textValue // 变量值
                }
              }
            },
            component: () => import('@/views/frame/base/bpm/components/nextUserAloneStartShowDialog')
          },
          {
            name: 'withdrawAudit',
            msg: this.$t('biz.msg.disableWithdrawAudit'),
            validate(currentRow) {
              return currentRow.auditStatus === '2'
            },
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                uk: currentRow.contractNo,
                moduleCode: this.moduleCode
              }
            }
          },
          {
            name: 'auditHistory',
            type: 'dialog',
            moduleCode: this.$route.meta.bpmModule,
            getParam(currentRow) {
              return {
                row: currentRow,
                moduleCode: this.moduleCode,
                processId: currentRow.processId,
                uk: currentRow.contractNo
              }
            }
          },
          {
            name: 'view',
            permitName: ['modify'],
            iconName: '线性-变更',
            i18n: 'biz.btn.change',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'purchaseContractChangeAdd',
                params: {
                  type: 'add',
                  contractNo: currentRow.contractNo,
                  back: this.$refs.qmForm.$route.name
                }
              }
            },
            msg: this.$t('spot.contractLot.msg.changeAuditCheck'),
            validate(currentRow) {
              return currentRow && currentRow.auditStatus === '3'
            }
          },
          {
            name: 'modifyHistory',
            iconName: '线性-历史版本',
            i18n: 'biz.btn.modifyHistory',
            event: this.doHistory
          },
          {
            name: 'finish',
            iconName: '线性-完结',
            i18n: 'biz.btn.finish',
            event: this.doAchive
          },
          {
            name: 'selectBill',
            type: 'route',
            $route: this.$route,
            routeInfo(currentRow) {
              return {
                name: 'jointSearch',
                params: {
                  billNo: currentRow.contractNo,
                  billType: this.$route.meta.bizCode,
                  back: this.$route.name
                }
              }
            }
          },
          {
            name: 'archiveShow',
            iconName: '线性-查看',
            i18n: 'biz.btn.archiveShow',
            permitName: ['archiveShow'],
            event: this.archiveShow
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          },
          {
            name: 'print',
            getParam(currentRow) {
              return {
                contractNo: currentRow.contractNo
              }
            }
          },
          {
            name: 'more',
            i18n: 'biz.btn.generateBill',
            list: [
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['purchaseLot'],
                i18n: 'spot.contractLot.btn.addLot',
                type: 'route',
                event: this.openPageLotAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['fundApply'],
                i18n: 'spot.contractLot.btn.fundApplyAddPre',
                event: this.openPageFundApplyAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['lcApply'],
                i18n: 'spot.contractLot.btn.lcApplyAdd',
                event: this.openPageLcApplyAdd
              }
            ]
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: 'purchaseContract',
          mergeProp: 'productDetailList',
          cols: [
            {
              label: 'spot.contractLot.form.contractState',
              width: '80',
              prop: 'auditStatus',
              align: 'center',
              format: {
                dict: this.$t('datadict.contractStat')
              }
            },
            {
              label: 'spot.contractLot.form.contractNo',
              width: '180',
              prop: 'contractNo'
            },
            {
              label: 'spot.contractLot.form.signDate',
              width: '90',
              prop: 'signDate',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.tradeType',
              width: '80',
              prop: 'tradeType',
              align: 'center',
              format: {
                dict: this.$t('datadict.tradeType')
              }
            },
            {
              label: 'spot.contractLot.form.contractType',
              width: '80',
              align: 'center',
              prop: 'contractType',
              format: {
                dict: this.$t('datadict.contractType')
              }
            },
            {
              label: 'spot.contractLot.form.headlineNames',
              prop: 'headlineNames',
              width: '300'
            },
            {
              label: 'spot.contractLot.form.supplierNames',
              prop: 'supplierNames',
              width: '210'
            },
            {
              label: 'spot.contractLot.form.contractLifeStart',
              width: '90',
              prop: 'contractLifeStart',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.contractLifeEnd',
              width: '90',
              prop: 'contractLifeEnd',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.originalAmount',
              prop: 'originalAmount',
              align: 'right',
              width: '120',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.currency',
              width: '90',
              prop: 'currencyName',
              align: 'center'
            },
            {
              label: 'spot.contractLot.form.deliveryMarketName',
              width: '100',
              prop: 'deliveryMarketName'
            },
            {
              label: 'spot.contractLot.form.productName',
              width: '180',
              prop: 'productName',
              isSon: true
            },
            ...this.$store.state.user.mainGoodColsTxtSon,
            {
              label: 'spot.contractLot.form.productQuantity',
              width: '120',
              prop: 'productQuantity',
              align: 'right',
              format: {
                func: 'weight'
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.productUnitCode',
              width: '90',
              prop: 'productUnitCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.goodsUnit')
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.measurementQuantity',
              width: '120',
              prop: 'measurementQuantity',
              align: 'right',
              format: {
                func: 'weight'
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.measurementUnitCode',
              width: '90',
              prop: 'measurementUnitCode',
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              },
              isSon: true
            },
            {
              label: 'spot.contractLot.form.bizEmployeeName',
              width: '90',
              prop: 'bizEmployeeName'
            },
            {
              label: 'spot.contractLot.form.optEmployeeName',
              width: '90',
              prop: 'optEmployeeName'
            },
            {
              label: 'spot.contractLot.form.docMakeDt',
              prop: 'docMakeDt',
              width: '150',
              align: 'center'
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
      }
    }
  },
  methods: {
    doAchive() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.achiveAuditCheck') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.closeContractConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/contract/pcInfo/achive',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: currentRow.contractNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.$notify(notifySuccess({ msg: this.$t('spot.contractLot.msg.successAchive') }))
            this.$refs.qmTable.getList()
          } else {
            this.$confirm(this.$t(response.msgText), this.$t('biz.msg.tip'), {
              confirmButtonText: this.$t('biz.btn.confirm'),
              cancelButtonText: this.$t('biz.btn.cancel'),
              type: 'warning'
            }).then(() => {
              request({
                url: '/api/contract/pcInfo/achive',
                method: 'post',
                data: {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.search'),
                  data: {
                    contractLotNo: currentRow.contractNo,
                    forceFlag: '1'
                  }
                }
              }).then(response => {
                if (response.status) {
                  this.$notify(notifySuccess({ msg: this.$t('spot.contractLot.msg.successAchive') }))
                  this.$refs.qmTable.getList()
                }
              })
            })
          }
        })
      })
    },
    doHistory() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      this.openPage('purchaseContractHistory', {
        contractNo: currentRow.contractNo
      })
    },
    archiveShow() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      this.openPage('conRelationBill', {
        billType: 'CON_PC_INFO',
        billNo: currentRow.contractNo
      })
    },
    openPage(pageName, pageParam) {
      const params = {}
      if (pageParam) {
        Object.assign(params, pageParam)
      }
      params.back = this.$route.name
      params.backParam = this.$route.params
      this.$router.push({
        name: pageName,
        params: params
      })
    },
    openPageLotAdd() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.noApproved') }))
        return
      }
      request({
        url: '/api/contract/pcInfo/checkAddLotAble',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: currentRow.contractNo
        }
      }).then(response => {
        if (response.status) {
          this.openPage('purchaseLotAdd', {
            type: 'add',
            preBillNo: currentRow.contractNo,
            preBillType: 'CON_PC_INFO',
            back: 'purchaseContract'
          })
        }
      })
    },
    openPageWithSuppilerCode(page) {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.noApproved') }))
        return
      }
      const supplierCodeList = currentRow.supplierCodeList
      const supplierCode = supplierCodeList[0]
      if (supplierCodeList.length === 1) {
        this.openPage(page, {
          type: 'add',
          preBillNo: currentRow.contractNo,
          preBillType: 'CON_PC_INFO',
          back: 'purchaseContract',
          supplierCode: supplierCode
        })
        return
      }

      const supplierList = []
      const supplierNameList = currentRow.supplierNameList
      for (let i = 0; i < supplierCodeList.length; i++) {
        supplierList.push({
          value: supplierCodeList[i],
          label: supplierNameList[i]
        })
      }

      QmSelectPrompt({
        title: this.$t('spot.contractLot.popup.chooseSupplier'),
        message: this.$t('spot.contractLot.msg.chooseSupplier'),
        inputValue: supplierCode,
        inputList: supplierList
      }).then(({ value }) => {
        if (value) {
          this.openPage(page, {
            type: 'add',
            preBillNo: currentRow.contractNo,
            preBillType: 'CON_PC_INFO',
            back: 'purchaseContract',
            supplierCode: value
          })
        }
      })
    },
    openPageFundApplyAdd() {
      this.openPageWithSuppilerCode('fundApplyAdd')
    },
    openPageLcApplyAdd() {
      this.openPageWithSuppilerCode('lcApplyAdd')
    }
  }
}
</script>
