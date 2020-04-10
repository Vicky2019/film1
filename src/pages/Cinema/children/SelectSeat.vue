<template>
  <div id="select-seat">
    <div class="content">
      <div class="seat-block">
        <div class="screen">{{scheduleInfo.hall_name}}银幕</div>
        <div class="center">银幕中央</div>
        <div class="screen-line"></div>
        <div class="row-container">
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
        </div>
        <div class="seat-container">
          <div class="row" v-if="hackReset" v-for="(itemI,indexI) in seatIJ" :key="indexI">
            <span
              class="seat"
              v-for="(itemJ,indexJ) in itemI"
              :key="indexJ"
              :class="{'icon-sold-seat':itemJ===1,'icon-empty-seat':itemJ===0,'icon-selected-seat':itemJ===2}"
              @click.prevent="handleSelectSeat(indexI,indexJ)"
            ></span>
          </div>
        </div>
        <div class="seat-example">
          <div class="example empty-example">
            <span class="icon icon-empty-seat"></span>可选
          </div>
          <div class="example sold-example">
            <span class="icon icon-sold-seat"></span>不可选
          </div>
          <div class="example selected-example">
            <span class="icon icon-selected-seat"></span>已选
          </div>
        </div>
      </div>
      <div class="movie-info">
        <div class="movie-img">
          <img :src="'https://images.weserv.nl/?url='+poster.substring(7)" alt />
          <div class="right">
            <div class="name">{{movieInfo.name}}</div>
            <div class="right-info">
              类型:
              <span>{{movieInfo.type}}</span>
            </div>
            <div class="right-info">
              时长:
              <span>{{movieInfo.movie_long}}</span>
            </div>
          </div>
        </div>
        <div class="cinema-info">
          <div class="right-info">
            影院:
            <span>{{cinemaInfo.cinema_name}}</span>
          </div>
          <div class="right-info">
            影厅:
            <span>{{scheduleInfo.hall_name}}</span>
          </div>
          <div class="right-info">
            场次:
            <span>{{scheduleInfo.show_date|dateFilter}} {{scheduleInfo.show_time}}</span>
          </div>
          <div class="right-info">
            票价:
            <span>￥{{scheduleInfo.price}}/张</span>
          </div>
        </div>
        <div class="bottom">
          <div class="seat">
            座位:
            <span class="title" v-if="!selectedSeat">请点击左侧座位图选择座位</span>
            <div class="selected-seat" v-if="selectedSeat">
              <div class="seat-item" v-for="(item,index) in selectedSeatInfo" :key="index">
                <div class="left">
                  <span class="seat">{{item[0]+1}}排{{item[1]+1}}座</span>
                  <span class="price">{{(scheduleInfo.price).toFixed(2)}}元</span>
                </div>
                <span class="right icon-close" @click="cancelSelectedSeat(item[0],item[1])"></span>
              </div>
            </div>
          </div>
          <span class="btn" v-if="!selectedSeat">请先选座</span>
          <span class="btn active" v-else @click="ensureSeatBtn">确认选座</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast, Indicator} from "mint-ui";
