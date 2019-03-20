import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);

const state={
  user:{},   // 微信用户信息
  //bindMobile:'',   // 绑定手机号码
  vaccine:'',  // 疫苗信息
  department:'',  // 门诊信息
  isMobile:{
    isWx: false,  //是否微信
    isXdm: false  // 是否小豆苗
  },
  currentCity:'',  // 当前选择城市
  currentAreaCode:'', // 当前选择区域
  awardPoints:0, // 用户当前所获得积分
  messageNum:0, // 消息数量
  token:'',
  selectedMember:{}, //选中接种人
  submitInfo:{}, // 预下单信息
  position:{},//定位信息，
  isWxConfigReady: false,  //微信配置完成
  dogInjuryInfo:{} , // 犬伤信息

  HKHpvInfo:{}, //香港九价hpv预约信息
  uFrom:'', // 统计渠道
  currentVaccineCode:'',//选择的疫苗编码
  cities:[],//城市列表
}

const mutations = {
  setUser(state,user){
    state.user = user;
  },
  /*setBindMobile(state,bindMobile){
    state.user.mobile = bindMobile;
  },*/
  setVaccine(state,vacc){
    state.vaccine = vacc;
  },
  setDepa(state,depa){
    state.department = depa;
  },
  setUa(state,ua){
    if(ua=="wx"){
      state.isMobile.isWx = true;
    }else if(ua=="xdm"){
      state.isMobile.isXdm = true;
    }
  },
  setCurrentCity(state,e){
    state.currentCity = e;
  },
  setCurrentAreaCode(state,e){
    state.currentAreaCode = e;
  },
  setAwardPoints(state,e){
    state.awardPoints = e;
  },
  setMessageNum(state,e){
    state.messageNum = e;
  },
  setToken(state,e){
    state.token = e;
  },
  setSelectedMember(state,e){
    state.selectedMember = e;
  },
  setSubmitInfo(state,e){
    state.submitInfo = e;
  },
  setPosition(state,e){
     state.position=e;
  },
  setDogInjuryInfo(state,e){
    state.dogInjuryInfo = e;
  },

  setHKHpvInfo(state,e){
    state.HKHpvInfo = e;
  },

  setUFrom(state,e){
    state.uFrom = e;
  },

  setCurrentVaccineCode(state,e){
    state.currentVaccineCode=e;
  },
  setCities(state,e){
    state.cities=e;
  }
}

export default new Vuex.Store({
  state,
  mutations
})



// WEBPACK FOOTER //
// ./src/vuex/store.js