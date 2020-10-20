<template>
  <div>
    <div class='block_title'>
      待结业务
      <dialog-set :block='block' v-on="$listeners" @changeBlock='initData'></dialog-set>
    </div>
    <el-row :gutter='20' class='bussiness_box' style='margin: 0;'>
      <div v-for='(item, index) in tableData' :key='index'>
        <check-item :item='item' :index='index' :length='tableData.length - 1'></check-item>
      </div>
    </el-row>
  </div>
</template>
<script>
import request from '@/utils/frame/base/request'
import checkItem from '@/views/frame/dashboard/components/checkItem.vue'
import dialogSet from '@/views/frame/dashboard/components/dialogSet.vue'
export default {
  name: 'todo',
  data() {
    return {
      tableData: [],
      tableAllData: [
        {
          name: 'fundApplyConfirmCheck',
          routerName: 'fundApplyConfirmCheck',
          url: '/api/fund/apply/count',
          bgColor: '#ff7400'
        },
        {
          name: 'advanceApplyTransferCheck',
          routerName: 'advanceApplyTransferCheck',
          url: '/api/fund/applyAdvTran/count',
          bgColor: '#3fb1e3'
        },
        {
          name: 'fundReceiveClaimCheck',
          routerName: 'fundReceiveClaimCheck',
          url: '/api/fund/receive/count',
          bgColor: '#ffb248'
        },
        {
          name: 'advanceClaimTransferCheck',
          routerName: 'advanceClaimTransferCheck',
          url: '/api/fund/claimAdvTran/count',
          bgColor: '#5b8bc4'
        },
        {
          name: 'domesticInvoiceApplyConfirmCheck',
          routerName: 'domesticInvoiceApplyConfirmCheck',
          url: '/api/invoice/domApplyDetail/count',
          bgColor: '#6ba0df'
        },
        {
          name: 'domesticInvoiceReceiveClaimCheck',
          routerName: 'domesticInvoiceReceiveClaimCheck',
          url: '/api/invoice/domesticReceive/count',
          bgColor: '#85dae6'
        },
        {
          name: 'domesticNoInvoicingCheck',
          routerName: 'domesticNoInvoicingCheck',
          url: '/api/invoice/domNoInvoicingCheck/count',
          bgColor: '#a0a7e6'
        },
        {
          name: 'domesticNotToCheck',
          routerName: 'domesticNotToCheck',
          url: '/api/invoice/domNotToCheck/count',
          bgColor: '#ff6648'
        }
        // ,{
        //   name: 'lcApplyCheck',
        //   routerName: 'lcApplyCheck',
        //   url: '/api/lc/apply/count',
        //   bgColor: '#ff6648'
        // },
        // {
        //   name: 'lcReceiveCheck',
        //   routerName: 'lcReceiveCheck',
        //   url: '/api/lc/receive/count',
        //   bgColor: '#ff6648'
        // },
        // {
        //   name: 'acceptanceSignCheck',
        //   routerName: 'acceptanceSignCheck',
        //   url: '/api/acceptance/sign/count',
        //   bgColor: '#ff6648'
        // },
        // {
        //   name: 'acceptanceReceiveCheck',
        //   routerName: 'acceptanceReceiveCheck',
        //   url: '/api/acceptance/receive/count',
        //   bgColor: '#ff6648'
        // },
        // {
        //   name: 'foreignNoInvoicingCheck',
        //   routerName: 'foreignNoInvoicingCheck',
        //   url: '/api/invoice/foreignNoInvoicingCheck/count',
        //   bgColor: '#ff6648'
        // },
        // {
        //   name: 'foreignNotToCheck',
        //   routerName: 'foreignNotToCheck',
        //   url: '/api/invoice/foreignNotToCheck/count',
        //   bgColor: '#ff6648'
        // }
      ]
    }
  },
  components: {
    checkItem,
    dialogSet
  },
  props: {
    block: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      // 请求当前模块数据
      request({
        url: '/api/sys/sysEmpBlock/get',
        method: 'POST',
        data: {
          data: this.block.blockCode,
          funcModule: '业务员区块',
          funcOperation: '查询单个'
        }
      }).then(response => {
        if (response.data) {
          const list = response.data.empCompList.map(v => v.compCode)
          // 筛选
          this.tableData = this.tableAllData.filter(item => list.includes(item.name))
          // 排序
          this.tableData.sort((a, b) => {
            return list.indexOf(a.name) - list.indexOf(b.name)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.block_title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #303133;
  padding-left: 15px;
  background: #ffffff;
  border: 1px solid #eaeefb;
  border-bottom: 1px solid #e4e7ed;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.16);
  cursor: move;
}
.bussiness_box {
  height: 217px;
  padding: 0 20px;
  background: #ffffff;
  border: 1px solid #eaeefb;
  border-top: none;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.16);
}
</style>
