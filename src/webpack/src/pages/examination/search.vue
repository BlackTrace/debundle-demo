
import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'

import baseCfg from '../../config/baseConfig'
export default {
components: {
Group,
XInput
},
data(){
return{
idCard:''
}
},
created(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=examinationSearch?fa=wx';
shareInfo.title = '体检筛查进度查询';
shareInfo.desc = '请按照页面提示预约时间体检，逾期未体检则默认作废';
this.$wxShare(shareInfo);
},
methods: {
/**
* 提交查询
*/
submit(){

if(this.idCard == ''){
this.$vux.toast.show({
text: '请输入预约人身份证号码',
type: 'text',
width: 'auto'
})
return;
}else{
let cardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
if(cardReg.test(this.idCard) === false) {
this.$vux.toast.show({
text: '身份证输入不合法',
type:'text',
width:'auto'
})
return;
}
}


this.$axios.get(this.$aipConfig.healthBookingSearch,{params: {idCard:this.idCard}}).then((res) => {
if(res.data.data.hasInfo ===1 ){
this.$router.push({ path: '/examinationSuccess',query:{idCard:this.idCard}});  
}else{
this.$router.push({ path: '/examinationFail'});  
}
}).catch((e) =>{
console.log(e);
})

}

}
}




// WEBPACK FOOTER //
// ./src/pages/examination/search.vue