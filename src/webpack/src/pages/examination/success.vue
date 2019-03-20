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
//
//

import baseCfg from '../../config/baseConfig'
export default {
  data(){
    return{
      examinationInfo:''
    }
  },
  created(){
    let shareInfo = {};
    shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=examinationSearch?fa=wx';
    shareInfo.title = '体检筛查进度查询';
    shareInfo.desc = '请按照页面提示预约时间体检，逾期未体检则默认作废';
    this.$wxShare(shareInfo);
    this.getExaminationInfo();
  },
  methods:{

    getExaminationInfo(){
      this.$axios.get(this.$aipConfig.healthBookingSearch,{params: {idCard:this.$route.query.idCard}}).then((res) => {
        this.examinationInfo = res.data.data.info;
      }).catch((e) =>{
        console.log(e);
      })
    },


    book(){
      window.location.href = "http://b.meinian.cn/idyy/MPView/Login?from=groupmessage&isappinstalled=0"
    },

    searchDepa(){
      this.$router.push({ path: '/examinationDepartmentList',query:{cityName: this.examinationInfo.cityName, department:this.examinationInfo.departmentName}})
    }

  }
}




// WEBPACK FOOTER //
// ./src/pages/examination/success.vue