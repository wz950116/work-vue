/**
 * fileName 文件名
 * header 列显示的名称
 * filterVal 数据源的列，与header对应一致；如果是字典码表需要用Object例如{val: 'usingFlag', dicCode:'dicCode'}
 * exportData 如果有值，按照exportData输出，否则按照方法获取数据
 * exportfunc 导出方法
 * callBackfunc 导出后的处理方法
 * @param {fileName, header, filterVal, exportData, func, funcParams} params
 */
import Vue from 'vue'
export default function (params) {
  import('@/vendor/frame/Export2Excel').then(excel => {
    if (params.exportData) {
      const data = params.exportData.map(v =>
        params.filterVal.map(j => {
          if (j instanceof Object) {
            return Vue.filter('dataDictFormat')(v[j.val], j.dicCode)
          } else if (!isNaN(Number(v[j]))) {
            return Number(v[j])
          } else {
            return v[j]
          }
        })
      )
      excel.export_json_to_excel({
        header: params.header,
        data: data,
        filename: params.fileName,
        autoWidth: true
      })
    } else {
      params
        .exportfunc()
        .then(res => {
          const summaryRow = new Array(params.filterVal.length).fill(null)
          const data = res.data.map(v =>
            params.filterVal.map((j, index) => {
              if (j.summary) {
                summaryRow[index] = summaryRow[index] ? summaryRow[index] + v[j.val] : v[j.val]
              }
              if (j instanceof Object) {
                if (typeof v[j.val] === 'string' && v[j.val].includes(',') && j.func === 'dataDictFormat') {
                  let str = ''
                  v[j.val].split(',').forEach(i => {
                    str += Vue.filter(j.func)(i, j.dicCode) + ','
                  })
                  return str.substring(0, str.length - 1)
                } else if (j.func === 'dataDictFormat') {
                  return Vue.filter(j.func)(v[j.val], j.dicCode)
                } else {
                  return v[j.val]
                }
              } else {
                return v[j]
              }
            })
          )
          data.push(summaryRow)
          excel.export_json_to_excel({
            header: params.header,
            data: data,
            filename: params.fileName,
            autoWidth: true
          })
          params.callBackfunc()
        })
        .catch(() => {
          params.callBackfunc()
        })
    }
  })
}
