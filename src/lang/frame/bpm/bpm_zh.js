export default {
  pdlist: {
    title: '流程信息',
    key: '流程标识',
    name: '流程名称',
    description: '流程描述',
    category: '流程分类',
    version: '版本',
    id: '序号',
    search: '查询',
    suspended: '是否挂起',
    startProcess: '启动流程',
    excelName: '流程列表',
    dialogTitle: '启动流程',
    route: '流程:',
    taskName: '任务名称',
    candidateGroup: '审批用户组',
    dialogKey: 'KEY',
    dialogName: '名称',
    dialogValue: '值',
    startSuccess: '启动成功',
    requeired: '不能为空',
    longReg: '必须为整数',
    doubleMsg: '必须为小数',
    dateMsg: '日期格式不正确',
    rule: '输入不正确',
    lengthRule: '输入长度不能超过500'
  },
  modellist: {
    title: '流程信息',
    key: '模型标识',
    name: '模型名称',
    category: '模型分类',
    description: '模型描述',
    version: '版本',
    deploymentId: '部署ID',
    id: '序号',
    search: '查询',
    create: '新建流程',
    edit: '修改流程',
    delete: '删除流程',
    deploy: '部署流程',
    deployed: '是否部署',
    excelName: '流程设计',
    createDialogTitle: '新建流程信息'
  },
  deploylist: {
    title: '部署信息',
    id: '序号',
    name: '部署名称',
    category: '部署分类',
    deploymentTime: '部署时间',
    search: '查询',
    delete: '删除部署',
    excelName: '部署管理'
  },
  myprocesslist: {
    title: '流程信息',
    id: '流程ID',
    processDefinitionKey: '流程编号',
    businessKey: '业务标识',
    processDefinitionId: '流程定义ID',
    processDefinitionName: '流程名称',
    suspended: '是否挂起',
    // startTime: '开始时间',
    // endTime: '结束时间',
    search: '查询',
    showPic: '显示流程图',
    yes: '是',
    no: '否',
    excelName: '我的流程'
  },
  myhisprocesslist: {
    title: '历史流程信息',
    id: '流程实例ID',
    processDefinitionKey: '流程编号',
    processDefinitionName: '流程名称',
    processDefinitionVersion: '流程版本号',
    businessKey: '业务标识',
    processDefinitionId: '流程定义ID',
    startTime: '开始时间',
    endTime: '结束时间',
    search: '查询',
    excelName: '历史流程'
  },
  tasklist: {
    title: '任务信息',
    id: '任务ID',
    taskDefinitionKey: '任务标识',
    processDefinitionName: '流程名称',
    name: '任务名称',
    startUserId: '发起人',
    businessName: '单据类型',
    description: '任务描述',
    assignee: '分配用户',
    owner: '原属用户',
    priority: '优先级',
    createTime: '创建时间',
    search: '查询',
    taskMode: '任务模式',
    taskSelectMode1: '未认领',
    taskSelectMode2: '待处理',
    claim: '认领',
    complete: '完成',
    noClaimMsg: '不能重复认领该任务',
    noCompleteMsg: '不能操作未认领的任务',
    claimTime: '提醒时间',
    startTime: '开始时间',
    endTime: '结束时间',
    deleteReason: '删除理由',
    dialogTitle: '完成任务',
    taskName: '任务名称',
    candidateGroup: '审批用户组',
    dialogKey: 'KEY',
    dialogName: '名称',
    dialogValue: '值',
    excelName: '我的任务',
    task: '任务:'
  },
  bpm: {
    common: {
      createDate: '时间',
      changeName: '提交人'
    },
    todo: {
      form: {
        toDoDate: '时间'
      },
      tab: {},
      popup: {
        index: '待办事项'
      },
      group: {},
      list: {
        pendingDesp: '待办说明',
        pendingContent: '待办内容',
        businessName: '业务名称',
        startTime: '时间'
      }
    },
    haveTodo: {
      form: {
        toDoDate: '时间'
      },
      tab: {},
      popup: {
        index: '待办事项'
      },
      group: {},
      list: {
        pendingDesp: '已办说明',
        pendingContent: '已办内容',
        businessName: '业务名称',
        endTime: '时间'
      }
    }
  }
}
