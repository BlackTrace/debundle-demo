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
export default {
  data () {
    return {
      registerUser:{
        name:'',
        rank:'',
        count:'',
        id:''
      },
      rankingList:[],
    }
  },
  computed:{
    ...mapState(['user']),
    top() {
      return - this.activeIndex * 0.5 + 'rem';
    }
  },
  created () {
    pageStatistics(baseCfg.statistics.hpv9.awardHpv9);
    this.registerUser.id = this.user.id;
    // 微信分享
    this.setWxShare();

    this.getUserRanking();
    this.getRankingList();
  },

  methods: {
    setWxShare(){
      wxShare()
    },

    getRankingList(){
      let _this = this;
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
        this.registerUser.name = res.data.data.name;
      }).catch((e) =>{
        console.log(e);
      })
    }

  }
}



// WEBPACK FOOTER //
// ./src/pages/hpv9/awardHpv9.vue