<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  name: 'chartSetEdit',
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        titleName: this.$t('biz.btn.chartSet'),
        api: {
          view: '/api/warn/chart/get',
          save: '/api/warn/chart/save',
          update: '/api/warn/chart/save'
        },
        apiData: {
          view(param) {
            return param.warningCode
          }
        },
        formData: [
          {
            label: 'data.warnSet.chartStyle',
            prop: 'chartStyle',
            element: 'base-select',
            list: this.$t('datadict.chartStyle'),
            attrs: {
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
            label: 'data.warnSet.xAxis',
            prop: 'xAxis',
            element: 'base-select',
            list: this.$t('datadict.chartXAxis'),
            attrs: {
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
            label: 'data.warnSet.yAxis',
            prop: 'yAxis',
            element: 'base-select',
            list: [],
            attrs: {
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
            label: 'data.warnSet.legend',
            prop: 'legend',
            element: 'base-select',
            list: [],
            attrs: {
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
            label: 'data.warnSet.thresholdArray',
            prop: 'thresholdArray',
            element: 'base-select',
            list: [],
            default: [],
            attrs: {
              cols: 4,
              multiple: true,
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
            label: 'data.warnSet.chartOption',
            prop: 'chartOption',
            element: 'el-input',
            attrs: {
              placeholder: '例如：{"title":{"text":"堆叠区域图"}}',
              type: 'textarea',
              cols: 4,
              clearable: true
            }
          },
          {
            label: 'data.warnSet.seriesOption',
            prop: 'seriesOption',
            element: 'el-input',
            attrs: {
              placeholder: '例如：{"stack":"总量","areaStyle":{},"type":"line"}',
              type: 'textarea',
              cols: 4,
              clearable: true
            }
          },
          {
            prop: 'warningCode',
            default: this.param.warningCode,
            isShow: false
          },
          {
            prop: 'sourceCode',
            default: this.param.sourceCode,
            isShow: false
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view'],
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            event: 'save',
            showLoading: true,
            isShow: ['add', 'update'],
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.initSrcCol()
    this.initThreshold()
  },
  methods: {
    initThreshold() {
      request({
        url: '/api/warn/cond/listCondIdsByWarningIdGroupCode',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            warningCode: this.param.warningCode,
            groupCode: null
          }
        }
      }).then(response => {
        if (response.data) {
          const array = []
          response.data.forEach((s, index) => {
            array.push({
              value: s.thresholdKey,
              key: s.thresholdKey,
              label: s.thresholdKey
            })
          })
          this.dialog.formData[4].list = array
        }
      })
    },
    initSrcCol() {
      request({
        url: '/api/warn/cond/listSrcCol',
        method: 'post',
        data: {
          data: this.param.sourceCode,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          if (response.data) {
            const array = []
            response.data.forEach((s, index) => {
              array.push({
                value: s.colCode,
                key: s.colCode,
                label: s.colName
              })
            })
            this.dialog.formData[2].list = array
            this.dialog.formData[3].list = array
          }
        })
        .catch(() => {})
    },
    handleCloseDialog(param) {
      this.$emit('closeHandler', param)
    }
  }
}
</script>
