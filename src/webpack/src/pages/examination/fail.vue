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
  created(){
    let shareInfo = {};
    shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=examinationSearch?fa=wx';
    shareInfo.title = '体检筛查进度查询';
    shareInfo.desc = '请按照页面提示预约时间体检，逾期未体检则默认作废';
    this.$wxShare(shareInfo);
  }
}



// WEBPACK FOOTER //
// ./src/pages/examination/fail.vue