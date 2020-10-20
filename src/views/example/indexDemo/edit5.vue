<template>
    <qm-dialog-tab-tree-table ref="qmDialogTabTreeTable" v-on="$listeners" :dialog='dialog' @closeDialog='handleCloseDialog'>
    </qm-dialog-tab-tree-table>
</template>

<script>
export default {
    data() {
        return {
            dialog: {
                form: {
                    initSearch: true,
                    expandAll: false,
                    treeName: '业务功能列表',
                    isSearch: true,
                    api: {
                        getTreeList: '/api/sys/menu/billMenu'
                    },
                    apiData: {
                        getTreeList() {
                            return ''
                        }
                    },
                    defaultProps: {
                        children: 'children',
                        label: 'cname'
                    },
                    handleNodeClick: this.handleNodeClick,
                    formDataVisible: true,
                    moreShowFlg: true,
                    formData: [
                        {
                            type: 'date',
                            label: '时间区间选择',
                            props: ['startTime2', 'endTime2'],
                            attrs: {
                                clearable: true,
                                format: 'yyyy-MM-dd',
                                'value-format': 'yyyyMMdd'
                            },
                            validate: [{
                                required: true,
                                trigger: 'change'
                            }]
                        }, {
                            label: '商品名称',
                            prop: 'productCategoryName',
                            element: 'input-validate',
                            attrs: {
                                clearable: true
                            },
                            validate: [{
                                required: true,
                                trigger: 'blur'
                            }]
                        }, {
                            label: '商品简称',
                            prop: 'productCategoryAbbr',
                            element: 'input-validate',
                            attrs: {
                                clearable: true
                            },
                            validate: [{
                                required: true,
                                trigger: 'blur'
                            }]
                        }, {
                            label: '商品编码',
                            prop: 'productCategoryCode',
                            element: 'input-validate',
                            attrs: {
                                clearable: true
                            }
                        }, {
                            label: '备注',
                            prop: 'remark',
                            element: 'el-input',
                            attrs: {
                                clearable: true,
                                cols: 2
                            }
                        }]
                },

                mainData: {
                    initSearch: false,
                    api: {
                        search: '/api/sys/sysBillPrint/list',
                        doDelete: '/api/sys/sysBillPrint/remove'
                    },
                    apiData: {
                        search(node) {
                            return { moduleCode: node['code'] }
                        }
                    },
                    table: {
                        cols: [{
                            prop: 'printName',
                            width: '220',
                            label: '商品名称'
                        }, {
                            prop: 'updateDate',
                            width: '220',
                            label: '更新时间'
                        }, {
                            prop: 'productCategoryCode',
                            width: '220',
                            label: '商品编码'
                        }, {
                            prop: 'attrGroupId',
                            width: '220',
                            label: '属性组'
                        }, {
                            prop: 'usingFlag',
                            width: '220',
                            align: 'center',
                            label: '状态',
                            format: {
                                dict: this.$t('datadict.usingFlag')
                            }
                        }, {
                            prop: 'remark',
                            minWidth: '500',
                            label: '编码'
                        }]
                    }
                },

            }
        }
    },
    methods: {
        handleCloseDialog(params) {
            this.$emit('closeHandler', params)
        }
    }
}
</script>
