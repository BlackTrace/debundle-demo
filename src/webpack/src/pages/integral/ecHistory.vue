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
import isMobilePhone from 'validator/lib/isMobilePhone'
import baseCfg from '../../config/baseConfig'
import { mapState } from 'vuex'
export default{
  data(){
    return{
      showShare:false,
      exchangeList:[],
      params:{
        offset:0,
        limit: 10
      },
      noMoreData:false
    }
  },
  created(){
    const _this = this;
    //wxShare();
    this.getAwardRedeemList(function (data,total) {
      _this.exchangeList = data;
      if(total<=_this.params.limit){
        _this.noMoreData = true;
      }
    })
  },
  methods:{
    hideShare(){
      this.showShare = false;
    },
    getAwardRedeemList(callback){
      const _this =this;
      let params = this.params;
      axios.get(aipConfig.getAwardRedeemList,{params:params}).then((res) => {
        this.params.offset = this.params.offset+this.params.limit;
        let list = res.data.data.rows;
        for(let i in list){
          let item = list[i];
          let mobile = list[i].upMobile;
          mobile = mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");
          list[i].upMobile = mobile;
          if (item.status == 0 || item.status == 3) {
            item.state = "充值中";
          } else if (item.status == 1) {
            item.state = "已充值";
          } else if (item.status == 2) {
            item.state = "充值失败";
          } else {
            item.state = "";
          }
        }
        if(callback){
          callback(list,res.data.data.total);
        }
      }).catch((e) =>{
        console.log(e);
      })
    },
    infinite(done) {
      let _this = this;
      if (this.noMoreData) {
        setTimeout(() => {
          done(true)
        }, 1000)
        return;
      }
      this.getAwardRedeemList(function(data){
        if( data.length > 0){
          _this.exchangeList = _this.exchangeList.concat(data)
          if(data.length<_this.params.limit){
            _this.noMoreData = true;
          }
        }else{
          _this.noMoreData = true;
        }
        /*_this.params.offset = _this.params.offset+_this.params.limit;*/
        setTimeout(() => {
          done()
        })
      });
    },
  }
}



// WEBPACK FOOTER //
// ./src/pages/integral/ecHistory.vue