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
      departmentList:[]
    }
  },
  created(){
    let shareInfo = {};
     shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=examinationSearch?fa=wx';
     shareInfo.title = '体检筛查进度查询';
     shareInfo.desc = '请按照页面提示预约时间体检，逾期未体检则默认作废';
     this.$wxShare(shareInfo);
    this.getDepartmentList();
  },
  methods:{

    getDepartmentList(){
      let params = {
        cityName: this.$route.query.cityName,
        department: this.$route.query.department
      }
      this.$axios.get(this.$aipConfig.healthBookingDepa,{params: params}).then((res) => {
        this.departmentList = res.data.data;
      }).catch((e) =>{
        console.log(e);
      })
    }

  }
}



// WEBPACK FOOTER //
// ./src/pages/examination/departmentList.vue