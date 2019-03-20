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
import baseCfg from '../../config/baseConfig'
import {wxShare} from '../../config/setWxJSSDK'
import bus from '../../common/bus'
export default{
  data(){
    return{
      headerImg:'',
      nickName:''
    }
  },
  created(){
    this.setWxShare();
    let shareToken = this.$route.query.shareToken;
    axios.get(aipConfig.getUserInfoByShareToken,{params:{shareToken:shareToken}}).then((res) => {
      this.headerImg = res.data.data.headerImg || '../../assets/invitation_me.png';
      this.nickName = res.data.data.nickName || '';
    })

  },
  methods:{
    setWxShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&shareToken=' + this.$route.query.shareToken ;
      shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'jifen_share.png';
      shareInfo.title = '全国四价宫颈癌疫苗预约登记开始啦！抢疯了';
      shareInfo.desc = '宫颈癌是首个可以预防的癌症！80%女生会感染，80%女生不知道！';
      wxShare(shareInfo)
    },
    toJoinQualifying(){
      if(this.$route.query.depaCode && this.$route.query.depaCode!=''){
        this.$router.push({ path: '/joinQualifying',query:{sourceUserId:this.$route.query.sourceUserId, depaCode:this.$route.query.depaCode, f:'jifenyoushang'} })
      }else{
        this.$router.push({ path: '/joinQualifying',query:{sourceUserId:this.$route.query.sourceUserId, f:'jifenyoushang'} })
      }


    }
  }
}



// WEBPACK FOOTER //
// ./src/pages/integral/invitation.vue