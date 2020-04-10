<template>
  <div class="search-all">
    <div class="header">
      <div class="search">
        <input type="text" placeholder="搜影片、影院" v-model="name" />
        <span class="icon-search" @click="switchTo('/search?name='+name)"></span>
      </div>
      <div class="item">
        <div class="item-list">
          <div class="title" @click="select(1)">影片({{movieInfo.length}})</div>
          <img v-if="selected==1" src="./images/triangel.svg" alt />
        </div>
        <div class="item-list">
          <div class="title" @click="select(2)">影院({{cinemaInfo.length}})</div>
          <img v-if="selected==2" src="./images/triangel.svg" alt />
        </div>
      </div>
    </div>
    <div class="content">
      <div class="movie-container" v-if="movieInfo.length&&selected==1">
        <movie-item :movie-list="movieInfo"></movie-item>
      </div>
      <div class="cinema-container" v-if="cinemaInfo.length&&selected==2">
        <div
          class="item"
          v-for="(item,index) in cinemaInfo"
          :key="index"
          @click="$router.push({path:'/cinema_detail',query:{cinema_id:item.cinema_id}})"
        >
          <div class="left">
            <div class="name ellipsis">{{item.cinema_name}}</div>
            <div class="address ellipsis">{{item.specified_address}}</div>
            <div class="label-block">
              <span>小吃</span>
              <span>4D厅</span>
              <span>杜比全景声厅</span>
              <span>巨幕厅</span>
            </div>
          </div>
          <!--<div class="right">-->
          <!--<div class="price-block"><span class="price">23</span>元起</div>-->
          <!--</div>-->
        </div>
      </div>
      <div class="tips" v-if="(!movieInfo.length&&selected==1)||(!cinemaInfo.length&&selected==2)">
        <span class="icon icon-empty-content"></span>
        <span class="text">暂时木有内容呀</span>
      </div>
    </div>
  </div>
</template>

