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
import isMobilePhone from 'validator/lib/isMobilePhone'
import { mapState} from 'vuex'
export default{
  data(){
    return{
      goods:'',
      upMobile:''
    }
  },
  computed:mapState(["user"]),
  created:function(){
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
    exchange(){
      const _this = this;
      if(!isMobilePhone(this.upMobile, 'zh-CN')){
        this.$vux.toast.show({
          text: '请输入正确的手机号码',
          type:'text',
          width:'auto'
        })
      }else{
        let params={
          awardGoodsId: this.goods.id,
          upMobile: this.upMobile
        };
        axios.get(aipConfig.exchange,{params:params}).then((res) => {
          this.$vux.toast.show({
            text: '兑换成功！',
            type: 'success',
            width: '40%'
          })
          setTimeout(function(){
            _this.$router.replace({ path: '/integralDet/ecHistory'});
          },2000)
        }).catch((e) =>{
          console.log(e);
        })
      }
    },
    setWxShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/invitation?f=jifenyoushang&sourceUserId=' + this.user.id ;
      shareInfo.imgUrl = baseCfg.appInfo.imagesUrl + 'jifen_share.png';
      shareInfo.title = '全国四价宫颈癌疫苗预约登记开始啦！抢疯了';
      shareInfo.desc = '宫颈癌是首个可以预防的癌症！80%女生会感染，80%女生不知道！';
      wxShare(shareInfo);
    }
  }
}



// WEBPACK FOOTER //
// ./src/pages/integral/exchange.vue