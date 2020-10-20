<template>
    <div class="block">
        <el-timeline>
            <el-timeline-item timestamp="2018/4/12" placement="top">
                <div class='app-container edit-page-style'>
                    <header v-for='table in tables' :key='table.name' :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': table.visible ? '1px' : '0'}">
                        <div class='form-title'>{{$t(table.label)}}
                            <i :class="[table.visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='table.visible = !table.visible'></i>
                        </div>
                        <component :is='table.name' v-show='table.visible' v-bind='table.attrs' type='add' :param='{}' :ref='table.name' :editForm='editForm' class='edit-header-table' :content='table.content'></component>
                    </header>
                </div>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
                <div class='app-container edit-page-style' style='margin-left: 20px;'>
                    <header v-for='table in tables' :key='table.name' :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': table.visible ? '1px' : '0'}">
                        <div class='form-title'>{{$t(table.label)}}
                            <i :class="[table.visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='table.visible = !table.visible'></i>
                        </div>
                        <component :is='table.name' v-show='table.visible' v-bind='table.attrs' type='add' :param='{}' :ref='table.name' :editForm='editForm' class='edit-header-table' :content='table.content'></component>
                    </header>
                </div>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
                <div class='app-container edit-page-style' style='margin-left: 20px;'>
                    <header v-for='table in tables' :key='table.name' :style="{'width': clientWidth < 1366 ? (sidebar.opened ? '1163px' : '1323px') : 'auto', 'border-bottom-width': table.visible ? '1px' : '0'}">
                        <div class='form-title'>{{$t(table.label)}}
                            <i :class="[table.visible ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click='table.visible = !table.visible'></i>
                        </div>
                        <component :is='table.name' v-show='table.visible' v-bind='table.attrs' type='add' :param='{}' :ref='table.name' :editForm='editForm' class='edit-header-table' :content='table.content'></component>
                    </header>
                </div>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
const registerComponent = data => {
    data.forEach(item => {
        if (item.component) {
            Vue.component(item.name, item.component)
        }
    })
}
export default {
    data() {
        return {
            loading: false,
            tableData: [],
            rules: {},
            editForm: {
                startDate: '',
                endData: ''
            },
            tables: [
                {
                    name: 'DEMO_Tab11',
                    label: '商品信息',
                    component: () => import('../indexDemo/DEMO_Tab.vue'),
                    isShow: ['add', 'update'],
                    required: true,
                    visible: true
                }
            ]
        }
    },
    computed: {
        ...mapGetters(['sidebar', 'clientWidth'])
    },
    beforeMount() {
        // 组件注册
        registerComponent(this.tables)
    }
}
</script>

<style scoped lang='scss'>
.block {
  margin: 0 auto;
  padding: 20px;
  background: white;
}
</style>