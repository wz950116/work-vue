<template>
  <el-button :loading="loading" size="mini" @click="handleUpload">
    <i class='el-icon-upload'></i>{{ btnName }}
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick" />
  </el-button>
</template>

<script>
import XLSX from 'xlsx'

export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function, // eslint-disable-line,
    btnName: {
      type: String,
      default() {
        return this.$t('biz.btn.upload')
      }
    }
  },
  data() {
    return {
      loading: false,
      excelData: {
        header: null,
        results: null,
        fileSheetName: null
      }
    }
  },
  methods: {
    generateData(data) {
      this.excelData.header1 = data.header1
      this.excelData.results1 = data.results1
      this.excelData.header2 = data.header2
      this.excelData.results2 = data.results2
      this.excelData.header3 = data.header3
      this.excelData.results3 = data.results3
      this.excelData.fileSheetName = data.fileSheetName

      this.onSuccess && this.onSuccess(this.excelData)
    },

    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const fixedData = this.fixData(data)
          const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
          const fileSheetName = workbook.SheetNames[0]
          var header1 = []
          var results1 = []
          var header2 = []
          var results2 = []
          var header3 = []
          var results3 = []
          if (fileSheetName === '基本信息') {
            const firstSheetName = workbook.SheetNames[0]
            const worksheet1 = workbook.Sheets[firstSheetName]
            header1 = this.getHeaderRow(worksheet1, {})
            results1 = XLSX.utils.sheet_to_json(worksheet1, {})

            if (workbook.SheetNames[1]) {
              const secondSheetName = workbook.SheetNames[1]
              const worksheet2 = workbook.Sheets[secondSheetName]
              var fromto2 = []
              fromto2 = worksheet2['!ref'].split(':')
              worksheet2['!ref'] = 'A2:' + fromto2[1]
              header2 = this.getHeaderRow(worksheet2, {})
              results2 = XLSX.utils.sheet_to_json(worksheet2, {})
            }

            if (workbook.SheetNames[2]) {
              const thirstSheetName = workbook.SheetNames[2]
              const worksheet3 = workbook.Sheets[thirstSheetName]
              var fromto3 = []
              fromto3 = worksheet3['!ref'].split(':')
              worksheet3['!ref'] = 'A2:' + fromto3[1]
              header3 = this.getHeaderRow(worksheet3, {})
              results3 = XLSX.utils.sheet_to_json(worksheet3, {})
            }
          } else if (fileSheetName === '客户交易结算日报') {
            if (workbook.SheetNames[0]) {
              const firstSheetName = workbook.SheetNames[0]
              const worksheet1 = workbook.Sheets[firstSheetName]
              const worksheet3 = worksheet1
              let ref3 = ''
              let ref32 = ''
              for (const key in worksheet1) {
                if (worksheet1[key].v === '期货持仓汇总') {
                  ref3 = key.slice(0, 1) + (Number(key.slice(1)) + 1).toString()
                }
                if (worksheet1[key].v === '交割明细') {
                  ref32 = (Number(key.slice(1)) - 3).toString()
                }
              }
              fromto3 = worksheet1['!ref'].split(':')
              fromto3 = fromto3[1].slice(0, 1) + ref32
              worksheet1['!ref'] = 'A4:H18'
              header1 = this.getHeaderRow(worksheet1, {})
              results1 = XLSX.utils.sheet_to_json(worksheet1, {})
              worksheet3['!ref'] = ref3 + ':' + fromto3

              header3 = this.getHeaderRow(worksheet3, {})
              results3 = XLSX.utils.sheet_to_json(worksheet3, {})
            }
            if (workbook.SheetNames[2]) {
              const secondSheetName = workbook.SheetNames[2]
              const worksheet2 = workbook.Sheets[secondSheetName]
              let ref2 = ''
              for (const key in worksheet2) {
                if (worksheet2[key].v === '成交明细') {
                  ref2 = key.slice(0, 1) + (Number(key.slice(1)) + 1).toString()
                }
              }
              fromto2 = worksheet2['!ref'].split(':')
              fromto2 =
                fromto2[1].slice(0, 1) +
                (Number(fromto2[1].slice(1)) - 1).toString()
              worksheet2['!ref'] = ref2 + ':' + fromto2
              header2 = this.getHeaderRow(worksheet2, {})
              results2 = XLSX.utils.sheet_to_json(worksheet2, {})
            }
          }
          this.generateData({
            header1,
            results1,
            header2,
            results2,
            header3,
            results3,
            fileSheetName
          })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    fixData(data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) {
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        )
      }
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}
</style>
