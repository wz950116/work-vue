import toolUtil from '@/utils/frame/base/toolUtil.js'
const collectionUtil = {
  /**
   * @method Map的keySet方法
   * @param {Map | Object} map
   * @returns {Array} 键
   */
  mapKeys(map) {
    if (map === null || map === undefined) {
      return []
    }
    if (map instanceof Map) {
      const keys = []
      for (const key of map.keys()) {
        keys.push(key)
      }
      return keys
    } else {
      return Object.keys(map)
    }
  },
  /**
   * @method Map的values方法
   * @param {Map | Object} map
   * @returns {Array} 值
   */
  mapValues(map) {
    if (map === null || map === undefined) {
      return []
    }
    if (map instanceof Map) {
      const vals = []
      for (const key of map.values()) {
        vals.push(key)
      }
      return vals
    } else {
      return Object.values(map)
    }
  },
  /**
   * @method Map的get方法
   * @param {Map | Object} map Map或Object对象
   * @param {String | Object} key 键
   * @returns {Object} 值
   */
  mapGet(map, key) {
    if (map === null || map === undefined) {
      return null
    }
    const val = map instanceof Map ? map.get(key) : map[key]
    return val === undefined ? null : val
  },
  /**
   * @method Map的put方法
   * @param {Map | Object} map Map或Object对象
   * @param {String | Object} key 键
   * @param {Object} val 值
   * @returns 无
   */
  mapSet(map, key, val) {
    if (map === null || map === undefined) {
      return
    }
    if (key === undefined) {
      key = null
    }
    if (val === undefined) {
      val = null
    }
    if (map instanceof Map) {
      map.set(key, val)
    } else {
      map[key] = val
    }
  },
  /**
   * @method list转Map
   * @param {Array<Map | Object>} list Array对象
   * @param {String | Function | Object} keyField 键属性
   * @param {String | Function | Object} valField 值属性(可选)
   * @returns {Map<String, Object>} Map
   */
  listToMap(list, keyField, valField) {
    const map = new Map()
    if (list === null || list === undefined) {
      return map
    }
    for (const row of list) {
      let key = null
      if (keyField instanceof Function) {
        key = keyField(row)
      } else {
        key = this.mapGet(row, keyField)
      }
      let val = row
      if (valField !== null && valField !== undefined) {
        if (valField instanceof Function) {
          val = valField(row)
        } else {
          val = this.mapGet(row, valField)
        }
      }
      if (key === undefined) {
        key = null
      }
      if (val === undefined) {
        val = null
      }
      map.set(key, val)
    }
    return map
  },
  /**
   * @method list转Map
   * @param {Array<Map | Object>} list Array对象
   * @param {String | Function | Object} keyField 键属性
   * @param {String | Function | Object} valField 值属性(可选)
   * @returns {Map<String, List<Object>} Map
   */
  listToMapList(list, keyField, valField) {
    const map = new Map()
    if (list === null || list === undefined) {
      return map
    }
    for (const row of list) {
      let key = null
      if (keyField instanceof Function) {
        key = keyField(row)
      } else {
        key = this.mapGet(row, keyField)
      }
      let val = row
      if (valField !== null && valField !== undefined) {
        if (valField instanceof Function) {
          val = valField(row)
        } else {
          val = this.mapGet(row, valField)
        }
      }
      if (key === undefined) {
        key = null
      }
      if (val === undefined) {
        val = null
      }

      let valList = map.get(key)
      if (valList === null || valList === undefined) {
        valList = []
        map.set(key, valList)
      }
      valList.push(val)
    }
    return map
  },
  /**
   * @method list转Map
   * @param {Array<Map | Object>} list Array对象
   * @param {String | Function | Object} keyField 键属性
   * @param {String | Function | Object} valField 值属性
   * @param {Function} reducer 合计方法(可选, 默认相加)
   * @returns {Map<String, Number} Map
   */
  listToMapReduce(list, keyField, valField, reducer) {
    const map = new Map()
    if (list === null || list === undefined) {
      return map
    }
    if (reducer === null || reducer === undefined) {
      reducer = (num1, num2) => {
        num1 = toolUtil.toNum(num1)
        num2 = toolUtil.toNum(num2)
        if (num1 === null && num2 === null) {
          return null
        } else {
          return num1 + num2
        }
      }
    }
    for (const row of list) {
      let key = null
      if (keyField instanceof Function) {
        key = keyField(row)
      } else {
        key = this.mapGet(row, keyField)
      }
      let val = row
      if (valField !== null && valField !== undefined) {
        if (valField instanceof Function) {
          val = valField(row)
        } else {
          val = this.mapGet(row, valField)
        }
      }
      if (key === undefined) {
        key = null
      }
      if (val === undefined) {
        val = null
      }
      let oldVal = map.get(key)
      if (oldVal === undefined) {
        oldVal = null
      }
      const newVal = reducer(oldVal, val)
      map.set(key, newVal)
    }
    return map
  },
  listFieldList(list, field) {
    const retVal = []
    if (list === null || list === undefined) {
      return retVal
    }
    for (const row of list) {
      let val = null
      if (field instanceof Function) {
        val = field(row)
      } else {
        val = this.mapGet(row, field)
      }
      retVal.push(val)
    }
    return retVal
  },
  listFieldSet(list, field) {
    const retVal = []
    if (list === null || list === undefined) {
      return retVal
    }
    for (const row of list) {
      let val = null
      if (field instanceof Function) {
        val = field(row)
      } else {
        val = this.mapGet(row, field)
      }
      if (val === undefined) {
        val = null
      }
      if (!retVal.includes(val)) {
        retVal.push(val)
      }
    }
    return retVal
  },
  listFieldReduce(list, field, reducer) {
    if (list === null || list === undefined) {
      return null
    }
    if (reducer === null || reducer === undefined) {
      reducer = (num1, num2) => {
        num1 = toolUtil.toNum(num1)
        num2 = toolUtil.toNum(num2)
        if (num1 === null && num2 === null) {
          return null
        } else {
          return num1 + num2
        }
      }
    }
    let retVal = null
    for (const row of list) {
      let val = null
      if (field instanceof Function) {
        val = field(row)
      } else {
        val = this.mapGet(row, field)
      }
      if (val === undefined) {
        val = null
      }
      retVal = reducer(retVal, val)
    }
    return retVal
  },
  /**
   * 是否为空
   * @param {Array} list 集合/数组
   */
  isEmpty(list) {
    return list === undefined || list === null || list.length < 1
  },
  /**
   * 是否非空
   * @param {Array} list 集合/数组
   */
  isNotEmpty(list) {
    return !this.isEmpty(list)
  }
}

export default collectionUtil
