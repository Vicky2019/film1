<template>
  <div id="home">
    <div class="main">
      <div class="panel">
        <div class="header">
          <span class="red-name">正在热映({{hotMovieList.length}}部)</span>
          <span
            v-if="hotMovieList.length"
            class="more"
            style="color:#dd2727;"
            @click="$router.push({path:'/movie',query:{type:1}})"
          >
            全部
            <span class="icon-more"></span>
          </span>
        </div>
        <div class="body">
          <div class="item" v-for="(item,index) in hotMovieList.slice(0, 4)" :key="index">
            <img
              :src="'https://images.weserv.nl/?url='+item.poster.substring(7)"
              alt
              @click="$router.push({path:'/detail_movie',query:{movie_id:item.movie_id}})"
            />
            <div style="position: relative">
              <div class="describe">
                <span class="name ellipsis">{{item.name}}</span>
                <span class="score" v-if="item.score">
                  <i class="interger">{{item.score.toFixed(1).split('.')[0]}}</i>.
                  <i class="fraction">{{item.score.toFixed(1).split('.')[1]}}</i>
                </span>
              </div>
            </div>
            <div
              class="buy"
              @click="$router.push({path:'/cinema_select',query:{movie_id:item.movie_id}})"
            >购票</div>
          </div>
          <div class="tips" v-if="!hotMovieList.length">
            <span class="icon icon-empty-content"></span>
            <span class="text">暂时木有内容呀</span>
          </div>
        </div>
      </div>
      <div class="panel">
        <div class="header">
          <span class="blue-name">即将上映({{notShowMovieList.length}}部)</span>
          <span
            v-if="notShowMovieList.length"
            class="more"
            style="color:#2d98f3;"
            @click="$router.push({path:'/movie',query:{type:2}})"
          >
            全部
            <span class="icon-more"></span>
          </span>
        </div>
        <div class="body">
          <div class="item" v-for="(item,index) in notShowMovieList.slice(0,4)" :key="index">
            <!-- <img :src="server+item.poster" alt="" @click="$router.push({path:'/movie_detail',query:{movie_id:item.movie_id}})"> -->
            <img
              :src="'https://images.weserv.nl/?url='+item.poster.substring(7)"
              alt
              @click="$router.push({path:'/detail_movie',query:{movie_id:item.movie_id}})"
            />
            <div style="position: relative">
              <div class="peopleNumber">
                <span
                  class="number"
                  v-if="item.wish_num"
                  style="font-family: PingFangSC-Regular,Hiragino Sans GB,sans-serif;font-size: .3rem;font-weight: 600"
                >{{item.wish_num}}</span>
                <span v-if="item.wish_num">人想看</span>
                <span class="number" v-else>暂无想看</span>
              </div>
            </div>
            <div class="presell">
              <div class="name ellipsis">{{item.name}}</div>
              <div class="info">
                <span
                  class="date"
                >{{item.public_date.split('-')[1]}}月{{item.public_date.split('-')[2]}}日</span>
                <span
                  class="btn"
                  @click="$router.push({path:'/select_cinema',query:{movie_id:item.movie_id}})"
                >预售</span>
              </div>
            </div>
          </div>
          <div class="tips" v-if="!notShowMovieList.length">
            <span class="icon icon-empty-content"></span>
            <span class="text">暂时木有内容呀</span>
          </div>
        </div>
      </div>
    </div>
    <div class="aside">
      <div class="most-expect-wrapper">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-more">
              <span @click="$router.push({path:'/movie',query:{type:3}})" class="textcolor_orange">
                <span>查看完整榜单</span>
                <span class="icon-more"></span>
              </span>
            </span>
            <span class="panel-title">
              <span class="textcolor_orange">
                <h2>最受期待</h2>
              </span>
            </span>
          </div>
          <div class="panel-content">
            <ul class="ranking-wrapper ranking-mostExpect">
              <li
                class="ranking-item"
                v-for="(item,index) in mostAwaited.slice(0, 3)"
                :key="index"
              >
                <div class="ranking-left">
                  <i class="ranking-icon"></i>
                  <img
                    class="ranking-img default-img"
                    :src="'https://images.weserv.nl/?url='+item.poster.substring(7)"
                    @click="$router.push({path:'/detail_movie',query:{movie_id:item.movie_id}})"
                  />
                </div>
                <div class="ranking-right">
                  <div class="ranking-right-main">
                    <span class="ranking-moive-name">{{item.name}}</span>

                    <p class="ranking-release-time">上映时间：{{item.show_date}}</p>

                    <p class="ranking-wish">
                      <span class="stonefont">{{item.wish_num}}</span>人想看
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMovieList } from "../../api/index";
import { Indicator } from "mint-ui";
import Swiper from "swiper";
import "swiper/dist/css/swiper.min.css";
export default {
  name: "Home",
  data() {
    return {
      //是否显示头部搜索背景颜色
      headerActive: false,
      //服务器地址
      server: "http://localhost:3000",
      //热门电影列表
      hotMovieList: [],
      //未上映电影列表
      notShowMovieList: [],
      mostAwaited: []
    };
  },
  created() {
    Indicator.open("Loading...");
    this.loadMovieList();
  },
  mounted() {
    new Swiper(".swiper-container", {
      autoplay: true,
      loop: true
      // 如果需要分页器
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable:true
      // }
    });
    window.addEventListener("scroll", this.handleScroll);
  },
  methods: {
    //处理滚动
    handleScroll() {
      window.pageYOffset > (window.innerWidth * 80) / 360
        ? (this.headerActive = true)
        : (this.headerActive = false);
    },
    //加载电影列表
    async loadMovieList() {
      let json = await getMovieList();
      console.log(json)
      json.data.forEach((value, index) => {
        if (new Date() - new Date(value.public_date) >= 0) {
          this.hotMovieList.push(value);
        } else {
          this.notShowMovieList.push(value);
          this.mostAwaited.push(value);
        }
      });
      console.log(this.hotMovieList)
      this.hotMovieList.sort((a, b) => {
        return b.score - a.score;
      });
      this.mostAwaited.sort((a, b) => {
        return b.wish_num - a.wish_num;
      });
      Indicator.close();
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
.mint-indicator-wrapper {
    z-index: 1000 !important;
  }
.mint-indicator-mask {
    z-index: 1000 !important;
}
#home {
  width: 23.8rem;
  margin: 0 auto;
  height: 100%;
  margin-top: 1.6rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  .main {
    width: 15rem;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    padding-top: 0.25rem;
    padding-bottom: 0.8rem;
    position: relative;
    top: -0.25rem;
    background-color: #fff;
    z-index: 998;

    .panel {
      width: 15rem;
      font-size: 0.3125rem;
      margin-top: 1.2rem;
      padding: 0.1rem 0.25rem;

      .header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 0.125rem 0.2rem;

        .red-name {
          flex: 1;
          color: #dd2727;
          font-size: 0.52rem;
          font-weight: 400;
        }

        .blue-name {
          flex: 1;
          color: #2d98f3;
          font-size: 0.52rem;
          font-weight: 400;
        }

        .more {
          flex: 1;
          text-align: right;
          vertical-align: middle;
          font-size: 0.28rem;

          .icon-more {
            font-weight: 800;
          }
        }
      }

      .body {
        display: flex;
        flex: 4;
        flex-wrap: wrap;
        margin: -0.58rem 0 0 -0.5rem;

        .item {
          width: 3.2rem;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          margin: 0.6rem 0 0 0.6rem;
          display: inline-block;
          vertical-align: top;

          img {
            height: 4.4rem;
            width: 100%;
            vertical-align: bottom;
          }

          .describe {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 0.08rem;
            height: 0.4rem;
            box-sizing: border-box;
            background-color: rgba(0, 0, 0, 0.4);

            .name {
              color: #fff;
              font-size: 0.32rem;
              flex: 6;
              box-sizing: border-box;
              width: 100%;
              font-weight: 600;
            }

            .score {
              color: #ffb400;
              flex: 2;
              font-family: PingFangSC-Regular, Hiragino Sans GB, sans-serif;
              font-weight: 700;

              .interger {
                font-size: 0.3rem;
              }

              .fraction {
                font-size: 0.25rem;
              }
            }
          }

          .buy {
            height: 0.6rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.25rem;
            background-color: #dd2727;
            color: #fff;
          }

          .peopleNumber {
            color: #ffb400;
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;
            align-items: center;
            padding: 0 0.08rem;
            height: 0.4rem;
            background-color: rgba(0, 0, 0, 0.4);
            font-size: 0.25rem;
            box-sizing: border-box;
          }

          .presell {
            height: 1rem;
            width: 100%;
            font-size: 0.25rem;

            .name {
              font-weight: 600;
              font-size: 0.25rem;
              padding: 0.1rem 0;
              width: 100%;
            }

            .info {
              width: 100%;
              height: 0.6rem;
              font-size: 0.25rem;
              font-weight: lighter;
              display: flex;
              flex-direction :row;
              justify-content: space-between;
              align-items: center;

              .btn {
                text-align: center;
                font-size: 0.25rem;
                color: #fff;
                width: 50%;
                box-sizing: border-box;
                padding: 0.12rem 0;
                background-color: #2d98f3;
                border-radius: 0.1rem;
                
              }
            }
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
          background-color: #f7f7f7;
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
    }

    .panel + .panel {
      padding-top: 0.25rem;
    }
  }

  .aside {
    width: 7.2rem;

    .most-expect-wrapper {
      margin-top: 1.6rem;

      .panel {
        margin: 0;

        .panel-header {
          overflow: hidden;
          height: 0.74rem;
          line-height: 0.52rem;

          .panel-more {
            font-size: 0.28rem;
            line-height: 0.32rem;
            float: right;
            margin-top: 0.2rem;

            .textcolor_orange {
              color: #ffb400 !important;
            }

            .icon-more {
              font-weight: 800;
            }
          }

          .panel-title {
            font-size: 0.52rem;
            color: #ffb400;

            .textcolor_orange {
              color: #ffb400 !important;

              h2 {
                display: inline;
                font-size: 0.52rem;
                font-weight: 400;
              }
            }
          }
        }

        .panel-content {
          overflow: hidden;
          width: 100%;

          .ranking-wrapper {
            width: 100%;
            overflow: hidden;

            .ranking-item {
              width: 7.16rem;
              overflow: hidden;
              border: 0.02rem solid #efefef;
              position: relative;
              float: left;
              margin-top: 0.4rem;
              margin-bottom: 0.4rem;
              cursor: pointer;

              .ranking-left {
                width: 2.8rem;
                height: 3.88rem;
                float: left;
                position: relative;

                .ranking-img {
                  width: 100%;
                  height: 3.88rem;
                }
              }

              .ranking-right {
                height: 3.88rem;
                line-height: 3.88rem;
                padding-left: 0.2rem;
                overflow: hidden;

                .ranking-right-main {
                  display: inline-block;
                  line-height: 1;
                  vertical-align: middle;
                  margin-top: 1.14rem;
                  width: 4rem;
                  height: 1.6rem;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;

                  .ranking-moive-name {
                    font-size: 0.36rem;
                    color: #333;
                  }

                  .ranking-release-time {
                    color: #999;
                    font-size: 0.3rem;
                  }

                  .ranking-wish {
                    font-size: 0.28rem;
                    color: #ffb400;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
