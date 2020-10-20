<template>
  <div v-el-drag-dialog class='dialog-wrapper tree-dialog'>
    <div class='dialog-container'>
      <TitleContain :titleName="dialogTitle" @TitleFun="close" />
      <div class="dialog-content" style="padding-bottom:40px">
        <div class='content-wrap' style="height: 500px;">
          <el-tree ref="tree" :default-expanded-keys='expandedKeys' :data="staffTree" node-key="code" :props="defaultProps" :default-expand-all='false' draggable @node-drag-start="dragStart" @node-drop="dragDrop">
          </el-tree>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button @click='close()'>{{this.$t("biz.btn.cancel")}}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import * as moduleApi from '@/api/frame/base/platform/module'
import TitleContain from '@/components/frame/TitleContain'
import { notifyError, notifySuccess } from '@/utils/frame/base/notifyParams'

export default {
  components: {
    TitleContain
  },
  computed: {
    dialogTitle() {
      return '目录调整'
    }
  },
  props: {
    organId: String,
    checkedKeys: Array
  },
  watch: {
    loadingFlag: function(value) {
      this.loadStaff()
    }
  },
  data() {
    return {
      expandedKeys: [],
      staffTree: [],
      saveArray: [],
      tempTree: [],
      defaultProps: {
        children: 'children',
        label: 'cname'
      }
    }
  },
  methods: {
    loadMenu() {
      moduleApi
        .listCatalogAll('', {
          funcModule: this.$t('route.' + this.$route.meta.title),
          funcOperation: this.$t('biz.btn.search')
        })
        .then(response => {
          this.staffTree = response.data
        })
        .catch(() => {
          this.staffTree = []
        })
    },
    close() {
      this.$emit('closeHandler')
    },
    dragStart(node) {
      this.tempTree = JSON.parse(JSON.stringify(this.staffTree))
    },
    dragDrop(node, enterNode, dropType) {
      if (!node.data.subMenuFlag && dropType === 'inner' && enterNode && enterNode.data.flag === '1') {
        // if (false) {
        this.$notify(
          notifyError({
            msg: '无法向菜单下放入数据'
          })
        )
        this.staffTree = this.tempTree
      } else {
        var parentCode = ''
        if (dropType === 'inner') {
          parentCode = enterNode.data.code
          moduleApi
            .updateOrder(node.data.code, parentCode, {
              funcModule: this.$t('route.' + this.$route.meta.title),
              funcOperation: this.$t('biz.btn.update')
            })
            .then(response => {
              this.$notify(
                notifySuccess({
                  msg: '菜单调整成功'
                })
              )
              this.loadMenu()
              this.expandedKeys = []
              this.expandedKeys.push(parentCode)
            })
        } else {
          // before、after
          parentCode = enterNode.data.parentCode
          if (node.data.parentCode !== parentCode) {
            moduleApi
              .updateOrder(node.data.code, parentCode, {
                funcModule: this.$t('route.' + this.$route.meta.title),
                funcOperation: this.$t('biz.btn.update')
              })
              .then(response => {
                this.$notify(
                  notifySuccess({
                    msg: '菜单调整成功'
                  })
                )
                this.loadMenu()
                this.expandedKeys = []
                this.expandedKeys.push(parentCode)
              })
          } else {
            const sortInfo = {}
            // 排序

            if (enterNode && enterNode.parent && enterNode.parent.childNodes) {
              enterNode.parent.childNodes.forEach((node, index) => {
                sortInfo[node.data.id] = index
              })
              moduleApi
                .sortMenu(sortInfo, {
                  funcModule: this.$t('route.' + this.$route.meta.title),
                  funcOperation: this.$t('biz.btn.update')
                })
                .then(response => {
                  this.$notify(
                    notifySuccess({
                      msg: '菜单排序成功'
                    })
                  )
                  this.loadMenu()
                  this.expandedKeys = []
                  this.expandedKeys.push(enterNode.data.parentCode)
                })
            }
          }
        }
      }
    }
  },
  mounted() {
    this.loadMenu()
  }
}
</script>
