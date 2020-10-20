<template>
  <div class="app-container">
    <qm-form ref='qmForm' :form='form'></qm-form>
    <!-- <template v-if='$route.name === $options.name'> -->
    <qm-table ref='qmTable' :mainData='mainData' @initCallback='initCallback'>
      <template slot='isException' slot-scope='scope'>
        <el-tag size="mini" v-if="scope.row.isException === '1'" type="danger">{{$t('sys.log.fail')}}</el-tag>
        <el-tag size="mini" v-else type="success">{{$t('sys.log.success')}}</el-tag>
      </template>
    </qm-table>
    <!-- </template> -->
  </div>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  name: 'indexDemo',
  data() {
    return {
      summaryData: null,
      form: {
        listQuery: {
          isPage: false,
          current: 1,
          size: 20,
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            customerCode: '',
            multipleSelect: [],
            organCode: '',
            productCategoryCode: '',
            selectComponent: '',
            remark: '',
            date: '',
            createDateStart: '',
            createDateEnd: '',
            radio: '1',
            checkbox: [],
            dialogSelect: ''
          },
          sortString: 'productCode.asc'
        },

        moreShowFlg: true,

        formData: [{
          label: '客户名称',
          prop: 'customerCode',
          element: 'base-select',
          attrs: {
            data: 'CUST_INFO', // 统一基础档案组件，传值data区分
            clearable: true,
            params: {
              size: 5,
              typeCode: '4' // 不写:所有客户供应商经济商仓储公司， '1'只显示客户，'2'只显示供应商，
            },
            canChangeList: false, // 若远程查询则设为false
            labelShowCode: true,
            component: () => import ('@/views/example/indexDemo/dialog2.vue'),
            showMoreList: true
          },
          event: {
            change: this.onChange,
            evn: this.onEvn,
            changeAll: this.onChangeAll
          },
          list: []
        }, {
          label: '多选下拉',
          prop: 'multipleSelect',
          element: 'base-select',
          list: this.$t('datadict.usingFlag'),
          attrs: {
            clearable: true,
            multiple: true
          }
        }, {
          label: '树状下拉选',
          prop: 'organCode',
          element: 'base-select',
          attrs: {
            // 各种配置详情看ElTreeSelect公共组件
            data: 'TREE_ORGAN',
            clearable: true
          },
          event: {
            evn: this.change, // 获取当前选中值
            changeAll: this.changeAll // 获取当前选中对象
          }
        }, {
          label: '数字输入',
          prop: 'productCategoryCode',
          element: 'input-formatter',
          attrs: {
            min: 0,
            max: 999999999999.999,
            type: 'thousands',
            precision: 3
          }
        }, {
          label: '选择组件',
          prop: 'selectComponent',
          element: 'base-select',
          list: this.$t('datadict.usingFlag'),
          attrs: {
            clearable: true
          }
        }, {
          label: '文本输入',
          prop: 'remark',
          element: 'el-input',
          attrs: {
            clearable: true
          }
        }, {
          type: 'date',
          label: '日期输入',
          prop: 'date',
          attrs: {
            clearable: true,
            format: 'yyyy-MM-dd',
            'value-format': 'yyyyMMdd'
          }
        }, {
          type: 'date',
          label: '日期区间',
          props: ['createDateStart', 'createDateEnd'],
          attrs: {
            format: 'yyyy-MM-dd',
            'value-format': 'yyyyMMdd'
          },
          default: ['20190701', '20190801']
        }, {
          type: 'date',
          label: '第二个日期区间',
          props: ['createDateStartLv2', 'createDateEndLv2'],
          attrs: {
            pickStart: 'dateStartBeforeLv2',
            pickEnd: 'dateEndBeforeLv2',
            format: 'yyyy-MM-dd',
            'value-format': 'yyyyMMdd'
          }
        }, {
          type: 'radio',
          label: '单选框',
          prop: 'radio',
          list: [{
            label: '选项1',
            value: '1'
          }, {
            label: '选项2',
            value: '2'
          }],
          attrs: {
            disabled: true
          }
        }, {
          type: 'checkbox',
          label: '多选框',
          prop: 'checkbox',
          list: [{
            label: '选项1',
            value: '1'
          }, {
            label: '选项2',
            value: '2'
          }],
          attrs: {
            disabled: true
          }
        }, {
          label: '弹窗选择',
          prop: 'dialogSelect',
          element: 'base-dialog-select',
          component: () =>
            import ('@/views/example/indexDemo/productSelect.vue'),
          attrs: {
            data: '批次弹窗选择',
            clearable: true
          }
        }, {
          type: 'numberInterval',
          label: '数值区间',
          props: ['startValue', 'endValue'],
          attrs: {
            startMin: 0,
            startMax: 999999999999.99,
            endMin: 0,
            endMax: 999999999999.99,
            type: 'thousands',
            precision: 3
          }
        }]
      },

      mainData: {
        api: {
          search: '/api/dd/product/list',
          search2: 'xxxx',
          doDelete: '/api/dd/product/remove',
          cancelAudit: '/api/dd/product/cancelAudit'
        },

        isTopBar: true,
        topBar: [{
          name: 'add',
          type: 'dialog',
          component: () => import ('@/views/example/indexDemo/dialog.vue')
        }, {
          name: 'add',
          i18n: '路由GET新增',
          type: 'route',
          routeInfo() {
            return {
              name: 'editTagDemo',
              query: {
                type: 'update',
                id: '10086'
              }
            }
          }
        }, {
          name: 'add',
          i18n: '路由POST新增',
          type: 'route',
          routeInfo() {
            return {
              name: 'editTagDemo',
              params: {
                type: 'update',
                id: '200086'
              }
            }
          },
          validate: row => {
            // 针对多个条件设置
            return [{
              result: row.usingFlag === '0',
              msg: this.$t('当前状态不可删除该条数据')
            }]
          }
        }, {
          name: 'view',
          type: 'route',
          allowDblClick: true, // 是否可双击查看
          routeInfo(currentRow) {
            return {
              name: 'editTagDemo',
              params: {
                type: 'view'
              }
            }
          }
        }, {
          name: 'remove',
          getParam(row) {
            return row.id
          },
          validateApi(row) {
            return {
              url: '/check', // 接口
              data: row // 参数
            }
          },
          msg: this.$t('当前状态不可删除该条数据'),
          validate(row) {
            return row.usingFlag === '1'
          }
        }, {
          name: 'more',
          list: [{
            name: 'cancelAudit'
          }, {
            name: 'export'
          }, {
            name: 'refresh'
          }, {
            name: 'defined',
            permitName: ['add'], // 按钮权限标识
            iconName: '线性-查看',
            i18n: '自定义9527',
            event: this.onDefined
          }]
        }],

        initSearch: false,
        isColset: true,
        table: {
          id: 'loginId',
          sortable: 'custom',
          showSummary: false,
          defineSummaryFun: this.showSummary,
          showCheckbox: true,
          selectionFixed: true,
          cols: [{
            prop: 'productCategoryName',
            width: '220',
            label: '商品名称'
          }, {
            prop: 'productCategoryAbbr',
            width: '220',
            label: '商品简称',
            sortable: false,
            fixed: 'left'
          }, {
            prop: 'productCategoryCode',
            width: '220',
            label: '商品编码',
            sortable: true,
            sortProp: 'abc'
          }, {
            prop: 'attrGroupId',
            width: '220',
            label: '属性组'
          }, {
            prop: 'usingFlag',
            width: '220',
            align: 'center',
            label: '状态',
            format: {
              dict: this.$t('datadict.usingFlag')
            },
            summary: true
          }, {
            prop: 'remark',
            minWidth: '500',
            label: '备注'
          }, {
            prop: 'money',
            label: '金额显示',
            width: '220',
            format: {
              func: 'thousands',
              dict: 2
            }
          }, {
            prop: 'count',
            label: '数字显示',
            width: '220',
            format: {
              func: 'thousands',
              dict: 3
            }
          }, {
            prop: 'quantity',
            label: '整数显示',
            width: '220',
            format: {
              func: 'thousands',
              dict: 0
            }
          }, {
            prop: 'date',
            label: '日期显示',
            width: '220',
            format: {
              func: 'dateFormat',
              dict: 'YYYY-MM-DD'
            }
          }]
        },

        linkTable: {
          isShow: false,
          showCheckbox: true,
          cols: [{
            prop: 'productCategoryName',
            width: '220',
            label: '商品名称'
          }, {
            prop: 'productCategoryAbbr',
            width: '220',
            label: '商品简称',
            sortable: false
          }, {
            prop: 'productCategoryCode',
            width: '220',
            label: '商品编码',
            sortable: true
          }, {
            prop: 'attrGroupId',
            width: '220',
            label: '属性组'
          }, {
            prop: 'usingFlag',
            width: '220',
            align: 'center',
            label: '状态',
            format: {
              dict: this.$t('datadict.usingFlag')
            }
          }, {
            prop: 'remark',
            minWidth: '500',
            label: '备注'
          }, {
            prop: 'isException',
            label: 'table.status',
            isSlot: true,
            align: 'center'
          }, {
            prop: 'money',
            label: '金额显示',
            width: '220',
            format: {
              func: 'thousands',
              dict: 2
            }
          }, {
            prop: 'count',
            label: '数字显示',
            width: '220',
            format: {
              func: 'thousands',
              dict: 3
            }
          }, {
            prop: 'quantity',
            label: '整数显示',
            width: '220',
            format: {
              func: 'thousands',
              dict: 0
            }
          }, {
            prop: 'date',
            label: '日期显示',
            width: '220',
            format: {
              func: 'dateFormat',
              dict: 'YYYY-MM-DD'
            }
          }]
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
  async mounted() {
    if (1 === 2) {
      this.form.formData[0].list = [{
        code: '1',
        name: 'a'
      }, {
        code: '2',
        name: 'b'
      }, {
        code: '3',
        name: 'c'
      }, {
        code: '4',
        name: 'd'
      }, {
        code: '5',
        name: 'e'
      }, {
        code: '6',
        name: 'f'
      }, {
        code: '7',
        name: 'g'
      }]
    } else {
      // await request({
      //   url: '/api/dd/selectData/list',
      //   method: 'POST',
      //   data: {
      //     funcModule: this.$t('route.' + this.$route.meta.title),
      //     funcOperation: this.$t('biz.btn.search'),
      //     data: {
      //       type: 'CUST_INFO',
      //       queryParams: {
      //         size: 5,
      //         typeCode: '1',
      //         usingFlag: '1',
      //         auditStatus: '3'
      //       }
      //     }
      //   }
      // }).then(response => {
      //   if (response.data && response.data.length > 0) {
      //     this.form.formData[0].list = response.data
      //   }
      // })
      this.form.formData[0].list = []
    }
  },
  methods: {
    initCallback(data) {
      setTimeout(() => {
        this.summaryData = [{
          usingFlag: '2'
        }, {
          usingFlag: '2'
        }]
        this.mainData.table.showSummary = true
      }, 1000)
    },
    showSummary(param) {
      const {
        columns
      } = param
      const data = this.summaryData
      const sums = []
      const sumColumns = ['productCategoryName', 'usingFlag']
      columns.forEach((column, index) => {
        if (sumColumns.indexOf(column.property) != -1) {
          const filterCol = this.mainData.table.cols.filter(col => col.prop === column.property)[0]
          if (filterCol && filterCol.format) {
            if (filterCol.format.func) {
              sums[index] = Vue.filter(filterCol.format.func)(data[column.property])
            } else {
              const values = data.map(item => Number(item[column.property]))
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            }
          }
        }
      })
      return sums
    },
    // 自定义按钮事件
    onDefined() {
      console.log(this, 'hello world')
    },
    change(value) {
      console.log(value)
    },
    changeAll(item) {
      console.log(item)
    },
    onChange(params) {
      console.log(params, 111)
    },
    onEvn(params) {
      console.log(params, 222)
    },
    onChangeAll(params) {
      console.log(params, 333)
    }
  }
}
</script>
