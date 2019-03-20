import Vue from 'vue'
import Router from 'vue-router'
import { setTitleHack } from '../common/setTitle';
import store from '../vuex/store'
import axios from 'axios'
import aipConfig from '../config/apiConfig'
import cookie from 'vux/src/tools/cookie/index.js'

import baseCfg from '../config/baseConfig'
import isMobile from '../common/mobile'
import {callWeixinApi} from '../config/setWxJSSDK'


import home from '@/pages/home/home.vue'
import mine from '@/pages/mine/mine.vue'
import department from '@/pages/department/department.vue'
import depaDetail from '@/pages/department/depaDetail.vue'
import searchDepartment from '@/pages/department/searchDepartment.vue'
import vaccine from '@/pages/vaccine/vaccine.vue'
import subscribe from '@/pages/subscribe/subscribe.vue'
import chooseMember from '@/pages/subscribe/chooseMember.vue'
import submitPreview from '@/pages/subscribe/submitPreview.vue'
import modifyOrder from '@/pages/modifyOrder/modifyOrder.vue'
import departmentList from '@/pages/department/departmentList.vue'
import hotVaccine from '@/pages/vaccine/hotVaccine.vue'
import vaccineQuestion from '@/pages/vaccine/vaccineQuestion.vue'



import myIntegral from '@/pages/integral/myIntegral.vue'
import posters from '@/pages/integral/posters.vue'
import shop from '@/pages/integral/shop.vue'
import goods from '@/pages/integral/goods.vue'
import exchange from '@/pages/integral/exchange.vue'
import integralDet from '@/pages/integral/integralDet.vue'
import intHistory from '@/pages/integral/intHistory.vue'
import ecHistory from '@/pages/integral/ecHistory.vue'
import invitation from '@/pages/integral/invitation.vue'


import joinQualifying from '@/pages/reserve/joinQualifying.vue'
import qualifying from '@/pages/reserve/qualifying.vue'
import myQualifying from '@/pages/reserve/myQualifying.vue'
import myReserves from '@/pages/reserve/myReserves.vue'
import reserve from '@/pages/reserve/reserve.vue'
import reserveShare from '@/pages/reserve/reserveShare.vue'



import joinHpv9 from '@/pages/hpv9/join.vue'
import myHpv9 from '@/pages/hpv9/myHpv9.vue'
import shareHpv9 from '@/pages/hpv9/share.vue'
import ruleHpv9 from '@/pages/hpv9/rule.vue'
import endHpv9 from '@/pages/hpv9/end.vue'
import awardHpv9 from '@/pages/hpv9/awardHpv9.vue'


import myorder from '@/pages/myorder/myorder.vue'
import orderDetail from '@/pages/myorder/orderDetail.vue'
import confirmOrder from '@/pages/myorder/confirmOrder.vue'


import record from '@/pages/record/record.vue'


import messageList from '@/pages/myMessage/messageList.vue'
import message from '@/pages/myMessage/message.vue'


import membersList from '@/pages/familyMembers/membersList.vue'
import addOrEditMember from '@/pages/familyMembers/addOrEditMember.vue'


import bindMobile from '@/pages/userInfo/bindMobile.vue'
import fillinPersonalInfo from '@/pages/userInfo/fillinPersonalInfo.vue'
import setting from '@/pages/userInfo/setting.vue'


import myTickets from '@/pages/myTickets/myTickets.vue'


import adDetail from '@/pages/ad/adDetail.vue'



import insIndex from '@/pages/insurance/index.vue'
import myIns from '@/pages/insurance/myIns.vue'
import insDetail from '@/pages/insurance/insDetail.vue'



import AEFIIndex from '@/pages/AEFI/index.vue'


import dogInjury from '@/pages/subscribe/dogInjury.vue'


import test from '@/pages/test/test.vue'


import numChooseMember from '@/pages/takeNum/chooseMember.vue'
import numFillinMemInfo from '@/pages/takeNum/fillinMemInfo.vue'
import numSuccess from '@/pages/takeNum/numSuccess.vue'

import numPersonalInfo from '@/pages/takeNum/numPersonalInfo.vue'



import HKIndex from '@/pages/HKHpvSearch/HKIndex.vue'
import HKSuccess from '@/pages/HKHpvSearch/HKSuccess.vue'
import HKFail from '@/pages/HKHpvSearch/HKFail.vue'


import healthArticle from '@/pages/health/articleDetail.vue'
import healthArticleList from '@/pages/health/healthArticleList.vue'



