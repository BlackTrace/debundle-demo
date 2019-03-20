
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import { mapState, mapMutations } from 'vuex';
import Group from 'vux/src/components/group/index.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'


export default{
components: {
Group,
PopupPicker
},
data () {
return {
vaccCode:'',
depaCode:'',
departmentVaccineId:'',
vaccine:{},
department:{},
workdays:{
num:0,
list:[]
},
now:'',
date:{},
weeks:[],
departmentWorkTimes:{
list:[[{name:'',value:''}]],
selectTime:[],
isShow:false
},
subInfo:{
department:'',
vaccine: '',
vaccineIndex: '',
subscribeDate:'',
subscirbeTime:'',
linkman:'',
departmentVaccineId: ''
},
radios:{
list:[],
checked:{label:'',value:''}
},
sexOk:false,
}
},
methods: {
...mapMutations([
"setSelectedMember","setSubmitInfo","setDogInjuryInfo"
]),
/**
* 获取疫苗信息
*/
getVaccineInfo(){
const _this = this;
axios.get(aipConfig.vaccine, {params:{vaccineCode: this.vaccCode, depaCode: this.depaCode, departmentVaccineId:this.departmentVaccineId, isShowDescribtion:false}}).then((res) => {


var vaccine = res.data.data;
if(vaccine.vaccineProgram){
let vaccineProgramList = vaccine.vaccineProgram.split(",");
vaccineProgramList.forEach(function(e,i,carr){
switch (i){
case 0:
_this.radios.list.push({label:"第一针",value:1});
break;
case 1:
_this.radios.list.push({label:"第二针",value:2});
break;
case 2:
_this.radios.list.push({label:"第三针",value:3});
break;
case 3:
_this.radios.list.push({label:"第四针",value:4});
break;
}
})
}


this.vaccine = vaccine;

this.getDefaultMember();

}).catch((e) => {
console.log(e);
})
},

/**
* 选择疫苗针次
* @param index index值
*/
selectProgram(index){

if(JSON.stringify(this.selectedMember) == '{}'){
this.$vux.toast.show({
text: '请先选择接种人',
type: 'text',
width: 'auto'
})
return;
}

if(!this.sexOk){
this.$vux.toast.show({
text: '请先选择合适的接种人',
type: 'text',
width: 'auto'
})
return;
}else{

this.radios.list.forEach((item) => {
item.isChecked = false;
});

this.radios.checked.value = this.radios.list[index].value;
this.radios.checked.label = this.radios.list[index].label;
this.subInfo.vaccineIndex = this.radios.checked;

this.radios.list[index].isChecked = true;
this.getWorkDays();
this.subInfo.subscribeDate = '';
this.subInfo.subscirbeTime = '';
}

},

/**
* 获取门诊信息
*/
getDepartmentInfo(){
axios.get(aipConfig.department, {params:{depaCode: this.depaCode}}).then((res) => {
this.department = res.data.data
}).catch(function(res){
console.log(res)
})
},

/**
* 根据门诊编码获取可预订日期列表
*/
getWorkDays(){
let params = {
depaCode: this.depaCode,
linkmanId: this.selectedMember.id,
vaccCode: this.vaccCode,
vaccIndex: this.radios.checked.value || 1,
departmentVaccineId: this.departmentVaccineId
}
axios.get(aipConfig.getWorkDays, {params: params,isShowLoading:true}).then((res) => {
this.workdays.num = res.data.data.subscribeDays;
this.workdays.list = res.data.data.dateList; 

let currDate =  this.now;
this.weeks=this.getCalendar(moment(currDate).format("YYYY-MM"));

this.findSubscribeAmountByDays();

}).catch(function(res){
console.log(res)
})
},

/**
* 渲染日历
* @param month
* @returns {Array}
*/
getCalendar(month){
var weeks=[];
var firstDay=moment(month,"YYYY-MM");
var week=firstDay.format("d");
var start=firstDay.subtract(week,"days");

for(var i=0;i<6;i++){
var days=[];
for(var j=0;j<7;j++){
var day={};
day.v=start.toObject().date ;
day.ymd=start.format("YYYY-MM-DD");
day.month = start.format("MM");


day.isFull = false;


day.isWorkday = false;

if(this.workdays.list.length >0){
for(var k in this.workdays.list){
if(day.ymd == this.workdays.list[k]){
day.isWorkday = true;
break;
}
}
}

start.add(1,"days");
days.push(day);

}
weeks.push(days);
}
this.date.year=moment(month).year();
this.date.month=moment(month).month()+1;
this.date.preMonth=moment(month,"YYYY-MM").add(-1,"month").format("YYYY-MM");
this.date.nextMonth=moment(month,"YYYY-MM").add(1,"month").format("YYYY-MM");
return weeks;
},

/**
* 上一个月
*/
preMonth(){
if(this.radios.list && this.radios.list.length!=0){
if(this.radios.checked.value==''){
this.$vux.toast.show({
text: '请先选择疫苗针次',
type: 'text',
width: 'auto'
})
return;
}
}
let month = this.date.preMonth;
this.weeks=this.getCalendar(moment(month).format("YYYY-MM"));
this.findSubscribeAmountByDays();
},

/**
* 下一个月
*/
nextMonth(){
if(this.radios.list && this.radios.list.length!=0){
if(this.radios.checked.value==''){
this.$vux.toast.show({
text: '请先选择疫苗针次',
type: 'text',
width: 'auto'
})
return;
}
}
let month = this.date.nextMonth;
this.weeks=this.getCalendar(moment(month).format("YYYY-MM"));
this.findSubscribeAmountByDays();
},

/**
* 选中日期事件
* @param day 选中日期
*/
selectDay(day){
if(day.month == this.date.month){
if(this.radios.list && this.radios.list.length!=0){
if(this.radios.checked.value==''){
this.$vux.toast.show({
text: '请先选择疫苗针次',
type: 'text',
width: 'auto'
})
return;
}
}else{
if(JSON.stringify(this.selectedMember) == '{}'){
this.$vux.toast.show({
text: '请先选择接种人',
type: 'text',
width: 'auto'
})
return;
}
}
if(day.isWorkday && !day.isFull){
this.subInfo.subscribeDate = day.ymd;

/*if(this.checkAge(this.selectedMember.birthday,this.radios.checked.value,this.subInfo.subscribeDate)){
this.getDepaWorkTimes();
}*/

this.getDepaWorkTimes();

}
}

},

/**
* 选择”针次”或者翻页日历时拉取工作日的可预约量
*/
findSubscribeAmountByDays(){
const _this = this;
let hasWrokdays = false;
let params = {
depaCode:this.depaCode,
vaccCode: this.vaccCode,
vaccIndex:this.radios.checked.value || 1,// 没配针次传1
days:[], // 门诊日,
departmentVaccineId: this.departmentVaccineId
}

let days = []
for(let i in this.weeks){
let week = this.weeks[i];
for(let j in week){
let day = week[j];
if(day.isWorkday){
if(day.month == this.date.month){
days.push(moment(day.ymd).format('YYYYMMDD'));
hasWrokdays = true;
}
}
}
}
params.days = days.toString();

if(hasWrokdays){
axios.get(aipConfig.findSubscribeAmountByDays, {params:params}).then((res) => {
let data = res.data.data;
if(data.length >0 ){
for(let i in this.weeks){
let week = this.weeks[i];
for(let j in week){
let day = week[j];
for(let k in data ){
if(moment(day.ymd).format('YYYYMMDD') == data[k].day){
if(data[k].maxSub <= 0){
_this.$set(_this.weeks[i][j],'isFull',true)
}
}
}
/*if(day.isWorkday){
days.push(moment(day.ymd).format('YYYYMMDD'));
}*/
}
}
}
}).catch((err)=> {
console.log(err)
})
}
},

/**
* 根据选中日期获取该日门诊可预约时间段
*/
getDepaWorkTimes(){
const _this = this;
this.$set(this.departmentWorkTimes, 'list', [[]]);
this.$set(this.departmentWorkTimes, 'selectTime', []);
this.subInfo.subscirbeTime = '';
let params = {
depaCode:this.depaCode,
vaccCode: this.vaccCode,
vaccIndex:this.radios.checked.value || 1,
subsribeDate:this.subInfo.subscribeDate,
departmentVaccineId: this.departmentVaccineId,
linkmanId:this.selectedMember.id
}
axios.get(aipConfig.departmentWorkTimes, {params:params,isShowLoading:true}).then((res) => {
let data = res.data.data;

data.forEach(function(e,i,arr){
if(e.maxSub>0){
_this.departmentWorkTimes.list[0].push({
name:e.startTime + " - " + e.endTime + "（还可预约" + e.maxSub + "人）",
value:e.id.toString()
});
}
});

if(_this.departmentWorkTimes.list[0].length==0){
_this.$vux.alert.show({
title: '提示',
content: "当天已无可预约时间，<br>请选择其它日期！"
})
}else{
this.departmentWorkTimes.isShow = true;
}

}).catch((e) => {
_this.subInfo.subscribeDate = '';
})
},


/**
* 获取家庭成员列表
*/
getDefaultMember(){
const  _this = this;
if(JSON.stringify(this.selectedMember) == '{}'){
axios.get(aipConfig.findByUserId, {params:{userId:this.user.id}}).then((res) => {
let list = res.data.data;
list.forEach(function (e, i) {
if(e.isDefault == 1){
e.birthday = moment(e.birthday).format("YYYY/MM/DD");
_this.setSelectedMember(e)
}
})
if(list.length >0 && JSON.stringify(this.selectedMember) == '{}'){
list[0].birthday = moment(list[0].birthday).format("YYYY/MM/DD");
_this.setSelectedMember(list[0])
}

if(list.length >0){
_this.isMatchSex(_this.selectedMember.sex);
if(!_this.vaccine.vaccineProgram){
_this.getWorkDays();
}
}

}).catch((e) => {
console.log(e)
})
}else{
this.isMatchSex(this.selectedMember.sex);
if(!this.vaccine.vaccineProgram){
this.getWorkDays();
}
}
},

/**
* 选择接种人
*/
chooseMmember(){
this.$router.push({ path: '/chooseMember',query:{id:this.selectedMember.id}})
},

/**
* 获取系统当前时间
*/
getNow(){
axios.get(aipConfig.getNow).then((res) => {
this.now = res.data.data;

let currDate =  this.now;
this.weeks=this.getCalendar(moment(currDate).format("YYYY-MM"));
}).catch((e) => {
console.log(e)
})
},

/**
* 重新选择门诊预约时间段
* @param val
*/
timeOnChange(val){
let arr = this.$refs.worktimePicker.getNameValues().split("（");
this.subInfo.subscirbeTime = {
value: parseInt(val[0]),
name: arr[0]
};
},

/**
* 门诊预约时间段 弹窗关闭时触发
* @param closeType  true表示confirm(选择确认), false表示其他情况的关闭
*/
hideWorkTimes(closeType){
this.departmentWorkTimes.isShow = false;
if(!closeType) {

this.subInfo.subscribeDate = '';
this.subInfo.subscirbeTime = '';
}else{

this.subInfo = {
...this.subInfo,
department: this.department,
vaccine:  this.vaccine,
linkman: this.selectedMember,
departmentVaccineId: this.departmentVaccineId
}

this.setSubmitInfo(this.subInfo);
this.setDogInjuryInfo({});

if(this.vaccCode.substr(0, 2) == '28' || this.vaccCode.substr(0, 2) == '44'){

this.$router.push({ path: '/dogInjury'})
}else{
this.$router.push({ path: '/submitPreview'})
}



}
},
/**
* 是否符合性别条件
* @param sex 性别
*/
isMatchSex(sex){
const _this = this;
if(this.vaccCode == '8801' || this.vaccCode == '8802' || this.vaccCode == '8803' ){
if(sex !=2 && sex != "女"){
this.$vux.alert.show({
title: '提示',
content: '该疫苗只适用于女性，男性暂时无法预约接种。',
onHide () {
}
})
}else{
this.sexOk = true;
}
}else{
this.sexOk = true;
}
},

/*checkAge(birthDay,vaccIndex,subDate){
const _this = this;


if(this.vaccCode=='8801'||this.vaccCode=='8802'||this.vaccCode=='8803'){

let start,end,now=moment(subDate,'YYYY-MM-DD');
if(this.vaccine.ageStart&&this.vaccine.ageStart!=''){
start=moment(birthDay,"YYYY/MM/DD").add(this.vaccine.ageStart,'y');

let diff=start.diff(now,'days')
if(diff>0){

this.$vux.alert.show({
title: '提示',
content: "您预约的"+this.vaccine.name + "适用年龄为"+ this.vaccine.ageStart + "-" + this.vaccine.ageEnd + "岁，您选择的接种人不在此年龄段，请重新选择接种人进行预约。",
onHide () {
_this.subInfo.subscribeDate = '';
}
})
return false;
}
}
if(this.vaccine.ageEnd&&this.vaccine.ageEnd!=''){
end=moment(birthDay,"YYYY/MM/DD").add(this.vaccine.ageEnd,'y');
end=end.add(6,'M');
if(vaccIndex==2){
if(this.vaccCode=='8801'){
end=end.add(1,'M')
}else{
end=end.add(2,'M')
}
}
if(vaccIndex==3){
end=end.add(6,'M')
}

let diff=now.diff(end,'days')

if(diff>=0){

this.$vux.alert.show({
title: '提示',
content: "您预约的"+this.vaccine.name + "适用年龄为"+ this.vaccine.ageStart + "-" + this.vaccine.ageEnd + "岁，您选择的接种人不在此年龄段，请重新选择接种人进行预约。",
onHide () {
_this.subInfo.subscribeDate = '';
}
})
return false;
}
}
}else{

let start,end,now=moment(subDate,'YYYY-MM-DD');
if(this.vaccine.ageStart&&this.vaccine.ageStart!=''){
start=moment(birthDay,"YYYY/MM/DD").add(this.vaccine.ageStart,'y');

let diff=start.diff(now,'days')
if(diff>0){

this.$vux.alert.show({
title: '提示',
content: "您预约的"+this.vaccine.name + "适用年龄为"+ this.vaccine.ageStart + "-" + this.vaccine.ageEnd + "岁，您选择的接种人不在此年龄段，请重新选择接种人进行预约。",
onHide () {
_this.subInfo.subscribeDate = '';
}
})
return false;
}
}
if(this.vaccine.ageEnd&&this.vaccine.ageEnd!=''){
end=moment(birthDay,"YYYY/MM/DD").add(this.vaccine.ageEnd,'y');

let diff=now.diff(end,'days')

if(diff>=0){

this.$vux.alert.show({
title: '提示',
content: "您预约的"+this.vaccine.name + "适用年龄为"+ this.vaccine.ageStart + "-" + this.vaccine.ageEnd + "岁，您选择的接种人不在此年龄段，请重新选择接种人进行预约。",
onHide () {
_this.subInfo.subscribeDate = '';
}
})
return false;
}
}

}
return true;
}*/
},


computed:mapState(["user","isMobile","selectedMember","submitInfo"]),
created: function () {

wxShare();
this.vaccCode = this.$route.query.vaccCode;
this.depaCode = this.$route.query.depaCode;
this.departmentVaccineId = this.$route.query.vaccId;
this.getVaccineInfo();
this.getDepartmentInfo();
this.getNow();

}

}



// WEBPACK FOOTER //
// ./src/pages/subscribe/subscribe.vue