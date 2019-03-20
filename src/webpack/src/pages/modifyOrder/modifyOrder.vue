
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
orderDetail:'',
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
subscribeDate:'',
subscirbeTime:''
},
}
},
methods: {
...mapMutations([
"setSubmitInfo"
]),

/**
* @method getOrderDetail 获取订单详情
* @param {long} id 订单id
*/
getOrderDetail(id){
const _this = this;
axios.get(aipConfig.orderDetail, {params:{id:id}}).then((res) => {
this.orderDetail = res.data.data;

if (this.orderDetail.subscribe.status == 0) {
this.orderDetail.subscribe.state = "已预约";
} else if (this.orderDetail.subscribe.status == 9) {
this.orderDetail.subscribe.state = "已完成";
} else if (this.orderDetail.subscribe.status == 10) {
this.orderDetail.subscribe.state = "已取消";
} else if (this.orderDetail.subscribe.status == 5){
this.orderDetail.subscribe.state = "退款中";
}else if (this.orderDetail.subscribe.status == -1) {
this.orderDetail.subscribe.state = "未付款";
} else {
this.orderDetail.subscribe.state = "";
}


let inoculateIndex = this.orderDetail.vaccine.inoculateIndex;
switch (inoculateIndex){
case 1:
this.orderDetail.vaccine.inoculateIndexText = "第一针";
break;
case 2:
this.orderDetail.vaccine.inoculateIndexText = "第二针";
break;
case 3:
this.orderDetail.vaccine.inoculateIndexText = "第三针";
break;
case 4:
this.orderDetail.vaccine.inoculateIndexText = "第四针";
break;
default:
this.orderDetail.vaccine.inoculateIndexText = "";
}

this.orderDetail.subscribe.subscribeDate = moment(this.orderDetail.subscribe.subscribeDate).format("YYYY-MM-DD日");
if(this.orderDetail.departmentWorktime){
this.orderDetail.departmentWorktime = this.orderDetail.departmentWorktime.startTime + " - " + this.orderDetail.departmentWorktime.endTime
}
if(this.orderDetail.department.serviceFee){
this.serviceFeeDesc = "<p>•	本次服务收取"+this.orderDetail.department.serviceFee/100+"元作为预约服务费，一经产生，概不退费。</p><p>•	如因时间问题，无法前往接种，请在原接种日前修改预约日期。</p>";
}

this.getNow();

}).catch((e) =>{
console.log(e)
})
},




/**
* 根据门诊编码获取可预订日期列表
*/
getWorkDays(){
let params = {
depaCode: this.orderDetail.department.code,
linkmanId: this.orderDetail.subscribe.linkmanId,
vaccCode: this.orderDetail.vaccine.code,
vaccIndex: this.orderDetail.vaccine.inoculateIndex,
departmentVaccineId: this.orderDetail.subscribe.departmentVaccineId
}
axios.get(aipConfig.getWorkDays, {params: params}).then((res) => {
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
let month = this.date.preMonth;
this.weeks=this.getCalendar(moment(month).format("YYYY-MM"));
this.findSubscribeAmountByDays();
},

/**
* 下一个月
*/
nextMonth(){
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
if(day.isWorkday && !day.isFull){
this.subInfo.subscribeDate = day.ymd;
this.getDepaWorkTimes();
/*if(this.checkAge(this.orderDetail.subscribe.birthday,this.orderDetail.vaccine.inoculateIndex,this.subInfo.subscribeDate)){
this.getDepaWorkTimes();
}*/



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
depaCode:this.orderDetail.department.code,
vaccCode: this.orderDetail.vaccine.code,
vaccIndex:this.orderDetail.vaccine.inoculateIndex,
days:[], // 门诊日
departmentVaccineId: this.orderDetail.subscribe.departmentVaccineId
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
if(day.isWorkday){
days.push(moment(day.ymd).format('YYYYMMDD'));
}
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
depaCode:this.orderDetail.department.code,
vaccCode: this.orderDetail.vaccine.code,
vaccIndex:this.orderDetail.vaccine.inoculateIndex,
subsribeDate:this.subInfo.subscribeDate,
departmentVaccineId: this.orderDetail.subscribe.departmentVaccineId,
linkmanId:this.orderDetail.subscribe.linkmanId
}
axios.get(aipConfig.departmentWorkTimes, {params:params}).then((res) => {
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
* 获取系统当前时间
*/
getNow(){
axios.get(aipConfig.getNow).then((res) => {
this.now = res.data.data;
this.getWorkDays();
}).catch((e) => {
console.log(e)
})
},

/**
* 重新选择门诊预约时间段
* @param val
*/
timeOnChange(val){
/*let arr = this.$refs.worktimePicker.getNameValues().split("（");
this.subInfo.subscirbeTime = {
value: parseInt(val[0]),
name: arr[0]
};*/
},

/**
* 门诊预约时间段 弹窗关闭时触发
* @param closeType  true表示confirm(选择确认), false表示其他情况的关闭
*/
hideWorkTimes(closeType){
this.departmentWorkTimes.isShow = false;
},
checkAge(birthDay,vaccIndex,subDate){

this.vaccine=this.orderDetail.vaccine
this.vaccCode=this.vaccine.code


if(this.vaccCode=='8801'||this.vaccCode=='8802'||this.vaccCode=='8803'){

let start,end,now=moment(subDate);
if(this.vaccine.ageStart&&this.vaccine.ageStart!=''){
start=moment(birthDay,"YYYY-MM-DD hh:mm:ss").add(this.vaccine.ageStart,'y');
console.log("start:"+start.format('YYYY-MM-DD'))
let diff=start.diff(now,'days')
if(diff>0){

this.$vux.alert.show({
title: '提示',
content: "您预约的"+this.vaccine.name + "适用年龄为"+ this.vaccine.ageStart + "-" + this.vaccine.ageEnd + "岁，您选择的接种人不在此年龄段，请重新选择接种人进行预约。",
onHide () {
}
})
return false;
}
}
if(this.vaccine.ageEnd&&this.vaccine.ageEnd!=''){
end=moment(birthDay,"YYYY/MM/DD").add(this.vaccine.ageEnd,'y');
end=end.add(6,'M')
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

if(diff>0){

this.$vux.alert.show({
title: '提示',
content: "您预约的"+this.vaccine.name + "适用年龄为"+ this.vaccine.ageStart + "-" + this.vaccine.ageEnd + "岁，您选择的接种人不在此年龄段，请重新选择接种人进行预约。",
onHide () {
}
})
return false;
}
}
}
return true;
},
checkForm(){
const _this = this;
let subscribeDate = this.subInfo.subscribeDate;
let subscirbeTime = this.departmentWorkTimes.selectTime.length;
if(subscribeDate == ''){
this.$vux.toast.show({
text: '请先选择预约日期',
type: 'text',
width: 'auto'
})
return false;
}
if(subscirbeTime == 0){
this.$vux.toast.show({
text: '请先选择预约时间段',
type: 'text',
width: 'auto'
})
return false;
}
return true;

},

submit(){
const _this = this;
if(this.checkForm()){
let params = {
id: this.$route.query.id,
subscribeDate: this.subInfo.subscribeDate,
subscirbeTime: this.departmentWorkTimes.selectTime[0]
}
axios.get(aipConfig.updateOrder, {params: params,isShowLoading:true}).then((res) => {
_this.$vux.toast.show({
text: '修改成功!',
type: 'success',
width: '40%'
})
setTimeout(function(){

_this.$router.replace({ path: '/myOrder'})
/*_this.$router.replace({ path: '/orderDetail',query: { id: _this.$route.query.id}})*/
},2000)

}).catch(function(res){
console.log(res)
})
}
}


},

computed:mapState(["user","isMobile","selectedMember"]),
created: function () {

wxShare();
this.getOrderDetail(this.$route.query.id);
}

}



// WEBPACK FOOTER //
// ./src/pages/modifyOrder/modifyOrder.vue