import seckill from '@/pages/seckill/seckill.vue'
import checkInSeckill from '@/pages/seckill/checkInSeckill.vue'



import examinationSearch from '@/pages/examination/search.vue'
import examinationFail from '@/pages/examination/fail.vue'
import examinationSuccess from '@/pages/examination/success.vue'
import examinationDepartmentList from '@/pages/examination/departmentList.vue'



Vue.use(Router)

const router = new Router({

routes: [
{
path: '/',
redirect: '/home',
name: 'home',
component: home
},
{
path: '/home',
name: 'home',
component: home
},
{
path: '/mine',
name: 'mine',
component: mine,
beforeEnter: (to,from, next) => {
let user = router.app.$store.state.user;
if(!user.mobile || user.mobile === '') router.push({ path: '/bindMobile'});
else{
if(!user.hasOwnProperty("name") || user.name === '' || !user.hasOwnProperty("sex") || user.sex === '' || !user.hasOwnProperty("birthday")|| user.birthday ===''){
router.push({ path: '/fillinPersonalInfo'});
}
}
next();
}
},
{
path: '/departmentList',
name: 'departmentList',
component: departmentList
},
{
path: '/department',
name: 'department',
component: department
},
{
path: '/depaDetail',
name: 'depaDetail',
component: depaDetail
},
{
path: '/searchDepartment',
component: searchDepartment
},
{
path: '/vaccine',
name: 'vaccine',
component: vaccine
},
{
path: '/hotVaccine',
name: 'hotVaccine',
component: hotVaccine,
},
{
path: '/vaccineQuestion',
name: 'vaccineQuestion',
component: vaccineQuestion,
},
{
path: '/subscribe',
name: 'subscribe',
component: subscribe,
beforeEnter: (to,from, next) => {
if(to.name === 'subscribe' && from.name === 'myorder'){
router.push('/mine')
}
next();
}
},
{
path: '/chooseMember',
name: 'chooseMember',
component: chooseMember,
},
{
path: '/submitPreview',
name: 'submitPreview',
component: submitPreview,
},
{
path: '/modifyOrder',
name: 'modifyOrder',
component: modifyOrder,
},


{
path: '/myIntegral',
component: myIntegral,
meta: {title: '我的积分'},
children: [
{
path: 'posters',
name: 'posters',
component: posters
},
{
path: 'shop',
name: 'shop',
component: shop
}
]
},
{
path: '/goods',
name:'goods',
component: goods
},
{
path: '/exchange',
name:'exchange',
component: exchange
},
{
path: '/integralDet',
component:integralDet,
meta: {title: '积分详情'},
children: [
{
path: 'intHistory',
name: 'intHistory',
component: intHistory
},
{
path: 'ecHistory',
name: 'ecHistory',
component: ecHistory
}
]
},
{
path: '/invitation',
name:'invitation',
component: invitation
},

{
path: '/joinQualifying',
name:'joinQualifying',
component: joinQualifying,
},
{
path: '/qualifying',
name:'qualifying',
component: qualifying
},
{
path: '/myQualifying',
name:'myQualifying',
component: myQualifying
},
{
path: '/myReserves',
name:'myReserves',
component: myReserves
},
{
path: '/reserve',
name:'reserve',
component:reserve
},
{
path: '/reserveShare',
name:'reserveShare',
component:reserveShare
},

{
path: '/joinHpv9',
name:'joinHpv9',
component: joinHpv9
},
{
path: '/myHpv9',
name:'myHpv9',
component: myHpv9
},
{
path: '/shareHpv9',
name:'shareHpv9',
component: shareHpv9
},
{
path: '/ruleHpv9',
name:'ruleHpv9',
component: ruleHpv9
},
{
path: '/endHpv9',
name:'endHpv9',
component: endHpv9
},
{
path: '/awardHpv9',
name:'awardHpv9',
component: awardHpv9
},

{
path: '/myorder',
name: 'myorder',
component: myorder,
meta: {title: '我的预约'}
},
{
path: '/orderDetail',
name: 'orderDetail',
component: orderDetail
},
{
path: '/confirmOrder',
name: 'confirmOrder',
component: confirmOrder
},

{
path: '/record',
component: record,
meta: {title: '接种记录'}
},

{
path: '/messageList',
component: messageList,
meta: {title: '我的通知'},
},
{
path: '/message',
component: message,
meta: {title: '我的通知'},
},

{
path: '/membersList',
component: membersList,
meta: {title: '家庭成员管理'},
},
{
path: '/addOrEditMember',
component: addOrEditMember,
meta: {title: '家庭成员管理'},
},

{
path: '/bindMobile',
component: bindMobile,
meta: {title: '绑定手机'},
},
{
path: '/fillinPersonalInfo',
component: fillinPersonalInfo,
meta: {title: '完善个人信息'},
},
{
path: '/setting',
component: setting,
meta: {title: '设置'},
},

{
path: '/myTickets',
name:'myTickets',
component: myTickets
},

{
path: '/adDetail',
name:'adDetail',
component: adDetail,
},


{
path:'/insIndex',
name:'insIndex',
component:insIndex
},
{
path:'/myIns',
name:'myIns',
component:myIns
},
{
path:'/insDetail',
name:'insDetail',
component:insDetail
},


{
path:'/AEFIIndex',
name:'AEFIIndex',
component:AEFIIndex
},

{
path:'/dogInjury',
name:'dogInjury',
component:dogInjury
},

{
path:'/test',
name:'test',
component:test
},

{
path:'/numChooseMember',
name:'numChooseMember',
component:numChooseMember
},
{
path:'/numFillinMemInfo',
name:'numFillinMemInfo',
component: numFillinMemInfo
},
{
path:'/numSuccess',
name:'numSuccess',
component: numSuccess
},
/*{
path:'/numCheck',
name:'numCheck',
component: numCheck
},*/
{
path:'/numPersonalInfo',
name:'numPersonalInfo',
component: numPersonalInfo
},

{
path:'/HKIndex',
name:'HKIndex',
component: HKIndex,
meta: {title: '香港九价疫苗预约查询'}
},
{
path:'/HKSuccess',
name:'HKSuccess',
component: HKSuccess,
meta: {title: '香港九价疫苗预约查询'}
},
{
path:'/HKFail',
name:'HKFail',
component: HKFail,
meta: {title: '香港九价疫苗预约查询'}
},


{
path:'/healthArticle',
name:'healthArticle',
component: healthArticle,
},

{
path:'/healthArticleList',
name:'healthArticleList',
component: healthArticleList
},

{
path:'/seckill',
name:'seckill',
component: seckill
},
{
path:'/checkInSeckill',
name:'checkInSeckill',
component: checkInSeckill
},

{
path:'/examinationSearch',
name:'examinationSearch',
component: examinationSearch,
meta: {title: '体检预约信息查询'}
},
{
path:'/examinationFail',
name:'examinationFail',
component: examinationFail,
meta: {title: '体检预约信息查询'}
},
{
path:'/examinationSuccess',
name:'examinationSuccess',
component: examinationSuccess,
meta: {title: '体检预约信息查询'}
},
{
path:'/examinationDepartmentList',
name:'examinationDepartmentList',
component: examinationDepartmentList,
meta: {title: '可预约门诊列表'}
},










],
linkActiveClass: 'active'
})


