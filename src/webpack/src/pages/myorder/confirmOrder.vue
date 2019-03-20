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
import { mapState } from 'vuex';
export default {
  data(){
    return{
      orders: [],
      params:{
        offset:0,
        limit:10,
        status:0
      },
      noMoreData: false,
      headerImg:''
    }
  },
  computed:mapState(["user"]),
  created () {
    let _this = this;
    wxShare();
    if(this.user.headerImg && this.user.headerImg !='') this.headerImg = this.user.headerImg;
    else this.headerImg = '../../images/me.png';
    if(JSON.stringify(this.user) != '{}'){
      this.loadOrderList(function(data,total){
        if(total <= _this.params.limit){
          _this.noMoreData = true;
        }
        _this.orders = data;
      });
    }
  },
  methods:{
    /**
     * @method loadOrderList 请求订单列表,绑定到this.orders
     */
    loadOrderList(callback){
      const _this =this;
      axios.get(aipConfig.ordersList,{params:this.params}).then((res) => {
        let orders = res.data.data.rows;
        for ( let i in orders) {
          var sb = orders[i];
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
    },


    confirmOrder(id){
      const _this = this;
      this.$vux.confirm.show({
        title: '提示',
        content: '是否确认已接种?',
        onCancel () {
        },
        onConfirm () {
          axios.get(aipConfig.confirmSubscribe,{params:{id:id,type:3}}).then((res) =>{
            _this.$vux.toast.show({
              text: '已接种!',
              type: 'success',
              width: '40%'
            }),
              setTimeout(function(){
                _this.$router.push({ path: '/myorder'})
              },2000)
          })
        }
      })
    }


  }
}



// WEBPACK FOOTER //
// ./src/pages/myorder/confirmOrder.vue