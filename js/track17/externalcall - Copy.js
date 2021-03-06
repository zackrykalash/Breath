(function (g) {
    var p = 1;
    var j = "//www.17track.net";
    var s = 244;
    var l = 203;
    var n = (function () {
        if (document.addEventListener) {
            return function (w, v, u) {
                if (w.length && w !== g) {
                    for (var t = 0; t < w.length; t++) {
                        n(w[t], v, u)
                    }
                } else {
                    w.addEventListener(v, u, false)
                }
            }
        } else {
            return function (w, v, u) {
                if (w.length && w !== g) {
                    for (var t = 0; t < w.length; t++) {
                        n(w[t], v, u)
                    }
                } else {
                    w.attachEvent("on" + v, function () {
                        return u.call(w, g.event)
                    })
                }
            }
        }
    })();

    function d() {
        var t = this.handlers = {};
        n(g, "message", function (v) {
            v = v || g.event;
            var u = q(v.data);
            var w = u.id;
            if (w && t[w]) {
                t[w](u)
            }
        })
    }
    d.prototype = {
        registerHandler: function (t, u) {
            this.handlers[t] = u
        }
    };
    var k = new d();

    function e(z, A, u) {
        var t = z && z.nodeName && z.nodeName.toUpperCase() === "IFRAME";
        if (!t || (typeof A !== "function")) {
            return
        }
        var x = z.contentWindow;
        var y = z.getAttribute("fid"),
            w;
        if (x && x.postMessage) {
            if (!y) {
                y = "iframe-" + (p++);
                z.setAttribute("fid", y)
            }
            k.registerHandler(y, A);
            u ? setInterval(v, u) : v()
        }

        function v() {
            x.postMessage('{"id":"' + y + '","command":"getBodySize"}', "*")
        }
    }

    function h(t) {
        var u = null;
        e(t, function (v) {
            if (v.height && u !== v.height) {
                t.setAttribute("height", v.height);
                u = v.height
            }
        }, 1000)
    }

    function q(y) {
        if (!y || (typeof y !== "string")) {
            return {}
        }
        var w;
        var v = {};
        var u = y.split("&");
        for (var x = 0, t = u ? u.length : 0; x < t; x++) {
            w = u[x].split("=");
            v[w[0]] = w[1]
        }
        return v
    }
    var o = {
        byId: function (t) {
            return t && t.tagName ? t : document.getElementById(t)
        },
        byClass: function (y, x) {
            if (x.getElementsByClass) {
                return (x || document).getElementsByClass(y)
            } else {
                var w = [];
                var v = new RegExp("(^| )" + y + "( |$)");
                var t = this.byTagName("*", x);
                for (var u = 0; u < t.length; u++) {
                    v.test(t[u].className) && w.push(t[u])
                }
                return w
            }
        },
        byName: function (t) {
            return document.getElementsByName(t)
        },
        byTagName: function (t, u) {
            return (u || document).getElementsByTagName(t)
        },
        hasClass: function (u, t) {
            return u.className.match(new RegExp("(\\s|^)" + t + "(\\s|$)"))
        },
        addClass: function (u, t) {
            if (!this.hasClass(u, t)) {
                u.className += " " + t
            }
        },
        removeClass: function (v, t) {
            if (this.hasClass(v, t)) {
                var u = new RegExp("(\\s|^)" + t + "(\\s|$)");
                v.className = v.className.replace(u, " ")
            }
        },
        offset: function (v) {
            var t = v.offsetLeft,
                u = v.offsetTop,
                w = v.offsetParent;
            while (w !== null) {
                t += w.offsetLeft;
                u += w.offsetTop;
                w = w.offsetParent
            }
            return {
                left: t,
                top: u
            }
        },
        winSize: function () {
            var t, u;
            if (g.innerWidth) {
                t = g.innerWidth;
                u = g.innerHeight
            } else {
                if (document.body && document.body.clientWidth) {
                    t = document.body.clientWidth;
                    u = document.body.clientHeight
                }
            }
            if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight) {
                t = document.documentElement.clientWidth;
                u = document.documentElement.clientHeight
            }
            return {
                width: t,
                height: u
            }
        },
        followPos: function (A, z) {
            var u = A;
            var C, B;
            var w = o.offset(u);
            var t = w.left;
            var x = w.top;
            var y = u.clientWidth;
            var D = z;
            var v = o.winSize().width;
            if (t < v / 2) {
                if (D > v - t) {
                    C = v - D
                } else {
                    C = t
                }
            } else {
                if (t + y > D) {
                    C = t - D + y
                } else {
                    C = 0
                }
            }
            return C
        }
    };
    var a = {
        css: function (v) {
            if (!v || v.length === 0) {
                throw new Error('argument "path" is required !')
            }
            var t = document.getElementsByTagName("head")[0];
            var u = document.createElement("link");
            u.href = v;
            u.rel = "stylesheet";
            u.type = "text/css";
            t.appendChild(u)
        },
        js: function (t, y) {
            if (typeof (t) != "object") {
                var t = [t]
            }
            var x = document.getElementsByTagName("head").item(0) || document.documentElement;
            var v = new Array(),
                w = t.length - 1,
                u = function (z) {
                    v[z] = document.createElement("script");
                    v[z].setAttribute("type", "text/javascript");
                    v[z].onload = v[z].onreadystatechange = function () {
                        if (this.readyState == "loaded" || this.readyState == "complete" || !this.readyState) {
                            this.onload = this.onreadystatechange = null;
                            this.parentNode.removeChild(this);
                            if (z != w) {
                                u(z + 1)
                            } else {
                                if (typeof (y) == "function") {
                                    y()
                                }
                            }
                        }
                    };
                    v[z].setAttribute("src", t[z]);
                    x.appendChild(v[z])
                };
            u(0)
        }
    };
    var b = false;
    var c = g.YQV5 = {
        trackSingle: function (v) {
            var u = v.YQ_Num;
            var y = v.YQ_Lang || f();
            var x = v.YQ_Fc || 0;
            if (!u) {
                if (b) {
                    alert(V5.ResGTrackRelated.global.__editorTrack_msgNull)
                } else {
                    a.js([j + "/res/global/resjs/globaltrackrelated/resgtrackrelated." + y + ".js"], function () {
                        b = true;
                        alert(V5.ResGTrackRelated.global.__editorTrack_msgNull)
                    })
                }
            }
            var w = /^[A-Za-z0-9\s]+$/;
            var t = u.match(w);
            if (!t) {
                if (b) {
                    alert(V5.ResGTrackRelated.global.__editorTrack_msgIllegal)
                } else {
                    a.js([j + "/res/global/resjs/globaltrackrelated/resgtrackrelated." + y + ".js"], function () {
                        b = true;
                        alert(V5.ResGTrackRelated.global.__editorTrack_msgIllegal)
                    })
                }
                return false
            }
            if (t[0].length > 50) {
                if (b) {
                    alert(V5.ResGTrackRelated.global.__editorTrack_msgCharacter)
                } else {
                    a.js([j + "/res/global/resjs/globaltrackrelated/resgtrackrelated." + y + ".js"], function () {
                        b = true;
                        alert(V5.ResGTrackRelated.global.__editorTrack_msgCharacter)
                    })
                }
                return false
            }
            m({
                YQ_ContainerId: v.YQ_ContainerId,
                YQ_Width: v.YQ_Width,
                YQ_Height: v.YQ_Height,
                YQ_Lang: v.YQ_Lang,
                YQ_Fc: x,
                YQ_Num: t
            })
        },
        trackMulti: function (v) {
            var u = o.byId(v.YQ_ContainerId);
            if (u) {
                var w = v.YQ_Width || "100%";
                var t = v.YQ_Height || 300;
                var y = v.YQ_Lang || f();
                var x = document.createElement("iframe");
                x.setAttribute("src", j + "/" + y + "/externalcall/multiline");
                x.setAttribute("width", w);
                x.setAttribute("min-height", t);
                x.setAttribute("frameBorder", 0);
                u.appendChild(x);
                h(x)
            }
        },
        trackSingleF1: function (u) {
            var t = o.byId(u.YQ_ElementId);
            if (t) {
                n(t, "click", function () {
                    var y = u.YQ_Width;
                    var A = u.YQ_Height;
                    var z = u.YQ_Lang || "en";
                    var v = u.YQ_Num;
                    var x = u.YQ_Fc || 0;
                    var B = o.offset(t).top + t.offsetHeight + 30;
                    var C = o.byName("iframe_trackSingleF1");
                    for (var w = 0; w < C.length; w++) {
                        if (C[w] && C[w].innerHTML) {
                            C[w].style.display = "none";
                            C[w].style.zIndex = C[w].style.zIndex - 1
                        }
                    }
                    var D = o.byId("jcTrkApiDialog_" + v);
                    if (D) {
                        var E = o.followPos(t, y);
                        D.style.display = "block";
                        D.style.zIndex = D.style.zIndex + 1;
                        D.style.left = E + "px"
                    } else {
                        i({
                            top: B,
                            YQ_Width: y,
                            YQ_Height: A,
                            YQ_Lang: z,
                            YQ_Num: v,
                            YQ_Fc: x,
                            follow: t
                        })
                    }
                })
            }
        },
        trackSingleF2: function (w) {
            var v = w;
            var t = o.byId(w.YQ_ElementId);
            if (t) {
                var y = o.offset(t).top + t.offsetHeight + 30;
                var z = w.YQ_Lang || f();
                var u = w.YQ_Num;
                var x = w.YQ_Fc || 0;
                if (!u) {
                    a.js([j + "/res/global/resjs/globaltrackrelated/resgtrackrelated." + z + ".js"], function () {
                        alert(V5.ResGTrackRelated.global.__editorTrack_msgNull)
                    })
                } else {
                    i({
                        top: y,
                        YQ_Width: v.YQ_Width,
                        YQ_Height: v.YQ_Height,
                        YQ_Lang: z,
                        YQ_Num: u,
                        YQ_Fc: x,
                        follow: t
                    })
                }
            }
        },
        trackEvent: function () {
            var v = o.byId("jsTrkApi1");
            var u = o.byClass("ex-input", v)[0];
            var x = o.byClass("input-num", v)[0];
            var t = o.byClass("trk-del", v)[0];
            var w = o.byClass("trk-btn", v)[0];
            n(x, "focus", function () {
                o.addClass(u, "focus")
            });
            n(x, "blur", function () {
                o.removeClass(u, "focus")
            });
            n(x, "keyup", function () {
                var y = x.value;
                if (y.length > 0) {
                    t.style.display = "block"
                } else {
                    t.style.display = "none"
                }
            });
            n(t, "click", function () {
                x.value = ""
            });
            return v, u, x, t, w
        }
    };
    chineseLanguage = [{
        key: "zh-hk",
        value: "zh-hk"
    }, {
        key: "zh-mo",
        value: "zh-hk"
    }, {
        key: "zh-sg",
        value: "zh-hk"
    }, {
        key: "zh-tw",
        value: "zh-hk"
    }, {
        key: "zh-cht",
        value: "zh-hk"
    }, {
        key: "zh-cn",
        value: "zh-cn"
    }, {
        key: "zh-chs",
        value: "zh-cn"
    }];

    function f() {
        var x;
        var w = g.location.pathname;
        var u = false;
        if (w.length > 1) {
            var t = w.split("/");
            x = t[1]
        } else {
            if (r("v5_Culture")) {
                x = r("v5_Culture")
            } else {
                x = navigator.language;
                if (!x) {
                    x = navigator.browserLanguage
                }
                for (var v = 0; v < chineseLanguage.length; v++) {
                    if (x == chineseLanguage[v].key) {
                        x = chineseLanguage[v].value;
                        break
                    }
                }
                if (!x) {
                    x = "en"
                }
            }
        }
        return x.toLowerCase()
    }

    function r(u) {
        var t, v = new RegExp("(^| )" + u + "=([^;]*)(;|$)");
        if (t == document.cookie.match(v)) {
            return unescape(t[2])
        } else {
            return null
        }
    }

    function m(C) {
        var B = C.YQ_ContainerId;
        var y = o.byId(B);
        var A;
        var z = (C.YQ_Height && C.YQ_Height > 0) ? C.YQ_Height : y.style.height;
        var v = C.YQ_Lang || f();
        var t = C.YQ_Num.toString().replace(/(^\s*)|(\s*$)/g, "");
        var u = C.YQ_Fc || 0;
        if (z > 800) {
            z = 800
        }
        var x = z - s;
        v = v.toLowerCase();
        if (document.getElementById("trackIframe") != null) {
            document.getElementById("trackIframe").src = j + "/" + v + "/externalcall?resultDetailsH=" + x + "&nums=" + t + "&fc=" + u
        } else {
            if (o.byId(B)) {
                var w = document.createElement("iframe");
                w.setAttribute("src", j + "/" + v + "/externalcall?resultDetailsH=" + x + "&nums=" + t + "&fc=" + u);
                w.setAttribute("width", "100%");
                w.setAttribute("id", "trackIframe");
                w.setAttribute("height", l);
                w.setAttribute("frameBorder", 0);
                o.byId(B).style.display = "block";
                o.byId(B).appendChild(w);
                h(w)
            }
        }
    }

    function i(G) {
        var E, v, C, w, t, B, A, z, u;
        E = G.top;
        v = G.YQ_Width || 800;
        C = G.YQ_Height || 400;
        if (C > 800) {
            C = 800
        }
        w = G.YQ_Lang || f();
        t = G.YQ_Num.toString().replace(/(^\s*)|(\s*$)/g, "");
        u = G.YQ_Fc || 0;
        var F = o.followPos(G.follow, v);
        z = C - s;
        B = document.createElement("div");
        B.id = "jcTrkApiDialog_" + t;
        B.setAttribute("name", "iframe_trackSingleF1");
        B.className = "jcTrkApiDialog";
        B.style.zIndex = 99999;
        B.style.position = "absolute";
        B.style.width = v + "px";
        B.style.height = l + "px";
        B.style.left = F + "px";
        B.style.top = E + "px";
        B.style.background = "#fff";
        B.style.boxShadow = "0 1px 5px 3px rgba(0,0,0,.24)";
        B.style.display = "none";
        overbg = "#BDBDBD";
        outbg = "#e3e3e3";
        B.innerHTML = '<a class="jaTrkApiClose" onmouseover="this.style.backgroundColor=' + "'" + overbg + "'" + '" onmouseout="this.style.backgroundColor=' + "'" + outbg + "'" + '" style="position: absolute; right: 0px; top: -28px; width:28px; height:28px; line-height:28px; background:#e3e3e3; color: #212121; font-size: 24px; text-align:center; font-family: Arial,Helvetica,sans-senif; z-index: 100; cursor: pointer;">×</a>';
        A = document.createElement("iframe");
        A.style.position = "absolute";
        A.style.left = "0px";
        A.style.top = "0px";
        A.setAttribute("width", "100%");
        A.setAttribute("height", "100%");
        A.setAttribute("frameBorder", 0);
        A.setAttribute("src", j + "/" + w + "/externalcall?resultDetailsH=" + z + "&nums=" + t + "&fc=" + u);
        B.appendChild(A);
        var D = o.byClass("jaTrkApiLoad", B)[0];
        if (A.attachEvent) {
            A.attachEvent("onload", function () {
                D.style.display = "none"
            })
        } else {
            A.onload = function () {
                D.style.display = "none"
            }
        }
        document.body.appendChild(B);
        B.style.display = "block";
        var x = o.byClass("jaTrkApiClose", B)[0];
        n(x, "click", function () {
            B.style.display = "none"
        });
        var y = null;
        e(A, function (H) {
            if (H.height && y !== H.height) {
                B.style.height = H.height + "px";
                y = H.height
            }
        }, 1000)
    }
    g.yqtrack_v4 = function (w) {
        var u = w.container;
        var x = w.width;
        var t = w.height;
        var y = w.et || 0;
        var z = w.lng;
        var v = w.num;
        m({
            YQ_ContainerId: u,
            YQ_Height: t,
            YQ_Lang: z,
            YQ_Width: x,
            YQ_Num: v,
            YQ_Fc: y
        })
    }
})(window);
var YQTrackV5_Namespace = new Object();
YQTrackV5_Namespace.RegisterNamespace = function (fullNs) {
    var nsArray = fullNs.split(".");
    var sEval = "";
    var sNs = "";
    for (var i = 0; i < nsArray.length; i++) {
        if (i != 0) {
            sNs += "."
        }
        sNs += nsArray[i];
        sEval += "if (typeof(" + sNs + ") == 'undefined') " + sNs + " = new Object();"
    }
    if (sEval !== "") {
        eval(sEval)
    }
};
YQTrackV5_Namespace.RegisterNamespace("V5");

function Dictionary() {
    this.data = new Array();
    this.put = function (a, b) {
        if ($.isNumeric(a)) {
            a = Number(a)
        }
        this.data[a] = b
    };
    this.get = function (a) {
        if ($.isNumeric(a)) {
            a = Number(a)
        }
        try {
            return this.data[a]
        } catch (b) {
            return null
        }
    };
    this.remove = function (a) {
        this.data[a] = null
    };
    this.isEmpty = function () {
        return this.data.length == 0
    };
    this.size = function () {
        return this.data.length
    }
};