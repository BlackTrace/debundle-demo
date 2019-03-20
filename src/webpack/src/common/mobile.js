/**
 * Created by dell on 2017/5/22.
 */
/**
 * 终端类型
 */
module.exports = {
  XDM:function(){return navigator.userAgent.match(/xdm/i) ? true : false;},
  //AppAndroid:function(){return navigator.userAgent.match(/android/i) ? true : false},
  Android: function(){return navigator.userAgent.match(/Android|Linux/i) ? true : false},
  BlackBerry: function(){return navigator.userAgent.match(/BlackBerry/i) ? true : false},
  IOS: function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false},
  Windows: function(){return navigator.userAgent.match(/IEMobile/i) ? true : false},
  any: function(){return (self.isMobile.Android() || self.isMobile.BlackBerry() || self.isMobile.IOS() || self.isMobile.Windows() || self.isMobile.XDM())},
  Weixin:function(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger")return true;
    else return false;
  },
  QQ:function(){
    if (navigator.userAgent.match(/MQQBrowser/i) )return false;
    return navigator.userAgent.match(/QQ/i) ? true : false;
  },
  Android23:function(){return navigator.userAgent.match(/Android 2.3/i) ? true : false},
}



// WEBPACK FOOTER //
// ./src/common/mobile.js