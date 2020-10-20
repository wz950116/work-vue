export default {
  func: {
    org: {
      treeName: '组织机构',
      organCode: '机构代码',
      organName: '机构名称',
      organInfo: '机构信息',
      parentId: '上级机构',
      organNature: '机构性质',
      organAbbr: '机构简称',
      organFullName: '机构全称',
      parentName: '上级机构',
      title: '抬头',
      address: '地址',
      phone: '电话',
      fax: '传真',
      legalRepresentative: '法人代表',
      principal: '负责人',
      taxNumber: '税号',
      usingFlag: '状态',
      organ: '机构',
      zipCode: '邮编',
      isUsing: '启用机构无法删除'
    },
    api: {
      title: '接口选择',
      apiUrl: 'URL',
      apiCode: '权限代码',
      apiMemo: '接口说明'

    },
    dept: {
      banner: '部门管理',
      deptInfo: '部门信息',
      addDept: '创建部门',
      updateDept: '更新部门',
      viewDept: '查看部门',
      deptCode: '部门代码',
      deptName: '部门名称',
      organId: '所属机构',
      parentId: '上级部门',
      businessNature: '业务性质',
      usingFlag: '状态',
      organName: '所属机构',
      parentName: '上级部门',
      principal: '负责人',
      phone: '电话',
      fax: '传真',
      leader: '分管领导',
      department: '部门'
    },
    employee: {
      warnTitle: '员工数据设置',
      staff: '员工',
      banner: '员工管理',
      staffCode: '员工编码',
      staffName: '姓名',
      organId: '所属机构',
      deptId: '所属部门',
      gender: '性别',
      type: '类别',
      post: '职务',
      title: '职称',
      usingFlag: '状态',
      birthday: '生日',
      organName: '所属机构',
      deptName: '所属部门',
      entryDate: '入职日期',
      education: '学历',
      politicalStatus: '政治面貌',
      maritalStat: '婚姻',
      profession: '专业',
      birthplace: '籍贯',
      nationality: '民族',
      address: '住址',
      mail: '邮箱',
      phone: '电话',
      noAccount: '选中数据没有填写账号信息，无法进行密码重置操作',
      belongFunction: '所属职能',
      functionName: '职能名称',
      isUsing: '启用员工无法删除',
      pattern: {
        account: '账号只能由英文字母及数字组成，且首字母必须为英文字母'
      }
    },
    role: {
      roleInfo: '角色信息',
      roleName: '角色名称',
      roleCode: '角色代码',
      organId: '所属机构',
      deptId: '所属部门',
      usingFlag: '状态',
      organName: '所属机构',
      deptName: '所属部门',
      remark: '职能说明',
      staffSetting: '人员配置',
      funcSetting: '功能权限配置',
      dataSetting: '数据权限配置',
      firstCategoryName: '一级分类',
      secondCategoryName: '二级分类',
      moduleName: '功能模块',
      operateNames: '操作',
      treeTitle: '树状结构',
      listTitle: '列表信息',
      module: '功能',
      operateName: '操作',
      allSelect: '全选',
      setting: '设置',
      businessData: '业务数据',
      colNames: '数据项',
      condNames: '条件约束',
      moduleId: '业务数据',
      colCode: '数据项',
      condTypeId: '条件',
      condValue: '数据值',
      copy: '复制',
      copySuccess: '复制成功',
      businessSetting: '所属业务配置',
      noVersion: '未发布',
      processVersion: '版本',
      businessName: '业务名称',
      enableFlg: '状态',
      businessDesp: '业务说明',
      authDirection: '控制方向',
      authLimit: '限制设置',
      authExtend: '扩展设置',
      tab: {
        treeName: '组织机构',
        user: '操作员',
        func: '功能权限',
        org: '机构权限',
        dept: '部门权限',
        employee: '员工权限',
        menuData: '菜单数据权限',
        apiData: '接口权限'
      },
      notBlank: {
        functionName: '职能名称不能为空',
        organId: '所属机构不能为空',
        usingFlag: '状态不能为空'
      },
      maxLength: {
        functionName: '职能名称最大长度不能超过128',
        remark: '职能说明最大长度不能超过500'
      }
    },
    user: {
      userInfo: '角色信息',
      name: '昵称',
      account: '系统账号',
      password: '系统密码',
      failnum: '密码错误次数',
      loginTime: '上次登陆时间',
      orgName: '机构名称',
      orgUsingFlag: '机构状态',
      deptUsingFlag: '部门状态',
      employeeUsingFlag: '员工状态',
      deptName: '部门名称',
      employeeName: '员工名称',
      identity: '操作员身份',
      resetPassword: '重置密码',
      resetSuccess: '密码重置成功',
      resetInfoP1: '确认重置',
      resetInfoP2: '的系统密码为默认密码123456吗',
      userValidPeriodFlag: '用户始终有效',
      userValidPeriodDate: '用户有效期',
      passwdValidPeriodFlag: '密码始终有效',
      passwdValidPeriodDay: '密码有效期'
    },
    orgFunc: {
      funcTab: '功能权限'
    },
    approvalGroup: {
      groupSet: '审批组设置',
      form: {
        code: '审批组代码',
        name: '审批组名称',
        remark: '备注信息',
        usingFlag: '状态',
        groupCode: '审批组代码'
      },
      tab: {
        tabEmployee: '审批组员'
      },
      popup: {
        editEmployee: '编辑组员',
        edit: '编辑',
        tabEmployee: '编辑',
        index: '一览'
      },
      group: {
        editEmployeePart1: '主信息'
      },
      list: {
        code: '审批组代码',
        name: '审批组名称',
        remark: '备注信息',
        usingFlag: '状态',
        employeeCode: '员工',
        employeeName: '员工'
      }
    }
  }
}
