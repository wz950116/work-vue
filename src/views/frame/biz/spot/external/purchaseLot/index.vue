<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table-array ref="qmTable" :mainData="mainData">
        <template slot='contractNo' slot-scope='scope'>
          <router-link :to="{name: 'extPurchaseContractView', params: {type: 'view',back: 'extPurchaseLot','contractNo':scope.row.contractNo }}">{{
            scope.row.contractNo }}</router-link>
        </template>
      </qm-table-array>
    </template>
  </div>
</template>

<script>
import { notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import QmSelectPrompt from '@/components/frame/qm/qmSelectPrompt/index.js'
export default {
  name: 'extPurchaseLot',
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
            supplierCode: '',
            auditStatus: '',
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
            label: 'spot.contractLot.form.lotNo',
            prop: 'lotNo',
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
          submit: '/api/bpm/processInstance/startApproveProcessByModuleCode',
          search: '/api/contract/plInfo/list',
          export: '/api/contract/plInfo/export',
          doDelete: '/api/contract/plInfo/remove'
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
                name: 'extPurchaseLotAdd',
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
                name: 'extPurchaseLotCopy',
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
                name: 'extPurchaseLotUpdate',
                params: {
                  type: 'update',
                  lotNo: currentRow.lotNo,
                  back: this.$refs.qmForm.$route.name
                }
              }
            },
            validateApi(row) {
              return {
                url: '/api/contract/plInfo/validatedApi',
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
                url: '/api/contract/plInfo/validatedApi',
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
                name: 'extPurchaseLotView',
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
                permitName: ['ladingBill'],
                i18n: 'spot.contractLot.btn.ladingBillAdd',
                event: this.openPageLadingBillAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['inNotice'],
                i18n: 'spot.contractLot.btn.inNoticeAdd',
                event: this.openPageInNoticeAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['fundApply'],
                i18n: 'spot.contractLot.btn.fundApplyAdd',
                event: this.openPageFundApplyAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['domesticInvoiceClaim'],
                i18n: 'spot.contractLot.btn.domesticInvoiceClaimAdd',
                event: this.openPageDomesticInvoiceClaimAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['receiveProvisional'],
                i18n: 'spot.contractLot.btn.receiveProvisionalAdd',
                event: this.openPageReceiveProvisionalAdd
              },
              {
                msg: this.$t('spot.contractLot.msg.noApproved'),
                name: 'next',
                permitName: ['receiveFinal'],
                i18n: 'spot.contractLot.btn.receiveFinalAdd',
                event: this.openPageReceiveFinalAdd
              }
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
              isSlot: true,
              prop: 'contractNo'
            },
            {
              label: 'spot.contractLot.form.tradeType',
              width: '90',
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
            // 提单数量
            {
              label: 'spot.contractLot.form.ladingQuantity',
              width: '120',
              prop: 'ladingQuantity',
              align: 'right',
              format: {
                func: 'weight'
              }
            },
            // 入库数量
            {
              label: 'spot.contractLot.form.inQuantity',
              width: '120',
              prop: 'inQuantity',
              align: 'right',
              format: {
                func: 'weight'
              }
            },
            // 收票数量
            {
              label: 'spot.contractLot.form. invoiceQuantity',
              width: '120',
              prop: ' invoiceQuantity',
              align: 'right',
              format: {
                func: 'weight'
              }
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
          url: '/api/contract/plInfo/achive',
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
          url: '/api/contract/plInfo/goodFinish',
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
          url: '/api/contract/plInfo/fundFinish',
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
          url: '/api/contract/plInfo/invoFinish',
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
      this.openPage('extPurchaseLotHistory', {
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
        billType: 'CON_PL_INFO',
        billNo: currentRow.lotNo,
        pageType: 'external'
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
        url: '/api/contract/plInfo/checkChangeAble',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: currentRow.lotNo
        }
      }).then(response => {
        if (response.status) {
          this.openPage('extPurchaseLotChangeAdd', {
            type: 'add',
            lotNo: currentRow.lotNo,
            back: this.$refs.qmForm.$route.name
          })
        }
      })
    },
    openPageWithSupplierCode(page) {
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
          preBillNo: currentRow.lotNo,
          preBillType: 'CON_PL_INFO',
          back: 'extPurchaseLot',
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
            preBillNo: currentRow.lotNo,
            preBillType: 'CON_PL_INFO',
            back: 'extPurchaseLot',
            supplierCode: value
          })
        }
      })
    },
    openPageLadingBillAdd() {
      this.openPageWithSupplierCode('ladingBillAdd')
    },
    openPageInNoticeAdd() {
      this.openPageWithSupplierCode('inNoticeAdd')
    },
    openPageFundApplyAdd() {
      this.openPageWithSupplierCode('fundApplyAdd')
    },
    openPageDomesticInvoiceClaimAdd() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow !== null && currentRow.tradeType !== '3') {
        this.$notify(
          notifyInfo({
            msg: this.$t('spot.contractLot.msg.domesticInvoiceClaimAdd')
          })
        )
        return
      }
      this.openPageWithSupplierCode('domesticInvoiceClaimAdd')
    },
    openPageReceiveProvisionalAdd() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow !== null && currentRow.tradeType === '3') {
        this.$notify(
          notifyInfo({
            msg: this.$t('spot.contractLot.msg.receiveProvisionalAdd')
          })
        )
        return
      }
      this.openPageWithSupplierCode('receiveProvisionalAdd')
    },
    openPageReceiveFinalAdd() {
      const currentRow = this.$refs.qmTable.currentRow
      if (currentRow !== null && currentRow.tradeType === '3') {
        this.$notify(notifyInfo({ msg: this.$t('spot.contractLot.msg.receiveFinalAdd') }))
        return
      }
      this.openPageWithSupplierCode('receiveFinalAdd')
    }
  }
}
</script>
