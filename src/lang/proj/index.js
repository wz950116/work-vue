// 项目
import enDataProj from '@/lang/proj/modules/data_en'
import zhDataProj from '@/lang/proj/modules/data_zh'
import enSpotProj from '@/lang/proj/spot/spot_en'
import zhSpotProj from '@/lang/proj/spot/spot_zh'
import enSysProj from '@/lang/proj/modules/sys_en'
import zhSysProj from '@/lang/proj/modules/sys_zh'
import enTargetProj from '@/lang/proj/modules/target_en'
import zhTargetProj from '@/lang/proj/modules/target_zh'

const messages = {
  en: {
    ...enDataProj,
    ...enSpotProj,
    ...enSysProj,
    ...enTargetProj
  },
  zh: {
    ...zhDataProj,
    ...zhSpotProj,
    ...zhSysProj,
    ...zhTargetProj
  }
}

export default messages
