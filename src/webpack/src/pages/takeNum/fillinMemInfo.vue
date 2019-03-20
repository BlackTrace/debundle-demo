
import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import XAddress from 'vux/src/components/x-address/index.vue'
import XTextarea from 'vux/src/components/x-textarea/index.vue'

import { mapState, mapMutations } from 'vuex';

export default{
components: {
Group,
XInput,
XAddress,
XTextarea
},
computed:mapState(["user","token"]),
data(){
return{
subInfo:{
idCardNo:'',
address:''
},
regions:[],
regionCode:[]
}
},
created(){
const _this = this;
this.getRegions(function(){
_this.getDetailById(_this.$route.query.id)
});
},

methods:{
...mapMutations([
"setUser"
]),

/**
* 获取省市区列表
* @param callBack  回调函数
*/
getRegions(callBack){
const _this=this;
this.$axios.get(this.$aipConfig.regions,{withCredentials:false}).then((res) => {
this.regions=res.data.data;
if(callBack){
callBack();
}
}).catch((e) =>{
console.log(e);
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
* 获取联系人详细信息
* @param id 联系人id
*/
getDetailById(id){
this.$axios.get(this.$aipConfig.linkmanDetail, {params:{id:id}}).then((res) => {
let m = res.data.data;
let subInfo = {
id: m.id,
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

if(m.regionCode) this.regionCode = this.getRegionCodeList(m.regionCode);

}).catch((e) => {
console.log(e)
})
},

/**
* 表单验证
* @returns {boolean}
*/
checkForm(){
const _this = this;
let card = _this.subInfo.idCardNo;
let address = this.subInfo.address;



if(typeof(card) == "undefined" || card == null ||  card == ''){
_this.$vux.toast.show({
text: '请填写身份证号码',
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

if(this.regionCode.length == 0){
_this.$vux.toast.show({
text: '请选择所在地区',
type:'text',
width:'auto'
})
return false;
}

if(typeof(address) == "undefined" || address == null || address == ''){
_this.$vux.toast.show({
text: '请填写详细地址',
type:'text',
width:'auto'
})
return false;
}

return true;
},

submit(){
const _this = this;
if(!this.checkForm()){
return;
}else {
if(this.regionCode.length >0) this.subInfo.regionCode = this.regionCode[2];

this.$axios.get(this.$aipConfig.saveOrUpdateLinkman, {params:this.subInfo,isShowLoading:true}).then((res) => {
if(res.data.data){

if(this.subInfo.relationType ==1){

this.$axios.get(this.$aipConfig.findLoginUserByKey, {params:{key: _this.token}}).then((r) => {
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

this.$axios.get(this.$aipConfig.takeNumberByLinkman, {params:{linkmanId:_this.$route.query.id , depaCode: _this.$route.query.depaCode}}).then((r) => {
_this.$router.replace({ path: '/numSuccess'})
}).catch(function(r){
console.log(r)
})

}
}).catch((e) => {
console.log(e)
})


}

},
}
}



// WEBPACK FOOTER //
// ./src/pages/takeNum/fillinMemInfo.vue