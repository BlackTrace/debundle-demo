
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
import isMobilePhone from 'validator/lib/isMobilePhone'
import baseCfg from '../../config/baseConfig'
import Group from 'vux/src/components/group/index.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'
import InlineLoading from 'vux/src/components/inline-loading/index.vue'


import { mapState, mapMutations } from 'vuex'
export default {
components: {
Group,
InlineLoading,
PopupPicker,

},
computed:mapState(["currentCity","isMobile"]),
data () {
return {
locationState:"定位中",
regions:[],
currentPosition:[],
depts: [],
params:{
offset:0,
limit:10,
regionCode:'',
cityName:'',
name:''
},
noMoreData: false,
addressFormat: function (value, name) {
let result = name.split(' ');
return result[1];
},
location:{
isLocation:true,
fail:false
},
noMatch:false
}
},
mounted(){
},
created () {
let _this = this;
pageStatistics(baseCfg.statistics.searchDepartment)

this.setWxShare();

this.getRegions();

if(this.currentCity==''){
/*var geolocation = new qq.maps.Geolocation("DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5", "emiaoapp");
geolocation.getLocation(this.showPosition, this.showErr,{timeout:5000, failTipFlag:true})*/

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

}else{
this.locationState = this.currentCity;
this.params.cityName = this.currentCity;
this.loadDeptsList(function(data){
_this.depts = data;
})
}
},
methods: {
...mapMutations([
"setCurrentCity"
]),
/**
* 获取城市列表三级联动
*/
getRegions(){
const _this=this;
axios.get(aipConfig.regions).then((res) => {
let regions = res.data.data;
let result = [
{
name:"全国",
value:"00"
},
{
name:"全国",
value:"0000",
parent:"00"
}
];
regions.forEach(function(e,i,arr){
if(e.value.length != 6){
result.push(e);
}
})
this.regions=result;
}).catch((e) =>{
console.log(e);
})
},
loadDeptsList(callback){
axios.get(aipConfig.departments, {params:this.params}).then((res) => {
this.location.isLocation = false;
this.location.fail = false;
this.params.offset = this.params.offset+this.params.limit;
if(callback){
callback(res.data.data.rows);
}
})
},
infinite(done) {
let _this = this;
if (this.noMoreData) {
setTimeout(() => {
done(true)
}, 1000)
return;
}
_this.loadDeptsList(function(data){
if( data.length > 0){
_this.depts = _this.depts.concat(data)
if(data.length<_this.params.limit){
_this.noMoreData = true;
}
}else{
_this.noMoreData = true;
}
_this.params.offset = _this.params.offset+_this.params.limit;
setTimeout(() => {
done()
})
});
},
selectRegion(val){
const _this = this;
this.params.offset = 0;
if(val[1]=="0000"){
this.params.cityName='';
this.params.regionCode=''
}else{
this.params.cityName='';
this.params.regionCode = val[1];
}
this.loadDeptsList(function(data){
if(data.length==0 && _this.params.name!=''){
_this.noMatch = true;
}
_this.depts = data;
})
},
showPosition(position) {
const _this = this;

this.locationState = position.city;
this.setCurrentCity(position.city);
this.params.cityName = position.city;
this.params.regionCode = '';
this.loadDeptsList(function(data){
_this.depts = data;
})
},
showErr() {
const _this = this;
this.location.isLocation = false;
this.locationState = "全国";

this.loadDeptsList(function(data){
_this.depts = data;
})
this.$vux.toast.show({
text: "sorry~获取地理位置失败~请手动选择区域~",
type: 'text',
width:'auto'
})
},
openMap(dept){
if(this.isMobile.isWx){
wx.openLocation({
latitude: parseFloat(dept.latitude), // 纬度，浮点数，范围为90 ~ -90
longitude: parseFloat(dept.longitude), // 经度，浮点数，范围为180 ~ -180。
name: dept.name, // 位置名
address: dept.address, // 地址详情说明
scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
infoUrl: '' 
})
}else{

window.location.href = "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:"+dept.latitude+","+dept.longitude+";title:"+dept.name+";addr:"+dept.address+"&key=DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5&referer=emiaoapp"
}
},
searchSubmit(){
const _this = this;
this.params.offset = 0;
this.loadDeptsList(function(data){
if(data.length==0){
_this.noMatch = true;
}
_this.depts = data;
})
},
setWxShare(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/searchDepartment';
shareInfo.title = '国内宫颈癌疫苗上市啦，一键查询你附近的接种门诊';
shareInfo.desc = '优先登记、优先接种';
wxShare(shareInfo)
},
toSubscribe(code){
const _this = this;
_this.$router.push({ path: '/department', query: { depaCode: code}})
/*if(isOpen==1){
_this.$router.push({ path: '/department', query: { depaCode: code}})
}else{
_this.$vux.confirm.show({
title: '提示',
content: "该门诊暂未开通网上预约服务，您可电话咨询门诊是否有苗，线下接种，或者先登记，订阅门诊开通服务通知。",
onCancel () {
},
onConfirm () {
_this.$router.push({ path: '/joinQualifying', query: { depaCode: code}})
}
})

}*/
},
toQualify(){
this.$router.push({ path: '/joinQualifying'})
}
},
watch:{
params:{
handler(curVal){
const _this = this;
if(curVal.name==""){
_this.noMatch = false;
}
},
deep:true
}
}
}



// WEBPACK FOOTER //
// ./src/pages/department/searchDepartment.vue