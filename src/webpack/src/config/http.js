import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import store from '../vuex/store'
import md5 from 'js-md5';


/*axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';*/
/*axios.defaults.headers.post['Accept']= 'application/json'
axios.defaults.headers.post ['Access-Control-Allow-Origin'] = '*'*/
// 指定允许其他域名访问
/*header('Access-Control-Allow-Origin:*');
// 响应类型
header('Access-Control-Allow-Methods:GET');
// 响应头设置
header('Access-Control-Allow-Headers:x-requested-with,content-type');*/



//POST传参序列化
axios.interceptors.request.use((config) => {


  if(config.isShowLoading){
    Vue.$vux.loading.show({
      text: '加载中...',
      width:'2rem'
    })
  }

  /*if(config.method  === 'post' || config.method  === 'put' ){
    config.data = qs.parse(config.data,{arrayFormat:'brackets'})
  }*/
  if(config.method  === 'post' ){
    config.data = qs.stringify(config.data);
  }
  //全局追加token
  /*config.params = (
    Object.assign((config.params ? config.params : {}),{"tk":'test'})
  )*/

  if(config.url != 'https://adultvacc-1253522668.file.myqcloud.com/data/regions.json'){
    if (store.state.token && store.state.token!='') {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.tk = store.state.token;
    }

    //时间戳
    if(window.localStorage.getItem('diff') && window.localStorage.getItem('diff')!=''){
      let now = new Date();
      let localTime = now.getTime();
      let st = moment(new Date(localTime + parseInt(window.localStorage.getItem('diff')))).format("YYYYMMDDHHmm"); //localStorage会自动将localStorage转换成为字符串形式
      config.headers.st = md5( st + 'jkzx705');

    }

  }


  return config

},(error) =>{
  Vue.$vux.loading.hide()
  Vue.$vux.toast.show({text: '请求超时，请稍后再试！',type:'text',time:2000,width:'80%'})
  return Promise.reject(error)
})


axios.interceptors.response.use((res) =>{
  Vue.$vux.loading.hide();
  if(res.data.code && res.data.code != '0000'){

    if(res.config.url == '/his/wx/inoculateUser/workOrderDetail.do' && res.data.code == '1101'){
      // 获取用户取号排队信息接口，若无排队信息，不提示错误信息
    }else{
      if(res.data.msg){
        Vue.$vux.toast.show({text:res.data.msg,type:'text',time:2000,width:'auto'})
      }
    }

    return Promise.reject(res)
  }
  if(res.data.error){
    Vue.$vux.toast.show({text:'系统繁忙~请稍后再试',type:'text',time:2000,width:'auto'})
    return Promise.reject(res)
  }
  return res;
}, (error) => {
  if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1){
    Vue.$vux.loading.hide()
    Vue.$vux.toast.show({text: '请求超时，请稍后再试！',type:'text',time:2000,width:'80%'})
  }
  if(error.response){
    Vue.$vux.loading.hide();
    Vue.$vux.toast.show({text:'系统繁忙~请稍后再试',type:'text',time:2000,width:'auto'})
    /*switch (error.response.status){
      case 500:
        Vue.$vux.toast.show({text:'服务器发生错误,请稍后再试',type:'text',time:2000,width:'auto'})
        break;
      case 502:
        Vue.$vux.toast.show({text:'网关错误',type:'text',time:2000,width:'auto'})
        break;
      case 504:
        Vue.$vux.toast.show({text:'网关超时',type:'text',time:2000,width:'auto'})
        break;
      default:
        Vue.$vux.toast.show({text:'请求失败,请检查您的网络设置',type:'text',time:2000,width:'auto'})
    }*/
  }
  return Promise.reject(error)
})

export default axios



// WEBPACK FOOTER //
// ./src/config/http.js