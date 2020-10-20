<template>
  <div style='padding:10px;'>
    {{tableData}}
    <el-table class='table-content table-array-row tb-edit' :data="tableData" border style='border:1px solid;'>
      <el-table-column label="敞口编号" width="120" prop='ck'>
        <template slot-scope='scope'>
          <el-input size='mini' v-model='scope.row.ck'></el-input>
        </template>
      </el-table-column>
      <el-table-column label="计划编号" width="120" prop='planCode'>
        <template slot-scope='scope'>
          <div class='nest' v-for='(i, index) in scope.row.planCode' :key="index" :style="{'border-top': index > 0 ? '1px solid #aaaaaa' : '', height: 25 * i.contract.length + 'px', 'line-height': 25 * i.contract.length + 'px'}">
            <el-input size='mini' v-model='i.code'></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="定价调整补偿亏损额" width="180" prop='priceAjust'>
        <template slot-scope='scope'>
          <div class='nest' v-for='(i, index) in scope.row.planCode' :key="index" :style="{'border-top': index > 0 ? '1px solid #aaaaaa' : '', height: 25 * i.contract.length + 'px', 'line-height': 25 * i.contract.length + 'px'}">
            <el-input size='mini' v-model='i.priceAjust'></el-input>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="合约" width="120" prop='contract'>
        <template slot-scope='scope'>
          <div class='nest' v-for='(i, index) in scope.row.planCode' :key="index">
            <div class='nest' v-for='(m, index) in i.contract' :key="index" :style="{height: '25px', 'border-top': (index > 0 || i.contract.length === 1) ? '1px solid #aaaaaa' : '', 'line-height': '25px'}">
              <el-input size='mini' v-model='m.name'></el-input>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="方向" width="120" prop='dir'>
        <template slot-scope='scope'>
          <div class='nest' v-for='(i, index) in scope.row.planCode' :key="index">
            <div class='nest' v-for='(m, index) in i.contract' :key="index" :style="{height: '25px', 'border-top': (index > 0 || i.contract.length === 1) ? '1px solid #aaaaaa' : '', 'line-height': '25px'}">
              <el-input size='mini' v-model='m.dir'></el-input>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        ck: '敞口1',
        planCode: [{
          code: '计划1',
          priceAjust: '500',
          contract: [{
            name: '合约1',
            dir: '多头'
          }, {
            name: '合约2',
            dir: '空头'
          }]
        }, {
          code: '计划2',
          priceAjust: '400',
          contract: [{
            name: '合约3',
            dir: '多头'
          }]
        }]
      }]
    }
  }
}
</script>

<style lang='scss'>
.table-array-row {
  .cell {
    padding: 0 !important;
    height: unset !important;
    div {
      &::before {
        display: none;
      }
      &::after {
        display: none;
      }
    }
    .nest {
      display: block;
    }
  }
}
</style>
