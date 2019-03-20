
import Clocker from 'vux/src/components/clocker/index.vue'

import VueQr from 'vue-qr'     
import baseCfg from '../../config/baseConfig'

export default {
components: {
Clocker,
VueQr
},

data(){
return{
numInfo:'',
recordList:[],
qrCodeUrl:''
}
},

created(){
this.getTakeNumInfo();
},

methods:{
close(){
wx.closeWindow();
},

/**
* 获取取号排队信息
*/
getTakeNumInfo(){
this.$axios.get(this.$aipConfig.getTakeNumInfo).then((res) => {
let data = res.data.data;

data.waitTime = data.beforeQueueNum * 5;

if(window.location.host == 'wx1.healthych.com') this.qrCodeUrl = "https://tmgj.healthych.com/index.do?target=/his_checkStep*id-" + data.linkmanId;
else this.qrCodeUrl = "https://mgj.healthych.com/index.do?target=/his_checkStep*id-" + data.linkmanId;


if(data.sex == 1) data.sex = '男';
else if(data.sex ==2 ) data.sex ='女';
else data.sex = '未知';


if(data.step == 100){
data.endWaitTime = moment(data.inoculateCompleteTime,'YYYY-MM-DD HH:mm:ss').add(30, 'm').format('YYYY-MM-DD HH:mm:ss');
}


let list = data.inoculateRecords;
for ( let i in list) {
let item = list[i];
if(item.inoculatePart ==1) item.inoculatePartName = '左上臂';
else if(item.inoculatePart ==2) item.inoculatePartName = '右上臂';
else item.inoculatePartName = '其他';

switch (item.vaccineIndex){
case 1:
item.vaccineIndexText = "第一针";
break;
case 2:
item.vaccineIndexText = "第二针";
break;
case 3:
item.vaccineIndexText = "第三针";
break;
case 4:
item.vaccineIndexText = "第四针";
break;
case 5:
item.vaccineIndexText = "第五针";
break;
case 6:
item.vaccineIndexText = "第六针";
break;
case 7:
item.vaccineIndexText = "第七针";
break;
default:
item.vaccineIndexText = "其他";
}

}


this.numInfo = data;
this.recordList = list;

}).catch(function(r){
console.log(r)
})
},



}

}



// WEBPACK FOOTER //
// ./src/pages/takeNum/numSuccess.vue