
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
import isMobilePhone from 'validator/lib/isMobilePhone'
import baseCfg from '../../config/baseConfig'
import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'
import Cell from 'vux/src/components/cell/index.vue'
import XAddress from 'vux/src/components/x-address/index.vue'
import CheckIcon from 'vux/src/components/check-icon/index.vue'

import { mapState, mapMutations } from 'vuex';
import hpv9End from '../../components/hpv9/isEnd.vue'
export default {
components: {
Group,
XInput,
PopupPicker,
Cell,
XAddress,
CheckIcon,
hpv9End
},
computed: mapState(['isMobile','user','token','isMobile']),
data () {
return {
registerUser:{
name:'',
sex:'',
age:'',
regionCode:'',
mobile:'',
validateCode:'',
vaccineCode:'8803',
latitude:'',
longitude:'',
uFrom:''
},
currentPosition:[],
regions:[],
pickerSex:{
sexData:[[{
name: '女',
value: '2'
}, {
name: '男',
value: '1'
}]],
sex:['2']
},
vCode:{
ableClass: "able",
unableClass:"unable",
text: "获取验证码"
},
valiState:{
mobileOk: false,
timeCount: false
},
agree: true
}
},
created () {
pageStatistics(baseCfg.statistics.hpv9.joinHpv9);

this.setWxShare();

if(this.user.mobile && this.user.mobile!=''){
this.registerUser.mobile = this.user.originalMobile;
}

this.isRegisterActivity();

if(this.$route.query.f) this.registerUser.uFrom = this.$route.query.f;
},

methods: {

...mapMutations([
"setUser"
]),

/**
* 获取定位
* */
getLocation(){
const _this = this;
if(this.isMobile.isWx){

bus.$on('wxReady',function(e){

wx.getLocation({
type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
success: function (res) {
var latitude = res.latitude; 
var longitude = res.longitude; 
var speed = res.speed; 
var accuracy = res.accuracy; 

axios.get(aipConfig.geocoder, {params: {lat: latitude, lng:longitude}}).then((res) => {
let data = res.data.data;
let location = {
lat: latitude,
lng: longitude
};
let position = Object.assign(data,location);
_this.showPosition(position);
}).catch((e) =>{
console.log(e);
_this.showErr();
})


},
fail: function(res){
console.log(res);
_this.showErr();
}
});

})

}else{
_this.showErr();
}
},

setWxShare(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/joinHpv9?fa=wx';
shareInfo.imgUrl = baseCfg.appInfo.imagesUrl +'hpv9_share.png';
shareInfo.title = '九价HPV疫苗全港紧缺，这里有100人份，6月即可接种';
shareInfo.desc = '名额有限，快来参与争取名额吧';
wxShare(shareInfo)
},

/**
* 定位成功回调
* * @param position  位置信息
*/
showPosition(position) {




const _this = this;
let pCode='',cCode='',dCode='',cArr=[],dArr=[];
for(var i in this.regions){
if(_this.regions[i].name.indexOf(position.province)>=0 && !_this.regions[i].parent){
pCode = _this.regions[i].value;
_this.currentPosition.push(pCode);
break;
}
}
this.regions.forEach(function(e,i,arr){
if(e.parent === pCode){
cArr.push(e);
}
});
for(let i in cArr){
if(cArr[i].name.indexOf(position.city)>=0){
cCode = cArr[i].value;
_this.currentPosition.push(cCode);
break;
}
}
this.regions.forEach(function(e,i,arr){
if(e.parent === cCode){
dArr.push(e);
}
});
if(position.district){
for(let i in dArr){
if(dArr[i].name.indexOf(position.district)>=0){
dCode = dArr[i].value;
_this.currentPosition.push(dCode);
break;
}
}
}


this.registerUser.latitude = position.lat;
this.registerUser.longitude = position.lng;

},

showErr() {},


/**
* 获取省市区列表
* @param callBack  回调函数
*/
getRegions(callBack){
const _this=this;
axios.get(aipConfig.regions,{withCredentials:false}).then((res) => {
this.regions=res.data.data;
if(callBack){
callBack();
}
}).catch((e) =>{
console.log(e);
})
},

/**
* 获取验证码
*/
getVcode(){
const _this = this;
if(!_this.valiState.timeCount && !_this.valiState.mobileOk){
this.$vux.toast.show({
text: '请输入正确的手机号码',
type: 'text',
width:'auto'
})
}else if(!_this.valiState.timeCount && _this.valiState.mobileOk){
axios.get(aipConfig.sendValidateCode, {params:{mobile:_this.registerUser.mobile}}).then((res) => {
var time = 60;
_this.vCode.text = time+"s";
_this.valiState.timeCount=true;
var timer = setInterval(function(){
time-=1;
if(time==0){
_this.vCode.text="获取验证码";
window.clearInterval(timer);
_this.valiState.timeCount=false;
return;
}
_this.vCode.text=time+"s";
},1000);
}).catch((e) =>{
console.log(e);
})
}
},


checkForm(){
const _this = this;
let name = _this.registerUser.name;
let age = _this.registerUser.age
let regionCode = parseInt(_this.currentPosition[2]);
let mobile = _this.registerUser.mobile;
let vcode = _this.registerUser.validateCode;

if(!regionCode || regionCode==''){
_this.$vux.toast.show({
text: '请选择所在地区',
type: 'text',
width:'auto'
})
return false;
}

let nameRe=/[^\u4e00-\u9fa5]/;
if(name==''){
_this.$vux.toast.show({
text: '请输入姓名',
type: 'text',
width:'auto'
})
return false;
}

let r = /^\+?[1-9][0-9]*$/;　　
if(age=='' || !age || !r.test(age) || age>100){
_this.$vux.toast.show({
text: '请输入正确的年龄',
type: 'text',
width:'auto'
})
return false;
}

if(!this.user.mobile || this.user.mobile==''){
if(!isMobilePhone(mobile, 'zh-CN')){
this.$vux.toast.show({
text: '请输入正确的手机号码',
type: 'text',
width:'auto'
})
return false;
}

if(vcode==''){
_this.$vux.toast.show({
text: '请输入验证码',
type: 'text',
width:'auto'
})
return false;
}
}

if(!this.agree){
_this.$vux.toast.show({
text: '本次服务需要授权后方可参加',
type: 'text',
width:'auto'
})
return false;
}
return true;
},

/**
* 提交表单
*/
toQualifying(){
pageStatistics(baseCfg.statistics.hpv9.joinBtn);
let _this = this;
if(!_this.checkForm()){
return;
}else{
let params=this.registerUser;
params.sex = parseInt(this.pickerSex.sex[0]);
params.regionCode = this.currentPosition[2];
axios.get(aipConfig.registerActivity, {params:params}).then((res) => {


axios.get(aipConfig.findLoginUserByKey, {params:{key: this.token}}).then((r) => {
let user = r.data.data;
if(user.mobile && user.mobile !=='') {
user.originalMobile = user.mobile;
user.mobile = user.mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")
}
this.setUser(user);

this.$router.push({ path: '/myHpv9', query: { userId: res.data.data}})

}).catch(function(r){
console.log(r)
})



}).catch((e) =>{
console.log(e);
})
}
},

/**
* @method openLocation 打开微信内置地图
*/
openLocation(){
if(this.isMobile.isWx){
wx.openLocation({
latitude: this.department.latitude, // 纬度，浮点数，范围为90 ~ -90
longitude: this.department.longitude, // 经度，浮点数，范围为180 ~ -180。
name: this.department.name, // 位置名
address: this.department.address, // 地址详情说明
scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
infoUrl: '' 
})
}else{

window.location.href = "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:"+this.department.latitude+","+this.department.longitude+";title:"+this.department.name+";addr:"+this.department.address+"&key=DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5&referer=emiaoapp"
}
},


/**
* 判断是否参加过九价登记活动
*/
isRegisterActivity(){
const _this = this;
if(this.user && JSON.stringify(this.user)!= '{}'){
axios.get(aipConfig.isRegisterActivity,{params:{userId:this.user.id}}).then((res) => {
if(res.data.data==1){  // 已参加
this.$router.replace({ path: '/myHpv9'})
}else{


this.getRegions(function(){

/*if(_this.currentPosition.length==0){
var geolocation = new qq.maps.Geolocation("DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5", "emiaoapp");
geolocation.getLocation(_this.showPosition, _this.showErr,{timeout:5000, failTipFlag:true})
}*/

_this.getLocation();

});

}
}).catch((e) =>{
console.log(e);
})
}
}


},
watch: {
registerUser:{
handler(curVal){
const _this = this
if(isMobilePhone(curVal.mobile, 'zh-CN')){
_this.valiState.mobileOk = true;
}else{
_this.valiState.mobileOk = false;
}
},
deep:true
}
}
}



// WEBPACK FOOTER //
// ./src/pages/hpv9/join.vue