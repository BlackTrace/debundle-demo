
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'
import Cell from 'vux/src/components/cell/index.vue'
import Group from 'vux/src/components/group/index.vue'
import cookie from 'vux/src/tools/cookie/index.js'
import Badge from 'vux/src/components/badge/index.vue'

import { mapState,mapMutations } from 'vuex';
import comFooter from '../../components/comFooter/comFooter.vue'
export default {
components: {
Group,
Cell,
comFooter,
Badge
},
data () {
return {
ticketNum:0,
insUrl:''
}
},
methods:{
...mapMutations([
"setUser","setMessageNum","setAwardPoints"
]),

/**
* 获取优惠券
*/
myFreeTickets(){
axios.get(aipConfig.myFreeTickets).then((res) => {
this.ticketNum = res.data.data.length;
})
},

/**
* 获取消息数量
*/
getNotReadNoticeNum(){
axios.get(aipConfig.getNotReadNoticeNum).then((res) => {
this.setMessageNum(res.data.data.toString());
})
},

/**
* 获取用户积分信息
*/
getUserPoints(){
axios.get(aipConfig.getUserPoints).then((res) => {
this.setAwardPoints(res.data.data.awardPoints);
}).catch((e) =>{
console.log(e);
})
},

},
computed:mapState(["user","messageNum","awardPoints"]),

created () {
wxShare();
this.insUrl = baseCfg.appInfo.appUrl + 'ins/index.html#/home';
this.myFreeTickets();
this.getUserPoints();
this.getNotReadNoticeNum();

}
}



// WEBPACK FOOTER //
// ./src/pages/mine/mine.vue