

import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import {callWeixinApi} from './config/setWxJSSDK'
import isMobile from './common/mobile'
import store from './vuex/store'
import VueScroller from 'vue-scroller'
import cookie from 'vux/src/tools/cookie/index.js'
import ToastPlugin from 'vux/src/plugins/toast/index.js'
import WechatPlugin from 'vux/src/plugins/wechat/index.js'
import AlertPlugin from 'vux/src/plugins/alert/index.js'
import ConfirmPlugin from 'vux/src/plugins/confirm/index.js'
import LoadingPlugin from 'vux/src/plugins/loading/index.js'

import http from './config/http'

import aipConfig from './config/apiConfig'
import {wxShare} from './config/setWxJSSDK'

Vue.prototype.$axios = axios;
Vue.prototype.$aipConfig = aipConfig;
Vue.prototype.$wxShare = wxShare;

Vue.config.productionTip = false

Vue.use(router)
Vue.use(VueScroller)
Vue.use(cookie)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)




/* eslint-disable no-new */
new Vue({
el: '#app',
router,
store,
template: '<App/>',
components: { App },
created: function () {
let token = cookie.get('_xzkj_');  
this.$store.commit('setToken',token);

let now = new Date();
let localTime = now.getTime(); 
let st = cookie.get('_ymst_');  
let difference = '';


if(st && st!=''){
cookie.remove('_ymst_');
difference = st - localTime;
window.localStorage.setItem("diff",difference);
}



/* difference = 1536819946291 - localTime ;
window.localStorage.setItem("diff",difference);
console.log(difference)*/

this.setUa();

/*let user = '';
if(JSON.stringify(this.$store.state.user == '{}')){
axios.get(aipConfig.findLoginUserByKey, {params:{key: token}}).then((res) => {
user = res.data.data;
if(user.mobile && user.mobile !=='') {
user.originalMobile = user.mobile;
user.mobile = user.mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")
}
this.$store.commit('setUser',user);
if(isMobile.Weixin()) callWeixinApi(user.openId);
}).catch(function(res){
console.log(res)
})
}else{
user = this.$store.state.user;

}*/


},
methods:{
setUa(){
if(isMobile.Weixin()){

this.$store.commit('setUa','wx');
}else if(isMobile.XDM()){
this.$store.commit('setUa','xdm');
}
}
}
})



// WEBPACK FOOTER //
// ./src/main.js