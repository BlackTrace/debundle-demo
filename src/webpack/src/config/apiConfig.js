/**
 * Created by dell on 2017/5/12.
 */
// 本地
/*module.exports = {
  departments: 'static/data/departments.json',
  department: 'static/data/hospital.json'
}*/
const baseUrl = '/u/v1.2/'
const v13BaseUrl = '/u/v1.3/'
const v14BaseUrl ='/u/v1.4/'
const award = '/award/'
const earnVaccine = '/awardHpv/'

const base = '/base/'  //基础数据服务
const subscribe = '/order/subscribe/' // 预约下单相关接口
const user = '/passport/user/'  //用户相关信息
const notice = '/message/notice/' //消息中心相关接口
const register = '/passport/register/' // 排队登记相关接口
const message = '/message/validate/' //验证码相关
const inoculation = '/order/inoculation/' //接种记录
const linkman = '/order/linkman/' //联系人信息
const ins = '/ins/' //保险业务
const insurance = '/insurance-shop/front/insurances/' //保险商城
const parareaction = '/order/parareaction/' //异常反应
const dogBite = '/his/dogBiteRecord/' // 犬伤
const seckill = '/seckill/'  //秒杀
const healthBooking = '/order/healthBooking/' //体检查询
// 服务器
module.exports = {

  userSubscribe: baseUrl + 'userSubscribe.do',
  activitySubSuccessDesc: baseUrl + 'activitySubSuccessDesc.do',
  checkInventory: baseUrl + 'checkInventory.do',
  getRegisterVaccCode: v13BaseUrl + 'getRegisterVaccCode.do', // 获取用户登记疫苗




  getUserPoints: award + 'getUserPoints.do', // 获取用户积分
  getAwardGoosList: award + 'getAwardGoosList.do', // 获取商品列表
  getAwardGoosById: award + 'getAwardGoosById.do', // 获取商品详情
  exchange: award + 'exchange.do', // 兑换礼品接口
  getAwardPointsList: award + 'getAwardPointsList.do', // 获取助力积分列表
  getAwardRedeemList: award + 'getAwardRedeemList.do', // 获取兑换列表


  hasEarnVaccineActivity: earnVaccine + 'hasEarnVaccineActivity.do', //是否有赢取宫颈癌疫苗活动正在进行中
  myFreeTickets: earnVaccine + 'myFreeTickets.do', // 我的免费券


  /*九价活动接口*/
  countRegisterHelps: register + 'countRegisterHelps.do', // 获取用户助力数接口
  getRegisterRanking: register + 'getRegisterRanking.do', // 获取用户当前的排位
  getRankingList: register + 'getRankingList.do', // 获取助力排名接口
  saveRegisterHelp: register + 'saveRegisterHelp.do', // 助力接口
  isRegisterActivity: register + 'isRegisterActivity.do', // 是否参加过助力活动接口:0 未参加  1 已参加
  hasRegisterActivity: register + 'hasRegisterActivity.do', // 获取是否有助力活动的接口:0 没有活动  1 有正在进行的活动  2 活动未开始 3 活动已结束
  registerActivity: register + 'registerActivity.do', // 提交登记接口（参加九价活动)



  findLoginUserByKey: user + 'findLoginUserByKey.do', //获取登录用户信息接口
  bindUserMobile: user + 'bindUserMobile.do', //用户绑定手机号码
  changeUserMobile: user + 'changeUserMobile.do', // 修改手机号码

  getShareToken: user + 'getShareToken.do', // 获取分享token
  getUserInfoByShareToken: user + 'getUserInfoByShareToken.do',  //根据用户分享token获取昵称和头像

  cities: base + 'region/cities.do',
  getCityChildRegions: base + 'region/getCityChildRegions.do', //根据城市编码获取城市下面的区县列表接口
  regions: 'https://adultvacc-1253522668.file.myqcloud.com/data/regions.json', //三级省市区
  geocoder: base + 'region/geocoder.do', //根据经纬度查询城市接口

  departments: base + 'department/pageList.do', // 门诊列表分页查询接口
  department: base + 'department/detail.do', // 门诊信息详情

  vaccines: base + 'department/vaccines.do',
  vaccine: base + 'department/vaccine.do',
  commonVaccine: base + 'vaccine/detail.do', // 根据疫苗vaccineCode获取疫苗信息，无需depaCode

  isCanSubscribe: subscribe +'isCanSubscribe.do', //查询用户是否允许预约的接口
  getWorkDays:subscribe + 'workDays.do', //根据门诊编码获取可预订日期列表
  findSubscribeAmountByDays: subscribe + 'findSubscribeAmountByDays.do', // 查询预约日期剩余可预约人数是否已满
  departmentWorkTimes: subscribe + 'departmentWorkTimes.do', //查询预约日期对应的预约时间段列表
  getNow: base + '/time/now.do', //获取系统当前时间接口

  getNoticeList: notice + 'getNoticeList.do', // 获取消息列表
  getNoticeDetail: notice + 'getNoticeDetail.do', //获取消息详情
  getNotReadNoticeNum: notice + 'getNotReadNoticeNum.do', //获取未读数量

  isRegister: register + 'isRegister.do', //手机号码是否已登记
  registerIndex: register + 'registerIndex.do', //登记页面查询接口
  register: register + 'submit.do', //用户登记排队接口
  registerRanking: register + 'registerRanking.do', //统计登记用户排名接口
  myRegisterList: register + 'myRegisterList.do', //我的订阅通知列表
  registerSubscibe : register + 'subscibe.do', //一键订阅门诊疫苗到苗通知
  deleteRegister: register + 'delete.do', //订阅信息删除


  sendValidateCode: message + 'sendValidateCode.do', //短信验证码发送

  ordersList: subscribe + 'pageList.do', //查询登录用户预约单列表
  addOrder: subscribe + 'add.do', // 预约单新下单
  orderDetail: subscribe + 'clientDetail.do', // 订单详情
  cancelOrder: subscribe + 'cancel.do', //取消预约单
  confirmSubscribe: subscribe + 'confirmSubscribe.do', //确认"已预约"的预约单为已完成接口 参数type：1-医生确认 2-用户按钮确认 3-用户扫码确认
  prePay: subscribe + 'prePay.do', //针对"待支付"状态的订单,可以在修改页面进行支付,支付前调用预下单获取微信支付凭证调用微信支付界面
  removeOrder: subscribe + 'remove.do', //已取消预约单删除接口
  updateOrder: subscribe + 'update.do', //修改预约单,只可以修改预约日期和预约时间段.而且只能是待接种状态的预约单才可以修改
  updateResidueTimes: subscribe + 'updateResidueTimes.do', //获取可修改预约单次数

  userInoculations: inoculation + 'userInoculations.do', //接种记录列表

  saveOrUpdateLinkman : linkman + 'saveOrUpdate.do', //新增或修改联系人信息
  findByUserId: linkman + 'findByUserId.do', //用户联系人列表
  relations: linkman + 'relations.do', // 联系人关系列表
  linkmanDetail : linkman + 'clientDetail.do', //用户联系人详情
  deleteLinkman : linkman + 'delete.do', //删除联系人信息

 indexAds : base + 'activityPromotion/list.do', //广告轮播
 adDetail:base+'activityPromotion/detail.do', //广告详情

  hotVaccine:base+'hotVaccine/list.do',//热门疫苗
  vaccineQuestionList: base + 'vaccineQuestion/list.do', //获取疫苗咨询列表
  vaccineQuestionDetail : base + 'vaccineQuestion/detail.do', //获取咨询详情

  getJsSdkConfig: '/passport/wx/getJsSdkConfig.do' ,// 微信配置

  insAccesslog: ins + 'accesslog/add.do', //用户跳转保险页面日志记录接口
  insList: ins + 'myorder/list.do', //用户保险单查询接口
  insDetail: ins +'myorder/detail.do', //保险详情接口
  findPartnerUrlById: insurance + 'findPartnerUrlById.do', //根据保险产品id获取详情url

  getParaReactionBySubId: parareaction + 'getParaReactionBySubId.do', //获取接种异常反应接口
  addParaReaction: parareaction + 'addParaReaction.do', //新增接种异常反应接口

  addBiteRecord: dogBite + 'addBiteRecord.do', //犬伤记录添加接口


  takeNumberByLinkman: '/his/wx/inoculateUser/takeNumberByLinkman.do', // 根据联系人取号接口
  getTakeNumInfo: '/his/wx/inoculateUser/workOrderDetail.do' ,  //取号信息相关

  HKHpvInfo: '/order/hpvBooking/query.do' , //香港九价hpv预约信息

  findHealthModuleList: base + 'specialColumn/findModuleList.do', //获取健康专栏分组
  findHealthArticleList: base + 'specialColumn/findArticleList.do', //获取健康专栏文章列表
  findHealthArticleById: base + 'specialColumn/findArticleById.do', //获取文章详情
  healthLikeArticle: base + 'specialColumn/likeArticle.do', // 健康专栏文章点赞
  findModuleById: base + 'specialColumn/findModuleById.do',  //获取分组信息

  seckillDetail: seckill + 'vaccine/detail.do', //秒杀详情接口
  seckillCheckstock: seckill + 'vaccine/checkstock.do', //库存检测接口
  seckillDetailVo: seckill + 'vaccine/detailVo.do', //秒杀疫苗下单的详情
  submitSeckill: seckill + 'vaccine/subscribe.do' , //秒杀下单接口

  ///catalog
  catalogs: base+'/catalog/list.do', //获取目录列表
  findVaccineByCatalogId: base + '/catalog/vaccines.do', //根据目录id获取疫苗
  findCatalogByVaccineCode: base + '/catalog/findByVaccineCode.do', //根据疫苗code查询目录信息

  healthBookingSearch: healthBooking + '/query.do' ,//根据身份证查询是否有体检预约记录
  healthBookingDepa: healthBooking + '/queryDepartment.do' , //根据城市和体检机构查询体检门诊列表
}



// WEBPACK FOOTER //
// ./src/config/apiConfig.js