
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import { mapState, mapMutations } from 'vuex';
import myAlert from '../../components/myAlert/myAlert.vue'
import CheckIcon from 'vux/src/components/check-icon/index.vue'


export default{
components: {
myAlert,
CheckIcon
},
computed:mapState(["submitInfo","dogInjuryInfo","selectedMember","user"]),
data(){
return{
authorize:true,
serviceFeeDesc:'',
showServiceFee:false,
clickTag:0
}
},
created(){
wxShare();
this.serviceFeeDesc = "<p>平台将为您提供接种前、后咨询，接种提醒等服务。服务费一经产生，概不退费。</p>";
},
methods:{
...mapMutations([
"setSelectedMember", "setUser"
]),

submit(){
const _this = this;
let params = {
depaCode: this.submitInfo.department.code,
vaccineCode: this.submitInfo.vaccine.code,
vaccineIndex: this.submitInfo.vaccineIndex.value || 1,
linkmanId: this.submitInfo.linkman.id,
subscribeDate: this.submitInfo.subscribeDate,
subscirbeTime: this.submitInfo.subscirbeTime.value,
departmentVaccineId: this.submitInfo.departmentVaccineId
}
if(!this.authorize){
this.$vux.toast.show({
text: '需同意由门诊提供接种服务',
type: 'text',
width: 'auto'
})
}else{

if(this.clickTag == 0){
this.clickTag = 1; 
axios.get(aipConfig.addOrder, {params:params,isShowLoading:true}).then((res) => {

if(res.data.data.subscribeId){


if(JSON.stringify(this.dogInjuryInfo) != '{}'){
let info = {
...this.dogInjuryInfo,
subscribeId: res.data.data.subscribeId,
}
axios.get(aipConfig.addBiteRecord,{params:info}).then((r) => {
if(info.idCardNo != ''){
let selectedMember = this.selectedMember;
selectedMember.idCardNo = info.idCardNo;
this.setSelectedMember(selectedMember);
if(this.selectedMember.relationType == 1){
let user = this.user;
user.idCardNo = info.idCardNo;
this.setUser(user);
}
}
}).catch((e) => {
console.log(e)
})

}

if(res.data.data.wxPrePayResponse){


wx.chooseWXPay({
appId: res.data.data.wxPrePayResponse.appId,     // 公众号名称，由商户传入
timestamp: res.data.data.wxPrePayResponse.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
nonceStr: res.data.data.wxPrePayResponse.nonceStr, // 支付签名随机串，不长于 32 位
package: res.data.data.wxPrePayResponse.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
paySign: res.data.data.wxPrePayResponse.paySign, // 支付签名
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
_this.$vux.toast.show({
text: '支付取消，请重新支付',
type: 'text',
width: 'auto'
})
setTimeout(function(){
_this.$router.replace({ path: '/myorder'})
},1000)
},
fail: function (res) {

_this.$vux.toast.show({
text: '支付请求失败，请重新支付',
type: 'text',
width: 'auto'
})
setTimeout(function(){
_this.$router.replace({ path: '/myorder'})
},1000)
}
});
}else{


_this.$vux.toast.show({
text: '提交成功!',
type: 'success',
width: '40%'
})
setTimeout(function(){

_this.$router.replace({ path: '/myorder'})
},2000)
}


}


}).catch((e) => {
console.log(e);

_this.clickTag = 0;
})



}

}
}
}
}



// WEBPACK FOOTER //
// ./src/pages/subscribe/submitPreview.vue