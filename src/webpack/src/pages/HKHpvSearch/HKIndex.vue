
import Group from 'vux/src/components/group/index.vue'
import XInput from 'vux/src/components/x-input/index.vue'
import PopupPicker from 'vux/src/components/popup-picker/index.vue'

import {mapMutations } from 'vuex';
import baseCfg from '../../config/baseConfig'

export default {
components: {
Group,
XInput,
PopupPicker
},
data(){
return{
idCard:'',
vaccCode:["九价HPV疫苗"],
vaccines:[["九价HPV疫苗","流感疫苗","肺炎疫苗"]]
}
},
created(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=HKIndex?fa=wx';
shareInfo.title = '香港疫苗预约进度查询';
shareInfo.desc = '预约成功后带上身份证前往门诊接种即可';
this.$wxShare(shareInfo)
},
methods:{
...mapMutations([
"setHKHpvInfo"
]),
selectVaccine(){

},
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


this.$axios.get(this.$aipConfig.HKHpvInfo,{params: {idCard:this.idCard,vaccineName: this.vaccCode[0]}}).then((res) => {
if(res.data.data.hasInfo ===1 ){
let info = res.data.data.info;
/*info.mobile = info.mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");
info.idCard = info.idCard.replace(info.idCard.substring(4,14),"**********");*/
this.setHKHpvInfo(info);
this.$router.push({ path: '/HKSuccess'});  
}else{
this.$router.push({ path: '/HKFail'});  
}
}).catch((e) =>{
console.log(e);
})



}

}
}



// WEBPACK FOOTER //
// ./src/pages/HKHpvSearch/HKIndex.vue