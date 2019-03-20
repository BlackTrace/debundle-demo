
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
import isMobilePhone from 'validator/lib/isMobilePhone'
import baseCfg from '../../config/baseConfig'

import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'
import XAddress from 'vux/src/components/x-address/index.vue'
import Cell from 'vux/src/components/cell/index.vue'
import CheckIcon from 'vux/src/components/check-icon/index.vue'
import cookie from 'vux/src/tools/cookie/index.js'
import Datetime from 'vux/src/components/datetime/index.vue'

import { mapState } from 'vuex';

export default {
components: {
Group,
XInput,
PopupPicker,
XAddress,
Cell,
CheckIcon,
Datetime
},
computed: mapState(['user','isMobile']),
data () {
return {
subUser:{
name:'',
sex:'',

birthday:'',
regionCode:'',
mobile:'',
validateCode:'',
depaCode:'',
vaccineCode:'8802',
latitude:'',
longitude:'',
uFrom:'',
sourceUserId:''
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
promotionUrl:'',
department:'',
/* pickerVacc:{
vaccData:[[]],
vaccineCode:["8802"]
},
pickerDepa:{
data:[[]],
selected:[]
},
agree:true,*/
ableClick: true,
registerNum:''
}
},

created () {
const _this = this;

this.setWxShare();


this.getRegions(function(){

if(_this.currentPosition.length==0){
/*var geolocation = new qq.maps.Geolocation("DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5", "emiaoapp");
geolocation.getLocation(_this.showPosition, _this.showErr,{timeout:5000, failTipFlag:true})*/
_this.getLocation();
}

})


if(this.user.mobile && this.user.mobile!=''){
this.subUser.mobile = this.user.originalMobile;
}


if(this.$route.query.depaCode) this.subUser.depaCode = this.$route.query.depaCode;
if(this.$route.query.vaccineCode) {
this.subUser.vaccineCode = this.$route.query.vaccineCode;
}else{
this.subUser.vaccineCode = "8802";
}

if(this.$route.query.f) this.subUser.uFrom = this.$route.query.f; 
if(this.$route.query.sourceUserId) this.subUser.sourceUserId = this.$route.query.sourceUserId; 
this.getRegisterIndex(this.$route.query.depaCode,this.subUser.vaccineCode,this.subUser.uFrom);
},

methods: {

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

/**
* 判断用户是否已登记
*/
checkIsRegister(){
let _this = this;
_czc.push(["_trackEvent","订阅相关","登记页",'一键订阅按钮点击量']);
if(!_this.checkForm()){
return;
}else{
axios.get(aipConfig.isRegister, {params:{mobile:this.subUser.mobile,vaccineCode:this.subUser.vaccineCode,depaCode: this.subUser.depaCode}}).then((res) => {

if(res.data.data == 0){
_this.toQualifying()

}else if(res.data.data == 1){
_this.$vux.confirm.show({
title: '提示',
content: '您已在其它门诊订阅该疫苗的“到苗通知”，重复订阅，上一条将会失效，是否重复订阅？',
onCancel () {
},
onConfirm () {
_this.toQualifying()
}
})

}else if(res.data.data == 2){
_this.$vux.confirm.show({
title: '提示',
content: '您已订阅该疫苗的“到苗通知”，重复操作，上一条将会失效，是否重复订阅？',
onCancel () {
},
onConfirm () {
_this.toQualifying()
}
})
}

}).catch((e) =>{
console.log(e);
})
}
},

/**
* 获取排队页面相关信息
* @param depaCode
* @param vaccineCode
*/
getRegisterIndex(depaCode,vaccineCode,uFrom){
const _this = this;
axios.get(aipConfig.registerIndex, {params:{depaCode:depaCode,vaccineCode:vaccineCode,uFrom:uFrom}}).then((res) => {
this.promotionUrl = res.data.data.promotionUrl || '../../static/images/register_bg.png'
if(res.data.data.department) {
_this.department = res.data.data.department;
_this.subUser.depaCode = res.data.data.department.code;
}
/*res.data.data.hpvs.forEach(function(e,i,arr){
_this.pickerVacc.vaccData[0].push({
name:e.name,
value:e.code
});
})
if(res.data.data.vaccine.code){
_this.pickerVacc.vaccineCode[0] = res.data.data.vaccine.code;
}*/
_this.registerNum = res.data.data.registerNum;
}).catch((e) =>{
console.log(e);
})
},

/**
* 改变选择疫苗时触发
* @param val
*/
changeVacc(val){
const _this = this;
_this.subUser.vaccineCode = val[0];
/*axios.get(aipConfig.registerIndex, {params:{vaccineCode:val[0]}}).then((res) => {
if(res.data.code=="0000"){
_this.vaccineDesc = res.data.data.vaccine.registerImgUrl;
}else{
_this.$vux.toast.show({
text: res.data.msg
})
}
})*/
},

/**
* 设置微信分享信息
*/
setWxShare(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/reserveShare?fa=wx';
shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'reserve_share.png';
shareInfo.title = '好消息，大陆九价HPV疫苗即将上市，事先订阅到苗消息，快人一步接种啦！';
shareInfo.desc = '宫颈癌是首个可以预防的癌症！80%的女生会感染，80%的女生不知道！';
wxShare(shareInfo)
},

/**
* 定位成功回调函数
* @param position  定位信息
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

/*if(this.currentPosition[2]) this.getDepartmentsList();*/

this.subUser.latitude = position.lat;
this.subUser.longitude = position.lng;
},

/**
* 定位失败回调函数
*/
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
axios.get(aipConfig.sendValidateCode, {params:{mobile:_this.subUser.mobile}}).then((res) => {
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

/**
* 验证表单信息
*/
checkForm(){
const _this = this;
let name = _this.subUser.name;

let birthday = this.subUser.birthday;
let regionCode = parseInt(_this.currentPosition[2]);
let mobile = _this.subUser.mobile;
let vcode = _this.subUser.validateCode;


if(this.subUser.depaCode==''){

if(!regionCode || regionCode==''){
_this.$vux.toast.show({
text: '请选择所在地区',
type: 'text',
width:'auto'
})
return false;
}
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


/*let r = /^\+?[1-9][0-9]*$/;　　//正整数
if(age=='' || !age || !r.test(age) || age>100){
_this.$vux.toast.show({
text: '请输入正确的年龄',
type: 'text',
width:'auto'
})
return false;
}*/


if(birthday==''){
_this.$vux.toast.show({
text: '请选择生日',
type: 'text',
width: 'auto'
});
return false;
}


if(this.user.mobile==''){
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

return true;
},

/**
* 提交表单信息
*/
toQualifying(){
let _this = this;
this.ableClick = false;
let params=this.subUser;
params.sex = parseInt(this.pickerSex.sex[0]);
if(this.subUser.depaCode=='') params.regionCode = this.currentPosition[2];
axios.get(aipConfig.register, {params:params,isShowLoading:true}).then((res) => {
this.ableClick = true;

this.$router.push({ path: '/qualifying', query: { registerDetailId: res.data.data,isShowGuide:1}})

/*axios.get(aipConfig.hasEarnVaccineActivity).then((result) => {
if(result.data.data){
window.location.href = baseCfg.appInfo.appUrl + 'awardHpv/index.html#/earnVaccine_qualifying?userId='+ res.data.data;
}else{
_this.$router.push({ path: '/qualifying', query: { registerDetailId: res.data.data}})
}
}).catch((e) =>{
console.log(e);
})*/

}).catch((e) =>{
this.ableClick = true;
console.log(e);
})
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
* 地区选择 关闭后触发，当非确定时，参数为false，反之为true
* @param boolean
*/
changeRegion(boolean){
/*if(boolean){
this.getDepartmentsList();
}*/
},


/**
* 获取地区下可登记门诊
*/
getDepartmentsList(){
const _this = this;
let params = {
offset:0,
limit:100,
regionCode: this.currentPosition[2],
isOpen: 1
}

axios.get(aipConfig.departments,{params:params}).then((res) => {
_this.pickerDepa.data= [[]];
_this.pickerDepa.selected.length = 0;

let depas = res.data.data.rows;
if(depas.length>0){
depas.forEach(function(e,i,arr){
_this.pickerDepa.data[0].push({
name:e.name,
value:e.code
});
})
}else{
this.$vux.alert.show({
title: '提示',
content: "该地区暂无可选门诊，您可选择其他地区登记或通过线下联系附近门诊了解到苗信息。",
onHide () {}
})
}
}).catch(function(e){
console.log(e)
})
}

},

watch: {
subUser:{
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
// ./src/pages/reserve/joinQualifying.vue