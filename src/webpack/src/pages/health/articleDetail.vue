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
  data(){
    return{
      article:'',
      imgUrl:'./static/images/accept.png',
      isLike: false,
      clicked: false
    }
  },

  created(){
    this.getArticleDetail();
    setTitleHack(' ');

  },

  methods: {
    getArticleDetail(){
      this.$axios.get(this.$aipConfig.findHealthArticleById,{params:{id:this.$route.query.id}}).then((res) => {
        let article = res.data.data;
        article.createTime = moment(article.createTime).format("YYYY年MM月DD日");
        if(article.isLiked == 1) this.isLike = true;
        this.article = article;
        this.callShare();
      });
    },

    like(){
      if(!this.isLike){
        this.$axios.get(this.$aipConfig.healthLikeArticle,{params:{articleId:this.$route.query.id}}).then((res) => {
          if(res.data.data) this.isLike = true;
          this.article.allLikeNum = this.article.allLikeNum +1;
          this.clicked = true;
        });
      }

    },

    callShare(){
      let shareInfo = {};
      shareInfo.link = baseCfg.appInfo.shareBaseUrl + '?target=healthArticle?id=' + this.$route.query.id;
      shareInfo.title = this.article.title;
      shareInfo.desc = this.article.digest;
      this.$wxShare(shareInfo)
    }

  }
}



// WEBPACK FOOTER //
// ./src/pages/health/articleDetail.vue