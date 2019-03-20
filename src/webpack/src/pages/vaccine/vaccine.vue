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
  import isMobile from '../../common/mobile'
  import baseCfg from '../../config/baseConfig'
  import bus from '../../common/bus'
  import { mapState,mapMutations } from 'vuex';
  export default{
    data () {
      return {
        vaccineDetail: {},
      }
    },
    methods: {
      ...mapMutations([
        "setVaccine","setDepa"
      ]),

      getVaccineDetail () {
        const _this = this;
        let vaccCode = this.$route.query.code  // 疫苗code
        let depaCode = this.$route.query.depaCode // 门诊code
        let departmentVaccineId =  this.$route.query.vaccId //门诊疫苗ID
        axios.get(aipConfig.vaccine, {params:{vaccineCode: vaccCode, depaCode: depaCode, departmentVaccineId:departmentVaccineId,isShowDescribtion:true}}).then((res) => {

          if((res.data.data.isSeckill &&res.data.data.isSeckill ==1) || res.data.data.yn==-1 ) {
            this.$vux.alert.show({
              title: '提示',
              content: "该疫苗不存在！",
              onHide () {
                _this.$router.replace({path:'/home'})
              }
            })
          }else{
            this.vaccineDetail = res.data.data;

            //获取疫苗提示信息
            if(this.vaccineDetail.prompt && this.vaccineDetail.prompt!=''){
              this.$vux.alert.show({
                title: '提示',
                content: this.vaccineDetail.prompt
              })
            }
          }

        }).catch((e) => {
           console.log(e);
        })
      },

      toSubscribe () {
        const _this = this;
        //获取登记用户是否已发送疫苗提醒
        axios.get(aipConfig.isCanSubscribe, {params:{depaCode:this.$route.query.depaCode, vaccineCode:this.$route.query.code }}).then((res) => {

          if(res.data.data===1){
            this.$router.push({ path: '/subscribe', query:{vaccCode: this.$route.query.code ,depaCode: this.$route.query.depaCode, vaccId: this.$route.query.vaccId}})
          }else{
            this.$vux.confirm.show({
              title: '提示',
//              content: '您暂未获得本门诊预约资格，请先订阅 “到苗通知”，获得“到苗通知”后方可预约。如已订阅过，请点击“取消”，耐心等待。',
              content: '抱歉，您暂未获得预约资格，请先订阅门诊到苗通知。如已订阅该门诊，请耐心等候门诊“到苗通知”。请在每次收到到苗通知后48小时内进行预约，超时不预约将失去预约机会。',
              onCancel () {
              },
              onConfirm () {
                _this.isRegister();
              }
            })
          }

        }).catch((e) => {
          console.log(e);
        })

      },

      /*toQualifying(){
        const _this = this;
        this.$vux.alert.show({
          title: '提示',
          content: "待上苗，登记获取上苗通知，优先接种。",
          onHide () {
            _this.$router.push({ path: '/joinQualifying', query: { depaCode: _this.$route.query.depaCode }})
          }
        })
      },*/

      /**
       * 是否订阅过到苗通知
       */
      isRegister(){
        const _this = this;
        axios.get(aipConfig.isRegister, {params:{mobile:this.user.originalMobile,vaccineCode:this.$route.query.code,depaCode: this.$route.query.depaCode}}).then((res) => {

          if(res.data.data == 0){
            _this.submitReserve()

          }else if(res.data.data == 1){
            _this.$vux.confirm.show({
              title: '提示',
              content: '您已在其它门诊订阅该疫苗的“到苗通知”，重复订阅，上一条将会失效，是否重复订阅？',
              onCancel () {
              },
              onConfirm () {
                _this.submitReserve()
              }
            })

          }else if(res.data.data == 2){
            _this.$vux.confirm.show({
              title: '提示',
              content: '您已订阅该疫苗的“到苗通知”，重复操作，上一条将会失效，是否重复订阅？',
              onCancel () {
              },
              onConfirm () {
                _this.submitReserve()
              }
            })
          }

        }).catch((e) =>{
          console.log(e);
        })
      },

      /**
       * 订阅到苗通知
       */
      noticeOfArrival(){
        this.isRegister();
      },

      /**
       * 提交一键订阅
       */
      submitReserve(){
        const _this = this;
        axios.get(aipConfig.registerSubscibe, {params:{vaccineCode:this.$route.query.code,depaCode: this.$route.query.depaCode},isShowLoading:true}).then((res) => {
          this.$router.push({ path: '/qualifying', query: { registerDetailId: res.data.data}})
        }).catch((e) =>{
          console.log(e);
        })
      },

      /**
       * 配置分享信息
       * 监听wxReady确保进入wx.ready再调用wxShare
       * 再次调用wxShare是因为如果页面不是作为首页进入,监听无法起效,所以再次手动调用wxShare
       */
      setShareInfo(){
        let link = baseCfg.appInfo.shareBaseUrl + '?target=/vaccine?code='+this.$route.query.code+'&depaCode='+this.$route.query.depaCode + '&vaccId=' + this.$route.query.vaccId;
        wxShare({
          'link': link
        })
      },

      /**
       * 缺苗
       */
      soldOut(){
        const _this = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '该门诊暂时缺苗，您可先订阅 “到苗通知”',
          onCancel () {
          },
          onConfirm () {
            _this.isRegister();
          }
        })
      }
    },

    computed:mapState(["user","isMobile"]),
    created: function () {

      // 判断用户信息完善程度
      if(this.user.mobile && this.user.mobile != ''){
        if(!this.user.hasOwnProperty("name") || this.user.name === '' || !this.user.hasOwnProperty("sex") || this.user.sex === '' || !this.user.hasOwnProperty("birthday")|| this.user.birthday ===''){
          this.$router.replace({ path: '/fillinPersonalInfo', query:{vaccCode: this.$route.query.code ,depaCode: this.$route.query.depaCode,vaccId:this.$route.query.vaccId}})
        }else{

          this.getVaccineDetail();

        }
      }else{
        this.$router.replace({ path: '/bindMobile', query:{vaccCode: this.$route.query.code ,depaCode: this.$route.query.depaCode,vaccId:this.$route.query.vaccId}})
      }


      // 微信分享
      this.setShareInfo();

    }

  }



// WEBPACK FOOTER //
// ./src/pages/vaccine/vaccine.vue