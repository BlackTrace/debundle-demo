
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
import isMobilePhone from 'validator/lib/isMobilePhone'
import baseCfg from '../../config/baseConfig'
import Tab from 'vux/src/components/tab/tab.vue'
import TabItem from 'vux/src/components/tab/tab-item.vue'

import { mapState,mapMutations } from 'vuex'

export default{
components: {
Tab,
TabItem,
},
data(){
return{
helpUserNum:'',
shareToken:''
}
},
computed:mapState(["awardPoints","user"]),
created:function(){
this.$parent.$emit('change-footer', false);
this.setWxShare();
this.getUserPoints();

},
methods:{
...mapMutations([
"setAwardPoints"
]),
getUserPoints(){
axios.get(aipConfig.getUserPoints).then((res) => {
this.helpUserNum = res.data.data.helpUserNum;
this.setAwardPoints(res.data.data.awardPoints);
}).catch((e) =>{
console.log(e);
})
},
setWxShare(){
let shareInfo = {};
shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'jifen_share.png';
shareInfo.title = '全国四价宫颈癌疫苗预约登记开始啦！抢疯了';
shareInfo.desc = '宫颈癌是首个可以预防的癌症！80%女生会感染，80%女生不知道！';
axios.get(aipConfig.getShareToken).then((res) => {
this.shareToken = res.data.data;
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&shareToken=' + this.shareToken +'&sourceUserId=' + this.user.id;
wxShare(shareInfo)
}).catch((e) =>{
console.log(e);
})

},

getShareToken(){
axios.get(aipConfig.getShareToken).then((res) => {
this.shareToken = res.data.data;
}).catch((e) =>{
console.log(e);
})
}

}
}



// WEBPACK FOOTER //
// ./src/pages/integral/myIntegral.vue