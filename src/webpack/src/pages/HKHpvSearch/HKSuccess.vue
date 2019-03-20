
import Cell from 'vux/src/components/cell/index.vue'
import Group from 'vux/src/components/group/index.vue'

import { mapState} from 'vuex';
import baseCfg from '../../config/baseConfig'

export default {
components: {
Group,
Cell
},
computed:mapState(["HKHpvInfo"]),
created(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=HKIndex?fa=wx';
shareInfo.title = '香港疫苗预约进度查询';
shareInfo.desc = '预约成功后带上身份证前往门诊接种即可';
this.$wxShare(shareInfo)
}
}



// WEBPACK FOOTER //
// ./src/pages/HKHpvSearch/HKSuccess.vue