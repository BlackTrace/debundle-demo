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
import { mapState } from 'vuex';
export default {
  data(){
    return{
      myTickets:[]
    }
  },
  computed:mapState(["user"]),
  created (){
    wxShare();
    //this.$parent.$emit('change-footer', false);
    axios.get(aipConfig.myFreeTickets).then((res) => {
      if(res.data.data.length>0){
        this.myTickets = res.data.data;
      }else{
        /*this.$vux.toast.show({
          text: "您还没有免费券！",
          type: 'text',
          width:"auto"
        })*/
      }
    }).catch((e) =>{
        console.log(e)
    })
  }
}



// WEBPACK FOOTER //
// ./src/pages/myTickets/myTickets.vue