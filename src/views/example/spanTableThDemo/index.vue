<template>
  <div style='padding:10px;'>
    <el-table :data="tableData" border style='border:1px solid;'>
      <el-table-column label="状态" width="420" prop='status'></el-table-column>
      <el-table-column label="采购">
        <el-table-column fixed label="采购合同编号" width="220" prop='code'></el-table-column>

        <el-table-column label="采购方">
          <el-table-column prop="give" label="供应商" width="220"></el-table-column>
        </el-table-column>
        <el-table-column label="合同开始日">
          <el-table-column prop="endDate" label="合同结束日" width="220"></el-table-column>
        </el-table-column>
        <el-table-column label="合同类型">
          <el-table-column prop="place" label="交货地" width="220"></el-table-column>
        </el-table-column>
        <el-table-column label="商品">
          <el-table-column prop="contractSum" label="合同数量" width="220"></el-table-column>
        </el-table-column>

        <el-table-column prop="relateSum" label="本次关联数量" width="220">
        </el-table-column>
      </el-table-column>
      <el-table-column label="状态" width="420" prop='status'></el-table-column>
      <el-table-column label="状态" width="420" prop='status'></el-table-column>
      <el-table-column label="状态" width="420" prop='status'></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        status: '完结',
        code: 'A1001',
        purchase: '杭州正才',
        give: '嘉能可',
        startDate: '2018-12-26',
        endDate: '2019-12-25',
        contractType: '现货',
        place: '上海',
        product: '铝锭',
        contractSum: '1,000',
        relateSum: '1000'
      }, {
        status: '未完结',
        code: 'A002',
        purchase: '浙江任远',
        give: '托克',
        startDate: '2019-02-01',
        endDate: '2019-02-28',
        contractType: '长单',
        place: '上海',
        product: '铝锭',
        contractSum: '3000',
        relateSum: '2000'
      }]
    }
  },
  mounted() {
    // 将返回数据分为一条两行 注：每列的字段需每行统一一致
    const newArr = []
    this.tableData.forEach(v => {
      newArr.push({
        status: v.status,
        code: v.code,
        give: v.purchase,
        endDate: v.startDate,
        place: v.contractType,
        contractSum: v.product,
        relateSum: v.relateSum
      })
      newArr.push({
        status: v.status,
        code: v.code,
        give: v.give,
        endDate: v.endDate,
        place: v.place,
        contractSum: v.contractSum,
        relateSum: v.relateSum
      })
    })
    this.tableData = newArr
  }
}
</script>
