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
export default {
  components: {
    hpv9End
  },
  data () {
    return {
      registerUser:{
        name:'',
        rank:'',
        count:'',
        id:''
      },
      showShare:false,
      activeIndex: 0,
      rankingList:[],
    }
  },
  computed:{
    ...mapState(['user']),
    /*top() {
      return - this.activeIndex * 0.5 + 'rem';
    }*/
  },
  created () {
    pageStatistics(baseCfg.statistics.hpv9.myHpv9);
    if(this.$route.query.userId) {
      this.registerUser.id = this.$route.query.userId;
    } else{
      this.registerUser.id = this.user.id;
    }
    // 微信分享
    this.setWxShare();

    this.isRegisterActivity();




  },
  mounted() {
    /*setInterval(_ => {
      if(this.activeIndex < this.rankingList.length-6) {
        this.activeIndex += 1;
      } else {
        this.activeIndex = 0;
      }
    }, 1500);*/
  },
  methods: {
    isRegisterActivity(){
      const _this = this;
      if(this.user && JSON.stringify(this.user)!= '{}'){
        axios.get(aipConfig.isRegisterActivity,{params:{userId:this.user.id}}).then((res) => {
          if(res.data.data==1){  // 已参加
            this.getMyHelps();
            this.getUserRanking();
            this.getRankingList();

          }else{

            this.$vux.alert.show({
              title: '提示',
              content: "您还未参与获取9价宫颈癌疫苗接种资格活动，请先参加~",
              onHide () {
                _this.$router.push({ path: '/joinHpv9'})
              }
            })

          }
        }).catch((e) =>{
          console.log(e);
        })
      }else{
        this.$vux.alert.show({
          title: '提示',
          content: "您还未参与获取9价宫颈癌疫苗接种资格活动，请先参加~",
          onHide () {
            _this.$router.push({ path: '/joinHpv9'})
          }
        })
      }

    },

    setWxShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/shareHpv9?userId='+this.registerUser.id;
      shareInfo.imgUrl = baseCfg.appInfo.imagesUrl +'hpv9_share.png';
      shareInfo.desc = '给我点个赞喂，让我知道你爱我';
      if(this.user.nickName && this.user.nickName!='') shareInfo.title = this.user.nickName + '正在抢9价HPV疫苗接种名额，邀请您为TA助力';
      else shareInfo.title = '您的好友正在抢9价HPV疫苗接种名额，邀请您为TA助力';
      wxShare(shareInfo)
    },

    getMyHelps(){
      let _this = this;
      let userId = this.registerUser.id;
      axios.get(aipConfig.countRegisterHelps, {params:{userId:userId}}).then((res) => {
        this.registerUser.name = res.data.data.name;
        this.registerUser.count = res.data.data.count;
      }).catch((e) =>{
        console.log(e);
      })
    },

    getRankingList(){
      let _this = this;
      let userId = this.registerUser.id;
      axios.get(aipConfig.getRankingList, {params:{num:100}}).then((res) => {
        this.rankingList = res.data.data;
      }).catch((e) =>{
        console.log(e);
      })
    },

    getUserRanking(){
      let _this = this;
      let userId = this.registerUser.id;
      axios.get(aipConfig.getRegisterRanking, {params:{userId:userId}}).then((res) => {
        this.registerUser.rank = res.data.data.count;
      }).catch((e) =>{
        console.log(e);
      })
    },

    share(){
      pageStatistics(baseCfg.statistics.hpv9.shareBtn);
      const _this =this;
      this.showShare = true;
      setTimeout(function(){
        _this.showShare = false;
      },3000)
    },

    hideShare(){
      this.showShare = false;
    }

  }
}



// WEBPACK FOOTER //
// ./src/pages/hpv9/myHpv9.vue