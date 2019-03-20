
import XSwitch from 'vux/src/components/x-switch/index.vue'
import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import Datetime from 'vux/src/components/datetime/index.vue'
import Cell from 'vux/src/components/cell/index.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'
import PopupHeader from 'vux/src/components/popup-header/index.vue'
import Popup from 'vux/src/components/popup/index.vue'
import TransferDom from 'vux/src/directives/transfer-dom/index.js'
import Checker from 'vux/src/components/checker/checker.vue'
import CheckerItem from 'vux/src/components/checker/checker-item.vue'

import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import { mapState, mapMutations } from 'vuex';

export default {
components: {
XSwitch, Group, XInput, Datetime, Cell, PopupPicker, PopupHeader, Popup, Checker, CheckerItem
},
directives: {
TransferDom
},
computed:mapState(["selectedMember"]),
data(){
return {
isInjured:true,
subInfo:{
recordType:'',
biteAnimal:'',
animalType:'',
animalImmune:'',
isBiteMulti:0,
biteNumber:'',
exposeSite:'',
exposeTime:'',
exposePart:'',
exposeWay:'',
hasBeforeImmune:2,
beforeImmuneNum:'',
beforeImmuneTime:'',
idCardNo:''
},
radios1:{
list:[
{
label: '是',
value:1,
isChecked: false,
},
{
label: '否',
value:0,
isChecked: true,
},
]
},
radios2:{
list:[
{
label: '是',
value:1,
isChecked: false,
},
{
label: '否',
value:2,
isChecked: true,
},
]
},
biteAnimal:{
list:[[
{name:"狗", value: '1'},{name:"猫", value: '2'},{name:"蝙蝠", value: '3'},{name:"其它动物", value: '9'}
]],
select:[]
},
animalType:{
list:[[
{name:"疯动物", value: '1'},{name:"可疑疯动物", value: '2'},{name:"正常动物", value: '3'},{name:"不详", value: '4'}
]],
select:[]
},
animalImmune:{
list:[[
{name:"不详", value: '1'},{name:"一年内进行过免疫", value: '2'}
]],
select:[]
},
endDate:'',
showExposePart:false, //显示暴露部位选择框
exposePart:{
select:[],
list:[
{name:"头面", value: 1},{name:"颈部", value: 2},{name:"躯干", value: 3},{name:"手臂", value: 4},{name:"手部", value: 5},{name:"下肢膝以上", value: 6},{name:"下肢膝以下", value: 7}
],
showValue:"请选择被咬部位(可多选)"
},
exposeWay:{
list:[[
{name:"咬伤", value: '1'},{name:"抓伤", value: '2'},{name:"舔伤", value: '4'},{name:"其它", value: '3'}
]],
select:[]
},


}
},
methods:{
...mapMutations([
"setDogInjuryInfo"
]),

checkInjuryNum(index) {

this.radios1.list.forEach((item) => {
item.isChecked = false;
});

this.subInfo.isBiteMulti = this.radios1.list[index].value;
this.subInfo.animalImmune = '';

this.radios1.list[index].isChecked = true;

},

checkHasBeforeImmune(index){

this.radios2.list.forEach((item) => {
item.isChecked = false;
});

this.subInfo.hasBeforeImmune = this.radios2.list[index].value;
this.subInfo.beforeImmuneNum = '';
this.subInfo.beforeImmuneTime = '';

this.radios2.list[index].isChecked = true;
},

/**
* 获取系统当前时间
*/
getNow(){
axios.get(aipConfig.getNow).then((res) => {
let now = res.data.data;
this.endDate = moment(now).format("YYYY-MM-DD")
}).catch((e) => {
console.log(e)
})
},

/**
* 选择被咬部位
*/
selectExposePart(){
this.showExposePart=false;
let showValue = '';
let subValue = '';
if(this.exposePart.select.length>0){
for(let i in this.exposePart.select){
showValue = showValue + '，' + this.exposePart.list[this.exposePart.select[i]-1].name;
subValue = subValue + ',' + this.exposePart.select[i];
}
showValue = showValue.substr(1);
subValue = subValue.substr(1);
}else{
showValue = "请选择被咬部位(可多选)";
subValue = '';
}
this.exposePart.showValue = showValue;
this.subInfo.exposePart = subValue;
},

/**
* 验证判断
*/
checkForm(){
if(this.isInjured){ // 已被咬伤

if(this.biteAnimal.select.length==0){
this.$vux.toast.show({
text: '请选择伤人动物',
type: 'text',
width: 'auto'
})
return false;
}

if(this.animalType.select.length==0){
this.$vux.toast.show({
text: '请选择伤人动物种类',
type: 'text',
width: 'auto'
})
return false;
}

if(this.animalImmune.select.length==0){
this.$vux.toast.show({
text: '请选择伤人动物免疫史',
type: 'text',
width: 'auto'
})
return false;
}

if(this.subInfo.isBiteMulti == 1){
if(this.subInfo.biteNumber == '' || this.subInfo.biteNumber ==0){
this.$vux.toast.show({
text: '请填写咬伤人数',
type: 'text',
width: 'auto'
})
return false;
}
}

if(this.subInfo.exposeSite.replace(/ /g,'') == ''){
this.$vux.toast.show({
text: '请填写被咬地点',
type: 'text',
width: 'auto'
})
return false;
}

if(this.subInfo.exposeTime == ''){
this.$vux.toast.show({
text: '请选择被咬时间',
type: 'text',
width: 'auto'
})
return false;
}

if(this.subInfo.exposePart == ''){
this.$vux.toast.show({
text: '请选择被咬部位',
type: 'text',
width: 'auto'
})
return false;
}

if(this.exposeWay.select.length==0){
this.$vux.toast.show({
text: '请选择咬伤方式',
type: 'text',
width: 'auto'
})
return false;
}
}

if(this.subInfo.hasBeforeImmune == 1){
if(this.subInfo.beforeImmuneNum == '' || this.subInfo.beforeImmuneNum == 0){
this.$vux.toast.show({
text: '请填写被咬前免疫针次数量',
type: 'text',
width: 'auto'
})
return false;
}

if(this.subInfo.beforeImmuneTime == ''){
this.$vux.toast.show({
text: '请选择被咬前免疫时间',
type: 'text',
width: 'auto'
})
return false;
}

}

if(!this.selectedMember.idCardNo || this.selectedMember.idCardNo =='' ){
if(this.subInfo.idCardNo == ''){
this.$vux.toast.show({
text: '请补全接种人身份证',
type: 'text',
width: 'auto'
})
return false;
}else{

let cardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
if(cardReg.test(this.subInfo.idCardNo) === false){
this.$vux.toast.show({
text: '身份证输入不合法',
type:'text',
width:'auto'
})
return false;
}
}
}

return true;
},

/**
* 提交
*/
submit(){
const _this = this;
if(!this.checkForm()){
return;
}else {

if(this.isInjured){
this.subInfo.recordType = 2;

this.subInfo.biteAnimal = this.biteAnimal.select[0];
this.subInfo.animalType = this.animalType.select[0];
this.subInfo.animalImmune = this.animalImmune.select[0];
this.subInfo.exposeTime = this.subInfo.exposeTime + ':00';
this.subInfo.exposeWay = this.exposeWay.select[0];

}else {
this.subInfo.recordType =1;
}
if(this.subInfo.idCardNo == '') this.subInfo.idCardNo = this.selectedMember.idCardNo;

this.setDogInjuryInfo(this.subInfo);
this.$router.push({ path: '/submitPreview'});

}
},

back(){
this.$router.go(-1);
}

},


created: function () {
this.getNow();

}

}




// WEBPACK FOOTER //
// ./src/pages/subscribe/dogInjury.vue