import {
  getMovieDetail,
  getCurrentCinemaDetail,
  getScheduleById,
  updateScheduleSeat
} from "../../../api/index";
export default {
  name: "SelectSeat",
  data() {
    return {
      cinemaInfo: {},
      movieInfo: {},
      scheduleInfo: {},
      seatInfo: "",
      seatCount: 0,
      selectedSeat: false,
      hackReset: true,
      selectedSeatInfo: [],
      seatIJ: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      poster: ""
    };
  },
  created() {
    Indicator.open("Loading...");
    this.loadInfo();
  },
  methods: {
    //加载信息
    async loadInfo() {
      if (
        this.$route.query.cinema_id &&
        this.$route.query.movie_id &&
        this.$route.query.schedule_id
      ) {
        let json = await getCurrentCinemaDetail(this.$route.query.cinema_id);
        if (json.success_code === 200) {
          this.cinemaInfo = json.data;
        }
        json = await getMovieDetail(this.$route.query.movie_id);
        if (json.success_code === 200) {
          this.movieInfo = json.data[0];
        }
        this.poster = this.movieInfo.poster;
        console.log(this.movieInfo);
        console.log(this.cinemaInfo);
        json = await getScheduleById(this.$route.query.schedule_id);
        if (json.success_code === 200) {
          this.scheduleInfo = json.data;
          this.seatInfo = this.scheduleInfo.seat_info;
          if (this.seatInfo) {
            this.seatInfo = JSON.parse(this.seatInfo);
            this.seatInfo.forEach(value => {
              if (value % 10 !== 0) {
                this.seatIJ[parseInt(value / 10)][(value % 10) - 1] = 1;
              } else {
                this.seatIJ[parseInt(value / 10) - 1][9] = 1;
              }
            });
          }
        }
        console.log(this.scheduleInfo);
      }
      Indicator.close();
    },
    //选择座位
    handleSelectSeat(indexI, indexJ) {
      if (this.seatCount === 4 && this.seatIJ[indexI][indexJ] === 0) {
        alert("一次最多选择4个座位哦！");
      } else {
        if (this.seatIJ[indexI][indexJ] === 0) {
          this.seatIJ[indexI][indexJ] = 2;
          this.selectedSeatInfo.push([indexI, indexJ]);
          this.seatCount += 1;
          if (!this.selectedSeat) {
            this.selectedSeat = true;
          }
        } else if (this.seatIJ[indexI][indexJ] === 2) {
          this.seatIJ[indexI][indexJ] = 0;
          this.seatCount -= 1;
          let currentIndex;
          this.selectedSeatInfo.forEach((value, index) => {
            if (indexI === value[0] && indexJ === value[1]) {
              currentIndex = index;
            }
          });
          this.selectedSeatInfo.splice(currentIndex, 1);
          if (this.seatCount === 0) {
            this.selectedSeat = false;
          }
        }
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
      }
    },
    //取消选座
    cancelSelectedSeat(indexI, indexJ) {
      this.seatIJ[indexI][indexJ] = 0;
      this.seatCount -= 1;
      let currentIndex;
      this.selectedSeatInfo.forEach((value, index) => {
        if (indexI === value[0] && indexJ === value[1]) {
          currentIndex = index;
        }
      });
      this.selectedSeatInfo.splice(currentIndex, 1);
      if (this.seatCount === 0) {
        this.selectedSeat = false;
      }
    },
    //确认选座
    async ensureSeatBtn() {
      if (this.$cookies.get("user_id")) {
        if (!this.seatInfo) {
          this.seatInfo = [];
        }
        this.selectedSeatInfo.forEach((value, index) => {
          this.seatInfo.push(value[0] * 10 + value[1] + 1);
          this.$cookies.set(
            "seat_" + (index + 1),
            value[0] * 10 + value[1] + 1
          );
        });
        this.$cookies.set("seat_count", this.selectedSeatInfo.length);
        this.seatInfo = JSON.stringify(this.seatInfo);
        let json = await updateScheduleSeat(
          this.$route.query.schedule_id,
          this.seatInfo
        );
        if (json.success_code === 200) {
          Toast({
            message: "锁定座位成功",
            position: "middle",
            duration: 2000
          });
          this.$router.push({
            path: "/submit_order",
            query: {
              cinema_id: this.$route.query.cinema_id,
              movie_id: this.$route.query.movie_id,
              schedule_id: this.$route.query.schedule_id
            }
          });
        }
      } else {
        this.$router.push("./login");
      }
    }
  },
  filters: {
    dateFilter(props) {
      props = props + "";
      return (
        props.split("-")[0] +
        "年" +
        props.split("-")[1] +
        "月" +
        props.split("-")[2] +
        "日"
      );
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#select-seat {
  width: 100%;
  color: #000;
  font-size: 0.3125rem;
  margin-top: 1.6rem;
  padding-bottom:1.6rem;

  .content {
    width: 24rem;
    height: 6.4rem;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: left;
    position: relative;
    background: #f1f1f1;

    .seat-block {
      margin-top: 0.1rem;
      width: 16.4rem;
      border-right: 0.02rem dashed #999;
      position: relative;

      .screen {
        width: 4rem;
        margin: 0 auto;
        text-align: center;
        background: #dcdcdc;
        font-size: 0.25rem;
        padding: 0.08rem 0;
        border-bottom-left-radius: 0.4rem;
        border-bottom-right-radius: 0.4rem;
      }

      .center {
        font-size: 0.2rem;
        width: 1rem;
        text-align: center;
        padding: 0.08rem 0.1rem;
        margin: 0.6rem auto 0;
        letter-spacing: 0.02rem;
        background-color: #fff;
        color: #888;
        border-radius: 0.12rem;
      }

      .screen-line {
        width: 0;
        height: 4.8rem;
        border: 0.02rem dashed #dcdcdc;
        margin: 0 auto;
      }

      .row-container {
        width: 0.4rem;
        height: 4rem;
        padding: 0.6rem 0;
        position: absolute;
        left: 0;
        top: 1rem;
        background-color: rgba(168, 168, 168, 0.8);
        display: flex;
        flex-flow: column;
        text-align: center;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        border-radius: 0.2rem;
        font-size: 0.25rem;
      }

      .seat-container {
        margin: 0 auto;
        position: absolute;
        left: 4.96rem;
        top: 1.54rem;

        .row {
          margin-bottom: 0.25rem;

          .seat {
            font-size: 0.5rem;
            margin-left: 0.134rem;
          }
        }
      }

      .seat-example {
        position: absolute;
        top: 0.48rem;
        left: 1rem;
        width: 80%;
        margin-left: 5%;
        display: flex;
        justify-content: center;
        align-items: center;

        .example {
          font-size: 0.25rem;
          color: #888;
          margin-right: 0.25rem;
          display: flex;
          justify-content: center;
          align-items: center;

          .icon {
            font-size: 0.3rem;
            margin-right: 0.12rem;
          }
        }
      }
    }

    .movie-info {
      width:7rem;
      margin-top: 0.1rem;
      margin-left: 0.1rem;
      display: flex;
      flex-flow: column;

      .movie-img {
        display: flex;
        flex-direction: row;
        margin-bottom: 0.1rem;

        img {
          width: 2.4rem;
          height: 3.2rem;
          border: 0.04rem solid #fff;
          margin-right: 0.2rem;
          box-shadow: 0 0.04rem 0.14rem 0 hsla(0, 0%, 53%, 0.5);
        }

        .right {
          display: flex;
          flex-direction: column;

          .name {
            font-size: 0.4rem;
            font-weight: 700;
            margin-bottom: 0.28rem;
          }

          .right-info {
            font-size: 0.24rem;
            margin-bottom: 0.08rem;
            color: #999;

            span {
              color: #151515;
            }
          }
        }
      }

      .cinema-info {
        border-bottom: 0.02rem dashed #999;

        .right-info {
          font-size: 0.28rem;
          margin-bottom: 0.1rem;
          color: #999;

          span {
            color: #151515;
          }
        }
      }

      .bottom {
        margin-top:0.1rem;
        display: flex;
        flex-flow: column;
        box-sizing: border-box;

        .seat {
          dispaly:flex;
          flex-direction:row;
          color:#999;
          .title {
            font-size: 0.28rem;
          }

          .selected-seat {
            margin-top:0.2rem;
            margin-left:0.2rem;
            display: flex;
            flex-direction:row;

            .seat-item {
              width: 1.1rem;
              height: 0.6rem;
              background:#fff;
              display: flex;
              box-sizing: border-box;
              justify-content: space-around;
              align-items: center;
              border: 0.02rem solid #f03d37;
              margin-right: 0.25rem;

              &:last-child {
                margin-right: 0;
              }

              .left {
                display: flex;
                flex-flow: column;
                font-size: 0.2rem;

                .seat {
                  color: #666;
                  margin-bottom: 0.12rem;
                }

                .price {
                  color: #dd2727;
                }
              }

              .right {
                font-size: 0.25rem;
              }
            }
          }
        }

        .btn {
          height: 0.6rem;
          width:1.5rem;
          line-height: 0.6rem;
          background-color: #f7dbb3;
          color: #fff;
          text-align: center;
          border-radius: 0.12rem;
          font-size: 0.28rem;
          position:absolute;
          bottom:0.2rem;
          right:0.1rem;

          &.active {
            background-color: #fe9900;
          }
        }
      }
    }
  }
}
</style>
