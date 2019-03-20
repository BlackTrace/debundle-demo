/**
 * Created by dell on 2017/5/8.
 */
import axios from 'axios'
import baseCfg from './baseConfig'
import bus from '../common/bus.js'
import isMobile from '../common/mobile'
import aipConfig from '../config/apiConfig'
import Vue from 'vue'
import store from '../vuex/store.js'


export const defaultShareConfig = {
  'title': '约苗-成年人的打疫苗预约工具',
  'desc': '一秒预约，轻松接种。选择约苗，选择你的健康',
  'link': baseCfg.appInfo.shareBaseUrl + '?target=/home?fa=wx',
  'imgUrl': baseCfg.appInfo.appLogo,
  'type': 'link',
  'success': function () {
  },
  'cancel': function () {}
}
/**
 * 配置分享信息
 */
export function wxShare (userConfig) {
  if(isMobile.Weixin()){
    let defaultConfig = {
      'title': '约苗-成年人的打疫苗预约工具',
      'desc': '一秒预约，轻松接种。选择约苗，选择你的健康',
      'link': baseCfg.appInfo.shareBaseUrl + '?target=/home?fa=wx',
      'imgUrl': baseCfg.appInfo.appLogo,
      'type': 'link',
      'success': function () {
        pageStatistics(baseCfg.statistics.shareSuccess)
      },
      'cancel': function () {}
    }
    let wxConfig = Object.assign({}, defaultConfig, userConfig)
    bus.$on('wxReady',function(e){
      wx.onMenuShareTimeline(wxConfig)
      wx.onMenuShareAppMessage(wxConfig)
      wx.onMenuShareQQ(wxConfig)
      wx.onMenuShareWeibo(wxConfig)
      wx.onMenuShareQZone(wxConfig)
    })
    wx.onMenuShareTimeline(wxConfig)
    wx.onMenuShareAppMessage(wxConfig)
    wx.onMenuShareQQ(wxConfig)
    wx.onMenuShareWeibo(wxConfig)
    wx.onMenuShareQZone(wxConfig)
  }
}

export function callWeixinApi(openId){
  //let wx = WechatPlugin.$wechat
  /*let url = encodeURIComponent(location.href.split('#')[0])*/
  let url = location.href.split('#')[0];
  axios.get(aipConfig.getJsSdkConfig, {params:{openId: openId,url:url}}).then((res) => {
    // let wxConfigData = res
    wx.config({
      debug: false,
      appId: res.data.data.appId,
      timestamp: res.data.data.timestamp,
      nonceStr: res.data.data.nonceStr,
      signature: res.data.data.signature,
      jsApiList: [
        'onMenuShareAppMessage',
        'onMenuShareTimeline',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'chooseWXPay',
        'openLocation',
        'getLocation',
        'scanQRCode'
      ]
    })
    wx.ready(function () {
      wx.hideAllNonBaseMenuItem();
      wx.showMenuItems({
        menuList: [
          'menuItem:share:appMessage', // 分享给朋友
          'menuItem:share:timeline', // 分享到朋友圈
          'menuItem:share:weiboApp',
          'menuItem:share:qq',
          'menuItem:share:QZone '
        ]
      })
      // 广播wxReady
      bus.$emit('wxReady',1);
      store.state.isWxConfigReady = true;
      //wxShare()
      // wx.onMenuShareTimeline(shareInfo);
      // wx.onMenuShareAppMessage(shareInfo);
      // wx.onMenuShareQQ(shareInfo);
      // wx.onMenuShareWeibo(shareInfo);
      // wx.onMenuShareQZone(shareInfo);
    });
    wx.error(function (res) {
      alert("wx.error："+res.errMsg);
      /*Vue.$vux.toast.show({
       text: '获取微信接口配置信息失败，部分功能可能暂时无法使用！',
       })*/
    })
  }).catch((e) => {
    console.log(e);
  })
}




// WEBPACK FOOTER //
// ./src/config/setWxJSSDK.js