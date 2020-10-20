<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- table必须包上v-if清除缓存 防止切换tab速度过慢 -->
    <qm-table ref='qmTable' :mainData='mainData'>
      <template slot='triggerTime' slot-scope='scope'>
        <span>{{scope.row.triggerTime | timeFormatter(scope.row.triggerType, $t('biz.lbl'))}}</span>
      </template>
    </qm-table>
  </div>
</template>

<script>
export default {
  name: 'warning',
  data() {
    return {
      form: {
        listQuery: {
          current: 1,
          size: 20,
          isPage: true,
          defaultSortString: 'createDate.desc',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {}
        },

        formData: [
          {
            label: 'data.warning.warningName',
            prop: 'warningName',
            element: 'input-validate',
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.warning.triggerType',
            prop: 'triggerType',
            element: 'base-select',
            list: this.$t('datadict.triggerType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'data.warning.warningType',
            prop: 'warningType',
            element: 'base-select',
            list: this.$t('datadict.warningType'),
            attrs: {
              clearable: true
            }
          },
          {
            label: 'biz.lbl.usingFlag',
            prop: 'usingFlag',
            element: 'base-select',
            list: this.$t('datadict.usingFlag'),
            attrs: {
              clearable: true
            }
          }
        ]
      },

      mainData: {
        api: {
          search: '/api/warn/warning/list',
          doDelete: '/api/warn/warning/remove'
        },
        isTopBar: true,
        topBar: [
          {
            name: 'add',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'view',
            allowDblClick: true,
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'update',
            type: 'dialog',
            component: () => import('./edit.vue')
          },
          {
            name: 'remove',
            getParam: currentRow => {
              return currentRow.warningCode
            }
          },
          {
            type: 'dialog',
            name: 'update',
            iconName: '线性-设置',
            permitName: ['relationMsg'],
            i18n: 'biz.btn.relationMsg',
            component: () => import('@/views/frame/base/msg/func/dialog/funcSelect.vue'),
            getParam: currentRow => {
              return currentRow.warningCode
            }
          },
          {
            name: 'view',
            i18n: 'biz.btn.detailSet',
            type: 'route',
            routeInfo: currentRow => {
              return {
                name: 'warningDetail',
                params: {
                  back: 'warning',
                  code: currentRow.warningCode,
                  warningType: currentRow.warningType,
                  sourceCode: currentRow.sourceCode
                }
              }
            }
          },
          {
            name: 'refresh'
          }
        ],
        isColset: true,
        table: {
          id: this.$route.meta.title,
          cols: [
            {
              prop: 'warningName',
              width: '200',
              label: 'data.warning.warningName'
            },
            {
              prop: 'warningCode',
              width: '100',
              label: 'data.warning.warningCode'
            },
            {
              prop: 'warningType',
              width: '100',
              align: 'center',
              label: 'data.warning.warningType',
              format: {
                dict: this.$t('datadict.warningType')
              }
            },
            {
              prop: 'sourceCode',
              width: '180',
              label: 'data.warning.sourceCode'
            },
            {
              prop: 'triggerType',
              width: '100',
              align: 'center',
              label: 'data.warning.triggerType',
              format: {
                dict: this.$t('datadict.triggerType')
              }
            },
            {
              prop: 'triggerTime',
              label: 'data.warning.triggerTime',
              width: '100',
              align: 'center',
              isSlot: true
            },
            {
              prop: 'msgFuncCode',
              label: 'msg.func.msgFuncCode',
              width: '120'
            },
            {
              prop: 'recordFlag',
              width: '100',
              align: 'center',
              label: 'data.warning.recordFlag',
              format: {
                dict: this.$t('datadict.yesNo')
              }
            },
            {
              prop: 'usingFlag',
              width: '80',
              align: 'center',
              label: 'biz.lbl.usingFlag',
              format: {
                dict: this.$t('datadict.usingFlag')
              }
            },
            {
              prop: 'remark',
              sortable: false,
              label: 'biz.lbl.remark',
              'min-width': '300',
              'show-overflow-tooltip': 'true'
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
  filters: {
    timeFormatter(value, triggerType, lbl) {
      if (triggerType === '1') {
        return value.substring(0, 2) + ':' + value.substring(2, 4) + ':' + value.substring(4, 6)
      } else if (triggerType === '2') {
        const hh = parseInt(value.substring(0, 2), 10)
        const mm = parseInt(value.substring(2, 4), 10)
        const ss = parseInt(value.substring(4, 6), 10)
        let retString = ''
        if (hh > 0) {
          retString = retString + hh + lbl.hour
        }
        if (mm > 0) {
          retString = retString + mm + lbl.minute
        }
        if (ss > 0) {
          retString = retString + ss + lbl.second
        }
        return retString
      }
      return value
    }
  }
}
</script>
