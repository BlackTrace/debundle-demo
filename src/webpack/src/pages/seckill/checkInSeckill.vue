import { mapState, mapMutations } from 'vuex';
import md5 from 'js-md5';
export default {
  data(){
    return{
      checkInDetail:'',
      sexOk:false, //性别是否符合
      date:{},
      weeks:[],
      workdays:[],
      subInfo:{
        vaccineIndex:1,
        subscribeDate:''
      },
      stock:'' , // 库存
      clickTag:0
    }
  },
  created(){
    this.getCheckInDetail();
    this.$wxShare();
  },
  computed:mapState(["user","selectedMember"]),
  methods:{
    ...mapMutations([
      "setSelectedMember"
    ]),

    getCheckInDetail(){
      this.$axios.get(this.$aipConfig.seckillDetailVo,{params:{id:this.$route.query.seckillId}}).then((res) => {
        this.checkInDetail = res.data.data;
        this.stock = res.data.data.total;
        this.getDefaultMember();

        this.workdays = res.data.data.days; // 门诊工作日列表
        let currDate =   res.data.data.now;
        this.weeks=this.getCalendar(moment(currDate).format("YYYY-MM"));


      });
    },

    /**
     * 获取家庭成员列表
     */
    getDefaultMember(){
      const  _this = this;
      console.log(this.selectedMember)
      if(JSON.stringify(this.selectedMember) == '{}'){
        this.$axios.get(this.$aipConfig.findByUserId, {params:{userId:this.user.id}}).then((res) => {
          let list = res.data.data;
          let hasDefault=false;
          list.forEach(function (e, i) {
            if(e.isDefault == 1){
              e.birthday = moment(e.birthday).format("YYYY/MM/DD");
              _this.setSelectedMember(e)
              hasDefault=true;
            }
          })
          if(list.length >0 && !hasDefault){
            list[0].birthday = moment(list[0].birthday).format("YYYY/MM/DD");
            _this.setSelectedMember(list[0])
          }

          if(list.length >0){
            _this.isMatchSex(_this.selectedMember.sex);
          }

        }).catch((e) => {
          console.log(e)
        })
      }else{
        this.isMatchSex(this.selectedMember.sex);
      }
    },

    /**
     * 是否符合性别条件
     * @param sex 性别
     */
    isMatchSex(sex){
      const _this = this;
      if(this.checkInDetail.vaccineCode == '8801' || this.checkInDetail.vaccineCode == '8802' || this.checkInDetail.vaccineCode == '8803' ){
        if(sex !=2 ){
          this.$vux.alert.show({
            title: '提示',
            content: '该疫苗只适用于女性，男性暂时无法预约接种。',
            onHide () {
            }
          })
          this.sexOk=false;
        }else{
          this.sexOk = true;
        }
      }else{
        this.sexOk = true;
      }
    },

    /**
     * 选择接种人
     */
    chooseMmember(){
      this.$router.push({ path: '/chooseMember',query:{id:this.selectedMember.id}})
    },

    /**
     * 渲染日历
     * @param month
     * @returns {Array}
     */
    getCalendar(month){
      var weeks=[];
      var firstDay=moment(month,"YYYY-MM");
      var week=firstDay.format("d");
      var start=firstDay.subtract(week,"days");

      for(var i=0;i<6;i++){
        var days=[];
        for(var j=0;j<7;j++){
          var day={};
          day.v=start.toObject().date ;
          day.ymd=start.format("YYYY-MM-DD");
          day.month = start.format("MM");

          //预约名额是否已满
          day.isFull = false;

          // 是否工作日
          day.isWorkday = false;

          if(this.workdays.length >0){
            for(var k in this.workdays){
              if(day.ymd == moment(this.workdays[k].day).format("YYYY-MM-DD")){
                day.isWorkday = true;
                if(this.workdays[k].total <= 0) day.isFull = true;
                break;
              }
            }
          }

          start.add(1,"days");
          days.push(day);

        }
        weeks.push(days);
      }
      this.date.year=moment(month).year();
      this.date.month=moment(month).month()+1;
      this.date.preMonth=moment(month,"YYYY-MM").add(-1,"month").format("YYYY-MM");
      this.date.nextMonth=moment(month,"YYYY-MM").add(1,"month").format("YYYY-MM");
      return weeks;
    },

    /**
     * 上一个月
     */
    preMonth(){
      let month = this.date.preMonth;
      this.weeks=this.getCalendar(moment(month).format("YYYY-MM"));
    },

    /**
     * 下一个月
     */
    nextMonth(){
      let month = this.date.nextMonth;
      this.weeks=this.getCalendar(moment(month).format("YYYY-MM"));
    },

    /**
     * 选中日期事件
     * @param day 选中日期
     */
    selectDay(day){
      if(day.month == this.date.month){
        if(JSON.stringify(this.selectedMember) == '{}'){
          this.$vux.toast.show({
            text: '请先选择接种人',
            type: 'text',
            width: 'auto'
          })
          return;
        }
        if(day.isWorkday && !day.isFull){
          if(this.sexOk){
            this.subInfo.subscribeDate = day.ymd;
            this.checkAge(this.selectedMember.birthday,1,this.subInfo.subscribeDate)
          }else{
            this.$vux.alert.show({
              title: '提示',
              content: '该疫苗只适用于女性，男性暂时无法预约接种。',
              onHide () {
              }
            })
          }

        }
      }

    },
    /*checkAge(birthDay,vaccIndex,subDate){
      const _this = this;
     // console.log(birthDay,vaccIndex,subDate)
      this.vaccine=this.checkInDetail
      this.vaccCode=this.checkInDetail.vaccineCode
      //只针对HPV类疫苗做年龄限制
      if(this.vaccCode=='8801'||this.vaccCode=='8802'||this.vaccCode=='8803'){
        //根据生日+针次算出可以预约的日期区间
        let start,end,now=moment(subDate,'YYYY-MM-DD');
        if(this.vaccine.ageStart&&this.vaccine.ageStart!=''){
          start=moment(birthDay,"YYYY/MM/DD").add(this.vaccine.ageStart,'y');
          //console.log("start:"+start.format('YYYY-MM-DD'))
          let diff=start.diff(now,'days')
          if(diff>0){
            //报错返回
            this.$vux.alert.show({
              title: '提示',
              content: "您预约的"+this.vaccine.name + "适用年龄为"+ this.vaccine.ageStart + "-" + this.vaccine.ageEnd + "岁，您选择的接种人不在此年龄段，请重新选择接种人进行预约。",
              onHide () {
                  _this.subInfo.subscribeDate = '';
              }
            })
            return false;
          }
        }
        if(this.vaccine.ageEnd&&this.vaccine.ageEnd!=''){
          end=moment(birthDay,"YYYY/MM/DD").add(this.vaccine.ageEnd,'y');
          end=end.add(6,'M')
          if(vaccIndex==2){
            if(this.vaccCode=='8801'){
              end=end.add(1,'M')
            }else{
              end=end.add(2,'M')
            }
          }
          if(vaccIndex==3){
            end=end.add(6,'M')
          }

          let diff=now.diff(end,'days')
          //console.log("end:"+end.format('YYYY-MM-DD'))
          if(diff>= 0){
            //报错返回
            this.$vux.alert.show({
              title: '提示',
              content: "您预约的"+this.vaccine.name + "适用年龄为"+ this.vaccine.ageStart + "-" + this.vaccine.ageEnd + "岁，您选择的接种人不在此年龄段，请重新选择接种人进行预约。",
              onHide () {
                _this.subInfo.subscribeDate = '';
              }
            })
            return false;
          }
        }
      }
      return true;
    },*/
    submit(){
      const _this = this;
      if(JSON.stringify(this.selectedMember) == '{}'){
        this.$vux.toast.show({
          text: '请先选择接种人',
          type: 'text',
          width: 'auto'
        })
        return;
      }
      if(this.subInfo.subscribeDate == ''){
        this.$vux.toast.show({
          text: '请先选择预约日期',
          type: 'text',
          width: 'auto'
        })
        return;
      }
      let sign=md5(this.checkInDetail.time+"healthych.com")
      let params = {
        departmentVaccineId: this.checkInDetail.id,
        vaccineIndex: this.subInfo.vaccineIndex,
        linkmanId: this.selectedMember.id,
        subscribeDate: this.subInfo.subscribeDate,
        sign: sign
      }
      if(this.clickTag == 0){
        this.clickTag = 1; // 防止多次点击
        this.$axios.get(this.$aipConfig.submitSeckill, {params:params,isShowLoading:true}).then((res) => {

          _this.$vux.toast.show({
            text: '提交成功!',
            type: 'success',
            width: '40%'
          })
          setTimeout(function(){
            // 到主页的预约tab
            _this.$router.replace({ path: '/myorder'})
          },2000)

        }).catch((e) => {
          console.log(e);
          // 重置标志，可再次点击
          _this.clickTag = 0;

          this.$axios.get(this.$aipConfig.seckillDetailVo,{params:{id:this.$route.query.seckillId}}).then((res) => {
            this.checkInDetail = res.data.data;
            this.stock = res.data.data.total;

            this.workdays = res.data.data.days; // 门诊工作日列表
            let currDate =   res.data.data.now;
            this.weeks=this.getCalendar(moment(currDate).format("YYYY-MM"));

            if(this.stock <= 0) this.subInfo.subscribeDate = '';

          });
        })

      }

    },

    soldOut(){
      // 已抢完
      this.$vux.toast.show({
        text: '此次名额已约满，请关注下次活动',
        type: 'text',
        width:'auto'
      })
    }





  }
}



// WEBPACK FOOTER //
// ./src/pages/seckill/checkInSeckill.vue
