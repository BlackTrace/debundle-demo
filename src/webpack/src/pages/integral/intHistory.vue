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
import isMobilePhone from 'validator/lib/isMobilePhone'
import baseCfg from '../../config/baseConfig'
import { mapState } from 'vuex'
export default{
  data(){
    return{
      showShare:false,
      awardList:[],
      params:{
        offset:0,
        limit: 10
      },
      noMoreData:false
    }
  },
  created(){
    const _this = this;
    this.getAwardPointsList(function (data,total) {
      _this.awardList = data;
      if(total<=_this.params.limit){
        _this.noMoreData = true;
      }
    })
  },
  methods:{
    hideShare(){
      this.showShare = false;
    },
    getAwardPointsList(callback){
      const _this =this;
      let params = this.params;
      axios.get(aipConfig.getAwardPointsList,{params:params}).then((res) => {
        this.params.offset = this.params.offset+this.params.limit;
        let list = res.data.data.rows;
        for(let i in list){
          let mobile = list[i].registerMobile;
          mobile = mobile.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");
          list[i].registerMobile = mobile;
          list[i].createTime = moment(list[i].createTime).format("YYYY-MM-DD");
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
      this.getAwardPointsList(function(data){
        if( data.length > 0){
          _this.awardList = _this.awardList.concat(data)
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
// ./src/pages/integral/intHistory.vue