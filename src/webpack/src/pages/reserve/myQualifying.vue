
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
import baseCfg from '../../config/baseConfig'
import Countup from 'vux/src/components/countup/index.vue'

import { mapState, mapMutations } from 'vuex';
import poster from '../../components/posters/posters.vue'
export default {
components: {
Countup,
poster
},
computed: mapState(['user']),

data () {
return {
isSubscribe:'',
rankingNumber:'',
rankingRange:'',
vaccineName:'',
showShare:true,
userId:'',
departments:[],
department:''
}
},

created () {

pageStatistics(baseCfg.statistics.myQualifying);
this.autoHideShare();

if(this.user.originalMobile && this.user.originalMobile !=''){
axios.get(aipConfig.isRegister, {params:{mobile:this.user.originalMobile}}).then((res) => {
if(res.data.data){
let userId = res.data.data;
this.userId = res.data.data;
axios.get(aipConfig.registerRanking, {params:{userId:userId}}).then((res) => {
this.isSubscribe = res.data.data.isSubscribe;
this.rankingNumber = res.data.data.rankingNumber;
this.rankingRange = res.data.data.rankingRange;
if(res.data.data.vaccineName) this.vaccineName = res.data.data.vaccineName;

if(res.data.data.regionCode) this.getDepartmentsList(res.data.data.regionCode);

if(res.data.data.depaCode) this.getDepartment(res.data.data.depaCode);

}).catch((e) =>{
console.log(e);
})
}else{
this.$router.replace({ path: '/joinQualifying'})
}
}).catch((e) =>{
console.log(e);
})
}else{
this.$router.replace({ path: '/joinQualifying'})
}

},

methods: {
/**
* 配置微信分享信息
*/
setWxShare(){
let shareInfo = {};
if(this.department !='')  shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&sourceUserId=' + this.userId +'&depaCode=' + this.department.code;
else shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&sourceUserId=' + this.userId;
shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'jifen_share.png';
shareInfo.title = '全国四价宫颈癌疫苗预约登记开始啦！抢疯了';
shareInfo.desc = '宫颈癌是首个可以预防的癌症！80%女生会感染，80%女生不知道！';
wxShare(shareInfo)
},

/**
* 隐藏分享蒙层
*/
hideShare(){
this.showShare = false;
},

/**
* 自动隐藏分享蒙层
*/
autoHideShare(){
const _this =this;
setTimeout(function(){
_this.showShare = false;
},3000)
},

/**
* 获取门诊列表
* @param regionCode 地区code
*/
getDepartmentsList(regionCode){
let params = {
offset:0,
limit:100,
regionCode: regionCode,
isOpen: 1
}
axios.get(aipConfig.departments,{params:params}).then((res) => {
let list = res.data.data.rows;
list.forEach(function(e,i,arr){
if(!e.imgUrl || e.imgUrl =='') e.imgUrl = '../../static/images/picture_empty.png';
});
this.departments = list;


this.setWxShare();
}).catch(function(res){
console.log(res)
})
},


getDepartment(depaCode){
axios.get(aipConfig.department, {params:{depaCode: depaCode}}).then((res) => {
let depa = res.data.data;
if(! depa.imgUrl ||  depa.imgUrl =='')  depa.imgUrl = '../../static/images/picture_empty.png';
this.department = depa;


this.setWxShare();
}).catch(function(res){
console.log(res)
})
}


}

}



// WEBPACK FOOTER //
// ./src/pages/reserve/myQualifying.vue