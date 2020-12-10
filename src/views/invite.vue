<template>
  <div class="shade">
    <van-nav-bar
      class="invite-nav-bar"
      title="访客通行证"
      placeholder
      :border="false"
    />
    <div class="invite-box">
      <div class="share-box">
        <div class="share-name">
          <div class="share-name__text">{{info.project_name}}</div>
        </div>
        <div class="tf-text-lg">{{info.fc_info}}</div>
        <div class="qr-box">
          <img class="qr-box__image" :src="info.url" />
        </div>
        <div class="tf-text-grey">有效次数 {{info.yx_num}}</div>
        <div class="tf-text-grey">有效日期：{{info.yxtime}}</div>
        <div class="tf-divider-dashed" style="width: 100%;"></div>
        <div class="tf-text-lg">
          {{info.realname}}
          <template v-if="info.visitor_num">({{info.visitor_num}}人)</template> {{info.gender | sexText}} {{info.mobile}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { NavBar } from 'vant'
import { visitorCode } from '@/api/share'

export default {
  components: {
    [NavBar.name]: NavBar
  },
  data () {
    return {
      id: '',
      params: {},
      info: {}
    }
  },
  created () {
    this.params = this.$route.query
    this.visitorCode()
  },
  methods: {
    // 获取邀约信息
    visitorCode () {
      visitorCode({
        uid: this.params.uid,
        yy_id: this.params.id,
        project_id: this.params.project_id
      }).then((res) => {
        this.info = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>
.shade {
  width: 100%;
  height: 100%;
  background-color: #1b1b1b;
}

.share-box {
  position: relative;
  width: 620px;
  margin: 80px 65px;
  padding: 60px 66px;
  @flex-column();
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 6px #f1c7c5;
  // border:6px solid rgba(235, 88, 65, 0.3);
}

.share-name {
  position: absolute;
  z-index: 999;
  top: -38px;
  left: 92px;
  width: 436px;
  height: 76px;
  background-image: url('../assets/imgs/butler_yaoyue.png');
  background-size: contain;
}

.share-name__text {
  text-align: center;
  line-height: 76px;
  font-size: 30px;
  color: #fff;
}

.qr-box {
  width: 480px;
  height: 480px;
  margin: 40px 0;
}

.qr-box__image {
  width: 480px;
  height: 480px;
}

.tf-text-grey {
  font-size: 24px;
}

.share-btn {
  border: none;
  color: #fff;
  width: 620px;
  height: 88px;
  font-size: 30px;
  background-image: linear-gradient(to right, @red, @red-dark);
  border-radius: 10px;
}

.invite-box {
  @flex-column();
  align-items: center;
  margin-top: 60px;
}

.tf-divider-dashed {
  margin: 30px 0;
}

.invite-nav-bar {
  background-color: #1b1b1b;
  /deep/ .van-icon {
    color: #fff;
  }
  /deep/ .van-nav-bar__title {
    color: #fff;
  }
}
</style>
