(function () {
	var URL = window.UEDITOR_HOME_URL || getUEBasePath();
	window.UEDITOR_CONFIG = {
		UEDITOR_HOME_URL: URL,
		serverUrl: URL + "jsp/controller.jsp",
		themePath: URL + "themes/",
		theme:"default",
		toolbars: [
			[
				'source', 'qmEditorFullscreen', 'qmEditorPreview', '|',
				'undo', 'redo', '|',
				'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', '|',
				'link', 'unlink', '|',
				'paragraph', 'fontfamily', 'fontsize'
			],
			[
				'qmEditorForm', '|', 'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
				'directionalityltr', 'directionalityrtl', 'indent', '|',
				'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
				'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
				'qmeditorimage', 'horizontal', '|',
				'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
				'searchreplace'
			]
		],
		labelMap: {
			"qmeditorfullscreen": '全屏',
			"qmeditorform": '插入表单项目',
			"qmeditorpreview": '预览',
			"qmeditorimage": "插入图片"
		},
		fullscreen: true,
		maximumWords: 99999999999999999999,
		wordCountMsg: '当前已输入 {#count} 个字符', // 当前已输入 {#count} 个字符，您还可以输入{#leave} 个字符
		insertorderedlist: {
			'decimal': '',
			'lower-alpha': '',
			'lower-roman': '',
			'upper-alpha': '',
			'upper-roman': '',
			'decimal-leading-zero': '01,02,03...',
			'cjk-ideographic': '一,二,三...'
		},
		insertunorderedlist: {
			none: '无',
			circle: '',
			disc: '',
			square: ''
		},
		tabNode: '&ensp;',
		autoClearEmptyNode:false,
		allowDivTransToP:false,
		xssFilterRules: true,
		inputXssFilter: true,
		outputXssFilter: true,
		whitList: {
			input: ['qmcode', 'qmtype', 'disabled', 'id', 'type', 'name', 'title', 'class', 'style', 'value', 'checked', 'list', 'maxlength', 'placeholder', 'readonly'],
			select: ['qmcode', 'qmtype', 'disabled', 'id', 'name', 'title', 'class', 'style'],
			option: ['disabled', 'selected', 'value', 'label'],
			textarea: ['qmcode', 'qmtype', 'disabled', 'id', 'name', 'title', 'class', 'style'],
			a: ['target', 'href', 'title', 'class', 'style'],
			abbr: ['title', 'class', 'style'],
			address: ['class', 'style'],
			area: ['shape', 'coords', 'href', 'alt'],
			article: [],
			aside: [],
			audio: ['autoplay', 'controls', 'loop', 'preload', 'src', 'class', 'style'],
			b: ['class', 'style'],
			bdi: ['dir'],
			bdo: ['dir'],
			big: [],
			blockquote: ['cite', 'class', 'style'],
			br: [],
			caption: ['class', 'style'],
			center: [],
			cite: [],
			code: ['class', 'style'],
			col: ['align', 'valign', 'span', 'width', 'class', 'style'],
			colgroup: ['align', 'valign', 'span', 'width', 'class', 'style'],
			dd: ['class', 'style'],
			del: ['datetime'],
			details: ['open'],
			div: ['class', 'style'],
			dl: ['class', 'style'],
			dt: ['class', 'style'],
			em: ['class', 'style'],
			font: ['color', 'size', 'face'],
			footer: [],
			h1: ['class', 'style'],
			h2: ['class', 'style'],
			h3: ['class', 'style'],
			h4: ['class', 'style'],
			h5: ['class', 'style'],
			h6: ['class', 'style'],
			header: [],
			hr: [],
			i: ['class', 'style'],
			img: ['src', 'alt', 'title', 'width', 'height', 'style','id', '_src', 'loadingclass', 'class', 'data-latex'],
			ins: ['datetime'],
			li: ['class', 'style'],
			mark: [],
			nav: [],
			ol: ['class', 'style'],
			p: ['class', 'style'],
			pre: ['class', 'style'],
			s: [],
			section: [],
			small: [],
			span: ['qmcode', 'qmtype', 'class', 'title', 'style', 'contenteditable'],
			sub: ['class', 'style'],
			sup: ['class', 'style'],
			strong: ['class', 'style'],
			table: ['width', 'border', 'align', 'valign', 'class', 'style'],
			tbody: ['align', 'valign', 'class', 'style'],
			td: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
			tfoot: ['align', 'valign', 'class', 'style'],
			th: ['width', 'rowspan', 'colspan', 'align', 'valign', 'class', 'style'],
			thead: ['align', 'valign', 'class', 'style'],
			tr: ['qmcode', 'qmtype', 'title', 'rowspan', 'align', 'valign', 'class', 'style'],
			tt: [],
			u: [],
			ul: ['class', 'style'],
			video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width', 'class', 'style']
		},
		sourceEditor: 'codemirror',
		codeMirrorJsUrl: URL + 'third-party/codemirror/codemirror.js',
		codeMirrorCssUrl: URL + 'third-party/codemirror/codemirror.css',
		enableContextMenu: true
	};

	function getUEBasePath(docUrl, confUrl) {
		return getBasePath(docUrl || self.document.URL || self.location.href, confUrl || getConfigFilePath());
	}

	function getConfigFilePath() {
		var configPath = document.getElementsByTagName('script');
		return configPath[configPath.length - 1].src;
	}

	function getBasePath(docUrl, confUrl) {
		var basePath = confUrl;
		if (/^(\/|\\\\)/.test(confUrl)) {
			basePath = /^.+?\w(\/|\\\\)/.exec(docUrl)[0] + confUrl.replace(/^(\/|\\\\)/, '');
		} else if (!/^[a-z]+:/i.test(confUrl)) {
			docUrl = docUrl.split("#")[0].split("?")[0].replace(/[^\\\/]+$/, '');
			basePath = docUrl + "" + confUrl;
		}
		return optimizationPath(basePath);
	}

	function optimizationPath(path) {
		var protocol = /^[a-z]+:\/\//.exec(path)[0], tmp = null, res = [];
		path = path.replace(protocol, "").split("?")[0].split("#")[0];
		path = path.replace(/\\/g, '/').split(/\//);
		path[path.length - 1] = "";
		while (path.length) {
			if ((tmp = path.shift()) === "..") {
				res.pop();
			} else if (tmp !== ".") {
				res.push(tmp);
			}
		}
		return protocol + res.join("/");
	}

	window.UE = {
		getUEBasePath: getUEBasePath
	};

})();
