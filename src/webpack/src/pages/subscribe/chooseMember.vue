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
import { mapState, mapMutations } from 'vuex';
import {wxShare} from '../../config/setWxJSSDK'

export default{
  data(){
    return{
      membersList:[]
    }
  },
  computed:mapState(["user"]),
  methods:{
    ...mapMutations([
      "setSelectedMember"
    ]),
    /**
     * 获取家庭成员列表
     */
    getMembersList(){
      const _this = this;
      axios.get(aipConfig.findByUserId).then((res) => {
        let list = res.data.data;
        list.forEach(function (e, i) {

          if(e.sex == 1) e.sexText = '男';
          else if(e.sex == 2) e.sexText = '女';
          else e.sexText = '未知';

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

          if(e.id == _this.$route.query.id){
            e.checked = true;
          }else{
            e.checked = false;
          }
          e.birthday = moment(e.birthday).format("YYYY/MM/DD");

        })

        this.membersList = list;
      }).catch((e) => {
        console.log(e)
      })
    },

    /**
     * 新增成员
     */
    addMember(){
      this.$router.push({ path: '/addOrEditMember'})
    },

    /**
     * 选择成员
     */
    chooseMember(id){
      const _this = this;
      this.membersList.forEach(function (e, i) {
        if(id==e.id) {
            e.checked = true;
          _this.setSelectedMember(e)
        }
        else e.checked = false;
      })
      setTimeout(function(){
        _this.$router.go(-1);
      },100)
    }

  },

  created(){
    wxShare();
    this.getMembersList();

  }
}



// WEBPACK FOOTER //
// ./src/pages/subscribe/chooseMember.vue