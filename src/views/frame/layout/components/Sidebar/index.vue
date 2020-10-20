<template>
	<el-scrollbar wrapClass="scrollbar-wrapper">
		<el-menu mode="vertical" :show-timeout="200" :default-active="$route.name" :collapse="isCollapse" background-color="#006a9d" text-color="#a7c5ec" active-text-color="#fff">
			<sidebar-item v-for="route in permissionMenus.filter(r => r.name === app.moduleName)" :key="route.name" :item="route" v-if="!route.hidden && route.children && route.children.length > 0" />
		</el-menu>
	</el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  data() {
    return {
      input: '',
      searchLoading: false
    }
  },
  inject: ['app'],
  components: {
    SidebarItem
  },
  computed: {
    ...mapGetters(['permissionMenus', 'sidebar']),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
