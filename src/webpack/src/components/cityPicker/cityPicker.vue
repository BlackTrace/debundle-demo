//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

  //import './nomalize'
  import axios from 'axios'
  import aipConfig from '../../config/apiConfig'
  import {mapState, mapMutations} from 'vuex';
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false,
        required: false
      },
      simple: {
        type: Boolean,
        default: false
      },
      localCity: {
        type: Object
      },
      starCity: {
        type: Array
      },
//      cityData: {
//        type: Array
//      },
      onChoose: {
        type: Function
      },
      initCity: {
        type: Function,
        default: null
      },
      /**
       * call back when click cancel button
       */
      close: {
        type: Function
      }
    },
    computed: mapState(["cities"]),
    data: function(){
      return {
        input: '',
        list: '',
        targetLetter: '',
        searchList: [], //搜索结果
        hotList: [],
        letterList: [],
        result: '',
        defaultTrigger: true,
        cityData:[]
      }
    },
    watch: {
      cityData: function(){
        if(this.cityData && this.cityData.length > 0){
          this._formatCityList(this.cityData);
        }
      },
      input: function() {
        this._search();
      },
      targetLetter: function() {
        this._scrollView();
      },
      isShow:function(){
          this.fetchCities();
      }
    },
    activate: function(done) {
      var _this = this;

      done();
      if(this.cityData && this.cityData.length > 0){
        this._formatCityList(this.cityData);
      }
    },
    methods: {
      //全局函数
      ...mapMutations(["setCities"]),
//      show: function() {
//        // this.isShow = true;
//      },
      hide: function() {
        // this.isShow = false;
        this.input = '';
        this.searchList = [];
        this.close && this.close()
      },
      _chooseDefault: function() {
        let _this = this;
        let arr = this.list.filter(function(item) {
          return _this.localCity.cityId == item.cityId
        })
        if(arr.length > 0){
          _this._chooseOne(arr[0]);
        }else{
          _this._chooseOne(this.list[0]);
        }
      },
      /**
       * 点击字母
       */
      _chooseLetter: function(e) {
        let symbol =  e.target.getAttribute('data-type')

        if(symbol == 'starCity'){
          this.targetLetter = '热门城市';
        }else{
          this.targetLetter = e.target.innerText;
        }
      },
      /**
       * slide letters list
       */
      _touchLetters: function(e) {
        e.preventDefault();

        let ol = document.querySelector('.xin-widget-citys-letnav ol'),
          liNum = document.querySelectorAll('.xin-widget-citys-letnav li').length,
          olHei = ol.clientHeight, //ol height
          liHei = Math.round(olHei / liNum), //li height
          olTop = ol.offsetTop + ol.offsetParent.offsetTop,
          olBot = olTop + olHei,
          touchY = e.touches[0].pageY,
          $wrapper = document.querySelector('.xin-widget-citys')

        switch (e.type) {
          case 'touchstart':
            if (touchY < olTop) {
              // 回顶
              $wrapper.scrollTop = 0;
            } else if (touchY > olBot) {
              // 到底
              $wrapper.scrollTop = 10000;
            }
            break;
          case 'touchmove':
            if (touchY < olBot && touchY > olTop) {
              let olTouchY = touchY - olTop,
                targetIndex = Math.ceil(olTouchY / liHei),
                target = document.querySelectorAll('.xin-widget-citys-letnav li')[targetIndex - 1]

              if(target.getAttribute('data-type') == 'starCity'){
                this.targetLetter = '热门城市';
              }else{
                this.targetLetter = target.innerText;
              }
            }else if(touchY <= olTop){
              // 回顶
              $wrapper.scrollTop = 0;
            }else{
              // 到底
              $wrapper.scrollTop = 10000;
            }
            break;
        }
      },
      /**
       * 滚动可视区 - Triggered by '_chooseLetter'
       */
      _scrollView: function() {
        let dtList = document.querySelectorAll('.xin-widget-citys-list dt'),
          _this = this,
          _dtList = Array.prototype.slice.call(dtList)

        if (_dtList){
          _dtList.forEach((value, index, array) => {
            if(value.innerText === _this.targetLetter) {
              let wrapper = document.querySelector('.xin-widget-citys')
              let scrollTop = document.querySelector('.xin-widget-citys-list').offsetTop + value.offsetTop

              wrapper.scrollTop = scrollTop

              // setTimeout(function() {
              //     // 解决ios下 元素滚动的bug  现象是触发scroll时会导致部分滚动元素消失到二次元
              //     wrapper.style.width = (100 + (Math.round(Math.random() * 1000)) / 1000) + '%';
              // }, 0);
              return false;
            }
          })
        }
      },
      /**
       * search city
       */
      _search: function() {
        var reg = new RegExp(this.input == '' ? 'xxyy' :
          this.input, 'ig');

        var _arr = [];
        for(var i in this.letterList){
          for(var j = 0; j < this.letterList[i].length; j++){
            if(
              reg.test(this.letterList[i][j][
                'cityName'
                ]) ||
              reg.test(this.letterList[i][j][
                'cityFirstLetter'
                ]) ||
              reg.test(this.letterList[i][j][
                'citySpell'
                ])
            ){
              _arr.push(this.letterList[i][j]);
            }
          }
        }
        this.searchList = _arr;
      },
      /**
       * format data of city
       * @param  {[Array]} arr [cityList]
       */
      _formatCityList: function(arr) {
        var letterArr = {};


        if(this.simple){
          for (var i = 0; i < arr.length; i++) {
            letterArr[i] = [];
            letterArr[i].push(arr[i]);
          }
        }else{
          // 添加热门城市
          if(this.starCity && this.starCity.length > 0){
            let _starCity = this.starCity

            _starCity.forEach((value, index, array) => {
              if(!('star' in letterArr)){
                letterArr['star'] = []
                letterArr['star'].unshift(value)
              }else{
                letterArr['star'].unshift(value)
              }
            })
          }
          for (var i = 0; i < arr.length; i++) {
            if (!(arr[i]['cityFirstLetter'] in letterArr)) {
              letterArr[arr[i]['cityFirstLetter']] = [];
              letterArr[arr[i]['cityFirstLetter']].push(arr[i]);
            } else {
              letterArr[arr[i]['cityFirstLetter']].push(arr[i]);
            }
          }
        }
        this.letterList = letterArr;
      },
      _chooseOne: function(obj) {
        this.onChoose && this.onChoose(JSON.parse(JSON.stringify(obj)));
        // this.hide();
      },
      fetchCities:function(){
        const _this = this;
        if(_this.cities&&_this.cities.length>0){
          _this.cityData=_this.cities;
          return;
        }
        axios.get(aipConfig.cities).then((res) => {
          _this.setCities(res.data.data.cityData);
          _this.cityData=_this.cities;
        }).catch((e) => {
          console.log(e);
        })
       }
    }
  }



// WEBPACK FOOTER //
// ./src/components/cityPicker/cityPicker.vue