<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' :style="{width: this.sidebar.opened ? '700px' : '850px'}">
      <!-- 头部 -->
      <title-contain :titleName='titleName' @TitleFun="cancel" />
      <!-- 顶部按钮 -->
      <el-row class='top-operate'>
        <el-button v-db-click size="mini" @click="$emit('closeHandler')" v-if="type==='view'">
          <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
        </el-button>
        <el-button v-db-click size="mini" @click="cancel" v-if="type!=='view'">
          <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
        </el-button>
        <el-button v-db-click size="mini" @click="save" v-if="type!=='view'">
          <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
        </el-button>
      </el-row>

      <main>
        <el-table stripe border class='table-content tb-edit' ref="singleTable" highlight-current-row element-loading-spinner="el-icon-loading" :element-loading-text="$t('route.load')" :data="tableData" :height='374'>
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column align="center" show-overflow-tooltip prop='tradeDate' :label="$t('spotProj.exposure.compensate.tradeDate')">
            <template slot-scope='scope'>
              {{scope.row.tradeDate | dateFormat('yyyy-MM-dd')}}
            </template>
          </el-table-column>
          <el-table-column align="right" show-overflow-tooltip prop='quantityOld' :label="$t('spotProj.exposure.compensate.quantityOld')"></el-table-column>
          <el-table-column v-if="type !== 'view'" show-overflow-tooltip prop='quantityNew' :label="$t('spotProj.exposure.compensate.quantityNew')">
            <template slot-scope='scope'>
              <input-formatter v-model="scope.row.quantityNew" :precision="2" type='thousands' @change="numChange" :min="0" size="mini"></input-formatter>
            </template>
          </el-table-column>
          <el-table-column align="right" v-else show-overflow-tooltip prop='quantityNew' :label="$t('spotProj.exposure.compensate.quantityNew')"></el-table-column>
          <el-table-column align="right" show-overflow-tooltip prop='difference' :label="$t('spotProj.exposure.compensate.difference')"></el-table-column>
        </el-table>
      </main>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { confirmTip, notifyInfo } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'

export default {
  data() {
    return {
      activeName: 'taxList',
      mainInfoVisible: true,
      dataIsChange: false,
      onOff: false,
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      },
      tableData: []
    }
  },
  props: ['documentNo', 'type'],
  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight']),
    titleName() {
      if (this.type === 'view') {
        return this.$t('spotProj.exposure.compensate.viewTitle')
      } else {
        return this.$t('spotProj.exposure.compensate.title')
      }
    }
  },
  updated() {
    // 防止初始化组件注册触发update
    if (this.onOff) {
      this.dataIsChange = true
    }
    this.onOff = true
  },
  mounted() {
    if (this.type === 'view') {
      this.listData()
    } else {
      this.getData()
    }
  },
  methods: {
    listData() {
      request({
        url: '/api/strategy/strgSpotExpComp/list',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.documentNo
        }
      }).then(response => {
        for (var i = 0; i < response.data.length; i++) {
          response.data[i].difference = parseFloat(response.data[i].quantityOld) - parseFloat(response.data[i].quantityNew)
        }
        this.tableData = response.data
      })
    },
    getData() {
      request({
        url: '/api/spot/strgExposure/getList',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.documentNo
        }
      }).then(response => {
        var obj = {}
        const newDate = new Date()
        var month = newDate.getMonth() + 1
        if (parseInt(month) < 10) {
          month = '0' + month
        }
        var day = newDate.getDate()
        if (parseInt(day) < 10) {
          day = '0' + day
        }
        obj.tradeDate = newDate.getFullYear() + '' + month + day
        obj.quantityOld = response.data[0].documentQuantity
        obj.quantityNew = response.data[0].documentQuantity
        obj.documentNo = response.data[0].documentNo
        obj.difference = 0
        this.tableData.push(obj)
      })
    },
    save() {
      if (this.tableData[0].quantityOld < this.tableData[0].quantityNew) {
        this.$notify(
          notifyInfo({
            msg: this.$t('spotProj.exposure.msg.numberTrans')
          })
        )
        return
      }
      this.$confirm(this.$t('spotProj.exposure.msg.compensateSave'), this.$t('biz.msg.tip'), {
        type: 'info',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        request({
          url: '/api/strategy/strgSpotExpComp/save',
          method: 'POST',
          data: {
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save'),
            data: this.tableData[0]
          }
        }).then(() => {
          this.$emit('closeHandler')
        })
      })
    },
    cancel() {
      // 若界面发生修改则关闭时提示
      if (this.dataIsChange) {
        confirmTip(this, 'confirmCancel')
          .then(() => {
            this.$emit('closeHandler')
          })
          .catch(() => {})
      } else {
        this.$emit('closeHandler')
      }
    },
    numChange(value) {
      this.$set(this.tableData[0], 'difference', parseFloat(this.tableData[0].quantityOld) - parseFloat(value))
    }
  }
}
</script>
