(() => {
  "use strict";
  var e = [
      ,
      (e, t, i) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Widget = void 0);
        const n = i(2),
          r = i(3),
          o = i(4);
        t.Widget = class {
          constructor(e, t) {
            (this.type = e), (this.params = t), this.setup();
          }
          setup() {
            (this.model = new r.WidgetModel((0, n.random)(10), this.params)),
              (this.iframeEvent = new o.IframeEvent(this.model, this.params)),
              (this.iframeWidget = new o.IframeWidget(this.type, this.model));
          }
          openWindow() {
            this.iframeWidget.open().then((e) => {
              this.iframeEvent.listen(this.iframeWidget, e);
            });
          }
        };
      },
      (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.random = void 0);
        t.random = (e = 5) => {
          for (var t = "", i = 0; i < e; i++)
            t +=
              "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
                Math.floor(62 * Math.random())
              ];
          return t;
        };
      },
      function (e, t) {
        var i =
          (this && this.__rest) ||
          function (e, t) {
            var i = {};
            for (var n in e)
              Object.prototype.hasOwnProperty.call(e, n) &&
                t.indexOf(n) < 0 &&
                (i[n] = e[n]);
            if (
              null != e &&
              "function" == typeof Object.getOwnPropertySymbols
            ) {
              var r = 0;
              for (n = Object.getOwnPropertySymbols(e); r < n.length; r++)
                t.indexOf(n[r]) < 0 &&
                  Object.prototype.propertyIsEnumerable.call(e, n[r]) &&
                  (i[n[r]] = e[n[r]]);
            }
            return i;
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.WidgetModel = void 0);
        t.WidgetModel = class {
          constructor(e, t) {
            (this.id = e), (this.params = t);
          }
          get widgetUrl() {
            return "https://widget.paychant.com";
          }
          get bgIframeId() {
            return `iframe-bg-${this.id}`;
          }
          get computedQuery() {
            const e = this.params,
              { action: t, callback: n } = e,
              r = i(e, ["action", "callback"]);
            return Object.keys(r)
              .map((e) => `${e}=${encodeURIComponent(r[e])}`)
              .join("&");
          }
          get widgetFullUrl() {
            return (
              this.widgetUrl +
              `/${this.params.action.toLowerCase()}?${
                this.computedQuery
              }&inlineRefreshId=${this.id}&integrationType=inline`
            );
          }
          get widgetIframeId() {
            return `iframe-widget-${this.id}`;
          }
        };
      },
      function (e, t, i) {
        var n =
          (this && this.__awaiter) ||
          function (e, t, i, n) {
            return new (i || (i = Promise))(function (r, o) {
              function a(e) {
                try {
                  d(n.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function s(e) {
                try {
                  d(n.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? r(e.value)
                  : ((t = e.value),
                    t instanceof i
                      ? t
                      : new i(function (e) {
                          e(t);
                        })).then(a, s);
              }
              d((n = n.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.IframeWidget = t.IframeEvent = void 0);
        const r = i(5);
        var o = i(8);
        Object.defineProperty(t, "IframeEvent", {
          enumerable: !0,
          get: function () {
            return o.IframeEvent;
          },
        });
        class a extends r.Base {
          constructor(e, t) {
            super(e, t), (this.type = e), (this.model = t);
          }
          close() {
            this.closeIframe();
          }
          open() {
            return n(this, void 0, void 0, function* () {
              return yield this.openIframe();
            });
          }
        }
        t.IframeWidget = a;
      },
      function (e, t, i) {
        var n =
          (this && this.__awaiter) ||
          function (e, t, i, n) {
            return new (i || (i = Promise))(function (r, o) {
              function a(e) {
                try {
                  d(n.next(e));
                } catch (e) {
                  o(e);
                }
              }
              function s(e) {
                try {
                  d(n.throw(e));
                } catch (e) {
                  o(e);
                }
              }
              function d(e) {
                var t;
                e.done
                  ? r(e.value)
                  : ((t = e.value),
                    t instanceof i
                      ? t
                      : new i(function (e) {
                          e(t);
                        })).then(a, s);
              }
              d((n = n.apply(e, t || [])).next());
            });
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.Base = void 0);
        const r = i(6);
        t.Base = class {
          constructor(e, t) {
            (this.type = e),
              (this.model = t),
              (this.loader = i(7)),
              (this.body = document.querySelector("body"));
          }
          _init(e, t = !1, i) {
            const n = document.createElement("iframe");
            return (
              (n.id = e),
              n.setAttribute("frameBorder", "0"),
              n.setAttribute("allowtransparency", "true"),
              (n.style.cssText = r.bg),
              this._loadSrc(t, n, i),
              n
            );
          }
          _loadSrc(e, t, i) {
            e && (i ? (t.src = i) : (t.srcdoc = this.loader.default));
          }
          _windowUrl() {
            return this.model.widgetFullUrl;
          }
          _deleteIframe(e) {
            e.forEach((e) => {
              let t = document.getElementById(e);
              t && t.parentNode && t.parentNode.removeChild(t);
            });
          }
          _loadIframe(e = !0) {
            return new Promise((t) => {
              const i = this,
                n = this._init(this.model.bgIframeId, e),
                r = this._init(this.model.widgetIframeId, e, this._windowUrl());
              this.body &&
                (this.body.appendChild(n),
                i.body.appendChild(r),
                (n.style.visibility = "visible"),
                (r.onload = function () {
                  setTimeout(() => {
                    (n.style.visibility = "hidden"),
                      (r.style.visibility = "visible"),
                      i._deleteIframe([i.model.bgIframeId]),
                      t(r);
                  }, 100);
                }));
            });
          }
          openIframe() {
            return n(this, void 0, void 0, function* () {
              return yield this._loadIframe(!0);
            });
          }
          closeIframe() {
            this._deleteIframe([
              this.model.bgIframeId,
              this.model.widgetIframeId,
            ]);
          }
        };
      },
      (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.bg = void 0),
          (t.bg =
            "top: 0px; left: 0px; width: 100%; height: 100%; margin: 0px; padding: 0px; overflow: hidden; position: fixed; z-index: 700000000; visibility: hidden;background: rgba(0, 0, 0, 0.75); border: 0px none transparent; transition: opacity 0.3s ease 0s; -webkit-tap-highlight-color: transparent; ");
      },
      (e, t, i) => {
        i.r(t), i.d(t, { default: () => n });
        const n =
          '<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"/> <meta http-equiv="X-UA-Compatible" content="IE=edge"/> <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/> <title>Paychant Widget</title> <style>iframe{top:0;left:0;width:100%;height:100%;margin:0;padding:0;overflow:hidden;position:fixed;z-index:700000000;visibility:visible;background:rgba(0,0,0,.75);border:0 none transparent;transition:opacity .3s ease 0s;-webkit-tap-highlight-color:transparent}.p_widget_App{display:flex;overflow-y:auto;position:relative;align-items:center;width:100vw;height:100vh}.p_widget_container{display:flex;flex:1 1;align-items:center;justify-content:center;position:absolute;left:0;right:15px;top:0;bottom:15px}.p_widget_card{background-color:#fff;border-radius:10px;display:flex;flex-direction:column;align-items:center;box-shadow:0 12px 48px rgb(164 81 178 / 28%);box-shadow:#a451b247 0 50px 100px -20px,rgb(0 0 0 / 30%) 0 30px 60px -30px,rgb(10 37 64 / 35%) 0 -2px 6px 0 inset;width:370px;height:690px;min-height:690px;position:fixed;overflow:hidden}@media (min-width:300px) and (max-width:767px){.p_widget_App{width:100%;overflow-y:initial}.p_widget_card{border-radius:0;box-shadow:none;width:100vw;max-width:100vw;height:100vh;overflow-y:hidden}.p_widget_container{left:0;right:0;top:-1px}}</style> </head> <body> <main class="p_widget_App"> <div class="p_widget_container"> <div class="p_widget_card"></div> </div> </main> </body> </html> ';
      },
      function (e, t) {
        var i =
          (this && this.__rest) ||
          function (e, t) {
            var i = {};
            for (var n in e)
              Object.prototype.hasOwnProperty.call(e, n) &&
                t.indexOf(n) < 0 &&
                (i[n] = e[n]);
            if (
              null != e &&
              "function" == typeof Object.getOwnPropertySymbols
            ) {
              var r = 0;
              for (n = Object.getOwnPropertySymbols(e); r < n.length; r++)
                t.indexOf(n[r]) < 0 &&
                  Object.prototype.propertyIsEnumerable.call(e, n[r]) &&
                  (i[n[r]] = e[n[r]]);
            }
            return i;
          };
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.IframeEvent = void 0);
        t.IframeEvent = class {
          constructor(e, t) {
            (this.model = e), (this.params = t);
            const n = this.params,
              { callback: r } = n,
              o = i(n, ["callback"]);
            this.userInputParams = o;
          }
          listen(e, t) {
            (this.onTxStatus = this._onTxStatus()),
              (this.closeWidget = this._onCloseWidget(e)),
              window.addEventListener("message", this.widgetInit, !1),
              window.addEventListener("message", this.onTxStatus, !1),
              window.addEventListener("message", this.closeWidget, !1);
          }
          _eventMatch(e, t) {
            return e.origin === this.model.widgetUrl && e.data.type === t;
          }
          _onTxStatus() {
            let e = this;
            return function (t) {
              var i;
              e._eventMatch(t, "tx-status") &&
                (null === (i = e.params.callback) || void 0 === i
                  ? void 0
                  : i.onStatus) &&
                e.params.callback.onStatus(t.data.message);
            };
          }
          _onCloseWidget(e) {
            let t = this;
            return function (i) {
              var n;
              t._eventMatch(i, "close-window") &&
                (e.close(),
                (null === (n = t.params.callback) || void 0 === n
                  ? void 0
                  : n.onClose) && t.params.callback.onClose(),
                window.removeEventListener("message", t.widgetInit, !1),
                window.removeEventListener("message", t.onTxStatus, !1),
                window.removeEventListener("message", t.closeWidget, !1));
            };
          }
        };
      },
    ],
    t = {};
  function i(n) {
    var r = t[n];
    if (void 0 !== r) return r.exports;
    var o = (t[n] = { exports: {} });
    return e[n].call(o.exports, o, o.exports, i), o.exports;
  }
  (i.d = (e, t) => {
    for (var n in t)
      i.o(t, n) &&
        !i.o(e, n) &&
        Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
  }),
    (i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (i.r = (e) => {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    });
  var n = {};
  (() => {
    var e = n;
    Object.defineProperty(e, "__esModule", { value: !0 });
    const t = i(1);
    class r extends t.Widget {
      constructor(e) {
        super("Users", e);
      }
    }
    window.PaychantWidget = r;
  })();
})();
