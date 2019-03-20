

import XDialog from 'vux/src/components/x-dialog/index.vue'

export default{
name: 'myAlert',
components: {
XDialog
},
created () {
if (typeof this.value !== 'undefined') {
this.showValue = this.value
}
},
props: {
value: Boolean,
title: String,
content: String,

maskTransition: {
type: String,
default: 'vux-mask'
},
dialogTransition: {
type: String,
default: 'vux-dialog'
}
},
data () {
return {
showValue: false
}
},
methods: {
_onHide () {
this.showValue = false
}
},
watch: {
value (val) {
this.showValue = val
},
showValue (val) {
this.$emit('input', val)
}
}
}



// WEBPACK FOOTER //
// ./src/components/myAlert/myAlert.vue