<template>
  <div class="tf-bg">
    <template v-if="isWx">
      <div class="link-url">
        <div>
          如需浏览，请长按网址复制后使用
          <div>浏览器访问</div>
        </div>
        <div class="url">{{ href }}</div>
      </div>
    </template>
    <div v-else-if="isFailure" class="link-failure-box">
      <img class="link-failure-img" src="@/assets/imgs/link-failure.png" alt="" />
      <div class="link-text">当前链接已失效</div>
    </div>
    <template v-else>
      <div class="invite">
        <img class="img1" src="@/assets/invite/bg.png" />
        <img class="img2" src="@/assets/invite/title.png" />
        <img class="img3" src="@/assets/invite/phone.png" />
        <div class="coupon">
          <!-- <div class="coupon-title">首次下载登录，奖励幸福币</div> -->
          <div class="coupon-credits">{{ credits }} <span>幸福币</span></div>
          <!-- <div class="coupon-footer">幸福币购物不花钱，少花钱</div> -->
        </div>
        <div class="form">
          <van-field
            v-model="mobile"
            maxlength="11"
            class="van-input"
            placeholder="请输入您的手机号码领取"
          ></van-field>
          <div class="btn" @click="submit">
            {{ isSuccess ? '前往使用' : '立即领取' }}
            <img v-if="isSuccess" class="img4" src="@/assets/invite/success.png" />
          </div>
        </div>
        <div class="footer">—— 服务美好家 ，便民掌上行 ——</div>
      </div>
      <tf-dialog
        v-model="isOldUser"
        title="嘿，老朋友，好久不见"
        confirmButtonText="去看看"
        @confirm="openApp"
      >
        <div class="content1">
          <div>快打开美好生活家园看看</div>
          <div>最近有什么不一样吧~</div>
        </div>
      </tf-dialog>
      <tf-dialog v-model="isReward" confirmButtonText="我知道了" @confirm="isReward = false">
        <div class="content2">
          <div>您已参与活动，</div>
          <div>不可重复领取！</div>
        </div>
      </tf-dialog>
      <tf-dialog v-model="isError" confirmButtonText="我知道了" @confirm="isError = false">
        <div class="content2">
          {{ errMessage }}
        </div>
      </tf-dialog>
    </template>
  </div>
</template>

<script>
import { Field, Button, Toast } from 'vant'
import { getInviteReward, receiveInvite } from '@/api/share'
import tfDialog from '@/components/tf-dialog'
import { openApp, isWx } from '@/utils/util.js'
export default {
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [Toast.name]: Toast,
    tfDialog
  },
  data () {
    return {
      uid: '',
      projectId: '',
      href: '',
      isWx: false,
      isFailure: false,
      credits: '',
      mobile: '',
      isOldUser: false, // 老用户
      isReward: false, // 是否领取
      isSuccess: false, // 领取成功
      isError: false,
      errMessage: ''
    }
  },
  created () {
    this.href = window.location.href
    this.uid = this.$route.query.invite_uid
    this.projectId = this.$route.query.project_id
    this.isWx = isWx()
    this.getInviteReward()
  },
  methods: {
    getInviteReward () {
      getInviteReward({
        invite_uid: this.uid,
        project_id: this.projectId
      })
        .then(({ credits }) => {
          this.credits = credits || ''
        })
        .catch(({ code, message }) => {
          if (code === '201') {
            this.isFailure = true
          }
        })
    },
    submit () {
      if (this.isSuccess) {
        openApp()
        return
      }
      if (this.mobile && this.mobile.length === 11) {
        this.receiveInvite()
      } else {
        Toast('请输入正确的手机号！')
      }
    },
    openApp,
    receiveInvite () {
      receiveInvite({
        invite_uid: this.uid,
        project_id: this.projectId,
        mobile: this.mobile
      })
        .then(({ code }) => {
          if (code === '200') {
            this.isSuccess = true
          }
        })
        .catch(({ code, message }) => {
          if (code === '202') {
            this.isOldUser = true
          } else if (code === '203') {
            this.isReward = true
          } else {
            this.isError = true
            this.errMessage = message || '无法领取'
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.tf-bg {
  height: 100%;
  overflow: auto;
}
.link-failure-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 400px;
  .link-failure-img {
    width: 300px;
    height: 256px;
  }
  .link-text {
    margin-top: 60px;
    font-size: 28px;
    font-weight: 500;
    color: #8f8f94;
  }
}
.link-url {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 120px;
  font-size: 36px;
  color: #222;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 600px;
  }
  .url {
    margin-top: 50px;
    word-break: break-all;
  }
}
.invite {
  width: 100%;
  height: 1596px;
  position: absolute;
  background: linear-gradient(180deg, #fe9b00 0%, #febf00 50%);
  .img1 {
    position: absolute;
    top: 0;
    width: 100%;
  }
  .img2 {
    position: absolute;
    top: 96px;
    left: 94px;
    width: 571px;
    height: 162px;
  }
  .img3 {
    position: absolute;
    top: 289px;
    left: 83px;
    width: 600px;
    height: 511px;
  }
  .coupon {
    position: absolute;
    top: 670px;
    width: 750px;
    height: 437px;
    background-image: url('~@/assets/invite/coupon.png');
    background-size: cover;
    .coupon-title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 94px;
      font-size: 36px;
      color: #ffffff;
      line-height: 40px;
      text-shadow: 0px 4px 6px rgba(193, 68, 12, 0.53);

      background: linear-gradient(180deg, #ffd09b 0%, #ffffff 57.51953125%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .coupon-credits {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      width: 100%;
      height: 174px;
      padding: 57px 0;
      // margin-top: 18px;
      margin-top: 112px;
      font-size: 80px;
      font-weight: bold;
      color: #ffffff;
      line-height: 60px;
      span {
        margin-left: 20px;
        font-size: 32px;
        font-weight: bold;
        color: #ffffff;
        line-height: 1;
        opacity: 0.9;
      }
    }
    .coupon-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 85px;
      font-size: 26px;
      font-weight: bold;
      color: #ffffff;
      line-height: 1;
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 1107px;
    width: 670px;
    height: 370px;
    margin-left: 40px;
    background: linear-gradient(180deg, #fcbf8b 0%, #ffffff 11%);
    border-radius: 0px 0px 50px 50px;
    .van-input {
      width: 560px;
      height: 100px;
      padding: 0;
      margin-top: 60px;
      background: #f7f7f7;
      border-radius: 50px;
      /deep/ input {
        line-height: 100px;
        text-align: center;
        font-size: 32px;
        font-weight: bold;
        color: #222222;
        &::placeholder {
          font-size: 28px;
          color: #8f8f94;
        }
      }
    }
    .btn {
      display: flex;
      justify-content: center;
      width: 595px;
      height: 123px;
      padding-top: 34px;
      margin-top: 53px;
      position: relative;
      background-image: url('~@/assets/invite/btn.png');
      background-size: cover;
      font-size: 28px;
      font-weight: bold;
      color: #ffffff;
      .img4 {
        position: absolute;
        left: 18px;
        top: -20px;
        width: 200px;
        height: 59px;
      }
    }
  }
  .footer {
    width: 100%;
    padding-bottom: 41px;
    position: absolute;
    top: 1530px;
    font-size: 24px;
    font-weight: bold;
    color: #81531b;
    line-height: 24px;
    text-align: center;
  }
}
.content1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 52px;
}
.content2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 66px;
  margin-bottom: 78px;
}
</style>
