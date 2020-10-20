<template>
  <div>
    <table class="marginFormulaLayout">
      <tr>
        <td colspan="3">{{ $t("data.product.marginSet.formulaScene1") }}</td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType1") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel11" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('1', '1')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType2") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel12" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('1', '2')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType3") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel13" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('1', '3')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("data.product.marginSet.formulaScene2") }}</td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType1") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel21" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('2', '1')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType2") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel22" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('2', '2')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType3") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel23" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('2', '3')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("data.product.marginSet.formulaScene3") }}</td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType1") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel21" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('3', '1')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType2") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel32" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('3', '2')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType3") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel33" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('3', '3')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td colspan="3">{{ $t("data.product.marginSet.formulaScene4") }}</td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType1") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel41" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('4', '1')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType2") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel42" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('4', '2')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
      <tr>
        <td class="marginFormulaLayoutLeft">{{ $t("data.product.marginSet.formulaType3") }}</td>
        <td>
          <input-validate size="mini" :disabled="true" :value="marginFormulaLabel43" />
        </td>
        <td class="marginFormulaLayoutRight" v-if="type==='add' || type==='update'">
          <el-button size="mini" @click="editFormual('4', '3')">{{ $t("biz.btn.edit") }}</el-button>
        </td>
      </tr>
    </table>
    <!-- 编辑弹窗 -->
    <el-dialog title="保证金公式编辑" :visible.sync="dialogParam.dialogVisible" :close-on-click-modal="false">
      <div class="marginDialogTopBar">
        <el-button v-db-click size="mini" @click="dialogParam.dialogVisible=false">
          <svg-icon icon-class="线性-取消"></svg-icon>{{ $t('biz.btn.cancel') }}
        </el-button>
        <el-button v-db-click size="mini" type="primary" @click="doOk">
          <svg-icon icon-class="线性-完结"></svg-icon>{{ $t('biz.btn.confirm') }}
        </el-button>
        <el-button v-db-click size="mini" @click="openCheckDialog">
          <svg-icon icon-class="线性-标记"></svg-icon>{{ $t('biz.btn.check') }}
        </el-button>
      </div>
      <div class="marginDialogContent">
        <div>
          <table style="width:100%;">
            <colgroup>
              <col style="width:4em" />
              <col />
            </colgroup>
            <tr>
              <td>场景</td>
              <td>
                <input-validate size="mini" :disabled="true" :value="dialogParam.formulaSceneName" />
              </td>
            </tr>
            <tr>
              <td>类型</td>
              <td>
                <input-validate size="mini" :disabled="true" :value="dialogParam.formulaTypeName" />
              </td>
            </tr>
            <tr>
              <td>公式</td>
              <td>
                <div class="el-input el-input--mini"><input type="text" class="el-input__inner" readonly v-model="marginFormulaLabelDialog" @keyup="marginDialogCalcKeyEvt" /></div>
              </td>
            </tr>
          </table>
          <div>
            <div class="marginDialogCalcGrid">
              <table>
                <colgroup>
                  <col style="width:2.5em" />
                  <col style="width:2.5em" />
                  <col style="width:2.5em" />
                  <col style="width:2.5em" />
                  <col style="width:2em" />
                  <col style="width:10em" />
                </colgroup>
                <tr>
                  <td @click="addForumalPart('+')">+</td>
                  <td @click="addForumalPart('-')">-</td>
                  <td @click="addForumalPart('*')">*</td>
                  <td @click="addForumalPart('/')">/</td>
                  <td class="marginDialogCalcGrid_blank"></td>
                  <td @click="addForumalPart('$P001')">初始化保证金率</td>

                </tr>
                <tr>
                  <td @click="addForumalPart('7')">7</td>
                  <td @click="addForumalPart('8')">8</td>
                  <td @click="addForumalPart('9')">9</td>
                  <td @click="addForumalPart('Math.max')">max</td>
                  <td class="marginDialogCalcGrid_blank"></td>
                  <td @click="addForumalPart('$P002')">监控初始价格</td>
                </tr>
                <tr>
                  <td @click="addForumalPart('4')">4</td>
                  <td @click="addForumalPart('5')">5</td>
                  <td @click="addForumalPart('6')">6</td>
                  <td @click="addForumalPart('Math.min')">min</td>
                  <td class="marginDialogCalcGrid_blank"></td>
                  <td @click="addForumalPart('$P003')">监控数量</td>
                </tr>
                <tr>
                  <td @click="addForumalPart('1')">1</td>
                  <td @click="addForumalPart('2')">2</td>
                  <td @click="addForumalPart('3')">3</td>
                  <td @click="addForumalPart(',')">,</td>

                  <td class="marginDialogCalcGrid_blank"></td>
                  <td @click="addForumalPart('$P004')">监控基准当前价格</td>
                </tr>
                <tr>
                  <td @click="addForumalPart('0')">0</td>
                  <td @click="addForumalPart('.')">.</td>
                  <td @click="addForumalPart('(')">(</td>
                  <td @click="addForumalPart(')')">)</td>
                  <td class="marginDialogCalcGrid_blank"></td>
                  <td @click="addForumalPart('$P005')">已缴金额</td>
                </tr>
                <tr>
                  <td colspan="2" @click="addForumalPart('clear')">清空</td>
                  <td colspan="2" @click="addForumalPart('back')">后退</td>
                  <td class="marginDialogCalcGrid_blank"></td>
                  <td @click="addForumalPart('$P006')">占用额度</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="dialogParam.checkDialogVisible" title="保证金公式验证" append-to-body :close-on-click-modal="false">
        <div class="marginDialogTopBar">
          <el-button v-db-click size="mini" @click="dialogParam.checkDialogVisible=false;">
            <svg-icon icon-class="线性-关闭"></svg-icon>{{ $t('biz.btn.close') }}
          </el-button>
          <el-button v-db-click size="mini" type="primary" @click="checkFormula">
            <svg-icon icon-class="线性-标记"></svg-icon>{{ $t('biz.btn.check') }}
          </el-button>
        </div>
        <div class="marginDialogContent">
          <table style="width:100%;">
            <colgroup>
              <col style="width:4em" />
              <col />
            </colgroup>
            <tr>
              <td>场景</td>
              <td>
                <input-validate size="mini" :disabled="true" :value="dialogParam.formulaSceneName" />
              </td>
            </tr>
            <tr>
              <td>类型</td>
              <td>
                <input-validate size="mini" :disabled="true" :value="dialogParam.formulaTypeName" />
              </td>
            </tr>
            <tr>
              <td>公式</td>
              <td>
                <input-validate size="mini" :disabled="true" :value="marginFormulaLabelDialog" />
              </td>
            </tr>
          </table>
          <div style="line-height:2em;">验证参数</div>
          <table>
            <colgroup>
              <col style="width:9em" />
              <col />
              <col style="width:9em" />
              <col />
              <col style="width:9em" />
              <col />
            </colgroup>
            <tr>
              <td>初始化保证金率</td>
              <td>
                <input-formatter size="mini" type="percent" v-model="dialogParam.checkParam.p001" />
              </td>
              <td>监控初始价格</td>
              <td>
                <input-formatter size="mini" type="price" v-model="dialogParam.checkParam.p002" />
              </td>
              <td>监控基准当前价格</td>
              <td>
                <input-formatter size="mini" type="price" v-model="dialogParam.checkParam.p004" />
              </td>
            </tr>
            <tr>
              <td>监控数量</td>
              <td>
                <input-formatter size="mini" type="weight" v-model="dialogParam.checkParam.p003" />
              </td>
              <td>已缴金额</td>
              <td>
                <input-formatter size="mini" type="money" v-model="dialogParam.checkParam.p005" />
              </td>
              <td>占用额度</td>
              <td>
                <input-formatter size="mini" type="money" v-model="dialogParam.checkParam.p006" />
              </td>
            </tr>
            <tr>
              <td>验证结果</td>
              <td colspan="5">
                <el-input size="mini" disabled v-model="dialogParam.checkResult" />
              </td>
            </tr>
          </table>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/frame/base/request'
