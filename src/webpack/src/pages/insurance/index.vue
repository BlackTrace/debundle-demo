//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'
import {mapState, mapMutations} from 'vuex'
import isMobilePhone from 'validator/lib/isMobilePhone'
import qs from 'qs'

export default {
  data(){
    return{
      subInfo:{
        mobile:'',
        validateCode:''
      },
      vCode:{
        ableClass: "able",
        unableClass:"unable",
        text: "获取验证码"
      },
      valiState:{
        mobileOk: false,
        timeCount: false
      },
      urlParams:{}
    }
  },
  computed: mapState(["user","token"]),

  /*beforeRouteEnter (to, from, next) {

    next(vm => {
      let code = vm.$route.query.code || '';
      for(let i in urlList){
        if(code == urlList[i].hdCode){
          vm.urlParams = urlList[i];
          break;
        }
      }
      if(vm.user.mobile){
        window.location.href = vm.urlParams.hdUrl;
      }else{
        vm.accesslog();
      }
    })

  },*/

  created(){
    const _this = this;
    /*const urlList = [
      {
        hdCode:0,
        hdUrl:'https://iicp.pingan.com.cn/icp/adminResources/src/productDetail.html?keyCode=qGfeaW&from=singlemessage&userId=' + this.user.id
      },
      {
        hdCode:1,
        hdUrl:'https://iicp.pingan.com.cn/icp/adminResources/src/productDetail.html?keyCode=iaQCpf&from=singlemessage&userId='+ this.user.id
      }
    ];

    let code = this.$route.query.code || '';
    for(let i in urlList){
      if(code == urlList[i].hdCode){
        this.urlParams = urlList[i];
        break;
      }
    }*/
    this.urlParams.hdCode = this.$route.query.id;
    if(this.user.mobile){

      pageStatistics('保险入口')

      this.findPartnerUrlById(function(){
        axios.post(aipConfig.insAccesslog, _this.urlParams).then((res) => {
          window.location.href = _this.urlParams.hdUrl || window.location.protocol+'//'+ (window.location.host) + '/passport/wx/login.do';
        }).catch((e) =>{
          console.log(e);
        })
      })



    }
  },

  methods: {
    ...mapMutations([
      "setUser"
    ]),

    /**
     *用户跳转保险页面日志记录接口
     */
    accesslog(){
      axios.post(aipConfig.insAccesslog, this.urlParams).then((res) => {

      }).catch((e) =>{
        console.log(e);
      })
    },

    /**
     * 发送验证码
     */
    getVcode(){
      const _this = this;
      if(!_this.valiState.timeCount && !_this.valiState.mobileOk){
        this.$vux.toast.show({
          text: '请输入正确的手机号码',
          type: 'text',
          width:'auto'
        })
      }else if(!_this.valiState.timeCount && _this.valiState.mobileOk){
        axios.get(aipConfig.sendValidateCode, {params:{mobile:_this.subInfo.mobile}}).then((res) => {
          if(res.data.ok){
            var time = 60;
            _this.vCode.text = time+"s后重新获取";
            _this.valiState.timeCount=true;
            var timer = setInterval(function(){
              time-=1;
              if(time==0){
                _this.vCode.text="获取验证码";
                window.clearInterval(timer);
                _this.valiState.timeCount=false;
                return;
              }
              _this.vCode.text=time+"s后重新获取";
            },1000);
          }
        })
      }
    },

    /**
     * 表单验证
     */
    checkForm(){
      const _this = this;
      let mobile = _this.subInfo.mobile;
      let validateCode = _this.subInfo.validateCode;
      // 手机验证
      if(!isMobilePhone(mobile, 'zh-CN')){
        this.$vux.toast.show({
          text: '请输入正确的手机号码',
          type: 'text',
          width: 'auto'
        })
        return false;
      }
      // 验证码验证
      if(!validateCode){
        _this.$vux.toast.show({
          text: '请输入验证码',
          type: 'text',
          width: 'auto'
        })
        return false;
      }
      return true;
    },

    /**
     * 提交信息
     */
    submit(){
      let _this = this;
      if(!_this.checkForm()){
        return;
      }else{

        axios.get(aipConfig.bindUserMobile, {params:_this.subInfo, isShowLoading:true}).then((res) => {
          if(res.data.data){
            _this.$vux.toast.show({
              text: '注册成功!',
              type: 'success',
              width: '40%'
            })
            // 获取用户信息
            axios.get(aipConfig.findLoginUserByKey, {params:{key: this.token}}).then((r) => {
              let user = r.data.data;
              if(user.mobile && user.mobile !=='') {
                user.originalMobile = user.mobile;
                user.mobile = user.mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")
              }
              this.setUser(user);
            }).catch(function(r){
              console.log(r)
            })

            setTimeout(function(){
              pageStatistics('保险入口')
              _this.findPartnerUrlById(function(){
                axios.post(aipConfig.insAccesslog, _this.urlParams).then((res) => {
                  window.location.href = _this.urlParams.hdUrl || window.location.protocol+'//'+ (window.location.host) + '/passport/wx/login.do';
                }).catch((e) =>{
                  console.log(e);
                })
              })
            },1500)
          }

        }).catch(function(res){
          console.log(res)
        })
      }
    },

    findPartnerUrlById(callback){
      axios.get(aipConfig.findPartnerUrlById, {params:{id: this.$route.query.id}}).then((res) => {
        this.urlParams.hdUrl = res.data.data;
        if(callback) callback();
      }).catch(function(r){
        console.log(r)
      })
    }


  },

  watch: {
    subInfo:{
      handler(curVal){
        const _this = this
        if(isMobilePhone(curVal.mobile, 'zh-CN')){
          _this.valiState.mobileOk = true;
        }else{
          _this.valiState.mobileOk = false;
        }
      },
      deep:true
    }
  }

}



// WEBPACK FOOTER //
// ./src/pages/insurance/index.vue