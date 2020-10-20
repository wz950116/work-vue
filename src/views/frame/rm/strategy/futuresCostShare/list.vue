<template>
  <div class="app-container calendar-list.-container">
    <qm-form ref="qmForm" :form="form"></qm-form>
    <template v-if="$route.name === $options.name">
      <qm-table ref="qmTable" :mainData="mainData"></qm-table>
    </template>

    <futureMatchType v-if="typeDialogVisible" @close="dialogClose" @selectType="selectNature"></futureMatchType>
  </div>
</template>

<script>
// 提醒
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import futureMatchType from '@/views/frame/rm/strategy/futuresMatch/components/futureMatchType'

export default {
  name: 'futuresCostShare',
  components: {
    futureMatchType
  },
  data() {
    return {
      typeDialogVisible: false,
      addType: '',
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {},
          defaultSortString: 'parentName.desc,costType.asc,costDirection.asc,costNature.asc,futuresContractCode.asc'
        },
        formData: [
          {
            width: 120,
            label: 'strategy.futuresCostShare.form.parentName',
            prop: 'parentName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            width: 120,
            label: 'strategy.futuresCostShare.form.matchCode',
            prop: 'matchCode',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          }
        ]
      },
      mainData: {
        initSearch: true,
        api: {
          search: '/api/strategyReport/futureCostShare/list'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'caculate',
            iconName: '线性-修改',
            $refs: this.$refs,
            i18n: 'biz.btn.caculate',
            event: this.caculate
          },
          {
            name: 'refresh',
            $refs: this.$refs
          }
        ],
        isColset: true,
        table: {
          id: 'spotTrade',
          cols: [
            {
              prop: 'parentName',
              width: '150',
              label: 'strategy.futuresCostShare.list.parentName'
            },
            {
              prop: 'matchCode',
              width: '150',
              label: 'strategy.futuresCostShare.list.matchCode'
            },
            {
              prop: 'derivativeAccount',
              width: '150',
              label: 'strategy.futuresCostShare.list.derivativeAccount'
            },
            {
              prop: 'futuresContractCode',
              width: '150',
              label: 'strategy.futuresCostShare.list.futuresContractCode'
            },
            {
              prop: 'costType',
              width: '100',
              align: 'center',
              label: 'strategy.futuresCostShare.list.costType',
              format: {
                dict: this.$t('datadict.futureCostType')
              }
            },
            {
              prop: 'costDirection',
              width: '100',
              align: 'center',
              label: 'strategy.futuresCostShare.list.costDirection',
              format: {
                dict: this.$t('datadict.costDirection')
              }
            },
            {
              prop: 'shareAmount',
              width: '120',
              align: 'right',
              label: 'strategy.futuresCostShare.list.shareAmount',
              format: {
                dict: 'thousandth',
                func: 'moneyFilter'
              }
            },
            {
              prop: 'currencyName',
              width: '120',
              label: 'strategy.futuresCostShare.list.currencyName'
            },
            {
              prop: 'direction',
              width: '100',
              align: 'center',
              label: 'strategy.futuresCostShare.list.direction',
              format: {
                dict: this.$t('datadict.futuresDirection')
              }
            },
            {
              prop: 'offsetFlag',
              width: '100',
              align: 'center',
              label: 'strategy.futuresCostShare.list.offsetFlag',
              format: {
                dict: this.$t('datadict.offset')
              }
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
    caculate() {
      this.$confirm(this.$t('strategy.futuresCostShare.caculate'), this.$t('biz.msg.tip'), {
        type: 'info',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strategyReport/futureCostShare/save',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
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
    }
  }
}
</script>