import { notifyInfo } from '@/utils/frame/base/notifyParams'
export default {
  data() {
    return {
      tab: {
        table: {
          cols: []
        }
      },
      dialogParam: {
        dialogVisible: false,
        formulaSceneName: null,
        formulaTypeName: null,
        formulaSrc: [],
        formula: [],
        checkDialogVisible: false,
        checkResult: null,
        checkParam: {
          p001: null,
          p002: null,
          p003: null,
          p004: null,
          p005: null,
          p006: null
        }
      },
      formulaOptMap: {
        'Math.max': 'max',
        'Math.min': 'min',
        'Math.abs': 'abs',
        '.': '.',
        ',': ',',
        '(': '(',
        ')': ')',
        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        '0': '0',
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '?': '?',
        ':': ':',
        '%': '%',
        $P001: '初始保证金率',
        $P002: '监控初始价格',
        $P003: '监控数量',
        $P004: '监控基准当前价格',
        $P005: '已缴金额',
        $P006: '占用额度'
      },
      formulaSceneMap: {
        '1': '采购-先定价后转货权-收取、销售-先定价后转货权-支付',
        '2': '采购-先定价后转货权-支付、销售-先定价后转货权-收取',
        '3': '采购-后定价先转货权-收取、销售-后定价先转货权-支付',
        '4': '采购-后定价先转货权-支付、销售-后定价先转货权-收取'
      },
      formulaTypeMap: {
        '1': '实时保证金率',
        '2': '追缴保证金',
        '3': '退还保证金'
      },
      formula: {
        '1': { '1': [], '2': [], '3': [] },
        '2': { '1': [], '2': [], '3': [] },
        '3': { '1': [], '2': [], '3': [] },
        '4': { '1': [], '2': [], '3': [] }
      }
    }
  },
  props: {
    type: {
      type: String,
      default: 'view'
    },
    param: {
      type: [String, Object],
      default() {
        return {}
      }
    }
  },
  computed: {
    tableData() {
      const formulaScenes = ['1', '2', '3', '4']
      const formulaTypes = ['1', '2', '3']
      var retVal = []
      for (let i = 0; i < formulaScenes.length; i++) {
        for (let j = 0; j < formulaTypes.length; j++) {
          const itemCodes = this.formula[formulaScenes[i]][formulaTypes[j]]
          for (let k = 0; k < itemCodes.length; k++) {
            retVal.push({
              formulaScene: formulaScenes[i],
              formulaType: formulaTypes[j],
              itemCode: itemCodes[k]
            })
          }
        }
      }
      return retVal
    },
    marginFormulaLabelDialog() {
      return this.marginFormulaLabel(this.dialogParam.formula)
    },
    marginFormulaLabel11() {
      return this.marginFormulaLabel(this.formula['1']['1'])
    },
    marginFormulaLabel12() {
      return this.marginFormulaLabel(this.formula['1']['2'])
    },
    marginFormulaLabel13() {
      return this.marginFormulaLabel(this.formula['1']['3'])
    },
    marginFormulaLabel21() {
      return this.marginFormulaLabel(this.formula['2']['1'])
    },
    marginFormulaLabel22() {
      return this.marginFormulaLabel(this.formula['2']['2'])
    },
    marginFormulaLabel23() {
      return this.marginFormulaLabel(this.formula['2']['3'])
    },
    marginFormulaLabel31() {
      return this.marginFormulaLabel(this.formula['3']['1'])
    },
    marginFormulaLabel32() {
      return this.marginFormulaLabel(this.formula['3']['2'])
    },
    marginFormulaLabel33() {
      return this.marginFormulaLabel(this.formula['3']['3'])
    },
    marginFormulaLabel41() {
      return this.marginFormulaLabel(this.formula['4']['1'])
    },
    marginFormulaLabel42() {
      return this.marginFormulaLabel(this.formula['4']['2'])
    },
    marginFormulaLabel43() {
      return this.marginFormulaLabel(this.formula['4']['3'])
    }
  },
  mounted() {
    request({
      url: '/api/data/productMarginFml/getByProduct',
      method: 'POST',
      data: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search'),
        data: this.$parent.$route.params.productCode
      }
    }).then(response => {
      if (response.status) {
        this.formula = response.data
      }
    })
  },
  methods: {
    dialogHandler(param) {
      this.dialogDetailVisible = false
    },
    marginFormulaLabel(formulaArray) {
      let formulaText = ''
      // 元素类型: 'P':参数, 'F':函数, 'G':括号, 'N':数字, 'O':运算符
      let preFormluaItemType = 'P'
      for (let i = 0; i < formulaArray.length; i++) {
        const formulaItemCode = formulaArray[i]
        const formulaItemName = this.formulaOptMap[formulaItemCode]
        let formluaItemType = 'P'
        if (formulaItemCode.startsWith('Math.')) {
          formluaItemType = 'F'
        } else if (formulaItemCode === '(' || formulaItemCode === ')') {
          formluaItemType = 'G'
        } else if (formulaItemCode.length === 1) {
          if (formulaItemCode >= '0' && formulaItemCode <= '9') {
            formluaItemType = 'N'
          } else if (formulaItemCode === '.') {
            formluaItemType = 'N'
          } else if (formulaItemCode === '-' && (i === 0 || preFormluaItemType === 'O')) {
            formluaItemType = 'N'
          } else {
            formluaItemType = 'O'
          }
        } else {
          formluaItemType = 'P'
        }
        if (i === 0) {
          formulaText = formulaItemName
        } else if (formluaItemType === 'P' || formluaItemType === 'O' || formluaItemType === 'F') {
          formulaText = formulaText + ' ' + formulaItemName
        } else if (formluaItemType === 'G') {
          if (preFormluaItemType === 'F') {
            formulaText = formulaText + formulaItemName
          } else {
            formulaText = formulaText + ' ' + formulaItemName
          }
        } else {
          if (preFormluaItemType === 'N') {
            formulaText = formulaText + formulaItemName
          } else {
            formulaText = formulaText + ' ' + formulaItemName
          }
        }
        preFormluaItemType = formluaItemType
      }
      return formulaText
    },
    openCheckDialog() {
      this.dialogParam.checkDialogVisible = true
      this.dialogParam.checkResult = null
      // this.dialogParam.checkParam.p001 = null
      // this.dialogParam.checkParam.p002 = null
      // this.dialogParam.checkParam.p003 = null
      // this.dialogParam.checkParam.p004 = null
      // this.dialogParam.checkParam.p005 = null
      // this.dialogParam.checkParam.p006 = null
    },
    checkFormula() {
      let formulaText = ''
      // 元素类型: 'P':参数, 'F':函数, 'G':括号, 'N':数字, 'O':运算符
      let preFormluaItemType = 'P'
      for (let i = 0; i < this.dialogParam.formula.length; i++) {
        const formulaItemCode = this.dialogParam.formula[i]
        const formulaItemName = formulaItemCode
        let formluaItemType = 'P'
        if (formulaItemCode.startsWith('Math.')) {
          formluaItemType = 'F'
        } else if (formulaItemCode === '(' || formulaItemCode === ')') {
          formluaItemType = 'G'
        } else if (formulaItemCode.length === 1) {
          if (formulaItemCode >= '0' && formulaItemCode <= '9') {
            formluaItemType = 'N'
          } else if (formulaItemCode === '.') {
            formluaItemType = 'N'
          } else if (formulaItemCode === '-' && (i === 0 || preFormluaItemType === 'O')) {
            formluaItemType = 'N'
          } else {
            formluaItemType = 'O'
          }
        } else {
          formluaItemType = 'P'
        }
        if (i === 0) {
          formulaText = formulaItemName
        } else if (formluaItemType === 'P' || formluaItemType === 'O' || formluaItemType === 'F') {
          formulaText = formulaText + ' ' + formulaItemName
        } else if (formluaItemType === 'G') {
          if (preFormluaItemType === 'F') {
            formulaText = formulaText + formulaItemName
          } else {
            formulaText = formulaText + ' ' + formulaItemName
          }
        } else {
          if (preFormluaItemType === 'N') {
            formulaText = formulaText + formulaItemName
          } else {
            formulaText = formulaText + ' ' + formulaItemName
          }
        }
        preFormluaItemType = formluaItemType
      }
      try {
        let checkFormulaText = 'var $P001=parseFloat(' + this.dialogParam.checkParam.p001 + ') / 100;'
        checkFormulaText += 'var $P002=parseFloat(' + this.dialogParam.checkParam.p002 + ');'
        checkFormulaText += 'var $P003=parseFloat(' + this.dialogParam.checkParam.p003 + ');'
        checkFormulaText += 'var $P004=parseFloat(' + this.dialogParam.checkParam.p004 + ');'
        checkFormulaText += 'var $P005=parseFloat(' + this.dialogParam.checkParam.p005 + ');'
        checkFormulaText += 'var $P006=parseFloat(' + this.dialogParam.checkParam.p006 + ');'
        checkFormulaText += '\n\n' + formulaText
        this.dialogParam.checkResult = eval(checkFormulaText)
      } catch (ex) {
        this.dialogParam.checkResult = ex.toString()
      }
    },
    editFormual(formulaScene, formulaType) {
      this.dialogParam.formulaSceneName = this.formulaSceneMap[formulaScene]
      this.dialogParam.formulaTypeName = this.formulaTypeMap[formulaType]
      this.dialogParam.formulaSrc = this.formula[formulaScene][formulaType]
      this.dialogParam.formula.splice(0)
      for (let i = 0; i < this.dialogParam.formulaSrc.length; i++) {
        this.dialogParam.formula.push(this.dialogParam.formulaSrc[i])
      }
      this.dialogParam.dialogVisible = true
    },
    doOk() {
      if (this.dialogParam.formula.length === 0) {
        this.$notify(notifyInfo({ msg: '公式不可为空' }))
        return
      }
      this.dialogParam.formulaSrc.splice(0)
      for (let i = 0; i < this.dialogParam.formula.length; i++) {
        this.dialogParam.formulaSrc.push(this.dialogParam.formula[i])
      }
      this.dialogParam.dialogVisible = false
    },
    addForumalPart(part) {
      if (part === 'clear') {
        this.dialogParam.formula.splice(0)
      } else if (part === 'back') {
        this.dialogParam.formula.pop()
      } else {
        this.dialogParam.formula.push(part)
      }
    },
    marginDialogCalcKeyEvt(evt) {
      if (evt.ctrlKey) {
        switch (evt.key) {
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '6':
            this.addForumalPart('$P00' + evt.key)
            break
        }
        return
      }
      switch (evt.key) {
        case 'Backspace':
          this.addForumalPart('back')
          break
        case 'Delete':
          this.addForumalPart('clear')
          break
        case '+':
        case '-':
        case '*':
        case '/':
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '.':
        case ',':
        case '(':
        case ')':
          this.addForumalPart(evt.key)
          break
      }
    }
  }
}
</script>
<style scoped>
table.marginFormulaLayout {
  width: 100%;
}
table.marginFormulaLayout >>> td {
  height: 2em;
}
td.marginFormulaLayoutLeft {
  width: 10em;
  padding-left: 2em;
}
td.marginFormulaLayoutRight {
  width: 6em;
}
div.marginDialogTopBar {
  margin: 3px;
}
div.marginDialogContent {
  margin: 3px;
  border-style: solid;
  border-color: darkgray;
  border-width: 1px;
}
div.marginDialogCalcGrid {
  display: inline-block;
  vertical-align: top;
}
div.marginDialogCalcGrid >>> table {
  border-collapse: separate;
}
div.marginDialogCalcGrid >>> td {
  border-style: solid;
  border-color: black;
  border-width: 1px;
  height: 2.5em;
  background-color: steelblue;
  color: white;
  text-align: center;
  user-select: none;
  cursor: pointer;
  box-sizing: border-box;
  font-family: Consolas;
}
div.marginDialogCalcGrid >>> td:hover {
  background-color: cornflowerblue;
}
div.marginDialogCalcGrid >>> td.marginDialogCalcGrid_blank {
  border: none;
  background-color: transparent;
}
</style>