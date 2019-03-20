
import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import Datetime from 'vux/src/components/datetime/index.vue'
import Cell from 'vux/src/components/cell/index.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'
import XAddress from 'vux/src/components/x-address/index.vue'

import { mapState, mapMutations } from 'vuex';
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'

export default{
components: {
Group,
XInput,
Datetime,
Cell,
PopupPicker,
XAddress
},
computed:mapState(["user","token","selectedMember"]),
data(){
return{
radios:{
list:[
{
label: '男',
value:'1',
isChecked: false,
},
{
label: '女',
value:'2',
isChecked: true,
},
],
value:2
},
pickerRelation:{
list:[[{name:'',value:''}]],
relationType:[]
},
subInfo:{
userId:'',
name:'',
sex:'',
birthday:'',
isDefault:0,
relationType:'',
idCardNo:'',
regionCode:'',
address:'',
},
isNew:'',
regions:[],
regionCode:[]
}
},

methods:{
...mapMutations([
"setUser","setSelectedMember"
]),

checkRadio(index) {

this.radios.list.forEach((item) => {
item.isChecked = false;
});

this.radios.value = this.radios.list[index].value;

this.radios.list[index].isChecked = true;

},

/**
* 表单验证
* @returns {boolean}
*/
checkForm(){
const _this = this;
let name = _this.subInfo.name;
let birthday = _this.subInfo.birthday;
let relation = _this.pickerRelation.relationType.length;
let card = _this.subInfo.idCardNo;


if(name==''){
_this.$vux.toast.show({
text: '请输入名字',
type:'text',
width:'auto'
})
return false;
}
if(name.length < 2 || name.length > 10){
_this.$vux.toast.show({
text: '名字须为2-10个字',
type:'text',
width:'auto'
})
return false;
}


if(birthday==''){
_this.$vux.toast.show({
text: '请选择出生日期',
type:'text',
width:'auto'
})
return false;
}


if(relation == 0){
_this.$vux.toast.show({
text: '请选择该成员与本人关系类型',
type:'text',
width:'auto'
})
return false;
}


let cardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
if(typeof(card) != "undefined" && card != null  && card != ''){
if(cardReg.test(card) === false) {
_this.$vux.toast.show({
text: '身份证输入不合法',
type:'text',
width:'auto'
})
return false;
}
}

return true;
},

submit(){
const _this = this;
if(!this.checkForm()){
return;
}else {
this.subInfo.userId= this.user.id;
this.subInfo.sex = this.radios.value;
this.subInfo.relationType = this.pickerRelation.relationType[0];
if(this.$route.query.id) this.subInfo.id = this.$route.query.id;
if(this.regionCode.length >0) this.subInfo.regionCode = this.regionCode[2];

axios.get(aipConfig.saveOrUpdateLinkman, {params:this.subInfo,isShowLoading:true}).then((res) => {
if(res.data.data){
this.$vux.toast.show({
text: '提交成功',
type: 'success',
width: '40%',
time:1000
})
if(this.subInfo.relationType ==1){

axios.get(aipConfig.findLoginUserByKey).then((r) => {
let user = r.data.data;
if(user.mobile && user.mobile !==''){
user.originalMobile = user.mobile;
user.mobile = user.mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");
}
_this.setUser(user);
}).catch(function(r){
console.log(r)
})
}
this.setSelectedMember({});
setTimeout(function(){
_this.$router.go(-1)
},1000)
}
}).catch((e) => {
console.log(e)
})
}

},



/**
* 获取联系人关系列表
*/
getRelations(){
const _this = this;
axios.get(aipConfig.relations,).then((res) => {
let relations = res.data.data;
this.pickerRelation.list[0].length = 0;
relations.forEach(function(e,i,arr){
_this.pickerRelation.list[0].push({
name:e.relationName,
value:e.relationType.toString()
});
})

if(this.$route.query.id){
this.getDetailById(this.$route.query.id)
}
}).catch((e) => {
console.log(e)
})
},

/**
* 选择关系类型
* @param val
*/
/*selectRelationType(val){
this.pickerRelation.relationType = [val]
},*/

/**
* 获取联系人详细信息
* @param id 联系人id
*/
getDetailById(id){
axios.get(aipConfig.linkmanDetail, {params:{id:id}}).then((res) => {
let m = res.data.data;
let subInfo = {
userId:  m.userId,
name: m.name,
sex: m.sex,
birthday: moment(m.birthday ).format("YYYY-MM-DD"),
isDefault: m.isDefault,
relationType: m.relationType,
idCardNo: m.idCardNo,
regionCode: m.regionCode,
address: m.address
}
this.subInfo = subInfo;


this.radios.list.forEach((item) => {
item.isChecked = false;
});
if(m.sex ==1){
this.radios.value = 1;
this.radios.list[0].isChecked = true;
}else{
this.radios.value = 2;
this.radios.list[1].isChecked = true;
}

this.pickerRelation.relationType = [m.relationType.toString()];

if(m.regionCode) this.regionCode = this.getRegionCodeList(m.regionCode);

}).catch((e) => {
console.log(e)
})
},

/**
* 根据区code计算得出当前省市区code列表
*/
getRegionCodeList(dCode){
let arr = [];
let pCode='',cCode='';
this.regions.forEach(function(e,i,arr){
if(e.value == dCode){
cCode = e.parent;
}
});
this.regions.forEach(function(e,i,arr){
if(e.value == cCode){
pCode = e.parent;
}
});
arr.push(pCode,cCode,dCode);
return arr;
},

/**
* 删除联系人
*/
deleteMem(){
const _this = this;
this.$vux.confirm.show({
title: '提示',
content: '确认删除该家庭成员吗？',
onCancel () {
},
onConfirm () {
axios.get(aipConfig.deleteLinkman,{params:{id:_this.$route.query.id}}).then((res) => {
if(res.data.data){
_this.$vux.toast.show({
text: '删除成功',
type: 'success',
width: '40%',
time:1000
})
if(JSON.stringify(_this.selectedMember) != '{}'){
if(_this.selectedMember.id == _this.$route.query.id){
_this.setSelectedMember({});
}
}
setTimeout(function(){
_this.$router.replace({ path: '/membersList'})
},1000)
}
}).catch((e) => {
console.log(e)
})
}
})
},

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

},

created(){
const _this = this;
wxShare();
this.getRegions(function(){
_this.getRelations();
});
if(this.$route.query.id) this.isNew = false;
else this.isNew = true;
}
}




// WEBPACK FOOTER //
// ./src/pages/familyMembers/addOrEditMember.vue