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

import { mapState, mapMutations } from 'vuex';

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
      this.$axios.get(this.$aipConfig.findByUserId).then((res) => {
        let list = res.data.data;
        list.forEach(function (e, i) {

          if(e.sex == 1) e.sex = '男';
          else if(e.sex == 2) e.sex = '女';
          else e.sex = '未知';

          e.checked = false;

          if(e.idCardNo && e.idCardNo!='') e.codeIdCardNo = e.idCardNo.replace(e.idCardNo.substring(4,14),"**********");

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
      let list = this.membersList;
      let select;
      list.forEach(function (e, i, arr) {

        if(id==e.id) {
          e.checked = true;
          select = e;
        }
        else e.checked = false;
      })
      this.membersList = list;
      setTimeout(function(){
        if(!select.idCardNo || select.idCardNo == '' || !select.regionCode || select.regionCode == '' || !select.address || select.address == ''){
          _this.$router.push({ path: '/numFillinMemInfo',query:{id: select.id,depaCode:_this.$route.query.depaCode}})
        }else{

          _this.$axios.get(_this.$aipConfig.takeNumberByLinkman, {params:{linkmanId:select.id , depaCode: _this.$route.query.depaCode}}).then((r) => {
            _this.$router.push({ path: '/numSuccess'})
          }).catch(function(r){
            console.log(r)
          })

        }
      },100)
    }

  },

  created(){
    this.$wxShare();
    this.getMembersList();

  },

  beforeRouteEnter(to, from, next){
    next(vm=>{
      if(!vm.user.mobile || vm.user.mobile == ''){
        vm.$router.replace({ path: '/bindMobile', query:{to: 'numPersonalInfo',depaCode:_this.$route.query.depaCode}});
      }
      /*if(vm.user.mobile){
        vm.$router.replace({ path: '/bindMobile', query:{to: 'numPersonalInfo'}});
      }*/
    })
  }

}



// WEBPACK FOOTER //
// ./src/pages/takeNum/chooseMember.vue