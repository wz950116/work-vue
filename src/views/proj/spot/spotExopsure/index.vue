<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>
    <compensateEdit v-if="dialogVisible" @closeHandler="closeHandler" :documentNo="documentNo" :type="type"></compensateEdit>
    <importDialog v-if="imoprtDialogVisible" @close="importDialogClose"></importDialog>
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import compensateEdit from '@/views/proj/spot/spotExopsure/compensateEdit'
import importDialog from '@/views/proj/spot/spotExopsure/components/importDialog'

export default {
  name: 'spotExposure',
  components: {
    compensateEdit,
    importDialog
  },
  data() {
    return {
      dialogVisible: false,
      imoprtDialogVisible: false,
      documentNo: '',
      type: '',
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            organCode: '',
            deptCode: '',
            purchaseSaleType: ''
          },
          defaultSortString: 'tradeDate.desc'
        },
        formData: [
          {
            width: 120,
            label: 'spotProj.exposure.list.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              clearable: true
            }
          },
          {
            width: 100,
            label: 'spotProj.exposure.list.exposureType',
            prop: 'exposureType',
            element: 'base-select',
            list: this.$t('datadict.exposureType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spotProj.exposure.form.direction',
            prop: 'direction',
            element: 'base-select',
            list: this.$t('datadict.spotDirection'),
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'spotProj.exposure.list.contractNo',
            prop: 'contractNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spotProj.exposure.list.priceItemCode',
            prop: 'priceItemCode',
            element: 'base-select',
            width: 120,
            attrs: {
              data: 'DD_PRICE_ITEM',
              params: {
                priceItemType: '1'
              },
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'spotProj.exposure.form.tradeDate',
            prop: 'tradeDate',
            attrs: {
              clearable: true,
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'spotProj.exposure.form.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              data: 'TREE_ORGAN',
              clearable: true
            }
          },
          {
            label: 'spotProj.exposure.form.deptCode',
            prop: 'deptCode',
            element: 'base-select',
            event: {
              evn: this.handleNode,
              changeAll: this.changeHandle
            },
            attrs: {
              data: 'TREE_ORG_DEPT',
              clearable: true,
              defaultExpandAll: true
            }
          },
          {
            width: 120,
            label: 'spotProj.exposure.list.documentNo',
            prop: 'documentNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'spotProj.exposure.form.bizEmployeeCode',
            prop: 'bizEmployeeCode',
            element: 'base-select',
            attrs: {
              data: 'FUNC_EMPLOYEE',
              clearable: true
            }
          },
          {
            label: 'spotProj.exposure.list.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            width: 100,
            attrs: {
              data: 'DD_WAREHOUSE',
              clearable: true
            }
          },
          ...this.$store.state.user.mainGoodCols,
          ...this.$store.state.user.reserveGoodCols
        ]
      },

      mainData: {
        initSearch: true,
        api: {
          search: '/api/spot/strgExposure/list'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'spotExposureAdd',
                params: {
                  type: 'add'
                }
              }
            }
          },
          {
            name: 'import',
            $refs: this.$refs,
            i18n: 'biz.btn.import',
            iconName: '线性-导入',
            event: this.import
          },
          {
            name: 'update',
            type: 'route',
            $refs: this.$refs,
            event: this.update
          },
          {
            name: 'remove',
            $refs: this.$refs,
            event: this.remove
          },
          {
            name: 'view',
            type: 'route',
            $refs: this.$refs,
            event: this.view
          },
          {
            name: 'caculate',
            iconName: '线性-修改',
            $refs: this.$refs,
            i18n: 'biz.btn.caculate',
            event: this.caculate
          },
          {
            name: 'copy',
            i18n: '复制',
            type: 'route',
            permitName: ['copy'],
            iconName: '线性-复制',
            $refs: this.$refs,
            event: this.copy
          },
          {
            name: 'confirm',
            iconName: '线性-确认',
            $refs: this.$refs,
            i18n: 'biz.btn.confirmCheck',
            event: this.confirm
          },
          {
            name: 'cancelConfirm',
            iconName: '线性-返回',
            $refs: this.$refs,
            i18n: 'biz.btn.cancelConfirm',
            event: this.cancelConfirm
          },
          {
            name: 'compensate',
            iconName: '线性-红冲',
            $refs: this.$refs,
            i18n: 'biz.btn.compensate',
            event: this.compensate
          },
          {
            name: 'compensateRecord',
            iconName: '线性-红冲记录',
            $refs: this.$refs,
            i18n: 'biz.btn.compensateRecord',
            event: this.compensateRecord
          },
          {
            name: 'export',
            $refs: this.$refs
          },
          {
            name: 'refresh',
            permitName: ['query'],
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: 'spotExopsure',
          showCheckbox: true,
          cols: [
            {
              prop: 'confirmStat',
              label: 'spotProj.exposure.list.confirmStat',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.confirmStat')
              }
            },
            {
              prop: 'compStatus',
              label: 'spotProj.exposure.list.compStatus',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'tradeDate',
              label: 'spotProj.exposure.list.tradeDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'exposureType',
              label: 'spotProj.exposure.list.exposureType',
              format: {
                dict: this.$t('datadict.exposureType')
              },
              align: 'center',
              width: '80'
            },
            {
              prop: 'contractNo',
              width: '120',
              label: 'spotProj.exposure.list.contractNo'
            },
            {
              prop: 'documentNo',
              width: '120',
              label: 'spotProj.exposure.list.documentNo'
            },
            {
              prop: 'direction',
              align: 'center',
              width: '80',
              label: 'spotProj.exposure.list.direction',
              format: {
                dict: this.$t('datadict.spotDirection')
              }
            },
            {
              prop: 'organName',
              width: '100',
              label: 'spotProj.exposure.list.organName'
            },
            {
              prop: 'deptName',
              width: '100',
              label: 'spotProj.exposure.list.deptName'
            },
            {
              prop: 'customerName',
              width: '100',
              label: 'spotProj.exposure.list.customerName'
            },
            {
              prop: 'productName',
              width: '100',
              label: 'spotProj.exposure.list.productName'
            },
            {
              prop: 'warehouseName',
              width: '100',
              label: 'spotProj.exposure.list.warehouseCode'
            },
            {
              prop: 'documentQuantity',
              align: 'right',
              width: '100',
              label: 'spotProj.exposure.list.documentQuantity',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'rawQuantity',
              align: 'right',
              width: '100',
              label: 'spotProj.exposure.list.rawQuantity',
              format: {
                dict: 'thousandth',
                func: 'quantityFilter'
              }
            },
            {
              prop: 'pricieType',
              align: 'center',
              width: '100',
              label: 'spotProj.exposure.list.priceType',
              format: {
                dict: this.$t('datadict.priceType')
              }
            },
            {
              prop: 'startDate',
              label: 'spotProj.exposure.list.startDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'endDate',
              label: 'spotProj.exposure.list.endDate',
              align: 'center',
              width: '100',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              }
            },
            {
              prop: 'price',
              align: 'right',
              width: '100',
              label: 'spotProj.exposure.list.price',
              format: {
                dict: 'thousandth',
                func: 'priceFilter'
              }
            },
            {
              prop: 'currencyName',
              width: '100',
              label: 'spotProj.exposure.list.currencyName'
            },
            {
              prop: 'virtualFlag',
              label: 'spotProj.exposure.list.virtualFlag',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'preliminaryFlag',
              label: 'spotProj.exposure.list.proliminaryFlag',
              align: 'center',
              width: '80',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            ...(this.$store.state.user.mainGoodCols),
            {
              prop: 'bizEmployeeName',
              label: 'spotProj.exposure.form.bizEmployeeCode',
              align: 'center',
              width: '120'
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
    copy() {
      var currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }
      this.$router.push({
        name: 'spotExposureAdd',
        params: {
          type: 'copy',
          id: currentRow[0].documentNo
        }
      })
    },
    update() {
      const currentRows = this.$refs.qmTable.currentRow
      if (!currentRows) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRows.length !== 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
        return
      }

      const currentRow = currentRows[0]
      if (currentRow.confirmStat === '1') {
        this.$notify(
          notifyInfo({
            msg: this.$t('spotProj.exposure.msg.confirmUpdate')
          })
        )
        return
      }

      this.$router.push({
        name: 'spotExopsureEdit',
        params: {
          type: 'update',
          id: currentRow.documentNo
        }
      })
    },
    remove() {
      const currentRows = this.$refs.qmTable.currentRow
      if (!currentRows) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRows.length !== 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
        return
      }

      const currentRow = currentRows[0]

      this.$confirm(this.$t('biz.msg.confirmDelete'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/spot/strgExposure/remove',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.remove'),
            data: currentRow.documentNo
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('biz.msg.deleteSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    },
    view() {
      const currentRows = this.$refs.qmTable.currentRow
      if (!currentRows) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRows.length !== 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
        return
      }

      const currentRow = currentRows[0]
      this.$router.push({
        name: 'spotExposureView',
        params: {
          type: 'view',
          id: currentRow.documentNo
        }
      })
    },
    caculate() {
      const currentRows = this.$refs.qmTable.currentRow
      if (!currentRows) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRows.length !== 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
        return
      }

      const currentRow = currentRows[0]
      this.$confirm(this.$t('spotProj.exposure.msg.caculate'), this.$t('biz.msg.tip'), {
        type: 'info',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/spot/strgExposure/caculate',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save'),
            data: currentRow.documentNo
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('spotProj.exposure.msg.caculateSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    },
    confirm() {
      const currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      var documentNos = []
      for (var i = 0; i < currentRow.length; i++) {
        if (currentRow[i].confirmStat === '1') {
          this.$notify(
            notifyInfo({
              msg: this.$t('spotProj.exposure.msg.isConfirm')
            })
          )
          return
        }
        documentNos.push(currentRow[i].documentNo)
      }

      this.$confirm(this.$t('spotProj.exposure.msg.confirm'), this.$t('biz.msg.tip'), {
        type: 'info',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/spot/strgExposure/confirm',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save'),
            data: documentNos
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('spotProj.exposure.msg.confirmSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    },
    cancelConfirm() {
      const currentRow = this.$refs.qmTable.currentRow
      if (!currentRow) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      var documentNos = []
      for (var i = 0; i < currentRow.length; i++) {
        if (currentRow[i].confirmStat === '0') {
          this.$notify(
            notifyInfo({
              msg: this.$t('spotProj.exposure.msg.noConfirm')
            })
          )
          return
        }
        documentNos.push(currentRow[i].documentNo)
      }

      this.$confirm(this.$t('spotProj.exposure.msg.cancelConfirm'), this.$t('biz.msg.tip'), {
        type: 'info',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/spot/strgExposure/cancelConfirm',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save'),
            data: documentNos
          }
        }).then(request => {
          this.$notify(
            notifySuccess({
              msg: this.$t('spotProj.exposure.msg.cancelConfirmSuccess')
            })
          )
          this.$refs.qmTable.getList()
        })
      })
    },
    compensate() {
      const currentRows = this.$refs.qmTable.currentRow
      if (!currentRows) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRows.length !== 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
        return
      }

      const currentRow = currentRows[0]

      this.type = 'add'
      this.documentNo = currentRow.documentNo
      this.dialogVisible = true
    },
    closeHandler() {
      this.dialogVisible = false
      this.$refs.qmTable.getList()
    },
    compensateRecord() {
      const currentRows = this.$refs.qmTable.currentRow
      if (!currentRows) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noRowSelected')
          })
        )
        return
      }

      if (currentRows.length !== 1) {
        this.$notify(
          notifyInfo({
            msg: this.$t('biz.msg.noFirstRowSelected')
          })
        )
        return
      }

      const currentRow = currentRows[0]
      if (currentRow.confirmStat !== '1') {
        this.$notify(
          notifyInfo({
            msg: this.$t('spotProj.exposure.msg.noConfirm')
          })
        )
        return
      }

      this.type = 'view'
      this.documentNo = currentRow.documentNo
      this.dialogVisible = true
    },
    import() {
      this.imoprtDialogVisible = true
    },
    importDialogClose() {
      this.imoprtDialogVisible = false
      this.$refs.qmTable.getList()
    }
  }
}
</script>
