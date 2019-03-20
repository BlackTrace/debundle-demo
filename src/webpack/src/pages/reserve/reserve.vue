
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'
import Countup from 'vux/src/components/countup/index.vue'

export default {
components: {
Countup
},
data(){
return{
reserve:[],
showShare:false,
departments:[]
}
},

created(){
this.getReserve();
this.setWxShare();
},

methods:{
getReserve(){
axios.get(aipConfig.registerRanking,{params:{registerDetailId:this.$route.query.registerDetailId}}).then((res) => {

let reserve = res.data.data;


if(reserve.registerType ==2 && reserve.status==2) this.getDepartmentsList(reserve.regionCode, reserve.vaccineCode);

this.reserve = res.data.data;


}).catch((e) =>{
console.log(e)
})
},

share(){
const _this = this;
_czc.push(["_trackEvent","订阅详情页","分享按钮点击量"]);
this.showShare = true;
setTimeout(function(){
_this.showShare = false;
},3000)
},

hideShare(){
this.showShare = false;
},


/**
* 获取门诊列表
* @param regionCode 地区code
*/
getDepartmentsList(regionCode, vaccineCode){
let params = {
offset:0,
limit:100,
regionCode: regionCode,
isOpen: 1,
vaccineCode: vaccineCode
}
axios.get(aipConfig.departments,{params:params}).then((res) => {
let list = res.data.data.rows;
list.forEach(function(e,i,arr){
if(!e.imgUrl || e.imgUrl =='') e.imgUrl = '../../static/images/picture_empty.png';
});
this.departments = list;

}).catch(function(res){
console.log(res)
})
},

setWxShare(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/reserveShare?fa=wx';
shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'reserve_share.png';
shareInfo.title = '好消息，大陆九价HPV疫苗即将上市，事先订阅到苗消息，快人一步接种啦！';
shareInfo.desc = '宫颈癌是首个可以预防的癌症！80%的女生会感染，80%的女生不知道！';
wxShare(shareInfo)
},

}
}



// WEBPACK FOOTER //
// ./src/pages/reserve/reserve.vue