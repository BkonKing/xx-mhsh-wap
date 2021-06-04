<template>
  <div class="fiveCenter">
    <van-nav-bar
      v-if="!isShare"
      :fixed="true"
      :border="false"
      placeholder
      left-arrow
      @click-left="goback"
    >
      <template #title>
        <div class="title">
          五大中心
        </div>
      </template>
      <template #right>
        <div class="rightIcon" @click="share">
          <i class="tf-icon tf-icon-fenxiang2"></i>
        </div>
      </template>
    </van-nav-bar>
    <div class="content">
      <img class="img1" src="@/assets/imgs/专题页_02.jpg" />
      <!-- <img src="@/assets/imgs/专题页_03.jpg" /> -->
      <div class="info">
        生活品质有多高，不仅与房子有关，<br />
        更与物业服务有关，<br />
        美好生活家园给业主呈现<br />
        <span class="text">教育、养老、创业、医疗、邻里</span>
        等功能区域，<br />
        搭配几十项免费服务，<br />
        满足业主全方面生活所需。
      </div>
      <div class="swiper_banner">
        <swiper :options="swiperOptions" @slideChange="slideChange">
          <swiper-slide><img src="@/assets/imgs/创业中心.gif"/></swiper-slide>
          <swiper-slide><img src="@/assets/imgs/教育中心.gif"/></swiper-slide>
          <swiper-slide><img src="@/assets/imgs/养老中心.gif"/></swiper-slide>
          <swiper-slide><img src="@/assets/imgs/医疗中心.gif"/></swiper-slide>
          <swiper-slide><img src="@/assets/imgs/邻里中心.gif"/></swiper-slide>
        </swiper>
        <div class="swiper-pagination"></div>
        <div class="swiper-content">
          <div class="swiper-content-left">
            <template v-if="current === 1">
              <div>为业主提供就业指导和创业咨询</div>
              <div>让业主在家门口创业就业</div>
            </template>
            <template v-if="current === 2">
              <div>一站式综合教育机构，汇聚优质</div>
              <div>教育资源，让孩子们学有所教</div>
            </template>
            <template v-if="current === 3">
              <div>居家养老新模式</div>
              <div>育新呵护，真诚相伴</div>
            </template>
            <template v-if="current === 4">
              <div>以业主的医疗服务需求为向导</div>
              <div>以业主的健康服务为目的</div>
            </template>
            <template v-if="current === 5">
              <div>邻里生活，绽放精彩</div>
            </template>
          </div>
          <div class="swiper-content-right">
            <span class="current-swiper">{{ current }}</span> / 5
          </div>
        </div>
      </div>
      <div class="item1">
        <img src="@/assets/imgs/专题页_05.jpg" />
        <img @click="operate(1)" class="imgBtn" src="@/assets/imgs/业主使用@2x.png" />
      </div>
      <div class="item2">
        <img src="@/assets/imgs/专题页_06.jpg" />
        <img @click="operate(3)" class="imgBtn" src="@/assets/imgs/前往体验@2x.png" />
      </div>
      <div class="item3">
        <img src="@/assets/imgs/专题页_07.jpg" />
        <img src="@/assets/imgs/专题页_08.jpg" />
        <img @click="operate(2)" class="imgBtn" src="@/assets/imgs/业主使用@2x.png" />
      </div>
    </div>
    <div class="bottom">
      <img src="@/assets/imgs/专题页_09.jpg" />
    </div>
    <template v-if="isShare">
      <button v-if="isWx" class="app-btn">
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
      <button v-else class="app-btn" @click="goApp">在APP内打开</button>
    </template>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.min.css'
