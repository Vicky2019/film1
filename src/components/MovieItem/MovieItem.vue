<template>
  <div class="movie">
    <div class="movie-item" v-if="movieList.length" v-for="(item,index) in movieList" :key="index">
      <!-- <img :src="server+item.poster" alt="" @click="$router.push({path:'/movie_detail',query:{movie_id:item.movie_id}})"> -->
      <img
        :src="'https://images.weserv.nl/?url='+item.poster.substring(7)"
        alt
        @click="$router.push({path:'/detail_movie',query:{movie_id:item.movie_id}})"
      />
      <div class="info">
        <div
          class="name"
          @click="$router.push({path:'/detail_movie',query:{movie_id:item.movie_id}})"
        >{{item.name}}</div>
        <div v-if="new Date()-new Date(item.public_date)>=0">
          <div class="descInfo" v-if="item.score">
            评分：
            <span class="number">{{item.score.toFixed(1)}}</span>
          </div>
          <div class="descInfo" v-else>暂无评分</div>
        </div>
        <div v-else>
          <div class="descInfo" v-if="item.wish_num">
            想看：
            <span class="number">{{item.wish_num}}</span>人想看
          </div>
          <div class="descInfo" v-else>暂无想看</div>
        </div>
        <div class="descInfo1">{{item.type}}</div>
        <div class="descInfo ellipsis" style="color:#999;">
          主演：
          <span>{{item.actor}}</span>
        </div>
      </div>
      <span
        class="buy"
        :class="{pre_sell: new Date(item.public_date)-new Date()>0}"
        @click="$router.push({path:'/cinema_select',query:{movie_id:item.movie_id}})"
      >{{new Date(item.public_date)-new Date()>0?'预售':'购票'}}</span>
    </div>
    <div class="tips" v-if="!movieList.length">
      <span class="icon icon-empty-content"></span>
      <span class="text">暂时木有内容呀</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "MovieItem",
  data() {
    return {
      //服务器地址
      server: "http://localhost:3000"
    };
  },
  props: {
    movieList: {
      type: Array,
      require: true,
      default: []
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
.movie {
  width: 70%;
  display: flex;
  flex: 2;
  flex-wrap: wrap;
  margin: 0 auto;

  .movie-item {
    display: flex;
    justify-content: space-around;
    width: 50%;
    align-items: center;
    padding: 0.2rem 0;
    position: relative;

    img {
      display: inline-block;
      width: 3.2rem;
      height: 4.4rem;
    }

    .info {
      width: 68%;
      height: 3.4rem;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      padding: 0.25rem;
      font-size: 0.28rem;
      color: #9d9d9d;

      .name {
        font-weight: 700;
        font-size: 0.52rem;
        padding-bottom: 0.8rem;
        color: #333;
      }

      .descInfo {
        padding-bottom: 0.36rem;
        font-size: 0.32rem;
        color: #ffb400;

        .number {
          color: #ffb400;
          font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;
          font-weight: 700;
          font-size: 0.52rem;
        }
      }

      .descInfo1 {
        padding-bottom: 0.16rem;
        font-size: 0.32rem;
        color: #333;
      }
    }

    .buy {
      background-color: #dd2727;
      border-radius: 0.08rem;
      font-size: 0.25rem;
      color: #fff;
      width: 12%;
      padding: 0.16rem 0.12rem;
      text-align: center;
      position: absolute;
      right: 0.2rem;
      bottom: 0.2rem;
    }

    .pre_sell {
      background-color: #2d98f3;
    }
  }

  .tips {
    width: 14.3rem;
    margin: 0 auto;
    height: 2.4rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    font-size: 0.28rem;
    background-color: #fff;
    margin-top: 1.02rem;

    .icon {
      font-size: 1.6rem;
      margin-bottom: 0.25rem;
    }

    .text {
      color: #ccc;
    }
  }
}
</style>
