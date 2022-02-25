<template>
  <div class="shade">
    <!-- <van-nav-bar
      class="invite-nav-bar"
      title="app下载"
      placeholder
      :border="false"
    /> -->
    <div class="bg-box">
      <img class="bg-img" src="@/assets/img/down_02.png" />
    </div>
    <div class="fixed-box">
      <a class="down-btn" :href="downUrl"><img src="@/assets/img/down_01.png" /></a>
    </div>
  </div>
</template>

<script>
import { NavBar } from 'vant'

export default {
  components: {
    [NavBar.name]: NavBar
  },
  data () {
    return {
      downUrl: '',
      appParams: ''
    }
  },
  created () {
    const appParams = this.$route.query.appParams
    // window.location = 'mhshjyScheme://?' + appParams
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      this.downUrl = 'https://apps.apple.com/cn/app/%E7%BE%8E%E5%A5%BD%E7%94%9F%E6%B4%BB%E5%AE%B6%E5%9B%AD/id1457806538'
    } else if (navigator.userAgent.match(/android/i)) {
      this.downUrl = '/app_download/downpage'
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.shade {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}
.bg-box {
  width: 100%;
  font-size: 0;
}
.bg-img {
  width: 100%;
  height: auto;
}
.fixed-box {
  height: 160px;
  width: 100%;
}
.down-btn {
  position: fixed;
  left: 50%;
  margin-left: -245px;
  bottom: 66px;
  width: 490px;
  height: 135px;
  display: flex;
}
.down-btn img {
  width: 100%;
  height: 100%;
}
</style>
