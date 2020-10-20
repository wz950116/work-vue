<template>
  <div>d</div>
</template>
<script>
export default {
  data: function () {
    return {
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: null
      },
      msgFuncList: []
    }
  }

}
</script>

