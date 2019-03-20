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

export default {
  data(){
    return{
      question:{}
    }

  },
  created(){
      wxShare();
      this.getVaccineDetail();
  },
  methods:{
    getVaccineDetail () {
      axios.get(aipConfig.vaccineQuestionDetail, {params:{id:this.$route.query.id}}).then((res) => {
        this.question = res.data.data;
      }).catch((e) => {
        console.log(e);
      })
    }
  }
}



// WEBPACK FOOTER //
// ./src/pages/vaccine/vaccineQuestion.vue