<template>
  <div class="tf-body">
    <van-nav-bar
      :fixed="true"
      :border="false"
      :title="specialData.thematic_name"
      placeholder
    />
    <div class="tf-body-container" id="specialContent">
      <div v-for="(item, index) in specialList" :key="index" class="mobile-image-box">
        <template v-for="(imgData, i) in item">
          <img
            v-if="imgData.block_img"
            :key="`img${i}`"
            :src="imgData.block_img"
            class="mobile-image"
          />
        </template>
      </div>
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
            <div class="btn" style="color: #fff;
            font-size: 16px">在APP内打开</div>
          </script>
        </wx-open-launch-app>
      </button>
      <button v-else class="sign-btn" @click="goApp">在APP内打开</button>
    </div>
  </div>
</template>

<script>
import { NavBar } from 'vant'
import { getSpecial } from '@/api/share'
import { openApp, isWx, txJssdk } from '@/utils/util.js'
export default {
  name: 'activitySpecial',
  components: {
    [NavBar.name]: NavBar
  },
  data () {
    return {
      id: '',
      specialData: {},
      specialList: [],
      isWx: false,
      extinfo: ''
    }
  },
  async created () {
    this.id = this.$route.query.id
    this.isWx = isWx()
    this.getSpecial()
  },
  methods: {
    async getSpecial () {
      const { data, child } = await getSpecial({
        thematic_id: this.id
      })
      if (+data.state === 1) {
        this.specialData = data
        this.specialList = child
        this.setShareParams()
      } else {
        const stateMessage = {
          2: '活动未开始',
          3: '活动已结束'
        }
        this.$toast(stateMessage[data.state])
      }
    },
    setShareParams (data) {
      this.extinfo = `routerName=activitySpecial&id=${this.id}`
      txJssdk({
        title: this.specialData.wechat_title,
        desc: this.specialData.wechat_content,
        imgUrl: this.specialData.wechat_img
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
.icon-image {
  width: 44px;
  height: 44px;
}
.mobile-image-box {
  display: flex;
  .mobile-image {
    flex: 1;
    width: 0;
    object-fit: cover;
  }
}
.sign-btn {
  width: 40vw;
  height: 12vw;
  position: absolute;
  bottom: 40px;
  left: 50%;
  margin-left: -20vw;
  border: none;
  border-radius: 6vw;
  background-image: linear-gradient(to right, #f9866b, #eb5841);
  color: #fff;
  font-size: 4vw;
  text-align: center;
  z-index: 2;
}
</style>
