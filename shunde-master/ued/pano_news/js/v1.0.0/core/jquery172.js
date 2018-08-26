declare(function () {
    return{name: "CookieSync", namespace: "Cpro.BusinessLogic", sync: function () {
        var d = using("Cpro.Utility.Cookie");
        var g = using("Cpro.Utility.Log");
        var f = d.getCookie("BAIDUID");
        var e = d.getCookie("CPROID");
        var j = d.getCookie("ISUS");
        var h = d.getCookie("ISBID");
        var k = false;
        var l = false;
        var m = (new Date()).getTime();
        if (!e && f) {
            var i = "http://cpro.baidustatic.com/sync.htm?cproid=" + encodeURIComponent(f);
            g.sendByIframe(i)
        }
        if (e && !j) {
            k = true
        } else {
            if (e && j && e !== j) {
                k = true
            }
        }
        if (f && !h) {
            l = true
        } else {
            if (f && h && f !== h) {
                l = true
            }
        }
        if (k || l) {
            var a = new Date();
            a.setTime(a.getTime() + 86400000);
            d.setCookie("ISBID", f || "1", {path: "/", expires: a});
            d.setCookie("ISUS", e || "1", {path: "/", expires: a});
            if (e && f) {
                var c = e;
                var b = e.indexOf(":");
                if (b && b > 0) {
                    c = e.substring(0, b)
                }
                g.sendByIframe("http://s.cpro.baidu.com/s.htm?cproid=" + c + "&t=" + m)
            }
            if (e) {
                g.sendByIframe("http://weibo.com/aj/static/sync.html?t=" + m);
                g.sendByIframe("http://pos.baidu.com/sync_pos.htm?cproid=" + encodeURIComponent(e) + "&t=" + m);
                var c = e;
                var b = e.indexOf(":");
                if (b && b > 0) {
                    c = e.substring(0, b)
                }
                g.sendByIframe("http://bd.tst.35go.net/bd/t.html?bid=" + c + "&t=" + m)
            }
        }
    }}
});
declare(function () {
    return{name: "AlignEngine", namespace: "Cpro.Template", paint: function (k) {
        var p = k.slotData;
        var c = k.layoutObj;
        var g = c.layoutIndex;
        var j = k.data;
        var l = {image: "image", res: "image", curl: "link"};
        var b = p.idPrefix || "";
        if (k.containerVerticalAlign === "center") {
            var a = document.getElementById(b + "container");
            if (a) {
                var f = a.offsetWidth;
                var q = a.offsetHeight;
                for (var h = 0, n = j.length; h < n; h++) {
                    var o = document.getElementById(b + "item" + h);
                    if (o) {
                        o.style.height = ""
                    }
                }
            }
        }
        for (var h = 0, n = j.length; h < n; h++) {
            var o = document.getElementById(b + "item" + h);
            if (o) {
                var e = o.offsetWidth;
                var m = o.offsetHeight;
                if (k.itemTextAlign === "center") {
                }
                if (k.itemVerticalAlign === "middle") {
                    o.style.height = "";
                    itemNewHeight = o.offsetHeight;
                    var d = m - itemNewHeight;
                    if (d > 0) {
                        o.style.paddingTop = d / 2
                    }
                    c.item
                }
            }
        }
    }}
});
declare(function () {
    return{name: "AntiCheat", namespace: "Cpro.Template", antiCheatArray: [], mouseInClientX: -1, mouseInClientY: -1, mouseInTime: -1, mouseInTimeSpan: -1, mousePressTime: -1, mouseClickClientX: -1, mouseClickClientY: -1, mouseClickCheckNum: -1, mouseOverTimes: -1, bind: function (b, a, c) {
        if (window.addEventListener) {
            b.addEventListener(a, c, false)
        } else {
            b.attachEvent("on" + a, c)
        }
    }, formatEventObj: function (a) {
        a = a || window.event;
        a.target = a.target || a.srcElement;
        return a
    }, mouseInHandler: function (a) {
        if (this.mouseInClientX === -1) {
            this.mouseInClientX = a.clientX
        }
        if (this.mouseInClientY === -1) {
            this.mouseInClientY = a.clientY
        }
    }, mouseInTimeHandler: function (a) {
        if (this.mouseInTime === -1) {
            this.mouseInTime = (new Date()).getTime()
        }
        this.mouseInTimeSpan = (new Date()).getTime() - this.mouseInTime
    }, mousePressTimeHandler: function (a) {
        if (a.type === "mousedown") {
            this.mousePressTime = (new Date()).getTime()
        } else {
            this.mousePressTime = (new Date()).getTime() - this.mousePressTime
        }
    }, mouseClickHandler: function (h) {
        h = this.formatEventObj(h);
        var d = h.target;
        if (d.tagName.toLowerCase() !== "a") {
            d = d.parentNode
        }
        this.mouseClickClientX = h.clientX;
        this.mouseClickClientY = h.clientY;
        this.mouseInTimeHandler();
        this.mouseClickCheckNum = 0;
        var a = /\.php\?(url=)?([0-9a-zA-Z_-]*)\./.exec(d.href);
        var l = a[2];
        var b = /.*(\d+)/.exec(d.id);
        var c = b[1];
        var j = this.antiCheatArray[c];
        for (var g = 0; g < (((this.mouseOverTimes * j) % 99) + 9); g++) {
            var k = (this.mousePressTime * g) % l.length;
            this.mouseClickCheckNum += l.charCodeAt(k)
        }
        var f = d.innerHTML;
        if (d.href.indexOf("&ck") == -1) {
            d.href += "&ck=" + this.mouseClickCheckNum + "." + this.mouseOverTimes + "." + this.mousePressTime + "." + this.mouseClickClientX + "." + this.mouseClickClientY + "." + this.mouseInClientX + "." + this.mouseInClientY + "." + this.mouseInTimeSpan
        }
        if ((f.match(/(www\.)|(.*@.*)/i) != null) && document.all) {
            f.match(/\<.*\>/i) == null ? d.innerHTML = f : d.innerTEXT = f
        }
    }, mouseOverHandler: function (a) {
        if (this.mouseOverTimes === -1) {
            this.mouseOverTimes = 0
        }
        this.mouseOverTimes++
    }, check: function (b, d) {
        this.antiCheatArray = d || window.antiCheatArray;
        var a = document.getElementById(b);
        var f = a.getElementsByTagName("a");
        this.bind(a, "mouseover", this.mouseInHandler.proxy(this));
        this.bind(a, "mouseover", this.mouseInTimeHandler.proxy(this));
        for (var c = 0; c < f.length; c++) {
            var e = f[c].className;
            if (e) {
                e = e.toLowerCase();
                if (e === "gylogo" || e === "bdlogo" || e === "bd-logo" || e === "bd-logo2" || e === "bd-logo3") {
                    continue
                }
            }
            this.bind(f[c], "mousedown", this.mousePressTimeHandler.proxy(this));
            this.bind(f[c], "mouseup", this.mousePressTimeHandler.proxy(this));
            this.bind(f[c], "click", this.mouseClickHandler.proxy(this));
            this.bind(f[c], "mouseover", this.mouseOverHandler.proxy(this))
        }
    }}
});
declare(function () {
    return{name: "DataEngine", namespace: "Cpro.Template", flashIETemplate: '<object classid="clsid:D27CDB6E-AE6D-11CF-96B8-444553540000" id="{flashid}"codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"border="0" width="{width}" height="{height}"><param name="quality" value="high"><param name="wmode" value="opaque"><param name="menu" value="false"><param name="movie" value="{url}"><param name="FlashVars" value="{flashvars}"><param name="scale" value="{scale}"><param name="AllowFullScreen" value="{allowfullscreen}"><param name="AllowScriptAccess" value="{allowscriptaccess}"><param name="AllowNetworking" value="{allownetworking}"></object>', flashNormalTemplate: '<embed pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"wmode="opaque" quality="High"name="{flashid}" src="{url}"width="{width}" height="{height}"scale="{scale}"allowfullscreen="{allowfullscreen}" allowscriptaccess="{allowscriptaccess}"allownetworking="{allownetworking}"flashvars="{flashvars}"></embed>', templateFunc: function (c, b) {
        var a = /{(.*?)}/g;
        return c.replace(a, function (f, e, d, g) {
            return b[e] || ""
        })
    }, createFlashHtml: function (c) {
        c.id = c.id ? c.id : "";
        c.flashvars = c.flashvars ? c.flashvars : "";
        c.scale = c.scale ? c.scale : "exactfit";
        c.allowFullScreen = c.allowFullScreen ? c.allowFullScreen : "false";
        c.allowScriptAccess = c.allowScriptAccess ? c.allowScriptAccess : "never";
        c.allowNetworking = c.allowNetworking ? c.allowNetworking : "internal";
        var b = window.ActiveXObject ? this.flashIETemplate : this.flashNormalTemplate;
        var a = this.templateFunc(b, {url: c.url, width: c.width, height: c.height, id: c.id, scale: c.scale, allowfullscreen: c.allowFullScreen, allowscriptaccess: c.allowScriptAccess, allownetworking: c.allowNetworking, flashvars: c.flashvars});
        return a
    }, subStringByBytes: function (b, a, c) {
        if (!b) {
            return""
        }
        b = String(b);
        if (a < 0 || b.replace(/[^\x00-\xff]/g, "ci").length <= a) {
            return b
        }
        b = b.substr(0, a).replace(/([^\x00-\xff])/g, "\x241 ").substr(0, a);
        b = b.replace(/[^\x00-\xff]$/, "");
        b = b.replace(/([^\x00-\xff]) /g, "\x241");
        return b
    }, getByteLength: function (a) {
        if (!a) {
            return""
        }
        a = String(a);
        a = a.replace(/([^\x00-\xff])/g, "\x241 ");
        return a.length
    }, truncateEngine: function (t) {
        var x = t.dom;
        var h = t.showRowCount;
        var l = t.showLineHeight;
        var d = t.showWidth;
        var c = t.showFontSize;
        var u = t.showContent;
        var B = false;
        if (t.showEllipsis) {
            B = true
        }
        x.style.whiteSpace = "nowrap";
        var q = x.offsetWidth;
        var e = [];
        var a = [];
        var r = [];
        var p = h * d;
        var b = 0;
        if (l <= 0 || h <= 0) {
            return 0
        }
        var k, z, s;
        for (var w = 0; w < 3; w++, b++) {
            q = x.offsetWidth;
            e[w] = q;
            a[w] = this.getByteLength(x.innerText || x.textContent);
            k = p - q;
            if (k > 0 && u.length == x.innerHTML.length) {
                break
            }
            z;
            s;
            if (Math.abs(k) < 5) {
                break
            }
            if (w === 0) {
                z = Math.ceil(c / 2)
            } else {
                z = Math.abs(e[w] - e[w - 1]) / r[w - 1];
                if (z === 0) {
                    break
                }
            }
            r[w] = Math.ceil(Math.abs(k) / z);
            s = k > 0 ? 0 : 1;
            if (!s) {
                x.innerHTML = this.subStringByBytes(u, a[w] + r[w])
            } else {
                x.innerHTML = this.subStringByBytes(u, a[w] - r[w])
            }
        }
        q = x.offsetWidth;
        var A;
        var m = 10;
        var f = 0;
        while (f < m && q > p) {
            q = x.offsetWidth;
            var C = x.innerText || x.textContent;
            k = p - q;
            A = k > 0 ? 0 : 1;
            if (!A) {
                x.innerHTML = u.substr(0, C.length + 1)
            } else {
                x.innerHTML = u.substr(0, C.length - 1)
            }
            b++;
            f++;
            q = x.offsetWidth;
            var C = x.innerText || x.textContent;
            k = p - q;
            if (!A) {
                if (k <= 0) {
                    x.innerHTML = u.substr(0, C.length - 1);
                    b++;
                    break
                }
            } else {
                if (k >= 0) {
                    break
                }
            }
        }
        f = 0;
        x.style.whiteSpace = "normal";
        x.style.wordBreak = "break-all";
        x.style.wordWrap = "break-word";
        var n = x.offsetHeight;
        var g = h * l;
        var C = x.innerText || x.textContent;
        if (h != 1) {
            var m = 10;
            var f = 0;
            while (f < m && n > g + 4) {
                x.innerHTML = u.substr(0, C.length - 1);
                n = x.offsetHeight;
                C = x.innerText || x.textContent;
                b++;
                f++
            }
            f = 0
        }
        if (B) {
            if (C.length < u.length) {
                var C = x.innerText || x.textContent;
                var v = this.getByteLength(C);
                x.innerHTML = this.subStringByBytes(u, v - 2) + '<span style="font-family:arial;">...</span>'
            }
        }
        var j = l;
        var y = x.offsetHeight;
        while (j + 4 < y) {
            j += l
        }
        x.parentNode.style.height = j + "px";
        return b
    }, paint: function (l) {
        var n = l.userConfig;
        var h = l.fullConfig;
        var A = l.layoutObj;
        var x = A.layoutIndex;
        var D = l.data;
        var w = (typeof l.isTruncate !== "undefined") ? l.isTruncate : true;
        var k = {image: "image", res: "image", brand: "image", curl: "link", icon: "link"};
        var d = h.idPrefix || "";
        if (h.displayType === "inlay" && h.stuffType === "linkunit" && h.urlReplace && h.urlReplace !== "default") {
            for (var t = 0, f = D.length; t < f; t++) {
                D[t].curl = D[t].curl.replace("http://cpro.baidu.com/cpro/ui/uijs.php?", decodeURIComponent(h.urlReplace))
            }
        }
        for (var t = 0, f = D.length; t < f; t++) {
            var z = D[t];
            var g = t;
            var F = z.type;
            for (var G in z) {
                var u = z.curl;
                var v = document.getElementById(d + G + g);
                if (!v) {
                    continue
                }
                v.href = u;
                var s = k[G] || "text";
                if (F && F === "flash" && G === "res") {
                    s = "flash"
                }
                if (s === "image") {
                    var E = document.getElementById(v.id);
                    v.childNodes[0].width = E.style.width;
                    v.childNodes[0].height = E.style.height;
                    v.childNodes[0].src = z[G];
                    continue
                } else {
                    if (s === "link") {
                        continue
                    } else {
                        if (s === "flash") {
                            var e = document.getElementById(v.id + "Flash");
                            e.innerHTML = this.createFlashHtml({url: z[G], width: e.style.width, height: e.style.height});
                            continue
                        }
                    }
                }
                var j = x[G] && x[G].rowCount || 1;
                var c = x[G].style["line-height"];
                var p = x[G].style.width;
                var b = x[G].style["font-size"];
                var r = (z[G] || "").replace(/\s+/g, " ");
                var C = x[G].showEllipsis;
                v.title = r;
                if (w) {
                    v.innerHTML = this.subStringByBytes(r, j * p * 2 / b, true)
                } else {
                    v.innerHTML = r
                }
                if (F === "text" || F === "tuwen" || F === "smartidea2") {
                    if (w) {
                        var m = {dom: v, showRowCount: j, showLineHeight: c, showWidth: p, showFontSize: b, showContent: r, showEllipsis: C, key: G};
                        var a = this.truncateEngine(m)
                    }
                    if (h.keywordIsFlush && h.keywordIsFlush !== 4) {
                        var B = false;
                        if (h.keywordIsFlush === 1) {
                            B = true
                        } else {
                            if (h.keywordIsFlush === 2 && G === "title") {
                                B = true
                            } else {
                                if (h.keywordIsFlush === 3 && G === "desc") {
                                    B = true
                                }
                            }
                        }
                        if (B) {
                            var q = using("Cpro.Template.KeywordPainter");
                            q.flush(v, z.bid, h.keywordFlushColor)
                        }
                    }
                }
                if (m && m.key === "surl" && !x.surl.style.display) {
                    m.dom.parentNode.style.display = "block"
                }
            }
            if (h.itemRightImage) {
                var y = document.getElementById(d + "rightimage" + g);
                if (y) {
                    y.href = z.curl;
                    y.backgroundImage = h.itemRightImageSrc
                }
            }
        }
        if (n.titleFrontIconSrc) {
            for (var t = 0, f = D.length; t < f; t++) {
                document.getElementById(d + "icon" + t).getElementsByTagName("img")[0].src = n.titleFrontIconSrc
            }
        }
    }}
});
declare(function () {
    return{name: "DefaultValueManager", namespace: "Cpro.Template", getDefaultValue: function (f) {
        var c = this.fastClone(this.globalDefaultValue);
        var b = [];
        f.displayType = f.displayType ? f.displayType : "inlay";
        f.stuffType = f.stuffType ? f.stuffType : "text";
        b.push(f.stuffType);
        b.push(f.displayType);
        b.push(f.displayType + "_" + f.stuffType);
        b.push(f.displayType + "_" + f.stuffType + "_" + f.adRowCount + "_" + f.adColumnCount);
        b.push(f.displayType + "_" + f.stuffType + "_" + f.templateWidth + "_" + f.templateHeight);
        b.push(f.displayType + "_" + f.stuffType + "_" + f.templateWidth + "_" + f.templateHeight + "_" + f.adRowCount + "_" + f.adColumnCount);
        var h = null;
        var d = null;
        var a = null;
        for (var e = 0, g = b.length; e < g; e++) {
            h = b[e];
            d = this[h];
            if (h && d) {
                for (a in d) {
                    if (a && (d[a] !== null) && (typeof d[a] !== "undefined")) {
                        c[a] = d[a]
                    }
                }
            }
        }
        return c
    }, fastClone: function (b) {
        var a = function () {
        };
        a.prototype = b;
        return new a()
    }, flash: {containerPaddingLeft: 0, containerPaddingRight: 0, containerPaddingTop: 0, containerPaddingBottom: 0, adRowCount: 1, adColumnCount: 1}, image: {containerPaddingLeft: 0, containerPaddingRight: 0, containerPaddingTop: 0, containerPaddingBottom: 0, adRowCount: 1, adColumnCount: 1}, inlay_text: {containerPaddingRight: 8, containerBorderTop: 1, containerBorderRight: 1, containerBorderBottom: 1, containerBorderLeft: 1, containerBorderColor: "ffffff", titlePaddingBottom: 4, urlPaddingTop: 2}, inlay_text_1_1: {titleFontSize: 20, descFontSize: 14, titleTextAlign: "center", descTextAlign: "center", urlTextAlign: "center", urlIsShow: 1}, inlay_tuwen: {containerPaddingRight: 8}, inlay_tuwen_1_1: {titleFontSize: 16}, inlay_tuwen_1_4: {descFontSize: 12}, inlay_linkunit1: {titleFontSize: 12, titleLineHeight: 15, containerPaddingLeft: 0, containerPaddingRight: 0, containerPaddingTop: 0, containerPaddingBottom: 0, itemColumnSpace: 6, itemRowSpace: 4}, inlay_linkunit1_120_90: {containerPaddingLeft: 2, containerPaddingRight: 2, containerPaddingTop: 1, containerPaddingBottom: 1, adRowCount: 5, adColumnCount: 1}, inlay_linkunit1_160_90: {containerPaddingLeft: 2, containerPaddingRight: 2, containerPaddingTop: 1, containerPaddingBottom: 1, adRowCount: 5, adColumnCount: 1}, inlay_linkunit1_180_90: {containerPaddingLeft: 2, containerPaddingRight: 2, containerPaddingTop: 1, containerPaddingBottom: 1, adRowCount: 5, adColumnCount: 1}, inlay_linkunit1_200_90: {containerPaddingLeft: 2, containerPaddingRight: 2, containerPaddingTop: 1, containerPaddingBottom: 1, adRowCount: 5, adColumnCount: 1}, inlay_linkunit1_468_15: {containerPaddingRight: 15, adRowCount: 1, adColumnCount: 5}, inlay_linkunit1_728_15: {containerPaddingRight: 15, adRowCount: 1, adColumnCount: 6}, inlay_text_960_90_1_4: {descFontSize: 14, descLineHeight: 16, titlePaddingBottom: 3, urlPaddingTop: 2}, inlay_text_468_60: {descFontSize: 12, descLineHeight: 14, titlePaddingBottom: 3, urlPaddingTop: 2, containerPaddingRight: 8, adRowCount: 1, adColumnCount: 2}, inlay_tuwen_468_60: {descFontSize: 12, descLineHeight: 14, titlePaddingBottom: 3, urlPaddingTop: 2, adRowCount: 1, adColumnCount: 2}, "float": {adRowCount: 1, adColumnCount: 1}, float_linkunit1_120_270: {idPrefix: "lu_", containerShowLogo: 0, titleTextAlign: "left", titleFontColor: "666666", titleFontSize: 12, titleLineHeight: 14, titleShowUnderline: 0, containerPaddingLeft: 8, containerPaddingRight: 8, containerPaddingTop: 4, containerPaddingBottom: 4, containerBorderTop: 1, containerBorderRight: 1, containerBorderBottom: 1, containerBorderLeft: 1, containerBorderColor: "cccccc", itemColumnSpace: 6, itemRowSpace: 4, adRowCount: 2, adColumnCount: 1}, globalDefaultValue: {userChargingId: "", templateWidth: 728, templateHeight: 90, adDataType: "text_tuwen", adRowCount: 1, adColumnCount: 4, KeywordIsFlush: 4, KeywordFlushColor: "e10900", isShowUnrelated: 1, isShowPublicAd: 1, isGongyi: 0, backupColor: "ffffff", backupUrl: "", displayType: "inlay", stuffType: "image", layout: "-1", scale: "", containerBorderColor: "ffffff", containerBorderWidth: 1, containerBorderTop: 0, containerBorderRight: 0, containerBorderBottom: 0, containerBorderLeft: 0, containerBorderStyle: "solid", containerBackgroundColor: "ffffff", containerPaddingLeft: 4, containerPaddingRight: 4, containerPaddingTop: 4, containerPaddingBottom: 4, containerOpacity: 0, containerShowLogo: 1, containerWidth: 0, containerHeight: 0, containerHideHeaderFooter: 0, containerFloat: "none", containerLogoStyle: "-1", itemPaddingLeft: 0, itemPaddingRight: 0, itemPaddingTop: 0, itemPaddingBottom: 0, itemVerticalAlign: "-1", itemColumnSpace: 20, itemColumnBackgroundColor: "-1", itemColumnBorderWidth: 0, itemColumnBorderStyle: "solid", itemColumnBorderColor: "-1", itemColumnPaddingTop: 0, itemColumnPaddingLeft: 0, itemColumnPaddingRight: 0, itemColumnPaddingBottom: 0, itemColumnMarginTop: 0, itemColumnMarginLeft: 0, itemColumnMarginRight: 0, itemColumnMarginBottom: 0, itemRowSpace: 10, itemRowBorderWidth: 0, itemRowBorderStyle: "solid", itemRowBorderColor: "-1", itemRowPaddingTop: 0, itemRowPaddingLeft: 0, itemRowPaddingRight: 0, itemRowPaddingBottom: 0, itemRightImage: 0, itemRightImageSrc: "", itemRightImageWidth: 0, itemRightImageHeight: 0, itemRightImagePaddingTop: 0, itemRightImagePaddingLeft: 0, itemRightImagePaddingRight: 0, itemRightImagePaddingBottom: 0, brandLogoPaddingLeft: 0, brandLogoPaddingRight: 0, brandLogoPaddingTop: 0, brandLogoPaddingBottom: 0, logoIsShow: 1, logoPaddingLeft: 0, logoPaddingRight: 4, logoPaddingTop: 0, logoPaddingBottom: 0, titleFontColor: "0F0CBF", titleFontFamily: "arial,simsun,sans-serif", titleFontSize: 14, titleLength: -1, titleIsShowEllipsis: 0, titleIsShow: 1, titleRowCount: 1, titlePaddingLeft: 0, titlePaddingRight: 0, titlePaddingTop: 0, titlePaddingBottom: 5, titleShowUnderline: 1, titleLineHeight: -1, titleWidth: -1, titleFontWeight: "normal", titleBackgroundColor: "-1", titleHoverFontColor: "EE0000", titleHoverShowUnderline: -1, titleHoverBackgroundColor: "-1", titleVisitedFontColor: "-1", titleVisitedShowUnderline: -1, titleVisitedBackgroundColor: "-1", titleActiveFontColor: "-1", titleActiveShowUnderline: -1, titleActiveBackgroundColor: "-1", titleTextAlign: "-1", titleFrontIconSrc: "", titleFrontIconWidth: 0, titleFrontIconHeight: 0, titleFrontIconPaddingRight: 0, titleFrontIconPaddingLeft: 0, descFontColor: "444444", descFontFamily: "arial,simsun,sans-serif", descFontSize: 14, descLength: -1, descIsShowEllipsis: 1, descIsShow: 1, descRowCount: -1, descPaddingLeft: 0, descPaddingRight: 0, descPaddingTop: 0, descPaddingBottom: 0, descShowUnderline: 0, descLineHeight: -1, descWidth: -1, descFontWeight: "normal", descBackgroundColor: "-1", descHoverFontColor: "EE0000", descHoverShowUnderline: 1, descHoverBackgroundColor: "-1", descVisitedFontColor: "-1", descVisitedShowUnderline: -1, descVisitedBackgroundColor: "-1", descActiveFontColor: "-1", descActiveShowUnderline: -1, descActiveBackgroundColor: "-1", descTextAlign: "-1", urlFontColor: "008000", urlFontFamily: "arial,simsun,sans-serif", urlFontSize: 11, urlLength: -1, urlIsShowEllipsis: 0, urlIsShow: -1, urlPaddingLeft: 0, urlPaddingRight: 0, urlPaddingTop: 3, urlPaddingBottom: 0, urlShowUnderline: 0, urlRowCount: 0, urlLineHeight: -1, urlWidth: -1, urlFontWeight: "normal", urlBackgroundColor: "-1", urlReplace: " ", urlHoverFontColor: "EE0000", urlHoverShowUnderline: 1, urlHoverBackgroundColor: "-1", urlVisitedFontColor: "-1", urlVisitedShowUnderline: -1, urlVisitedBackgroundColor: "-1", urlActiveFontColor: "-1", urlActiveShowUnderline: -1, urlActiveBackgroundColor: "-1", urlTextAlign: "-1"}}
});
declare(function () {
    return{name: "FloatDataEngine", namespace: "Cpro.Template", paint: function (m) {
        var j = m.slotData;
        var y = m.layoutObj;
        var w = y.layoutIndex;
        var A = m.data;
        var v = (typeof m.isTruncate !== "undefined") ? m.isTruncate : true;
        var l = {image: "image", res: "image", curl: "link"};
        var b = using("Cpro.Template.DataEngine");
        var e = j.idPrefix || "";
        if (j.displayType === "inlay" && j.stuffType === "linkunit" && j.urlReplace && j.urlReplace !== "default") {
            for (var s = 0, g = A.length; s < g; s++) {
                A[s].curl = A[s].curl.replace("http://cpro.baidu.com/cpro/ui/uijs.php?", decodeURIComponent(j.urlReplace))
            }
        }
        for (var s = 0, g = A.length; s < g; s++) {
            var x = A[s];
            var h = s;
            var B = x.type;
            for (var C in x) {
                var t = x.curl;
                var u = document.getElementById(e + C + h);
                if (!u) {
                    continue
                }
                u.href = t;
                var r = l[C] || "text";
                if (B && B === "flash" && C === "res") {
                    r = "flash"
                }
                if (r === "image") {
                    u.childNodes[0].src = x[C];
                    continue
                } else {
                    if (r === "link") {
                        continue
                    } else {
                        if (r === "flash") {
                            var f = document.getElementById(u.id + "Flash");
                            f.innerHTML = this.createFlashHtml({url: x[C], width: f.style.width, height: f.style.height});
                            continue
                        }
                    }
                }
                var k = w[C] && w[C].rowCount || 1;
                var d = w[C].style["line-height"];
                var p = w[C].style.width;
                var c = w[C].style["font-size"];
                var q = (x[C] || "").replace(/\s+/g, " ");
                var z = w[C].showEllipsis;
                u.title = q;
                u.innerHTML = this.subStringByBytes(q, k * p * 2 / c, true);
                if (B === "text" || B === "tuwen") {
                    if (v) {
                        var n = {dom: u, showRowCount: k, showLineHeight: d, showWidth: p, showFontSize: c, showContent: q, showEllipsis: z, key: C};
                        var a = this.truncateEngine(n)
                    }
                }
                if (n && n.key === "surl") {
                    n.dom.parentNode.style.display = "block"
                }
            }
        }
    }}
});
declare(function () {
    return{name: "KeywordPainter", namespace: "Cpro.Template", flush: function (g, c, a) {
        if (!c) {
            return
        }
        if (typeof c === "string") {
            c = c.replace(/(^\s*)|(\s*$)/g, "");
            c = c.split(" ")
        }
        if (c.length <= 0) {
            return
        }
        a = a.replace("#", "");
        for (var d = 0, f = c.length; d < f; d++) {
            var e = g.innerHTML;
            var h = c[d];
            h = h.replace(/[\*\.\?\+\$\^\[\]\(\)\{\}\|\\\/]/g, "\\$&");
            var b = new RegExp(h, "gi");
            g.innerHTML = e.replace(b, function (i) {
                return'<span style="color:#' + a + '">' + i + "</span>"
            })
        }
    }}
});
declare(function () {
    return{name: "LayoutEngineManager", namespace: "Cpro.Template", getLayoutEngine: function (e) {
        var a;
        this.Template = using("Cpro.Template");
        var d = e.userConfig;
        var c = e.fullConfig;
        var f = {singleline: "SingleLine"};
        if (typeof c === "string") {
            return this.Template.LayoutEngine[c]
        } else {
            if (d.layout && typeof d.layout === "string" && d.layout.toString() !== "-1") {
                var b = f[d.layout.toLowerCase()];
                return this.Template.LayoutEngine[b]
            }
        }
        switch (c.stuffType.toLowerCase()) {
            case"text":
                a = this.Template.LayoutEngine.Text;
                break;
            case"image":
                a = this.Template.LayoutEngine.Image;
                break;
            case"tuwen":
                a = this.Template.LayoutEngine.Tuwen;
                break;
            case"flash":
                a = this.Template.LayoutEngine.Flash;
                break;
            case"linkunit1":
                a = this.Template.LayoutEngine.LinkUnit1;
                break;
            case"linkunit":
                a = this.Template.LayoutEngine.LinkUnit;
                break;
            case"iconlinkunit":
                a = this.Template.LayoutEngine.IconLinkUnit;
                break;
            case"smartidea1":
            case"smartidea2":
                a = this.Template.LayoutEngine.SmartIdea;
                break;
            default:
                a = this.Template.LayoutEngine.Text;
                break
        }
        return a
    }}
});
declare(function () {
    return{name: "LinkUnitAdjust", namespace: "Cpro.Template", hasClass: function (a, c) {
        var b = new RegExp("(\\s|^)" + c + "(\\s|$)");
        return a.className.match(b)
    }, layout: function (j) {
        var q = j.userConfig;
        var f = j.fullConfig;
        var y = j.layoutObj;
        var o = y.props.id ? y.props.id : "container";
        var h = document.getElementById(o);
        var b = f.idPrefix || "";
        var r = 0;
        var x = 1;
        var g = 1;
        var e = [];
        var a = [];
        var p = h.childNodes;
        f.itemColumnSpace = 2;
        f.itemRowSpace = 2;
        for (var v = 0, s = p.length; v < s; v++) {
            if (this.hasClass(p[v], "itemColumnSpace")) {
                p[v].style.width = f.itemColumnSpace + "px"
            }
            if (this.hasClass(p[v], "itemRowSpace")) {
                p[v].style.height = f.itemRowSpace + "px"
            }
        }
        f.titlePaddingBottom = f.titlePaddingTop;
        for (var v = 0, c = f.adColumnCount; v < c; v++) {
            var d = v;
            var w = null;
            w = document.getElementById(b + y.content[0].content[0].dataKey + d);
            if (!w) {
                continue
            }
            if (f.adRowCount == 1) {
                w.className = w.className.replace("textOverflow", "");
                var n = w.offsetWidth;
                w.style.width = w.parentNode.style.width = n + "px";
                r = r + n;
                w.className = w.className + " textOverflow";
                e.push(w.parentNode.parentNode);
                a.push(n);
                if (x == f.adColumnCount) {
                    var u = f.templateWidth - f.containerPaddingRight - f.containerPaddingLeft - f.containerBorderWidth * 2 - r - (f.adColumnCount - 1) * f.itemColumnSpace - (f.titlePaddingLeft + f.titlePaddingRight) * f.adColumnCount;
                    paddingWidth = Math.floor(u / (f.adColumnCount * 2));
                    for (var t = 0; t < e.length; t++) {
                        e[t].style.paddingLeft = paddingWidth + "px";
                        e[t].style.paddingRight = paddingWidth + "px";
                        e[t].style.width = a[t] + f.titlePaddingLeft + f.titlePaddingRight + "px"
                    }
                    e[x - 1].style.paddingRight = u - paddingWidth * (x * 2 - 1) + "px"
                }
            }
            x++;
            var m = Math.floor((f.templateHeight - f.containerPaddingTop - f.containerPaddingBottom - f.containerBorderWidth * 2 - (f.adRowCount - 1) * f.itemRowSpace) / f.adRowCount) - f.itemPaddingTop - f.itemPaddingBottom - f.titlePaddingTop - f.titlePaddingBottom;
            w.style.height = w.parentNode.style.height = w.style.lineHeight = w.parentNode.style.lineHeight = m + "px";
            w.parentNode.parentNode.style.height = m + f.titlePaddingTop + f.titlePaddingBottom + "px";
            w.style.textAlign = w.parentNode.style.textAlign = w.parentNode.style.textAlign = w.parentNode.parentNode.style.textAlign = "center"
        }
    }}
});
declare(function () {
    return{name: "TemplateEngine", namespace: "Cpro.Template", init: function () {
    }, paint: function (e) {
        var c = e.ads;
        var d = e.userConfig;
        var h = e.templateConfig;
        var b = e.displayType;
        var g = Base.fastClone(config);
        var f = this.Template.TemplateVariableManager.getVariables(this.mainConfig);
        currentLayoutEngine = this.Template.LayoutEngineManager.getLayoutEngine(this.mainFullNameConfig);
        this.MediaLayoutObj = currentLayoutEngine.layout(this.mainFullNameConfig);
        this.Template.PaintEngine.paint({layoutObj: this.MediaLayoutObj, userFullNameConfig: this.mainFullNameConfig});
        if (c[0] && c[0].type && c[0].type === "image") {
            run(this.ShowContentLoaded.proxy(this), "image")
        } else {
            this.ShowContentLoaded()
        }
        this.Template.DataEngine.paint({layoutObj: this.MediaLayoutObj, data: c, slotData: this.mainFullNameConfig});
        if (!window.isGongyi) {
            var a = using("Cpro.Template.AntiCheat");
            a.check("container")
        }
    }}
});
declare(function () {
    return{name: "PaintEngine", namespace: "Cpro.Template", idPrefix: "", pxStyle: {width: 1, height: 1, "line-height": 1, "padding-left": 1, "padding-right": 1, "padding-top": 1, "padding-bottom": 1, "border-width": 1, "font-size": 1, "margin-left": 1, "margin-right": 1, "margin-top": 1, "margin-bottom": 1, "border-left-width": 1, "border-right-width": 1, "border-top-width": 1, "border-bottom-width": 1}, excludeStyle: {"outer-height": 1, "outer-width": 1}, linkStyle: {"font-size": 1, height: 1, "line-height": 1, "text-decoration": 1, "text-align": 1, "font-family": 1, color: 1, "word-wrap": 1, "word-break": 1, "text-overflow": 1}, globalGetStyleObj: {}, cssString: "", idRecorder: {}, getStyle: function (b, e) {
        var a = "";
        if (this.globalGetStyleObj[b]) {
            return""
        } else {
            this.globalGetStyleObj[b] = 1
        }
        var d = e.style;
        if (d) {
            for (var c in d) {
                if (this.excludeStyle[c]) {
                    continue
                }
                a += c + ":" + d[c] + (this.pxStyle[c] ? "px;" : ";")
            }
        }
        a = "." + b + " {" + a + "} \n";
        return a
    }, getLinkStyle: function (b, f) {
        var a = "";
        if (this.globalGetStyleObj[b]) {
            return""
        } else {
            this.globalGetStyleObj[b] = 1
        }
        var d = f.style;
        if (d) {
            for (var c in d) {
                if (this.excludeStyle[c] || !this.linkStyle[c]) {
                    continue
                }
                a += c + ":" + d[c] + (this.pxStyle[c] ? "px;" : ";")
            }
        }
        if (f.dataType === "flash") {
            a += "display:block; position:absolute; top:0px; left:0px; z-index:9; cursor:hand; opacity:0; filter:alpha(opacity=0); background-color:#FFFFFF; width:" + d.width + "px;"
        }
        a = "." + b + " {" + a + "} \n";
        if (f.styleHover) {
            var e = {};
            e.style = f.styleHover;
            a += this.getLinkStyle(b + ":hover", e)
        }
        return a
    }, addCssByStyle: function (d) {
        var e = document;
        var b = e.createElement("style");
        b.setAttribute("type", "text/css");
        if (b.styleSheet) {
            b.styleSheet.cssText = d
        } else {
            var a = e.createTextNode(d);
            b.appendChild(a)
        }
        var c = e.getElementsByTagName("head");
        if (c.length) {
            c[0].appendChild(b)
        } else {
            e.documentElement.appendChild(b)
        }
    }, drawDom: function (a) {
        var g = a.cssName || a.dataKey;
        this.cssString += this.getStyle(g, a);
        var d = document.createElement(a.domName);
        d.className = g;
        for (var n in a.props) {
            d[n] = a.props[n]
        }
        if (a.dataType != "layout") {
            this.idRecorder[a.dataKey + this.idPrefix] = this.idRecorder[a.dataKey + this.idPrefix] || 0;
            var b = this.idPrefix + a.dataKey + this.idRecorder[a.dataKey + this.idPrefix];
            var m = document.createElement("a");
            m.id = b;
            m.target = "_blank";
            var e = g + " a";
            this.cssString += this.getLinkStyle(e, a);
            this.idRecorder[a.dataKey + this.idPrefix]++;
            var h = a.enableClick !== undefined ? a.enableClick : 1;
            switch (a.dataType) {
                case"text":
                    break;
                case"image":
                    var o = document.createElement("img");
                    o.style.width = (a.style.width) + "px";
                    o.style.height = (a.style.height) + "px";
                    m.style.display = "block";
                    m.appendChild(o);
                    break;
                case"flash":
                    var q = document.createElement("div");
                    q.style.width = (a.style.width) + "px";
                    q.style.height = (a.style.height) + "px";
                    q.id = b + "Flash";
                    d.appendChild(q);
                    break;
                case"icon":
                    if (h) {
                        var l = document.createElement("div");
                        l.style.width = (a.style.width) + "px";
                        l.style.height = (a.style.height) + "px";
                        m.appendChild(l)
                    }
                    break;
                default:
                    break
            }
            if (h) {
                d.appendChild(m)
            }
        }
        if (a.content && a.content.length) {
            for (var f = 0, k = a.content.length; f < k; f++) {
                for (var c = 0, p = a.content[f].count || 1; c < p; c++) {
                    d.appendChild(this.drawDom(a.content[f]))
                }
            }
        }
        return d
    }, drawLogo: function (c) {
        c = c || {};
        var d = c.logoId || "logo";
        var b = document.getElementById(d);
        if (!b) {
            b = document.createElement("a")
        }
        var a = false;
        if (typeof c.isGongyi === "undefined" && typeof window.isGongyi !== "undefined") {
            a = window.isGongyi
        } else {
            a = c.isGongyi ? true : false
        }
        b.innerHTML = "&nbsp;";
        b.className = c.className || "bd-logo";
        b.target = "_blank";
        if (a) {
            b.href = "http://gongyi.baidu.com/";
            b.title = "\u767e\u5ea6\u516c\u76ca"
        } else {
            b.href = "http://wangmeng.baidu.com/";
            if (c.stuffType == "image" || c.stuffType == "flash") {
                b.title = "\u63A8\u5E7F\u7528\u6237 : " + c.title
            } else {
                b.title = "\u767e\u5ea6\u7f51\u76df\u63a8\u5e7f"
            }
        }
        var e = function () {
            b.style.zoom = "1"
        };
        setTimeout(e, 100);
        return b
    }, paint: function (e) {
        var i = [];
        var h = e.userConfig;
        var b = e.fullConfig;
        var a = e.layoutObj;
        var d = e.data;
        var c = e.styleCssString || "";
        this.idPrefix = b.idPrefix || "";
        i = this.drawDom(a);
        this.cssString += c;
        this.addCssByStyle(this.cssString);
        if (window.ad) {
            window.ad.parentNode.removeChild(window.ad);
            window.ad = null
        }
        if (e.dom) {
            e.dom.appendChild(i)
        } else {
            window.loader = document.getElementById(this.idPrefix + "loader");
            window.ad = i;
            window.loader.parentNode.insertBefore(i, window.loader)
        }
        if (b.containerShowLogo) {
            var f = "bd-logo";
            if (h.containerLogoStyle) {
                f = h.containerLogoStyle
            } else {
                if (b.containerLogoStyle.toString() === "-1") {
                    if (b.stuffType === "linkunit1" || b.stuffType === "iconlinkunit") {
                        f = "bd-logo2"
                    }
                }
            }
            var g = {className: f, isGongyi: b.isGongyi, title: d[0].surl, stuffType: b.stuffType};
            i.appendChild(this.drawLogo(g))
        }
        window.loader = window.ad = i = null
    }}
});
declare(function () {
    return{name: "StyleTemplate", namespace: "Cpro.Template", cache: {}, LEFT_DELIMITER: "<%", RIGHT_DELIMITER: "%>", templateCss: function (a, c) {
        var d = using("Cpro.Utility.CssBuilder");
        var b = this.template(a, c);
        d.addCss(b)
    }, templateHtml: function (j, c) {
        var h = using("Cpro.Utility.CssBuilder");
        var f = this.template(j, c);
        var g = document.getElementById(j);
        var b = document.createElement("div");
        b.innerHTML = f;
        var a = [];
        for (var d = 0, e = b.childNodes.length; d < e; d++) {
            if (b.childNodes[d] && b.childNodes[d].nodeType === 1) {
                a.push(b.childNodes[d])
            }
        }
        for (var d = 0, e = a.length; d < e; d++) {
            g.parentNode.insertBefore(a[d], g)
        }
    }, template: function (f, d) {
        var e;
        if (!window.document) {
            e = this.compile(f)
        }
        var c = document.getElementById(f);
        if (c) {
            if (this.cache[f]) {
                e = this.cache[f]
            }
            var b = /^(textarea|input)$/i.test(c.nodeName) ? c.value : c.innerHTML;
            e = this.compile(b)
        } else {
            e = this.compile(f)
        }
        var a = this.isObject(d) ? e(d) : e;
        e = null;
        return a
    }, compile: function (b) {
        var a = "var _template_fun_array=[];\nvar fn=(function(data){\nvar _template_varName='';\nfor(name in data){\n_template_varName+=('var '+name+'=data[\"'+name+'\"];');\n};\neval(_template_varName);\n_template_fun_array.push('" + this.analysisStr(b) + "');\n_template_varName=null;\n})(_template_object);\nfn = null;\nreturn _template_fun_array.join('');\n";
        return new Function("_template_object", a)
    }, isObject: function (a) {
        return"function" === typeof a || !!(a && "object" === typeof a)
    }, analysisStr: function (c) {
        var a = using("Cpro.Utility.Encoder");
        var d = this.LEFT_DELIMITER;
        var b = this.RIGHT_DELIMITER;
        d = a.encodeReg(d);
        b = a.encodeReg(b);
        c = String(c);
        c = c.replace(new RegExp("(" + d + "[^" + b + "]*)//.*\n", "g"), "$1");
        c = c.replace(new RegExp("<!--.*?-->", "g"), "");
        c = c.replace(new RegExp(d + "\\*.*?\\*" + b, "g"), "");
        c = c.replace(new RegExp("[\\r\\t\\n]", "g"), "");
        c = c.replace(new RegExp(d + "(?:(?!" + b + ")[\\s\\S])*" + b + "|((?:(?!" + d + ")[\\s\\S])+)", "g"), function (f, e) {
            var g = "";
            if (e) {
                g = e.replace(/\\/g, "&#92;").replace(/'/g, "&#39;");
                while (/<[^<]*?&#39;[^<]*?>/g.test(g)) {
                    g = g.replace(/(<[^<]*?)&#39;([^<]*?>)/g, "$1\r$2")
                }
            } else {
                g = f
            }
            return g
        });
        c = c.replace(new RegExp("(" + d + "[\\s]*?var[\\s]*?.*?[\\s]*?[^;])[\\s]*?" + b, "g"), "$1;" + b);
        c = c.replace(new RegExp("(" + d + ":?[hvu]?[\\s]*?=[\\s]*?[^;|" + b + "]*?);[\\s]*?" + b, "g"), "$1" + b);
        c = c.split(d).join("\t");
        if (this.ESCAPE) {
            c = c.replace(new RegExp("\\t=(.*?)" + b, "g"), "',typeof($1) === 'undefined'?'':baidu.template._encodeHTML($1),'")
        } else {
            c = c.replace(new RegExp("\\t=(.*?)" + b, "g"), "',typeof($1) === 'undefined'?'':$1,'")
        }
        c = c.replace(new RegExp("\\t:h=(.*?)" + b, "g"), "',typeof($1) === 'undefined'?'':baidu.template._encodeHTML($1),'");
        c = c.replace(new RegExp("\\t(?::=|-)(.*?)" + b, "g"), "',typeof($1)==='undefined'?'':$1,'");
        c = c.replace(new RegExp("\\t:u=(.*?)" + b, "g"), "',typeof($1)==='undefined'?'':encodeURIComponent($1),'");
        c = c.replace(new RegExp("\\t:v=(.*?)" + b, "g"), "',typeof($1)==='undefined'?'':baidu.template._encodeEventHTML($1),'");
        c = c.split("\t").join("');");
        c = c.split(b).join("_template_fun_array.push('");
        c = c.split("\r").join("\\'");
        return c
    }}
});
declare(function () {
    return{name: "TemplateVariableManager", namespace: "Cpro.Template", getFullName: function (a) {
        return this.nameMapping[a]
    }, getFullNameConfig: function (c) {
        var a = {};
        var d;
        var e;
        var b = {};
        for (key in c) {
            if (!key || (typeof c[key] === "undefined")) {
                continue
            }
            d = this.getFullName(key.toLowerCase());
            e = c[key];
            if (typeof e === "string") {
                e = decodeURIComponent(e).replace("#", "")
            }
            if (d) {
                a[d] = e
            } else {
                a[key] = e
            }
            b[key.toLowerCase()] = e
        }
        c = b;
        if (!c.column && c.wn) {
            a.adColumnCount = parseInt(c.wn)
        }
        if (!c.row && c.hn) {
            a.adRowCount = parseInt(c.hn)
        }
        if (c.conw && c.conw > 0) {
            a.templateWidth = c.conw
        }
        if (c.conh && c.conh > 0) {
            a.templateHeight = c.conh
        }
        if (typeof a.containerBorderWidth !== "undefined") {
            a.containerBorderTop = parseInt(a.containerBorderWidth);
            a.containerBorderRight = parseInt(a.containerBorderWidth);
            a.containerBorderBottom = parseInt(a.containerBorderWidth);
            a.containerBorderLeft = parseInt(a.containerBorderWidth)
        }
        return a
    }, getVariables: function (c) {
        var b = {};
        var d = using("Cpro.Template.DefaultValueManager");
        var a = d.getDefaultValue(c);
        var e;
        for (key in c) {
            if (key && (typeof c[key] !== "undefined")) {
                e = c[key];
                if (typeof e === "string") {
                    e = decodeURIComponent(e).replace("#", "")
                }
                if (e !== "") {
                    a[key] = c[key]
                }
            }
        }
        return a
    }, nameMapping: {n: "userChargingId", rsi0: "templateWidth", rsi1: "templateHeight", at: "adDataType", row: "adRowCount", column: "adColumnCount", rsi5: "keywordIsFlush", rss6: "keywordFlushColor", rad: "isShowUnrelated", cad: "isShowPublicAd", isgongyi: "isGongyi", rss7: "backupColor", aurl: "backupUrl", displaytype: "displayType", stufftype: "stuffType", layout: "layout", scale: "scale", rss0: "containerBorderColor", conbw: "containerBorderWidth", conbt: "containerBorderTop", conbr: "containerBorderRight", conbb: "containerBorderBottom", conbl: "containerBorderLeft", conbs: "containerBorderStyle", rss1: "containerBackgroundColor", conpl: "containerPaddingLeft", conpr: "containerPaddingRight", conpt: "containerPaddingTop", conpb: "containerPaddingBottom", conop: "containerOpacity", consl: "containerShowLogo", conw: "containerWidth", conh: "containerHeight", conhhf: "containerHideHeaderFooter", conf: "containerFloat", conls: "containerLogoStyle", itepl: "itemPaddingLeft", itepr: "itemPaddingRight", itept: "itemPaddingTop", itepb: "itemPaddingBottom", iteva: "itemVerticalAlign", itecs: "itemColumnSpace", itecb: "itemColumnBackgroundColor", itecbw: "itemColumnBorderWidth", itecbs: "itemColumnBorderStyle", itecbc: "itemColumnBorderColor", itecpt: "itemColumnPaddingTop", itecpl: "itemColumnPaddingLeft", itecpr: "itemColumnPaddingRight", itecpb: "itemColumnPaddingBottom", itecmt: "itemColumnMarginTop", itecml: "itemColumnMarginLeft", itecmr: "itemColumnMarginRight", itecmb: "itemColumnMarginBottom", iters: "itemRowSpace", iterbw: "itemRowBorderWidth", iterbs: "itemRowBorderStyle", iterbc: "itemRowBorderColor", iterpt: "itemRowPaddingTop", iterpl: "itemRowPaddingLeft", iterpr: "itemRowPaddingRight", iterpb: "itemRowPaddingBottom", iteri: "itemRightImage", iteris: "itemRightImageSrc", iteriw: "itemRightImageWidth", iterih: "itemRightImageHeight", iteript: "itemRightImagePaddingTop", iteripl: "itemRightImagePaddingLeft", iteripr: "itemRightImagePaddingRight", iteripb: "itemRightImagePaddingBottom", logis: "logoIsShow", logpl: "logoPaddingLeft", logpr: "logoPaddingRight", logpt: "logoPaddingTop", logpb: "logoPaddingBottom", blogpl: "brandLogoPaddingLeft", blogpr: "brandLogoPaddingRight", blogpt: "brandLogoPaddingTop", blogpb: "brandLogoPaddingBottom", rss2: "titleFontColor", titff: "titleFontFamily", titfs: "titleFontSize", titl: "titleLength", titse: "titleIsShowEllipsis", titis: "titleIsShow", titrc: "titleRowCount", titpl: "titlePaddingLeft", titpr: "titlePaddingRight", titpt: "titlePaddingTop", titpb: "titlePaddingBottom", titsu: "titleShowUnderline", titlh: "titleLineHeight", titw: "titleWidth", titfw: "titleFontWeight", titbc: "titleBackgroundColor", tithfc: "titleHoverFontColor", tithsu: "titleHoverShowUnderline", tithbc: "titleHoverBackgroundColor", titvfc: "titleVisitedFontColor", titvsu: "titleVisitedShowUnderline", titvbc: "titleVisitedBackgroundColor", titafc: "titleActiveFontColor", titasu: "titleActiveShowUnderline", titabc: "titleActiveBackgroundColor", titta: "titleTextAlign", titfis: "titleFrontIconSrc", titfiw: "titleFrontIconWidth", titfih: "titleFrontIconHeight", titfil: "titleFrontIconPaddingLeft", titfip: "titleFrontIconPaddingRight", rss3: "descFontColor", desff: "descFontFamily", desfs: "descFontSize", desl: "descLength", desse: "descIsShowEllipsis", desis: "descIsShow", desrc: "descRowCount", despl: "descPaddingLeft", despr: "descPaddingRight", despt: "descPaddingTop", despb: "descPaddingBottom", dessu: "descShowUnderline", deslh: "descLineHeight", desw: "descWidth", desfw: "descFontWeight", desbc: "descBackgroundColor", deshfc: "descHoverFontColor", deshsu: "descHoverShowUnderline", deshbc: "descHoverBackgroundColor", desvfc: "descVisitedFontColor", desvsu: "descVisitedShowUnderline", desvbc: "descVisitedBackgroundColor", desafc: "descActiveFontColor", desasu: "descActiveShowUnderline", desabc: "descActiveBackgroundColor", desta: "descTextAlign", rss4: "urlFontColor", urlff: "urlFontFamily", urlfs: "urlFontSize", urll: "urlLength", urlse: "urlIsShowEllipsis", urlis: "urlIsShow", urlpl: "urlPaddingLeft", urlpr: "urlPaddingRight", urlpt: "urlPaddingTop", urlpb: "urlPaddingBottom", urlsu: "urlShowUnderline", urlrc: "urlRowCount", urllh: "urlLineHeight", urlw: "urlWidth", urlfw: "urlFontWeight", urlbc: "urlBackgroundColor", urlre: "urlReplace", urlhfc: "urlHoverFontColor", urlhsu: "urlHoverShowUnderline", urlhbc: "urlHoverBackgroundColor", urlvfc: "urlVisitedFontColor", urlvsu: "urlVisitedShowUnderline", urlvbc: "urlVisitedBackgroundColor", urlafc: "urlActiveFontColor", urlasu: "urlActiveShowUnderline", urlabc: "urlActiveBackgroundColor", urlta: "urlTextAlign"}}
});
declare(function () {
    return{name: "VerticalAlignHelper", namespace: "Cpro.Template", text: function (k) {
        var n = k.userConfig;
        var g = k.fullConfig;
        var v = k.layoutObj;
        var w = k.data;
        var x = using("Cpro.Utility.CssBuilder");
        var a = g.itemVerticalAlign.toString().toLowerCase();
        if (a === "-1" || a === "top") {
            return
        }
        var l = v.props.id ? v.props.id : "container";
        var h = document.getElementById(l);
        var b = g.idPrefix || "";
        for (var r = 0, f = h.childNodes.length; r < f; r++) {
            var o = h.childNodes[r];
            if (o.className !== b + "item") {
                continue
            }
            var c = parseInt(x.getStyle(o, "width").replace("px", ""));
            var p = parseInt(x.getStyle(o, "height").replace("px", ""));
            var t = 0;
            var u = 0;
            var d = 0;
            for (var q = 0, e = o.childNodes.length; q < e; q++) {
                var s = o.childNodes[q];
                t += s.offsetHeight
            }
            if (p > 0 && t > 0 && p > t) {
                if (a === "middle") {
                    var m = Math.floor((p - t) / 2);
                    o.style.paddingTop = m + "px";
                    o.style.height = (p - m) + "px"
                } else {
                    if (a === "bottom") {
                        var m = Math.floor(p - t);
                        o.style.paddingTop = m + "px";
                        o.style.height = (p - m) + "px"
                    }
                }
            }
        }
    }, getStyle: function (c, b) {
        var a;
        c = this.g(c);
        var e = this.getDocument(c);
        var f = "";
        if (b.indexOf("-") > -1) {
            f = b.replace(/[-_][^-_]{1}/g, function (g) {
                return g.charAt(1).toUpperCase()
            })
        } else {
            f = b.replace(/[A-Z]{1}/g, function (g) {
                return"-" + g.charAt(0).toLowerCase()
            })
        }
        var d;
        if (e && e.defaultView && e.defaultView.getComputedStyle) {
            d = e.defaultView.getComputedStyle(c, null);
            if (d) {
                a = d.getPropertyValue(b)
            }
            if (typeof a !== "boolean" && !a) {
                a = d.getPropertyValue(f)
            }
        } else {
            if (c.currentStyle) {
                d = c.currentStyle;
                if (d) {
                    a = d[b]
                }
                if (typeof a !== "boolean" && !a) {
                    a = d[f]
                }
            }
        }
        return a
    }}
});
declare(function () {
    return{name: "Base", namespace: "Cpro.Template.LayoutEngine", GetCssName: function (b, c) {
        var a = b;
        if (c.idPrefix) {
            a = c.idPrefix + a
        }
        return a
    }, layoutContainer: function (e, a, d) {
        var b = {style: {}, content: [], dataType: "layout", domName: "div", cssName: this.GetCssName("container", d)};
        var c = b.style;
        c["outer-width"] = e;
        c["outer-height"] = a;
        c["padding-left"] = parseInt(d.containerPaddingLeft);
        c["padding-right"] = parseInt(d.containerPaddingRight);
        c["padding-top"] = parseInt(d.containerPaddingTop);
        c["padding-bottom"] = parseInt(d.containerPaddingBottom);
        c["border-style"] = d.containerBorderStyle;
        c["border-top-width"] = d.containerBorderTop;
        c["border-right-width"] = d.containerBorderRight;
        c["border-bottom-width"] = d.containerBorderBottom;
        c["border-left-width"] = d.containerBorderLeft;
        c["border-color"] = "#" + d.containerBorderColor.replace("#", "");
        c.width = e - c["padding-left"] - c["padding-right"] - c["border-right-width"] - c["border-left-width"];
        c.height = a - c["padding-top"] - c["padding-bottom"] - c["border-top-width"] - c["border-bottom-width"];
        c["background-color"] = "#" + d.containerBackgroundColor.replace("#", "");
        if (parseInt(d.containerOpacity) == 1) {
            c["background-color"] = "transparent"
        }
        c.position = "relative";
        c.overflow = "hidden";
        b.props = {id: d.idPrefix ? (d.idPrefix + "container") : "container"};
        c["float"] = d.containerFloat;
        return b
    }, layoutItem: function (d, a, c) {
        var e = {style: {}, content: [], dataType: "layout", domName: "div", cssName: this.GetCssName("item", c)};
        var b = e.style;
        b["outer-width"] = d;
        b["outer-height"] = a;
        b["padding-left"] = parseInt(c.itemPaddingLeft);
        b["padding-right"] = parseInt(c.itemPaddingRight);
        b["padding-top"] = parseInt(c.itemPaddingTop);
        b["padding-bottom"] = parseInt(c.itemPaddingBottom);
        b.width = Math.floor(b["outer-width"] - b["padding-left"] - b["padding-right"]);
        b.height = Math.floor(b["outer-height"] - b["padding-top"] - b["padding-bottom"]);
        b["float"] = "left";
        b.overflow = "hidden";
        b["text-align"] = c.itemTextAlign || "left";
        if (typeof isGongyi !== "undefined" && isGongyi && (c.stuffType === "text" || c.stuffType === "tuwen")) {
            b.width = b.width > 250 ? 250 : b.width;
            b.height = b.height > 90 ? 90 : b.height;
            b["padding-left"] = b["padding-left"] + ((d - b.width) / 2);
            b["padding-top"] = b["padding-top"] + ((a - b.height) / 2)
        }
        return e
    }, layoutIcon: function (e, a, d) {
        var c = {style: {}, content: [], dataType: "icon", domName: "div", dataKey: "icon", enableClick: d.iconLinkUnitConfig.enableClick};
        var b = c.style;
        b["padding-left"] = parseInt(d.titleFrontIconPaddingLeft) || 0;
        b["padding-right"] = parseInt(d.titleFrontIconPaddingRight) || 0;
        b["padding-top"] = parseInt(d.titleFrontIconPaddingTop) || 0;
        b["padding-bottom"] = parseInt(d.titleFrontIconPaddingBottom) || 0;
        b.width = e;
        b.height = a;
        b["float"] = "left";
        return c
    }, layoutRightImage: function (d, a, e, g, c) {
        var f = {style: {}, content: [], dataType: "text", domName: "div", cssName: this.GetCssName("itemRightImage", c), dataKey: "rightimage"};
        var b = f.style;
        b.width = d;
        b.height = a;
        b.position = "absolute";
        b.overflow = "hidden";
        if (c.templateWidth <= 180) {
            b.right = (c.itemRightImagePaddingRight || (e - d) / 2) + "px";
            b.bottom = c.itemRightImagePaddingBottom + "px"
        } else {
            b.right = c.itemRightImagePaddingRight + "px";
            b.top = (c.itemRightImagePaddingTop || (g - a) / 2) + "px"
        }
        return f
    }, layoutTitle: function (e, b, d, g) {
        var f = {style: {}, content: [], dataType: "text", domName: "div", cssName: this.GetCssName("title", d), dataKey: "title"};
        var c = f.style;
        c["outer-width"] = e;
        c["outer-height"] = b;
        c["padding-left"] = parseInt(d.titlePaddingLeft);
        c["padding-right"] = parseInt(d.titlePaddingRight);
        c["padding-top"] = parseInt(d.titlePaddingTop);
        c["padding-bottom"] = parseInt(d.titlePaddingBottom);
        c["line-height"] = this.calculateTitleLineHeight(d);
        c.width = c["outer-width"] - c["padding-left"] - c["padding-right"];
        c.height = c["outer-height"] - c["padding-top"] - c["padding-bottom"];
        c.overflow = "hidden";
        c["font-size"] = d.titleFontSize;
        c["font-family"] = d.titleFontFamily;
        c["text-align"] = d.titleTextAlign;
        c.color = "#" + d.titleFontColor.replace("#", "");
        c["text-decoration"] = d.titleShowUnderline ? "underline" : "none";
        c["font-weight"] = d.titleFontWeight;
        f.rowCount = d.titleRowCount > 0 ? d.titleRowCount : this.calculateTitleRowCount(b, d);
        f.showEllipsis = d.titleIsShowEllipsis;
        if (g) {
            c["float"] = g
        }
        if (d.titleHoverFontColor.toString() !== "-1" || d.titleHoverShowUnderline.toString() !== "-1" || d.titleHoverBackgroundColor.toString() !== "-1") {
            var a = f.styleHover = {};
            if (d.titleHoverFontColor.toString() !== "-1") {
                a.color = "#" + d.titleHoverFontColor.toString().replace("#", "")
            }
            if (d.titleHoverShowUnderline.toString() !== "-1") {
                a["text-decoration"] = d.titleHoverShowUnderline ? "underline" : "none"
            }
            if (d.titleHoverBackgroundColor.toString() !== "-1") {
                a["background-color"] = "#" + d.titleHoverBackgroundColor.toString().replace("#", "")
            }
        }
        return f
    }, layoutUrl: function (f, b, e, g) {
        var c = {style: {}, content: [], dataType: "text", domName: "div", cssName: this.GetCssName("url", e), dataKey: "surl"};
        var d = c.style;
        d["outer-width"] = f;
        d["outer-height"] = b;
        d["padding-left"] = parseInt(e.urlPaddingLeft);
        d["padding-right"] = parseInt(e.urlPaddingRight);
        d["padding-top"] = parseInt(e.urlPaddingTop);
        d["padding-bottom"] = parseInt(e.urlPaddingBottom);
        d["line-height"] = this.calculateUrlLineHeight(e);
        d.width = d["outer-width"] - d["padding-left"] - d["padding-right"];
        d.height = d["outer-height"] - d["padding-top"] - d["padding-bottom"];
        d.overflow = "hidden";
        d["font-size"] = e.urlFontSize;
        d["font-family"] = e.urlFontFamily;
        d["text-align"] = e.urlTextAlign;
        d.color = "#" + e.urlFontColor.replace("#", "");
        d["float"] = "left";
        d["text-decoration"] = e.urlShowUnderline ? "underline" : "none";
        d["font-weight"] = e.urlFontWeight;
        c.rowCount = e.urlRowCount > 0 ? e.urlRowCount : 1;
        c.showEllipsis = e.urlIsShowEllipsis;
        if (g) {
            d["float"] = g
        }
        if (e.urlHoverFontColor.toString() !== "-1" || e.urlHoverShowUnderline.toString() !== "-1" || e.urlHoverBackgroundColor.toString() !== "-1") {
            var a = c.styleHover = {};
            if (e.urlHoverFontColor.toString() !== "-1") {
                a.color = "#" + e.urlHoverFontColor.toString().replace("#", "")
            }
            if (e.urlHoverShowUnderline.toString() !== "-1") {
                a["text-decoration"] = e.urlHoverShowUnderline ? "underline" : "none"
            }
            if (e.urlHoverBackgroundColor.toString() !== "-1") {
                a["background-color"] = "#" + e.urlHoverBackgroundColor.toString().replace("#", "")
            }
        }
        return c
    }, layoutDesc: function (e, b, d, g) {
        var f = {style: {}, content: [], dataType: "text", domName: "div", cssName: this.GetCssName("desc", d), dataKey: "desc"};
        var c = f.style;
        c["outer-width"] = e;
        c["outer-height"] = b;
        c["padding-left"] = parseInt(d.descPaddingLeft);
        c["padding-right"] = parseInt(d.descPaddingRight);
        c["padding-top"] = parseInt(d.descPaddingTop);
        c["padding-bottom"] = parseInt(d.descPaddingBottom);
        c["line-height"] = this.calculateDescLineHeight(d);
        c.width = c["outer-width"] - c["padding-left"] - c["padding-right"];
        c.height = c["outer-height"] - c["padding-top"] - c["padding-bottom"];
        c.overflow = "hidden";
        c["font-size"] = d.descFontSize;
        c["font-family"] = d.descFontFamily;
        c["text-align"] = d.descTextAlign;
        c.color = "#" + d.descFontColor.replace("#", "");
        c["float"] = "left";
        c["text-decoration"] = d.descShowUnderline ? "underline" : "none";
        c["font-weight"] = d.descFontWeight;
        f.rowCount = d.descRowCount > 0 ? d.descRowCount : this.calculateDescRowCount(b, d);
        f.showEllipsis = d.descIsShowEllipsis;
        if (g) {
            c["float"] = g
        }
        if (d.descHoverFontColor.toString() !== "-1" || d.descHoverShowUnderline.toString() !== "-1" || d.descHoverBackgroundColor.toString() !== "-1") {
            var a = f.styleHover = {};
            if (d.descHoverFontColor.toString() !== "-1") {
                a.color = "#" + d.descHoverFontColor.toString().replace("#", "")
            }
            if (d.descHoverShowUnderline.toString() !== "-1") {
                a["text-decoration"] = d.descHoverShowUnderline ? "underline" : "none"
            }
            if (d.descHoverBackgroundColor.toString() !== "-1") {
                a["background-color"] = "#" + d.descHoverBackgroundColor.toString().replace("#", "")
            }
        }
        return f
    }, layoutLogo: function (d, a, c) {
        var e = {style: {}, content: [], dataType: "image", domName: "div", cssName: this.GetCssName("logo", c), dataKey: "res"};
        var b = e.style;
        b["outer-width"] = d;
        b["outer-height"] = a;
        b["padding-left"] = parseInt(c.logoPaddingLeft);
        b["padding-right"] = parseInt(c.logoPaddingRight);
        b["padding-top"] = parseInt(c.logoPaddingTop);
        b["padding-bottom"] = parseInt(c.logoPaddingBottom);
        b.width = b["outer-width"] - b["padding-left"] - b["padding-right"];
        b.height = b["outer-height"] - b["padding-top"] - b["padding-bottom"];
        b["float"] = "left";
        b.overflow = "hidden";
        return e
    }, layoutBrandLogo: function (e, a, d, f) {
        var b = {style: {}, content: [], dataType: "image", domName: "div", cssName: this.GetCssName("brandLogo", d), dataKey: "brand"};
        var c = b.style;
        c["outer-width"] = e;
        c["outer-height"] = a;
        c["padding-left"] = parseInt(d.brandLogoPaddingLeft);
        c["padding-right"] = parseInt(d.brandLogoPaddingRight);
        c["padding-top"] = parseInt(d.brandLogoPaddingTop);
        c["padding-bottom"] = parseInt(d.brandLogoPaddingBottom);
        c.width = c["outer-width"] - c["padding-left"] - c["padding-right"];
        c.height = c["outer-height"] - c["padding-top"] - c["padding-bottom"];
        c.overflow = "hidden";
        if (f) {
            c["float"] = f
        }
        return b
    }, layoutImage: function (d, a, c) {
        var e = {style: {}, content: [], dataType: "image", domName: "div", cssName: this.GetCssName("image", c), dataKey: "res"};
        var b = e.style;
        b["outer-width"] = d;
        b["outer-height"] = a;
        b["padding-left"] = parseInt(c.imagePaddingLeft) || 0;
        b["padding-right"] = parseInt(c.imagePaddingRight) || 0;
        b["padding-top"] = parseInt(c.imagePaddingTop) || 0;
        b["padding-bottom"] = parseInt(c.imagePaddingBottom) || 0;
        b.width = b["outer-width"] - b["padding-left"] - b["padding-right"];
        b.height = b["outer-height"] - b["padding-top"] - b["padding-bottom"];
        b["float"] = "left";
        b.overflow = "hidden";
        return e
    }, layoutFlash: function (e, a, d) {
        var b = {style: {}, content: [], dataType: "flash", domName: "div", cssName: this.GetCssName("flash", d), dataKey: "res"};
        var c = b.style;
        c["outer-width"] = e;
        c["outer-height"] = a;
        c["padding-left"] = parseInt(d.flashPaddingLeft) || 0;
        c["padding-right"] = parseInt(d.flashPaddingRight) || 0;
        c["padding-top"] = parseInt(d.flashPaddingTop) || 0;
        c["padding-bottom"] = parseInt(d.flashPaddingBottom) || 0;
        c.width = c["outer-width"] - c["padding-left"] - c["padding-right"];
        c.height = c["outer-height"] - c["padding-top"] - c["padding-bottom"];
        c["float"] = "left";
        c.overflow = "hidden";
        return b
    }, layoutColumnSpace: function (e, a, d) {
        var f = {style: {}, content: [], dataType: "layout", domName: "div", cssName: this.GetCssName("itemColumnSpace", d)};
        var c = f.style;
        c.width = e;
        c.height = a - d.itemColumnMarginTop - d.itemColumnMarginBottom;
        c["float"] = "left";
        c.overflow = "hidden";
        c["margin-top"] = d.itemColumnMarginTop;
        c["margin-bottom"] = d.itemColumnMarginBottom;
        if (d.itemColumnBackgroundColor) {
            c["background-color"] = "#" + d.itemColumnBackgroundColor
        }
        if (d.itemColumnBorderWidth) {
            var b = {style: {}, content: [], dataType: "layout", domName: "div", cssName: this.GetCssName("itemColumnSpaceLine", d)};
            b.style.width = 1;
            b.style.height = a;
            b.style["border-style"] = d.itemColumnBorderStyle;
            if (d.itemColumnBorderColor.toString() === "-1") {
                b.style["border-color"] = "#" + d.containerBorderColor
            } else {
                b.style["border-color"] = "#" + d.itemColumnBorderColor
            }
            b.style["border-width"] = 0;
            b.style["border-left-width"] = d.itemColumnBorderWidth;
            b.style["margin-left"] = Math.floor(e / 2) - 1;
            b.style.overflow = "hidden";
            f.content.push(b)
        }
        return f
    }, layoutRowSpace: function (f, a, e) {
        var c = {style: {}, content: [], dataType: "layout", domName: "div", cssName: this.GetCssName("itemRowSpace", e)};
        var d = c.style;
        d.width = f;
        d.height = a;
        d.clear = "both";
        d.overflow = "hidden";
        if (e.itemRowBorderWidth) {
            var b = {style: {}, content: [], dataType: "layout", domName: "div", cssName: this.GetCssName("itemRowSpaceLine", e)};
            b.style.width = f;
            b.style.height = 1;
            b.style["border-style"] = e.itemRowBorderStyle;
            if (e.itemRowBorderColor.toString() === "-1") {
                b.style["border-color"] = "#" + e.containerBorderColor
            } else {
                b.style["border-color"] = "#" + e.itemRowBorderColor
            }
            b.style["border-width"] = 0;
            b.style["border-top-width"] = e.itemRowBorderWidth;
            b.style["margin-top"] = Math.floor(a / 2) - 1;
            b.style.overflow = "hidden";
            c.content.push(b)
        }
        return c
    }, layoutSpace: function (a, e, d) {
        var f = this.layoutColumnSpace(d.itemColumnSpace, e.style.height, d);
        var b = this.layoutRowSpace(a.style.width, d.itemRowSpace, d);
        var g, c;
        for (g = 0; g < d.adRowCount; g++) {
            for (c = 0; c < d.adColumnCount; c++) {
                a.content.push(e);
                if (c != d.adColumnCount - 1) {
                    a.content.push(f)
                }
            }
            if (g != d.adRowCount - 1) {
                a.content.push(b)
            }
        }
        return a
    }, calculateLogo: function (d, b, c) {
        var a = {height: 0, width: 0};
        a.height = b > 64 ? 64 : b;
        a.width = a.height + c.logoPaddingLeft + c.logoPaddingRight;
        return a
    }, calculateImage: function (d, b, c) {
        var a = {height: 0, width: 0};
        a.height = b;
        a.width = d;
        return a
    }, calculateFlash: function (d, b, c) {
        var a = {height: 0, width: 0};
        a.height = b;
        a.width = d;
        return a
    }, calculateTitle: function (f, c, e) {
        var a = {height: 0, width: 0};
        a.width = e.titleWidth !== -1 ? e.titleWidth : f - e.titleFrontIconWidth;
        var g = this.calculateTitleLineHeight(e);
        var d = 1;
        if ((c > 60 && f <= 120) || (c > 110 && f <= 180)) {
            d = 2
        }
        var b = e.titleRowCount > 0 ? e.titleRowCount : d;
        a.height = g * b + e.titlePaddingTop + e.titlePaddingBottom;
        return a
    }, calculateUrl: function (f, d, e) {
        var a = {height: 0, width: 0};
        a.width = f;
        var b = this.calculateUrlLineHeight(e);
        var c = e.urlRowCount > 0 ? e.urlRowCount : 1;
        a.height = b * c + e.urlPaddingTop + e.urlPaddingBottom;
        return a
    }, calculateTitleRowCount: function (d, b) {
        var a;
        var c = this.calculateTitleLineHeight(b);
        a = Math.floor((d - b.titlePaddingTop - b.titlePaddingBottom) / c);
        a = a >= 2 ? 2 : a;
        return a
    }, calculateDescRowCount: function (d, b) {
        var a;
        var c = this.calculateDescLineHeight(b);
        a = Math.floor((d - b.descPaddingTop - b.descPaddingBottom) / c);
        a = a > 4 ? 4 : a;
        return a
    }, calculateTitleLineHeight: function (b) {
        var a = b.titleLineHeight > 0 ? b.titleLineHeight : b.titleFontSize + 2;
        return a
    }, calculateDescLineHeight: function (b) {
        var a = b.descLineHeight > 0 ? b.descLineHeight : b.descFontSize + 2;
        return a
    }, calculateUrlLineHeight: function (b) {
        var a = b.urlLineHeight > 0 ? b.urlLineHeight : b.urlFontSize + 2;
        return a
    }}
});
declare(function () {
    return{name: "Flash", namespace: "Cpro.Template.LayoutEngine", layout: function (h) {
        var l = h.userConfig;
        var c = h.fullConfig;
        var i = true;
        var o = {};
        var q = using("Cpro.Template.LayoutEngine.Base");
        var e = c.templateWidth;
        var j = c.templateHeight;
        var f = q.layoutContainer(e, j, c);
        if (c.adRowCount == 1 && c.adColumnCount == 1) {
            f.style["text-align"] = "center"
        }
        var a = Math.floor((f.style.width - c.itemColumnSpace * (c.adColumnCount - 1)) / c.adColumnCount);
        var m = Math.floor((f.style.height - c.itemRowSpace * (c.adRowCount - 1)) / c.adRowCount);
        var p = q.layoutItem(a, m, c);
        var g = q.calculateFlash(p.style.width, p.style.height, c);
        var n = g.width;
        var b = g.height;
        var k = q.layoutFlash(n, b, c);
        o[k.dataKey] = k;
        p.content.push(k);
        var d = q.layoutColumnSpace(c.itemColumnSpace, m, c);
        var r = q.layoutRowSpace(a, c.itemRowSpace, c);
        f = q.layoutSpace(f, p, c);
        f.layoutIndex = o;
        return f
    }}
});
declare(function () {
    return IconLinkUnitLayoutEngine = {name: "IconLinkUnit", namespace: "Cpro.Template.LayoutEngine", layout: function (h) {
        var k = h.userConfig;
        var c = h.fullConfig;
        var i = true;
        var o = {};
        var q = using("Cpro.Template.LayoutEngine.Base");
        c.containerPaddingLeft = 0;
        c.containerPaddingRight = 0;
        c.containerPaddingTop = 0;
        c.containerPaddingBottom = 0;
        var f = c.templateWidth;
        var j = c.templateHeight;
        var g = q.layoutContainer(f, j, c);
        if (c.adRowCount == 1) {
            g.style["text-align"] = "center"
        }
        c.titlePaddingLeft = 0;
        c.titlePaddingRight = 0;
        c.titlePaddingTop = 0;
        c.titlePaddingBottom = 0;
        var l = 7 * c.titleFontSize;
        var d = c.titleFontSize + 4;
        c.titleLineHeight = c.titleFontSize + 4;
        c.titleFontFamily = decodeURIComponent(c.titleFontFamily);
        if (c.titleFontFamily !== decodeURIComponent("%E5%AE%8B%E4%BD%93")) {
            c.titleFontFamily += "," + decodeURIComponent("%E5%AE%8B%E4%BD%93")
        }
        if (c.adRowCount == 1) {
            c.titleTextAlign = "center"
        }
        var r = q.layoutTitle(l, d, c, "left");
        o[r.dataKey] = r;
        c.itemPaddingLeft = 6;
        c.itemPaddingRight = 6;
        c.itemPaddingTop = 1;
        c.itemPaddingBottom = 1;
        var b = 7 * c.titleFontSize + c.itemPaddingLeft + c.itemPaddingRight;
        var m = c.titleFontSize + 4 + c.itemPaddingTop + c.itemPaddingBottom;
        if (c.iconLinkUnitConfig) {
            var a = c.titleFontSize == 12 ? 15 : 16;
            var e = c.titleFontSize == 12 ? 12 : 15;
            c.titleFrontIconPaddingRight = 5;
            var n = q.layoutIcon(a, e, c);
            o[n.dataKey] = n;
            b = b + a + c.titleFrontIconPaddingRight
        }
        var p = q.layoutItem(b, m, c);
        if (c.iconLinkUnitConfig) {
            p.content.push(n)
        }
        p.content.push(r);
        if (c.adColumnCount > 1) {
            c.itemColumnSpace = Math.floor((c.templateWidth - 2 * c.containerBorderWidth - b * c.adColumnCount) / (c.adColumnCount - 1))
        } else {
            c.itemColumnSpace = c.templateWidth - 2 * c.containerBorderWidth - b * c.adColumnCount
        }
        if (c.adRowCount > 1) {
            c.itemRowSpace = Math.floor((c.templateHeight - 2 * c.containerBorderWidth - m * c.adRowCount) / (c.adRowCount - 1))
        } else {
            c.itemRowSpace = c.templateHeight - 2 * c.containerBorderWidth - m * c.adRowCount
        }
        g = q.layoutSpace(g, p, c);
        g.layoutIndex = o;
        return g
    }}
});
declare(function () {
    return{name: "Image", namespace: "Cpro.Template.LayoutEngine", layout: function (h) {
        var l = h.userConfig;
        var c = h.fullConfig;
        var i = true;
        var n = {};
        var q = using("Cpro.Template.LayoutEngine.Base");
        var f = c.templateWidth;
        var j = c.templateHeight;
        var g = q.layoutContainer(f, j, c);
        if (c.adRowCount == 1 && c.adColumnCount == 1) {
            g.style["text-align"] = "center"
        }
        var b = Math.floor((g.style.width - c.itemColumnSpace * (c.adColumnCount - 1)) / c.adColumnCount);
        var m = Math.floor((g.style.height - c.itemRowSpace * (c.adRowCount - 1)) / c.adRowCount);
        var o = q.layoutItem(b, m, c);
        var a = q.calculateImage(o.style.width, o.style.height, c);
        var p = a.height;
        var d = a.width;
        var k = q.layoutImage(d, p, c);
        n[k.dataKey] = k;
        o.content.push(k);
        var e = q.layoutColumnSpace(c.itemColumnSpace, m, c);
        var r = q.layoutRowSpace(b, c.itemRowSpace, c);
        g = q.layoutSpace(g, o, c);
        g.layoutIndex = n;
        return g
    }}
});
declare(function () {
    return LinkUnit1LayoutEngine = {name: "LinkUnit1", namespace: "Cpro.Template.LayoutEngine", layout: function (g) {
        var k = g.userConfig;
        var b = g.fullConfig;
        var h = true;
        var p = {};
        var r = using("Cpro.Template.LayoutEngine.Base");
        var e = b.templateWidth;
        var i = b.templateHeight;
        var f = r.layoutContainer(e, i, b);
        if (b.adRowCount == 1 && b.adColumnCount == 1) {
            f.style["text-align"] = "center"
        }
        var a = Math.floor((f.style.width - b.itemColumnSpace * (b.adColumnCount - 1)) / b.adColumnCount);
        var n = Math.floor((f.style.height - b.itemRowSpace * (b.adRowCount - 1)) / b.adRowCount);
        var q = r.layoutItem(a, n, b);
        if (b.titleFrontIconSrc) {
            var o = r.layoutIcon(b.titleFrontIconWidth, b.titleFrontIconHeight, b);
            q.content.push(o)
        }
        var m = r.calculateTitle(q.style.width, q.style.height, b);
        var l = m.width;
        var c = m.height;
        if (b.titleFrontIconSrc) {
            var j = "left";
            var t = r.layoutTitle(l, c, b, j)
        } else {
            var t = r.layoutTitle(l, c, b)
        }
        p[t.dataKey] = t;
        q.content.push(t);
        var d = r.layoutColumnSpace(b.itemColumnSpace, n, b);
        var s = r.layoutRowSpace(a, b.itemRowSpace, b);
        f = r.layoutSpace(f, q, b);
        f.layoutIndex = p;
        return f
    }}
});
declare(function () {
    return SingleLineLayoutEngine = {name: "SingleLine", namespace: "Cpro.Template.LayoutEngine", layout: function (m) {
        var p = m.userConfig;
        var h = m.fullConfig;
        var b = m.isRecursion;
        var n = true;
        var w = {};
        var z = using("Cpro.Template.LayoutEngine.Base");
        if (!p.itemRowSpace) {
            h.itemRowSpace = 7
        }
        if (!p.titlePaddingBottom) {
            h.titlePaddingBottom = 0
        }
        if (!p.titlePaddingRight) {
            h.titlePaddingRight = 5
        }
        if (!p.descPaddingRight) {
            h.descPaddingRight = 5
        }
        var k = h.templateWidth;
        var o = h.templateHeight;
        var l = z.layoutContainer(k, o, h);
        var e = Math.floor((l.style.width - h.itemColumnSpace * (h.adColumnCount - 1)) / h.adColumnCount);
        var s = Math.floor((l.style.height - h.itemRowSpace * (h.adRowCount - 1)) / h.adRowCount);
        var x = z.layoutItem(e, s, h);
        if (!p.titleWidth) {
            if (!h.urlIsShow && !h.descIsShow) {
                h.titleWidth = x.style.width
            } else {
                var d = Math.floor(2 * x.style.width / 5);
                d = d > 300 ? 300 : d;
                h.titleWidth = d
            }
        }
        var r = z.calculateTitle(x.style.width, x.style.height, h);
        var q = r.width;
        var i = x.style.height;
        var B = z.layoutTitle(q, i, h);
        B.domName = "span";
        B.style.display = "inline-block";
        B.style["text-overflow"] = h.titleIsShowEllipsis ? "ellipsis" : "clip";
        B.style["white-space"] = "nowrap";
        B.style["line-height"] = B.style.height;
        w[B.dataKey] = B;
        var t = 0;
        var g = i;
        if (h.urlIsShow) {
            if (!p.urlWidth) {
                var y = Math.floor(1 * x.style.width / 5);
                t = h.urlWidth = y < 100 ? 100 : y
            }
            var f = z.layoutUrl(t, g, h);
            f.domName = "span";
            f.style.display = "inline-block";
            f.style["text-overflow"] = h.urlIsShowEllipsis ? "ellipsis" : "clip";
            f.style["white-space"] = "nowrap";
            f.style["float"] = "none";
            f.style["line-height"] = f.style.height;
            w[f.dataKey] = f
        }
        var c = q;
        var a = i;
        if (!p.descWidth) {
            var v = e - q - t;
            c = h.descWidth = v = v < 0 ? 0 : v
        }
        var u = z.layoutDesc(c, a, h);
        u.domName = "span";
        u.style.display = "inline-block";
        u.style["text-overflow"] = h.descIsShowEllipsis ? "ellipsis" : "clip";
        u.style["white-space"] = "nowrap";
        u.style["float"] = "none";
        u.style["line-height"] = u.style.height;
        u.rowCount = 1;
        w[u.dataKey] = u;
        if (h.titleIsShow) {
            x.content.push(B)
        }
        if (h.descIsShow) {
            x.content.push(u)
        }
        if (h.urlIsShow > 0 || (h.urlIsShow === -1 && n)) {
            x.content.push(f)
        }
        var j = z.layoutColumnSpace(h.itemColumnSpace, s, h);
        var A = z.layoutRowSpace(e, h.itemRowSpace, h);
        l = z.layoutSpace(l, x, h);
        l.layoutIndex = w;
        return l
    }}
});
declare(function () {
    return{name: "SmartIdea", namespace: "Cpro.Template.LayoutEngine", symbolStyle: {style: {"padding-right": 2, cursor: "pointer"}}, suffixStyle: {style: {"font-size": 10, color: "#FFFFFF", "line-height": 9, display: "inline-block", width: 9, height: 9, position: "relative", left: "10px", "text-align": "center", cursor: "pointer"}}, noPriceStyle: {style: {"font-size": 14, color: "#FFFFFF", "line-height": 24, width: 80, display: "inline-block", position: "relative", "background-color": "#436CE9", "text-align": "center", cursor: "pointer"}}, layout: function (D) {
        var z = D.userConfig;
        var S = D.fullConfig;
        var B = D.isRecursion;
        var m = "left";
        var p = "left";
        var a = "blockLayout";
        var P = true;
        var N = S.urlIsShow;
        var f = {};
        var k = using("Cpro.Template.LayoutEngine.Base");
        var o = using("Cpro.Template.PaintEngine");
        var U = using("Cpro.Utility.CssBuilder");
        var n = S.templateWidth;
        var K = S.templateHeight;
        var y = k.layoutContainer(n, K, S);
        var g = Math.floor((y.style.width - S.itemColumnSpace * (S.adColumnCount - 1)) / S.adColumnCount);
        var O = Math.floor((y.style.height - S.itemRowSpace * (S.adRowCount - 1)) / S.adRowCount);
        var t = k.layoutItem(g, O, S);
        if (S.stuffType === "smartidea1") {
            P = false
        }
        if (t.style.height / t.style.width > 0.5 && t.style.height / t.style.width < 2) {
            a = "blockLayout"
        } else {
            if (t.style.height / t.style.width >= 2) {
                a = "verticalLayout"
            } else {
                a = "HorizontalLayout"
            }
        }
        if (S.stuffType === "smartidea2" && a === "blockLayout") {
            m = "right";
            p = "right"
        } else {
            if (a === "HorizontalLayout") {
                p = "right"
            }
        }
        var T, H, q = 2;
        if (a === "blockLayout") {
            T = Math.floor(t.style.height / (6.5 * 5)) * 5;
            H = Math.floor(T * q)
        } else {
            if (a === "HorizontalLayout") {
                H = Math.floor(t.style.width / 4);
                S.brandLogoPaddingTop = S.brandLogoPaddingTop > 0 ? S.brandLogoPaddingTop : 4;
                S.brandLogoPaddingBottom = S.brandLogoPaddingBottom > 0 ? S.brandLogoPaddingBottom : 4;
                if (t.style.height > 80 && t.style.width > 720) {
                    q = 3 / 2
                }
            } else {
                if (t.style.height > 500) {
                    q = 3 / 2
                }
                T = Math.round(t.style.height / 6);
                S.brandLogoPaddingLeft = S.brandLogoPaddingLeft > 0 ? S.brandLogoPaddingLeft : 19;
                S.brandLogoPaddingRight = S.brandLogoPaddingRight > 0 ? S.brandLogoPaddingRight : 19
            }
        }
        T = S.brandLogoHeight || T || t.style.height;
        H = S.brandLogoWidth || H || t.style.width;
        if (a === "HorizontalLayout") {
            var J = T - S.brandLogoPaddingTop - S.brandLogoPaddingBottom;
            var G = Math.floor(J * q);
            S.brandLogoPaddingLeft = S.brandLogoPaddingRight = H > G ? (H - G) / 2 : 0
        } else {
            if (a === "verticalLayout") {
                var G = H - S.brandLogoPaddingLeft - S.brandLogoPaddingRight;
                var J = Math.floor(G / q);
                S.brandLogoPaddingTop = S.brandLogoPaddingBottom = T > J ? (T - J) / 2 : 0
            }
        }
        var F = k.layoutBrandLogo(H, T, S, m);
        f[F.dataKey] = F;
        var v, c;
        if (a === "blockLayout") {
            S.logoPaddingTop = S.logoPaddingTop > 0 ? S.logoPaddingTop : 10;
            S.logoPaddingBottom = S.logoPaddingBottom > 0 ? S.logoPaddingBottom : 10;
            v = 0.5 * t.style.height + S.logoPaddingTop + S.logoPaddingBottom;
            if (S.stuffType === "smartidea2") {
                v = 0.6 * t.style.height;
                if (t.style.height <= 250 && t.style.height >= t.style.width) {
                    v -= T;
                    N = false
                }
            }
        } else {
            if (a === "HorizontalLayout") {
                S.logoPaddingTop = S.logoPaddingTop > 0 ? S.logoPaddingTop : 4;
                S.logoPaddingBottom = S.logoPaddingBottom > 0 ? S.logoPaddingBottom : 4;
                c = Math.round(t.style.width / 65) * 10
            } else {
                v = t.style.height / 3;
                S.logoPaddingLeft = S.logoPaddingLeft > 0 ? S.logoPaddingLeft : 19;
                S.logoPaddingRight = S.logoPaddingLeft
            }
        }
        v = S.logoHeight || v || t.style.height;
        c = S.logoWidth || c || t.style.width;
        if (a === "verticalLayout") {
            var l = c - S.logoPaddingLeft - S.logoPaddingRight;
            var V = S.logoImgHeight || l * 3 / 4;
            S.logoPaddingTop = (v - V - S.logoPaddingBottom > 0) ? Math.floor(v - V - S.logoPaddingBottom) : 0
        } else {
            var V = v - S.logoPaddingTop - S.logoPaddingBottom;
            var l = S.logoImgWidth || V * 4 / 3;
            S.logoPaddingLeft = S.logoPaddingRight = (c > l) ? Math.floor((c - l) / 2) : 0
        }
        var C = k.layoutLogo(Math.floor(c), Math.floor(v), S);
        f[C.dataKey] = C;
        var u, x;
        if (a === "blockLayout") {
            if (S.stuffType === "smartidea2") {
                x = t.style.width - H;
                if (t.style.height <= 250 && t.style.height >= t.style.width) {
                    x = t.style.width
                }
            }
        } else {
            if (a === "HorizontalLayout") {
                var M = 3;
                if (t.style.width > 800) {
                    M = 3.5
                }
                x = Math.round(t.style.width / (M * 2 * 10)) * 2 * 10
            }
        }
        S.descRowCount = S.descRowCount > 0 ? S.descRowCount : 1;
        u = k.calculateDescLineHeight(S) * S.descRowCount + S.descPaddingTop + S.descPaddingBottom;
        x = S.descWidth > 0 ? S.descWidth : (x || t.style.width);
        var L = S.titleFontSize * (22 / 2 + 1);
        if (S.stuffType === "smartidea2") {
            L = S.titleFontSize * (16 / 2 + 1);
            L = L > S.descFontSize * (20 / 2 + 1) ? L : S.descFontSize * (20 / 2 + 1)
        }
        var d = Math.floor((x - L) / 2);
        S.descPaddingLeft = S.titlePaddingLeft = S.descPaddingRight = S.titlePaddingRight = d > 0 ? d : 0;
        var E = k.layoutDesc(x, u, S, "left");
        f[E.dataKey] = E;
        var i, e, b;
        if (a === "blockLayout") {
            if (S.stuffType === "smartidea1") {
            } else {
                i = t.style.height - v;
                b = S.logoPaddingTop;
                if (t.style.height <= 250 && t.style.height >= t.style.width) {
                    i -= T
                }
            }
        } else {
            if (a === "HorizontalLayout") {
                b = 0
            } else {
                i = t.style.height - T - v;
                S.titlePaddingTop = S.titlePaddingTop > 0 ? S.titlePaddingTop : 5
            }
        }
        i = i || t.style.height;
        e = x || t.style.width;
        if (P) {
            i -= u
        }
        var A = k.calculateTitle(e, i, S);
        if ((typeof b) !== "undifine") {
            var j = i - A.height + b;
            if (j > 0) {
                var I = S.titlePaddingTop;
                S.titlePaddingTop = Math.floor(j / 2);
                A.height += S.titlePaddingTop - I
            }
        }
        i = A.height;
        e = A.width;
        var w = k.layoutTitle(A.width, A.height, S, "left");
        f[w.dataKey] = w;
        var s, R;
        if (a === "blockLayout") {
            if (S.stuffType === "smartidea1") {
                s = t.style.height - v - T - i;
                s = s > 0 ? s : 0;
                if (S.urlPaddingBottom <= 0) {
                    if (t.style.height >= 298) {
                        S.urlPaddingBottom = 19
                    } else {
                        if (t.style.height >= 248) {
                            S.urlPaddingBottom = 14
                        } else {
                            S.urlPaddingBottom = 9
                        }
                    }
                }
            } else {
                s = t.style.height - v - T;
                R = H;
                s = 30 + S.urlPaddingBottom + S.urlPaddingTop
            }
        } else {
            if (a === "HorizontalLayout") {
                R = t.style.width - H - c - x;
                if (S.stuffType === "smartidea2") {
                    S.urlPaddingLeft = 10
                }
            } else {
                s = t.style.height - v - T - i;
                if (P) {
                    s -= u
                }
                s = s > 0 ? s : 0;
                if (S.urlPaddingBottom <= 0) {
                    if (t.style.height >= 500) {
                        S.urlPaddingBottom = 119
                    } else {
                        if (t.style.height >= 300) {
                            S.urlPaddingBottom = 64
                        } else {
                            S.urlPaddingBottom = 34
                        }
                    }
                }
            }
        }
        s = s || t.style.height;
        R = R || t.style.width;
        var r = k.calculateUrlLineHeight(S);
        if (S.urlPaddingBottom > 0) {
            S.urlPaddingTop = (s - S.urlPaddingBottom - r) >= 0 ? (s - S.urlPaddingBottom - r) : 0;
            S.urlPaddingBottom = (s - S.urlPaddingTop - r) >= 0 ? (s - S.urlPaddingTop - r) : 0
        } else {
            if (a === "HorizontalLayout") {
                S.urlPaddingTop = S.urlPaddingBottom = Math.floor((s - r) / 2)
            }
        }
        var h = k.layoutUrl(R, s, S, p);
        f[h.dataKey] = h;
        E.style["word-wrap"] = w.style["word-wrap"] = "break-word";
        E.style["word-break"] = w.style["word-break"] = "break-all";
        this.symbolStyle.style["font-size"] = S.symbolSize || 12;
        if (a === "verticalLayout") {
            this.suffixStyle.style.left = "3px"
        }
        this.suffixStyle.style["background-color"] = "#" + S.urlFontColor;
        this.suffixStyle.style.top = "-" + Math.floor(S.urlFontSize / 4) + "px";
        if (R < 80) {
            this.noPriceStyle.style.width = 60;
            this.noPriceStyle.style["font-size"] = 12
        }
        var Q = o.getStyle("symbol", this.symbolStyle);
        Q += o.getStyle("suffix", this.suffixStyle);
        Q += o.getStyle("noPrice", this.noPriceStyle);
        U.addCss(Q);
        if ((a === "blockLayout" && S.stuffType === "smartidea1") || a === "verticalLayout") {
            t.content.push(F);
            t.content.push(C);
            t.content.push(w);
            if (P) {
                t.content.push(E)
            }
            if (N) {
                t.content.push(h)
            }
            f.item = t
        } else {
            if (a === "blockLayout" && S.stuffType === "smartidea2") {
                t.content.push(F);
                t.content.push(w);
                if (P) {
                    t.content.push(E)
                }
                if (N) {
                    t.content.push(h)
                }
                t.content.push(C);
                f.item = t
            } else {
                if (a === "HorizontalLayout") {
                    t.content.push(F);
                    t.content.push(C);
                    if (S.stuffType === "smartidea2") {
                        t.content.push(h)
                    }
                    t.content.push(w);
                    if (P) {
                        t.content.push(E)
                    }
                    if (S.stuffType === "smartidea1") {
                        t.content.push(h)
                    }
                    f.item = t
                }
            }
        }
        y = k.layoutSpace(y, t, S);
        y.layoutIndex = f;
        return y
    }}
});
declare(function () {
    return TextLayoutEngine = {name: "Text", namespace: "Cpro.Template.LayoutEngine", layout: function (l) {
        var p = l.userConfig;
        var g = l.fullConfig;
        var b = l.isRecursion;
        var n = true;
        var v = {};
        var x = using("Cpro.Template.LayoutEngine.Base");
        var j = g.templateWidth;
        var o = g.templateHeight;
        var k = x.layoutContainer(j, o, g);
        var d = Math.floor((k.style.width - g.itemColumnSpace * (g.adColumnCount - 1)) / g.adColumnCount);
        var s = Math.floor((k.style.height - g.itemRowSpace * (g.adRowCount - 1)) / g.adRowCount);
        var w = x.layoutItem(d, s, g);
        var r = x.calculateTitle(w.style.width, w.style.height, g);
        var q = g.itemRightImage ? r.width - 3 : r.width;
        var h = r.height;
        var B = x.layoutTitle(q, h, g);
        v[B.dataKey] = B;
        var m = x.calculateUrl(w.style.width, w.style.height, g);
        var t = g.itemRightImage ? m.width - 3 : m.width;
        var f = m.height;
        var e = x.layoutUrl(t, f, g);
        v[e.dataKey] = e;
        var c = g.itemRightImage ? w.style.width - 3 : w.style.width;
        var a = w.style.height - h - f;
        var z = x.calculateDescRowCount(a, g);
        if (typeof p.urlIsShow === "undefined") {
            if (z < 1 || (z < 2 && c < 450)) {
                n = false;
                a = w.style.height - h
            }
        }
        if (!b && (typeof p.urlIsShow === "undefined") && !n && (typeof p.itemRowSpace === "undefined")) {
            g.itemRowSpace = 4;
            if (typeof p.titlePaddingBottom === "undefined") {
                g.titlePaddingBottom = 1
            }
            g.titlePadding;
            l.isRecursion = true;
            return this.layout(l)
        }
        var u = x.layoutDesc(c, a, g);
        v[u.dataKey] = u;
        if (g.titleIsShow) {
            w.content.push(B)
        }
        if (g.descIsShow) {
            w.content.push(u)
        }
        if (g.urlIsShow > 0 || (g.urlIsShow === -1 && n)) {
            w.content.push(e)
        }
        if (g.itemRightImage) {
            var y = x.layoutRightImage(g.itemRightImageWidth, g.itemRightImageHeight, w.style.width, w.style.height, g);
            w.content.push(y)
        }
        var i = x.layoutColumnSpace(g.itemColumnSpace, s, g);
        var A = x.layoutRowSpace(d, g.itemRowSpace, g);
        k = x.layoutSpace(k, w, g);
        k.layoutIndex = v;
        return k
    }}
});
declare(function () {
    return{name: "Tuwen", namespace: "Cpro.Template.LayoutEngine", layout: function (o) {
        var s = o.userConfig;
        var h = o.fullConfig;
        var b = o.isRecursion;
        var q = true;
        var B = {};
        var D = using("Cpro.Template.LayoutEngine.Base");
        var m = h.templateWidth;
        var r = h.templateHeight;
        var n = D.layoutContainer(m, r, h);
        var e = Math.floor((n.style.width - h.itemColumnSpace * (h.adColumnCount - 1)) / h.adColumnCount);
        var w = Math.floor((n.style.height - h.itemRowSpace * (h.adRowCount - 1)) / h.adRowCount);
        if (h.adRowCount == 1 && h.adColumnCount == 1) {
            e = e > 500 ? 500 : e
        }
        var C = D.layoutItem(e, w, h);
        if (C.style.height <= 60 || h.scale != "") {
            if (h.scale == "20.3") {
                var t = D.calculateLogo(C.style.width, C.style.height, h);
                var i = t.height;
                var y = t.width + h.logoPaddingRight + h.logoPaddingLeft
            } else {
                var i = y = C.style.height;
                var i = y = C.style.height;
                y = y + h.logoPaddingRight + h.logoPaddingLeft
            }
            var d = D.layoutLogo(y, i, h);
            B[d.dataKey] = d;
            var v = D.calculateTitle(C.style.width - y, C.style.height, h);
            var u = v.width;
            var j = v.height;
            var G = D.layoutTitle(u, j, h, "left");
            B[G.dataKey] = G;
            var p = D.calculateUrl(u, i - j, h);
            var x = p.width;
            var g = p.height;
            var f = D.layoutUrl(x, g, h, "left");
            B[f.dataKey] = f;
            var c = u;
            var a = i - j - g;
            q = true;
            var E = D.calculateDescRowCount(a, h);
            if (E < 1 || (E === 1 && c <= 400)) {
                a = i - j;
                q = false
            }
            var A = D.layoutDesc(c, a, h, "left");
            B[A.dataKey] = A;
            C.content.push(d);
            C.content.push(G);
            C.content.push(A);
            if (q && h.urlIsShow != "-1") {
                C.content.push(f)
            }
            C.style["inner-height"] = i;
            B.item = C
        } else {
            var v = D.calculateTitle(C.style.width, C.style.height, h);
            var u = v.width;
            var j = v.height;
            var G = D.layoutTitle(u, j, h);
            B[G.dataKey] = G;
            var z = C.style.height - G.style["outer-height"];
            var p = D.calculateUrl(C.style.width, C.style.height, h);
            var x = p.width;
            var g = p.height;
            if (z - g >= 64) {
                var f = D.layoutUrl(x, g, h);
                B[f.dataKey] = f;
                var t = D.calculateLogo(C.style.width, C.style.height - j - g, h);
                var i = t.height;
                var y = t.width;
                var d = D.layoutLogo(y, i, h);
                B[d.dataKey] = d;
                var c = C.style.width - y;
                var a = i;
                var A = D.layoutDesc(c, a, h, "left");
                B[A.dataKey] = A;
                C.style["inner-height"] = j + i + g;
                B.item = C
            } else {
                var t = D.calculateLogo(C.style.width, C.style.height - j, h);
                var i = t.height;
                var y = t.width;
                var d = D.layoutLogo(y, i, h);
                B[d.dataKey] = d;
                var p = D.calculateUrl(C.style.width - y, C.style.height, h);
                var x = p.width;
                var g = p.height;
                var f = D.layoutUrl(x, g, h, "left");
                B[f.dataKey] = f;
                var c = C.style.width - y;
                var a = i - g;
                q = true;
                if (D.calculateDescRowCount(a, h) < 2) {
                    a = i;
                    q = false
                }
                var A = D.layoutDesc(c, a, h, "left");
                B[A.dataKey] = A;
                C.style["inner-height"] = j + i;
                B.item = C
            }
            C.content.push(G);
            C.content.push(d);
            C.content.push(A);
            if (q) {
                C.content.push(f)
            }
        }
        var k = D.layoutColumnSpace(h.itemColumnSpace, w, h);
        var F = D.layoutRowSpace(e, h.itemRowSpace, h);
        n = D.layoutSpace(n, C, h);
        n.layoutIndex = B;
        if (h.adRowCount == 1 && h.adColumnCount == 1) {
            C.style["margin-left"] = parseInt((n.style.width - e) / 2)
        }
        if (!h.itemVerticalAlign || h.itemVerticalAlign === -1) {
            var l = C.style["outer-height"] - C.style["inner-height"];
            if (l > 50) {
                C.style.height = C.style["inner-height"];
                C.style["padding-top"] = C.style["padding-bottom"] = parseInt(l / 2)
            }
        }
        return n
    }}
});
declare(function () {
    return{name: "Cookie", namespace: "Cpro.Utility", getCookie: function (b, f) {
        var a;
        var f = f || window;
        var e = f.document;
        var c = new RegExp("(^| )" + b + "=([^;]*)(;|\x24)");
        var d = c.exec(e.cookie);
        if (d) {
            a = d[2]
        }
        return a
    }, setCookie: function (c, d, b) {
        b = b || {};
        var a = b.expires;
        if ("number" == typeof b.expires) {
            a = new Date();
            a.setTime(a.getTime() + b.expires)
        }
        document.cookie = c + "=" + d + (b.path ? "; path=" + b.path : "") + (a ? "; expires=" + a.toGMTString() : "") + (b.domain ? "; domain=" + b.domain : "") + (b.secure ? "; secure" : "")
    }}
});
declare(function () {
    return{name: "CssBuilder", namespace: "Cpro.Utility", g: function (b, a) {
        a = a || window;
        if ("string" === typeof b || b instanceof String) {
            return a.document.getElementById(b)
        } else {
            if (b && b.nodeName && (b.nodeType == 1 || b.nodeType == 9)) {
                return b
            }
        }
        return b
    }, getDocument: function (a) {
        if (!a) {
            return document
        }
        a = this.g(a);
        return a.nodeType == 9 ? a : a.ownerDocument || a.document
    }, addCss: function (d) {
        var e = document;
        var b = e.createElement("style");
        b.setAttribute("type", "text/css");
        if (b.styleSheet) {
            b.styleSheet.cssText = d
        } else {
            var a = e.createTextNode(d);
            b.appendChild(a)
        }
        var c = e.getElementsByTagName("head");
        if (c.length) {
            c[0].appendChild(b)
        } else {
            e.documentElement.appendChild(b)
        }
    }, getStyle: function (c, b) {
        var a;
        c = this.g(c);
        var e = this.getDocument(c);
        var f = "";
        if (b.indexOf("-") > -1) {
            f = b.replace(/[-_][^-_]{1}/g, function (g) {
                return g.charAt(1).toUpperCase()
            })
        } else {
            f = b.replace(/[A-Z]{1}/g, function (g) {
                return"-" + g.charAt(0).toLowerCase()
            })
        }
        var d;
        if (e && e.defaultView && e.defaultView.getComputedStyle) {
            d = e.defaultView.getComputedStyle(c, null);
            if (d) {
                a = d.getPropertyValue(b)
            }
            if (typeof a !== "boolean" && !a) {
                a = d.getPropertyValue(f)
            }
        } else {
            if (c.currentStyle) {
                d = c.currentStyle;
                if (d) {
                    a = d[b]
                }
                if (typeof a !== "boolean" && !a) {
                    a = d[f]
                }
            }
        }
        return a
    }}
});
declare(function () {
    return{name: "Encoder", namespace: "Cpro.Utility", encodeHTML: function (a) {
        return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\/g, "&#92;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
    }, encodeReg: function (a) {
        return String(a).replace(/([.*+?^=!:${}()|[\]/\\])/
        g, "\\$1"
        )
    }, encodeEventHTML: function (a) {
        return String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/\\\\/g, "\\").replace(/\\\//g, "/").replace(/\\n/g, "\n").replace(/\\r/g, "\r")
    }}
});
declare(function () {
    return{
        name: "Log",
        namespace: "Cpro.Utility",
        sendByIframe: function (a) {
            var b = document.createElement("iframe");
            b.id = "ifr" + parseInt(Math.random() * 100000);
            b.style.display = "none";
            b.setAttribute("src", a);
            document.body.insertBefore(b, document.body.firstChild)
        },
        sendByImage: function (b, d) {
        var a = new Image();
        var c = "cpro_log_" + Math.floor(Math.random() * 2147483648).toString(36);
        d = d || window;
        d[c] = a;
        a.onload = a.onerror = a.onabort = function () {
            a.onload = a.onerror = a.onabort = null;
            d[c] = null;
            a = null
        };
        a.src = b
    }}
});