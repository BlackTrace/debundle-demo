
import Datetime from 'vux/src/components/datetime/index.vue'
import Group from 'vux/src/components/group/index.vue'

import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'

export default {
components: {
Datetime,
Group,
},
data(){
return{
date:'',
otherReaction:'',
reactions:[
{
id:1,
content:"局部红肿、硬节",
state:0 
},
{
id:2,
content:"头痛、发热、头晕、晕眩、四肢无力",
state:0
},
{
id:3,
content:"恶心、呕吐",
state:0
},
{
id:4,
content:"关节痛、肌肉痛",
state:0
},
{
id:5,
content:"超敏反应、各种皮疹、荨麻疹、瘙痒",
state:0
}
],
dateRange:{
start:'',
end:''
}
}
},

created(){
this.getParaReactionBySubId();
wxShare();
},

methods:{
/**
* 选择异常反应选项
* @param e 异常反应项
*/
select(e){
if(e.state == 0) {
this.reactions[e.id - 1].state = 1;
return
}
if(e.state == 1) {
this.reactions[e.id - 1].state = 0;
return
}
},

/**
* 获取已提交异常反应信息
*/
getParaReactionBySubId(){
const _this = this;
let id = this.$route.query.subscribeId;
axios.get(aipConfig.getParaReactionBySubId, {params:{subscribeId: id}}).then((res) => {
let selectedId = res.data.data.selectedId;
if(selectedId.length > 0){
selectedId.forEach(function(e,i,arr){
let id = parseInt(e);
if(id !=6){
_this.reactions[id-1].state = 2;
}
})
}

this.dateRange.start = moment(res.data.data.inoclateDate).format("YYYY-MM-DD");
this.dateRange.end =  moment(res.data.data.nowTime).format("YYYY-MM-DD");
}).catch(function(res){
console.log(res)
})
},

/**
* 验证表单
* @returns {boolean}
*/
checkForm(){
let flag = false;
for(let i in this.reactions){
if(this.reactions[i].state == 1){
flag = true;
break;
}
}

if(!flag){
if(this.otherReaction.replace(/ /g,'') !='') flag = true;
}

if(!flag){
this.$vux.toast.show({
text: '请选择或填写不良反应',
type: 'text',
width: 'auto'
})
return;
}

if(this.date == ''){
this.$vux.toast.show({
text: '请选择身体出现不适时间',
type: 'text',
width: 'auto'
})
return;
}

return true;
},

submit(){
let _this = this;
if(!_this.checkForm()){
return;
}else {
let reaction = '';
this.reactions.forEach(function(e,i,arr){
if(e.state == 1){
reaction = reaction + e.id + ',';
}
})
if(this.otherReaction != '') reaction = reaction + '6' + ',';
if(reaction != '') reaction = reaction.substr(0,reaction.length - 1);

let params = {
subscribeId : this.$route.query.subscribeId,
reaction: reaction,
reactionDate: this.date,
otherReaction: this.otherReaction
}

axios.get(aipConfig.addParaReaction, {params:params,isShowLoading:true}).then((res) => {
_this.$vux.toast.show({
text: '提交成功!',
type: 'success',
width: '40%'
})
setTimeout(function(){
_this.$router.replace({ path: '/orderDetail',query: { id: _this.$route.query.subscribeId}})
},2000)
}).catch(function(res){
console.log(res)
})

}
}

}


}



// WEBPACK FOOTER //
// ./src/pages/AEFI/index.vue