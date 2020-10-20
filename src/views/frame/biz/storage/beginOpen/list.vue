<template>
  <div class='app-container'>
    <qm-form ref='qmForm' :form='form'></qm-form>
    <template v-if="true||route.name === $options.name || ( $route.meta && $route.meta.componentName === $options.name)">
      <qm-table ref='qmTable' :mainData='mainData'></qm-table>
    </template>
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyInfo, confirmTip } from '@/utils/frame/base/notifyParams'
import excelUtil from '@/utils/frame/base/excelUtil.js'

export default {
  name: 'stockBeginOpen',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            warehouseCode: '',
            supplyerCode: '',
            deliverCode: '',
            productCode: '',
            currencyCode: '',
            beginDataFlag: '',
            inBillNo: '',
            inDateStart: '',
            inDateEnd: ''
          },
          defaultSortString: 'inDate.desc, inBillNo.desc'
        },
        formData: [
          {
            label: 'storage.beginOpen.form.inBillNo',
            prop: 'inBillNo',
            element: 'input-validate',
            attrs: {
              disabled: false,
              clearable: true
            }
          },
          {
            type: 'date',
            label: 'storage.beginOpen.form.inDate',
            props: ['inDateStart', 'inDateEnd'],
            default: ['', ''],
            attrs: {
              format: 'yyyy-MM-dd',
              'value-format': 'yyyyMMdd'
            }
          },
          {
            label: 'storage.beginOpen.form.warehouseCode',
            prop: 'warehouseCode',
            element: 'base-select',
            attrs: {
              data: 'DD_WAREHOUSE',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.beginOpen.form.supplierCode',
            prop: 'supplierCode',
            element: 'base-select',
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
          {
            label: 'storage.beginOpen.form.deliverCode',
            prop: 'deliverCode',
            element: 'base-select',
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
          {
            label: 'storage.beginOpen.form.productCode',
            prop: 'productCode',
            element: 'base-select',
            attrs: {
              data: 'DD_PRODUCT',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.beginOpen.form.currencyCode',
            prop: 'currencyCode',
            element: 'base-select',
            attrs: {
              data: 'CURRENCY',
              filterable: true,
              clearable: true
            }
          },
          {
            label: 'storage.beginOpen.form.beginDataFlag',
            prop: 'beginDataFlag',
            element: 'base-select',
            list: this.$t('datadict.yesNo'),
            attrs: {
              disabled: false,
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/warehouse/whBeginData/page',
          doDelete: '/api/warehouse/whBeginData/remove'
        },
        apiData: {
          search(param) {
            return param
          },
          doDelete(param) {
            return param
          }
        },
        initSearch: true,
        isTopBar: true,
        topBar: [
          // 新增
          {
            name: 'add',
            type: 'route',
            routeInfo() {
              return {
                name: 'stockBeginOpenAdd',
                params: {
                  type: 'add',
                  back: 'stockBeginOpen'
                }
              }
            }
          },
          // 修改
          {
            name: 'update',
            type: 'route',
            validateApi(row) {
              return {
                url: '/api/warehouse/whBeginData/validateApi',
                data: row.inBillNo
              }
            },
            routeInfo(currentRow) {
              return {
                name: 'stockBeginOpenUpdate',
                params: {
                  type: 'update',
                  id: currentRow.inBillNo,
                  back: 'storageBeginOpen'
                }
              }
            }
          },
          // 删除
          {
            name: 'remove',
            validateApi(row) {
              return {
                url: '/api/warehouse/whBeginData/validateApi',
                data: row.inBillNo
              }
            },
            getParam(param) {
              return param.inBillNo
            }
          },
          // 查看
          {
            name: 'view',
            type: 'route',
            routeInfo(currentRow) {
              return {
                name: 'stockBeginOpenView',
                params: {
                  type: 'view',
                  id: currentRow.inBillNo,
                  back: 'storageBeginOpen'
                }
              }
            }
          },
          // 导出
          {
            name: 'export'
          },
          // 刷新
          {
            name: 'refresh'
          },
          // 生成往来
          {
            name: 'genStockBeginInfo',
            iconName: '线性-生成',
            i18n: 'biz.btn.genStockBeginInfo',
            event: this.genBeginInfo
          },
          {
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.downloadTemplate(this, '库存')
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '库存', '/api/warehouse/whBeginData/uploadExcel')
          }
        ],

        isColset: true,
        table: {
          id: '',
          sortable: 'custom',
          cols: [
            {
              prop: 'beginDataFlag',
              width: '120',
              align: 'center',
              label: 'storage.beginOpen.list.beginDataFlag',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            // 单据号
            {
              label: 'storage.beginOpen.list.inBillNo',
              prop: 'inBillNo',
              width: 150
            },
            // 初始化日期
            {
              label: 'storage.beginOpen.list.inDate',
              prop: 'inDate',
              format: {
                dict: 'yyyy-MM-dd',
                func: 'dateFormat'
              },
              width: 100,
              align: 'center'
            },
            // 仓库
            {
              label: 'storage.beginOpen.list.warehouseName',
              prop: 'warehouseName',
              width: 120,
              sortable: 'custom'
            },
            // 供应商
            {
              label: 'storage.beginOpen.list.supplierName',
              prop: 'supplierName',
              width: 120
            },
            // 商品名称
            {
              label: 'storage.beginOpen.list.productName',
              prop: 'productName',
              width: 120
            },
            ...this.$store.state.user.mainGoodCols,
            ...this.$store.state.user.reserveGoodCols,
            // 库区
            {
              label: 'storage.beginOpen.list.stockArea',
              prop: 'stockArea',
              width: 120
            },
            // 库位
            {
              label: 'storage.beginOpen.list.stockPosition',
              prop: 'stockPosition',
              width: 120
            },
            // 仓储号
            {
              label: 'storage.beginOpen.list.stockNo',
              prop: 'stockNo',
              width: 120
            },
            // 币种
            {
              label: 'storage.beginOpen.list.currencyName',
              prop: 'currencyName',
              width: 120
            },
            // 税率
            {
              label: 'storage.beginOpen.list.exchangeRate',
              prop: 'exchangeRate',
              width: 120,
              align: 'right',
              format: {
                func: 'num'
              }
            },
            // 税率
            {
              label: 'storage.beginOpen.list.taxRate',
              prop: 'taxRate',
              width: 120,
              align: 'right',
              format: {
                func: 'num'
              }
            },
            // 定价价格(不含升贴水)
            {
              label: 'storage.beginOpen.list.pricePricing',
              prop: 'pricePricing',
              width: 120,
              align: 'right',
              format: {
                func: 'money'
              }
            },
            // 库存件数
            {
              label: 'storage.beginOpen.list.itemCount',
              prop: 'itemCount',
              width: 120,
              align: 'right',
              format: {
                func: 'money'
              }
            },
            // 库存数量
            {
              label: 'storage.beginOpen.list.quantity',
              prop: 'quantity',
              width: 120,
              align: 'right',
              format: {
                func: 'money'
              }
            },
            // 计量数量
            {
              label: 'storage.beginOpen.list.measurementQuantity',
              prop: 'measurementQuantity',
              width: 120,
              align: 'right',
              format: {
                func: 'money'
              }
            },
            // 商品单位编码
            {
              label: 'storage.beginOpen.list.productUnitCode',
              prop: 'productUnitCode',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            // 计量单位编码
            {
              label: 'storage.beginOpen.list.measurementUnitCode',
              prop: 'measurementUnitCode',
              width: 80,
              align: 'center',
              format: {
                dict: this.$t('datadict.measurementUnit')
              }
            },
            // 业务机构
            {
              prop: 'bizOrganName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizOrganName'
            },
            // 业务部门
            {
              prop: 'bizDeptName',
              width: 100,
              align: 'center',
              sortable: 'custom',
              label: 'biz.lbl.bizDeptName'
            },
            // 业务员
            {
              prop: 'bizEmployeeName',
              width: 100,
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.bizEmployeeName'
            },
            // 制单人
            {
              prop: 'optEmployeeName',
              width: 100,
              sortable: 'custom',
              align: 'center',
              label: 'biz.lbl.optName'
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
    genBeginInfo() {
      const row = this.$refs.qmTable.currentRow
      if (!row) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      confirmTip(this, 'confirmStockBeginOpen').then(() => {
        request({
          url: '/api/warehouse/whBeginData/genBeginInfo',
          method: 'POST',
          data: {
            data: row.inBillNo,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.genStockBeginInfo')
          }
        })
          .then(response => {
            this.$notify(notifySuccess({ msg: this.$t('biz.msg.operationSuccess') }))
            this.$refs.qmTable.getList()
          })
          .catch(() => {})
      })
    }
  }
}
</script>
