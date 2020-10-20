<template>
  <qm-dialog-tree-table ref="qmTable" :dialog='dialog' @closeDialog='handleCloseDialog'></qm-dialog-tree-table>
</template>

<script>
import { notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
// axios访问
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
export default {
  data() {
    return {
      dialog: {
        titleName: this.$t('cst.customerSupplier.title.allocation'),
        form: {
          treeName: this.$t('cst.customerSupplier.title.orgTreeName'),
          isTopBar: false,
          initSearch: true,
          expandAll: true,
          leftWidth: 260,
          expandOnClickNode: false,
          showCheckbox: true,
          strictly: true,
          isSearch: true,
          showCode: false,
          handleNodeClick: this.handleTreeNodeClick,
          handleTreeCheckChange: this.handleTreeCheckChange,
          handleRowClick: this.handleRowClick,
          api: {
            getTreeList: '/api/func/org/treeOrgan',
            getCheckedList: '/api/cust/allocation/listCheck'
          },
          apiData: {
            custCode: this.getCustCode(),

            getTreeList() {
              return {
                usingFlag: '1',
                dataAuth: false
              }
            },
            getCheckedList() {
              return {
                custCode: this.custCode
              }
            }
          },
          defaultProps: {
            children: 'children',
            key: 'code',
            label: 'name'
          }
        },
        mainData: {
          initSearch: true,
          api: {
            search: '/api/cust/allocation/list'
          },
          apiData: {
            custCode: this.getCustCode(),
            search(node) {
              return {
                custCode: this.custCode
              }
            },
            init() {
              return {
                custCode: this.custCode
              }
            }
          },
          table: {
            cols: [
              {
                prop: 'organCode',
                isShow: false
              },
              {
                prop: 'orgName',
                width: '200',
                label: 'cst.customerSupplier.list.orgName'
              },
              {
                prop: 'typeCode',
                isShow: false
              },
              {
                prop: 'typeCodeList',
                label: 'cst.customerSupplier.list.custType',
                formType: 'checkbox',
                checkboxList: this.$t('datadict.custcsType'),
                abledList: this.getCustTypeCodeList()
              }
            ]
          },
          bottomBar: {
            pagination: {
              show: false
            }
          }
        },

        bottomButtons: [
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            event: this.handleCloseDialog
          },
          {
            name: 'biz.btn.cancelSelect',
            event: this.cancelAllSelect
          },
          {
            name: 'biz.btn.allSelect',
            event: this.selectAll
          },
          {
            name: 'biz.btn.save',
            event: this.save,
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    param: {
      type: [Object],
      default() {
        return {}
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * 获取客户编号
     */
    getCustCode() {
      return this.param.custInfo.custCode
    },
    /**
     * 获取客户类型
     */
    getCustTypeCodeList() {
      return this.param.custInfo.typeCodeList
    },
    /**
     * 获取分配方式
     */
    getAllocationType() {
      return this.param.allocationType
    },
    handleCloseDialog(params) {
      this.$emit('closeHandler', { closeParent: true })
    },
    /**
     * 处理树节点click
     *
     * @param {Object} node 节点数据
     */
    handleTreeNodeClick(node) {},
    /**
     * 处理表格行click
     *
     * @param {Object} row 行数据
     */
    handleRowClick(row) {},
    /**
     * 处理树节点change
     *
     * @param {Object} nodeData 节点数据
     * @param {Bool} checked 是否被选中
     * @param {Bool} chirdrenNodeChecked 节点的子树中是否有被选中的节点
     */
    handleTreeCheckChange(nodeData, checked, chirdrenNodeChecked) {
      if (checked) {
        // 添加行
        this.addRow(nodeData)
      } else {
        // 删除行
        this.removeRow(nodeData)
      }
    },
    /**
     * 添加行
     * @param {Object} nodeData 节点数据
     */
    addRow(nodeData) {
      const tableCols = this.$refs.qmTable.tableCols
      const tableData = this.$refs.qmTable.tableData
      let existFlag = false
      // 若当前节点已存在，则不添加
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i]['organCode'] === nodeData.orgCode) {
          existFlag = true
          break
        }
      }
      if (existFlag) {
        return
      }
      const newRow = {}
      tableData.forEach(row => {
        if (row['organCode'] === nodeData.orgCode) {
          tableData.splice(tableData.indexOf(row), 1)
        }
      })
      tableCols.forEach(c => {
        const colProp = c.prop
        if (colProp === 'organCode') {
          newRow[colProp] = nodeData.orgCode
        } else if (colProp === 'orgName') {
          newRow[colProp] = nodeData.name
        } else if (colProp === 'typeCodeList') {
          newRow[colProp] = []
        } else {
          newRow[colProp] = ''
        }
      })
      tableData.push({
        ...newRow
      })
    },
    /**
     * 删除行
     * @param {Object} nodeData 节点数据
     */
    removeRow(nodeData) {
      const tableData = this.$refs.qmTable.tableData
      tableData.forEach(row => {
        if (row['organCode'] === nodeData.orgCode) {
          tableData.splice(tableData.indexOf(row), 1)
        }
      })
    },
    /**
     * 取消全选
     */
    cancelAllSelect() {
      const tableData = this.$refs.qmTable.tableData
      for (let i = 0; i < tableData.length; i++) {
        tableData[i].typeCodeList = []
      }
    },
    /**
     * 全选
     */
    selectAll() {
      const tableData = this.$refs.qmTable.tableData
      for (let i = 0; i < tableData.length; i++) {
        tableData[i].typeCodeList = this.getCustTypeCodeList()
      }
    },
    // 保存通用事件
    save() {
      const tableData = this.$refs.qmTable.tableData
      if (!tableData || tableData.length < 1) {
        this.$notify(notifyInfo({ msg: this.$t('biz.msg.noRowSelected') }))
        return
      }
      // 校验客户类型是否选择
      for (let i = 0; i < tableData.length; i++) {
        const row = tableData[i]
        if (!Array.isArray(row.typeCodeList) || row.typeCodeList.length < 1) {
          this.$notify(notifyInfo({ msg: '[' + row.orgName + ']' + this.$t('cst.customerSupplier.validateMsg.custTypeRequired') }))
          return
        }
      }

      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        const dataParam = {}
        dataParam.custCode = this.getCustCode()
        dataParam.allocationType = this.getAllocationType()
        let custAllocationList = []
        tableData.forEach(row => {
          let typeCodeList = Array.isArray(row.typeCodeList) ? row.typeCodeList : []
          custAllocationList.push({
            custCode: dataParam.custCode,
            organCode: row.organCode,
            typeCodeList: typeCodeList
          })
        })
        dataParam.custAllocationList = custAllocationList
        this.loading = true

        request({
          url: '/api/cust/allocation/updateAll',
          method: 'POST',
          data: {
            data: dataParam,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
          }
        })
          .then(response => {
            this.$notify(notifySuccess({ msg: this.$t('biz.msg.updateSuccess') }))
            this.loading = false
            this.handleCloseDialog(true)
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>
