<template>
  <div v-el-drag-dialog class='dialog-wrapper'>
    <div class='dialog-container'>
      <div class='dialog-title'>
        {{titleName}}
        <span class="nav">
          <span class='max-min'>
            <svg-icon icon-class="线性-最大化" class='max' style='display:none;'></svg-icon>
            <svg-icon icon-class="线性-最小化" class='min' style='display:none;'></svg-icon>
          </span>
        </span>
      </div>

      <div class='dialog-content'>
        <h1>
          北京华融启明风险管理技术股份有限公司（以下简称“启明股份”）软件试用条款
        </h1>

        <p>
          若要继续，您必须接受此协议的条款。如果不想接受启明股份【套期保值和风险管理系统】（以下简称“HGRM系统”）软件试用条款，请关闭此窗口以取消登录。

          感谢您选择启明股份！

          本协议介绍您的权利以及您试用HGRM系统的前提条件。您应阅读完整协议，因为所有条款都很重要并一起构成适用于您的协议。

          接受本协议或使用该软件，即表示您同意所有这些条款，并且同意按照第 3 节中介绍的保密信息声明在软件的试用期间传输特定信息。如果您不接受并遵守这些条款，则您不能使用该软件或其功能。您可以与软件制造商联系，了解相关软件试用的相关内容。

        </p>

        <h2>
          1、 概述
        </h2>

        <h3>
          1.1甲方
        </h3>

        <p>
          “甲方”指的是提出试用启明股份HGRM系统需求的企业。
        </p>

        <h3>
          1.2乙方
        </h3>

        <p>
          “乙方”指的是提供HGRM系统试用服务的软件制造商：北京华融启明风险管理技术股份有限公司。
        </p>

        <h3>
          1.3产品
        </h3>

        <p>
          产品是指乙方依据本协议约定向甲方提供在有效期内免费试用的的许可软件和标准产品支持服务。
        </p>

        <h4>
          1.3.1“许可软件”是指由启明股份享有著作权，并许可甲方在试用期限内使用的软件，不包括源代码及开发中形成的技术文档。
        </h4>

        <h4>
          1.3.2“标准产品支持服务”是指乙方为确保软件产品的正常运行而提供的支持服务，主要包括乙方组织的特定集中试用、甲方在允许的产品试用期限内中由乙方通过电话、远程等方式提供的软件操作指导性服务。不包括甲方提出的需要乙方出差、试用期限外、标准产品支持服务外的任何服务以及产生的费用。
        </h4>

        <h2>
          2、知识产权及许可限制
        </h2>

        <h3>
          2.1 甲方承认基于本协议取得的许可软件以及任何补丁、程序、代码、解决方案及文档信息的著作权均归乙方所有。
        </h3>

        <h3>
          2.2 乙方授予甲方对许可软件享有非专有的使用许可。甲方不得将许可软件转让、出租、出借或提供分许可、再许可、通过信息网络传播或以其他形式供他人利用。甲方不得限制、破坏或绕过许可软件附带的加密附件或乙方提供的其他确保许可软件正确使用的限制性措施。甲方不得将许可软件用于除甲方内部使用以外的其他目的，包括但不限于向第三方提供数据处理服务、应用服务、商业共享或其他软件共享安排。甲方不得除掉、掩盖或更改许可软件上有关许可软件著作权声明、权利人标识或商标的标志。
        </h3>

        <h3>
          2.3 如乙方依据甲方要求或双方约定，向甲方提供本协议约定的软件产品之外的第三方软件的使用许可、技术指标及相关服务，甲方应遵守第三方提供的最终用户许可使用协议和用户手册，或与第三方单独签订相关协议。除乙方与第三方另有约定外，乙方不对该软件承担任何责任。
        </h3>

        <h3>
          2.4 乙方保证提供给甲方的产品不存在知识产权方面的瑕疵，否则乙方将承担甲方由此产生的相关损失（包括但不限于因第三方提出权利要求导致甲方因赔偿、诉讼等承担的损失）。
        </h3>

        <h2>
          3、保密信息的保护
        </h2>

        <p>
          保密信息是指甲、乙方各自专有的、且提供给对方的并明确标有“保密”字样的信息，包括但不限于本协议及其签订、许可软件、数据等。任何一方未经对方的事先书面许可，不得向第三方，或允许向第三方直接或间接地透露保密信息。无论本协议变更、解除或终止，本条款保持有效。
        </p>

        <h2>
          4、争议解决
        </h2>

        <p>
          凡因本协议引起的或与本协议有关的任何争议，双方应协商解决，经协商不能解决时，任何一方均可向甲方住所地的人民法院提起诉讼。
        </p>

        <h2>
          5、其他
        </h2>

        <h3>
          5.1本协议自甲方同意之日起生效。
        </h3>

        <h3>
          5.2乙方承诺在提供产品或服务的同时承诺产品不存在恶意代码或未授权的连接功能（软件后门），不提供违反法律法规的操作模块、功能和手段。
        </h3>

        <p style='float:right;margin-right:10px;'>
          （以下无正文）
        </p>

        <div style='width:100%;text-align:center;margin-top:40px;'>
          <el-checkbox v-model="checked">我已阅读并同意该软件试用条款</el-checkbox>
        </div>
      </div>

      <div class="dialog-footer">
        <el-button @click="cancel">{{this.$t('biz.btn.cancel')}}</el-button>
        <el-button :disabled='!checked' type="primary" @click="confirm">{{this.$t('biz.btn.confirm')}}</el-button>
      </div>
    </div>
    <div class="mask"></div>
  </div>

</template>

<script>
import TitleContain from '@/components/frame/TitleContain'
import sysInitSetting from '@/api/proj/sys/sysInitSetting'
import { getLoginUrl } from '@/utils/frame/base/auth'

export default {
  name: 'agreement',
  components: {
    TitleContain
  },
  data() {
    return {
      titleName: '阅读启明股份【套期保值和风险管理系统】软件试用条款',
      checked: false
    }
  },
  methods: {
    confirm() {
      // 同意：修改为已读状态，关闭对话框
      sysInitSetting
        .updateReadFlag()
        .then(response => {
          this.$emit('close')
        })
    },
    cancel() {
      const loginUrl = getLoginUrl()
      // 拒绝：直接退出，回到登录页
      this.$store.dispatch('LogOut').then(() => {
        // 跳转
        this.$router.push(loginUrl)
        location.reload() // 为了重新实例化vue-router对象 避免bug
      }).catch(() => {
        // 本地退出
        this.$store.dispatch('FedLogOut').then(() => {
          // 跳转
          this.$router.push(loginUrl)
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  width: 1000px;
}
.dialog-content {
  width: 100%;
  height: 700px;
  overflow: auto;
  padding: 20px;
}
h1,
h2,
h3,
h4,
p {
  line-height: 2;
}
p {
  text-indent: 10px;
}
</style>
