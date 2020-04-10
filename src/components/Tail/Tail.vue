<template>
  <div id="tab">
    <div class="tail" style="visibility: visible;">
      <p class="friendly-links">
        关于花语 :
        <a target="_blank">关于我们</a>
        <span></span>
        <a target="_blank">管理团队</a>
        <span></span>
        <a target="_blank">投资者关系</a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        友情链接 :
        <a
          href="http://www.meituan.com"
          target="_blank"
        >美团网</a>
        <span></span>
        <a href="http://i.meituan.com/client" target="_blank">美团下载</a>
        <span></span>
        <a href="https://www.huanxi.com" target="_blank">欢喜首映</a>
      </p>
      <p class="friendly-links">
        商务合作邮箱：185396568@nicai.com
        客服电话：8888888888888
        违法和不良信息举报电话：4006018900
      </p>
      <p class="friendly-links">
        用户投诉邮箱：tousu@tousu.com
        舞弊线索举报邮箱：wubijubao@xiansuo.com
      </p>
      <p class="friendly-links credentials">
        <a target="_blank">中华人民共和国增值电信业务经营许可证 京A8-20200314</a>
        <span></span>
        <a target="_blank">网络文化经营许可证 京网文（2019）3837-369号</a>
      </p>
      <p class="friendly-links credentials">
        <a target="_blank">花语用户服务协议</a>
        <span></span>
        <a target="_blank">花语平台交易规则总则</a>
        <span></span>
        <a target="_blank">隐私政策</a>
      </p>
      <p class="friendly-links credentials">
        <a target="_blank">
          京公网安备
          88888888888888号
        </a>
        <span></span>
        <a target="_blank">京ICP备88888888号</a>
      </p>
      <p>花语文化传媒有限公司</p>
      <p>
        ©
        <span class="my-footer-year">2020</span>
        花语电影
      </p>
      <div class="certificate">
        <a target="_blank">
          <img src="http://p0.meituan.net/moviemachine/e54374ccf134d1f7b2c5b075a74fca525326.png" />
        </a>
        <a target="_blank">
          <img src="http://p1.meituan.net/moviemachine/805f605d5cf1b1a02a4e3a5e29df003b8376.png" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tail",
  methods: {
    
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#tab{
    .tail {
    background-color: #47464A;
    padding: 1.12rem 0;
    margin: 0 auto;

    p {
      color: #ccc;
      margin: 0;
      padding: 0;
      text-align: center;
      font-size: 0.28rem;
      line-height: 0.44rem;
      height: 0.44rem;

      a {
        color: #ef4238;
      }
    }

    .friendly-links {
      span {
        display: inline-block;
        border-left: 1px solid #ccc;
        margin: 0 7px;
        height: 12px;
        position: relative;
        top: 1px;
      }
    }

    .credentials {
      span {
        display: inline-block;
        border-left: 1px solid #ccc;
        margin: 0 7px;
        height: 12px;
        position: relative;
        top: 1px;
      }

      a {
        color: #ccc !important;
      }
    }

    .certificate {
      margin-top: 0.4rem !important;
      margin: 0;
      padding: 0;
      text-align: center;

      a {
        padding-right: 12px;
      }
    }
  }
}
</style>
