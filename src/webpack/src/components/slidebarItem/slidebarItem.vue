
import Group from 'vux/src/components/group/index.vue'
import Cell from 'vux/src/components/cell/index.vue'


export default{
components: {
Group,
Cell
},
data(){
return{
show: false
}
},
props:{
item:{},
index:''
},
methods:{
formatRecord(){
for ( let i in this.item.inoculations) {
var record = this.item.inoculations[i];
if (record.status == 0) {
record.state = "待接种";
} else if (record.status == 1) {
record.state = "已预约";
} else if (record.status == 2) {
record.state = "已接种";
} else {
record.state = "";
}
switch(record.inoculateIndex)
{
case 1:
record.inoculateIndex = "第一针";
break;
case 2:
record.inoculateIndex = "第二针";
break;
case 3:
record.inoculateIndex = "第三针";
break;
case 4:
record.inoculateIndex = "第四针";
break;
default:
record.inoculateIndex = "";
}
let tips_time = moment(record.inoculateTime).subtract(record.subscribeDays,"day").format("YYYY年MM月DD日");
record.tips = "您可以在"+ tips_time + "开始预约";
record.inoculateTime = moment(record.inoculateTime).format("YYYY年MM月DD日");

}
},
toVaccine(vaCode,depaCode){
this.$router.push({ path: '/vaccine', query: { code: vaCode, depaCode: depaCode }})
}
},
created () {
if(this.index==0) this.show=true;
this.formatRecord();
}
}



// WEBPACK FOOTER //
// ./src/components/slidebarItem/slidebarItem.vue