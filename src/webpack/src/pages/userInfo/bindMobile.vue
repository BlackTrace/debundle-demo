
import axios from 'axios'
import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import cookie from 'vux/src/tools/cookie/index.js'

import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import isMobilePhone from 'validator/lib/isMobilePhone'
import { mapState,mapMutations } from 'vuex';
export default {
components: {
Group,
XInput
},
computed:mapState(["user","token","uFrom"]),
data () {
return {
info:{
mobile:'',
validateCode:''
},
vCode:{
ableClass: "able",
unableClass:"unable",
text: "获取验证码"
},
valiState:{
mobileOk: false,
timeCount: false
}
}
},
created () {

wxShare();

},
methods: {
...mapMutations([
"setUser"
]),

/**
* 发送验证码
*/
getVcode(){
const _this = this;
if(!_this.valiState.timeCount && !_this.valiState.mobileOk){
this.$vux.toast.show({
text: '请输入正确的手机号码',
type: 'text',
width:'auto'
})
}else if(!_this.valiState.timeCount && _this.valiState.mobileOk){
axios.get(aipConfig.sendValidateCode, {params:{mobile:_this.info.mobile}}).then((res) => {
if(res.data.ok){
var time = 60;
_this.vCode.text = time+"s";
_this.valiState.timeCount=true;
var timer = setInterval(function(){
time-=1;
if(time==0){
_this.vCode.text="获取验证码";
window.clearInterval(timer);
_this.valiState.timeCount=false;
return;
}
_this.vCode.text=time+"s";
},1000);
}/*else{
this.$vux.toast.show({
text: '获取验证码失败,</br>请稍后再试!',
type: 'text'
})
}*/
})
}
},

/**
* 表单验证
*/
checkForm(){
const _this = this;
let mobile = _this.info.mobile;
let validateCode = _this.info.validateCode;

if(!isMobilePhone(mobile, 'zh-CN')){
this.$vux.toast.show({
text: '请输入正确的手机号码',
type: 'text',
width: 'auto'
})
return false;
}

if(!validateCode){
_this.$vux.toast.show({
text: '请输入验证码',
type: 'text',
width: 'auto'
})
return false;
}
return true;
},


/**
* 初次绑定手机
*/
callBindMobile(){
let _this = this;
if(!_this.checkForm()){
return;
}else{
let params = _this.info;
if(this.uFrom != '') params.uFrom = this.uFrom;
axios.get(aipConfig.bindUserMobile, {params:params,isShowLoading:true}).then((res) => {
if(res.data.data){
_this.$vux.toast.show({
text: '绑定成功!',
type: 'success',
width: '40%'
})

axios.get(aipConfig.findLoginUserByKey).then((r) => {
let user = r.data.data;
if(user.mobile && user.mobile !=='') {
user.originalMobile = user.mobile;
user.mobile = user.mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")
}
this.setUser(user);
}).catch(function(r){
console.log(r)
})
setTimeout(function(){
if(_this.$route.query.vaccCode){
_this.$router.replace({ path: '/fillinPersonalInfo' ,query:{vaccCode: _this.$route.query.vaccCode, depaCode:_this.$route.query.depaCode,vaccId:_this.$route.query.vaccId} })
}else if(_this.$route.query.seckillId){
_this.$router.replace({ path: '/seckill', query:{seckillId:_this.$route.query.seckillId}})
}else if(_this.$route.query.to){
_this.$router.replace({ path: '/' + _this.$route.query.to ,query:{vaccCode: _this.$route.query.vaccCode, depaCode:_this.$route.query.depaCode,vaccId:_this.$route.query.vaccId}})
}else{
_this.$router.replace({ path: '/mine'})
}
},2000)
}
}).catch(function(res){
console.log(res)
})
}
},

/**
* 修改手机号码
*/
changeUserMobile(){
let _this = this;
if(!_this.checkForm()){
return;
}else{
axios.get(aipConfig.changeUserMobile, {params:_this.info,isShowLoading:true}).then((res) => {
if(res.data.data){
_this.$vux.toast.show({
text: '修改成功!',
type: 'success',
width: '40%'
})

axios.get(aipConfig.findLoginUserByKey, {params:{key: this.token}}).then((res) => {
let user = res.data.data;
if(user.mobile && user.mobile !=='') {
user.originalMobile = user.mobile;
user.mobile = user.mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")
}
this.setUser(user);
}).catch(function(res){
console.log(res)
})
setTimeout(function(){
_this.$router.replace({ path: '/setting'})
},2000)
}
}).catch(function(res){
console.log(res)
})
}
}
},

watch: {
info:{
handler(curVal){
const _this = this
if(isMobilePhone(curVal.mobile, 'zh-CN')){
_this.valiState.mobileOk = true;
}else{
_this.valiState.mobileOk = false;
}
},
deep:true
}
}
}



// WEBPACK FOOTER //
// ./src/pages/userInfo/bindMobile.vue