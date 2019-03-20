
import Tabbar from 'vux/src/components/tabbar/tabbar.vue'
import TabbarItem from 'vux/src/components/tabbar/tabbar-item.vue'

import { mapState} from 'vuex'
export default {
name: 'comFooter',
props: ['selected'],
components: {
Tabbar,
TabbarItem
},
computed:mapState(["messageNum"]),
}



// WEBPACK FOOTER //
// ./src/components/comFooter/comFooter.vue