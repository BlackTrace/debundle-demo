
import { mapState } from 'vuex';
import Group from 'vux/src/components/group/index.vue'
import Cell from 'vux/src/components/cell/index.vue'

import {wxShare} from '../../config/setWxJSSDK'

export default{
components: {
Group,
Cell
},
computed:mapState(["user"]),
data(){
return{
formateInfo:{
sex:'',
birthday:''
}
}
},
created(){
wxShare();
if(this.user.sex == 1) this.formateInfo.sex = '男';
else if(this.user.sex == 2) this.formateInfo.sex = '女';
else this.formateInfo.sex = '未知';
this.formateInfo.birthday = moment(this.user.birthday).format("YYYY/MM/DD");
if(this.user.idCardNo && this.user.idCardNo!='') this.user.codeIdCardNo = this.user.idCardNo.replace(this.user.idCardNo.substring(4,14),"**********");
}
}



// WEBPACK FOOTER //
// ./src/pages/userInfo/setting.vue