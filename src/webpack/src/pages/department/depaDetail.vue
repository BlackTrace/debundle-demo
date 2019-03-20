
import axios from 'axios'
import Tab from 'vux/src/components/tab/tab.vue'
import TabItem from 'vux/src/components/tab/tab-item.vue'

import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'

export default{
data () {
return {
department: {},
}
},
methods: {
/**
* @method getDeptInfo 获取门诊信息
*/
getDeptInfo () {
let depaCode = this.$route.query.depaCode
axios.get(aipConfig.department, {params:{depaCode: depaCode}}).then((res) => {
let data = res.data.data;
if(data.imgUrl && data.imgUrl !=''){
let arr = data.imgUrl.split('.com');
data.imgUrl = 'https://adultvacc-1253522668.image.myqcloud.com' + arr[1] + '?imageView2/2/w/750/h/422';
}
this.department = res.data.data
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
infoUrl: '' 
})
}else{

window.location.href = "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:"+this.department.latitude+","+this.department.longitude+";title:"+this.department.name+";addr:"+this.department.address+"&key=DYVBZ-FGY3S-XKZO4-6WBY4-2KB3Z-S4BX5&referer=emiaoapp"
}
},

viewLicense(){
const _this = this;
wx.previewImage({
current: _this.department.certificateUrl, // 当前显示图片的http链接
urls:[_this.department.certificateUrl]
});
},

/**
* 设置分享信息
*/
setWxShare(){
let shareInfo = {};
shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=/depaDetail?depaCode=' + this.$route.query.depaCode;
wxShare(shareInfo)
}

},
created: function () {
const _this = this;
this.setWxShare();
this.getDeptInfo();
}
}




// WEBPACK FOOTER //
// ./src/pages/department/depaDetail.vue