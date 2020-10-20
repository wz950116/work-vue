<template>
  <div class='app-container edit-page-style'>
    <!-- 顶部按钮 -->
    <el-row class='top-operate'>
      <el-button size="mini" v-if="editForm.licenseStatus" style='margin-right:6px;' v-db-click @click='reregister()'>
        <svg-icon icon-class="线性-设置"></svg-icon>重新注册
      </el-button>
      <qm-upload :uploadUrl='licUrl' :notifyFlag='false' btnName='上传lic文件' @onFileChange='uploadLic'></qm-upload>

    </el-row>
    <!-- 基本设置 -->
    <header :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width':  '1px' }">
      <div class='form-title'>注册信息
      </div>
      <el-form class="header-form-inline" :model="editForm" label-position="left" :rules='rules' ref="refForm" :show-message="false">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="注册状态" prop='licenseStatus'>
              <el-tag v-if="editForm.licenseStatus" type="success" style='margin-right:6px;'>注册成功</el-tag>
              <el-tag v-else type="warning">未注册</el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="应用名称" prop='subject'>
              {{editForm.subject}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="版本号" prop='version'>
              {{editForm.version}}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="IP地址" prop='ipAddressReg'>
              <el-select v-model="editForm.ipAddressReg" :disabled='editForm.licenseStatus &&!reregisterFlag'>
                <el-option v-for="item in editForm.ipAddressArr" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="MAC地址" prop='macAddressReg'>
              <el-select v-model="editForm.macAddressReg" :disabled='editForm.licenseStatus &&!reregisterFlag'>
                <el-option v-for="item in editForm.macAddressArr" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24">
            <el-form-item label="CPU序列号" prop=' cpuSerial'>
                {{editForm.cpuSerial}}
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="主板序列号" prop='mainBoardSerial'>
              {{editForm.mainBoardSerial}}
            </el-form-item>
          </el-col> -->
          <template v-if="editForm.licenseStatus">
            <el-col :span="24">
              <el-form-item label="过期时间" prop='expiryDate'>
                {{editForm.expiryDate}}
              </el-form-item>
            </el-col>
          </template>
          <template v-if="editForm.licenseStatus&&editForm.maxOnlineNum&&editForm.maxOnlineNum>0">
            <el-col :span="24">
              <el-form-item label="最在在线用户数" prop='maxOnlineNum'>
                {{editForm.maxOnlineNum}}
              </el-form-item>
            </el-col>
          </template>

          <template v-if="(!editForm.licenseStatus)||reregisterFlag">
            <el-col :span="24">
              <el-form-item label=" ">
                <el-button type="text" @click="download()">导出注册信息</el-button>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </header>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/utils/frame/base/request'
import { notifySuccess, notifyError } from '@/utils/frame/base/notifyParams'
import axios from 'axios'

export default {
  name: 'clientLicense',
  data() {
    return {
      reregisterFlag: false,
      licUrl: process.env.BASE_API + '/api/license/uploadLic',
      editForm: {
        licenseStatus: false,
        ipAddressReg: '',
        version: '',
        subject: '',
        macAddressReg: '',
        expiryDate: '',
        cpuSerial: '',
        mainBoardSerial: '',
        ipAddressArr: [],
        macAddressArr: []
      },

      rules: {
        ipAddressReg: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        macAddressReg: [
          {
            required: true,
            trigger: 'change'
          }
        ]
      }
    }
  },

  computed: {
    ...mapGetters(['sidebar', 'clientWidth', 'clientHeight'])
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化下拉数据
    init() {
      let loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading'
      })
      request({
        url: '/api/license/getServerInfo',
        method: 'post',
        data: {
          data: '',
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        }
      })
        .then(response => {
          loading.close()
          this.editForm = Object.assign({}, response.data)
        })
        .catch(() => {
          loading.close()
        })
    },
    reregister() {
      this.reregisterFlag = true
    },
    uploadLic(value) {
      if (value && value.response && value.response.data) {
        this.$notify(
          notifySuccess({
            msg: this.$t('file.msg.uploadLicSuccess')
          })
        )
        this.init()
      } else {
        this.$notify(
          notifyError({
            msg: this.$t('file.msg.uploadLicError')
          })
        )
      }
    },
    download() {
      this.$refs.refForm.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: process.env.BASE_API + '/api/license/register/export',
            data: {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.export'),
              data: this.editForm
            },
            headers: {
              Authorization: 'Bearer ' + this.$store.getters.token
            },
            responseType: 'blob'
          })
            .then(response => {
              if (response.data) {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', 'RegistrationInformation.rif')
                document.body.appendChild(link)
                link.click()
                link.remove()
              }
            })
            .catch(error => {
              this.$notify(
                notifyError({
                  msg: this.$t('file.msg.downloadError')
                })
              )
            })
        }
      })
    }
  }
}
</script>
