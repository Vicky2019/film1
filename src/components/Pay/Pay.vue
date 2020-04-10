<template>
  <div id="pay">
    <div class="order-info">
      <div class="time-down">
        <div class="title">请在</div>
        <div class="time">
          <div class="minute">
            <span>{{countdown_m_b}}</span>
            <span>{{countdown_m_s}}</span>
          </div>
          <p>:</p>
          <div class="second">
            <span>{{countdown_s_b}}</span>
            <span>{{countdown_s_s}}</span>
          </div>
        </div>
        <div class="title">内完成支付，超时订单会自动取消</div>
      </div>
      <div class="order-num">
        <span class="left icon-shop"></span>
        <div class="right">
          <div class="total">¥{{Number(this.$cookies.get('total_price')).toFixed(2)}}</div>
          <div class="num">订单编号：{{this.$cookies.get('order_num')}}</div>
        </div>
      </div>
    </div>
    <div class="pay-type">
      <div class="wechat type">
        <span class="icon icon-wechat"></span>
        <p>微信支付</p>
        <span
          :class="[{'icon-circle-selected-fill':selectPayType},{'icon-circle-unselect':!selectPayType}]"
          @click="selectPayType?selectPayType:selectPayType=!selectPayType"
        ></span>
      </div>
      <div class="alipay type">
        <span class="icon icon-alipay"></span>
        <p>支付宝</p>
        <span
          :class="[{'icon-circle-selected-fill':!selectPayType},{'icon-circle-unselect':selectPayType}]"
          @click="!selectPayType?selectPayType:selectPayType=!selectPayType"
        ></span>
      </div>
      <div class="bottom">
        <div class="pay-btn" @click="handlePay">确认支付</div>
      </div>
    </div>
  </div>
</template>

