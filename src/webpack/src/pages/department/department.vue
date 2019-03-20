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
//
//

import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'
import { mapState } from 'vuex'

export default{
  name: 'department',
  data () {
    return {
      department: {},
      vaccines:[],
    }
  },
  computed:mapState(["isMobile"]),
  methods: {
    /**
     * @method getDeptInfo 获取门诊信息
     */
    getDeptInfo () {
      let depaCode = this.$route.query.depaCode
      axios.get(aipConfig.department, {params:{depaCode: depaCode}}).then((res) => {

        let depa = res.data.data;
        if(depa.payWay){
          let arr = depa.payWay.split(',');
          let payType = '';

          arr.forEach(function(e,i){
              if(e==1){
                payType += '医保卡，';
              }else if(e==2){
                payType += '微信，';
              }else if(e==3){
                payType += '支付宝，';
              }else if(e==4){
                payType +=  '银联卡，';
              }else if(e==5){
                payType +=  '现金，';
              }
          })

          payType = payType.substr(0, payType.length - 1);
          depa.payType = payType;
        }
        this.department = depa;
      }).catch(function(res){
        console.log(res)
      })
    },

    /**
     * @method openLocation 打开微信内置地图
     */
    openLocation(){
      if(this.isMobile.isWx){
        wx.openLocation({
          latitude: this.department.latitude, // 纬度，浮点数，范围为90 ~ -90
          longitude: this.department.longitude, // 经度，浮点数，范围为180 ~ -180。
          name: this.department.name, // 位置名
          address: this.department.address, // 地址详情说明
          scale: 28, // 地图缩放级别,整形值,范围从1~28。默认为最大
          infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        })
      }else{
        // 微信外使用腾讯地图
        window.location.href = "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:"+this.department.latitude+","+this.department.longitude+";title:"+this.department.name+";addr:"+this.department.address+"&key=DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5&referer=emiaoapp"
      }
    },

    /**
     * 获取疫苗列表
     */
    getVaccines () {
      const _this =this;
      let depaCode = this.$route.query.depaCode;
      let vaccineCode = '';
      if(this.$route.query.vaccineCode && this.$route.query.vaccineCode!='' ) vaccineCode = this.$route.query.vaccineCode;
      let params = {
        depaCode:depaCode,
        vaccineCode: vaccineCode || ''
      }
      axios.get(aipConfig.vaccines,{params:params}).then((res) => {
        let list = res.data.data;
        if(list&&list.length>1){
            let stocks=[],outStocks=[];
            list.forEach(function (e,i,arr) {
              if(e.total>0){
                  stocks.push(e)
              }else{
                  outStocks.push(e)
              }
            })
            list=stocks.concat(outStocks)
        }
        this.vaccines = list;
      }).catch(function(res){
        console.log(res)
      })
    },

    /**
     * 前往疫苗详情页
     * @param va 疫苗
     */
    toVaccine (va) {
      if(va.isSeckill  && va.isSeckill== 1){
        //秒杀疫苗
        this.$router.push({ path: '/seckill', query: { seckillId: va.id }});
      }else{
        //普通疫苗
        this.$router.push({ path: '/vaccine', query: { code: va.code, depaCode: this.$route.query.depaCode, vaccId: va.id }})
      }

    },

    /**
     * 设置分享信息
     */
    setWxShare(){
      let shareInfo = {};
      if(this.$route.query.vaccineCode && this.$route.query.vaccineCode!='' ) {
        shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/department?depaCode=' + this.$route.query.depaCode + '%vaccineCode=' + this.$route.query.vaccineCode;
      }else{
        shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/department?depaCode=' + this.$route.query.depaCode;
      }

      wxShare(shareInfo)
    }

  },
  created: function () {
    const _this = this;
    this.setWxShare();
    this.getDeptInfo();
    this.getVaccines();
  }
}




// WEBPACK FOOTER //
// ./src/pages/department/department.vue