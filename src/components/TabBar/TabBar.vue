<template>
  <div id="tab">
    <div id="logo" style>
      <img class="log_img" src="./images/logo.png" style="width:2.7rem" />
    </div>
    <div class="city-select" @mouseover="mouseOver" @mouseleave="mouseLeave">
      <div id="location">{{currentCity}}</div>
      <img :src="active" />
    </div>
    <div id="tab-bar">
      <span class="tab-item" @click="switchTo('/home')">
        <span :class="{ on: $route.path.includes('/home') }">首页</span>
      </span>
      <span class="tab-item" @click="switchTo('/movie')">
        <span :class="{ on: $route.path.includes('/movie') }">电影</span>
      </span>
      <span class="tab-item" @click="switchTo('/cinema')">
        <span :class="{ on: $route.path.includes('/cinema') }">影院</span>
      </span>
    </div>
    <span id="search">
      <input type="text" placeholder="搜影片、影院" v-model="name" />
      <span class="icon-search" @click="switchTo('/search?name='+name)"></span>
    </span>
    <div id="myInfo" @mouseover="mouseOver1" @mouseleave="mouseLeave1">
      <img
        class="img-info"
        :class="{ on: $route.path.includes('/my') }"
        src="./images/user.svg"
        alt
      />
      <img class="caret" :src="active1" alt />
      <ul v-if="showMenu" class="user-menu no-login-menu">
        <li v-if="!jsonData.user_id" @click="$router.push('login')">登录</li>
        <li v-if="jsonData.user_id" @click="viewMyOrder">我的订单</li>
        <li v-if="jsonData.user_id" @click="viewUserInfo">基本信息</li>
        <li v-if="jsonData.user_id">退出登录</li>
      </ul>
    </div>
  </div>
</template>

