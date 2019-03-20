
import city from '../../components/cityPicker/cityPicker.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'
import Group from 'vux/src/components/group/index.vue'

import { mapState, mapMutations } from 'vuex'
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'

export default {
components: {
city,
PopupPicker,
Group,
},
computed:mapState(["currentCity","currentAreaCode","position"]),
data(){
return{
depts: [],

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
limit:10
},
noMoreData: false,

area:{
choiceArea:{
regionCode:[]
},
areaList:[[{name:'',value:''}]],
}

}
},
methods:{

...mapMutations([
"setCurrentCity","setCurrentAreaCode"
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
this.getChildRegions(_this.city.choiceCity.cityName, 1);
_this.deptParams = {
offset:0,
limit:10
},
_this.noMoreData = false;
_this.getDepts(function(data,total){
if(total <= _this.deptParams.limit){
_this.noMoreData = true;
}
_this.depts = data;
/*if(data.length>0){
_this.getChildRegions(_this.city.choiceCity.cityName);
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
latitude: this.position.lat || ''
}
if(areaCode && areaCode!='0' && !areaCode.name)   params.regionCode = areaCode;
else params.cityName = _this.city.choiceCity.cityName;
axios.get(aipConfig.departments,{params:params}).then((res) => {
this.deptParams.offset = this.deptParams.offset+this.deptParams.limit;
let list = res.data.data.rows;
list.forEach(function(e,i,arr){
if(!e.imgUrl || e.imgUrl =='') e.imgUrl = '../../static/images/picture_empty.png';
else{
let arr = e.imgUrl.split('.com');
e.imgUrl = 'https://adultvacc-1253522668.image.myqcloud.com' + arr[1] + '?imageView2/2/w/160/h/120'
}
});
if(callback){
callback(list,res.data.data.total);
}
}).catch(function(res){
console.log(res)
})
},

/**
* 获取区域列表
* @param cityName 城市code
*/
getChildRegions(cityName,isSetDefault){
const _this = this;
axios.get(aipConfig.getCityChildRegions,{params:{cityName:cityName}}).then((res) => {
_this.area.areaList[0].length=0;
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
_this.getDepts(function(data,total){
if(total <= _this.deptParams.limit){
_this.noMoreData = true;
}
_this.depts = data;
},_this.currentAreaCode);
},


/**
* 加载更多
* @param done
*/
loadMore(done) {
let _this = this;
if (this.noMoreData) {
setTimeout(() => {
done(true)
}, 1000)
return;
}
this.getDepts(function(data){
if( data.length > 0){
_this.depts = _this.depts.concat(data)
if(data.length<_this.deptParams.limit){
_this.noMoreData = true;
}
}else{
_this.noMoreData = true;
}
setTimeout(() => {
done()
})
},_this.currentAreaCode);
},

},

created(){
const _this = this;
wxShare();
this.city.localCity.cityName = this.position.city;
this.city.choiceCity.cityName = this.currentCity ;
_this.getChildRegions( _this.city.choiceCity.cityName);

this.getDepts(function(data,total){
if(total <= _this.deptParams.limit){
_this.noMoreData = true;
}
_this.depts = data;
},_this.currentAreaCode);
}

}




// WEBPACK FOOTER //
// ./src/pages/department/departmentList.vue