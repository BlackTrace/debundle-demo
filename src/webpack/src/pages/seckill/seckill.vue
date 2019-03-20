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

import baseCfg from '../../config/baseConfig'
import { mapState,mapMutations } from 'vuex';
export default {
  data () {
    return {
      detail:'',
      timeDiff:'',
      btnState:'', //按钮状态：0:还未开始；1：进行时；
      timeStr:''
    }
  },
  computed:mapState(["user"]),
  created(){
      // 判断用户信息完善程度
      if(this.user.mobile && this.user.mobile != ''){
        if(!this.user.hasOwnProperty("name") || this.user.name === '' || !this.user.hasOwnProperty("sex") || this.user.sex === '' || !this.user.hasOwnProperty("birthday")|| this.user.birthday ===''){
          this.$router.replace({ path: '/fillinPersonalInfo', query:{seckillId:this.$route.query.seckillId}})
        }else{

          this.getSeckillDetail();

        }
      }else{
        this.$router.replace({ path: '/bindMobile', query:{seckillId:this.$route.query.seckillId}})
      }

  },

  methods:{
    getSeckillDetail(){
      this.$axios.get(this.$aipConfig.seckillDetail,{params:{id: this.$route.query.seckillId}}).then((res) => {
        this.detail = res.data.data;

        this.callShare();

        //获取当前时间
        var nowTime=Date.now();
        //服务器时间
        var serTime = this.detail.now;
        // 时间差
        this.timeDiff = nowTime - serTime;
        //活动开始时间
        var startTime = this.detail.startMilliscond;


        if((startTime - serTime) > 0){
          this.btnState = 0;
          this.timer();
        } else {
          this.btnState = 1;
        }



      });
    },


    countDown(){
      const _this = this;
      //获取本地当前时间
      var nowTime=Date.now();
      //活动开始时间
      var startTime = this.detail.startMilliscond;
      //获取剩余时间
      var timeLeff=Math.ceil((startTime - nowTime + this.timeDiff)/1000);

      //如果超时了，就停止倒计时
      if (timeLeff <= 0) {
        this.btnState = 1 ;
        //停止计时器
        window.clearInterval(_this.timer);
        //停止执行下面的代码
        return;
      }

      //获取还剩多少天
      var day=parseInt(timeLeff/3600/24);
      //获取还剩多少小时
      var hour=parseInt(timeLeff/3600%24);
      //获取还剩多少分钟
      var minute=parseInt(timeLeff/60%60);
      //获取还剩多少秒
      var second=timeLeff%60;

      this.timeStr = day + '天' + hour + '时' + minute + '分' + second + '秒'



    },

    timer(){
      const _this = this;
      setInterval(_this.countDown, 100);
    },



    toCheckInSeckill(){
      this.$axios.get(this.$aipConfig.seckillCheckstock,{params:{id: this.$route.query.seckillId}}).then((res) => {
        if(res.data.data > 0) {
          this.$router.push({ path: '/checkInSeckill', query: { seckillId: this.$route.query.seckillId }});
        }else{
          // 已抢完
          this.$vux.toast.show({
            text: '此次名额已约满，请关注下次活动',
            type: 'text',
            width:'auto'
          })
          this.detail.total = 0;
        }
      });

    },

    soldOut(){
      // 已抢完
      this.$vux.toast.show({
        text: '此次名额已约满，请关注下次活动',
        type: 'text',
        width:'auto'
      })
    },


    callShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=seckill?seckillId=' + this.$route.query.seckillId;
      shareInfo.title = this.detail.name;
      this.$wxShare(shareInfo)
    }




}
}




// WEBPACK FOOTER //
// ./src/pages/seckill/seckill.vue