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
export default{
  data(){
    return{
      params:{
        offset:0,
        limit: 10
      },
      goodsList:[],
      noMoreData:false
    }
  },
  created(){
    const _this =this;
    this.getAwardGoosList(function(data,total){
      _this.goodsList = data;
      if(total<=_this.params.limit){
        _this.noMoreData = true;
      }
    })
  },
  methods:{
    toGoods(id){
      this.$router.push({ path: '/goods',query:{id:id} })
    },
    getAwardGoosList(callback){
      const _this =this;
      let params = this.params;
      axios.get(aipConfig.getAwardGoosList,{params:params}).then((res) => {
        this.params.offset = this.params.offset+this.params.limit;
        if(callback){
          callback(res.data.data.rows,res.data.data.total);
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
      this.getAwardGoosList(function(data){
        if( data.length > 0){
          _this.goodsList = _this.goodsList.concat(data)
          if(data.length<_this.params.limit){
            _this.noMoreData = true;
          }
        }else{
          _this.noMoreData = true;
        }
        setTimeout(() => {
          done()
        })
      });
    },
  }
}



// WEBPACK FOOTER //
// ./src/pages/integral/shop.vue