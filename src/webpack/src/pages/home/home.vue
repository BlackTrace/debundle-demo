
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'
import city from '../../components/cityPicker/cityPicker.vue'
import isMobile from '../../common/mobile'
import bus from '../../common/bus'
import InlineLoading from 'vux/src/components/inline-loading/index.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'
import Group from 'vux/src/components/group/index.vue'
import Swiper from 'vux/src/components/swiper/swiper.vue'
import GroupTitle from 'vux/src/components/group-title/index.vue'
import SwiperItem from 'vux/src/components/swiper/swiper-item.vue'

import {mapState, mapMutations} from 'vuex'
import comFooter from '../../components/comFooter/comFooter.vue'

const imgList =[{
url: 'javascript:',
img: 'http://adultvacc-1253522668.file.myqcloud.com/images/home_banner.png',
title: ''
}];
export default {
components: {
city,
InlineLoading,
PopupPicker,
Group,
Swiper,
GroupTitle,
SwiperItem,
comFooter
},
computed: mapState(["currentCity", "currentAreaCode", "position","user","isWxConfigReady","currentVaccineCode"]),
data () {
return {

ad_list: [],

city: {
isShow: false,
cityData: [],
localCity: {
cityName: '定位中...'
},
starCity: [],
choiceCity: {
cityName: '定位中...',
cityCode: ''
}
},

area: {
label: '选择区域',
list: [[{name: "全城", value: "0", parent: 0}]],
selected: ["0"]
},

hotvaccines:[],
insUrl:'',
healthModule:{
list:[],
index:''
},
healthArticle:{
list:[],
params: {
offset: 0,
limit: 5
},
noMoreData: false,
isLoadingMore: false
}
}
},
mounted(){
this.findHealthModuleList();

},
created(){
const _this = this;
this.insUrl = baseCfg.appInfo.appUrl + 'ins/index.html#/home';
wxShare();



if (this.currentCity == '') {
/*var geolocation = new qq.maps.Geolocation("DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5", "emiaoapp");
geolocation.getLocation(this.showPosition, this.showErr, {timeout: 5000, failTipFlag: true})*/


/*let latitude = 22.53332;
let longitude = 113.93041;

axios.get(aipConfig.geocoder, {params: {lat: latitude, lng:longitude}}).then((res) => {
let data = res.data.data;
let location = {
lat: latitude,
lng: longitude
};
let position = Object.assign(data,location);
this.showPosition(position);
}).catch((e) =>{
console.log(e)
})*/


if(isMobile.Weixin()){

if(this.isWxConfigReady){
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

}else{
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
}



}else{
_this.showErr();
}

} else {
this.city.localCity.cityName = this.position.city;
this.city.choiceCity.cityName = this.currentCity;
this.refreshDataByCity();
}

if(this.user.mobile && this.user.mobile !='' ) this.getNotReadNoticeNum();

},
methods: {

...mapMutations([
"setCurrentCity", "setCurrentAreaCode", "setMessageNum", "setPosition","setCurrentVaccineCode"
]),
onSwiperItemIndexChange (index) {
console.log('demo item change', index)
},

/**
*  获取百度地图后显示城市
*/

showPosition(position){

const _this = this;
this.setCurrentCity(position.city);
this.city.localCity.cityName = position.city;
this.city.choiceCity.cityName = position.city;
this.setPosition(position);
this.refreshDataByCity();
},
showErr() {
this.city.isShow = true;
this.city.localCity.cityName = "定位失败,请手动选择城市";
this.city.choiceCity.cityName = "定位失败";
},
refreshDataByCity(){
const _this = this;


_this.fetchAds();

_this.fetchHotVaccines();

},


showCityPanel(){
this.city.isShow = true;
},

hideCityPanel(){
this.city.isShow = false;
},

onChooseCity(res){
const _this = this;
this.setCurrentCity(res.cityName);
this.city.choiceCity.cityName = res.cityName;

this.refreshDataByCity();
this.hideCityPanel();
this.setCurrentAreaCode('0');
},

findAreas(cityName){
const _this = this;
axios.get(aipConfig.getCityChildRegions, {params: {cityName: cityName}}).then((res) => {
_this.area.list[0].length = 0;
_this.area.list[0].push({name: '全城', value: '0'});
_this.area.list[0].push(...res.data.data);
_this.area.selected[0] = '0'
_this.setCurrentAreaCode('0');
})
},

onAreaChange(val){
const _this = this;
let areaCode = val[0];
this.setCurrentAreaCode(areaCode);
this.department.params.offset = 0;
this.noMoreData = false;
this.fetchDepartments(function (data, total) {
if(total <= _this.department.params.limit){
_this.noMoreData = true;
}
_this.department.list = data;
},areaCode);
},

fetchAds(){
let _this=this;
let city=_this.currentCity;
axios.get(aipConfig.indexAds, {params: {cityName:city}}).then((res) => {

var ads=res.data.data;
if(ads.length >0){
_this.ad_list=[];
for(var i =0;i<ads.length;i++){
var ad=ads[i];
if(ad.activityType == 1){
ad.activityUrl = location.href.split('#')[0] + '#/adDetail?id='+ad.id;
}
var t={
url: ad.activityUrl,
img: ad.imgUrl,
title: ad.name,
}
_this.ad_list.push(t);
}
}else{
_this.ad_list = imgList;
}
})
},

fetchHotVaccines(){
let _this=this;
let city=_this.currentCity;
axios.get(aipConfig.hotVaccine, {params: {cityName:city}}).then((res) => {
_this.hotvaccines=res.data.data;
});
},

/**
* 加载更多
*/
loadMore() {
let _this = this;
if (this.healthArticle.noMoreData) {
return;
}
if(!this.healthArticle.isLoadingMore){
this.healthArticle.isLoadingMore = true;
this.healthArticle.params.offset = this.healthArticle.params.offset + this.healthArticle.params.limit;
this.findHealthArticleList(function(data){
_this.healthArticle.isLoadingMore = false;
});
}

},


/**
* 获取消息数量
*/
getNotReadNoticeNum(){
axios.get(aipConfig.getNotReadNoticeNum).then((res) => {
this.setMessageNum(res.data.data.toString());
})
},

/**
* 滑动触发函数
*/
onScroll() {
var clientHeight=document.documentElement.clientHeight; 
var scrollTop=document.documentElement.scrollTop; 
var scrollHeight=document.documentElement.scrollHeight;
if(clientHeight+scrollTop+1>=scrollHeight){
this.loadMore();
}

},

/**
* 获取健康专栏模块
*/
findHealthModuleList(){
this.$axios.get(this.$aipConfig.findHealthModuleList).then((res) => {
this.healthModule.list = res.data.data;
if(res.data.data.length > 0){
this.healthModule.index = res.data.data[0].id;
window.addEventListener('scroll', this.onScroll);
this.findHealthArticleList();
}

});
},

/**
* 获取健康专栏模块下文章列表
* @param callback 回调函数
*/
findHealthArticleList(callback){
let params = {
offset: this.healthArticle.params.offset,
limit: this.healthArticle.params.limit,
moduleId:this.healthModule.index
}
this.$axios.get(this.$aipConfig.findHealthArticleList,{params:params}).then((res) => {
let list = res.data.data.rows;
for ( let i in list) {
var item = list[i];
item.createTime = moment(item.createTime).format("YYYY-MM-DD");
}
this.healthArticle.list = this.healthArticle.list.concat(list);
if (list.length < this.healthArticle.params.limit) {
this.healthArticle.noMoreData = true;
}
if(callback) callback(res.data.data.rows);
});
},

/**
* 选择健康专栏栏目
* @param id  专栏id
*/
changeHealthModule(id){
this.healthModule.index = id;
this.healthArticle.noMoreData = false;
this.healthArticle.params.offset = 0;
this.healthArticle.list = [];
this.findHealthArticleList();
},


toHealthArticle(item){
if(item.url && item.url!=''){
window.location.href = item.url;
}else{
this.$router.push({ path: '/healthArticle',query: { id: item.id}});
}
},
toHotVaccine(code){
this.setCurrentVaccineCode(code);
this.$router.push({ path: '/hotVaccine'});
},

},

destroyed(){
window.removeEventListener('scroll', this.onScroll);
},
}



// WEBPACK FOOTER //
// ./src/pages/home/home.vue