<template>
  <div class="menu-wrapper" v-if='!item.hidden'>
    <router-link v-if='!item.children' :to="{name: item.name}" :key="item.name">
      <el-menu-item :index="item.name" :route-data='item.name' :title="generateTitle(item.meta.title)">
        <svg-icon className='svg-icon-menu' :icon-class="item.meta.icon || 'table'"></svg-icon>
        <span v-if="item.meta && item.meta.title" slot="title" class='menu_decorate'>{{ generateTitle(item.meta.title) }}</span>
      </el-menu-item>
    </router-link>
    <component :is='item.meta && item.meta.isFirstParent ? "div" : "el-submenu"' v-else :index="item.name" :key="item.name" :title='generateTitle(item.meta.title)' :route-data='item.name'>
      <template slot="title">
        <svg-icon className='svg-icon-menu' :icon-class="item.meta.icon || 'table'"></svg-icon>
        <span v-if="item.meta && item.meta.title" slot="title" class='menu_decorate'>{{ generateTitle(item.meta.title) }}</span>
      </template>
      <template v-if="!item.hidden && item.children && item.children.length > 0">
        <sidebar-item v-for="child in item.children" :key="child.name" :item="child" />
      </template>
    </component>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/frame/base/i18n'

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    generateTitle
  }
}
</script>

<style scoped>
.menu_decorate {
  user-select: none;
}
</style>
