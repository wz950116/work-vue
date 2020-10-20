<template>
  <el-col :span='6' class='bussiness_item' @click.native='goOtherPage'>
    <div class='bussiness_icon' :style='{"background-color": item.bgColor}'></div>
    <div class='bussiness_info' :style='{"border-right": (index+1)%4===0||index===length?"none" :""}'>
      <div class='count'>{{formData.countNumber}}</div>
      <div class='name' :title="$t('fund.common.'+item.routerName)">{{$t('fund.common.'+item.routerName)}}</div>
    </div>
  </el-col>
</template>

<script>
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      formData: {}
    }
  },
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    length: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'item.url'(newValue) {
      if (newValue) {
        this.getData()
      }
    }
  },
  mounted() {
    if (this.item.url) {
      this.getData()
    }
  },
  methods: {
    getData() {
      request({
        url: this.item.url,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save')
        }
      }).then(response => {
        if (response) {
          this.formData = response.data
        }
      })
    },
    goOtherPage() {
      const routeInfo = {
        name: this.item.routerName
      }
      this.$router.push(routeInfo)
    }
  }
}
</script>

<style scoped lang='scss'>
.bussiness_item {
  padding: 27px 0;
  cursor: pointer;
  .bussiness_icon {
    float: left;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: url('../../../../assets/frame/img/dashboard_bussiness.png') no-repeat center 9px;
    margin: 5px 10px 5px 0;
  }
  .bussiness_info {
    float: left;
    width: calc(100% - 52px);
    text-align: left;
    border-right: 1px solid #dcdfe6;
    .count {
      font-size: 24px;
      font-weight: 700;
      color: #ffb248;
      text-indent: 5px;
      margin-bottom: 8px;
    }
    .name {
      font-size: 12px;
      color: #aaaaaa;
      width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>

