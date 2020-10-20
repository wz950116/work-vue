<template>

  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container' type='miniColumnsDialog'>
      <!-- 头部 -->
      <TitleContain :titleName="titleName" @TitleFun="close" />

      <!-- 内容 -->
      <div class='dialog-content'>
        <el-table stripe border row-key='roleCode' :height="200" highlight-current-row :data="tableData" ref="multipleTable" style='border:1px solid;' class='table-content'>
          <el-table-column align='center' type="index" fixed="left" width="50" :label='$t("table.id")'></el-table-column>
          <el-table-column :label="$t('func.role.roleName')" prop="roleName" align="left"></el-table-column>
          <el-table-column :label="$t('func.role.organId')" prop="orgName" align="left"></el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="view(scope.$index, scope.row)" type="text" size="small">
                {{$t('biz.btn.view')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 底部 -->
      <div class="dialog-footer">
        <el-button type="primary" @click="close">{{this.$t('biz.btn.close')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import request from '@/utils/frame/base/request'
import TitleContain from '@/components/frame/TitleContain'

export default {
  name: 'myRole',
  data() {
    return {
      tableData: []
    }
  },
  components: {
    TitleContain
  },
  computed: {
    titleName() {
      return this.$t('func.user.userInfo')
    }
  },
  props: {
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      request({
        url: '/api/func/role/listByUser',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.param
        }
      })
        .then(response => {
          this.tableData = response.data
        })
    },
    view(index, row) {
      this.$router.push({
        name: 'roleDetail',
        params: {
          type: 'view',
          back: 'userManage',
          code: row.code
        }
      })
    },
    close() {
      this.$emit('closeHandler')
    }
  }
}
</script>

<style>
.table-content {
  line-height: 1.15;
}
</style>
