<template>
  <qm-dialog :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: {
        type: this.opType,
        param: this.param,
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/sys/stTblSysHomeItem/get',
          save: '/api/sys/stTblSysHomeItem/save',
          update: '/api/sys/stTblSysHomeItem/update'
        },
        apiData: {
          view(params) {
            return params.id
          },
          save(params) {
            return params.id
          },
          update(params) {
            return params.id
          }
        },
        formData: [
          {
            label: 'projSys.homeItem.itemId',
            prop: 'itemId',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'projSys.homeItem.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
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
            label: 'projSys.homeItem.itemName',
            prop: 'itemName',
            element: 'input-validate',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'projSys.homeItem.itemNameEn',
            prop: 'itemNameEn',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'projSys.homeItem.itemWidth',
            prop: 'titemWidthel',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'projSys.homeItem.itemHeight',
            prop: 'itemHeight',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'projSys.homeItem.rptUrl',
            prop: 'rptUrl',
            element: 'el-input',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          },
          {
            label: 'projSys.homeItem.rptRoute',
            prop: 'rptRoute',
            element: 'el-input',
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              clearable: true
            }
          }
        ],
        bottomButtons: [
          {
            iconName: '线性-返回',
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['view']
          },
          {
            iconName: '线性-取消',
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['add', 'update']
          },
          {
            name: 'biz.btn.save',
            iconName: '线性-保存',
            event: 'save',
            isShow: ['add', 'update']
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
  methods: {
    handleCloseDialog(params) {
      this.$emit('closeHandler', params)
    }
  }
}
</script>
