 /**
 * Created by dell on 2017/5/23.
 */

/*
* 定义常量
* */
module.exports = {

  httpCode:{
    '401': '访问未授权',
    '403': '访问被拒绝',
    '404': '请求地址有误',
    '405': '访问被拒绝(405)',
    '500': '服务器发生错误,请稍后再试',
    '502': '网关错误',
    '503': '服务不可用',
    '504': '网关超时',
    '505': '不支持所请求http协议版本',
    '-1': '请求失败,请检查您的网络设置'
  },

  //页面统计
  statistics:{

    //预约接种


    //页面部分
    /*'home':["页面浏览量",'首页'],
    'myorder':["页面浏览量",'预约单列表'],
    'hospital':["页面浏览量",'医院详情页'],
    'activity':["页面浏览量",'专题详情页'],
    'regimentWx':["页面浏览量",'活动(组团)详情页(微信)'],
    'regimentXdm':["页面浏览量",'活动(组团)详情页(小豆苗)'],
    'regimentOther':["页面浏览量",'活动(组团)详情页(其他)'],
    'vaccine':["页面浏览量",'疫苗详情页'],
    'subscribe':["页面浏览量",'填写/修改预约单'],
    'orderDetail':["页面浏览量",'订单详细页'],
    'joinQualifying':["页面浏览量",'排队登记页'],
    'qualifying':["页面浏览量",'排队登记成功页'],
    'myQualifying':["页面浏览量",'我的排队页'],
    'searchDepartment':["页面浏览量",'附近的接种门诊'],
    'invitation':["页面浏览量",'邀请好友'],
    'confirmOrder':["页面浏览量",'确认订单列表页'],*/

    // 按钮部分
    'subBtn':['按钮点击量','提交预约'],
    'payBtn':['按钮点击量','去支付'],
    'qualifyingBtn':['按钮点击量','参加排队'],
    'clickQrCode':['按钮点击量','排队成功页二维码'],
    'qualifyShareBtn':['按钮点击量','排队成功页分享按钮'],

    //次数统计
    'shareSuccess':['次数统计','分享成功'],
    'noSubscribe':['次数统计','未关注人打开'],
    'subSuccess':['次数统计','预约成功'],
    'subFail':['次数统计','预约失败'],
    'cancleSub':['次数统计','取消预约'],

    hpv9:{
      'joinHpv9':["九价hpv活动",'页面浏览量','登记页面'],
      'myHpv9':["九价hpv活动",'页面浏览量','我的九价hpv页'],
      'shareHpv9':["九价hpv活动",'页面浏览量','邀好友助力页'],
      'ruleHpv9':["九价hpv活动",'页面浏览量','活动规则'],
      'awardHpv9':["九价hpv活动",'页面浏览量','获得资格'],
      'endHpv9':["九价hpv活动",'页面浏览量','未获得资格'],
      // 按钮
      'joinBtn':["九价hpv活动","按钮点击量",'立即参与',"登记页面"],
      'shareBtn':["九价hpv活动","按钮点击量",'速邀好友助力',"我的九价hpv页"],
      'helpBtn':["九价hpv活动","按钮点击量",'助力好友','邀好友助力页'],
      'share_joinBtn':["九价hpv活动","按钮点击量",'我要参加','邀好友助力页'],
      'share_toRankBtn':["九价hpv活动","按钮点击量",'查看排名','邀好友助力页'],
      'clickCode':["九价hpv活动","二维码点击量",'邀好友助力页']
    },

    //首页
    home:{
      'page': ['预约主流程','首页','页面浏览量']
    },

    //预约接种
    departmentList:{
      'page': ['预约主流程','预约接种','页面浏览量']
    },

    //附近门诊查询
    searchDepartment: {
      'page': ['预约主流程','附近门诊','页面浏览量']
    },

    //热门疫苗
    hotVaccine:{
      'page': ['预约主流程','根据热门疫苗查询门诊','页面浏览量']
    },

    //门诊页
    department:{
      'page': ['预约主流程','门诊主页','页面浏览量']
    },
    depaDetail:{
      'page': ['预约主流程','门诊详情页','页面浏览量']
    },

    //疫苗详情页
    vaccine:{
      'page': ['预约主流程','疫苗详情页','页面浏览量']
    },

    //预约页
    subscribe:{
      'page': ['预约主流程','填写下单信息页','页面浏览量']
    },

    //订单提交预览页
    submitPreview:{
      'page': ['预约主流程','订单提交信息预览页','页面浏览量']
    },

    //我的
    mine:{
      'page': ['预约主流程','我的','页面浏览量']
    },

    //订单列表
    myorder:{
      'page': ['预约主流程','订单列表页','页面浏览量']
    },

    //订单详情
    orderDetail:{
      'page': ['预约主流程','订单详情页','页面浏览量']
    },

    //扫码确认页
    confirmOrder:{
      'page': ['预约主流程','扫码确认页','页面浏览量']
    },

    //接种记录
    record:{
      'page': ['预约主流程','接种记录','页面浏览量']
    },

    //广告
    adDetail:{
      'page': ['banner广告','广告详情页','页面浏览量']
    },


    //登记排队
    dingyue:{
      page:{
        joinQualifying: ['订阅相关','登记页','页面浏览量'],
        qualifying: ['订阅相关','订阅成功页','页面浏览量'],
        myReserves: ['订阅相关','我的订阅列表','页面浏览量'],
        reserve: ['订阅相关','订阅详情页','页面浏览量'],
        reserveShare: ['订阅相关','订阅分享页', '页面浏览量']
      }
    },

    //积分中心
    integral:{
      page:{
        posters:['积分中心','赚取积分页','页面浏览量'],
        shop:['积分中心','积分商城页','页面浏览量'],
        intHistory:['积分中心','好友助力记录页','页面浏览量'],
        ecHistory:['积分中心','兑换记录页','页面浏览量'],
        invitation:['积分中心','邀请助力页','页面浏览量']
      }
    }








  },

  //地址相关信息
  appInfo:{
    'appUrl': window.location.protocol+'//'+ (window.location.host) + '/',
    /*'appHost': 'http://'+ (window.location.host),*/
    'appLogo': window.location.protocol+'//'+ (window.location.host) + '/static/images/share_ico.jpg',
    'imagesUrl':window.location.protocol+'//'+ (window.location.host) + '/static/images/',
    'shareBaseUrl': window.location.protocol+'//'+ (window.location.host) + '/passport/wx/login.do'
  }


}



// WEBPACK FOOTER //
// ./src/config/baseConfig.js