<script>
import maps from "qqmap";
import {Indicator} from 'mint-ui';
import {getUserInfo} from '../../api/index';
export default {
  name: "TabBar",
  data() {
    return {
      //是否显示头部搜索背景颜色
      headerActive: false,
      active: require("./images/address_my.svg"),
      active1: require("./images/address_my.svg"),
      citylocation: null,
      lat: 0,
      lng: 0,
      currentCity: "武穴", // 没有正确得到经纬度时，默认显示杭州吧
      currentCity_detail: "",
      name: "",
      showMenu: false,
      jsonData: {},
      avatar: "http://localhost:3000/images/avatar/userIcon.png"
    };
  },
  created() {
    this.loadUserInfo();
  },
  mounted() {
    this.initGeolocation();
  },
  methods: {
    //加载用户信息
    async loadUserInfo() {
      if (this.$cookies.get("user_id")) {
        Indicator.open("Loading...");
        let json = await getUserInfo(this.$cookies.get("user_id"));
        if (json.success_code === 200) {
          this.jsonData = json.data;
          this.userAvatar();
        } else {
          this.jsonData = {};
        }
        Indicator.close();
      } else {
        this.jsonData = {};
        Indicator.close();
      }
    },
    //用户头像
    userAvatar() {
      if (this.jsonData) {
        this.avatar = "http://localhost:3000" + this.jsonData.avatar;
      } else {
        this.avatar = "http://localhost:3000/images/avatar/userIcon.png";
      }
    },
    //查看个人信息
    viewUserInfo() {
      if (this.$cookies.get("user_id")) {
        this.$router.push("my_info");
      }
    },
    //查看个人订单
    viewMyOrder(flag) {
      if (this.$cookies.get("user_id")) {
        this.$router.push({
          path: "my_order",
          query: { user_id: this.$cookies.get("user_id") }
        });
      } else {
        this.$router.push("login");
      }
    },
    //查看个人电影
    viewMyMovie(flag) {
      if (this.$cookies.get("user_id")) {
        this.$router.push({
          path: "my_movie",
          query: { user_id: this.$cookies.get("user_id"), wish_movie: flag }
        });
      } else {
        this.$router.push("login");
      }
    },
    //查看个人信息
    viewUserInfo() {
      if (this.$cookies.get("user_id")) {
        this.$router.push("my_info");
      }
    },
    //查看个人订单
    viewMyOrder(flag) {
      if (this.$cookies.get("user_id")) {
        this.$router.push({
          path: "my_order",
          query: { user_id: this.$cookies.get("user_id") }
        });
      } else {
        this.$router.push("login");
      }
    },
    mouseOver() {
      this.active = require("./images/address_my1.svg");
    },
    mouseLeave() {
      this.active = require("./images/address_my.svg");
    },
    mouseOver1() {
      this.active1 = require("./images/address_my1.svg");
      this.showMenu = true;
    },
    mouseLeave1() {
      this.active1 = require("./images/address_my.svg");
      this.showMenu = false;
    },
    switchTo(path) {
      this.$router.push(path);
      this.name = "";
    },
    initCityService() {
      var _this = this;
      var city = document.getElementById("location");
      //调用城市服务信息
      this.citylocation = new qq.maps.CityService({
        complete: function(res) {
          city.style.display = "inline";
          // 在pc测试时，会有经纬度负数的情况.....我没找原因=。=，直接处理了下
          if (!res.detail.name) {
            return;
          } else {
            _this.currentCity_detail = res.detail.detail;
            _this.currentCity = res.detail.name.substring(0, 2);
            console.log(_this.currentCity);
          }
        }
      });
      // setError 设置检索失败后的回调函数。
      this.citylocation.setError(function() {
        alert("出错了，没有获得正确的经纬度！！！");
      });
    },
    initGeolocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.initLatLng,
          this.initErro
        );
      }
      // 无法使用getCurrentPosition获取经纬度的情况
      else {
        alert("无法获取位置");
      }
    },
    initLatLng(posi) {
      if (posi) {
        this.lat = posi.coords.latitude;
        this.lng = posi.coords.longitude;
        // 初始化CityService 类
        this.initCityService();
        // 获取地理位置
        this.geolocation_latlng();
      }
    },
    // 使用html5定位时不能获取经纬度的报错信息
    initErro(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("用户拒绝对获取地理位置的请求。");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("位置信息是不可用的。");
          break;
        case error.TIMEOUT:
          alert("请求用户地理位置超时。");
          break;
        case error.UNKNOWN_ERROR:
          alert("未知错误。");
          break;
      }
    },
    geolocation_latlng() {
      if (this.lat != 0 && this.lng != 0) {
        var latLng = new qq.maps.LatLng(this.lat, this.lng);
        this.citylocation.searchCityByLatLng(latLng);
      }
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#tab {
  padding-left: 3.2rem;
  padding-right: 3.2rem;
  height: 1.6rem;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 999;
  border-bottom: 1px solid #f1f1f1;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;

  .city-select {
    width: 1.7rem;
    font-size: 0.3rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    #location {
      margin: auto;
      width: 1rem;
      text-align: center;
    }

    img {
      margin-right: 0.3rem;
      width: 0.24rem;
    }
  }

  #tab-bar {
    height: 100%;
    width: 4.2rem;
    margin-right: 7.6rem;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;

    .tab-item {
      height: 1.6rem;
      width: 1.4rem;
      text-align: center;
      line-height: 1.6rem;
      font-size: 0.4rem;
      color: #333;

      .on {
        display: inline-block;
        height: 100%;
        width: 100%;
        color: white;
        background-color: #EF4238;
      }
    }
  }

  #search {
    width: 4rem;
    border: 1px solid #f1f1f1;
    padding: 0.2rem;
    display: flex;
    border-radius: 0.4rem;
    align-items: center;
    background-color: #fff;
    height: 0.4rem;

    .icon-search {
      margin-left: 0.14rem;
      font-size: 0.32rem;
    }

    input {
      border: none;
      outline: none;
      font-size: 0.3rem;
    }

    img {
      width: 0.2rem;
    }
  }

  #myInfo {
    margin-left: 1.8rem;
    position: relative;
    z-index: 9999;
    height: 100%;
    display: block;
    padding: 0 0.2rem;
    width: 1.12rem;

    img {
      width: 0.8rem;
      cursor: pointer;
      z-index: 2;
    }

    .img-info {
      position: absolute;
      top: 0.4rem;
      left: 0.2rem;
    }

    .caret {
      position: absolute;
      top: 0.72rem;
      right: 0.2rem;
      width: 0.2rem;
    }

    .user-menu {
      position: absolute;
      right: 0;
      top: 0;
      width: 100%;
      padding-top: 2rem;
      border: 1px solid #d8d8d8;
      border-top: none;
      background-color: #fff;
      font-size: 0.28rem;
      color: #333;
      text-align: center;

      li {
        color: #999;
        display: block;
        margin-bottom:10px;
      }
      li:hover{
        cursor:pointer ;
      }
    }
  }
}
</style>
