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
import { mapState } from 'vuex';
import {wxShare} from '../../config/setWxJSSDK'

export default{
  data(){
    return{
      membersList:[]
    }
  },
  computed:mapState(["user"]),
  methods:{
    /**
     * 获取家庭成员列表
     */
    getMembersList(){
      axios.get(aipConfig.findByUserId).then((res) => {
        let list = res.data.data;
        list.forEach(function (e, i) {

          if(e.sex == 1) e.sex = '男';
          else if(e.sex == 2) e.sex = '女';
          else e.sex = '未知';

          switch(e.relationType){
            case 1:
              e.relationType = '本人';
              break;
            case 2:
              e.relationType = '父母';
              break;
            case 3:
              e.relationType = '子女';
              break;
            case 4:
              e.relationType = '夫妻';
              break;
            case 5:
              e.relationType = '亲属';
              break;
            case 6:
              e.relationType = '朋友';
              break;
            case 7:
              e.relationType = '其他';
              break;
          }
          e.birthday = moment(e.birthday).format("YYYY/MM/DD");
        })
        this.membersList = list;
      }).catch((e) => {
        console.log(e)
      })
    },

    addMember(){
      this.$router.push({ path: '/addOrEditMember'})
    },

    toDetail(id){
      this.$router.push({ path: '/addOrEditMember', query: { id: id}})
    }

  },

  created(){
    wxShare();
    this.getMembersList();
  }
}



// WEBPACK FOOTER //
// ./src/pages/familyMembers/membersList.vue