<script>
import { matchCinemaByName, matchMovieByName } from "../../api/index";
import MovieItem from "../../components/MovieItem/MovieItem";
export default {
  name: "Search",
  components: {
    MovieItem
  },
  data() {
    return {
      name: "",
      movieInfo: [],
      cinemaInfo: [],
      selected: 1,
      //服务器地址
      server: "http://localhost:3000"
    };
  },
  created() {
    let url = window.location.href;
    url = decodeURIComponent(url);
    let data = this.parseQueryString(url);
    this.name = data.name;
    console.log(this.name);
    this.findByName();
  },
  watch: {
    async name() {
      if (this.name) {
        let json = await matchMovieByName(this.name);
        if (json.success_code === 200) {
          this.movieInfo = json.data;
        }
        json = await matchCinemaByName(this.name);
        if (json.success_code === 200) {
          this.cinemaInfo = json.data;
        }
      } else {
        this.movieInfo = [];
        this.cinemaInfo = [];
      }
    }
  },
  methods: {
    switchTo(path) {
      this.$router.push(path);
    },
    parseQueryString(url) {
      var index = url.lastIndexOf("?");
      var str = url.substring(index + 1);
      console.log(index);
      console.log(str);
      // var str = url.split("?")[2];
      console.log(str);
      if (str) {
        var iterms = str.split("&");
        let data = {};
        for (var i = 0; i < iterms.length; i++) {
          let arr = iterms[i].split("=");
          data[arr[0]] = arr[1];
        }
        return data;
      }
    },
    findByName() {
      if (this.name) {
        let json = matchMovieByName(this.name);
        if (json.success_code === 200) {
          this.movieInfo = json.data;
        }
        json = matchCinemaByName(this.name);
        if (json.success_code === 200) {
          this.cinemaInfo = json.data;
        }
      } else {
        this.movieInfo = [];
        this.cinemaInfo = [];
      }
    },
    select(id) {
      if (id == 2) {
        this.selected = 2;
      } else {
        this.selected = 1;
      }
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
.search-all {
  margin-top: 1.6rem;
  width: 100%;
  cursor: pointer;

  .header {
    width: 100%;
    height: 2.3rem;
    padding-top: 0.8rem;
    background-color: #47464A;

    .search {
      width: 12.2rem;
      height: 0.6rem;
      flex: 4;
      display: flex;
      align-items: center;
      border-radius: 0.5rem;
      margin: 0 auto;
      padding: 0.2rem;
      background-color: #fff;

      .icon-search {
        font-size: 0.5rem;
        color: #EF4238;
        font-weight: bold;
      }

      input {
        width: 100%;
        border: none;
        outline: none;
        background-color: #fff;
        caret-color: #dd2727;
        text-indent: 0.125rem;
        font-size: 0.3rem !important;
      }
    }

    .item {
      width: 12.6rem;
      height: 1.3rem;
      margin: 0 auto;
      font-size: 0.3rem;
      color: #EF4238;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      .item-list {
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-items: center;

        .title {
          margin-top: 0.6rem;
        }

        img {
          height: 0.16rem;
        }
      }
    }

    .cancel-btn {
      flex: 1;
      font-size: 0.3rem;
      color: #dd2727;
      text-align: center;
    }
  }

  .content {
    width: 20rem;
    margin: 0 auto;
    background: #fff;

    .movie-container {
      width: 100%;
      font-size: 0.3125rem;
      padding: 0.3rem;
      box-sizing: border-box;
      border-top: 0.04rem solid #f1f1f1;
      display: flex;
      flex: 2;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 0.3rem;
        padding-bottom: 0.25rem;
        border-bottom: 0.03rem solid #f1f1f1;
      }

      .item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.25rem;
        border-bottom: 0.03rem solid #f1f1f1;

        img {
          display: inline-block;
          width: 20%;
          border-radius: 0.1rem;
        }

        .info {
          width: 68%;
          display: flex;
          flex-flow: column;
          padding: 0.25rem;
          font-size: 0.25rem;
          color: #9d9d9d;

          .name {
            font-weight: bolder;
            padding-bottom: 0.2rem;
            color: #333;
          }

          .type {
            padding-bottom: 0.2rem;
          }

          .people {
            padding-bottom: 0.2rem;

            .number {
              color: #ffb400;
            }
          }

          .score {
            padding-bottom: 0.2rem;

            .number {
              color: #ffb400;
            }
          }
        }

        .buy {
          width: 12%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          background-color: #dd2727;
          border-radius: 24%;
          font-size: 0.25rem;
          color: #fff;
        }

        .presell {
          background-color: #2d98f3;
          width: 12%;
          padding: 0.16rem 0.12rem;
          text-align: center;
          border-radius: 20%;
          font-size: 0.25rem;
          color: #fff;
        }
      }
    }

    .cinema-container {
      width: 100%;
      font-size: 0.3125rem;
      padding: 0.3rem;
      box-sizing: border-box;
      border-top: 0.04rem solid #f1f1f1;

      .title {
        font-size: 0.3rem;
        padding-bottom: 0.25rem;
        border-bottom: 0.03rem solid #f1f1f1;
      }

      .item {
        box-sizing: border-box;
        padding: 0.25rem;
        height: 2.9rem;
        width: 100%;
        border-bottom: 0.03rem solid #f1f1f1;

        .left {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .name {
            font-size: 0.52rem;
            margin-bottom: 0.4rem;
            font-weight: 700;
          }

          .address {
            font-size: 0.28rem;
            line-height: 0.3rem;
            color: #666;
            margin-bottom: 0.25rem;
          }

          .label-block {
            display: flex;

            span {
              height: 0.36rem;
              padding: 0.14rem;
              margin-right: 0.2rem;
              font-size: 0.32rem;
              border: 0.01rem solid #87c4f5;
              border-radius: 0.1rem;
              color: #fff;
              background-color: #87c4f5;
            }
          }
        }

        .right {
          width: 20%;
          text-align: center;

          .price-block {
            color: #dd2727;

            .price {
              font-size: 0.38rem;
            }
          }
        }
      }
    }

    .tips {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;
      font-size: 0.28rem;
      padding-top: 4rem;
      border-top: 0.04rem solid #f1f1f1;

      .icon {
        font-size: 1.6rem;
        margin-bottom: 0.25rem;
      }

      .text {
        color: #ccc;
      }
    }
  }
}
</style>
