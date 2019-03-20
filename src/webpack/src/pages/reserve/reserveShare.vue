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
import baseCfg from '../../config/baseConfig'
export default {
  created(){
    this.setWxShare();
  },

  methods:{
    setWxShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/reserveShare?fa=wx';
      shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'reserve_share.png';
      shareInfo.title = '好消息，大陆九价HPV疫苗即将上市，事先订阅到苗消息，快人一步接种啦！';
      shareInfo.desc = '宫颈癌是首个可以预防的癌症！80%的女生会感染，80%的女生不知道！';
      wxShare(shareInfo)
    }

  }
}



// WEBPACK FOOTER //
// ./src/pages/reserve/reserveShare.vue