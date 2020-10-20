<template>
  <div>
    <span>{{fileName}}</span>
    <i :v-show="status" class="el-icon-download" @click="download()" style="cursor: pointer;"></i>
    <i :v-show="status" class="el-icon-edit" @click="wordedit()" style="cursor: pointer;"></i>
  </div>
</template>
<script>

import { apiFileName } from '@/api/frame/base/sys/file'
import { apiRandTemp } from '@/api/frame/base/sys/file'
import axios from 'axios'

export default {
  data() {
    return {
      /** 原始文件名称 */
      fileName: null,
      wordInfo: {
        /** Word编辑时的临时文件路径 */
        tempPath: null
      },
      /** 是否加载完毕 */
      status: false
    }
  },
  watch: {
    attaId(val, oldVal) {
      if (val !== oldVal) {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.fileName = null
      this.wordInfo.tempPath = null
      this.status = false
      if (this.attaId !== null && this.attaId !== '') {
        this.fileName = '...'
        apiFileName(this.attaId)
          .then(response => {
            this.fileName = response.data
            this.status = true
          })
          .catch(e => {
            this.fileName = 'ERROR'
            this.status = false
          })
      }
    },
    download() {
      if (this.wordInfo.tempPath === null) {
        axios({
          method: 'post',
          url: process.env.BASE_API + '/api/sys/file/download',
          data: {
            data: this.attaId
          },
          headers: {
            'Authorization': 'Bearer ' + this.$store.getters.token
          },
          responseType: 'blob'
        }).then(response => {
          if (!response.data) {

          } else {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', this.fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
          }
        }).catch((error) => {
          console.log(error)
        })
      } else {
        const url = process.env.BASE_API + '/api/plugin/file/pageoffice/file/load'
        const form = $('<form></form>').attr('action', url).attr('method', 'post')
        form.append($('<input type="hidden" name="file" />').val(this.wordInfo.tempPath))
        form.append($('<input type="hidden" name="name" />').val(this.fileName))
        form.append($('<input type="hidden" name="token" />').val(this.$store.getters.token))
        form.appendTo('body').submit().remove()
      }
    },
    openWord() {
      const vueSelf = this
      const baseApi = process.env.BASE_API
      window.QmPageOfficeInfo = {
        vueSelf: vueSelf,
        RootPath: baseApi + '/api/plugin/file/pageoffice',
        childCallbackFunc(file) {
          vueSelf.$emit('onWordSave', vueSelf.attaId, vueSelf.fileName, vueSelf.wordInfo.tempPath)
        },
        initCallBackFunc() {
          let pageOfficeUrl = baseApi + '/api/plugin/file/pageoffice/word/init'
          pageOfficeUrl = pageOfficeUrl + '?file=' + encodeURIComponent(vueSelf.wordInfo.tempPath)
          pageOfficeUrl = pageOfficeUrl + '&token=' + encodeURIComponent(vueSelf.$store.getters.token)
          pageOfficeUrl = pageOfficeUrl + '&name=' + encodeURIComponent(vueSelf.fileName)
          // window.POBrowser.openWindow(pageOfficeUrl, 'width=960px;height=720px;')
          window.POBrowser.openWindowModeless(pageOfficeUrl, '')
        },
        getToken() {
          return vueSelf.$store.getters.token
        }
      }
      if (window.POBrowser === undefined) {
        $.getScript(baseApi + '/api/plugin/file/pageoffice/jquery-3.3.1.min.js', function(data, status, jqxhr) {
          $.getScript(baseApi + '/api/plugin/file/pageoffice/pageoffice-4.5.0.1.js', function(data, status, jqxhr) {
            // DO NOTHING
          })
        })
      } else {
        window.QmPageOfficeInfo.initCallBackFunc()
      }
    },
    wordedit() {
      if (this.wordInfo.tempPath === null) {
        apiRandTemp(this.attaId)
          .then(response => {
            this.wordInfo.tempPath = response.data.filePath
            this.openWord()
          })
          .catch(e => {
          })
      } else {
        this.openWord()
      }
    }
  },
  props: {
    attaId: String
  }
}
</script>
<style>
</style>
