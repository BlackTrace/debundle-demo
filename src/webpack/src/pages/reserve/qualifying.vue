
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
import baseCfg from '../../config/baseConfig'
import Countup from 'vux/src/components/countup/index.vue'

import poster from '../../components/posters/posters.vue'
export default {
components: {
Countup,
poster
},
data () {
return {
isSubscribe:'',
rankingRange:'',
vaccineName:'',
depaCode:'',
showShare:false,
registerType:'', //1为门诊，2为地区
registerNum:0,  //登记到地区
rankingNumber:0, // 登记到门诊
isShowGuide: false
}
},
created () {


this.getRank();
if(this.$route.query.isShowGuide) this.isShowGuide = true;
},
methods: {

setWxShare(){
let shareInfo = {};
/* if(this.depaCode !='')  shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&sourceUserId=' + this.$route.query.userId +'&depaCode=' + this.depaCode;
else shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&sourceUserId=' + this.$route.query.userId;
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&sourceUserId=' + this.$route.query.userId ;*/
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/reserveShare?fa=wx';
shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'reserve_share.png';
shareInfo.title = '好消息，大陆九价HPV疫苗即将上市，事先订阅到苗消息，快人一步接种啦！';
shareInfo.desc = '宫颈癌是首个可以预防的癌症！80%的女生会感染，80%的女生不知道！';
wxShare(shareInfo)
},

getRank(){
let _this = this;
axios.get(aipConfig.registerRanking,{params:{registerDetailId: this.$route.query.registerDetailId}}).then((res) => {
this.isSubscribe = res.data.data.isSubscribe;
this.rankingRange = res.data.data.rankingRange;
if(res.data.data.depaCode && res.data.data.depaCode !='') this.depaCode = res.data.data.depaCode;
if(res.data.data.vaccineName) this.vaccineName = res.data.data.vaccineName;

this.registerType = res.data.data.registerType;
if(this.registerType == 1) this.rankingNumber = res.data.data.rankingNumber;
else this.registerNum = res.data.data.registerNum;


this.setWxShare();
}).catch((e) =>{
console.log(e);
})
},

share(){
const _this =this;
if(this.$route.query.f){
_czc.push(["_trackEvent","订阅成功页","分享按钮点击量",this.$route.query.f]);
}else{
_czc.push(["_trackEvent","订阅成功页","分享按钮点击量"]);
}
this.showShare = true;
setTimeout(function(){
_this.showShare = false;
},3000)
},

hideShare(){
this.showShare = false;
},

qrCode(){
if(this.$route.query.f){
_czc.push(["_trackEvent","按钮点击量","排队成功页二维码",this.$route.query.f]);
}else{
_czc.push(["_trackEvent","按钮点击量","排队成功页二维码"]);
}
}
}
}



// WEBPACK FOOTER //
// ./src/pages/reserve/qualifying.vue