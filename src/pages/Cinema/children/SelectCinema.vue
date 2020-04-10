<template>
  <div id="select-cinema">
    <div class="top">
      <img :src="'https://images.weserv.nl/?url='+poster.substring(7)" alt />
      <div class="detail">
        <div class="name">{{movieInfo.name}}</div>
        <div class="descInfo1">{{movieInfo.type}}</div>
        <div class="long">{{movieInfo.movie_long}}大陆上映</div>
        <div class="showTime">{{movieInfo.public_date}}</div>
      </div>
      <div class="score">
        <div v-if="new Date()-new Date(movieInfo.public_date)>=0">
          <div class="descInfo" v-if="movieInfo.score">
            评分：
            <span class="number">{{movieInfo.score.toFixed(1)}}</span>
          </div>
          <div class="descInfo" v-else>暂无评分</div>
        </div>
      </div>
    </div>
    <ly-tab
      v-model="selectedId"
      :items="items"
      :options="options"
      class="ly-tab"
      v-if="hackReset"
      @change="changeLyTabItem"
    />
    <div class="content">
      <div
        class="item"
        v-for="(item,index) in dateCinemaSchedule"
        :key="index"
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
        <div class="right">
          <div class="price-block"><span class="price">￥23</span>起</div>
          <div class="block" @click="$router.push({path:'/detail_cinema',query:{cinema_id:item.cinema_id,movie_id:item.movie_id}})">
            <span class="price">选座购票</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMovieDetail, getCurrentMovieSchedule } from "../../../api/index";
import { formatDate } from "../../../common/util/util";
import { Indicator } from "mint-ui";
import Vue from "vue";
import LyTab from "ly-tab";
Vue.use(LyTab);
export default {
  name: "SelectCinema",
  data() {
    return {
      movieInfo: "",
      selectedId: 0,
      hasCinemaInfo: [],
      cinemaScheduleInfo: [],
      dateCinemaSchedule: [],
      hackReset: true,
      items: [],
      options: {
        activeColor: "#dd2727"
      },
      poster: ""
    };
  },
  created() {
    Indicator.open("Loading...");
    this.loadInfo();
  },
  methods: {
    async loadInfo() {
      let json = await getMovieDetail(this.$route.query.movie_id);
      if (json.success_code === 200) {
        this.movieInfo = json.data[0];
        this.poster = this.movieInfo.poster;
      }
      console.log(this.movieInfo);
      json = await getCurrentMovieSchedule(this.$route.query.movie_id);
      if (json.success_code === 200) {
        this.hasCinemaInfo = json.data.hasCinemaInfo;
        this.cinemaScheduleInfo = json.data.cinemaScheduleInfo;
        this.cinemaScheduleInfo.forEach(value => {
          this.removeRepeat(value, "cinema_id");
        });
        this.hasCinemaInfo.forEach(value => {
          this.items.push({
            label: formatDate(new Date(value[0].show_date), true),
            date: value[0].show_date
          });
        });
        this.hackReset = false;
        this.$nextTick(() => {
          this.hackReset = true;
        });
        this.dateCinemaSchedule = this.cinemaScheduleInfo[0];
        console.log(this.dateCinemaSchedule)
      }
      Indicator.close();
    },
    //切换日期
    changeLyTabItem(item) {
      this.hasCinemaInfo.forEach((value, index) => {
        if (value[0].show_date === item.date) {
          this.dateCinemaSchedule = this.cinemaScheduleInfo[index];
        }
      });
    },
    //去除重复的影院
    removeRepeat(arr, key) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arr[i][key] === arr[j][key]) {
            arr.splice(j, 1);
            j = j - 1;
          }
        }
      }
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#select-cinema {
  width: 100%;
  height: 100%;
  color: #000;
  font-size: 0.3125rem;
  margin-top: 1.6rem;

  .top {
    width: 1329px;
    height: 305px;
    padding-left:190px;
    padding-top:70px;
    display: flex;
    flex-direction :row;
    justify-content:left;
    background-color: #392f59;
    color: #fff;

    img {
      margin-right:22px;
      width:240px;
      height:330px;
      border:6px solid #fff;
    }

    .detail {
      width: 250px;
      font-size: 14px;
      line-height: 26px;
      .name{
        font-size:26px;
        margin-bottom:10px;
      }
    }
    .score{
      margin-top:155px;
    }
  }
  .ly-tab{
    margin-top:38px;
    border:none;
  }
  .content {
    margin-top: 0.1rem;
    font-size: 0.3125rem;
    padding-left:190px;
    padding-right:190px;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      padding: 0.25rem;
      width: 100%;
      margin-bottom: 0.25rem;
      border-bottom: 1px dashed #e5e5e5;

      .left {
        width: 100%;

        .name {
          font-size: 0.345rem;
          line-height: 0.36rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .address {
          font-size: 0.28rem;
          height: 0.3rem;
          color: #666;
          margin-bottom: 0.25rem;
        }

        .label-block {
          display: flex;

          span {
            padding: 0.06rem;
            font-size: 0.1rem;
            border: 0.01rem solid #f90;
            margin-right: 0.1rem;
            border-radius: 0.04rem;
            color: #f90;
          }
        }
      }

      .right {
        display:flex;
        flex-direction:row;
        justify-content :right;
        align-items :center;
        text-align: center;

        .price-block {
          color: #999;
          font-size:12px;
          width:40px;
          margin-right:10px;

          .price {
            font-weight:600;
            color:#dd2727;
          }
        }
        .block{
          width 1.6rem
          height 0.6rem
          background-color #f03d37
          text-align center
          line-height 0.6rem
          border-radius 0.3rem
          box-shadow 0.02rem 0.02rem 0.08rem #f03d37; 
          .price{
            font-size:12px;
            color:#fff;
          }
        }
      }
    }
  }
}
</style>
