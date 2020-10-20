<template>
  <div>
    <el-input size='mini' v-model="moduleValue" v-if="colEnt && colEnt.authDataType == 1 && colEnt.authTypePart != 'DATE'" @change="inputChange"></el-input>

    <el-date-picker size='mini' v-model="moduleValue" type="date" :value-format="dateFormat" v-if="colEnt && colEnt.authDataType == 1 && colEnt.authTypePart == 'DATE'" @change="inputChange"></el-date-picker>

    <el-select size='mini' :multiple="multiple" v-model="moduleValue" placeholder="" :clearable="true" :default-first-option="false" v-if="colEnt && colEnt.authDataType == 3" @change="selectChange">
      <el-option v-for="item in selectData" :key="item.datadictItemVal" :label="item.datadictItemName" :value="item.datadictItemVal">
      </el-option>
    </el-select>

    <el-select size='mini' :multiple="multiple" v-model="moduleValue" placeholder="" :clearable="true" :default-first-option="false" v-if="colEnt && colEnt.authDataType == 2 && colEnt.authTypePart != 'FUNC_ORG' && colEnt.authTypePart != 'FUNC_DEPT' && colEnt.authTypePart != 'FUNC_EMPLOYEE'" @change="selectChange">
      <el-option v-for="item in selectData" :key="item.id" :label="item.name" :value="item.id">
      </el-option>
    </el-select>

    <tree-org size='mini' :multiple="multiple" :flat="true" :strictly='true' :jurisdiction="true" :clickParent='true' valueConsistsOf="ALL_WITH_INDETERMINATE" placeholder="" v-model="moduleValue" v-if="colEnt && colEnt.authDataType == 2 && colEnt.authTypePart == 'FUNC_ORG'" @selectChange="treeSelectChange">
    </tree-org>

    <tree-dept size='mini' :multiple="multiple" :flat="true" :strictly='true' :jurisdiction="true" :clickParent='true' valueConsistsOf="ALL_WITH_INDETERMINATE" placeholder="" v-model="moduleValue" v-if="colEnt && colEnt.authDataType == 2 && colEnt.authTypePart == 'FUNC_DEPT'" @selectChange="treeSelectChange">
    </tree-dept>

    <tree-employee size='mini' :multiple="multiple" :flat="true" :strictly='true' :jurisdiction="true" :clickParent="false" valueConsistsOf="LEAF_PRIORITY" placeholder="" v-model="moduleValue" v-if="colEnt && colEnt.authDataType == 2 && colEnt.authTypePart == 'FUNC_EMPLOYEE'" @selectChange="treeSelectChange">
    </tree-employee>
  </div>
</template>

<script>
// func/role
import treeOrg from '@/views/frame/base/organ/components/TreeOrg.vue'
import treeDept from '@/views/frame/base/organ/components/TreeDept.vue'
import treeEmployee from '@/views/frame/base/organ/components/TreeEmployee.vue'
import dictApi from '@/api/frame/base/sys/dict'
import { listSelectData } from '@/api/frame/base/sys/data'

export default {
  name: 'dataValue',
  components: {
    treeOrg,
    treeDept,
    treeEmployee
  },
  model: {
    prop: 'postData',
    event: 'postData'
  },
  props: {
    colEnt: Object,
    multiple: Boolean,
    postData: String | Array,
    rowIndex: Number
  },
  watch: {
    postData(newVal) {
      this.moduleValue = newVal
    },
    multiple() {
      if (this.multiple) {
        this.moduleValue = []
      } else {
        this.moduleValue = ''
      }
    },
    colEnt() {
      if (this.colEnt && this.colEnt.authDataType === '3' && this.colEnt.authTypePart) {
        this.getDictItem(this.colEnt.authTypePart)
      } else if (this.colEnt && this.colEnt.authDataType === '2' && this.colEnt.authTypePart !== 'ORGAN' && this.colEnt.authTypePart !== 'DEPT' && this.colEnt.authTypePart !== 'STAFF') {
        this.getBaseItem(this.colEnt.authTypePart)
      }
    }
  },
  data() {
    return {
      moduleValue: this.postData,
      dateFormat: 'yyyyMMdd',
      selectData: [],
      nameInfo: [],
      func: {
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.view')
      }
    }
  },
  methods: {
    getDictItem(dictCategoryId) {
      dictApi.dictItem(dictCategoryId, this.func).then(response => {
        this.selectData = response.data
        response.data.forEach(element => {
          this.nameInfo[element.datadictItemVal] = element.datadictItemName
        })
      })
    },
    getBaseItem(type) {
      listSelectData({
        data: {
          type: type,
          queryParams: {}
        },
        funcModule: this.$t('route.' + this.$route.meta.title),
        funcOperation: this.$t('biz.btn.search')
      }).then(response => {
        this.selectData = response.data
        response.data.forEach(element => {
          this.nameInfo[element.code] = element.name
        })
      })
    },
    selectChange(value) {
      var name = ''
      var valueArray = []
      if (typeof value === 'object') {
        valueArray = value
      } else {
        valueArray.push(value)
      }

      valueArray.forEach(element => {
        name += this.nameInfo[element] + ','
      })

      this.$emit('change', this.rowIndex, value, name.substring(0, name.length - 1))
    },
    treeSelectChange(node) {
      var name = ''

      if (Array.isArray(node)) {
        var valueArray = []

        node.forEach(element => {
          valueArray.push(element.code)
          name += element.name + ','
        })
        this.$emit('change', this.rowIndex, valueArray, name.substring(0, name.length - 1))
      } else {
        this.$emit('change', this.rowIndex, node.code, node.name)
      }
    },
    inputChange(value) {
      this.$emit('change', this.rowIndex, value, value)
    }
  }
}
</script>
