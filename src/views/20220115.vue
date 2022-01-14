<template>
  <div class="tf-bg">
    <van-nav-bar :fixed="true" :border="false" :title="title" placeholder> </van-nav-bar>
    <div class="content">
      <img class="img1" src="@/assets/activity/20220115.jpg" />
      <button v-if="isWx" class="sign-btn">
        <wx-open-launch-app
          id="id"
          class="launch-btn"
          appid="wx7245d2cb43a093db"
          :extinfo="extinfo"
          @error="handleErrorFn"
          @launch="handleLaunchFn"
        >
          <script type="text/wxtag-template">
            <div class="btn">在APP内打开</div>
          </script>
        </wx-open-launch-app>
      </button>
      <button v-else class="sign-btn" @click="goApp">在APP内打开</button>
    </div>
  </div>
</template>

<script>
// /20220115activity
import { NavBar } from 'vant'
import { openApp, isWx, txJssdk } from '@/utils/util.js'
export default {
  components: {
    [NavBar.name]: NavBar
  },
  data () {
    return {
      title: '打卡赢幸福币  到访兑好礼',
      isWx: false,
      extinfo: ''
    }
  },
  created () {
    this.sendShareParam()
  },
  methods: {
    sendShareParam (data) {
      this.isWx = isWx()
      this.extinfo = 'routerName=20220115activity'
      txJssdk({
        title: this.title,
        desc: '海丝文创广场丨双地铁 公园里 智享文创社区',
        imgUrl: 'https://live.tosolomo.com/library/img/app_img/20220115activityicon.png'
      })
    },
    // 跳转到app
    goApp () {
      openApp(this.extinfo)
    },
    handleLaunchFn (e) {
      console.log('success', e)
    },
    handleErrorFn (e) {
      console.log('fail', e.detail)
      this.$router.push({
        path: '/upload'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tf-bg {
  overflow: auto;
  height: 100%;
}
.content {
  position: relative;
}
.img1 {
  display: block;
  width: 100%;
}
.sign-btn {
  position: absolute;
  width: 6.8rem;
  height: 1.73333rem;
  left: 1.6rem;
  bottom: 4.93333rem;
  opacity: 0;
}
.launch-btn {
  width: 100%;
  height: 100%;
}
</style>
