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
import baseCfg from '../../config/baseConfig'

export default {
  data () {
    return {
      insList: [],
      params:{
        offset:0,
        limit:10
      },
      noMoreData: false
    }
  },

  created(){
    let _this = this;
    wxShare();
    this.getInsList(function(data,total){
      if(total <= _this.params.limit){
        _this.noMoreData = true;
      }
      _this.insList = data;
    });
  },

  methods:{
    /**
     * @method getInsList 获取保单列表
     */
    getInsList(callback){
      const _this =this;
      axios.get(aipConfig.insList,{params:this.params}).then((res) => {
        let list = res.data.data.rows;
        for ( let i in list) {
          var ins = list[i];
          if (ins.orderStatus == '03') {
            ins.state = "已承保";
          } else if (ins.orderStatus == '04') {
            ins.state = "已退保";
          } else {
            ins.state = "";
          }

        }

        this.params.offset = this.params.offset+this.params.limit;
        if(callback){
          callback(list,res.data.data.total);
        }
      }).catch((e) =>{
        console.log(e)
      })
    },

    /**
     * 加载更多
     * @param done
     */
    loadMore(done) {
      let _this = this;
      if (this.noMoreData) {
        setTimeout(() => {
          done(true)
        }, 1000)
        return;
      }
      this.getInsList(function(data){
        if( data.length > 0){
          _this.insList = _this.insList.concat(data)
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

    toDetail(url){
      window.location.href = url;
    }


  }


}




// WEBPACK FOOTER //
// ./src/pages/insurance/myIns.vue