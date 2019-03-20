
import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import Datetime from 'vux/src/components/datetime/index.vue'
import Cell from 'vux/src/components/cell/index.vue'
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
XAddress,
},
computed:mapState(["user","token"]),
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
subInfo:{
userId:'',
name:'',
sex:'',
birthday:'',
isDefault:1,
relationType:1,
idCardNo:'',
regionCode:'',
address:''
},
regions:[],
regionCode:[]
}
},

methods:{
...mapMutations([
"setUser"
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


let cardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
if(typeof(card) != "undefined" && card != ''){
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
if(this.regionCode.length >0) this.subInfo.regionCode = this.regionCode[2];
axios.get(aipConfig.saveOrUpdateLinkman, {params:this.subInfo,isShowLoading:true}).then((res) => {
if(res.data.data){
this.$vux.toast.show({
text: '提交成功',
type: 'success',
width: '40%'
})

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
setTimeout(function(){
if(_this.$route.query.vaccCode){
_this.$router.replace({ path: '/vaccine',query:{code: _this.$route.query.vaccCode, depaCode:_this.$route.query.depaCode, vaccId:_this.$route.query.vaccId }})
}else if(_this.$route.query.seckillId){
_this.$router.replace({ path: '/seckill', query:{seckillId:_this.$route.query.seckillId}})
}else{
_this.$router.replace({ path: '/mine'})
}
},2000)

}
}).catch((e) => {
console.log(e)
})

}
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
wxShare();
this.getRegions();
}

}




// WEBPACK FOOTER //
// ./src/pages/userInfo/fillinPersonalInfo.vue