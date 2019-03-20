
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import Badge from 'vux/src/components/badge/index.vue'

import {wxShare} from '../../config/setWxJSSDK'
export default {
components: {
Badge
},
data(){
return{
messageList: [],
params:{
offset:0,
limit:10
},
noMoreData: false
}
},
created(){
const _this =this;
wxShare();
this.getNoticeList(function(data,total){
if(total <= _this.params.limit){
_this.noMoreData = true;
}
_this.messageList = data;
});
},
methods: {
getNoticeList(callback){
const _this =this;
axios.get(aipConfig.getNoticeList,{params:this.params}).then((res) => {
this.params.offset = this.params.offset+this.params.limit;
if(callback){
callback(res.data.data.rows,res.data.data.total);
}
}).catch((e) =>{
console.log(e)
})
},
infinite(done) {
let _this = this;
if (this.noMoreData) {
setTimeout(() => {
done(true)
}, 1000)
return;
}
this.getNoticeList(function(data){
if( data.length > 0){
_this.messageList = _this.messageList.concat(data)
if(data.length<_this.params.limit){
_this.noMoreData = true;
}
}else{
_this.noMoreData = true;
}
setTimeout(() => {
done()
})
});
},
toMessage(id){
this.$router.push({ path: '/message',query: { id: id}});
}
}
}



// WEBPACK FOOTER //
// ./src/pages/myMessage/messageList.vue