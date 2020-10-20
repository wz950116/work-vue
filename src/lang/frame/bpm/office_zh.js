export default {
  office: {
    msg: {
      noRowSelectedAuditUser: '请选择下一环节审批人',
      noTaskId: '任务ID传参为空',
      noProcessEnable: '该模块审批流未启用，无需提交审核',
      noModuleCode: '模块代码传参为空',
      noBpmProcessDefineKey: '流程定义key传参为空'
    },
    remind: {
      title: {
        time: '时间',
        messageType: '消息类型',
        state: '状态',
        source: '消息来源'
      },
      tableName: {
        time: '时间',
        state: '状态',
        messageType: '消息类型',
        messageSource: '消息来源',
        messageContent: '消息内容'
      }
    },
    todo: {
      title: {},
      tableName: {
        time: '时间',
        businessName: '业务名称',
        pendingContent: '待办内容',
        todoThat: '待办说明',
        operation: '操作',
        submitter: '提交人',
        assistResult: '协助意见',
        assistMsg: '协助说明',
        haveTodoContent: '已办内容',
        haveTodoThat: '已办说明',
        receiveThat: '领取说明'
      }
    },
    handle: {
      title: {
        time: '提交时间',
        bill: '审核单据',
        businessName: '业务名称',
        submitter: '提交人',
        opinion: '审核意见',
        auditInformation: '审核信息'
      },
      tabs: {
        auditRecord: '审核记录'
      },
      tableName: {
        lock: '锁定',
        auditTime: '审核时间',
        auditLink: '审核环节',
        auditor: '审核人',
        auditStatus: '审核状态',
        auditOpinion: '审核意见',
        auditorOrApprover: '提交人_审批人',
        submitApprove: '提交审批'
      },
      children: {
        assistAudit: '协助审核',
        selectAuditor: '选择审核人',
        confirmSubmitAudit: '确认提交审核',
        assistant: '协助人',
        assistanceDescription: '协助说明',
        auditOperation1: '第二步审核1',
        auditOperation2: '第二步审核2'
      }
    },
    auditSteps: {
      title: {
        stepsName: '第',
        auditName: '步审核'
      }
    },
    todoDatas: {
      startDate: '待办开始时间',
      endDate: '待办结束时间'
    },
    userSendsDt: {
      startDate: '消息开始时间',
      endDate: '消息结束时间'
    }
  }
}
