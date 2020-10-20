<template>
  <div class="login-container">
    <div class="login-logo">
      <img :src="loginLogo" />
      <span class='copyright'>系统版本&nbsp;V5.0</span>
    </div>
    <div :class="['login-content', clientWidth < 1920 ? 'login-content-small' : 'login-content-big']">
      <div class='login-bg-wrap'>
        <el-carousel trigger="click">
          <el-carousel-item v-for="(i, index) in slidersSmall" :key="index">
            <img class='login-bg-img' :src='i.img' alt="" :style="{'width': swiperWidth + 'px'}">
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class='login-form-wrap'>
        <img :src="loginTitle" alt="">
        <div class='login-form'>
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
            <div class="title">
              {{$t('login.userTitle')}}
            </div>
            <el-form-item prop="username" data-key='username'>
              <el-input name="username" type="text" v-model="loginForm.username" :placeholder="$t('login.username')" />
            </el-form-item>

            <el-form-item prop="password" data-key='password'>
              <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="off" :placeholder="$t('login.password')" />
            </el-form-item>

            <el-row :gutter="10">
              <el-col :span="14">
                <el-form-item prop="captcha">
                  <el-input type="text" v-model="loginForm.captcha" :maxlength='4' auto-complete="off" :placeholder="$t('login.captcha')" style="width: 100%;" @keyup.enter.native="handleLogin"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-image style="height:30px;vertical-align:top;" :src="loginForm.src">
                    <div slot="placeholder" class="image-slot">
                      {{$t('biz.route.load')}}<span class="dot">...</span>
                    </div>
                  </el-image>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <i class='el-icon-refresh pointer' style='font-size:16px;margin-top:5px;' alt="如果看不清楚，请单击刷新！" @click="loadCaptcha"></i>
              </el-col>
            </el-row>

            <el-button class='login-btn' type="primary" :loading="loading" @click.native.prevent="handleLogin">
              {{$t('login.login')}}
            </el-button>
          </el-form>
        </div>
      </div>
      <div class='login-tip'>最佳浏览环境:&nbsp;谷歌版本...以上，1366×768显示分辨率以上。</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { encriptPwd, md5Two } from '@/utils/frame/base/encript.js'
import session from '@/utils/frame/base/sessionStorage'
import storage from '@/utils/frame/base/localStorage'
import login_bg_1366_1 from '@/assets/frame/img/login_bg_1366_1.jpg'
import login_bg_1366_2 from '@/assets/frame/img/login_bg_1366_2.jpg'
import login_bg_1366_3 from '@/assets/frame/img/login_bg_1366_3.jpg'
import loginLogo from '@/assets/frame/img/login_logo.png'
import loginTitle from '@/assets/frame/img/login_title.png'

// axios访问
import request from '@/utils/frame/base/request'
export default {
  components: {},
  name: 'userlogin',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6 || value.length > 20) {
        $('.is-required[data-key=password] .el-form-item__content').attr('data-content', this.$t('login.pwdValidateMsg'))
        callback(new Error())
      } else {
        callback()
      }
    }
    return {
      loginLogo: loginLogo,
      loginTitle: loginTitle,
      loginForm: {
        src: '',
        username: '',
        password: '',
        captcha: '',
        captchaToken: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur' }],
        captcha: [{ required: true, trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      slidersSmall: [
        {
          img: login_bg_1366_1
        },
        {
          img: login_bg_1366_2
        },
        {
          img: login_bg_1366_3
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['clientWidth']),
    swiperWidth() {
      return this.clientWidth < 1920 ? 1366 : 1920
    }
  },
  created() {
    this.loadCaptcha()
    this.getLoginLogo()
    this.getLoginFlash()
  },
  mounted() {
    session.remove('userPwd')
    this.loginForm.username = storage.get('opt_user')

    // 校验规则提示添加
    $('.login-container .is-required .el-form-item__content').attr('data-content', this.$t('biz.placeholder.require'))
  },
  methods: {
    getLoginLogo() {
      request({
        url: '/api/img/show',
        method: 'POST',
        data: {
          funcModule: '登陆',
          funcOperation: this.$t('biz.btn.search'),
          data: {
            tenantHash: this.$route.params.tenantCode,
            showSite: 'login_logo'
          }
        }
      })
        .then(response => {
          if (response.data && response.data.length > 0) {
            const element = response.data[0]
            if (process.env.PREVIEW_URL.indexOf('http') > -1) {
              this.loginLogo = process.env.PREVIEW_URL + element
            } else {
              this.loginLogo = window.document.location.protocol + '//' + window.document.location.host + '/preview/' + element
            }
          }
        })
        .catch(() => {})
    },

    getLoginFlash() {
      request({
        url: '/api/img/show',
        method: 'POST',
        data: {
          funcModule: '登陆',
          funcOperation: this.$t('biz.btn.search'),
          data: {
            tenantHash: this.$route.params.tenantCode,
            showSite: 'login_flash'
          }
        }
      })
        .then(response => {
          if (response.data && response.data.length > 0) {
            this.slidersSmall = []
            response.data.forEach(element => {
              if (process.env.PREVIEW_URL.indexOf('http') > -1) {
                this.slidersSmall.push({
                  img: process.env.PREVIEW_URL + element
                })
              } else {
                this.slidersSmall.push({
                  img: window.document.location.protocol + '//' + window.document.location.host + '/preview/' + element
                })
              }
            })
          }
        })
        .catch(() => {})
    },

    loadCaptcha() {
      request({
        url: '/captcha',
        method: 'POST',
        data: {}
      })
        .then(response => {
          if (response.data) {
            this.loginForm.captchaToken = response.data.token
            this.loginForm.src = 'data:image/jpeg;base64,' + response.data.img
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          const userInfo = {
            username: this.loginForm.username,
            password: encriptPwd(this.loginForm.password),
            captcha: this.loginForm.captcha,
            captchaToken: this.loginForm.captchaToken,
            tenantHashCode: this.$route.params.tenantCode || process.env.DEFAULT_TENANT
          }
          this.$store
            .dispatch('UserLogin', userInfo)
            .then(() => {
              this.loading = false
              session.set('userPwd', md5Two(this.loginForm.password))
              session.set('loginType', 'user')
              session.set('tenantHashCode', this.$route.params.tenantCode || process.env.DEFAULT_TENANT)
              session.set('username', this.loginForm.username)

              storage.set('opt_user', this.loginForm.username)
              this.$router.push({ path: '/' }).catch(() => {})
            })
            .catch(() => {
              this.loading = false
              this.loadCaptcha()
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>
