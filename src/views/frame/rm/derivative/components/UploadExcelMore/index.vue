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
    validate: Function, // eslint-disable-line
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
        results: null
      }
    }
  },
  methods: {
    generateData({ header1, results1, header2, results2, header3, results3 }) {
      this.excelData.header1 = header1
      this.excelData.results1 = results1
      this.excelData.header2 = header2
      this.excelData.results2 = results2
      this.excelData.header3 = header3
      this.excelData.results3 = results3
      this.onSuccess && this.onSuccess(this.excelData)
    },

    handleUpload() {
      if (this.validate && !this.validate()) return
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

          const firstSheetName = workbook.SheetNames[0]
          const worksheet1 = workbook.Sheets[firstSheetName]
          const header1 = this.getHeaderRow(worksheet1)
          const results1 = XLSX.utils.sheet_to_json(worksheet1, {})

          var header2 = []
          var results2 = []
          var header3 = []
          var results3 = []

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

          this.generateData({
            header1,
            results1,
            header2,
            results2,
            header3,
            results3
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
