
import axios from 'axios'
import aipConfig from '../../config/apiConfig'
import {wxShare} from '../../config/setWxJSSDK'
import baseCfg from '../../config/baseConfig'
import Group from 'vux/src/components/group/index.vue'
import Cell from 'vux/src/components/cell/index.vue'

import slidebarItem from '../../components/slidebarItem/slidebarItem.vue'

export default{
components: {
Group,
Cell,
slidebarItem
},
data(){
return{
record:[]
}
},
methods: {
getRecords(){
axios.get(aipConfig.userInoculations).then((res) => {
this.record = res.data.data;
})
},
},
created () {
wxShare();
this.getRecords();
}
}



// WEBPACK FOOTER //
// ./src/pages/record/record.vue