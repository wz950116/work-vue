<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData"></qm-table-array>
    </template>
  </div>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import QmSelectPrompt from '@/components/frame/qm/qmSelectPrompt/index.js'
export default {
  name: 'domesticSalesLot',
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
            lotNo: '',
            productCode: '',
            customerCode: '',
            auditStatus: '',
            deliveryMarketCode: '',
            signDateFrom: '',
            signDateTo: '',
            bizEmployeeCode: '',
            externalFlag: '0'
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
            label: 'spot.contractLot.form.lotNo',
            prop: 'lotNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.customerCode',
            prop: 'customerCode',
            element: 'base-select',
            attrs: {
              data: 'CUST_INFO',
              params: {
                typeCode: '1',
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
            label: 'spot.contractLot.form.lotState',
            prop: 'auditStatus',
            element: 'base-select',
            list: this.$t('datadict.contractStat'),
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
          },
          {
            label: 'spot.contractLot.form.goodFinish',
            prop: 'goodFinishFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.fundFinish',
            prop: 'fundFinishFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spot.contractLot.form.invoFinish',
            prop: 'invoFinishFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/domesticContract/slInfo/list',
          export: '/api/domesticContract/slInfo/export',
          doDelete: '/api/domesticContract/slInfo/remove'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param.lotNo
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
                name: 'domesticSalesLotAdd',
                params: {
                  type: 'add',
                  back: this.$refs.qmForm.$route.name
                }
              }
            }
          },
          {
            name: 'update',
            iconName: '线性-复制',
            i18n: 'biz.btn.copy',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'domesticSalesLotCopy',
                params: {
                  type: 'copy',
                  lotNo: currentRow.lotNo,
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
                name: 'domesticSalesLotUpdate',
                params: {
                  type: 'update',
                  lotNo: currentRow.lotNo,
                  back: this.$refs.qmForm.$route.name
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/domesticContract/slInfo/validatedApi',
                data: row.lotNo
              }
            }
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.lotNo
            },
            validateApi(row) {
              return {
                url: '/api/domesticContract/slInfo/validatedApi',
                data: row.lotNo
              }
            }
          },
          {
            name: 'view',
            type: 'route',
            $refs: this.$refs,
            routeInfo(currentRow) {
              return {
                name: 'domesticSalesLotView',
                params: {
                  type: 'view',
                  lotNo: currentRow.lotNo,
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
              const textValue = this.title + '单据号: ' + currentRow.lotNo
              return {
                row: currentRow,
                type: 'audit',
                uk: {
                  name: 'UK',
                  value: currentRow.lotNo // 变量值
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
                uk: currentRow.lotNo,
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
                uk: currentRow.lotNo // 变量值
              }
            }
          },
          {
            name: 'modify',
            permitName: ['modify'],
            iconName: '线性-变更',
            i18n: 'biz.btn.change',
            type: 'route',
            $refs: this.$refs,
            event: this.openModifyAdd
          },
          {
            name: 'modifyHistory',
            iconName: '线性-历史版本',
            i18n: 'biz.btn.modifyHistory',
            $refs: this.$refs,
            event: this.doHistory
          },
          {
            name: 'more',
            i18n: 'biz.btn.finish',
            list: [
              {
                name: 'finish',
                permitName: ['goodFinish'],
                iconName: '线性-完结',
                i18n: 'spot.contractLot.btn.goodFinish',
                $refs: this.$refs,
                event: this.goodFinish
              },
              {
                name: 'finish',
                permitName: ['fundFinish'],
                iconName: '线性-完结',
                i18n: 'spot.contractLot.btn.fundFinish',
                $refs: this.$refs,
                event: this.fundFinish
              },
              {
                name: 'finish',
                permitName: ['invoFinish'],
                iconName: '线性-完结',
                i18n: 'spot.contractLot.btn.invoFinish',
                $refs: this.$refs,
                event: this.invoFinish
              },
              {
                name: 'finish',
                permitName: ['finish'],
                iconName: '线性-完结',
                i18n: 'biz.btn.finish',
                $refs: this.$refs,
                event: this.doAchive
              }
            ]
          },
          {
            name: 'archiveShow',
            iconName: '线性-查看',
            i18n: 'biz.btn.archiveShow',
            permitName: ['archiveShow'],
            $refs: this.$refs,
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
                lotNo: currentRow.lotNo
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
                permitName: ['ladingOut'],
                i18n: 'spot.contractLot.btn.ladingOutAdd',
                event: this.openPageLadingOutAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['outNotice'],
                i18n: 'spot.contractLot.btn.outNoticeAdd',
                event: this.openPageOutNoticeAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['fundClaim'],
                i18n: 'spot.contractLot.btn.fundClaimAdd',
                event: this.openPageFundClaimAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['domesticInvoiceApply'],
                i18n: 'spot.contractLot.btn.domesticInvoiceApplyAdd',
                event: this.openPageDomesticInvoiceApplyAdd
              }
              // {
              //   msg: this.$t('spot.contractLot.msg.noApproved'),
              //   name: 'next',
              //   permitName: ['makeProvisional'],
              //   i18n: 'spot.contractLot.btn.makeProvisionalAdd',
              //   event: this.openPageMakeProvisionalAdd
              // },
              // {
              //   msg: this.$t('spot.contractLot.msg.noApproved'),
              //   name: 'next',
              //   permitName: ['makeFinal'],
              //   i18n: 'spot.contractLot.btn.makeFinalAdd',
              //   event: this.openPageMakeFinalAdd
              // }
            ]
          }
        ],
        isColset: true,
        initSearch: true,
        table: {
          id: '',
          mergeProp: 'productDetailList',
          cols: [
            {
              label: 'spot.contractLot.form.lotState',
              width: '80',
              prop: 'auditStatus',
              align: 'center',
              format: {
                dict: this.$t('datadict.contractStat')
              }
            },
            {
              label: 'spot.contractLot.form.lotNo',
              width: '180',
              prop: 'lotNo'
            },
            {
              label: 'spot.contractLot.form.contractNo',
              width: '180',
              prop: 'contractNo'
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
              label: 'spot.contractLot.form.customerNames',
              prop: 'customerNames',
              width: '210'
            },
            {
              label: 'spot.contractLot.form.goodFinish',
              width: '80',
              prop: 'goodFinishFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              label: 'spot.contractLot.form.fundFinish',
              width: '80',
              prop: 'fundFinishFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              label: 'spot.contractLot.form.invoFinish',
              width: '80',
              prop: 'invoFinishFlag',
              align: 'center',
              format: {
                dict: this.$t('datadict.yesNo')
              }
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
              label: 'spot.contractLot.form.lotLifeStart',
              width: '90',
              prop: 'lotLifeStart',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.lotLifeEnd',
              width: '90',
              prop: 'lotLifeEnd',
              align: 'center',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              label: 'spot.contractLot.form.originalAmount',
              width: '120',
              prop: 'originalAmount',
              align: 'right',
              format: {
                func: 'money'
              }
            },
            {
              label: 'spot.contractLot.form.currency',
              width: '80',
              prop: 'currency',
              align: 'center',
              format: {
                dict: this.$t('datadict.currency')
              }
            },
            {
              label: 'spot.contractLot.form.deliveryMarketName',
              width: '180',
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
              prop: 'productQuantity',
              width: '120',
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
              prop: 'measurementQuantity',
              width: '120',
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
              //收款总额
              label: 'spot.contractLot.form.receiveAmount',
              width: '90',
              prop: 'receiveAmount',
              align: 'right',
              format: {
                func: 'money'
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
      this.$confirm(this.$t('spot.contractLot.msg.closeLotConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/domesticContract/slInfo/achive',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: currentRow.lotNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.$refs.qmTable.getList()
          }
        })
      })
    },
    goodFinish() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotStatChk3') }))
        return
      }
      if (currentRow.goodFinishFlag === '1') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotGoodFinishChk') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.lotGoodFinishConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/domesticContract/slInfo/goodFinish',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: currentRow.lotNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.$refs.qmTable.getList()
          }
        })
      })
    },
    fundFinish() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotStatChk3') }))
        return
      }
      if (currentRow.fundFinishFlag === '1') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotFundFinishChk') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.lotFundFinishConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/domesticContract/slInfo/fundFinish',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: currentRow.lotNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.$refs.qmTable.getList()
          }
        })
      })
    },
    invoFinish() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotStatChk3') }))
        return
      }
      if (currentRow.invoFinishFlag === '1') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.lotInvoFinishChk') }))
        return
      }
      this.$confirm(this.$t('spot.contractLot.msg.lotInvoFinishConfirmed'), this.$t('notify.title.warning'), {
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel'),
        type: 'warning'
      }).then(() => {
        request({
          url: '/api/domesticContract/slInfo/invoFinish',
          method: 'post',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.search'),
            data: {
              contractLotNo: currentRow.lotNo,
              forceFlag: '0'
            }
          }
        }).then(response => {
          if (response.status) {
            this.$refs.qmTable.getList()
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
      this.openPage('domesticSalesLotHistory', {
        lotNo: currentRow.lotNo
      })
    },
    archiveShow() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      this.openPage('conRelationBill', {
        billType: 'DOM_CON_SL_INFO',
        billNo: currentRow.lotNo
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
    openModifyAdd() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.changeAuditCheck') }))
        return
      }
      request({
        url: '/api/domesticContract/slInfo/checkChangeAble',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: currentRow.lotNo
        }
      }).then(response => {
        if (response.status) {
          this.openPage('domesticSalesLotChangeAdd', {
            type: 'add',
            lotNo: currentRow.lotNo,
            back: this.$refs.qmForm.$route.name
          })
        }
      })
    },
    openPageWithCustomerCode(page) {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow === null) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      if (currentRow.auditStatus !== '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.noApproved') }))
        return
      }
      const customerCodeList = currentRow.customerCodeList
      const customerCode = customerCodeList[0]
      if (customerCodeList.length === 1) {
        this.openPage(page, {
          type: 'add',
          preBillNo: currentRow.lotNo,
          preBillType: 'DOM_CON_SL_INFO',
          back: 'domesticSalesLot',
          customerCode: customerCode
        })
        return
      }

      const customerList = []
      const customerNameList = currentRow.customerNameList
      for (let i = 0; i < customerCodeList.length; i++) {
        customerList.push({
          value: customerCodeList[i],
          label: customerNameList[i]
        })
      }

      QmSelectPrompt({
        title: this.$t('spot.contractLot.popup.chooseCustomer'),
        message: this.$t('spot.contractLot.msg.chooseCustomer'),
        inputValue: customerCode,
        inputList: customerList
      }).then(({ value }) => {
        if (value) {
          this.openPage(page, {
            type: 'add',
            preBillNo: currentRow.lotNo,
            preBillType: 'DOM_CON_SL_INFO',
            back: 'domesticSalesLot',
            customerCode: value
          })
        }
      })
    },
    openPageLadingOutAdd() {
      this.openPageWithCustomerCode('ladingOutAdd')
    },
    openPageOutNoticeAdd() {
      this.openPageWithCustomerCode('outNoticeAdd')
    },
    openPageFundClaimAdd() {
      this.openPageWithCustomerCode('fundClaimAdd')
    },
    // openPageDomesticInvoiceApplyAdd() {
    //   const currentRow = this.$refs.qmTable.currentRow
    //   if (currentRow !== null && currentRow.tradeType !== '3') {
    //     this.$notify(
    //       notifyInfo({
    //         msg: this.$t('spot.contractLot.msg.domesticInvoiceApplyAdd')
    //       })
    //     )
    //     return
    //   }
    //   this.openPageWithCustomerCode('domesticInvoiceApplyAdd')
    // },
    openPageMakeProvisionalAdd() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow !== null && currentRow.tradeType === '3') {
        this.$notify(
          notifyInfo({
            msg: this.$t('spot.contractLot.msg.makeProvisionalAdd')
          })
        )
        return
      }
      this.openPageWithCustomerCode('makeProvisionalAdd')
    }
    // openPageMakeFinalAdd() {
    //   const currentRow = this.$refs.qmTable.currentRow
    //   if (currentRow !== null && currentRow.tradeType === '3') {
    //     this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.makeFinalAdd') }))
    //     return
    //   }
    //   this.openPageWithCustomerCode('makeFinalAdd')
    // }
  }
}
</script>
