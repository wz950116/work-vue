<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import i18n from '@/lang/index' // Internationalization

export default {
  name: 'app',
  mounted() {
    $(window).resize(() => {
      this.$store.dispatch('resetSize')
    })
    $(document).ready(function () {
      $(document).on('mouseover', '.is-required.is-error .el-form-item__content div', function () {
        const errorMsg = $(this).parent('.el-form-item__content').attr('data-content') || i18n.t('biz.placeholder.require')
        if ($(this).parent('.el-form-item__content').find('.el-form-item__errors').length === 0) {
          $(this).parent('.el-form-item__content').append(`<div class='el-form-item__errors'>${errorMsg}</div>`)
        } else {
          $(this).siblings('.el-form-item__errors').text(errorMsg)
        }
        $(this).parent('.el-form-item__content').find('.el-form-item__errors').show().css('opacity', 1)
      })
      $(document).on('mouseover', '.is-required.is-error .el-form-item__content > .el-form-item__errors', function () {
        $(this).parent('.el-form-item__content').find('.el-form-item__errors').hide()
      })
      $(document).on('mouseout', '.is-required.is-error .el-form-item__content > div', function () {
        $(this).parent('.el-form-item__content').find('.el-form-item__errors').css('opacity', 0)
      })
    })
  }
}
</script>
