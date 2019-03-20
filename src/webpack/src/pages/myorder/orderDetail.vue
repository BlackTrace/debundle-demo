
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'
import { mapState,mapMutations } from 'vuex'
import myAlert from '../../components/myAlert/myAlert.vue'
import Group from 'vux/src/components/group/index.vue'
import Cell from 'vux/src/components/cell/index.vue'

export default {
components: {
myAlert,Group, Cell
},
data () {
return {
orderDetail: '',

showServiceFee:false,
serviceFeeDesc:'',
reactionList:[],
showDogInfo:false,
clickTag:0
}
},
methods:{
...mapMutations([

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

this.orderDetail.subscribe.subscribeDate = moment(this.orderDetail.subscribe.subscribeDate).format("YYYY-MM-DD");

if(this.orderDetail.departmentWorktime){
this.orderDetail.departmentWorktime = this.orderDetail.departmentWorktime.startTime + " - " + this.orderDetail.departmentWorktime.endTime
}
if(this.orderDetail.department.serviceFee){

this.serviceFeeDesc = "<p>平台将为您提供接种前、后咨询，接种提醒等服务。服务费一经产生，概不退费。</p>";
}


if(this.orderDetail.dogBiteRecord && this.orderDetail.dogBiteRecord !=''){
let dog = this.orderDetail.dogBiteRecord;
if(dog.recordType == 2){ //被咬后

let biteAnimal =[{name:"狗", value: 1},{name:"猫", value: 2},{name:"蝙蝠", value: 3},{name:"其它动物", value: 9}];
for(let i in biteAnimal){
if (dog.biteAnimal == biteAnimal[i].value){
dog.biteAnimal = biteAnimal[i].name;
break;
}
}

let animalType = [{name:"疯动物", value: 1},{name:"可疑疯动物", value: 2},{name:"正常动物", value: 3},{name:"不详", value: 4}];
for(let i in animalType){
if (dog.animalType == animalType[i].value){
dog.animalType = animalType[i].name;
break;
}
}

let animalImmune= [{name:"不详", value: 1},{name:"一年内进行过免疫", value: 2}];
for(let i in animalImmune){
if (dog.animalImmune == animalImmune[i].value){
dog.animalImmune = animalImmune[i].name;
break;
}
}

if(dog.isBiteMulti==1) dog.isBiteMulti = '是';
else dog.isBiteMulti = '否';

let exposePart = [{name:"头面", value: 1},{name:"颈部", value: 2},{name:"躯干", value: 3},{name:"手臂", value: 4},{name:"手部", value: 5},{name:"下肢膝以上", value: 6},{name:"下肢膝以下", value: 7}];
let arr = dog.exposePart.split(',');
let exposePart_string = '';
arr.forEach(function(e,i,arr){
for(let j in exposePart ){
if(e == exposePart[j].value){
exposePart_string =  exposePart_string + '，' + exposePart[j].name;
break;
}
}
})
exposePart_string = exposePart_string.substr(1);
dog.exposePart = exposePart_string;

let exposeWay = [{name:"咬伤", value: 1},{name:"抓伤", value: 2},{name:"其它", value: 3},{name:"舔伤", value: 4}];
for(let i in exposeWay){
if (dog.exposeWay == exposeWay[i].value){
dog.exposeWay = exposeWay[i].name;
break;
}
}


}

if(dog.hasBeforeImmune == 1) dog.hasBeforeImmune = '是';
else dog.hasBeforeImmune = '否';

if(dog.exposeDegree && dog.exposeDegree!=''){
dog.exposeDegree = dog.exposeDegree + '级';
}

if(dog.woundDisposalMeasures && dog.woundDisposalMeasures != ''){
let woundDisposalMeasures = [{name:"自行处理", value: 1},{name:"门诊处理", value: 2},{name:"未处理", value: 3}];
for(let i in woundDisposalMeasures){
if (dog.woundDisposalMeasures == woundDisposalMeasures[i].value){
dog.woundDisposalMeasures = woundDisposalMeasures[i].name;
break;
}
}
}

if(dog.woundTreatment && dog.woundTreatment !=''){
let woundTreatment = [{name:"挤压出血", value: 1},{name:"冲洗", value: 2},{name:"消毒", value: 3},{name:"伤口缝合", value: 4},{name:"未处理", value: 5}];
for(let i in woundTreatment){
if (dog.woundTreatment == woundTreatment[i].value){
dog.woundTreatment = woundTreatment[i].name;
break;
}
}
}



this.orderDetail.dogBiteRecord = dog;
}

}).catch((e) =>{
console.log(e)
})
},

/**
* 取消订单
*/
cancleOrder(){
const _this = this;
if(_this.orderDetail.isPay){

if(_this.orderDetail.department.serviceFee && _this.orderDetail.department.serviceFee>0){
_this.$vux.confirm.show({
title: '提示',
content: '取消预约后支付的预约服务费将不退还，确定取消预约吗？',
onCancel () {
},
onConfirm () {
axios.get(aipConfig.cancelOrder, {params:{id:_this.orderDetail.subscribe.id}}).then((res) => {
_this.$vux.toast.show({
text: '取消成功!',
type: 'success',
width: '40%'
}),
setTimeout(function(){
_this.$router.replace({ path: '/myorder'})
},2000)
}).catch((e) =>{
console.log(e)
})
}
})
}else{
_this.$vux.confirm.show({
title: '提示',
content: '取消预约后支付的费用将在3-7个工作日内完成退款审核并原路退还。',
onCancel () {
},
onConfirm () {
axios.get(aipConfig.cancelOrder, {params:{id:_this.orderDetail.subscribe.id}}).then((res) => {
_this.$vux.toast.show({
text: '取消成功!',
type: 'success',
width: '40%'
}),
setTimeout(function(){
_this.$router.replace({ path: '/myorder'})
},2000)
}).catch((e) =>{
console.log(e)
})
}
})
}
}else{
_this.$vux.confirm.show({
title: '提示',
content: '是否确认取消预约?',
onCancel () {
},
onConfirm () {
axios.get(aipConfig.cancelOrder, {params:{id:_this.orderDetail.subscribe.id}}).then((res) => {
_this.$vux.toast.show({
text: '取消成功!',
type: 'success',
width: '40%'
}),
setTimeout(function(){
_this.$router.replace({ path: '/myorder'})
},2000)
}).catch((e) =>{
console.log(e)
})
}
})
}
},

/**
* 确认接种
*/
confirmSubscribe(){
const _this = this;
this.$vux.confirm.show({
title: '提示',
content: '是否确认已接种?',
onCancel () {
},
onConfirm () {

axios.get(aipConfig.confirmSubscribe,{params:{id:_this.orderDetail.subscribe.id, type:2}}).then((res) =>{
_this.$vux.toast.show({
text: '已接种!',
type: 'success',
width: '40%'
}),
setTimeout(function(){
_this.$router.replace({ path: '/myorder'})
},2000)
}).catch((e) =>{
console.log(e)
})
}
})
},

/**
* 修改预约时间
*/
modifyOrder(){
const _this = this;
let id = this.$route.query.id;
this.$axios.get(this.$aipConfig.updateResidueTimes, {params:{subscribeId: id}}).then((res) => {
if(res.data.data > 0){
this.$vux.confirm.show({
title: '提示',
content: '每个预约单仅能修改两次预约时间，当前剩余修改次数为' + res.data.data + '，是否进行修改？',
onCancel () {
},
onConfirm () {
_this.$router.push({ path: '/modifyOrder',query:{id: id}})
}
})
}else{
this.$vux.alert.show({
title: '提示',
content: '该预约单可修改次数已用完，无法进行修改！'
})
}
}).catch(function(res){
console.log(res)
})

},


/**
* 立即支付
*/
prePay(){
let _this = this;
let od = this.orderDetail;
if(this.clickTag == 0){
this.clickTag = 1; 
axios.get(aipConfig.prePay, {params: {id: od.subscribe.id} }).then((r) => {

wx.chooseWXPay({
appId: r.data.data.appId,     // 公众号名称，由商户传入
timestamp: r.data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
nonceStr: r.data.data.nonceStr, // 支付签名随机串，不长于 32 位
package: r.data.data.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
paySign: r.data.data.paySign, // 支付签名
success: function (res) {
if ( res.errMsg == 'chooseWXPay:ok' ) {
_this.$vux.toast.show({
text: '支付成功!',
type: 'success',
width: '40%'
})
setTimeout(function(){

_this.$router.replace({ path: '/myorder'})
},2000)
} else {
_this.$vux.toast.show({
text: '支付失败!',
type: 'warn',
width: '40%'
})
}
},
cancel:function(res){
_this.clickTag = 0;
_this.$vux.toast.show({
text: '支付取消，请重新支付',
type: 'text',
width: 'auto'
})
},
fail: function (res) {
_this.clickTag = 0;
alert(JSON.stringify(res));
_this.$vux.toast.show({
text: '支付请求失败!',
type: 'text',
width: '40%'
})
}
});
}).catch((e) => {
console.log(e);

_this.clickTag = 0;
})
}
},

/**
* 删除订单
*/
removeSubscribe(){
const _this = this;
this.$vux.confirm.show({
title: '提示',
content: '是否确认删除该订单?',
onCancel () {
},
onConfirm () {
axios.get(aipConfig.removeOrder,{params:{id:_this.orderDetail.subscribe.id}}).then((res) =>{
_this.$vux.toast.show({
text: '已删除!',
type: 'success',
width: '40%',
time: 1000
}),
setTimeout(function(){
_this.$router.replace({ path: '/myorder'})
},1000)
})
}
})
},

/**
* 获取已提交异常反应信息
*/
getParaReactionBySubId(){
let id = this.$route.query.id;
axios.get(aipConfig.getParaReactionBySubId, {params:{subscribeId: id}}).then((res) => {
let reactionList = res.data.data.paraReaction;

reactionList.forEach(function(e,i,arr){
e.reactionDate = moment(e.reactionDate).format("YYYY-MM-DD");
e.createTime = moment(e.createTime).format("YYYY-MM-DD");
let reactionsText = ''
e.reactions.forEach(function(ce,ci,carr){
reactionsText = reactionsText + ce + '；';
})
if(reactionsText != '') reactionsText = reactionsText.substr(0,reactionsText.length - 1);
e.reactionsText = reactionsText;
})

this.reactionList = reactionList;

}).catch(function(res){
console.log(res)
})
},

getResidueTimes(){

}

},

created () {
let orderId = this.$route.query.id;
this.getOrderDetail(orderId);
this.getParaReactionBySubId();
wxShare();
}
}



// WEBPACK FOOTER //
// ./src/pages/myorder/orderDetail.vue