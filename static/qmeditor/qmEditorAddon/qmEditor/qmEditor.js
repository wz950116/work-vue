
function qmEditor_syncInput() {
    var ipts = document.querySelectorAll("input[type='text']");
    ipts.forEach(ipt => {
        ipt.setAttribute("value", ipt.value);
    });
    ipts = document.querySelectorAll("input[type='checkbox']");
    ipts.forEach(ipt => {
        if (ipt.checked) {
            ipt.setAttribute("checked", "checked");
        } else {
            ipt.removeAttribute("checked");
        }
    });
    ipts = document.querySelectorAll("input[type='radio']");
    ipts.forEach(ipt => {
        if (ipt.checked) {
            ipt.setAttribute("checked", "checked");
        } else {
            ipt.removeAttribute("checked");
        }
    });
    ipts = document.querySelectorAll("select");
    ipts.forEach(ipt => {
        var opts = ipt.querySelector("option");
        for (var j = 0; j < opts.length; j++) {
            var opt = opts[j];
            if (opt.value === ipt.value) {
                opt.setAttribute("selected", "selected");
            } else {
                opt.removeAttribute("selected");
            }
        }
    });
    ipts = document.querySelectorAll("textarea");
    ipts.forEach(ipt => {
        ipt.innerHTML = ipt.value;
    });
}

function qmEditor_isInTrLoop(item) {
    var prt = item.parentElement;
    while (prt !== null && prt !== document.body) {
        if (prt.getAttribute("qmtype") === "row" || prt.getAttribute("qmtype") === "rowbase") {
            return true;
        }
        prt = prt.parentElement;
    }
    return false;
}

function qmEditor_readonlyData(readonly) {
    var ipts = document.body.querySelectorAll("input[qmcode]");
    ipts.forEach(function (ipt) {
        if (readonly) {
            ipt.setAttribute("disabled", "disabled");
        } else {
            ipt.removeAttribute("disabled");
        }
    });
    ipts = document.body.querySelectorAll("select[qmcode]");
    ipts.forEach(function (ipt) {
        if (readonly) {
            ipt.setAttribute("disabled", "disabled");
        } else {
            ipt.removeAttribute("disabled");
        }
    });
    ipts = document.body.querySelectorAll("textarea[qmcode]");
    ipts.forEach(function (ipt) {
        if (readonly) {
            ipt.setAttribute("disabled", "disabled");
        } else {
            ipt.removeAttribute("disabled");
        }
    });
}

function qmEditor_getData() {
    var data = {};
    var trs = document.querySelectorAll("tr[qmcode]");
    trs.forEach(trObj => {
        var code = trObj.getAttribute("qmcode");
        if (trObj.getAttribute("qmtype") !== "row") {
            return;
        }
        var trDatas = data[code];
        if (trDatas === undefined) {
            trDatas = [];
            data[code] = trDatas;
        }
        var rowData = {};
        trDatas.push(rowData);
        var txts = trObj.querySelectorAll("input[qmcode][type=text]");
        txts.forEach(function (txt) {
            var txtCode = txt.getAttribute("qmcode");
            rowData[txtCode] = txt.value;
        });
        var lbls = trObj.querySelectorAll("span[qmcode]");
        lbls.forEach(function (lbl) {
            var lblCode = lbl.getAttribute("qmcode");
            rowData[lblCode] = lbl.innerText;
        });
    });
}

function qmEditor_fillData(data) {
    if (data === null || data === undefined) {
        data = {};
    }
    var trs = document.querySelectorAll("tr[qmcode]");
    trs.forEach(trOld => {
        if (trOld.getAttribute("qmtype") !== 'rowbase') {
            trOld.remove();
            return;
        }
        var code = trOld.getAttribute("qmcode");
        var trDatas = data[code];
        if (Array.isArray(trDatas)) {
            trDatas.forEach(function (trData) {
                var trNew = trOld.cloneNode(true);
                trNew.setAttribute("qmtype", "row");
                trNew.style.display = '';
                var txts = trNew.querySelectorAll("input[qmcode][type=text]");
                txts.forEach(function (txt) {
                    var txtCode = txt.getAttribute("qmcode");
                    var txtData = trData[txtCode];
                    if (txtData === undefined || txtData === null) {
                        txt.setAttribute("value", "");
                    } else {
                        txt.setAttribute("value", txtData);
                    }
                });
                var lbls = trNew.querySelectorAll("span[qmcode]");
                lbls.forEach(function (lbl) {
                    var lblCode = lbl.getAttribute("qmcode");
                    var lblData = trData[lblCode];
                    if (lblData === undefined || lblData === null) {
                        lbl.innerText = "";
                    } else {
                        lbl.innerText = lblData;
                    }
                });
                trOld.parentElement.insertBefore(trNew, trOld);
            });
        }
        trOld.style.display = 'none';
    });


    var txts = document.body.querySelectorAll("input[qmcode]");
    txts.forEach(txt => {
        if (qmEditor_isInTrLoop(txt)) {
            return;
        }
        var txtCode = txt.getAttribute("qmcode");
        var txtData = data[txtCode];
        if (txtData === undefined || txtData === null) {
            txt.setAttribute("value", "");
        } else {
            txt.setAttribute("value", txtData);
        }
    });
    var lbls = document.body.querySelectorAll("span[qmcode]");
    lbls.forEach(lbl => {
        if (qmEditor_isInTrLoop(lbl)) {
            return;
        }
        var lblCode = lbl.getAttribute("qmcode");
        var lblData = data[lblCode];
        if (lblData === undefined || lblData === null) {
            lbl.innerText = "";
        } else {
            lbl.innerText = lblData;
        }
    });
}

(function () {
    document.body.addEventListener("contextmenu", (evt) => {
        if (window.parent.qmEditorData) {
            //
        } else {
            window.parent.qmEditorData = {};
        }
        if (window.parent.qmEditorData.contextmenu) {
            //
        } else {
            window.parent.qmEditorData.contextmenu = {};
        }
        window.parent.qmEditorData.contextmenu.srcElement = evt.srcElement;
    });
    window.parent.innerWindowReady();
})();
