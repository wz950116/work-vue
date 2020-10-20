<template>
  <div>
    <user-dashboard v-if='loginType === "user"'></user-dashboard>
    <platform-dashboard v-else-if='loginType === "plat"'></platform-dashboard>
    <group-dashboard v-else-if='loginType === "group"'></group-dashboard>
  </div>
</template>

<script>
import session from '@/utils/frame/base/sessionStorage'
import userDashboard from './user/index.vue'
import platformDashboard from './platform/index.vue'
import groupDashboard from './group/index.vue'

export default {
  name: 'dashboard',
  data() {
    return {
      loginType: ''
    }
  },
  components: {
    userDashboard,
    platformDashboard,
    groupDashboard
  },
  mounted() {
    this.loginType = session.get('loginType')
  }
}
</script>