<script>
import { order, getScheduleById, updateScheduleSeat } from "../../api/index";
import { Indicator, MessageBox, Toast } from "mint-ui";
export default {
  name: "Pay",
  data() {
    return {
      scheduleInfo: {},
      seatInfo: [],
      countdown_m_b: "",
      countdown_m_s: "",
      countdown_s_b: "",
      countdown_s_s: "",
      selectPayType: true, //微信
      timer: ""
    };
  },
  created() {
    Indicator.open("Loading...");
    this.loadInfo();
    if (this.$cookies.get("countdown_m") && this.$cookies.get("countdown_m")) {
      if (!this.$cookies.get("countdown_m")[1]) {
        this.countdown_m_s = Number(this.$cookies.get("countdown_m")[0]);
        this.countdown_m_b = 0;
      }
      if (!this.$cookies.get("countdown_s")[1]) {
        this.countdown_s_s = Number(this.$cookies.get("countdown_s")[0]);
        this.countdown_s_b = 0;
      }
      this.countdown_m_s = Number(this.$cookies.get("countdown_m")[1]);
      this.countdown_m_b = Number(this.$cookies.get("countdown_m")[0]);
      this.countdown_s_s = Number(this.$cookies.get("countdown_s")[1]);
      this.countdown_s_b = Number(this.$cookies.get("countdown_s")[0]);
    }
    this.timer = setInterval(() => {
      if (this.countdown_s_s !== 0) {
        this.countdown_s_s -= 1;
      } else {
        if (this.countdown_s_b !== 0) {
          this.countdown_s_b -= 1;
          this.countdown_s_s -= 1;
          this.countdown_s_s = 9;
        } else {
          if (this.countdown_m_s !== 0) {
            this.countdown_m_s -= 1;
            this.countdown_s_b = 5;
            this.countdown_s_s -= 1;
            this.countdown_s_s = 9;
          } else {
            if (this.countdown_m_b !== 0) {
              this.countdown_m_b -= 1;
              this.countdown_m_s = 1;
              this.countdown_s_b = 5;
              this.countdown_s_s -= 1;
              this.countdown_s_s = 9;
            } else {
              clearInterval(this.timer);
              this.back();
            }
          }
        }
      }
    }, 1000);
  },
  methods: {
    async loadInfo() {
      let json = await getScheduleById(this.$route.query.schedule_id);
      if (json.success_code === 200) {
        this.scheduleInfo = json.data;
        this.seatInfo = this.scheduleInfo.seat_info;
        this.seatInfo = JSON.parse(this.seatInfo);
      }
      Indicator.close();
    },
    async back() {
      this.$cookies.remove("countdown_m");
      this.$cookies.remove("countdown_s");
      this.$cookies.remove("order_num");
      this.$cookies.remove("total_price");
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
        this.$cookies.remove("order_phone");
        clearInterval(this.timer);
        Toast({
          message: "解除座位锁定成功",
          position: "middle",
          duration: 2000
        });
        this.$router.go(-2);
      }
    },
    async handlePay() {
      let info;
      if (this.selectPayType) {
        info =
          "您的微信将支付￥" +
          Number(this.$cookies.get("total_price")).toFixed(2) +
          "元";
      } else {
        info =
          "您的支付宝将支付￥" +
          Number(this.$cookies.get("total_price")).toFixed(2) +
          "元";
      }
      MessageBox.confirm(info, "支付提示").then(async action => {
        if (action === "confirm") {
          let seatArr = [];
          if (this.$cookies.get("seat_1")) {
            seatArr.push(Number(this.$cookies.get("seat_1")));
          }
          if (this.$cookies.get("seat_2")) {
            seatArr.push(Number(this.$cookies.get("seat_2")));
          }
          if (this.$cookies.get("seat_3")) {
            seatArr.push(Number(this.$cookies.get("seat_3")));
          }
          if (this.$cookies.get("seat_4")) {
            seatArr.push(Number(this.$cookies.get("seat_4")));
          }
          let json = await order(
            this.$cookies.get("user_id"),
            this.$route.query.schedule_id,
            this.$cookies.get("order_phone"),
            new Date().getFullYear() +
              "-" +
              (Number(new Date().getMonth()) + 1) +
              "-" +
              new Date().getDate(),
            seatArr.length,
            this.$cookies.get("total_price"),
            JSON.stringify(seatArr),
            this.selectPayType ? 0 : 1
          );
          if (json.success_code === 200) {
            MessageBox.alert(
              "您的取票码为:" + json.data.phone_code,
              "支付成功"
            );
          }
          this.$cookies.remove("seat_1");
          this.$cookies.remove("seat_2");
          this.$cookies.remove("seat_3");
          this.$cookies.remove("seat_4");
          this.$cookies.remove("seat_count");
          this.$cookies.remove("order_phone");
          this.$cookies.remove("countdown_m");
          this.$cookies.remove("countdown_s");
          this.$cookies.remove("order_num");
          this.$cookies.remove("total_price");
          clearInterval(this.timer);
          this.$router.push("/home");
        }
      });
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#pay {
  width: 100%;
  color: #000;
  font-size: 0.3125rem;
  margin: 0 auto;
  margin-top: 1.6rem;
  padding-bottom:1.6rem;
  background-color: #F8F8F8;

  .order-info {
    width: 1200px;
    margin: 0 auto;
    height: 3rem;

    .time-down {
      height: 45px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      background-color: #fff;
      box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.1);

      .title {
        padding: 0.2rem 0;
        font-size: 0.28rem;
      }

      .time {
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          font-size: 0.25rem;
          display: inline-block;
          text-align: center;
          line-height: 0.36rem;
          width: 0.36rem;
          height: 0.36rem;
          background-color: #333;
          color: #fff;

          &:first-child {
            margin-right: 0.12rem;
          }
        }

        p {
          padding: 0 0.12rem;
        }
      }
    }

    .order-num {
      display: flex;
      justify-content: left;
      align-items: center;
      margin-top: 0.4rem;
      height: 70px;
      background-color: #fff;
      box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.1);

      .left {
        font-size: 1rem;
        margin-left: 10px;
        margin-right: 10px;
      }

      .right {
        display: flex;
        flex-flow: column;

        .total {
          font-size: 0.46rem;
          margin-bottom: 0.21rem;
        }

        .num {
          font-size: 0.28rem;
          letter-spacing: 0.02rem;
        }
      }
    }
  }

  .pay-type {
    width: 1200px;
    margin: 0 auto;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    position:relative;
    height:190px;

    .type {
      padding: 0.25rem 0.3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      border-bottom: 0.01rem solid #f1f1f1;
      background-color: #fff;

      span {
        font-size: 0.6rem;
      }

      p {
        position: absolute;
        left: 1.2rem;
      }
    }

    .bottom {
      width: 2.4rem;
      padding: 0.25rem;
      box-sizing: border-box;
      position:absolute;
      right:0;
      bottom:0;

      .pay-btn {
        width: 100%;
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
}
</style>
