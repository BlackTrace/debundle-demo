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

import baseCfg from '../../config/baseConfig'
import { setTitleHack } from '../../common/setTitle';
export default {
  data () {
    return {
      moduleName:'',
      healthArticle:{
        list:[],
        params: {
          offset: 0,
          limit: 10
        },
        noMoreData: false,
        isLoadingMore: false
      }
    }
  },
  created(){
    this.findModuleById();
  },
  methods:{
    /**
     * 加载更多
     */
    loadMore() {
      let _this = this;
      if (this.healthArticle.noMoreData) {
        return;
      }
      if(!this.healthArticle.isLoadingMore){
        this.healthArticle.isLoadingMore = true;
        this.healthArticle.params.offset = this.healthArticle.params.offset + this.healthArticle.params.limit;
        this.findHealthArticleList(function(data){
          if( data.length > 0){
            _this.healthArticle.isLoadingMore = false;
          }
        });
      }

    },

    /**
     * 获取健康专栏模块下文章列表
     * @param callback 回调函数
     */
    findHealthArticleList(callback){
      let params = {
        offset: this.healthArticle.params.offset,
        limit: this.healthArticle.params.limit,
        moduleId:this.$route.query.moduleId
      }
      this.$axios.get(this.$aipConfig.findHealthArticleList,{params:params}).then((res) => {
        let list = res.data.data.rows;
        for ( let i in list) {
          var item = list[i];
          item.createTime = moment(item.createTime).format("YYYY-MM-DD");
        }
        this.healthArticle.list = this.healthArticle.list.concat(list);
        if (list.length < this.healthArticle.params.limit) {
          this.healthArticle.noMoreData = true;
        }
        if(callback) callback(res.data.data.rows);
      });
    },



    toHealthArticle(item){
      if(item.url && item.url!=''){
        window.location.href = item.url;
      }else{
        this.$router.push({ path: '/healthArticle',query: { id: item.id}});
      }
    },

    findModuleById(){
      this.$axios.get(this.$aipConfig.findModuleById,{params:{id: this.$route.query.moduleId}}).then((res) => {
        this.moduleName = res.data.data.name;
        setTitleHack(this.moduleName);
        this.callShare();
        this.findHealthArticleList();
        window.addEventListener('scroll', this.onScroll);
      });
    },

    /**
     * 滑动触发函数
     */
    onScroll() {
      var clientHeight=document.documentElement.clientHeight; //document.documentElement获取数据
      var scrollTop=document.documentElement.scrollTop; //document.documentElement获取数据
      var scrollHeight=document.documentElement.scrollHeight;//document.documentElement获取数据
      if(clientHeight+scrollTop+1>=scrollHeight){
        this.loadMore();
      }

    },

    callShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?healthArticleList?moduleId=' + this.$route.query.moduleId;
      shareInfo.title = this.moduleName;
      shareInfo.desc = '必看好文';
      this.$wxShare(shareInfo)
    }


  },
  destroyed(){
    window.removeEventListener('scroll', this.onScroll);//监听页面滚动事件
  }
}



// WEBPACK FOOTER //
// ./src/pages/health/healthArticleList.vue