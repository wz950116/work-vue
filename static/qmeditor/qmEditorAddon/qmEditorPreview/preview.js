window.addEventListener("load", function (evt) {
	var header = document.querySelector("header");

	var btnClose = document.createElement("input");
	btnClose.setAttribute("type", "button");
	btnClose.setAttribute("value", "关闭");
	btnClose.addEventListener("click", function () {
		window.close();
	});
	header.appendChild(btnClose);

	var btnPrint = document.createElement("input");
	btnPrint.setAttribute("type", "button");
	btnPrint.setAttribute("value", "打印");
	btnPrint.addEventListener("click", function () {
		window.print();
	});
	header.appendChild(btnPrint);

	document.body.oncontextmenu = function (evt) {
		evt.preventDefault();
		return false;
	};

	var ipts = document.querySelectorAll("input[qmcode]");
	ipts.forEach(function (ipt) {
		ipt.setAttribute("disabled", "disabled");
	});
	var ipts = document.querySelectorAll("select[qmcode]");
	ipts.forEach(function (ipt) {
		ipt.setAttribute("disabled", "disabled");
	});
	var ipts = document.querySelectorAll("textarea[qmcode]");
	ipts.forEach(function (ipt) {
		ipt.setAttribute("disabled", "disabled");
	});
});
