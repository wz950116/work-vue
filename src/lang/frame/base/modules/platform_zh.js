export default {
  platform: {
    process: {
      code: '代码',
      name: '名称',
      value: '值',
      defaultValue: '默认值',
      optionalValue: '可选值'
    },
    component: {
      form: {
        submitter: '提交人',
        assistMsg: '协助信息',
        assistant: '选择协助人',
        businessName: '业务名称',
        transfer: '选择转交人',
        transferMsg: '转交信息',
        bill: '审核单据',
        opinion: '审核意见',
        time: '提交时间'
      },
      tab: {
        tabAssistantTrackHistory: '协助历史',
        tabBillHistory: '单据历史',
        bpmImg: '流程图',
        tabApproveTrackHistory: '审核轨迹'
      },
      popup: {
        tabAssistantTrackHistory: '协助审核',
        approveConformDialog: '审批',
        approveHistoryDialog: '审批历史',
        approveDialog: '审批',
        assistConformDialog: '协助',
        tabApproveTrackHistory: '审批轨迹'
      },
      group: {
        approveDialogPart1: '主信息'
      },
      list: {
        updateDate: '时间',
        accountName: '操作人',
        assistantName: '协助人',
        assistStatusFlg: '协助状态',
        assistMsg: '协助信息',
        assistResult: '协助意见',
        approveResult: '审批意见',
        approveUser: '下一步审批人',
        auditStatus: '审批状态',
        agreeFlg: '审批结果',
        trackType: '审批动作'
      }
    },
    api: {
      api: 'API',
      apiCode: '权限',
      permissionsFlg: '包含权限标识',
      swaggerFlg: 'swagger标识',
      logFlg: '收集日志',
      logDetailFlg: '收集详细日志',
      apiMemo: 'Api说明',
      className: '类名',
      classNameMemo: '类描述',
      methodName: '方法名',
      apiModel: '模块'
    },

    menu: {
      moduleCode: '模块代码',
      name: '名称',
      catalog: '目录',
      menuName: '名称',
      menuCode: '标识',
      code: '代码',
      menu: '菜单',
      icon: '图标',
      menuFlag: '类型',
      sortNo: '排序',
      routeName: 'route-name(唯一)',
      metaTitle: 'meta-title',
      noCache: '无缓存',
      hiden: '隐藏',
      path: 'URL',
      iframeUrl: 'iframe的URL',
      componentName: '组件名称',
      reuseFlag: '组件复用',
      selfFlag: '是否自有',
      component: '组件',
      moduleType: '模块类型',
      authFlag: '授权方式',
      leafFlag: '类型',
      parentName: '上级目录',
      menuEname: '英语名称',
      iframeFlag: '是否为iframe',
      menuUrl: '菜单URL',
      hiddenFlag: '是否隐藏',
      noCacheFlag: '是否无缓存',
      operateCode: '操作代码',
      operateName: '操作名称',
      operateEname: '操作英文名称',
      msg: {
        bpmData: '只有菜单才有流程数据',
        authData: '只有菜单才有权限数据',
        manageBtn: '只有菜单才有按钮',
        editRoute: '只有子路由可以修改',
        addRoute: '只有菜单可以添加子路由',
        update: '只有目录和菜单可以修改',
        add: '只有目录可以添加'

      },
      btn: {
        addRoot: '添加根目录',
        sortMenu: '目录调整',
        menuCheck: '菜单检查',
        manageBtn: '按钮管理',
        addRoute: '添加子路由',
        editRoute: '修改子路由',
        authData: '权限数据',
        bpmData: '流程数据'
      }
    },
    manager: {
      name: '名称',
      account: '账号',
      code: '代码',
      usingFlag: '状态',
      password: '密码',
      failnum: '密码错误次数',
      loginTime: '上次登陆时间',
      remark: '备注'
    },
    tenant: {
      tenantInfo: '租户信息',
      name: '租户名称',
      address: '联系人地址',
      code: '代码',
      codeHash: '标识代码',
      usingFlag: '状态',
      tel: '联系人电话',
      contactor: '联系人',
      funcAuth: '功能权限',
      dataAuth: '数据权限',
      account: '登陆账号',
      failnum: '密码错误次数',
      loginTime: '上次登陆时间',
      password: '密码',
      onlineNum: '在线用户数',
      remark: '备注',
      funcTab: '功能权限',
      dataperTab: '数据权限类别',
      componentTab: '组件权限'
    },
    dataper: {
      name: '类别名称',
      code: '类别代码',
      usingFlag: '状态'
    },
    cfgComponent: {
      code: '组件编码',
      name: '组件名称',
      systemFlag: '系统',
      blockType: '区块类型',
      routerName: '菜单',
      bizCode: '业务编码',
      list: '平台组件列表'
    },
    tenantComponent: {
      compCode: '组件编码',
      name: '组件名称',
      systemFlag: '系统',
      blockType: '区块类型',
      routerName: '菜单',
      bizCode: '业务编码',
      tenantCode: '租户',
      showFlag: '是否显示'
    }
  }
}
