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
//
//
//
//

import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
import baseCfg from '../../config/baseConfig'
import { mapState } from 'vuex';
import hpv9End from '../../components/hpv9/isEnd.vue'
export default{
  components: {
    hpv9End
  },
  data () {
    return {
      registerUser:{
        id:'',
        name:'',
        count:''
      },
      isSuccess:false,
      showAnimate:false,
      showShare:false,
    }
  },
  computed: mapState(['user','isMobile']),
  created(){
    pageStatistics(baseCfg.statistics.hpv9.shareHpv9);
    this.registerUser.id = this.$route.query.userId;
    // 微信分享
    this.setWxShare();
    this.getMyHelps();
  },
  methods: {
    /**
     * 获取用户助力数
     */
    getMyHelps(){
      let _this = this;
      axios.get(aipConfig.countRegisterHelps, {params:{userId:this.registerUser.id}}).then((res) => {
        this.registerUser.name = res.data.data.name;
        this.registerUser.count = res.data.data.count;
      }).catch((e) =>{
        console.log(e);
      })
    },
    giveHelp(){
      let _this = this;
      pageStatistics(baseCfg.statistics.hpv9.helpBtn);
      if(this.isMobile.isWx){
        axios.get(aipConfig.saveRegisterHelp, {params:{userId:this.registerUser.id}}).then((res) => {
          this.isSuccess = true;
          this.showAnimate = true;
          setTimeout(function(){
            _this.getMyHelps();
          },200)
          /*this.getMyHelps();*/
        }).catch((e) =>{
          console.log(e);
        })
      }else{
        _this.$vux.alert.show({
          title: '提示',
          content: "请在微信公众号打开才可助力好友！"
        })
      }
    },
    share(){
      const _this =this;
      this.showShare = true;
      setTimeout(function(){
        _this.showShare = false;
      },3000)
    },
    hideShare(){
      this.showShare = false;
    },
    toJoinHpv9(){
      pageStatistics(baseCfg.statistics.hpv9.share_joinBtn);
      this.$router.push({ path: '/joinHpv9'})
    },
    setWxShare(){
      let shareInfo = {};
      shareInfo.imgUrl = baseCfg.appInfo.imagesUrl +'hpv9_share.png';
      shareInfo.desc = '给我点个赞喂，让我知道你爱我';
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/shareHpv9?userId='+this.registerUser.id;
      if(this.user.nickName && this.user.nickName!=''){
        if(this.registerUser.id == this.user.id){
          shareInfo.title = this.user.nickName + '正在抢9价HPV疫苗接种名额，邀请您为TA助力';
        }else{
          shareInfo.title = this.user.nickName + '正在帮好友抢9价HPV疫苗接种资格，邀请您为TA助力';
        }
      }else{
        shareInfo.title = '您的好友正在抢9价HPV疫苗接种名额，邀请您为TA助力';
      }
      wxShare(shareInfo)
    },
    toMyHpv9(){
      pageStatistics(baseCfg.statistics.hpv9.share_toRankBtn);
      let _this = this;
      axios.get(aipConfig.isRegisterActivity, {params:{userId:this.user.id}}).then((res) => {
        if(res.data.data==1){
          _this.$router.push({ path: '/myHpv9'})
        }else{
          _this.$vux.toast.show({
            text: '您还未参与获取9价宫颈癌疫苗接种资格活动，请先参加~',
            type: 'text',
            width:'auto'
          })
        }
      }).catch((e) =>{
        console.log(e);
      })
    },
    clickCode(){
      pageStatistics(baseCfg.statistics.hpv9.clickCode);
    }
  }
}



// WEBPACK FOOTER //
// ./src/pages/hpv9/share.vue