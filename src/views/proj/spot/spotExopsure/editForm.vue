<template>
  <qm-edit ref='qmEdit' :edit='edit' @closeDialog='hanldeCloseDialog' @initCallback='handleInitCallback'></qm-edit>
</template>
<script>
import request from '@/utils/frame/base/request'
import { dateFormate } from '@/utils/frame/base/index'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      edit: {
        type: this.$route.params.type,
        mode: this.opMode,
        param: this.$route.params,
        api: {
          view: '/api/spot/strgExposure/get',
          save: '/api/spot/strgExposure/save',
          update: '/api/spot/strgExposure/update'
        },
        apiData: {
          view(param) {
            return param.id
          }
        },
        topButtons: [
          {
            iconName: '线性-返回',
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
            isShow: ['add', 'update', 'copy']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            isShow: ['add', 'update', 'copy'],
            extraEvent: this.checkSave,
            attrs: {
              type: 'primary'
            }
          },
          {
            iconName: '线性-附件',
            name: 'biz.btn.uploadAttachment',
            $route: this.$route,
            getParam(data) {
              return {
                billNo: data.id,
                billType: 'SPOT_EXPOSURE'
              }
            },
            event: 'attachment',
            isShow: ['update', 'view', 'assist', 'audit', 'copy']
          }
        ],
        // 若只存在一个主信息则formData的值可接受Array
        formData: {
          part1: {
            titleName: 'spotProj.exposure.form.mainData',
            content: [
              {
                label: 'func.employee.organId',
                prop: 'organCode',
                element: 'base-select',
                attrs: {
                  data: 'TREE_ORGAN',
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              {
                label: 'spotProj.exposure.form.deptCode',
                prop: 'deptCode',
                element: 'base-select',
                attrs: {
                  data: 'TREE_DEPT',
                  clearable: true
                },
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ]
              },
              {
                label: 'spotProj.exposure.form.customerCode',
                prop: 'customerCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'CUST_INFO',
                  clearable: true,
                  params: {
                    typeCode: '12',
                    usingFlag: '1',
                    auditStatus: '3'
                  }
                }
              },
              {
                type: 'date',
                label: 'spotProj.exposure.form.tradeDate',
                prop: 'tradeDate',
                event: this.currencyChange,
                validate: [
                  {
                    required: true,
                    trigger: 'blur'
                  }
                ],
                attrs: {
                  clearable: true,
                  format: 'yyyy-MM-dd',
                  'value-format': 'yyyyMMdd'
                }
              },
              {
                label: 'spotProj.exposure.form.currencyCode',
                prop: 'currencyCode',
                element: 'base-select',
                event: {
                  evn: this.currencyChange
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'CURRENCY',
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
                },
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ]
              },
              {
                label: 'spotProj.exposure.form.priceType',
                prop: 'pricieType',
                element: 'base-select',
                list: this.$t('datadict.priceType'),
                event: this.pricieTypeChange,
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
                label: 'spotProj.exposure.form.virtualFlag',
                prop: 'virtualFlag',
                element: 'base-select',
                list: this.$t('datadict.yesNo'),
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
                label: 'spotProj.exposure.form.proliminaryFlag',
                prop: 'preliminaryFlag',
                element: 'base-select',
                list: this.$t('datadict.yesNo'),
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
                label: 'spotProj.exposure.form.bizEmployeeCode',
                prop: 'bizEmployeeCode',
                element: 'base-select',
                validate: [
                  {
                    required: true,
                    trigger: 'change'
                  }
                ],
                attrs: {
                  data: 'FUNC_EMPLOYEE',
                  clearable: true
                }
              }
            ]
          }
        },
        tables: [
          {
            isShow: ['add', 'update', 'view', 'copy'],
            name: 'detailList',
            label: 'spotProj.exposure.form.tab',
            component: () => import('./components/detailTab.vue'),
            required: true
          },
          {
            isShow: false,
            name: 'monthDetail',
            label: 'spotProj.exposure.tab.monthDetail',
            component: () => import('./components/monthTab.vue')
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
      type: [Object, String],
      default() {
        return null
      }
    }
  },
  computed: {
    ...mapGetters(['userOrganCode', 'userDeptCode', 'userEmployeeCode'])
  },
  async mounted() {
    if (this.type !== 'add') {
      this.setValidate()
    }
    if (this.$route.params.type === 'add') {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.tradeDate = dateFormate(new Date(), 'yyyyMMdd')
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.organCode = this.userOrganCode
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.deptCode = this.userDeptCode
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.bizEmployeeCode = this.userEmployeeCode
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currencyCode = await this.$store.dispatch('getCurrencyCode', {
        funcModule: this.$t('route.' + this.$route.meta.title),
        name: '人民币'
      })
    }
  },
  methods: {
    handleInitCallback(data) {
      if (this.$route.params.type === 'view' && data.pricieType === '2') {
        this.edit.tables[1].isShow = true
        setTimeout(() => {
          this.$refs.qmEdit.$refs.qmRouteEdit.$refs.monthDetail[0].$refs.tab.tableData = data.exposureDetailDtos
        }, 100)
      }
    },
    async checkSave() {
      if (this.$refs.qmEdit.edit.type === 'copy') {
        this.$refs.qmEdit.edit.type = 'add'
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.id = ''
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.detailList.forEach(element => {
          element.id = ''
        })
      }
      return true
    },
    setValidate() {
      setTimeout(() => {
        const prineType = this.$refs.qmEdit.$refs.qmRouteEdit.editForm.pricieType
        if (prineType) {
          this.pricieTypeChange(prineType)
          this.currencyChange(this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currencyCode, false)
        } else {
          this.setValidate()
        }
      }, 500)
    },
    hanldeCloseDialog(param) {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'spotExposure'
        })
      })
    },
    changeHandle(obj) {
      this.$refs.qmEdit.$refs.qmRouteEdit.editForm.organCode = obj.orgCode
    },
    handleNode(node) {
      if (node) {
        this.$refs.qmEdit.$refs.qmRouteEdit.editForm.organCode = node.orgCode
      }
    },
    pricieTypeChange(val) {
      this.$refs.qmEdit.$refs.qmRouteEdit.$refs.detailList[0].changePriceType(val)
    },
    currencyChange(val) {
      if (!this.$refs.qmEdit.$refs.qmRouteEdit.editForm.tradeDate) {
        return
      }
      if (!this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currencyCode) {
        return
      }
      request({
        url: '/api/spot/strgExposure/getInterestRate',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            currencyCode: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.currencyCode,
            exchangeRateDate: this.$refs.qmEdit.$refs.qmRouteEdit.editForm.tradeDate
          }
        }
      }).then(res => {
        if (res.data) {
          this.$refs.qmEdit.$refs.qmRouteEdit.$refs.detailList[0].changeCurrency(res.data.exchangeRate)
        } else {
          this.$refs.qmEdit.$refs.qmRouteEdit.$refs.detailList[0].changeCurrency(null)
        }
      })
    }
  }
}
</script>
