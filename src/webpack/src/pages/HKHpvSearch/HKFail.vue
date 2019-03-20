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
  created(){
    let shareInfo = {};
    shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=HKIndex?fa=wx';
    shareInfo.title = '香港疫苗预约进度查询';
    shareInfo.desc = '预约成功后带上身份证前往门诊接种即可';
    this.$wxShare(shareInfo)
  }
}



// WEBPACK FOOTER //
// ./src/pages/HKHpvSearch/HKFail.vue