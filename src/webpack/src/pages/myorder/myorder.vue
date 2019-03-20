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
  name: 'myorder',
  data () {
    return {
      orders: [],
      params:{
        offset:0,
        limit:10
      },
      noMoreData: false,
      isLoading: true
    }
  },
  methods: {
    /**
     * @method toOrderDetail 跳转到订单详情页
     * @param {long} id 订单接口
     */
    toOrderDetail(id){
      this.$router.push({ path: '/orderDetail',query: { id: id}});
    },
    /**
     * @method loadOrderList 请求订单列表,绑定到this.orders
     */
    loadOrderList(callback){
      const _this =this;
      axios.get(aipConfig.ordersList,{params:this.params}).then((res) => {
        //this.orders = res.data.rows
        this.isLoading = false;
        let orders = res.data.data.rows;
        for ( let i in orders) {
          var sb = orders[i];
          if (sb.subscribe.status == 0) {
            sb.subscribe.state = "已预约";
          } else if (sb.subscribe.status == 9) {
            sb.subscribe.state = "已完成";
          } else if (sb.subscribe.status == 10) {
            sb.subscribe.state = "已取消";
          } else if (sb.subscribe.status == 5){
            sb.subscribe.state = "退款中";
          }else if (sb.subscribe.status == -1) {
            sb.subscribe.state = "未付款";
          } else {
            sb.subscribe.state = "";
          }
          sb.subscribe.subscribeDate = moment(sb.subscribe.subscribeDate).format("YYYY-MM-DD");
          sb.subscribe.createTime =sb.subscribe.createTime;
          if(sb.departmentWorktime){
            sb.departmentWorktime = sb.departmentWorktime.startTime + " - " + sb.departmentWorktime.endTime
          }
          // 格式化针次

          if(sb.vaccine.inoculateIndex){
            switch (sb.vaccine.inoculateIndex){
              case 1:
                sb.vaccine.inoculateIndexText = "第一针";
                break;
              case 2:
                sb.vaccine.inoculateIndexText = "第二针";
                break;
              case 3:
                sb.vaccine.inoculateIndexText = "第三针";
                break;
              case 4:
                sb.vaccine.inoculateIndexText = "第四针";
                break;
              default:
                sb.vaccine.inoculateIndexText = "";
            }
          }


        }
        this.params.offset = this.params.offset+this.params.limit;
        if(callback){
            callback(orders,res.data.data.total);
        }
      }).catch((e) =>{
          console.log(e)
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
      this.loadOrderList(function(data){
        if( data.length > 0){
          _this.orders = _this.orders.concat(data)
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
    }
  },
  created () {
    let _this = this;
    wxShare();
    this.loadOrderList(function(data,total){
      if(total <= _this.params.limit){
        _this.noMoreData = true;
      }
        _this.orders = data;
    });
  }
}



// WEBPACK FOOTER //
// ./src/pages/myorder/myorder.vue