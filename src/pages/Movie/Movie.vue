<template>
  <div id="movie">
    <div class="tab-header">
      <div class="tab-item">
        <span :class="['normal',{'active':isHotMovie}]" @click="optionMovieType(1)">正在热映</span>
        <img v-show="isHotMovie" src="./images/triangel.svg" alt />
      </div>
      <div class="tab-item">
        <span :class="['normal',{'active':isNotShowMovie}]" @click="optionMovieType(2)">即将上映</span>
        <img v-show="isNotShowMovie" src="./images/triangel.svg" alt />
      </div>
      <div class="tab-item">
        <span :class="['normal',{'active':isMostAwaited}]" @click="optionMovieType(3)">最受期待</span>
        <img v-show="isMostAwaited" src="./images/triangel.svg" alt />
      </div>
    </div>
    <div class="tab-content" ref="container">
      <div class="panel" v-show="isHotMovie">
        <movie-item :movie-list="hotMovieList"></movie-item>
      </div>
      <div class="panel" v-show="isNotShowMovie">
        <movie-item :movie-list="notShowMovieList"></movie-item>
      </div>
      <div class="panel" v-show="isMostAwaited">
        <movie-item :movie-list="mostAwaitedList"></movie-item>
      </div>
    </div>
  </div>
</template>

<script>
import { getMovieList } from "../../api/index";
import { Indicator } from "mint-ui";
import Index from "element-ui/lib/utils/popup";
import MovieItem from "../../components/MovieItem/MovieItem";
export default {
  name: "Movie",
  components: {
    Index,
    MovieItem
  },
  created() {
    Indicator.open("Loading...");
    var type = this.$route.query.type;
    if (type == 1) {
      this.isHotMovie = true;
      this.isNotShowMovie = false;
      this.isMostAwaited = false;
    } else if (type == 2) {
      this.isHotMovie = false;
      this.isNotShowMovie = true;
      this.isMostAwaited = false;
    } else {
      this.isHotMovie = false;
      this.isNotShowMovie = false;
      this.isMostAwaited = true;
    }
    this.loadMovieList();
  },
  data() {
    return {
      //切换电影选项
      isHotMovie: true,
      isNotShowMovie: false,
      isMostAwaited: false,
      //服务器地址
      server: "http://localhost:3000",
      //热门电影列表
      hotMovieList: [],
      //未上映电影列表
      notShowMovieList: [],
      mostAwaitedList: []
    };
  },
  methods: {
    //加载电影列表
    async loadMovieList() {
      let json = await getMovieList();
      console.log(json);
      json.data.forEach((value, index) => {
        if (new Date() - new Date(value.public_date) >= 0) {
          this.hotMovieList.push(value);
        } else {
          this.notShowMovieList.push(value);
          this.mostAwaitedList.push(value);
        }
      });
      this.hotMovieList.sort((a, b) => {
        return b.score - a.score;
      });
      this.mostAwaitedList.sort((a, b) => {
        return b.wish_num - a.wish_num;
      });
      Indicator.close();
    },
    //改变电影类型
    optionMovieType(flag) {
      if (flag == 2) {
        this.isHotMovie = false;
        this.isNotShowMovie = true;
        this.isMostAwaited = false;
      } else if (flag == 3) {
        this.isHotMovie = false;
        this.isNotShowMovie = false;
        this.isMostAwaited = true;
      } else {
        this.isHotMovie = true;
        this.isNotShowMovie = false;
        this.isMostAwaited = false;
      }
      window.scroll(0, 0);
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#movie {
  width: 100%;
  height: 100%;
  margin-top: 1.6rem;

  .tab-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.2rem;
    width: 100%;
    font-size: 0.3125rem;
    background-color: #47464A;
    color: white;

    .tab-item {
      margin: 0 0.8rem;
      height: 100%;
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      align-items: center;

      .normal {
        opacity: 0.6;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 80%;

        &.active {
          color: #EF4238;
          opacity: 1;
        }
      }

      img {
        height: 0.16rem;
      }
    }
  }

  .tab-content {
    margin: 0 auto;
    margin-top: 1rem;
    font-size: 0.3125rem;
    padding: 0 0.3rem;
    padding-bottom: 1rem;

    .panel {
      width: 100%;

      .item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.2rem 0;
        border-bottom: 0.03rem solid #f1f1f1;
        margin: 0 auto;

        img {
          display: inline-block;
          width: 20%;
        }

        .info {
          width: 68%;
          display: flex;
          flex-flow: column;
          padding: 0.25rem;
          font-size: 0.28rem;
          color: #9d9d9d;

          .name {
            font-weight: 700;
            font-size: 0.345rem;
            padding-bottom: 0.2rem;
            color: #333;
          }

          .type {
            padding-bottom: 0.12rem;
          }

          .people {
            padding-bottom: 0.12rem;

            .number {
              color: #ffb400;
              font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;
              font-weight: 700;
              font-size: 0.315rem;
            }
          }

          .score {
            padding-bottom: 0.12rem;

            .number {
              color: #ffb400;
              font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;
              font-weight: 700;
              font-size: 0.315rem;
            }
          }
        }

        .buy {
          width: 12%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          background-color: #dd2727;
          border-radius: 0.08rem;
          font-size: 0.25rem;
          color: #fff;
        }

        .presell {
          background-color: #2d98f3;
          width: 12%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          border-radius: 0.08rem;
          font-size: 0.25rem;
          color: #fff;
        }
      }
    }
  }
}
</style>
