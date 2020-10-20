export default {
  sys: {
    corpImg: {
      tenantName: '租户',
      imageName: '图片名称',
      showSite: '位置',
      siteSize: '图片尺寸',
      imagePath: '图片',
      auditComment: '审批意见'
    },
    flow: {
      flowType: '引导类型',
      startBillType: '起始单据',
      sysFlowNodes: '业务结点信息',
      name: '名称',
      code: '代码',
      psType: '购销类型',
      contractType: '合同类型',
      tradeType: '贸易类型',
      settleStyle: '结算方式',
      bizCode: '业务功能',
      dispOrder: '顺序',
      msgFlag: '发送消息',
      bizEmployeeCodes: '业务员',
      routeName: '跳转页面'
    },

    notice: {
      form: {
        noticeTitle: '标题',
        noticeDate: '日期',
        noticeContent: '内容',
        topFlag: '置顶'
      },
      list: {
        noticeTitle: '标题',
        noticeDate: '日期',
        topFlag: '置顶'
      }
    },
    log: {
      ipAddress: 'IP',
      bizModel: '功能模块',
      bizTitle: '业务功能',
      param: '参数',
      apiUrl: 'URL',
      onlyViewException: '只查看异常',
      success: '成功',
      fail: '失败',
      account: '账户',
      organ: '所属机构',
      staff: '登陆人',
      billType: '单据类型',
      billNo: '单据号',
      memo: '登陆详细',
      requestParam: '参数',
      exception: '异常',
      errorMessage: '错误信息',
      excelName: '系统日志',
      inputParameter: '输入参数',
      loginTime: '登陆时间',
      operationTime: '操作时间',
      requestTime: '请求时间',
      bizData: '业务数据',
      executeTime: '执行时间',
      outline: '简要说明',
      operation: '操作处理',
      operationDetail: '操作详情',
      dataDetail: '操作详情',
      tenantName: '租户',
      identity: '身份',
      vueUrl: 'URL',
      vueErrMessage: '错误信息',
      vmNode: 'vue对象',
      vueInfo: 'vue错误信息',
      tenantCode: '租户信息',
      loginType: '登陆方式',
      errorDate: '错误时间',
      msg: {
        noException: '没有异常信息'
      }
    },
    api: {
      apiUrl: 'URL',
      description: '描述',
      apiInfo: 'API信息'
    },
    user: {
      userInfo: '用户信息',
      account: '账号',
      userName: '用户名称',
      password: '用户密码',
      userLevel: '用户级别',
      userStat: '用户状态',
      userNameNotBlank: '请输入用户名称',
      accountNotBlank: '请输入账号',
      passwordNotBlank: '请输入密码',
      resetPwd: '重置密码',
      oldPwd: '原密码',
      newPwd: '新密码',
      newPwdConfirm: '确认新密码',
      mismatchPwd: '两次密码不一致',
      chooseUser: '请选择用户',
      userNameSizeTip: '用户名称长度不大于128位',
      accountSizeTip: '账号代码长度不大于32位',
      excelName: '用户'
    },
    delegate: {
      funcName: '授权功能',
      switchUser: '切换用户',
      funcDetail: '功能明细',
      grant: '转授',
      revoke: '收回'
    },
    task: {
      taskStatus: '任务状态',
      beanName: 'bean名称',
      methodName: '方法名称',
      taskGroup: '任务分组',
      taskType: '任务类型',
      logFlag: '是否收集日志',
      params: '参数',
      cronExpression: 'cron表达式',
      remark: '描述信息',
      nomal: '正常',
      pause: '暂停',
      resume: '启动',
      execute: '执行一次',
      dialogName: '任务维护',
      onceJobSuccess: '立即运行一次成功',
      onceJobError: '立即运行一次失败',
      pauseSuccess: '暂停成功',
      pauseError: '暂停失败',
      resumeSuccess: '启动成功',
      resumeError: '启动失败',
      excelName: '系统任务',
      beanNameNotBlank: '请输入Bean名称',
      methodNameNotBlank: '请输入方法名称',
      taskGroupNotBlank: '请输入任务分组',
      cronExpressionNotBlank: '请输入cron表达式',
      beanNameSizeTip: 'Bean名称长度不大于200位',
      methodNameSizeTip: '方法名称长度不大于200位',
      taskGroupSizeTip: '任务分组长度不大于100位',
      cronExpressionSizeTip: 'cron表达式长度不大于100位',
      remarkSizeTip: '描述长度不大于500位'
    },
    job: {
      taskStatus: '任务状态',
      jobName: '任务名称',
      jobGroup: '任务分组',
      jobType: '任务类型',
      params: '参数',
      cronExpression: 'cron表达式',
      remark: '描述信息',
      nomal: '正常',
      pause: '暂停',
      resume: '启动',
      execute: '执行一次',
      dialogName: '任务维护',
      onceJobSuccess: '立即运行一次成功',
      onceJobError: '立即运行一次失败',
      pauseSuccess: '暂停成功',
      pauseError: '暂停失败',
      resumeSuccess: '启动成功',
      resumeError: '启动失败',
      excelName: '系统任务',
      jobNameBlank: '请输入任务名称',
      jobGroupNotBlank: '请输入任务分组',
      cronExpressionNotBlank: '请输入cron表达式',
      jobNameSizeTip: '任务名称长度不大于200位',
      jobGroupSizeTip: '任务分组长度不大于100位',
      cronExpressionSizeTip: 'cron表达式长度不大于100位',
      remarkSizeTip: '描述长度不大于500位'
    },
    parameter: {
      title: '系统参数',
      parameterCode: '参数代码',
      parameterName: '参数名称',
      parameterAttr: '参数属性',
      parameterType: '数据类型',
      parameterValue: '参数值'
    },
    fileType: {
      typeName: '类型名称',
      fileType: '类型标识',
      moduleCode: '功能代码',
      required: '是否必须'
    },
    goodsCol: {
      columnName: '名称',
      columnDatatype: '数据类型',
      columnTxt: '显示中文名称',
      columnTxtEn: '显示英文名称',
      columnSumflag: '汇总库存',
      columnFormat: '数据显示格式',
      columnWidth: '显示宽度',
      orderNum: '显示顺序',
      proType: '属性组'
    },
    dict: {
      dictBiz: '业务类型',
      dictCode: '代码',
      dictName: '名称',
      snowName: '展示名称',
      showFlag: '展示状态',
      dictType: '数据属性',
      usingFlag: '状态',
      editTitle: '数据项 ',
      dictItem: {
        dictItemShowName: '显示名称',
        dictItemName: '数据项名称',
        dictItemVal: '数据项值',
        showFlag: '显示',
        defaultShowFlag: '默认显示',
        dispOrder: '排序'
      },
      msg: {
        noDatail: '没有明细数据',
        dictItemCodeRepeat: '数据项代码不可重复'
      }
    },
    bill: {
      dialogPart1: '主信息',
      dialogPart2: '发号规则',
      moduleCode: '功能代码',
      numLength: '流水号长度',
      remark: '备注信息',
      numMode: '生成模式',
      numDescribe: '规则描述',
      numMark: '标识符',
      name: '名称',
      part01Type: '规则01',
      part02Type: '规则02',
      part03Type: '规则03',
      part04Type: '规则04',
      part05Type: '规则05',
      part06Type: '规则06',
      part07Type: '规则07',
      part08Type: '规则08',
      part09Type: '规则09',
      part10Type: '规则10'
    },
    billPrint: {
      form: {
        moduleCode: '功能代码',
        printJsppath: '模板路径',
        printName: '名称',
        remark: '备注',
        printDefault: '是否默认'
      },
      tab: {},
      group: {},
      list: {
        moduleCode: '功能代码',
        printJsppath: '模板路径',
        printName: '名称',
        remark: '备注',
        printDefault: '是否默认'
      }
    },
    bpmSet: {
      form: {
        businessDesp: '流程说明',
        oldProcessVersion: '原流程版本',
        moduleCode: '所属单据',
        processDefineKey: '单据流程Key',
        oldModuleCode: '原单据类型',
        enableFlg: '状态',
        businessName: '审核名称',
        processVersion: '当前流程',
        modeType: '操作模式',
        id: 'id',
        oldModelId: '原模型ID',
        businessType: '流程类型',
        processId: '流程id',
        processName: '流程名称',
        processDescription: '流程说明',
        formBelongType: '表单所属类型',
        parentFormCode: '父表单',
        formCode: '表单code',
        formName: '表单名称',
        dataType: '数据类型',
        fieldInputType: '字段录入类型',
        fieldAttrJson: '字段属性json',
        fieldAttrJsonExplainLabel: 'json说明',
        fieldAttrJsonExplainValue: '数据字典示例：{"filterable":true,"clearable":true,"datadict":"bpmType"}\n基础档案示例：{"filterable":true,"clearable":true,"data":"FUNC_DEPT"}',
        baseInfo: '基本信息',
        priority: '优先顺位',
        groupName: '组别',
        sortNum: '排序',
        remark: '备注',
        conditionDimension: '数据项',
        relOperator: '条件',
        conditionValue: '数据值',
        bpmType: '审批类型'
      },
      tableTitle: {
        docForm: {
          formBelongType: '表单所属类型',
          code: '表单code',
          name: '表单名称',
          dataType: '数据类型',
          fieldInputType: '字段录入类型',
          fieldAttrJson: '字段属性json',
          sortNum: '排序',
          remark: '备注'
        },
        processSet: {
          processId: '流程id',
          processName: '流程名称',
          processDescription: '流程说明'
        },
        formRel: {
          formName: '表单名称',
          docFormName: '单据表单名称',
          formType: '表单类型',
          requiredFlag: '是否必填',
          sortNum: '排序',
          remark: '备注'
        },
        processCondition: {
          conditionDimension: '数据项',
          relOperator: '条件',
          conditionValue: '数据值'
        }
      },
      tab: {
        tabApprove: '审核流程',
        tabEmployee: '审核结果推送业务员',
        tabDocFormRel: '表单项对应关系',
        tabProcessSet: '钉钉审核配置',
        tabDocFormPreview: '单据表单项一览',
        tabProcessConditionSet: '流程条件'
      },
      approvalFormSelect: {
        titleName: '审批单选择',
        form: {
          processInstTitle: '审批标题',
          processInstType: '审批类型',
          processInstCreater: '发起人',
          processInstCreateTime: '发起时间',
          startWithCtFlag: '由系统发起'
        },
        col: {
          processInstTitle: '审批标题',
          processInstType: '审批类型',
          processInstCreater: '发起人',
          createrMobile: '发起人手机号',
          processInstCreateTime: '发起审批时间',
          billName: '单据类型',
          billNo: '单据号',
          processInstFinishTime: '完成审批时间',
          dingAuditResult: '审批结果'
        }
      },
      group: {
        detailPart1: '主信息'
      },
      list: {
        enableFlg: '状态',
        businessDesp: '流程说明',
        processDesp: '流程说明',
        businessName: '审核名称',
        processVersion: '流程版本',
        deployTime: '发布时间'
      }
    }
  }
}
