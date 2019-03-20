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
import XDialog from '../../../node_modules/vux/src/components/x-dialog'
import { mapState } from 'vuex';
export default{
  name: 'Hpv9End',
  components: {
    XDialog
  },
  created () {
    // 获取是否有助力活动
    axios.get(aipConfig.hasRegisterActivity).then((res) => {
      if(res.data.code=="0000"){
        if(res.data.data==0 || res.data.data==2 ){
          this.$vux.toast.show({
            text: "活动未开始",
            time: 20000000
          })
        }else if(res.data.data==3){  // 活动已结束
          this.showDialog = true;
        }
      }else{
        this.$vux.toast.show({
          text: res.data.msg
        })
      }
    })

    this.isRegisterActivity();
  },
  computed: mapState(['user','isMobile']),
  props: {
    maskTransition: {
      type: String,
      default: 'vux-mask'
    },
    dialogTransition: {
      type: String,
      default: 'vux-dialog'
    }
  },
  data () {
    return {
      showDialog: false,
      isAttend: false
    }
  },
  methods: {
    _onHide () {
      this.showDialog = false
    },
    toEnd(){
      axios.get(aipConfig.getRegisterRanking, {params:{userId:this.user.id}}).then((r) => {
        if(r.data.code=="0000"){
          let rank = r.data.data.count;
          if(rank<=100){
            this.$router.push({ path: '/awardHpv9'})
          }else{
            this.$router.push({ path: '/endHpv9'})
          }
        }else{
          this.$vux.toast.show({
            text: r.data.msg
          })
        }
      })
    },

    /**
     * 是否参加该九价活动
     */
    isRegisterActivity(){
      const _this = this;
      if(this.user && JSON.stringify(this.user)!= '{}' && this.user.id){
        axios.get(aipConfig.isRegisterActivity,{params:{userId:this.user.id}}).then((res) => {
          if(res.data.data==1){  // 已参加
            this.isAttend = true;
          }
        }).catch((e) =>{
          console.log(e);
        })
      }
    }

  },
  watch: {
    value (val) {
      this.showDialog = val
    },
    showDialog (val) {
      this.$emit('input', val)
    }
  }
}



// WEBPACK FOOTER //
// ./src/components/hpv9/isEnd.vue