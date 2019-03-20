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
export default {
  data(){
    return{
      message:{}
    }
  },
  created(){
    wxShare();
    axios.get(aipConfig.getNoticeDetail,{params:{id:this.$route.query.id}}).then((res) => {
      this.message = res.data.data;
    })
  },

  methods:{
    toDepa(depaCode){
      if(depaCode !='' && depaCode != '0000') this.$router.replace({ path: '/department', query:{depaCode: depaCode}})
    }
  }
}



// WEBPACK FOOTER //
// ./src/pages/myMessage/message.vue