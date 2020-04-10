<template>
    <div id="cinema">
      <div class="content">
        <div class="item" v-for="(item,index) in jsonData" :key="index">
          <div class="left">
            <div class="name ellipsis">{{item.cinema_name}}</div>
            <div class="address ellipsis">{{item.specified_address}}</div>
            <div class="label-block"><span>小吃</span><span>4D厅</span><span>巨幕厅</span><span>杜比全景声厅</span></div>
          </div>
          <div class="right" @click="$router.push({path:'/detail_cinema',query:{cinema_id:item.cinema_id}})">
            <div class="price-block"><span class="price">选座购票</span></div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {getCinemaList} from '../../api/index'
    import {Indicator} from 'mint-ui'
    export default {
        name: "Cinema",
        data(){
          return{
            jsonData:[]
          }
        },
        created() {
          Indicator.open('Loading...');
          this.loadCinemaList();
        },
        methods:{
          //加载电影列表
          async loadCinemaList(){
            let json = await getCinemaList();
            if (json.success_code===200){
              this.jsonData = json.data;
            }
            Indicator.close();
          }
        }
    }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  #cinema
    width 24rem
    margin 0 auto
    height 100%
    margin-top 1.6rem
    .content
      font-size .3125rem
      margin-top 1rem
      padding-bottom .8rem
      .item
        display flex
        justify-content center
        align-items center
        box-sizing border-box
        padding .25rem .3rem
        width 100%
        margin-bottom .25rem
        border-bottom 1px dashed #e5e5e5
        .left
          width 100%
          .name
            font-size .345rem
            line-height .36rem
            margin-bottom .25rem
            font-weight 700
          .address
            font-size .28rem
            line-height .3rem
            color #666
            margin-bottom .25rem
          .label-block
            display flex
            span
              padding .06rem
              font-size .2rem
              border .01rem solid #f90
              margin-right .1rem
              border-radius .04rem
              color #f90
        .right
          width 1.6rem
          height 0.6rem
          background-color #f03d37
          text-align center
          line-height 0.6rem
          border-radius 0.3rem
          box-shadow 0.02rem 0.02rem 0.08rem #f03d37; 
          .price-block
            font-size 0.28rem
            color #fff
</style>
