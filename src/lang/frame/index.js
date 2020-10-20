// 基础信息
import enBase from '@/lang/frame/base/modules/base_en'
import zhBase from '@/lang/frame/base/modules/base_zh'
// 消息中心
import enMsg from '@/lang/frame/base/modules/msg_en'
import zhMsg from '@/lang/frame/base/modules/msg_zh'
// 消息中心
import enFile from '@/lang/frame/base/modules/file_en'
import zhFile from '@/lang/frame/base/modules/file_zh'
// 基础档案
import enData from '@/lang/frame/base/modules/data_en'
import zhData from '@/lang/frame/base/modules/data_zh'
// 首页
import enDashboard from '@/lang/frame/base/modules/dashboard_en'
import zhDashboard from '@/lang/frame/base/modules/dashboard_zh'

// todo
import enSource from '@/lang/frame/base/modules/dataSource_en'
import zhSource from '@/lang/frame/base/modules/dataSource_zh'
// sys
import enSys from '@/lang/frame/base/modules/sys_en'
import zhSys from '@/lang/frame/base/modules/sys_zh'
// bpm
import enBpm from '@/lang/frame/bpm/bpm_en'
import zhBpm from '@/lang/frame/bpm/bpm_zh'
// 客户管理
import enCustomer from '@/lang/frame/ct/cst_en.js'
import zhCustomer from '@/lang/frame/ct/cst_zh.js'
// 业务流程
import enBusinessBpm from '@/lang/frame/bpm/businessBpm_en.js'
import zhBusinessBpm from '@/lang/frame/bpm/businessBpm_zh.js'
// 个人办公
import enOffice from '@/lang/frame/bpm/office_en.js'
import zhOffice from '@/lang/frame/bpm/office_zh.js'
// 平台
import enPlatform from '@/lang/frame/base/modules/platform_en.js'
import zhPlatform from '@/lang/frame/base/modules/platform_zh.js'
// 库存管理
import zhStorage from '@/lang/frame/ct/storage_zh.js'
// 资金管理
import zhFund from '@/lang/frame/ct/fund_zh.js'
// 信用证管理
import zhLc from '@/lang/frame/ct/lc_zh.js'
// 费用管理
import zhFee from '@/lang/frame/ct/fee_zh.js'
// 合同管理
import zhSpot from '@/lang/frame/ct/spot_zh.js'
// 其他合同
import zhOther from '@/lang/frame/ct/Other_zh.js'

// acceptance
import zhAcceptance from '@/lang/frame/ct/acceptance_zh.js'

import zhInvoice from '@/lang/frame/ct/invoice_zh.js'
// 功能中心
import enFunc from '@/lang/frame/base/modules/func_en'
import zhFunc from '@/lang/frame/base/modules/func_zh'
// haiqin
// 衍生品业务
import enDerivative from '@/lang/frame/rm/derivative_en.js'
import zhDerivative from '@/lang/frame/rm/derivative_zh.js'
// 策略
import enStrategy from '@/lang/frame/rm/strategy_en'
import zhStrategy from '@/lang/frame/rm/strategy_zh'
// 期权
import enOption from '@/lang/frame/rm/option_en'
import zhOption from '@/lang/frame/rm/option_zh'

// 业务单据一览表
import bill from '@/lang/frame/ct/bill_zh.js'
// 往来数据
import zhTransaction from '@/lang/frame/ct/transaction_zh'
// 保证金监控
import zhMargin from '@/lang/frame/ct/margin_zh.js'
import enMargin from '@/lang/frame/ct/margin_en.js'

const messages = {
  en: {
    ...enOption,
    ...enBase,
    ...enSource,
    ...enMsg,
    ...enFile,
    ...enSys,
    ...enData,
    ...enDashboard,
    ...enBpm,
    ...enCustomer,
    ...enPlatform,
    ...enFunc,
    ...enBusinessBpm,
    ...enOffice,
    ...enDerivative,
    ...enStrategy,
    ...enMargin
  },
  zh: {
    ...zhOption,
    ...zhBase,
    ...zhSource,
    ...zhMsg,
    ...zhFile,
    ...zhSys,
    ...zhData,
    ...zhDashboard,
    ...zhBpm,
    ...zhCustomer,
    ...zhPlatform,
    ...zhFunc,
    ...zhBusinessBpm,
    ...zhOffice,
    ...zhStorage,
    ...zhFund,
    ...zhLc,
    ...zhAcceptance,
    ...zhSpot,
    ...zhOther,
    ...zhFee,
    ...zhInvoice,
    ...bill,
    ...zhTransaction,
    ...zhDerivative,
    ...zhStrategy,
    ...zhMargin
  }
}

export default messages
