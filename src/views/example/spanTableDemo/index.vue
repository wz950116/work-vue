<template>
  <el-table :data="tableData" :span-method="arraySpanMethod" border style="width:90%;margin:10px auto;border:1px solid;">
    <el-table-column prop="name1" label="期货交割棉重量公证检验证书">
      <el-table-column prop="name2" label="中国纤维检验局统一制证">
        <el-table-column prop="name" label="编号:"></el-table-column>
        <el-table-column prop="amount1" label="130012201970381"></el-table-column>
        <el-table-column prop="amount2" label=""></el-table-column>
        <el-table-column prop="amount3" label="2019年10月30日"></el-table-column>
      </el-table-column>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        id: '12987120',
        name: '产品名称',
        amount1: '锯齿细绒棉',
        amount2: '货权人',
        amount3: '中棉集团陕西棉花有限公司'
      }, {
        id: '12987121',
        name: '执行标准',
        amount1: 'GB1103.1-2012',
        amount2: '存放仓库',
        amount3: '新疆银棉储运有限公司'
      }, {
        id: '12987122',
        name: '棉花产地',
        amount1: '新疆',
        amount2: '加工单位',
        amount3: '新疆农垦现代农业有限公司克拉玛依一三零棉业分公司'
      }, {
        id: '12987123',
        name: '报检号',
        amount1: '032920190382',
        amount2: '加工单位代码',
        amount3: '66095'
      }, {
        id: '12987124',
        name: '包数',
        amount1: '186',
        amount2: '批号',
        amount3: '66095193036'
      }, {
        id: '12987125',
        name: '检验结果',
        amount1: '毛重',
        amount2: '42.0600吨',
        amount3: ''
      }, {
        id: '12987126',
        name: '',
        amount1: '皮重',
        amount2: '0.2360吨',
        amount3: ''
      }, {
        id: '12987127',
        name: '',
        amount1: '净重',
        amount2: '41.824吨',
        amount3: ''
      }, {
        id: '12987128',
        name: '',
        amount1: '含杂率',
        amount2: '3.4%',
        amount3: ''
      }, {
        id: '12987129',
        name: '',
        amount1: '回潮率',
        amount2: '5.8%',
        amount3: ''
      }, {
        id: '12987130',
        name: '',
        amount1: '公定重量',
        amount2: '42.495吨',
        amount3: ''
      }, {
        id: '12987131',
        name: '',
        amount1: '异性纤维',
        amount2: '未发现',
        amount3: ''
      }, {
        id: '12987132',
        name: '',
        amount1: '含异性纤维样品数量',
        amount2: '0只',
        amount3: ''
      }, {
        id: '12987133',
        name: '备注',
        amount1: '包装方式',
        amount2: '棉布套包法',
        amount3: ''
      }, {
        id: '12987134',
        name: '',
        amount1: '单包最高回潮率',
        amount2: '6.0%',
        amount3: ''
      }, {
        id: '12987135',
        name: '',
        amount1: '包装方式：棉布套包法 单包最高回潮率：6.0%',
        amount2: '',
        amount3: ''
      }]
    };
  },
  methods: {
    arraySpanMethod({
      row,
      column,
      rowIndex,
      columnIndex
    }) {
      if (columnIndex === 0) {
        if (rowIndex === 5) {
          return {
            rowspan: 8,
            colspan: 1
          }
        } else if (rowIndex > 5 && rowIndex <= 12) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else if (rowIndex === 13) {
          return {
            rowspan: 3,
            colspan: 1
          }
        } else if (rowIndex > 13 && rowIndex <= 15) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      } else if (columnIndex === 1) {
        if (rowIndex === 15) {
          return {
            rowspan: 1,
            colspan: 3
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      } else if (columnIndex === 2) {
        if (rowIndex >= 5 && rowIndex < 15) {
          return {
            rowspan: 1,
            colspan: 2
          }
        } else if (rowIndex === 15) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      } else if (columnIndex === 3) {
        if (rowIndex >= 5 && rowIndex < 15) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else if (rowIndex === 15) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    }
  }
}
</script>