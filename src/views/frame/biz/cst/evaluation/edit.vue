<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="close" v-if="['view'].includes(type)">
        <svg-icon icon-class="线性-关闭"></svg-icon>{{$t('biz.btn.close')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="cancel" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-取消"></svg-icon>{{$t('biz.btn.cancel')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' type="primary" @click="save" v-if="['add', 'update'].includes(type)">
        <svg-icon icon-class="线性-保存"></svg-icon>{{$t('biz.btn.save')}}
      </el-button>
      <el-button v-db-click size="mini" style='margin-right:6px;' @click="print" v-if="['view', 'assist', 'audit'].includes(type)" v-permission="[ 'print']">
        <svg-icon icon-class="线性-打印"></svg-icon>{{$t('biz.btn.print')}}
      </el-button>
    </el-row>
    <!-- 主信息 -->
    <header>
      <div class='form-title'>{{$t('cst.evaluation.template.title')}}</div>
      <el-form :inline="true" :model="formData" class="header-form-inline" label-position="left" ref="validateForm">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item :label="$t('cst.evaluation.template.templateName')" prop='templateName'>
              <el-input v-model="formData.templateName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('cst.evaluation.template.custName')" prop='custName'>
              <el-input v-model="formData.custName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('cst.evaluation.template.typeName')" prop='typeName'>
              <el-input v-model="formData.typeName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('cst.evaluation.template.businessType')" prop='businessType'>
              <el-input v-model="formData.businessType" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('cst.evaluation.template.buyAmount')" prop='buyAmount'>
              <input-formatter v-model="formData.buyAmount" type="money" :readonly="true"></input-formatter>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('cst.evaluation.template.productType')" prop='productType'>
              <el-input v-model="formData.productType" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item :label="$t('cst.satisfaction.template.evaluationProduct')" prop='evaluationProduct'>
              <el-input v-model="formData.evaluationProduct" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </header>

    <header v-for="column in questionList" :key="column.name">
      <div class='form-title'>{{column.name}}</div>
      <el-table stripe border :height="column.questionList.length * 25 + 27" highlight-current-row :data="column.questionList" class='table-content tb-edit' style="border:1px solid;">
        <el-table-column type="index" fixed="left" :label='$t("table.id")' width="50" align='center'></el-table-column>
        <el-table-column :label='$t("cst.evaluation.template.question")' width="200">
          <template slot-scope="scope">
            {{scope.row.question}}
          </template>
        </el-table-column>
        <el-table-column :label='$t("cst.evaluation.template.point")' width="120">
          <template slot-scope="scope">
            <input-formatter v-model="scope.row.point" :max="scope.row.maxPoint" :readonly="type === 'view'" size="mini"></input-formatter>
          </template>
        </el-table-column>
        <el-table-column :width="200" :label="$t('strategy.plan.list.remark')" prop="remark">
          <template slot-scope="scope">
            {{"最大分数为" + scope.row.maxPoint}}
          </template>
        </el-table-column>
      </el-table>
    </header>

    <!-- 备注 -->
    <header>
      <div class='form-title'>{{$t('cst.evaluation.template.remark')}}</div>
      <el-input type="textarea" v-model="formData.remark" resize='none' rows='4' :readonly="type === 'view'">
      </el-input>
    </header>
    <view-form-edit ref='viewFormEdit' v-if='dialogLv2Visible' @closeHandler='dialogHandler' :param='formData' :opType="type==='add' ? 'update' :type "></view-form-edit>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { notifySuccess } from '@/utils/frame/base/notifyParams'
import request from '@/utils/frame/base/request'
import Vue from 'vue'
export default {
  name: 'evaluationEdit',
  data() {
    return {
      type: this.$route.params.type || this.$route.params.opType,
      param: this.$route.params,
      questionList: {},
      answerList: [],
      formData: {},
      dialogLv2Visible: false
    }
  },
  mounted() {
    if (this.type === 'add') {
      this.initData()
    } else {
      this.getData()
    }
    this.initQuestion()
  },
  // 数据项的设立
  computed: {
    ...mapGetters(['permission_routers', 'sidebar', 'clientWidth', 'clientHeight']),
    tableHeight() {
      return this.clientW > 1440 ? document.documentElement.clientHeight - 300 : document.documentElement.clientHeight - 303 // 防止底部滚动条遮挡
    }
  },
  methods: {
    getData() {
      request({
        url: '/api/cust/custEvaluation/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.id
        }
      }).then(response => {
        this.formData = response.data
      })
    },
    initData() {
      request({
        url: '/api/cust/custEvaluation/init',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.data
        }
      }).then(response => {
        this.formData = response.data
        this.formData.id = null
        this.formData.evaluationProduct = this.$route.params.evaluationProduct
      })
    },
    initQuestion() {
      request({
        url: '/api/cust/custTemplateDetail/getQuestions',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.templateCode
        }
      }).then(response => {
        var evaluationColumn = {}
        for (let i = 0; i < this.$t('datadict.evaluationColumn').length; i++) {
          const item = this.$t('datadict.evaluationColumn')[i]
          evaluationColumn[item.value] = item.label
        }

        var columnList = {} // 栏目列表
        for (var i = 0; i < response.data.length; i++) {
          const item = response.data[i]

          const columnName = evaluationColumn[item.templateColumn] // 栏目名称

          var questionList = [] // 问题列表
          if (columnList[columnName]) {
            questionList = columnList[columnName].questionList
          }

          var question = {}
          question.id = item.id
          question.question = item.templateQuestion
          question.maxPoint = item.questionPoint
          question.point = null
          questionList.push(question) // 生成栏目问题用
          this.answerList.push(question) // 保存及读取赋值用

          var column = {}
          column.name = columnName
          column.questionList = questionList

          columnList[columnName] = column
        }
        this.questionList = columnList

        if (this.type !== 'add') {
          this.getAnswers()
        }
      })
    },
    getAnswers() {
      request({
        url: '/api/cust/custEvaluationDetail/get',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.$route.params.id
        }
      }).then(response => {
        const answers = {}
        for (let i = 0; i < this.answerList.length; i++) {
          const item = this.answerList[i]
          answers[item.id] = item
        }

        for (let i = 0; i < response.data.length; i++) {
          const item = response.data[i]
          if (answers[item.templateDetailId]) {
            answers[item.templateDetailId].point = item.point
          }
        }
      })
    },
    cancel() {
      this.$confirm(this.$t('biz.msg.abortEdit'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      })
        .then(() => {
          this.close()
        })
        .catch(() => {})
    },
    save() {
      var detailList = []
      for (let i = 0; i < this.answerList.length; i++) {
        var item = this.answerList[i]
        if (!item || item.point <= 0) {
          continue
        }
        item.templateDetailId = item.id
        item.id = null
        detailList.push(item)
      }
      this.formData.detailList = detailList

      var url = '/api/cust/custEvaluation/update'
      if (this.type === 'add') {
        url = '/api/cust/custEvaluation/save'
      }

      request({
        url: url,
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.save'),
          data: this.formData
        }
      }).then(() => {
        this.$notify(
          notifySuccess({
            msg: this.$t('biz.msg.saveSuccess')
          })
        )
        this.close()
      })
    },
    close() {
      // 关闭编辑页返回主页面的回调...
      this.$store.dispatch('delVisitedViews', this.$route).then(() => {
        this.$router.push({
          name: 'evaluation',
          query: {
            refresh: true
          }
        })
      })
    },
    // 打印
    print(buttonInfo) {
      Vue.component('view-form-edit', () => import('@/components/frame/qm/template/dialog/QmDialogPrint.vue'))
      this.dialogLv2Visible = true
      $(document).ready(() => {
        $(this.$refs.viewFormEdit.$el)
          .find('.mask')
          .css('z-index', 1998)
          .siblings('.dialog-container')
          .css({
            'z-index': 1999,
            width: '60%'
          })
      })
    },
    dialogHandler() {
      this.dialogLv2Visible = false
    }
  }
}
</script>
