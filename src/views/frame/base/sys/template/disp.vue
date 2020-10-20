<template>
  <div class='dialog-wrapper'>
    <div class='dialog-container' style='width:1000px;'>
      <TitleContain @TitleFun="doClose()" :titleName="$t('file.template.dispTitle')" />
      <div class="dialog-content">
        <el-form ref="TemplateFrom" label-position="left" :model="data" prop="data">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('file.template.stdTemplate')" prop="templateCode">
                <el-select v-model="data.templateCode" :default-first-option="true" @change="stdChange()" :disabled="!editAble">
                  <el-option v-for="item in stdTemplateList" :key="item.templateCode" :label="item.templateName" :value="item.templateCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <iframe ref="qmEditorFrame" src="static/qmeditor/index.html" style="width:100%;height:30rem;"></iframe>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button size="medium" @click="doClose()">{{this.$t('biz.btn.cancel')}}</el-button>
        <el-button v-if="editAble" size="medium" type="primary" @click="doSave()">{{this.$t('biz.btn.save')}}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>
<script>
import request from '@/utils/frame/base/request'
import TitleContain from '@/components/frame/TitleContain'
export default {
  name: 'FileTemplateDisp',
  components: {
    TitleContain
  },
  data() {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: null
      },
      editAble: false,
      stdTemplateList: [],
      data: {
        billType: null,
        billNo: null,
        mode: 'view',
        templateCode: null,
        fillData: {}
      },
      template: {
        editorWin: null
      }
    }
  },
  computed: {},
  props: {
    dialog: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    const initChooseParam = this.$attrs.initChooseParam
    this.data.billType = initChooseParam.billType
    this.data.billNo = initChooseParam.billNo
    this.data.mode = initChooseParam.mode
    if (initChooseParam.fillData) {
      this.data.fillData = initChooseParam.fillData
    }
    if (this.data.mode === 'add' || this.data.mode === 'update') {
      this.editAble = true
    }
    this.initDialog()
  },
  methods: {
    initDialog() {
      const funcModule = this.$t('route.' + this.$route.meta.title)
      const funcOperation = this.$t('biz.btn.search')
      var selfThis = this
      request({
        url: '/api/sys/template/listByCategory',
        method: 'post',
        data: {
          funcModule: funcModule,
          funcOperation: funcOperation,
          data: this.data.billType
        }
      }).then(response => {
        if (response.status) {
          this.stdTemplateList = response.data
        }
      })

      const qmEditorFrame = this.$refs.qmEditorFrame
      qmEditorFrame.addEventListener('qmEditorInit', function(event) {
        selfThis.template.editorWin = event.detail.editorWin
        if (selfThis.editAble) {
          selfThis.template.editorWin.setMode('disp')
        } else {
          selfThis.template.editorWin.setMode('view')
          selfThis.template.editorWin.setDisabled()
        }
        if (selfThis.data.billNo !== null && selfThis.data.billNo !== undefined && selfThis.data.billNo !== '') {
          request({
            url: '/api/sys/templateUse/getByBill',
            method: 'post',
            data: {
              funcModule: funcModule,
              funcOperation: funcOperation,
              data: {
                billType: selfThis.data.billType,
                billNo: selfThis.data.billNo
              }
            }
          }).then(response => {
            if (response.status) {
              if (response.data) {
                selfThis.data.templateCode = response.data.templateCode
                selfThis.template.editorWin.setContent(response.data.templateContent)
                selfThis.template.editorWin.fillData(selfThis.data.fillData)
              }
            }
          })
        }
      })
    },
    stdChange() {
      request({
        url: '/api/sys/template/get',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: this.data.templateCode
        }
      }).then(response => {
        if (response.status) {
          this.template.editorWin.setContent(response.data.templateContent)
          this.template.editorWin.fillData(this.data.fillData)
        }
      })
    },
    doClose() {
      this.$emit('closeHandler')
    },
    doSave() {
      request({
        url: '/api/sys/templateUse/save',
        method: 'post',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search'),
          data: {
            billType: this.data.billType,
            billNo: this.data.billNo,
            templateCode: this.data.templateCode,
            templateContent: this.template.editorWin.getContent()
          }
        }
      }).then(response => {
        if (response.status) {
          this.$emit('closeHandler')
        }
      })
    }
  }
}
</script>
<style>
</style>