import { NavBar } from 'vant'
import { openApp, isWx, txJssdk } from '@/utils/util.js'
export default {
  components: {
    [NavBar.name]: NavBar,
    Swiper,
    SwiperSlide
  },
  data () {
    return {
      isShare: true, // 是否为分享页面
      current: 1,
      swiperOptions: {
        direction: 'horizontal',
        loop: true, // 是否无效循环
        autoplay: {
          // 自动轮播效果
          delay: 10000,
          disableOnInteraction: false
        },
        slidesPerView: 'auto',
        centeredSlides: true,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      isWx: false,
      extinfo: ''
    }
  },
  created () {
    this.isShare = this.$route.query.share
    if (this.isShare) {
      this.extinfo = `page_type=6&frameUrl=${location.href.split('?')[0]}`
      this.isWx = isWx()
      txJssdk()
    }
  },
  methods: {
    // 轮播改变获取当前index
    slideChange () {
      this.$nextTick(() => {
        this.current =
          +document
            .getElementsByClassName('swiper-slide-duplicate-active')[0]
            .getAttribute('data-swiper-slide-index') + 1
      })
    },
    goback () {
      top.api.sendEvent({
        name: 'goback'
      })
    },
    share () {
      top.api.sendEvent({
        name: 'wxShare',
        extra: {
          title: '美好生活家园 五大中心',
          description: '社区居民活动中心，城市居民体验中心',
          thumb: '',
          contentUrl: 'http://live.tosolomo.com/wap/#/fiveCenter?share=1'
        }
      })
    },
    // 操作
    operate (type) {
      // 不是分享才执行
      if (!this.isShare) {
        if (type < 3) {
          this.getUser(type)
        } else {
          this.toExperience()
        }
      }
    },
    // 业主使用
    getUser (type) {
      const params = {
        1: {
          name: '叶县美好生活家园运营服务中心',
          address: '河南省平顶山市叶县城关乡昆阳大道北段888号美好生活家园运营服务中心',
          btnText: '目的地',
          phoneNumber: '0375-8899518',
          lon: '113.37625',
          lat: '33.652706'
        },
        2: {
          name: '滑县天宏美好生活家园',
          address: '河南省滑县新区珠江路与滑兴路交叉口天宏美好生活家园',
          btnText: '目的地',
          phoneNumber: '0372－8870880',
          lon: '114.552038',
          lat: '35.528047'
        }
      }
      top.api.sendEvent({
        name: 'goMap',
        extra: params[type]
      })
    },
    // 前往体验
    toExperience () {
      top.api.sendEvent({
        name: 'goMap',
        extra: {
          name: '叶县美好生活家园售楼部',
          address: '河南省平顶山市叶县城关乡昆阳大道北段888号美好生活家园售楼部',
          btnText: '目的地',
          phoneNumber: '8896666',
          lon: '113.37625',
          lat: '33.652706'
        }
      })
    },
    // 跳转到app
    goApp () {
      openApp(this.extinfo)
    },
    handleLaunchFn (e) {
      // alert(JSON.stringify(e.detail))
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
.fiveCenter {
  overflow: auto;
  height: 100%;
  .my-swipe {
    height: 1270px;
    padding-top: 50px;
    background-image: url(~@/assets/imgs/专题页_04.jpg);
    background-size: cover;
  }
  .swiper_banner {
    height: 1270px;
    background-image: url(~@/assets/imgs/专题页_04.jpg);
    background-size: cover;
    overflow: hidden;
    /deep/ .swiper-container {
      width: 100%;
      height: 600px;
      overflow: visible !important;
      position: relative;
      z-index: 0;
      .swiper-wrapper {
        margin-left: -26px;
        .swiper-slide {
          width: 500px;
          padding-left: 50px !important;
          img {
            width: 450px;
            height: 600px;
            border-radius: 20px;
          }
        }
      }
    }
  }
  .swiper-pagination {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 60px;
    padding-top: 50px;
    position: unset;
    /deep/ .swiper-pagination-bullet {
      width: 10px;
      height: 10px;
      background: #f7f7f780;
      border-radius: 5px;
      opacity: 1;
      & + .swiper-pagination-bullet {
        margin-left: 20px;
      }
    }
    /deep/ .swiper-pagination-bullet-active {
      width: 20px;
      height: 10px;
      background: #febf00;
      border-radius: 5px;
    }
  }
  .swiper-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 120px;
    margin-top: 150px;
    .swiper-content-left {
      font-size: 26px;
      color: #ffffff;
      div + div {
        margin-top: 10px;
      }
    }
    .swiper-content-right {
      font-size: 36px;
      color: #fff;
      .current-swiper {
        font-size: 64px;
        color: #febf00;
      }
    }
  }
  .title {
    font-size: 34px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 44px;
  }
  .rightIcon {
    font-size: 44px;
  }
  .content {
    img {
      display: block;
      width: 100%;
    }
    .img1 {
      height: 632px;
    }
    .img {
      height: 880px;
    }
    .info {
      width: 100%;
      height: 895px;
      padding-top: 516px;
      text-align: center;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 48px;
      // padding-bottom: 80px;
      background-color: #1a2b45;
      background-image: url('~@/assets/imgs/专题页_03.jpg');
      background-repeat: no-repeat;
      background-size: contain;
      span {
        color: #febf00;
      }
    }
    .item1 {
      position: relative;
      height: 880px;
      .imgBtn {
        width: 160px;
        height: 265px;
        position: absolute;
        right: 26px;
        bottom: 75px;
      }
    }
    .item2 {
      position: relative;
      height: 460px;
      .imgBtn {
        width: 160px;
        height: 265px;
        position: absolute;
        right: 26px;
        bottom: 85px;
      }
    }
    .item3 {
      position: relative;
      height: 1100px;
      .imgBtn {
        width: 160px;
        height: 270px;
        position: absolute;
        right: 26px;
        bottom: 80px;
      }
    }
  }
  .bottom {
    height: 193px;
    padding-top: 40px;
    background: #1a2b45;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .app-btn {
    background-image: linear-gradient(90deg, #00a0e940, #00a0e9);
    box-shadow: 12px 12px 20px #22222294;
  }
}
</style>
