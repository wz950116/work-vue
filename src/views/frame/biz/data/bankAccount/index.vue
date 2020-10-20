<template>
  <div class="app-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <qm-table ref="qmTable" :mainData="mainData"></qm-table>
  </div>
</template>

<script>
import excelUtil from '@/utils/frame/base/excelUtil.js'
export default {
  name: 'bankAccount',
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
            organCode: '',
            bankCode: '',
            bankAccountName: '',
            usingFlag: '',
            bankAccountNo: '',
            bankAccountType: ''
          },
          defaultSortString: 'organName.asc,bankName.asc,bankAccountName.asc'
        },
        formData: [
          {
            label: 'data.bankAccount.form.organCode',
            prop: 'organCode',
            element: 'base-select',
            attrs: {
              clearable: true,
              data: 'TREE_ORGAN',
              clickParent: true
            }
          },
          {
            label: 'data.bankAccount.form.bankCode',
            prop: 'bankCode',
            element: 'base-select',
            attrs: {
              clearable: true,
              data: 'DD_BANK'
            }
          },
          {
            label: 'data.bankAccount.form.bankAccountName',
            prop: 'bankAccountName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bankAccount.form.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bankAccount.form.bankAccountNo',
            prop: 'bankAccountNo',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.bankAccount.form.bankAccountType',
            prop: 'bankAccountType',
            element: 'base-select',
            list: this.$t('datadict.bankAccountType'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/dd/organ/bank/account/list',
          doDelete: '/api/dd/organ/bank/account/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('@/views/frame/biz/data/bankAccount/editForm.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/bankAccount/editForm.vue')
          },
          {
            name: 'remove',
            getParam(currentRow) {
              return currentRow.bankAccountCode
            }
          },
          {
            name: 'view',
            type: 'dialog',
            getParam(currentRow) {
              return currentRow
            },
            component: () => import('@/views/frame/biz/data/bankAccount/editForm.vue')
          },
          {
            name: 'export'
          },
          {
            name: 'refresh'
          },
          {
            iconName: '线性-附件',
            i18n: 'biz.btn.downloadTemplate',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.downloadTemplate(this, '银行账户') // 现货物资：模板文件的sheet名
          },
          {
            iconName: '线性-导入',
            i18n: 'biz.btn.import',
            permitName: ['import'],
            $refs: this.$refs,
            event: excelUtil.uploadExcel(this, '银行账户', '/api/dd/organ/bank/account/uploadExcel')
          }
        ],
        isColset: true,
        table: {
          id: '',
          cols: [
            {
              prop: 'organName',
              width: '200',
              label: 'data.bankAccount.list.organName'
            },
            {
              prop: 'bankName',
              width: '160',
              label: 'data.bankAccount.list.bankName'
            },
            {
              prop: 'bankAccountNo',
              width: '160',
              label: 'data.bankAccount.list.bankAccountNo'
            },
            {
              prop: 'bankAccountName',
              width: '160',
              label: 'data.bankAccount.list.bankAccountName'
            },
            {
              prop: 'bankAccountType',
              width: '120',
              align: 'center',
              format: {
                dict: this.$t('datadict.bankAccountType')
              },
              label: 'data.bankAccount.list.bankAccountType'
            },
            {
              prop: 'usingFlag',
              width: '100',
              align: 'center',
              format: {
                dict: this.$t('datadict.usingFlag')
              },
              label: 'data.bankAccount.list.usingFlag'
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
  }
}
</script>
