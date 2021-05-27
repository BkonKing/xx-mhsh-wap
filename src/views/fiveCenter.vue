<template>
  <div class="fiveCenter">
    <van-nav-bar :fixed="true" :border="false" placeholder left-arrow>
      <template #title>
        <div class="title">
          五大中心
        </div>
      </template>
      <template #right>
        <div class="rightIcon">
          <i class="tf-icon tf-icon-fenxiang2"></i>
        </div>
      </template>
    </van-nav-bar>
    <div class="content">
      <img src="@/assets/imgs/专题页_02.jpg" alt="" />
      <img src="@/assets/imgs/专题页_03.jpg" alt="" />
      <div class="info">
        生活品质有多高，不仅与房子有关，<br />
        更与物业服务有关，<br />
        美好生活家园给业主呈现<br />
        <span class="text">教育、养老、创业、医疗、邻里</span>
        等功能区域，<br />
        搭配几十项免费服务，<br />
        满足业主全方面生活所需。
      </div>
      <div class="swiper">
        <img src="@/assets/imgs/专题页_04.jpg" alt="">
      </div>
      <div class="item1">
        <img src="@/assets/imgs/专题页_05.jpg" alt="">
        <img class="imgBtn" src="@/assets/imgs/业主使用@2x.png" alt="">
      </div>
      <div class="item2">
        <img src="@/assets/imgs/专题页_06.jpg" alt="">
        <img class="imgBtn" src="@/assets/imgs/前往体验@2x.png" alt="">
      </div>
      <div class="item3">
        <img src="@/assets/imgs/专题页_07.jpg" alt="">
        <img src="@/assets/imgs/专题页_08.jpg" alt="">
       <img class="imgBtn" src="@/assets/imgs/业主使用@2x.png" alt="">
      </div>
    </div>
    <div class="bottom">
     <img src="@/assets/imgs/专题页_09.jpg" alt="">
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { NavBar } from 'vant'
Vue.use(NavBar)
export default {}
</script>

<style lang="less" scoped>
.fiveCenter {
  position: relative;
  overflow: auto;
  height: 100%;
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
    .info {
      position: absolute;
      top: 1220px;
      width: 100%;
      text-align: center;
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 48px;
      // padding-bottom: 80px;
      background-color: #1a2b45;
      span{
        color: #FEBF00;
      }
    }
    .item1{
      position: relative;
      .imgBtn{
        width: 160px;
        height: 270px;
        position: absolute;
        right: 24px;
        bottom: 70px;
      }
    }
     .item2{
      position: relative;
      .imgBtn{
        width: 160px;
        height: 270px;
        position: absolute;
        right: 24px;
        bottom: 80px;
      }
    }
     .item3{
      position: relative;
      .imgBtn{
        width: 160px;
        height: 270px;
        position: absolute;
        right: 24px;
        bottom: 80px;
      }
    }
  }
  .bottom{
    img{
      width: 100%;
    }
  }
}
</style>
