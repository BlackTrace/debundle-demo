
import city from '../../components/cityPicker/cityPicker.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'
import Group from 'vux/src/components/group/index.vue'
import Tab from 'vux/src/components/tab/tab.vue'
import TabItem from 'vux/src/components/tab/tab-item.vue'

import { mapState, mapMutations } from 'vuex'
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'

export default {
components: {
city,
PopupPicker,
Group,
Tab,
TabItem
},

computed:mapState(["currentCity","currentAreaCode","position","currentVaccineCode"]),
data(){
return{

depts: [],
catalogs:[{id:1,name:"宫颈癌"},{id:2,name:"麻腮风"},{id:3,name:"流感"}],
catalog:0,
vaccines:[{code:'8801',name:"二价HPV"},{code:'8802',name:"四价HPV"},{code:'8803',name:"九价HPV"}],
city: {
isShow: false,
cityData: [],
localCity: {
cityName:'定位中...'
},
starCity: [],
choiceCity:{
cityName:'',
cityCode:''
}
},
deptParams:{
offset:0,
limit:100
},
noMoreData: false,

area:{
choiceArea:{
regionCode:[]
},
areaList:[[{name:'',value:''}]],
},

tabIndex:0,
vaccineDetail:{},
questionList:[]

}
},

methods:{

...mapMutations([
"setCurrentCity","setCurrentAreaCode", "setPosition","setCurrentVaccineCode"
]),

/**
* 点击选择城市
*/
showCityPanel(){
this.city.isShow = true;
},

/**
* 关系城市选择
*/
hideCityPanel(){
this.city.isShow = false;
},

/**
* 选择完城市回调
* @param res
*/
onChooseCity(res){

let _this = this;
this.setCurrentCity(res.cityName);
_this.city.choiceCity.cityName =  res.cityName;
_this.getChildRegions(_this.city.choiceCity.cityName,1);
_this.getDepts(function(data){
_this.depts = data;
/*if(data.length>0){
let regionCode = data[0].regionCode;
/!* _this.city.choiceCity.cityCode = regionCode.slice(0,4);
_this.getChildRegions(_this.city.choiceCity.cityCode);*!/
_this.getChildRegions(_this.city.choiceCity.cityName,1);
}else{
_this.area.areaList[0].length = 0;
_this.area.areaList[0].push({name:'全城',value:'0'});
_this.area.choiceArea.regionCode[0] = '0'
}*/
});
_this.city.isShow = false;
},

/**
* 获取门诊列表
* @param callback 回调函数
* @param areaCode 区域code
*/
getDepts(callback,areaCode){
const _this =this;
let params = {
cityName:'',
offset:_this.deptParams.offset,
limit:_this.deptParams.limit,
regionCode:'',
isOpen: 1,
longitude: this.position.lng ||'',
latitude: this.position.lat || '',
vaccineCode:this.currentVaccineCode || ''
}
if(areaCode && areaCode!='0' && !areaCode.name) params.regionCode = areaCode;
else params.cityName = _this.city.choiceCity.cityName;
axios.get(aipConfig.departments,{params:params}).then((res) => {
let list = res.data.data.rows;
list.forEach(function (e, i, arr) {
if (!e.imgUrl || e.imgUrl == '') e.imgUrl = '../../static/images/picture_empty.png';
});
if(list&&list.length>1){
let stocks=[],outStocks=[];
list.forEach(function (e,i,arr) {
if(e.total>0){
stocks.push(e)
}else{
outStocks.push(e)
}
})
list=stocks.concat(outStocks)
}
_this.depts = list;
if (callback) {
callback(list);
}
}).catch(function(res){
console.log(res)
})
},

/**
* 获取区域列表
* @param cityName 城市name
*/
getChildRegions(cityName,isSetDefault){
const _this = this;
axios.get(aipConfig.getCityChildRegions,{params:{cityName:cityName}}).then((res) => {
_this.area.areaList[0].length = 0;
_this.area.areaList[0].push({name:'全城',value:'0'});
_this.area.areaList[0].push(...res.data.data);
if(isSetDefault && isSetDefault==1){
_this.area.choiceArea.regionCode[0] = '0'
_this.setCurrentAreaCode('0');
}else{
_this.area.choiceArea.regionCode[0]  = this.currentAreaCode;
}
})
},


/**
* 选择完区域回调
*/
selectArea(){
const _this = this;
_this.deptParams.offset = 0;
_this.noMoreData = false;
_this.setCurrentAreaCode(_this.area.choiceArea.regionCode[0]);
_this.getDepts(function(data){
_this.depts = data;
},_this.currentAreaCode);
},

/**
* 定位成功
* @param position
*/
showPosition(position) {
let _this = this;
this.setCurrentCity(position.city);
_this.city.choiceCity.cityName = position.city;
_this.city.localCity.cityName = position.city;
this.setPosition(position);
this.getChildRegions( _this.city.choiceCity.cityName,1);
_this.getDepts();
},

/**
* 定位失败
*/
showErr() {
this.city.isShow = true;
this.city.localCity.cityName = "定位失败,请手动选择城市";
this.city.choiceCity.cityName = "定位失败";
},

/**
* 选择tabItem
* @param index item对应index
*/
selectTabitem(index){
this.tabIndex = index;
},


/**
* 获取疫苗信息
*/
getVaccineInfo(){
axios.get(aipConfig.commonVaccine, {params:{vaccineCode: this.$route.query.vaccCode}}).then((res) => {
this.vaccineDetail = res.data.data;
}).catch((e) => {
console.log(e);
})
},
/**
*  获取目录信息
* */
getCatalogs(){
const _this=this;
axios.get(aipConfig.catalogs).then((res) => {
_this.catalogs=res.data.data;
if(!_this.currentVaccineCode||_this.currentVaccineCode==''){
let catalog=_this.catalogs[0];
_this.getVaccinesByCatalogId(catalog.id);
}else {

axios.get(aipConfig.findCatalogByVaccineCode, {params: {vaccineCode: _this.currentVaccineCode}}).then((res) => {
_this.vaccines = res.data.data.vaccines;
_this.catalog=res.data.data.id;
}).catch((e) => {
console.log(e);
})
}

}).catch((e) => {
console.log(e);
})
},
/**
*  根据目录id查询对应的疫苗
*/
getVaccinesByCatalogId(catalogId){
if(this.catalog==catalogId){
return;
}
const _this=this;
_this.catalog=catalogId;
axios.get(aipConfig.findVaccineByCatalogId, {params: {catalogId: _this.catalog}}).then((res) => {
_this.vaccines = res.data.data;

let v=_this.vaccines[0]

_this.setCurrentVaccineCode(v.code||'')

_this.getDepts(null,_this.currentAreaCode)

}).catch((e) => {
console.log(e);
})
},
/**
*  点击疫苗查询门诊列表
* */
onSelectVaccine(code){
const  _this=this;
if(this.currentVaccineCode==code){
return;
}
this.setCurrentVaccineCode(code);

this.getDepts(null,_this.currentAreaCode)
},

/**
* 常见咨询列表
*/
getVaccineQuestions(){
let params = {
vaccCode: this.$route.query.vaccCode,
offset:0,
limit:100
}
axios.get(aipConfig.vaccineQuestionList, {params:params}).then((res) => {
this.questionList = res.data.data.rows;
}).catch((e) => {
console.log(e);
})
},

/**
* 设置分享信息
*/
setWxShare(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/hotVaccine?vaccCode=' + this.$route.query.vaccCode;
wxShare(shareInfo)
},


toVaccine(vaccineCode, depaCode){
axios.get(aipConfig.vaccines,{params:{depaCode: depaCode, vaccineCode: vaccineCode}}).then((res) => {
let vaccines = res.data.data;
if(vaccines.length ==1) {
if(vaccines[0].isSeckill  && vaccines[0].isSeckill== 1){

this.$router.push({ path: '/seckill', query: { seckillId: vaccines[0].id }});
}else{
this.$router.push({ path: '/vaccine',query:{code:vaccineCode, depaCode:depaCode, vaccId:vaccines[0].id }});
}
} else if(vaccines.length > 1){
this.$router.push({ path: '/department',query:{vaccineCode:vaccineCode, depaCode:depaCode}});
}
}).catch(function(res){
console.log(res)
})
}


},

created(){
const _this = this;

this.getCatalogs();
if(this.currentCity==''){
var geolocation = new qq.maps.Geolocation("DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5", "emiaoapp");
geolocation.getLocation(this.showPosition, this.showErr,{timeout:5000, failTipFlag:true})
}else{
this.city.localCity.cityName = this.position.city;
this.city.choiceCity.cityName = this.currentCity;
this.getChildRegions( _this.city.choiceCity.cityName);
_this.getDepts(function(data){
_this.depts = data;
},_this.currentAreaCode);
}


},
beforeRouteEnter (to, from, next) {
if(from.name == "vaccineQuestion"){
next(vm => {
vm.tabIndex = 1;
})
}else{
next(vm => {
vm.tabIndex = 0;
})
}
}
}



// WEBPACK FOOTER //
// ./src/pages/vaccine/hotVaccine.vue