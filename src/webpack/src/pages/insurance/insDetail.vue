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
import baseCfg from '../../config/baseConfig'

export default {
  data(){
    return {
     insDetail: ''
    }
  },

  created(){
    let orderNo = this.$route.query.orderNo;
    this.getInsDetail(orderNo);
    wxShare();
  },

  methods:{

    /**
     * 获取保单详情
     * @param orderNo 订单号
     */
    getInsDetail(orderNo){
      const _this = this;
      axios.get(aipConfig.insDetail, {params:{orderNo:orderNo}}).then((res) => {
        let data = res.data.data;

        let arr = data.orderInsLists;
        for ( let i in arr) {
          if (arr[i].insRelation === 1) {
            arr[i].relationText = "本人";
          } else if (arr[i].insRelation === 2) {
            arr[i].relationText = "配偶";
          } else if (arr[i].insRelation === 3) {
            arr[i].relationText = "父母";
          } else if (arr[i].insRelation === 4){
            arr[i].relationText = "子女";
          }else if (arr[i].insRelation === 5) {
            arr[i].relationText = "其他";
          } else {
            arr[i].relationText = "";
          }
        }

        if (data.orderStatus == '03') {
          data.state = "已承保";
        } else if (data.orderStatus == '04') {
          data.state = "已退保";
        } else {
          data.state = "";
        }

        data.orderDate = moment(data.orderDate).format("YYYY-MM-DD");
        data.acceptDate = moment(data.acceptDate).format("YYYY-MM-DD");
        data.effDate = moment(data.effDate).format("YYYY-MM-DD");
        data.matuDate = moment(data.matuDate).format("YYYY-MM-DD");

        this.insDetail = data;

      }).catch((e) =>{
        console.log(e)
      })
    },
  }


}



// WEBPACK FOOTER //
// ./src/pages/insurance/insDetail.vue