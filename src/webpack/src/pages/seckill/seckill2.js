var render = function () {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c('div', {staticClass: "seckill"}, [_c('div', {staticClass: "top"}, [_c('h1', {staticClass: "title"}, [_vm._v(_vm._s(_vm.detail.name))]), _vm._v(" "), _c('div', {staticClass: "intro"}, [_vm._v(_vm._s(_vm.detail.intro))])]), _vm._v(" "), _c('div', {staticClass: "des"}, [_c('pre', {domProps: {"innerHTML": _vm._s(_vm.detail.describtion)}})]), _vm._v(" "), _c('div', {staticClass: "btn_box"}, [(_vm.detail.total > 0 && _vm.btnState == 0) ? _c('a', {
    staticClass: "sec_btn red",
    attrs: {"href": "javascript:void(0)"}
  }, [_vm._v("距离秒杀开始还剩余" + _vm._s(_vm.timeStr))]) : _vm._e(), _vm._v(" "), (_vm.detail.total > 0 && _vm.btnState == 1) ? _c('a', {
    staticClass: "sec_btn blue",
    attrs: {"href": "javascript:void(0)"},
    on: {
      "click": function ($event) {
        return _vm.toCheckInSeckill()
      }
    }
  }, [_vm._v("秒杀预约")]) : _vm._e(), _vm._v(" "), (_vm.detail.total <= 0 && _vm.btnState == 1) ? _c('a', {
    staticClass: "sec_btn grey",
    attrs: {"href": "javascript:void(0)"},
    on: {
      "click": function ($event) {
        return _vm.soldOut()
      }
    }
  }, [_vm._v("被抢光了！")]) : _vm._e()])])
}
var staticRenderFns = []
var esExports = {render: render, staticRenderFns: staticRenderFns}
export default esExports


//////////////////
// WEBPACK FOOTER
// ./node_modules/vue-loader/lib/template-compiler?{"id":"data-v-c158d7c0","hasScoped":false,"transformToRequire":{"video":["src","poster"],"source":"src","img":"src","image":"xlink:href"},"buble":{"transforms":{}}}!./node_modules/vux-loader/src/before-template-compiler-loader.js!./node_modules/vux-loader/src/template-loader.js!./node_modules/vue-loader/lib/selector.js?type=template&index=0!./src/pages/seckill/seckill.vue
// module id = null
// module chunks =
