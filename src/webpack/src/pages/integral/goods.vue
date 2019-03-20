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
import { mapState} from 'vuex'
export default{
  data(){
    return{
      goods:''
    }
  },
  computed:mapState(["awardPoints","user"]),
  created(){
    this.$parent.$emit('change-footer', false);
    this.setWxShare();
    let id = this.$route.query.id;
    axios.get(aipConfig.getAwardGoosById,{params:{id:id}}).then((res) => {
      this.goods = res.data.data;
    }).catch((e) =>{
      console.log(e);
    })
  },
  methods:{
    toExchange(){
      if(this.goods.costPoint > this.awardPoints){
        this.$vux.alert.show({
          title: '提示',
          content: "您的积分无法兑换当前商品，快去邀请更多好友助力吧~"
        })
      }else{
        this.$router.push({ path: '/exchange', query:{id:this.goods.id}});
      }
    },
    setWxShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&sourceUserId=' + this.user.id ;
      shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'jifen_share.png';
      shareInfo.title = '全国四价宫颈癌疫苗预约登记开始啦！抢疯了';
      shareInfo.desc = '宫颈癌是首个可以预防的癌症！你闺蜜你老婆知道吗？';
      wxShare(shareInfo)
    }
  }
}



// WEBPACK FOOTER //
// ./src/pages/integral/goods.vue