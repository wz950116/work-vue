import Vue from 'vue'

const drag = {
  bind(el, binding, vnode) {
    const isNative = !el.className.includes('dialog-wrapper')
    const dialogHeaderEl = isNative ? el.querySelector('.el-dialog__header') : el.querySelector('.dialog-title')
    const dragDom = isNative ? el.querySelector('.el-dialog') : el.querySelector('.dialog-container')
    dialogHeaderEl.style.cssText += ';cursor:move;'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const getStyle = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    const clearBoxPercent = () => {
      if (isNative) return
      const styL = (document.body.clientWidth - dragDom.offsetWidth) / 2
      const styT = (document.body.clientHeight - dragDom.offsetHeight) / 2
      dragDom.style.cssText += `;left:${styL}px;top:${styT}px;transform:translate(0, 0);`
    }

    $(window).resize(function() {
      clearBoxPercent()
    })

    // 拖拽效果
    const moveDown = (e) => {
      if (e.target.tagName !== 'DIV') return

      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      const dragDomWidth = dragDom.offsetWidth
      const dragDomheight = dragDom.offsetHeight

      const screenWidth = document.body.clientWidth
      const screenHeight = document.body.clientHeight

      // 获取到的值带px 正则匹配替换
      let styL, styT
      if (dialogHeaderEl === el.querySelector('.el-dialog__header')) {
        // 饿了么弹窗
        styL = getStyle(dragDom, 'left')
        styT = getStyle(dragDom, 'top')

        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
          styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
        } else {
          styL = +styL.replace(/\px/g, '')
          styT = +styT.replace(/\px/g, '')
        }
      } else if (dialogHeaderEl === el.querySelector('.dialog-title')) {
        // 自定义弹窗
        styL = e.clientX - e.offsetX
        styT = e.clientY - e.offsetY
        dragDom.style.cssText += `;left:${styL}px;top:${styT}px;transform:translate(0, 0);`
      }

      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;transform:translate(0, 0);`

        // emit onDrag event
        vnode.child && vnode.child.$emit('dragDialog')
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
    dialogHeaderEl.onmousedown = moveDown

    $(document).ready(function() {
      clearBoxPercent()
      // 最大最小化效果
      let isFullScreen = false // 初始非全屏
      let nowWidth = 0 // 当前宽
      const dialogMaxMinEl = dialogHeaderEl.querySelector('.nav .max-min')
      const dialogMaxEl = dialogHeaderEl.querySelector('.nav .max')
      const dialogMinEl = dialogHeaderEl.querySelector('.nav .min')
      const dialogInitHeight = dragDom.style.height
      if (!dialogMaxEl) return
      dialogMaxEl.style.display = 'inline-block'
      dialogMaxMinEl.onclick = e => {
        if (isFullScreen === false) {
          dialogMaxEl.style.display = 'none'
          dialogMinEl.style.display = 'inline-block'
          nowWidth = dragDom.clientWidth
          dragDom.style.left = 0
          dragDom.style.top = 0
          dragDom.style.width = '100VW'
          dragDom.style.height = '100VH'
          dragDom.style.transform = 'translate(0, 0)'
          isFullScreen = true
          dialogHeaderEl.style.cursor = 'initial'
        } else {
          dialogMaxEl.style.display = 'inline-block'
          dialogMinEl.style.display = 'none'
          dragDom.style.width = nowWidth + 'px'
          dragDom.style.height = dialogInitHeight
          isFullScreen = false
          dialogHeaderEl.style.cursor = 'move'
          clearBoxPercent()
        }
      }
    })
  }
}

Vue.directive('el-drag-dialog', drag)
