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

export default{
  data(){
    return{
      content:''
    }
  },

  created(){
    this.setWxShare(); //微信分享
    axios.get(aipConfig.adDetail, {params:{id: this.$route.query.id}}).then((res) => {
      this.content = res.data.data.content;
    }).catch(function(e){
      console.log(e)
    })
  },

  methods:{
    /**
     * 设置分享信息
     */
    setWxShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/adDetail?id=' + this.$route.query.id;
      wxShare(shareInfo)
    }


  }


}




// WEBPACK FOOTER //
// ./src/pages/ad/adDetail.vue