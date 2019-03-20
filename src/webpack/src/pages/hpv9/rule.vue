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

import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
import baseCfg from '../../config/baseConfig'
export default{
  created(){
    pageStatistics(baseCfg.statistics.hpv9.ruleHpv9);
    // 微信分享
    this.setWxShare();
  },
  methods: {
    setWxShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/joinHpv9?fa=wx';
      shareInfo.imgUrl = baseCfg.appInfo.imagesUrl +'hpv9_share.png';
      shareInfo.title = '九价HPV疫苗全港紧缺，这里有100人份，6月即可接种';
      shareInfo.desc = '名额有限，快来参与争取名额吧';
      bus.$on('wxReady',function(e){
        wxShare(shareInfo)
      })
      wxShare(shareInfo)
    },
  }
}



// WEBPACK FOOTER //
// ./src/pages/hpv9/rule.vue