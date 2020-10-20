<template>
  <div style="margin-top:5px">
    <el-image :src="imgSrc">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
      <div slot="placeholder" class="image-slot">
        加载中<span class="dot">...</span>
      </div>
    </el-image>
  </div>
</template>
<script>
// axios访问
import request from '@/utils/frame/base/request'
export default {
  data() {
    return {
      imgSrc: ''
    }
  },
  props: {
    type: String,
    editForm: {
      type: Object,
      default() {
        return {}
      }
    },
    param: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    this.initDialog()
  },
  methods: {
    initDialog() {
      request({
        url: '/api/bpm/task/img',
        method: 'POST',
        data: {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.bpm'),
          data: {
            processId: this.param.processId,
            uk: this.param.uk,
            moduleCode: this.param.moduleCode
          }
        }
      })
        .then(response => {
          if (response.data) {
            this.imgSrc = 'data:image/jpeg;base64,' + response.data
          }
        })
        .catch(() => {})
    }
  }
}
</script>

