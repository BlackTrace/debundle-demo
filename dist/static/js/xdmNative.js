/**
 * xdm native api for js
 * author: threegene.com
 * buildDate:2016/11/01
 */
(function () {
  var nav = navigator.userAgent;
  if (nav.match(/xdm/i)) {
    window.globalCallbackFn = null;
    window.xdm = {
      invokeFn: function (code, param, callbackFn) {
        try {
          if (!window.yeemiao || !window.yeemiao.callNativeParmFunc) alert("当前app版本过低，请升级后体验"); else window.yeemiao.callNativeParmFunc(code, param, callbackFn)
        } catch (d) {
          alert("出错了，请稍后再试")
        }
      }, getDeviceCode: function (param, callbackFn) {
        this.invokeFn('00001', param, callbackFn)
      }, getUserInfo: function (param, callbackFn) {
        this.invokeFn('00002', param, callbackFn)
      }, getNetState: function (param, callbackFn) {
        this.invokeFn('00003', param, callbackFn)
      }, getLocation: function (param, callbackFn) {
        this.invokeFn('00004', param, callbackFn)
      }, callCamera: function (param, callbackFn) {
        this.invokeFn('00005', param, callbackFn)
      }, callShare: function (param, callbackFn) {
        this.invokeFn('00006', param, callbackFn)
      }, callPhone: function (param, callbackFn) {
        this.invokeFn('00007', param, callbackFn)
      }, openNewPage: function (param, callbackFn) {
        this.invokeFn("00008", param, callbackFn)
      }, setTitleBar: function (param, callbackFn) {
        this.invokeFn('00009', param, callbackFn)
      }
    };
    if (nav.match(/iPhone|iPad|iPod/i)) {
      var appInfoArr = nav.split(';');
      for (var i in appInfoArr) {
        var appInfo = appInfoArr[i].split("/");
        if (appInfo[0] == 'appBuild') {
          var lastOldBuild = 2016103100;
          if (appInfo[1] > lastOldBuild) {
            window.xdm.invokeFn = function (code, param, callbackFn) {
              if (window.webkit) {
                window.globalCallbackFn = callbackFn;
                window.webkit.messageHandlers.yeemiao.postMessage({
                  'code': code,
                  'param': param,
                  'func': 'globalCallbackFn'
                })
              }
            }
          } else {
            alert("当前app版本过低，请升级后体验")
          }
          return
        }
      }
    }
  }
})();
