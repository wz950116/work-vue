<template>
  <qm-dialog-print :list='items' :active='activeUrl' v-on='$listeners'></qm-dialog-print>
</template>

<script>
export default {
  data() {
    return {
      activeUrl: '',
      items: [
        {
          name: '百度',
          url: 'https://www.baidu.com'
        },
        {
          name: 'Vue',
          url: 'https://cn.vuejs.org/'
        },
        {
          name: '掘金',
          url: 'https://juejin.im/'
        },
        {
          name: 'Redux',
          url: 'https://www.redux.org.cn/'
        }
      ]
    }
  }
}
</script>