router.beforeEach((to, from, next) => {

window.scrollTo(0,0);
if(to.meta.title){
setTitleHack(to.meta.title);
}else{
setTitleHack("约苗-预约接种");
}
/*if(to.path=='/myHpv9' || to.path=='/shareHpv9'){
router.replace('/endHpv9');
}*/

if(isMobile.Weixin()){
if(JSON.stringify(router.app.$options.store.state.user) == '{}'){
let token = cookie.get('_xzkj_');  
if(token){
axios.get(aipConfig.findLoginUserByKey).then((res) => {
let user = res.data.data;
if(user.mobile && user.mobile !=''){
user.originalMobile = user.mobile;
user.mobile = user.mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");
}
router.app.$options.store.commit('setUser',user);
if(isMobile.Weixin()) callWeixinApi(user.openId);
console.log(JSON.stringify(user));
next();
}).catch(function(res){
console.log(res);
next();
})
}else{
next();
}
}else{
next();
}
}else{
window.location.href = 'https://healthych.com/yuemiao.html'
}



})

router.afterEach((to, from) => {
if(baseCfg.statistics[to.name]){
pageStatistics(baseCfg.statistics[to.name].page)
}
if(baseCfg.statistics.dingyue.page[to.name]){
pageStatistics(baseCfg.statistics.dingyue.page[to.name]);
}
if(baseCfg.statistics.integral.page[to.name]){
pageStatistics(baseCfg.statistics.integral.page[to.name]);
}
})

/*router.afterEach((to,from,next) => {
window.scrollTo(0,0);
});*/

export default router;



// WEBPACK FOOTER //
// ./src/router/index.js