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
  data(){
    return{
      reserves:[]
    }
  },

  created(){
    this.getReserves();
    wxShare();
  },

  methods:{

    getReserves(){
      axios.get(aipConfig.myRegisterList).then((res) => {

        let reserves = res.data.data;
        for ( let i in reserves) {
          var reserve = reserves[i];
          if (reserve.status == 1) {
            reserve.state = "未通知";
          } else if (reserve.status == 2) {
            reserve.state = "已通知";
          } else {
            reserve.state = "";
          }

          reserve.registerTime = moment(reserve.registerTime).format("YYYY-MM-DD");
        }

        this.reserves = reserves;

      }).catch((e) =>{
        console.log(e)
      })
    },

    deleteItem(id){
       const _this = this;
      _czc.push(["_trackEvent","我的订阅列表","删除按钮点击量"]);
      this.$vux.confirm.show({
        title: '提示',
        content: '确定删除该订阅消息？',
        onCancel () {
        },
        onConfirm () {
          axios.get(aipConfig.deleteRegister,{params: {registerDetailId: id}}).then((res) => {
            _this.$vux.toast.show({
              text: '删除成功!',
              type: 'success',
              width: '40%'
            })
            _this.getReserves();
          }).catch((e) =>{
            console.log(e)
          })
        }
      })
    }

  }

}



// WEBPACK FOOTER //
// ./src/pages/reserve/myReserves.vue