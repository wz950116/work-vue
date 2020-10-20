<template>
  <qm-dialog ref='dialog' :dialog='dialog' @closeDialog='handleCloseDialog' @initCallback='handleInitCallback'></qm-dialog>
</template>

<script>
import Vue from 'vue'
import request from '@/utils/frame/base/request'
import toolUtil from '@/utils/frame/base/toolUtil.js'
import collectionUtil from '@/utils/frame/base/collectionUtil.js'
import { confirmTip, notifyInfo, notifySuccess } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      dialog: {
        type: this.param.opType || this.opType,
        param: {},
        styleType: 'mini',
        initType: 'api',
        titleName: this.$t('route.' + this.$route.meta.title),
        api: {
          view: '/api/cust/customer/getByCode'
        },
        apiData: {
          view(param) {
            return param.custCode
          }
        },
        formData: [
          {
            prop: 'id',
            default: this.getId(),
            isShow: false
          },
          {
            prop: 'custCode',
            label: 'cst.customerSupplier.form.custNo',
            element: 'el-input',
            default: this.getCustCode(),
            validate: [
              {
                required: true,
                trigger: 'blur'
              }
            ],
            attrs: {
              disabled: true
            }
          },
          {
            prop: 'allocationType',
            label: 'cst.customerSupplier.form.allocationType',
            type: 'radio',
            default: this.getAllocationType(),
            list: this.$t('datadict.custAllocationType'),
            event: this.onChangeOfAllocationType,
            validate: [
              {
                required: true,
                trigger: 'change'
              }
            ]
          }
        ],
        bottomButtons: [
          {
            name: 'biz.btn.close',
            event: 'close',
            isShow: ['allocation'],
            attrs: {
              type: 'primary'
            }
          },
          {
            name: 'biz.btn.cancel',
            event: 'cancel',
            isShow: ['allocation']
          },
          {
            name: 'biz.btn.next',
            event: this.doNext,
            isShow: false
          },
          {
            name: 'biz.btn.save',
            event: this.doSave,
            showLoading: true,
            isShow: false,
            attrs: {
              type: 'primary'
            }
          }
        ]
      }
    }
  },
  props: {
    opType: {
      type: String,
      default: 'add'
    },
    param: {
      type: [Object, String],
      default() {
        return {}
      }
    }
  },
  beforeMount() {
    this.dialog.param = {
      custCode: this.getCustCode(),
      custInfo: {},
      allocationType: this.getAllocationType()
    }
  },
  mounted() {},
  methods: {
    /**
     * dialog关闭回调
     */
    handleCloseDialog(params) {
      this.$emit('closeHandler', true)
    },
    /**
     * 获取id
     */
    getId() {
      return this.param.row.id
    },
    /**
     * 获取客户编号
     */
    getCustCode() {
      return this.param.row.custCode
    },
    /**
     * 获取分配方式
     */
    getAllocationType() {
      // 默认完全共享（0）
      return toolUtil.defaultVal(this.param.row.allocationType, '0')
    },
    /**
     * 下一步
     */
    doNext() {
      this.dialog.param.allocationType = this.$refs.dialog.formData['allocationType']
      // 注册组件
      Vue.component('view-form-dialog', () => import('@/views/frame/biz/cst/customerSupplier/orgSetDialog.vue'))
      this.$refs.dialog.dialogSelectVisible = true
    },
    /**
     * 保存
     */
    doSave() {
      this.$confirm(this.$t('biz.msg.confirmSave'), this.$t('biz.msg.tip'), {
        type: 'warning',
        closeOnClickModal: false,
        confirmButtonText: this.$t('biz.btn.confirm'),
        cancelButtonText: this.$t('biz.btn.cancel')
      }).then(() => {
        const dataParam = {}
        const formData = this.$refs.dialog.formData
        dataParam.custCode = formData.custCode
        dataParam.allocationType = formData.allocationType
        this.loading = true

        request({
          url: '/api/cust/allocation/updateAll',
          method: 'POST',
          data: {
            data: dataParam,
            funcModule: this.$t('route.' + this.$route.meta.title),
            funcOperation: this.$t('biz.btn.save')
          }
        })
          .then(response => {
            this.$notify(notifySuccess({ msg: this.$t('biz.msg.updateSuccess') }))
            this.loading = false
            this.handleCloseDialog(true)
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    /**
     * 处理初始化回调
     * @param {Object} data 响应数据
     */
    handleInitCallback(data) {
      if (data) {
        this.dialog.param.custInfo = data
      }
      if (data && toolUtil.isNotEmpty(data.allocationType)) {
        //  处理底部按钮
        this.handleBottomButton(data.allocationType)
      }
    },
    /**
     * 处理底部按钮
     * @param {String} allocationType 分配方式
     */
    handleBottomButton(allocationType) {
      allocationType = toolUtil.defaultVal(allocationType, '0')
      const nextButton = this.getDefDialogBottomButtonsByName(this, 'biz.btn.next')
      const saveButton = this.getDefDialogBottomButtonsByName(this, 'biz.btn.save')
      // 完全共享
      if (allocationType === '0') {
        if (nextButton) {
          nextButton.isShow = false
          saveButton.isShow = true
        }
        return
      }
      // 手动分配
      if (allocationType === '1') {
        if (nextButton) {
          nextButton.isShow = true
          saveButton.isShow = false
        }
        return
      }
    },
    /**
     * 取得底下按钮元素定义
     *
     * @param {Object} self  自身this
     * @param {String} buttonName 按钮name
     * @returns 底下按钮元素定义
     */
    getDefDialogBottomButtonsByName(self, buttonName) {
      const bottomButtons = self.dialog.bottomButtons
      if (!(Array.isArray(bottomButtons) && bottomButtons.length > 0)) {
        return null
      }
      for (let i = 0; i < bottomButtons.length; i++) {
        if (bottomButtons[i].name) {
          if (bottomButtons[i].name === buttonName) {
            return bottomButtons[i]
          }
        }
      }
      return null
    },
    /**
     * 监听分配方式改变
     *
     * @param {Object} item 选中项
     */
    onChangeOfAllocationType(item) {
      const formDataRef = this.$refs.dialog.formData
      // 分配方式
      const allocationType = formDataRef['allocationType']
      // 处理底部按钮
      this.handleBottomButton(allocationType)
    }
  }
}
</script>
