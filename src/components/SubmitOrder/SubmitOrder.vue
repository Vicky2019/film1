<template>
  <div id="submit-order">
    <div class="top">
      <span class="icon-time"></span>
      <span class="time">请在{{countdownM | timeFilter}}分钟{{countdownS | timeFilter}}秒内完成支付</span>
    </div>
    <div class="content">
      <div class="tips">
        <p class="title">购票须知</p>
        <div class="intro">
          <p>1.请确认场次和时间无误，购买成功后将不予以退还</p>
          <p>2.由于设备故障等不可抗力因素，存在少量场次取消的情况，会进行退票退款</p>
          <p>3.由于影院系统不稳定等因素，存在出票失败的情况，会进行退款</p>
          <p>4.购票成功后，会收到取票码</p>
          <p>5.下单即代表你同意我们的用户服务协议</p>
        </div>
      </div>
      <div class="phone-container">
        <div class="phone">
          <label>手机号</label>
          <el-input v-model="phone" clearable></el-input>
        </div>
        <div class="text">提示：手机号用于生成订单，并以短信方式将取票码发送到手机上</div>
      </div>
    </div>
    <div class="text">不支持退票、改签</div>
    <table class="plist">
      <thead>
        <tr>
          <th>影片</th>
          <th>时间</th>
          <th>影院</th>
          <th>座位</th>
        </tr>
      </thead>
      <tbody>
        <tr class>
          <td class="movie-name">{{movieInfo.name}}</td>
          <td class="showtime">{{scheduleInfo.show_date | dateFilter}} {{scheduleInfo.show_time}}</td>
          <td class="cinema-name">{{cinemaInfo.cinema_name}}</td>
          <td>
            <span class="hall">{{scheduleInfo.hall_name}}</span>
            <span
              class="seat"
              v-if="this.$cookies.get('seat_1')"
            >{{formatSeatInfo(Number(this.$cookies.get('seat_1')))}}</span>
            <span
              class="seat"
              v-if="this.$cookies.get('seat_2')"
            >{{formatSeatInfo(Number(this.$cookies.get('seat_2')))}}</span>
            <span
              class="seat"
              v-if="this.$cookies.get('seat_3')"
            >{{formatSeatInfo(Number(this.$cookies.get('seat_3')))}}</span>
            <span
              class="seat"
              v-if="this.$cookies.get('seat_4')"
            >{{formatSeatInfo(Number(this.$cookies.get('seat_4')))}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="bottom">
      <div class="total">
        应支付
        <span
          class="money"
        >{{(Number(scheduleInfo.price)*Number(this.$cookies.get('seat_count'))).toFixed(2)}}</span>
        <span>元</span>
      </div>
      <div class="submit-btn" @click="handleSubmitOrder">提交订单</div>
    </div>
  </div>
</template>

<script>
import {
  getMovieDetail,
  getCurrentCinemaDetail,
  getScheduleById,
  getUserInfo,
  updateScheduleSeat
} from "../../api/index";
import Vue from "vue";
import { Toast, Indicator, MessageBox } from "mint-ui";
import { Input } from "element-ui";
Vue.use(Input);
export default {
  name: "SubmitOrder",
  data() {
    return {
      cinemaInfo: {},
      movieInfo: {},
      scheduleInfo: {},
      seatInfo: "",
      phone: "",
      countdownM: 14,
      countdownS: 59,
      timer: ""
    };
  },
  created() {
    Indicator.open("Loading...");
    this.loadInfo();
    this.timer = setInterval(() => {
      this.countdownS = Number(this.countdownS);
      this.countdownM = Number(this.countdownM);
      if (this.countdownS === 0) {
        if (this.countdownM !== 0) {
          this.countdownM -= 1;
          this.countdownS = 59;
        } else {
          clearInterval(this.timer);
          this.backSeatInfo();
        }
      } else {
        this.countdownS -= 1;
      }
    }, 1000);
  },
  methods: {
    //加载信息
    async loadInfo() {
      if (
        this.$route.query.cinema_id &&
        this.$route.query.movie_id &&
        this.$route.query.schedule_id &&
        this.$cookies.get("user_id")
      ) {
        let json = await getCurrentCinemaDetail(this.$route.query.cinema_id);
        if (json.success_code === 200) {
          this.cinemaInfo = json.data;
        }
        json = await getMovieDetail(this.$route.query.movie_id);
        if (json.success_code === 200) {
          this.movieInfo = json.data[0];
        }
        json = await getScheduleById(this.$route.query.schedule_id);
        if (json.success_code === 200) {
          this.scheduleInfo = json.data;
          this.seatInfo = this.scheduleInfo.seat_info;
          this.seatInfo = JSON.parse(this.seatInfo);
        }
        console.log(this.cinemaInfo);
        json = await getUserInfo(this.$cookies.get("user_id"));
        if (json.success_code === 200) {
          this.phone = json.data.phone;
        }
      }
      Indicator.close();
    },
    //座位信息
    formatSeatInfo(seatNum) {
      if (seatNum % 10 === 0) {
        return seatNum / 10 + "排" + 10 + "座";
      } else {
        return parseInt(seatNum / 10) + 1 + "排" + (seatNum % 10) + "座";
      }
    },
    //回退座位信息
    async backSeatInfo() {
      let currentIndex;
      if (this.$cookies.get("seat_1")) {
        this.seatInfo.forEach((value, index) => {
          if (Number(this.$cookies.get("seat_1")) === value) {
            currentIndex = index;
          }
        });
        this.seatInfo.splice(currentIndex, 1);
      }
      if (this.$cookies.get("seat_2")) {
        this.seatInfo.forEach((value, index) => {
          if (Number(this.$cookies.get("seat_2")) === value) {
            currentIndex = index;
          }
        });
        this.seatInfo.splice(currentIndex, 1);
      }
      if (this.$cookies.get("seat_3")) {
        this.seatInfo.forEach((value, index) => {
          if (Number(this.$cookies.get("seat_3")) === value) {
            currentIndex = index;
          }
        });
        this.seatInfo.splice(currentIndex, 1);
      }
      if (this.$cookies.get("seat_4")) {
        this.seatInfo.forEach((value, index) => {
          if (Number(this.$cookies.get("seat_4")) === value) {
            currentIndex = index;
          }
        });
        this.seatInfo.splice(currentIndex, 1);
      }
      let json = await updateScheduleSeat(
        this.$route.query.schedule_id,
        JSON.stringify(this.seatInfo)
      );
      if (json.success_code === 200) {
        this.$cookies.remove("seat_1");
        this.$cookies.remove("seat_2");
        this.$cookies.remove("seat_3");
        this.$cookies.remove("seat_4");
        this.$cookies.remove("seat_count");
        clearInterval(this.timer);
        Toast({
          message: "解除座位锁定成功",
          position: "middle",
          duration: 2000
        });
        this.$router.go(-1);
      }
    },
    //提交订单
    handleSubmitOrder() {
      if (/^1[3|4|5|6|7|8][0-9]{9}$/.test(this.phone)) {
        this.$cookies.set(
          "total_price",
          this.scheduleInfo.price * Number(this.$cookies.get("seat_count"))
        );
        this.$cookies.set("countdown_m", this.countdownM);
        this.$cookies.set("countdown_s", this.countdownS);
        this.$cookies.set(
          "order_num",
          (Number(Math.random()) * 10000000000000).toFixed(0)
        );
        this.$cookies.set("order_phone", this.phone);
        clearInterval(this.timer);
        this.$router.push({
          path: "/pay",
          query: { schedule_id: this.$route.query.schedule_id }
        });
      } else {
        MessageBox.alert("手机格式不正确！");
      }
    }
  },
  filters: {
    dateFilter(date) {
      date = date + "";
      return (
        date.split("-")[0] +
        "年" +
        date.split("-")[1] +
        "月" +
        date.split("-")[2] +
        "日"
      );
    },
    timeFilter(time) {
      if (Number(time) <= 9) {
        return "0" + time;
      } else {
        return time;
      }
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#submit-order {
  width: 24rem;
  color: #000;
  font-size: 0.3125rem;
  margin: 0 auto;
  margin-top: 1.6rem;
  padding-bottom:1.6rem;

  .top {
    height: 2.2rem;
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    background-color: #fff3f3;
    color: #666;

    .icon-time {
      font-size: 1rem;
      margin-right: 0.6rem;
      margin-left: 0.6rem;
    }
  }

  .content {
    background-color: #f1f1f1;

    .phone-container {
      background-color: #fff;
      display: flex;
      flex-flow: column;
      margin-top: 0.12rem;

      /deep/ .phone {
        width: 100%;
        box-sizing: border-box;
        height: 1rem;
        line-height: 1rem;
        display: flex;
        border-bottom: 0.02rem solid #f1f1f1;

        label {
          width: 20%;
          color: #333;
          font-size: 0.3rem;
          height: 1rem;
          display: flex;
          box-sizing: border-box;
          margin-left: 0.3rem;
        }

        .el-input {
          vertical-align: middle;
          width: 80%;
          font-size: 0.375rem;

          .el-input__inner {
            border: none;
            outline: none;
            padding: 0;
            letter-spacing: 0.02rem;
          }
        }
      }

      .text {
        color: #dd2727;
        font-size: 0.25rem;
        line-height: 0.4rem;
        padding: 0.25rem 0.3rem;
        letter-spacing: 0.02rem;
      }
    }

    .tips {
      display: flex;
      flex-flow: column;
      background-color: #fff;
      padding: 0.3rem;

      p {
        margin-bottom: 0.12rem;
        font-size: 0.25rem;
        color: #888;
        line-height: 0.4rem;
        letter-spacing: 0.02rem;
        text-align: justify;
      }

      .title {
        color: #333;
        font-size: 0.3125rem;
        font-weight: 700;
        padding-bottom: 0.25rem;
        border-bottom: 0.02rem solid #f1f1f1;
      }
    }
  }

  .text {
    color: #ffb400;
    font-size:0.2rem;
    margin-left:0.1rem;
    margin-bottom:0.1rem;
  }

  .plist {
    width: 100%;
    border: 0.02rem solid #e5e5e5;
    border-spacing: 0;
    margin-bottom: 1.2rem;

    thead {
      background-color: #f7f7f7;

      th {
        font-size: 0.32rem;
        color: #333;
        width: 25%;
        padding: 0.28rem 0;
        font-weight: 400;
      }
    }

    tbody {
      td {
        text-align: center;
        padding: 0.4rem 0;
        color: #333;
      }

      .movie-name {
        font-size: 0.32rem;
      }

      .showtime {
        font-size: 0.28rem;
        color: #f03d37;
      }

      .cinema-name {
        font-size: 0.28rem;
      }

      .hall {
        display: inline-block;
        font-size: 0.28rem;
        color: #424242;
        font-weight: 700;
        margin-right: 0.2rem;
        vertical-align: top;
      }

      .seat {
        font-size: 0.24rem;
        margin-right: 0.04rem;
      }
    }
  }

  .bottom {
    position: relative;
    height: 2rem;
    box-sizing: border-box;

    .total {
      position:absolute;
      right:0;
      top:0;
      margin-bottom: 0.25rem;
      font-size: 0.28rem;
      padding: 0.12rem 0;
      color: #888;

      .money {
        font-size: 0.3125rem;
        color: #dd2727;
        margin-left: 0.12rem;
      }

      span {
        color: #dd2727;
        font-size: 0.2rem;
        margin-left: 0.12rem;
      }
    }

    .submit-btn {
      width: 1.9rem;
      height: 0.84rem;
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #fe9900;
      color: #fff;
      height: 0.8rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.12rem;
      font-size: 0.28rem;
    }
  }
}
</style>
