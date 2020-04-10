<template>
  <div id="my-info">
    <div class="top">
      <div class="left">
        <span>个人中心</span>
        <span class="title" @click="switchTo('/my_order')">
          <span :class="{ on: $route.path.includes('/my_order') }">我的订单</span>
        </span>
        <span class="title" @click="switchTo('/my_info')">
          <span :class="{ on: $route.path.includes('/my_info') }">基本信息</span>
        </span>
      </div>
      <div class="right">
        <div class="profile-title">基本信息</div>
        <div class="container">
          <div class="avatar">
            <img :src="avatar" class="avatar" />
            <div class="changeImg">
              <input type="button" class="upload-btn" value="更换头像" />
              <input
                type="file"
                id="file"
                name="file"
                ref="uploadImg"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                style="height: 100%;width: 100%;opacity:0"
                @change="changeImg"
              />
            </div>
            <div class="tips">支持JPG,JPEG,PNG格式,且文件需小于1M</div>
          </div>
          <div class="userinfo">
            <div
              class="item"
              @click.prevent="$router.push({name:'modify_username',params:{userName:userName}})"
            >
              <p>昵称:</p>
              <input type="text" :value="userName?userName:'未填写'" style="height:0.6rem;width:5.08rem;padding-left:0.2rem;">
            </div>
            <div class="item" @click.prevent="showSexPanel=true">
              <p>性别:</p>
              <span class="right">
                <!-- {{userSex?userSex:'未填写'}} -->
                <div @click="modifyUserSex('男')" :class="{ on: userSex=='男' }" style="margin-right:0.5rem;width:1rem;text-align:center;">
                  <i class="icon-male"></i>男
                </div>
                <div @click="modifyUserSex('女')" :class="{ on: userSex=='女' }" style="width:1rem;text-align:center;">
                  <i class="icon-female"></i>女
                </div>
                <span class="radio" v-if="!userSex">请选择性别</span>
              </span>
            </div>
            <div class="item" @click="showDatePicker=true">
              <p>生日:</p>
              <span class="right">
                {{birthday}}
                <i class="icon-more"></i>
              </span>
            </div>
            <div
              class="item sign"
              @click.prevent="$router.push({name:'modify_usersign',params:{sign:sign}})"
            >
              <p>个人签名:</p>
              <span class="right">
                <span class="ellipsis sign">{{sign?sign:'未填写'}}</span>
                <i class="icon-more"></i>
              </span>
            </div>
          </div>
          <!-- <div class="modify_sex" v-show="showSexPanel" @click="showSexPanel=false">
            <div class="container" @click.stop>
              <div class="content">
                <div class="title">修改性别</div>
                <div class="item" @click="modifyUserSex('男')">
                  <i class="icon-male"></i>男
                </div>
                <div class="item" @click="modifyUserSex('女')">
                  <i class="icon-female"></i>女
                </div>
              </div>
            </div>
          </div>-->
          <!-- <div class="logout">
            <span class="logout-btn" @click="logout()">退出</span>
          </div>-->
        </div>
        <!-- <date-picker
          :show-picker-model="showDatePicker"
          :default-date="new Date(birthday)"
          @cancel="handleCancel"
          @confirm="handleConfirm"
        />-->
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { MessageBox, Indicator, Toast } from "mint-ui";
import moment from "moment";
import { Input } from "element-ui";
import DatePicker from "vuejs-mobile-datepicker";
// import DatePicker from '../../../components/DatePicker/DatePicker' //引入日期选择器组件
Vue.use(Input);
import {
  getUserInfo,
  updateUserInfo,
  updateUserSex,
  updateUserBirthday,
  upLoadImg,
  updateUserAvatar
} from "../../../api/index";
export default {
  name: "MyInfo",
  data() {
    return {
      userName: "",
      userPwd: "",
      userSex: "",
      avatar: "",
      avatarSrc: "",
      birthday: null,
      sign: "",
      jsonData: {},
      showDatePicker: false,
      showSexPanel: false
    };
  },
  components: {
    DatePicker
  },
  created() {
    Indicator.open("Loading...");
    this.loadUserInfo();
  },
  methods: {
    switchTo(path) {
      this.$router.push(path);
      this.name = "";
    },
    //更新用户信息
    updateUserInfo() {
      if (this.jsonData) {
        this.avatarSrc = this.jsonData.avatar;
        this.avatar = "http://localhost:3000" + this.avatarSrc;
        this.jsonData.user_name
          ? (this.userName = this.jsonData.user_name)
          : (this.userName = "");
        this.jsonData.password
          ? (this.userPwd = this.jsonData.password)
          : (this.userPwd = "");
        this.jsonData.sex
          ? (this.userSex = this.jsonData.sex)
          : (this.userSex = "");
        this.jsonData.birthday
          ? (this.birthday = this.jsonData.birthday)
          : (this.birthday = null);
        this.jsonData.sign
          ? (this.sign = this.jsonData.sign)
          : (this.sign = "");
      }
    },
    async modifyUserSex(sex) {
      if (this.$cookies.get("user_id") && sex) {
        let json = await updateUserSex(this.$cookies.get("user_id"), sex);
        if (json.success_code == 200) {
          this.showSexPanel = false;
          this.userSex = sex;
        }
      }
    },
    changeImg(e) {
      let reader = new FileReader();
      reader.readAsDataURL(this.$refs.uploadImg.files[0]); //发起异步请求
      let _this = this;
      reader.onload = function() {
        //读取完成后，将结果赋值给img的src
        _this.modifyUserAvatar();
        _this.$refs.previewImg.src = this.result;
      };
    },
    //修改用户头像
    async modifyUserAvatar() {
      if (!this.$cookies.get("user_id")) {
        Message.error("请先登录！");
        return false;
      } else {
        let formData = new FormData();
        formData.append("file", this.$refs.uploadImg.files[0]);
        let json = await upLoadImg(formData);
        if (json.success_code === 200) {
          if (json.data.length) {
            let userNewAvatar = "/images/avatar/" + json.data[0].filename;
            json = await updateUserAvatar(
              this.$cookies.get("user_id"),
              userNewAvatar
            );
            if (json.success_code == 200) {
              Toast({
                message: "修改头像成功",
                position: "middle",
                duration: 2000
              });
            } else {
              Toast({
                message: json.message,
                position: "middle",
                duration: 2000
              });
            }
          }
        }
      }
    },
    //加载用户信息
    async loadUserInfo() {
      if (this.$cookies.get("user_id")) {
        let json = await getUserInfo(this.$cookies.get("user_id"));
        if (json.success_code === 200) {
          this.jsonData = json.data;
          this.updateUserInfo();
        } else {
          this.jsonData = {};
        }
      } else {
        this.jsonData = {};
      }
      Indicator.close();
    },
    //取消按钮
    handleCancel() {
      this.showDatePicker = false;
    },
    //确定按钮
    async handleConfirm(selectedDate) {
      if (this.$cookies.get("user_id") && selectedDate) {
        let json = await updateUserBirthday(
          this.$cookies.get("user_id"),
          selectedDate
        );
        if (json.success_code == 200) {
          this.showDatePicker = false;
          this.birthday = selectedDate;
        }
      }
    },
    disableDate(item) {
      if (
        new Date(item) - new Date("1900-10-10") >= 0 &&
        new Date("1990-10-10") - new Date(item) >= 0
      ) {
        return true;
      }
    },
    //修改用户名
    changeUserName() {
      MessageBox.prompt("修改用户名").then(({ value, action }) => {
        if (value) {
          this.userName = value;
        }
      });
    },
    //修改密码
    changeUserPwd() {
      MessageBox.prompt("修改密码(1-6位)").then(({ value, action }) => {
        if (value && /^[\w_-]{1,6}$/.test(value)) {
          this.userPwd = value;
        } else {
          MessageBox.alert("请输入1到6位密码！");
        }
      });
    },
    //退出登录
    logout() {
      if (this.$cookies.get("user_id")) {
        this.$cookies.remove("user_id");
        this.$router.push("my");
      }
    }
  }
};
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
#my-info {
  width: 100%;
  height: 100%;
  color: #000;
  font-size: 0.3125rem;
  margin-top: 2.2rem;

  .top {
    height: 700px;
    width: 1165px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    color: #333;
    border: 1px solid #e1e1e1;
    margin-bottom: 80px;

    .left {
      width: 200px;
      float: left;
      height: 100%;
      font-size: 22px;
      text-align: center;
      color: #222;
      font-weight: 400;
      background-color: #f4f3f4;
      border-right: 1px solid #e1e1e1;
      display: flex;
      flex-direction: column;
      justify-items: center;
      align-items: center;

      span {
        margin-top: 40px;
        margin-bottom: 30px;
      }

      .title {
        width: 100%;
        font-weight: 400;
        color: #333;
        line-height: 40px;
        font-size: 18px;
        margin: 0;

        span:hover {
          cursor: pointer;
        }

        .on {
          width: 100%;
          display: inline-block;
          color: white;
          margin: 0;
          background-color: #EF4238;
        }
      }

      .title:hover {
        cursor: pointer;
      }
    }

    .right {
      float: left;
      padding-left: 40px;
      width: 922px;
      height: 100%;

      .profile-title {
        padding: 26px 0;
        color: #ec443f;
        font-size: 18px;
        border-bottom: 1px solid #e1e1e1;
        margin-bottom: 30px;
      }

      .container {
        display: flex;
        flex-direction: row;

        .avatar {
          width: 258px;
          float: left;
          display: flex;
          flex-direction: column;
          text-align: center;

          img {
            width: 258px;
            height: 258px;
          }

          .changeImg {
            position: relative;
            text-align: center;

            .upload-btn {
              cursor: pointer;
              margin: 20px auto 0;
              width: 182px;
              height: 56px;
              line-height: 56px;
              color: #5b5b5b;
              background-color: #e6e6e6;
              border-radius: 10px;
              border: 1px;
              font-size: 18px;
              padding: 0;
            }

            #file {
              position: absolute;
              top: 20px;
              left: 38px;
              line-height: 56px;
            }

            input:hover {
              cursor: pointer;
            }
          }

          .tips {
            margin-top: 10px;
            color: #999;
            font-size: 18px;
            line-height: 30px;
          }
        }

        .userinfo {
          float: left;
          width: 495px;
          margin-left: 58px;
          display: flex;
          flex-direction: column;
          
          .item {
            color: #666;
            position: relative;
            margin-bottom:20px;
            padding-left: 90px;
            height: 30px;
            line-height: 30px;
            font-size: 14px;

            p {
              position: absolute;
              top: 0;
              left: 0;
              width: 80px;
              font-size: 16px;
              text-align: right;
              color: #333;
              padding: 0;
              margin: 0;
            }
            .right{
              display:flex;
              flex-direction:row;
              width:5.08rem;
              padding-left:0.2rem;
              .on{
                box-shadow :0.02rem 0.02rem 0.08rem #bbb;
              }
            }
          }
        }
      }
    }
  }
}
</style>
